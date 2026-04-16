/**
 * Unified publisher: publishes a final MP4 + caption to all configured
 * platforms (TikTok, Instagram Reels) and returns a combined report.
 *
 * Silently skips platforms whose credentials are not set.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const { postToTikTok } = require('./tiktokPoster');
const { postToInstagramReels } = require('./metaPoster');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const PUBLISH_HISTORY = path.join(OUTPUT_DIR, 'publish_history.json');

function loadHistory() {
  if (!fs.existsSync(PUBLISH_HISTORY)) return [];
  try {
    return JSON.parse(fs.readFileSync(PUBLISH_HISTORY, 'utf8'));
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  fs.writeFileSync(PUBLISH_HISTORY, JSON.stringify(entries, null, 2));
}

async function notifyWebhook(report) {
  const url = process.env.WEBHOOK_URL;
  if (!url) return;
  const lines = [
    `🎬 **FéTok Cinematic — ${report.roteiro_id}**`,
    `📁 ${report.videoFile}`,
    ...report.results.map((r) =>
      r.ok ? `✅ ${r.platform}: ${r.mediaId || r.videoId || 'ok'}` : `❌ ${r.platform}: ${r.error}`
    ),
  ];
  try {
    await axios.post(url, { content: lines.join('\n') });
  } catch {
    /* webhook errors are non-fatal */
  }
}

async function publishFinal(videoPath, caption, context = {}) {
  const results = [];

  if (process.env.TIKTOK_ACCESS_TOKEN) {
    try {
      const r = await postToTikTok(videoPath, caption);
      results.push({ platform: 'tiktok', ok: true, ...r });
    } catch (err) {
      results.push({ platform: 'tiktok', ok: false, error: err.message });
    }
  } else {
    results.push({ platform: 'tiktok', ok: false, skipped: true, error: 'no token' });
  }

  if (process.env.META_ACCESS_TOKEN && process.env.IG_BUSINESS_ACCOUNT_ID) {
    try {
      const r = await postToInstagramReels(videoPath, caption, {
        publicVideoUrl: context.publicVideoUrl,
      });
      results.push({ platform: 'instagram', ok: true, ...r });
    } catch (err) {
      results.push({ platform: 'instagram', ok: false, error: err.message });
    }
  } else {
    results.push({ platform: 'instagram', ok: false, skipped: true, error: 'no token' });
  }

  const report = {
    timestamp: new Date().toISOString(),
    roteiro_id: context.roteiro_id || null,
    videoFile: path.basename(videoPath),
    results,
  };

  const hist = loadHistory();
  hist.push(report);
  saveHistory(hist);

  await notifyWebhook(report);
  return report;
}

module.exports = { publishFinal };
