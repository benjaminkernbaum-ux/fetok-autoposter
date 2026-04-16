/**
 * Cinematic Scheduler — produces + publishes one viral roteiro per week.
 *
 * Default: Sundays at 20:00 BRT (= 23:00 UTC), cycling through the
 * roteiros list in order. State is stored in output/cinematic_state.json
 * so the cycle survives restarts.
 *
 * Can be launched standalone or imported and started from src/index.js.
 */

require('dotenv').config();
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const { runRoteiro } = require('./cinematicPipeline');

const DATA_FILE = path.resolve(__dirname, '../data/roteiros.json');
const STATE_FILE = path.resolve(__dirname, '../output/cinematic_state.json');
const DEFAULT_CRON = process.env.CINEMATIC_CRON || '0 23 * * 0'; // Sun 23:00 UTC = Sun 20:00 BRT

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { index: 0, history: [] };
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { index: 0, history: [] };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function nextRoteiro() {
  const { roteiros } = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const state = loadState();
  const roteiro = roteiros[state.index % roteiros.length];
  state.index = (state.index + 1) % roteiros.length;
  saveState(state);
  return roteiro;
}

async function runWeekly() {
  const roteiro = nextRoteiro();
  console.log(`\n⏰ Cinematic weekly job → ${roteiro.id}`);
  try {
    const finalPath = await runRoteiro(roteiro.id, { publish: true });
    const state = loadState();
    state.history.push({
      timestamp: new Date().toISOString(),
      roteiro: roteiro.id,
      file: path.basename(finalPath),
    });
    saveState(state);
  } catch (err) {
    console.error(`❌ Weekly cinematic failed: ${err.message}`);
  }
}

function startCinematicScheduler() {
  console.log(`🎬 Cinematic scheduler armed (cron="${DEFAULT_CRON}" UTC)`);
  cron.schedule(DEFAULT_CRON, runWeekly, { timezone: 'UTC' });
}

if (require.main === module) {
  if (process.argv.includes('--now')) {
    runWeekly();
  } else {
    startCinematicScheduler();
    console.log('Waiting for next cron trigger...');
  }
}

module.exports = { startCinematicScheduler, runWeekly, nextRoteiro };
