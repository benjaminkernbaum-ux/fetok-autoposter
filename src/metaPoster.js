/**
 * Instagram Reels publishing via Meta Graph API.
 *
 * Requires a publicly reachable URL for the MP4 (Meta fetches it).
 * The caller can pass options.publicVideoUrl directly, or set
 * PUBLIC_BASE_URL so the module assumes the file is served under
 * `${PUBLIC_BASE_URL}/<basename>`.
 *
 * Flow:
 *   1. POST /{ig-user-id}/media (media_type=REELS, video_url=...)
 *   2. Poll GET /{creation-id}?fields=status_code until FINISHED
 *   3. POST /{ig-user-id}/media_publish (creation_id=...)
 */

const axios = require('axios');
const path = require('path');

const GRAPH = 'https://graph.facebook.com/v20.0';
const MAX_CAPTION = 2200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

async function postToInstagramReels(videoPath, caption, options = {}) {
  const token = process.env.META_ACCESS_TOKEN;
  const igId = process.env.IG_BUSINESS_ACCOUNT_ID;
  if (!token || !igId) throw new Error('META_ACCESS_TOKEN and IG_BUSINESS_ACCOUNT_ID required');

  const publicUrl =
    options.publicVideoUrl ||
    (process.env.PUBLIC_BASE_URL
      ? `${process.env.PUBLIC_BASE_URL.replace(/\/$/, '')}/${path.basename(videoPath)}`
      : null);

  if (!publicUrl) {
    throw new Error('No publicVideoUrl or PUBLIC_BASE_URL — Meta requires a public MP4 URL');
  }

  console.log(`📤 IG Reels → ${publicUrl}`);

  const { data: create } = await axios.post(`${GRAPH}/${igId}/media`, null, {
    params: {
      media_type: 'REELS',
      video_url: publicUrl,
      caption: truncate(caption, MAX_CAPTION),
      share_to_feed: options.shareToFeed !== false,
      access_token: token,
    },
  });

  const creationId = create.id;
  if (!creationId) throw new Error(`IG create failed: ${JSON.stringify(create)}`);

  for (let i = 0; i < 60; i++) {
    await sleep(5000);
    const { data: status } = await axios.get(`${GRAPH}/${creationId}`, {
      params: { fields: 'status_code,status', access_token: token },
    });
    if (status.status_code === 'FINISHED') break;
    if (status.status_code === 'ERROR') {
      throw new Error(`IG processing error: ${status.status || creationId}`);
    }
  }

  const { data: publish } = await axios.post(`${GRAPH}/${igId}/media_publish`, null, {
    params: { creation_id: creationId, access_token: token },
  });

  console.log(`✅ IG Reels published: ${publish.id}`);
  return { creationId, mediaId: publish.id, status: 'published' };
}

module.exports = { postToInstagramReels };
