/**
 * Cinematic Pipeline Orchestrator
 *
 * Turns a roteiro (from data/roteiros.json) into a finished 9:16 MP4:
 *   1. Midjourney → keyframes (per shot)
 *   2. Higgsfield DoP → animate each keyframe
 *   3. ElevenLabs → narration
 *   4. FFmpeg → concat + overlay + mux audio
 *   5. Write caption + hashtags sidecar
 *
 * Usage:
 *   node src/cinematicPipeline.js pescador
 *   node src/cinematicPipeline.js ovelha
 *   node src/cinematicPipeline.js ossos
 *   node src/cinematicPipeline.js all
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { generateShot } = require('./higgsfieldGenerator');
const { generateNarration } = require('./narrationGenerator');
const { concatCinematic } = require('./videoConcat');

const DATA_FILE = path.resolve(__dirname, '../data/roteiros.json');
const OUTPUT_DIR = path.resolve(__dirname, '../output');
const FINAL_DIR = path.join(OUTPUT_DIR, 'final');

if (!fs.existsSync(FINAL_DIR)) fs.mkdirSync(FINAL_DIR, { recursive: true });

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeCaption(roteiro, finalPath) {
  const captionPath = finalPath.replace('.mp4', '_caption.txt');
  const body = `${roteiro.legenda}\n\n${roteiro.hashtags}`;
  fs.writeFileSync(captionPath, body);
  console.log(`📝 Caption: ${path.basename(captionPath)}`);
}

async function runRoteiro(roteiroId) {
  const data = loadData();
  const roteiro = data.roteiros.find((r) => r.id === roteiroId);
  if (!roteiro) throw new Error(`Roteiro not found: ${roteiroId}`);

  const voiceCfg = data.voices.pt_br_masculino_grave;
  const styleTokens = data.style_tokens;

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎬 ROTEIRO: ${roteiro.nome}`);
  console.log(`📖 ${roteiro.versiculo_ref}`);
  console.log(`⏱️  ${roteiro.duracao_total}s · ${roteiro.shots.length} shots`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // 1+2. Keyframes + Higgsfield animation (sequential to respect rate limits)
  const generated = [];
  for (const shot of roteiro.shots) {
    const { shotPath } = await generateShot(roteiro, shot, styleTokens);
    generated.push({
      shotPath,
      duracao: shot.duracao,
      overlay_text: shot.overlay_text,
    });
  }

  // 3. Narration
  const narrationPath = await generateNarration(
    roteiro.narracao,
    voiceCfg,
    `${roteiro.id}_narration.mp3`
  );

  // 4. Final concat
  const finalPath = await concatCinematic(
    generated,
    narrationPath,
    `${roteiro.id}_final.mp4`
  );

  // 5. Sidecar caption
  writeCaption(roteiro, finalPath);

  console.log(`\n✅ Done: ${finalPath}\n`);
  return finalPath;
}

async function main() {
  const target = process.argv[2] || 'pescador';

  try {
    if (target === 'all') {
      const data = loadData();
      for (const r of data.roteiros) await runRoteiro(r.id);
    } else {
      await runRoteiro(target);
    }
  } catch (err) {
    console.error(`\n❌ Pipeline failed: ${err.message}`);
    if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = { runRoteiro };
