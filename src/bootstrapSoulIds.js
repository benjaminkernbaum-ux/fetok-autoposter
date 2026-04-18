/**
 * One-time Soul ID bootstrap.
 *
 * For each character in data/soul_registry.json:
 *   1. Ensure the 3 anchor keyframes exist (generates them via MJ if not).
 *      IMPORTANT: the first round runs WITHOUT any --cref so the face
 *      is free to emerge organically from the character description.
 *   2. Upload them to Higgsfield Soul ID training.
 *   3. Persist the returned soul_id into data/soul_registry.json.
 *   4. Persist the first anchor's URL as mj_cref_url / mj_sref_url
 *      (requires a public base URL — see SOUL_REF_BASE_URL env).
 *
 * Run once: `npm run soulid:bootstrap`
 * Re-run is safe — any character with a filled soul_id is skipped.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { generateKeyframe } = require('./higgsfieldGenerator');
const { registerSoulId } = require('./higgsfieldSoulId');
const { invalidateCache } = require('./mjStyleRef');

const DATA_ROTEIROS = path.resolve(__dirname, '../data/roteiros.json');
const REGISTRY_FILE = path.resolve(__dirname, '../data/soul_registry.json');
const KEYFRAMES_DIR = path.resolve(__dirname, '../output/keyframes');

function load(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function findAnchorShot(roteiros, characterId, filename) {
  for (const r of roteiros) {
    for (const s of r.shots) {
      if (s.character_id !== characterId) continue;
      const base = `${r.id}_shot_${String(s.ordem).padStart(2, '0')}.png`;
      if (base === filename) return { roteiro: r, shot: s };
    }
  }
  return null;
}

function publicUrlForKeyframe(filename) {
  const base = process.env.SOUL_REF_BASE_URL;
  if (!base) return '';
  return `${base.replace(/\/$/, '')}/${filename}`;
}

async function bootstrap() {
  const roteiros = load(DATA_ROTEIROS);
  const registry = load(REGISTRY_FILE);
  const styleTokens = roteiros.style_tokens || '';

  for (const [characterId, ch] of Object.entries(registry.characters || {})) {
    console.log(`\n🧬 Character: ${characterId}`);

    if (ch.higgsfield_soul_id) {
      console.log(`   ✓ Already has soul_id ${ch.higgsfield_soul_id} — skipping.`);
      continue;
    }

    const anchorFiles = ch.reference_keyframes || [];
    const localAnchors = [];

    for (const filename of anchorFiles) {
      const localPath = path.join(KEYFRAMES_DIR, filename);
      if (!fs.existsSync(localPath)) {
        const anchor = findAnchorShot(roteiros.roteiros, characterId, filename);
        if (!anchor) {
          console.warn(`   ⚠️  ${filename} not on disk and no matching shot — skipping`);
          continue;
        }
        console.log(`   → generating anchor ${filename}...`);
        // Bootstrap render: DO NOT pass characterId, so no --cref yet.
        await generateKeyframe(anchor.shot.prompt_mj, styleTokens, filename);
      }
      localAnchors.push(localPath);
    }

    if (localAnchors.length < 3) {
      console.warn(`   ⚠️  Only ${localAnchors.length} anchors — need ≥ 3. Skipping Soul ID.`);
      continue;
    }

    // 1. Higgsfield Soul ID training
    try {
      await registerSoulId(characterId, localAnchors);
    } catch (err) {
      console.warn(`   ⚠️  Soul ID training failed: ${err.message}`);
    }

    // 2. Persist MJ cref/sref URLs for the first anchor (if host is exposed)
    const first = anchorFiles[0];
    if (first && !ch.mj_cref_url) {
      const url = publicUrlForKeyframe(first);
      if (url) {
        const fresh = load(REGISTRY_FILE);
        fresh.characters[characterId].mj_cref_url = url;
        fresh.characters[characterId].mj_sref_url = url;
        save(REGISTRY_FILE, fresh);
        invalidateCache();
        console.log(`   ✓ mj_cref_url/mj_sref_url → ${url}`);
      } else {
        console.log(`   ℹ️  Set SOUL_REF_BASE_URL to auto-fill MJ --cref/--sref URLs.`);
      }
    }
  }

  console.log(`\n✅ Bootstrap done.`);
}

if (require.main === module) {
  bootstrap().catch((err) => {
    console.error(`\n❌ Bootstrap failed: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { bootstrap };
