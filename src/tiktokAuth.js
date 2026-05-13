/**
 * FéTok — TikTok OAuth Token Manager
 * 
 * Handles automatic token refresh for TikTok Content Posting API.
 * TikTok access tokens expire every 24 hours — this module:
 * 1. Checks if current token is still valid
 * 2. Auto-refreshes using refresh_token when expired
 * 3. Persists tokens to disk (survives Railway restarts)
 * 
 * Required env vars:
 *   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET,
 *   TIKTOK_ACCESS_TOKEN (initial), TIKTOK_REFRESH_TOKEN (initial)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TOKEN_FILE = path.resolve(__dirname, '../output/tiktok_tokens.json');
const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';

// Buffer: refresh 10 minutes before actual expiry
const EXPIRY_BUFFER_MS = 10 * 60 * 1000;

/**
 * Load persisted tokens from disk, falling back to env vars
 */
function loadTokens() {
  // Try disk first (most recent tokens)
  if (fs.existsSync(TOKEN_FILE)) {
    try {
      const stored = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
      if (stored.access_token && stored.refresh_token) {
        return stored;
      }
    } catch (e) {
      console.log('⚠️  Could not parse stored tokens, using env vars');
    }
  }

  // Fallback to env vars (initial bootstrap)
  return {
    access_token: process.env.TIKTOK_ACCESS_TOKEN || '',
    refresh_token: process.env.TIKTOK_REFRESH_TOKEN || '',
    open_id: process.env.TIKTOK_OPEN_ID || '',
    expires_at: 0, // Force refresh on first use
  };
}

/**
 * Persist tokens to disk
 */
