/**
 * Higgsfield native Soul ID integration.
 *
 * Higgsfield's Soul ID locks a character's identity across I2V generations
 * by training a lightweight identity embedding from 3–5 reference images.
 * Once registered, the returned soul_id is passed alongside each DoP job
 * so the animation preserves the face even when the motion preset is
 * aggressive (bullet_time, whip_pan, etc.).
 *
 * This module is idempotent: if a character already has a soul_id in
 * data/soul_registry.json, registerSoulId() is a no-op.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const HF_API = process.env.HIGGSFIELD_ENDPOINT || 'https://api.higgsfield.ai/v1';
const REGISTRY_FILE = path.resolve(__dirname, '../data/soul_registry.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
}

function saveRegistry(reg) {
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(reg, null, 2));
}

/**
 * Register (or reuse) a Higgsfield Soul ID for a character.
 *
 * @param {string} characterId    - Key in soul_registry.characters.
 * @param {string[]} imagePaths   - 3-5 local PNG paths serving as references.
 * @returns {Promise<string>} soul_id
 */
async function registerSoulId(characterId, imagePaths) {
  const key = process.env.HIGGSFIELD_API_KEY;
  if (!key) throw new Error('HIGGSFIELD_API_KEY not set');

  const reg = loadRegistry();
  const ch = reg.characters?.[characterId];
  if (!ch) throw new Error(`Unknown character_id: ${characterId}`);

  if (ch.higgsfield_soul_id) {
    console.log(`🧬 Soul ID cached for ${characterId}: ${ch.higgsfield_soul_id}`);
    return ch.higgsfield_soul_id;
  }

  if (!imagePaths || imagePaths.length < 3) {
    throw new Error(`Soul ID needs at least 3 references (${characterId})`);
  }

  console.log(`🧬 Registering Soul ID for ${characterId} (${imagePaths.length} refs)...`);

  const references = imagePaths.map((p) => ({
    filename: path.basename(p),
    image_base64: fs.readFileSync(p).toString('base64'),
  }));

  const { data: submit } = await axios.post(
    `${HF_API}/soul/create`,
    {
      name: ch.name || characterId,
      description: ch.description || '',
      references,
    },
    {
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      timeout: 120000,
    }
  );

  const trainingId = submit.training_id || submit.id;
  if (!trainingId) throw new Error(`Soul ID submit failed: ${JSON.stringify(submit)}`);

  for (let i = 0; i < 80; i++) {
    await sleep(10000);
    const { data: poll } = await axios.get(`${HF_API}/soul/${trainingId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (poll.status === 'ready' && poll.soul_id) {
      ch.higgsfield_soul_id = poll.soul_id;
      saveRegistry(reg);
      console.log(`🧬 Soul ID ready: ${poll.soul_id}`);
      return poll.soul_id;
    }
    if (poll.status === 'failed') {
      throw new Error(`Soul ID training failed: ${poll.error || trainingId}`);
    }
  }
  throw new Error(`Soul ID training timeout: ${trainingId}`);
}

/**
 * Returns the soul_id for a character (or null if none).
 */
function getSoulId(characterId) {
  try {
    const reg = loadRegistry();
    return reg.characters?.[characterId]?.higgsfield_soul_id || null;
  } catch {
    return null;
  }
}

module.exports = { registerSoulId, getSoulId };
