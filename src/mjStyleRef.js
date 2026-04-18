/**
 * Midjourney prompt builder with Soul ID enforcement.
 *
 * Reads data/soul_registry.json and injects the right --cref / --sref
 * (and character description) for the given shot's character_id.
 *
 * Without this module, each keyframe would be rendered from scratch and
 * protagonist faces would drift between shots. With --cref+--sref the
 * same face + wardrobe + lighting travel across every shot of the same
 * character, which is the single biggest quality lever for cinematic
 * biblical shorts.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_FILE = path.resolve(__dirname, '../data/soul_registry.json');

let cachedRegistry = null;
function loadRegistry() {
  if (cachedRegistry) return cachedRegistry;
  if (!fs.existsSync(REGISTRY_FILE)) {
    cachedRegistry = { defaults: {}, characters: {} };
    return cachedRegistry;
  }
  cachedRegistry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
  return cachedRegistry;
}

function invalidateCache() {
  cachedRegistry = null;
}

function getCharacter(characterId) {
  const reg = loadRegistry();
  return reg.characters?.[characterId] || null;
}

/**
 * Build the final Midjourney prompt for a shot, honoring Soul ID.
 *
 * @param {object} opts
 * @param {string} opts.prompt          - Scene prompt (from shot.prompt_mj).
 * @param {string} [opts.characterId]   - Key in soul_registry.characters.
 * @param {string} [opts.globalStyle]   - Global style_tokens from roteiros.json.
 * @param {string} [opts.mjParams]      - Trailing params. Defaults to cinematic 9:16 raw.
 * @returns {string} full MJ prompt
 */
function buildMjPrompt({ prompt, characterId, globalStyle, mjParams } = {}) {
  const reg = loadRegistry();
  const defaults = reg.defaults || {};
  const tail = mjParams || '--ar 9:16 --v 7 --style raw --s 250 --q 2';

  const parts = [prompt];
  let crefFlag = '';

  if (characterId) {
    const ch = getCharacter(characterId);
    if (!ch) {
      console.warn(`⚠️  Unknown character_id "${characterId}" — falling back to free-form render`);
    } else {
      // 1. Embed character description for textual lock
      if (ch.description) parts.push(ch.description);
      if (ch.style_tokens) parts.push(ch.style_tokens);

      // 2. Attach --cref (character reference) and --sref (style reference)
      const refs = [];
      if (ch.mj_cref_url) {
        const cw = ch.mj_cw ?? defaults.mj_cw ?? 100;
        refs.push(`--cref ${ch.mj_cref_url} --cw ${cw}`);
      }
      if (ch.mj_sref_url) {
        const sw = ch.mj_sw ?? defaults.mj_sw ?? 250;
        refs.push(`--sref ${ch.mj_sref_url} --sw ${sw}`);
      }
      crefFlag = refs.join(' ');
    }
  }

  if (globalStyle) parts.push(globalStyle);

  const full = [parts.filter(Boolean).join(', '), crefFlag, tail]
    .filter((s) => s && s.trim())
    .join(' ');

  return full.replace(/\s+/g, ' ').trim();
}

module.exports = { buildMjPrompt, getCharacter, loadRegistry, invalidateCache };