function saveTokens(tokens) {
  const dir = path.dirname(TOKEN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(refreshToken) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

  if (!clientKey || !clientSecret) {
    throw new Error('Missing TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET in env');
  }

  console.log('🔄 Refreshing TikTok access token...');

  try {
    const response = await axios.post(TIKTOK_TOKEN_URL, new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = response.data;

    if (data.error) {
      throw new Error(`TikTok token refresh failed: ${data.error} — ${data.error_description || ''}`);
    }

    const tokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token, // TikTok rotates refresh tokens
      open_id: data.open_id || '',
      scope: data.scope || '',
      expires_in: data.expires_in || 86400,
      expires_at: Date.now() + (data.expires_in || 86400) * 1000,
      refreshed_at: new Date().toISOString(),
    };

    saveTokens(tokens);
    console.log(`✅ Token refreshed — expires in ${Math.round(tokens.expires_in / 3600)}h`);
    return tokens;

  } catch (err) {
    if (err.response) {
      throw new Error(`Token refresh HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

/**
 * Get a valid access token — auto-refreshes if expired
 * This is the main function callers should use.
 */
async function getValidToken() {
  const tokens = loadTokens();

  // Check if token is still valid (with buffer)
  if (tokens.access_token && tokens.expires_at && Date.now() < (tokens.expires_at - EXPIRY_BUFFER_MS)) {
    const remainingMin = Math.round((tokens.expires_at - Date.now()) / 60000);
    console.log(`🔑 TikTok token valid (${remainingMin} min remaining)`);
    return tokens;
  }

  // Token expired or no expiry info — refresh
  if (!tokens.refresh_token) {
    throw new Error(
      'No refresh_token available. Run the OAuth bootstrap flow first:\n' +
      '  node src/tiktokAuth.js --bootstrap'
    );
  }

  return await refreshAccessToken(tokens.refresh_token);
}

/**
 * Bootstrap: Exchange authorization code for initial tokens
 * Used once during setup — called via CLI or bootstrap page
 */
async function exchangeCodeForTokens(authCode, redirectUri, codeVerifier) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

  console.log('🔐 Exchanging auth code for tokens...');

  const params = {
    client_key: clientKey,
    client_secret: clientSecret,
    code: authCode,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  };

  // Include PKCE code_verifier if provided
  if (codeVerifier) {
    params.code_verifier = codeVerifier;
  }

  const response = await axios.post(TIKTOK_TOKEN_URL, new URLSearchParams(params).toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const data = response.data;

  if (data.error) {
    throw new Error(`Code exchange failed: ${data.error} — ${data.error_description || ''}`);
  }

  const tokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    open_id: data.open_id || '',
    scope: data.scope || '',
    expires_in: data.expires_in || 86400,
    expires_at: Date.now() + (data.expires_in || 86400) * 1000,
    refreshed_at: new Date().toISOString(),
  };

  saveTokens(tokens);
  console.log('✅ Initial tokens saved!');
  console.log(`   Open ID: ${tokens.open_id}`);
  console.log(`   Scopes: ${tokens.scope}`);
  console.log(`   Expires in: ${Math.round(tokens.expires_in / 3600)}h`);

  return tokens;
}

/**
 * CLI: Bootstrap flow — Railway redirect + manual code paste
 * TikTok sandbox rejects localhost/127.0.0.1 in redirect URIs,
 * so we use the Railway production URL and ask user to paste the code.
 */
async function runBootstrap() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  if (!clientKey) {
    console.error('❌ Set TIKTOK_CLIENT_KEY in .env first');
    process.exit(1);
  }

  const crypto = require('crypto');
  const readline = require('readline');

  // TikTok sandbox rejects localhost — use Railway redirect
  const REDIRECT_URI = process.env.PUBLIC_BASE_URL
    ? `${process.env.PUBLIC_BASE_URL}/callback`
    : 'https://web-production-0662.up.railway.app/callback';

  // Generate PKCE pair (required by TikTok API v2)
  const codeVerifier = crypto.randomBytes(32)
    .toString('base64url')
    .replace(/[^a-zA-Z0-9._~-]/g, '')
    .substring(0, 128);
  const codeChallenge = crypto.createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // Build TikTok auth URL with PKCE
  const authUrl = 'https://www.tiktok.com/v2/auth/authorize/?' + new URLSearchParams({
    client_key: clientKey,
    response_type: 'code',
    scope: 'video.publish,video.upload,user.info.basic',
    redirect_uri: REDIRECT_URI,
    state: 'fetok_bootstrap_' + Date.now(),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  }).toString();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 FéTok — TikTok OAuth Bootstrap (PKCE)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('1. Open this URL in your browser:\n');
  console.log(`   ${authUrl}\n`);
  console.log('2. Log in to TikTok and authorize the app');
  console.log('3. After redirect, copy the FULL URL from your browser address bar');
  console.log(`   (It will start with: ${REDIRECT_URI}?code=...)\n`);

  // Try to open browser automatically
  try {
    const { exec } = require('child_process');
    exec(`start "" "${authUrl}"`);
    console.log('   📱 Browser opened automatically\n');
  } catch (e) { /* silent */ }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question('Paste the callback URL or auth code here: ', async (input) => {
    rl.close();
    let code = input.trim();

    // Extract code from full URL if user pasted the whole thing
    if (code.includes('code=')) {
      try {
        const url = new URL(code.startsWith('http') ? code : `https://x.com/callback?${code}`);
        code = url.searchParams.get('code');
      } catch (e) {
        // Try regex extraction as fallback
        const match = code.match(/code=([^&]+)/);
        if (match) code = match[1];
      }
    }

    if (!code) {
      console.error('❌ No auth code found. Please try again.');
      process.exit(1);
    }

    console.log(`\n🔑 Auth code: ${code.substring(0, 20)}...`);

    try {
      const tokens = await exchangeCodeForTokens(code, REDIRECT_URI, codeVerifier);
      console.log('\n✅ Bootstrap complete! Tokens saved to output/tiktok_tokens.json');
      console.log(`   Open ID: ${tokens.open_id}`);
      console.log(`   Scopes: ${tokens.scope}`);
      console.log(`   Expires in: ${Math.round(tokens.expires_in / 3600)}h`);
      console.log('\n🎬 Ready! Publish with: node src/cinematicPipeline.js --serie=6 --roteiro=cego --publish');
    } catch (err) {
      console.error(`\n❌ Token exchange failed: ${err.message}`);
      process.exit(1);
    }
  });
}

// CLI entry point
if (require.main === module) {
  require('dotenv').config();

  if (process.argv.includes('--bootstrap')) {
    runBootstrap();
  } else if (process.argv.includes('--check')) {
    getValidToken()
      .then(t => {
        console.log(`\n✅ Token OK — Open ID: ${t.open_id}`);
        console.log(`   Expires: ${new Date(t.expires_at).toISOString()}`);
      })
      .catch(err => console.error(`\n❌ ${err.message}`));
  } else {
    console.log('Usage:');
    console.log('  node src/tiktokAuth.js --bootstrap   # First-time OAuth login');
    console.log('  node src/tiktokAuth.js --check       # Verify token status');
  }
}

module.exports = { getValidToken, exchangeCodeForTokens, refreshAccessToken };
