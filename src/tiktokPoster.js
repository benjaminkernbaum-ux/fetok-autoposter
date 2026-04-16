/**
 * TikTok Content Posting API — direct upload (FILE_UPLOAD flow).
 *
 * Requires TikTok Business / Login Kit access token with scope:
 *   video.upload video.publish
 *
 * Flow:
 *   1. POST /v2/post/publish/video/init/  → returns upload_url + publish_id
 *   2. PUT the MP4 bytes to upload_url (single chunk if ≤ 64MB)
 *   3. POST /v2/post/publish/status/fetch/ → poll until PUBLISH_COMPLETE
 */

const axios = require('axios');
const fs = require('fs');

const TIKTOK_API = 'https://open.tiktokapis.com';
const MAX_TITLE_CHARS = 2200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

async function postToTikTok(videoPath, caption, options = {}) {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) throw new Error('TIKTOK_ACCESS_TOKEN not set');

  const stat = fs.statSync(videoPath);
  const videoSize = stat.size;

  console.log(`📤 TikTok init → ${videoPath} (${(videoSize / 1e6).toFixed(1)}MB)`);

  const { data: init } = await axios.post(
    `${TIKTOK_API}/v2/post/publish/video/init/`,
    {
      post_info: {
        title: truncate(caption, MAX_TITLE_CHARS),
        privacy_level: options.privacy || 'PUBLIC_TO_EVERYONE',
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: videoSize,
        chunk_size: videoSize,
        total_chunk_count: 1,
      },
    },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  const uploadUrl = init.data?.upload_url;
  const publishId = init.data?.publish_id;
  if (!uploadUrl || !publishId) throw new Error(`TikTok init failed: ${JSON.stringify(init)}`);

  const buffer = fs.readFileSync(videoPath);
  await axios.put(uploadUrl, buffer, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': videoSize,
      'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
    },
    maxBodyLength: Infinity,
  });

  console.log(`📤 TikTok uploaded, polling status...`);

  for (let i = 0; i < 40; i++) {
    await sleep(5000);
    const { data: status } = await axios.post(
      `${TIKTOK_API}/v2/post/publish/status/fetch/`,
      { publish_id: publishId },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    const st = status.data?.status;
    if (st === 'PUBLISH_COMPLETE') {
      const videoId = status.data?.publicaly_available_post_id?.[0] || status.data?.post_id;
      console.log(`✅ TikTok published: ${videoId || publishId}`);
      return { publishId, videoId, status: 'published' };
    }
    if (st === 'FAILED') {
      throw new Error(`TikTok publish failed: ${status.data?.fail_reason || 'unknown'}`);
    }
  }
  throw new Error(`TikTok timeout for publish_id=${publishId}`);
}

module.exports = { postToTikTok };
