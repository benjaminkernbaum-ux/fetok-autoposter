/**
 * FéTok Auto-Poster — Main Entry Point
 * Runs on Railway 24/7
 * 
 * Features:
 * - Cron scheduler (3x/day at 6h, 12h, 20h BRT)
 * - Auto-generates verse images + videos
 * - Dashboard to monitor schedule
 * - TikTok API posting (when token configured)
 * - Webhook notifications
 */

require('dotenv').config();
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const { getNextVerse, markPosted, getStats, getAllVerses } = require('./verses');
const { generateImage } = require('./imageGenerator');
const { generateVideo } = require('./videoGenerator');
const { buildCaption } = require('./captionBuilder');
const { startDashboard } = require('./dashboard');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const HISTORY_FILE = path.join(OUTPUT_DIR, 'history.json');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Load post history
let history = [];
if (fs.existsSync(HISTORY_FILE)) {
  try { history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch (e) {}
}

function saveHistory() {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

/**
 * Main post pipeline — generate + optionally publish
 */
async function createPost(slot) {
  const themeMap = {
    morning: ['fidelidade', 'renovação', 'confiança', 'gratidão'],
    afternoon: ['promessa', 'confiança', 'renovação', 'fidelidade'],
    evening: ['libertação', 'gratidão', 'eternidade', 'promessa'],
  };

  const themes = themeMap[slot] || themeMap.morning;
  let verse = null;

  // Try to find a verse matching the slot's themes
  for (const theme of themes) {
    verse = getNextVerse(theme);
    if (verse) break;
  }
  if (!verse) verse = getNextVerse(); // fallback: any unposted verse

  if (!verse) {
    console.log('⚠️  No more verses available!');
    return null;
  }

  const timestamp = new Date().toISOString();
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📤 NEW POST — ${slot.toUpperCase()}`);
  console.log(`📖 ${verse.ref}: "${verse.text.substring(0, 50)}..."`);
  console.log(`🕐 ${timestamp}`);

  try {
    // 1. Generate image
    const imagePath = await generateImage(verse);
    console.log(`🎨 Image: ✅`);

    // 2. Generate video
    const videoPath = await generateVideo(imagePath, verse);
    console.log(`🎬 Video: ✅`);

    // 3. Build caption
    const caption = buildCaption(verse);
    const captionFile = videoPath.replace('.mp4', '_caption.txt');
    fs.writeFileSync(captionFile, caption);
    console.log(`📝 Caption: ✅`);

    // 4. Try TikTok API posting (if configured)
    let posted = false;
    if (process.env.TIKTOK_ACCESS_TOKEN) {
      try {
        // const { postToTikTok } = require('./tiktokPoster');
        // await postToTikTok(videoPath, caption);
        // posted = true;
        console.log(`📤 TikTok API: ⏳ (not yet configured)`);
      } catch (err) {
        console.log(`📤 TikTok API: ❌ ${err.message}`);
      }
    } else {
      console.log(`📤 TikTok API: ⏸️  (no token — manual upload needed)`);
    }

    // 5. Send webhook notification
    if (process.env.WEBHOOK_URL) {
      try {
        const axios = require('axios');
        await axios.post(process.env.WEBHOOK_URL, {
          content: `🙏 **FéTok — Novo Post Pronto!**\n📖 ${verse.ref}\n⏰ ${slot}\n📝 ${caption.split('\n')[0]}\n${posted ? '✅ Publicado automaticamente!' : '⚠️ Upload manual necessário'}`,
        });
        console.log(`🔔 Webhook: ✅`);
      } catch (e) {
        console.log(`🔔 Webhook: ❌`);
      }
    }

    // 6. Save to history
    const entry = {
      timestamp,
      slot,
      verse: verse.ref,
      text: verse.text,
      theme: verse.theme,
      videoFile: path.basename(videoPath),
      caption: caption.split('\n')[0],
      posted,
    };
    history.push(entry);
    saveHistory();
    markPosted(verse.ref);

    console.log(`✅ Post ready!`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    return entry;
  } catch (err) {
    console.error(`❌ Post failed: ${err.message}`);
    return null;
  }
}

/**
 * Start the scheduler
 */
function startScheduler() {
  console.log(`\n🚀 FéTok Auto-Poster Started!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Verses: ${getStats().total} total, ${getStats().remaining} remaining`);
  console.log(`⏰ Schedule: 06:00, 12:00, 20:00 (BRT / UTC-3)\n`);

  // Schedule: 06:00 BRT = 09:00 UTC
  cron.schedule('0 9 * * *', () => {
    console.log('⏰ CRON: Morning post (06:00 BRT)');
    createPost('morning');
  }, { timezone: 'UTC' });

  // Schedule: 12:00 BRT = 15:00 UTC
  cron.schedule('0 15 * * *', () => {
    console.log('⏰ CRON: Afternoon post (12:00 BRT)');
    createPost('afternoon');
  }, { timezone: 'UTC' });

  // Schedule: 20:00 BRT = 23:00 UTC
  cron.schedule('0 23 * * *', () => {
    console.log('⏰ CRON: Evening post (20:00 BRT)');
    createPost('evening');
  }, { timezone: 'UTC' });

  console.log(`✅ Cron jobs scheduled. Waiting for next trigger...\n`);
}

// Export for dashboard use
module.exports = { createPost, history, getStats };

// Start everything
startDashboard();
startScheduler();

// Auto-generate all cinematic videos on startup (3s delay)
setTimeout(() => {
  // Rebuild font cache first (for SVG text rendering)
  try {
    const { execSync } = require('child_process');
    execSync('fc-cache -f 2>/dev/null || true', { stdio: 'pipe' });
    console.log('✅ Font cache rebuilt');
  } catch(e) { console.log('⚠️ fc-cache not available (OK on Windows)'); }

  console.log('\n🎬 Auto-generating cinematic Serie 5 videos...');
  const { spawn } = require('child_process');
  const child = spawn('node', [path.join(__dirname, 'batchSerie3.js'), '--force'], { cwd: __dirname });
  child.stdout.on('data', d => process.stdout.write(d));
  child.stderr.on('data', d => process.stderr.write(d));
  child.on('close', c => console.log(`\n🏁 Video generation finished (exit: ${c})`));
}, 3000);
