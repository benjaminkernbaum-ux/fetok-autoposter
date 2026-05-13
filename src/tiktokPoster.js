/**
 * FéTok — TikTok Content Posting API Client
 * 
 * Posts videos to TikTok using the official Content Posting API v2.
 * Uses PULL_FROM_URL strategy — TikTok fetches videos from Railway's public URLs.
 * 
 * Flow:
 *   1. Get valid token (auto-refresh if needed)
 *   2. Query creator info (privacy levels, etc.)
 *   3. Init post with PULL_FROM_URL
 *   4. Poll until published or failed
 *   5. Return result with publish_id
 * 
 * Required env vars:
 *   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET,
 *   TIKTOK_ACCESS_TOKEN, TIKTOK_REFRESH_TOKEN,
 *   PUBLIC_BASE_URL (Railway app URL)
 */

const axios = require('axios');
const { getValidToken } = require('./tiktokAuth');

const API_BASE = 'https://open.tiktokapis.com/v2';

// Polling config
const POLL_INTERVAL_MS = 5000;      // Check every 5 seconds
const POLL_MAX_ATTEMPTS = 60;       // Max 5 minutes (60 × 5s)
const MAX_TITLE_LENGTH = 150;       // TikTok title limit

/**
 * Query the creator's available posting settings
 */
async function queryCreatorInfo(accessToken) {
  try {
    const response = await axios.post(
      `${API_BASE}/post/publish/creator_info/query/`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data.data;
    console.log(`   Creator privacy options: ${JSON.stringify(data.privacy_level_options || [])}`);
    console.log(`   Comments enabled: ${!data.comment_disabled}`);
    console.log(`   Duet enabled: ${!data.duet_disabled}`);
    console.log(`   Stitch enabled: ${!data.stitch_disabled}`);

    return data;
  } catch (err) {
    const errData = err.response?.data;
    console.warn(`⚠️  Creator info query failed: ${JSON.stringify(errData || err.message)}`);
    // Return defaults — don't block posting
    return {
      privacy_level_options: ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'],
      comment_disabled: false,
      duet_disabled: false,
      stitch_disabled: false,
    };
  }
}

/**
 * Truncate and clean caption for TikTok title field
 */
function buildTitle(caption, verse) {
  // Use the verse reference + first line of caption
  const firstLine = caption.split('\n')[0] || '';
  let title = firstLine.length > MAX_TITLE_LENGTH
    ? firstLine.substring(0, MAX_TITLE_LENGTH - 3) + '...'
    : firstLine;

  // Fallback
  if (!title) title = `✝️ ${verse.ref} — FéTok`;

  return title;
}

/**
 * Initialize a video post using PULL_FROM_URL
 */
async function initVideoPost(accessToken, videoUrl, caption, verse, creatorInfo) {
  const title = buildTitle(caption, verse);

  // Determine best privacy level
  // NOTE: Sandbox/unaudited apps MUST use SELF_ONLY — TikTok returns 403 otherwise
  const privacyOptions = creatorInfo.privacy_level_options || [];
  const isSandbox = process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_KEY.startsWith('sb');
  let privacyLevel = isSandbox ? 'SELF_ONLY' : 'PUBLIC_TO_EVERYONE';
  if (!isSandbox && !privacyOptions.includes('PUBLIC_TO_EVERYONE')) {
    privacyLevel = privacyOptions.includes('SELF_ONLY') ? 'SELF_ONLY' : privacyOptions[0] || 'SELF_ONLY';
    console.log(`⚠️  Public posting not available. Using: ${privacyLevel}`);
  }
  if (isSandbox) {
    console.log(`   🧪 Sandbox mode detected — using SELF_ONLY privacy`);
  }

  const payload = {
    post_info: {
      title: title,
      description: caption,
      privacy_level: privacyLevel,
      disable_comment: false,
      disable_duet: creatorInfo.duet_disabled || false,
      disable_stitch: creatorInfo.stitch_disabled || false,
      video_cover_timestamp_ms: 1000,
      brand_content_toggle: false,
      brand_organic_toggle: false,
      is_ai_generated: true,  // Required: our videos are AI-generated
    },
    source_info: {
      source: 'PULL_FROM_URL',
      video_url: videoUrl,
    },
  };

  console.log(`   Title: "${title}"`);
  console.log(`   Privacy: ${privacyLevel}`);
  console.log(`   Video URL: ${videoUrl}`);
  console.log(`   AI Generated: ✅ (disclosed)`);

  const response = await axios.post(
    `${API_BASE}/post/publish/video/init/`,
    payload,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }
  );

  const data = response.data.data;

  if (response.data.error?.code) {
    throw new Error(`TikTok init failed: ${response.data.error.code} — ${response.data.error.message}`);
  }

  return {
    publishId: data.publish_id,
  };
}

/**
 * Poll the publish status until complete or failed
 */
