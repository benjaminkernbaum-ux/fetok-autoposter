/**
 * Higgsfield DoP (Image-to-Video) Generator
 *
 * Pipeline:
 *   1. Generate keyframe with Midjourney (or use existing image)
 *   2. Upload image to Higgsfield
 *   3. Submit job with DoP motion preset
 *   4. Poll until complete
 *   5. Download resulting MP4 shot
 *
 * Environment:
 *   HIGGSFIELD_API_KEY
 *   MIDJOURNEY_API_KEY (optional, for auto-keyframe generation)
 *   MIDJOURNEY_ENDPOINT (default: https://api.imagineapi.dev/items/images/)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { buildMjPrompt } = require('./mjStyleRef');
const { getSoulId } = require('./higgsfieldSoulId');
const { validateFace } = require('./soulIdValidator');

const HIGGSFIELD_API = process.env.HIGGSFIELD_ENDPOINT || 'https://api.higgsfield.ai/v1';
const MJ_API = process.env.MIDJOURNEY_ENDPOINT || 'https://api.imagineapi.dev/items/images/';

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const SHOTS_DIR = path.join(OUTPUT_DIR, 'shots');
const KEYFRAMES_DIR = path.join(OUTPUT_DIR, 'keyframes');

if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });
if (!fs.existsSync(KEYFRAMES_DIR)) fs.mkdirSync(KEYFRAMES_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Generate a keyframe via Midjourney API (ImagineAPI wrapper)
 * Returns the local path to the downloaded PNG.
 *
 * @param {string} prompt       - Base scene description (shot.prompt_mj).
 * @param {string} styleTokens  - Global style tokens from roteiros.json.
 * @param {string} filename     - Output filename under output/keyframes/.
 * @param {string} [characterId] - Soul ID key; injects --cref/--sref.
 */
async function generateKeyframe(prompt, styleTokens, filename, characterId) {
  const mjKey = process.env.MIDJOURNEY_API_KEY;
  if (!mjKey) throw new Error('MIDJOURNEY_API_KEY not set');

  const outputPath = path.join(KEYFRAMES_DIR, filename);
  if (fs.existsSync(outputPath)) {
    console.log(`🎨 Keyframe cached: ${filename}`);
    return outputPath;
  }

  const fullPrompt = buildMjPrompt({ prompt, characterId, globalStyle: styleTokens });
  console.log(`🎨 MJ → ${filename}${characterId ? ` [soul:${characterId}]` : ''}`);

  const { data: submit } = await axios.post(
    MJ_API,
    { prompt: fullPrompt },
    { headers: { Authorization: `Bearer ${mjKey}`, 'Content-Type': 'application/json' } }
  );

  const jobId = submit.data?.id || submit.id;
  if (!jobId) throw new Error(`MJ submit failed: ${JSON.stringify(submit)}`);

  for (let i = 0; i < 60; i++) {
    await sleep(5000);
    const { data: poll } = await axios.get(`${MJ_API}${jobId}`, {
      headers: { Authorization: `Bearer ${mjKey}` },
    });
    const status = poll.data?.status || poll.status;
    const url = poll.data?.upscaled_urls?.[0] || poll.data?.url || poll.url;
    if (status === 'completed' && url) {
      const { data: buffer } = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(outputPath, buffer);
      console.log(`🎨 Keyframe ready: ${filename}`);
      return outputPath;
    }
    if (status === 'failed') throw new Error(`MJ failed: ${jobId}`);
  }
  throw new Error(`MJ timeout: ${jobId}`);
}

/**
 * Animate a keyframe with Higgsfield DoP I2V.
 * Returns the local path to the downloaded MP4 shot.
 */
async function animateShot(imagePath, shot, filename) {
  const hfKey = process.env.HIGGSFIELD_API_KEY;
  if (!hfKey) throw new Error('HIGGSFIELD_API_KEY not set');

  const outputPath = path.join(SHOTS_DIR, filename);
  if (fs.existsSync(outputPath)) {
    console.log(`🎬 Shot cached: ${filename}`);
    return outputPath;
  }

  const soulId = shot.character_id ? getSoulId(shot.character_id) : null;
  console.log(
    `🎬 HF → ${filename} [${shot.higgsfield_preset} / ${shot.higgsfield_mode}${soulId ? ` / soul:${shot.character_id}` : ''}]`
  );

  const imageBase64 = fs.readFileSync(imagePath).toString('base64');

  const body = {
    image_base64: imageBase64,
    motion_preset: shot.higgsfield_preset,
    mode: shot.higgsfield_mode || 'standard',
    duration: 5,
    aspect_ratio: '9:16',
    motion_strength: shot.motion_strength ?? 0.75,
  };
  if (soulId) body.soul_id = soulId;

  const { data: submit } = await axios.post(`${HIGGSFIELD_API}/dop/generate`, body, {
    headers: { Authorization: `Bearer ${hfKey}`, 'Content-Type': 'application/json' },
    timeout: 60000,
  });

  const jobId = submit.job_id || submit.id;
  if (!jobId) throw new Error(`HF submit failed: ${JSON.stringify(submit)}`);

  for (let i = 0; i < 80; i++) {
    await sleep(5000);
    const { data: poll } = await axios.get(`${HIGGSFIELD_API}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${hfKey}` },
    });
    if (poll.status === 'completed' && poll.video_url) {
      const { data: buffer } = await axios.get(poll.video_url, { responseType: 'arraybuffer' });
      fs.writeFileSync(outputPath, buffer);
      console.log(`🎬 Shot ready: ${filename}`);
      return outputPath;
    }
    if (poll.status === 'failed') throw new Error(`HF failed: ${poll.error || jobId}`);
  }
  throw new Error(`HF timeout: ${jobId}`);
}

/**
 * Full pipeline for one shot: keyframe → validate → animate.
 * Passes character_id through so Soul ID is honored at both steps.
 */
async function generateShot(roteiro, shot, styleTokens) {
  const baseName = `${roteiro.id}_shot_${String(shot.ordem).padStart(2, '0')}`;
  const keyframePath = await generateKeyframe(
    shot.prompt_mj,
    styleTokens,
    `${baseName}.png`,
    shot.character_id
  );

  // Optional face-similarity check (no-op without REPLICATE_API_TOKEN).
  let validation = null;
  if (shot.character_id) {
    validation = await validateFace(keyframePath, shot.character_id);
  }

  const shotPath = await animateShot(keyframePath, shot, `${baseName}.mp4`);
  return { keyframePath, shotPath, duracao: shot.duracao, validation };
}

module.exports = { generateKeyframe, animateShot, generateShot };
