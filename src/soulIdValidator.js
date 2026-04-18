/**
 * Face similarity validator (optional).
 *
 * Computes a cosine similarity between a generated keyframe and the
 * character's reference anchor. If score < threshold, caller can
 * regenerate with a stronger --cw / --sw or bail out.
 *
 * Backend is Replicate (model configured in data/soul_registry.json
 * defaults.replicate_face_model). If REPLICATE_API_TOKEN is not set,
 * the validator returns { ok: true, skipped: true } — so this feature
 * degrades gracefully: no key = no validation, pipeline proceeds.
 *
 * History of every check is appended to output/soul_id_history.json.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const REGISTRY_FILE = path.resolve(__dirname, '../data/soul_registry.json');
const OUTPUT_DIR = path.resolve(__dirname, '../output');
const HISTORY_FILE = path.join(OUTPUT_DIR, 'soul_id_history.json');

const REPLICATE_API = 'https://api.replicate.com/v1/predictions';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
}

function appendHistory(entry) {
  let hist = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try { hist = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch {}
  }
  hist.push(entry);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist, null, 2));
}

function fileToDataUrl(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,${buf.toString('base64')}`;
}

/**
 * Run one Replicate prediction and wait for completion.
 */
async function replicatePredict(model, input) {
  const token = process.env.REPLICATE_API_TOKEN;
  const { data: submit } = await axios.post(
    REPLICATE_API,
    { version: model.split(':')[1] || model, input },
    { headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' } }
  );
  let pred = submit;
  for (let i = 0; i < 60; i++) {
    if (pred.status === 'succeeded') return pred.output;
    if (pred.status === 'failed' || pred.status === 'canceled') {
      throw new Error(`Replicate ${pred.status}: ${pred.error || ''}`);
    }
    await sleep(3000);
    const { data: poll } = await axios.get(pred.urls?.get || `${REPLICATE_API}/${pred.id}`, {
      headers: { Authorization: `Token ${token}` },
    });
    pred = poll;
  }
  throw new Error('Replicate polling timeout');
}

/**
 * Validate that a generated keyframe still matches the character's face.
 *
 * @param {string} keyframePath
 * @param {string} characterId
 * @param {object} [opts]         { threshold, referenceKeyframePath }
 * @returns {Promise<{ok:boolean, score?:number, threshold?:number, skipped?:boolean}>}
 */
async function validateFace(keyframePath, characterId, opts = {}) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return { ok: true, skipped: true, reason: 'no REPLICATE_API_TOKEN' };
  }

  const reg = loadRegistry();
  const ch = reg.characters?.[characterId];
  if (!ch) return { ok: true, skipped: true, reason: `unknown character ${characterId}` };

  const threshold = opts.threshold ?? reg.defaults?.similarity_threshold ?? 0.72;
  const model = reg.defaults?.replicate_face_model;
  if (!model) return { ok: true, skipped: true, reason: 'no replicate_face_model in registry' };

  // Prefer explicit ref, else first available anchor keyframe on disk
  const keyframesDir = path.join(OUTPUT_DIR, 'keyframes');
  let refPath = opts.referenceKeyframePath;
  if (!refPath) {
    for (const name of ch.reference_keyframes || []) {
      const candidate = path.join(keyframesDir, name);
      if (fs.existsSync(candidate)) { refPath = candidate; break; }
    }
  }
  if (!refPath) return { ok: true, skipped: true, reason: 'no reference keyframe on disk yet' };

  try {
    const output = await replicatePredict(model, {
      image1: fileToDataUrl(refPath),
      image2: fileToDataUrl(keyframePath),
    });
    const score = typeof output === 'number' ? output : output?.similarity ?? output?.score;
    const ok = typeof score === 'number' ? score >= threshold : true;
    const result = { ok, score, threshold, reference: path.basename(refPath) };
    appendHistory({
      timestamp: new Date().toISOString(),
      characterId,
      keyframe: path.basename(keyframePath),
      ...result,
    });
    if (!ok) console.warn(`⚠️  Face drift on ${path.basename(keyframePath)} — score ${score?.toFixed?.(3)} < ${threshold}`);
    return result;
  } catch (err) {
    console.warn(`⚠️  Face validation errored (non-fatal): ${err.message}`);
    return { ok: true, skipped: true, reason: err.message };
  }
}

module.exports = { validateFace };