async function pollPublishStatus(accessToken, publishId) {
  console.log(`   Polling status (publish_id: ${publishId})...`);

  for (let attempt = 1; attempt <= POLL_MAX_ATTEMPTS; attempt++) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

    try {
      const response = await axios.post(
        `${API_BASE}/post/publish/status/fetch/`,
        { publish_id: publishId },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data.data;
      const status = data.status;

      if (status === 'PUBLISH_COMPLETE') {
        console.log(`   ✅ Published! (attempt ${attempt})`);
        return {
          success: true,
          status,
          publishId,
        };
      }

      if (status === 'FAILED' || status === 'PUBLISH_FAILED') {
        const failReason = data.fail_reason || 'Unknown';
        console.log(`   ❌ Publish failed: ${failReason}`);
        return {
          success: false,
          status,
          publishId,
          error: failReason,
        };
      }

      // Still processing
      if (attempt % 6 === 0) {
        // Log every 30 seconds
        console.log(`   ⏳ Still processing... (${attempt * 5}s elapsed, status: ${status})`);
      }

    } catch (err) {
      // Transient error — keep polling
      if (attempt % 6 === 0) {
        console.log(`   ⚠️  Poll error (will retry): ${err.message}`);
      }
    }
  }

  // Timeout
  console.log(`   ⏰ Polling timeout after ${POLL_MAX_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`);
  return {
    success: false,
    status: 'TIMEOUT',
    publishId,
    error: 'Polling timeout — video may still be processing on TikTok',
  };
}

/**
 * Main entry: Post a video to TikTok
 * 
 * @param {string} videoUrl  — Publicly accessible video URL (Railway)
 * @param {string} caption   — Full caption with hashtags
 * @param {object} verse     — Verse object { ref, text, theme }
 * @returns {object}         — { success, publishId, status, error? }
 */
async function postToTikTok(videoUrl, caption, verse) {
  console.log(`\n📤 TikTok Posting Pipeline`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // 1. Get valid token
  const tokens = await getValidToken();
  const accessToken = tokens.access_token;

  // 2. Query creator info
  console.log('\n🔍 Querying creator info...');
  const creatorInfo = await queryCreatorInfo(accessToken);

  // 3. Init video post
  console.log('\n🚀 Initializing post...');
  const { publishId } = await initVideoPost(accessToken, videoUrl, caption, verse, creatorInfo);
  console.log(`   Publish ID: ${publishId}`);

  // 4. Poll until done
  console.log('\n⏳ Waiting for publish...');
  const result = await pollPublishStatus(accessToken, publishId);

  // 5. Log result
  console.log(`\n${result.success ? '✅' : '❌'} TikTok Post Result:`);
  console.log(`   Status: ${result.status}`);
  console.log(`   Publish ID: ${result.publishId}`);
  if (result.error) console.log(`   Error: ${result.error}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  return result;
}

/**
 * Dry-run: Test the API connection without actually posting
 */
async function dryRun() {
  console.log('\n🧪 TikTok Poster — Dry Run');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Check token
    console.log('1. Checking token...');
    const tokens = await getValidToken();
    console.log(`   ✅ Token valid — Open ID: ${tokens.open_id || '(not set)'}\n`);

    // 2. Query creator info
    console.log('2. Querying creator info...');
    const creatorInfo = await queryCreatorInfo(tokens.access_token);
    console.log(`   ✅ Creator info retrieved\n`);

    // 3. Test video URL accessibility
    const testUrl = `${process.env.PUBLIC_BASE_URL || 'https://web-production-0662.up.railway.app'}/download/video_josue_1_5.mp4`;
    console.log(`3. Testing video URL accessibility...`);
    console.log(`   URL: ${testUrl}`);
    try {
      const head = await axios.head(testUrl, { timeout: 10000 });
      const sizeKB = Math.round((head.headers['content-length'] || 0) / 1024);
      console.log(`   ✅ Accessible — ${sizeKB} KB, ${head.headers['content-type']}\n`);
    } catch (e) {
      console.log(`   ⚠️  URL not accessible: ${e.message}`);
      console.log(`   (Videos may not be generated yet)\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Dry run complete — all systems operational');
    console.log('   Run without --dry-run to actually post.\n');

  } catch (err) {
    console.error(`\n❌ Dry run failed: ${err.message}`);
    console.error('   Fix the above issue before attempting to post.\n');
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  require('dotenv').config();

  if (process.argv.includes('--dry-run')) {
    dryRun();
  } else {
    // Quick test post
    const testVerse = { ref: 'Josué 1:5', text: 'Ninguém te poderá resistir...', theme: 'fidelidade' };
    const testCaption = '🔑✝️ Josué 1:5 — O MESMO Deus que abriu o Mar Vermelho está com VOCÊ agora! #fetok #fyp #viral';
    const testUrl = `${process.env.PUBLIC_BASE_URL || 'https://web-production-0662.up.railway.app'}/download/video_josue_1_5.mp4`;
    postToTikTok(testUrl, testCaption, testVerse)
      .then(r => console.log('Result:', JSON.stringify(r, null, 2)))
      .catch(e => console.error('Error:', e.message));
  }
}

module.exports = { postToTikTok };
