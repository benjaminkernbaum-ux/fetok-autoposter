/**
 * FéTok Image Generator v10.1 — CINEMATIC HERO BACKGROUNDS
 * Real cinematic images + pureimage text overlay (pure JS)
 * Optimized JPG heroes (~250KB each) to avoid OOM on Railway
 */

const PImage = require('pureimage');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const HEROES_DIR = path.resolve(__dirname, '../heroes');
const FONT_DIR = path.resolve(__dirname, '../fonts');

// Register & load fonts
const fontBold = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSans-Bold.ttf'), 'DejaVuBold');
fontBold.loadSync();
const fontRegular = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSans.ttf'), 'DejaVuRegular');
fontRegular.loadSync();
const fontSerif = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSerif-Bold.ttf'), 'DejaVuSerif');
fontSerif.loadSync();
console.log('✅ Fonts loaded');

// Map themes to cinematic hero backgrounds (JPG)
const THEME_HEROES = {
  // Série 5 themes
  'fidelidade':  ['hero_divine_cross.jpg', 'hero_lion_judah.jpg', 'hero_bible_light.jpg'],
  'renovação':   ['hero_sunrise_cross.jpg', 'hero_eagle_soaring.jpg', 'hero_dove_sky.jpg'],
  'confiança':   ['hero_shepherd.jpg', 'hero_narrow_path.jpg', 'hero_prayer_hands.jpg'],
  'promessa':    ['hero_sunrise_cross.jpg', 'hero_olive_tree.jpg', 'hero_divine_cross.jpg'],
  'libertação':  ['hero_fire_warrior.jpg', 'hero_lion_judah.jpg', 'hero_walking_water.jpg'],
  'gratidão':    ['hero_olive_tree.jpg', 'hero_prayer_hands.jpg', 'hero_bible_light.jpg'],
  'eternidade':  ['hero_divine_cross.jpg', 'hero_dove_sky.jpg', 'hero_sunrise_cross.jpg'],
  // Legacy themes (backup pool in verses.js)
  'proteção': ['hero_fire_warrior.jpg', 'hero_divine_cross.jpg', 'hero_lion_judah.jpg'],
  'coragem':  ['hero_eagle_soaring.jpg', 'hero_shepherd.jpg', 'hero_fire_warrior.jpg'],
  'amor':     ['hero_prayer_hands.jpg', 'hero_dove_sky.jpg', 'hero_sunrise_cross.jpg'],
  'força':    ['hero_fire_warrior.jpg', 'hero_lion_judah.jpg', 'hero_eagle_soaring.jpg'],
  'fé':       ['hero_bible_light.jpg', 'hero_narrow_path.jpg', 'hero_olive_tree.jpg'],
  'esperança':['hero_dove_sky.jpg', 'hero_sunrise_cross.jpg', 'hero_shepherd.jpg'],
  'vitória':  ['hero_lion_judah.jpg', 'hero_fire_warrior.jpg', 'hero_eagle_soaring.jpg'],
  'paz':      ['hero_walking_water.jpg', 'hero_shepherd.jpg', 'hero_dove_sky.jpg'],
  'perdão':   ['hero_divine_cross.jpg', 'hero_prayer_hands.jpg', 'hero_dove_sky.jpg'],
  'provisão': ['hero_shepherd.jpg', 'hero_olive_tree.jpg', 'hero_sunrise_cross.jpg'],
  'sabedoria':['hero_bible_light.jpg', 'hero_narrow_path.jpg', 'hero_olive_tree.jpg'],
  'cura':     ['hero_prayer_hands.jpg', 'hero_divine_cross.jpg', 'hero_sunrise_cross.jpg'],
  'default':  ['hero_divine_cross.jpg', 'hero_bible_light.jpg', 'hero_sunrise_cross.jpg'],
};

const THEME_ACCENT = {
  // Série 5 themes
  'fidelidade':  [212, 168, 83],
  'renovação':   [34, 211, 238],
  'confiança':   [168, 85, 247],
  'promessa':    [250, 204, 21],
  'libertação':  [239, 68, 68],
  'gratidão':    [94, 234, 212],
  'eternidade':  [236, 72, 153],
  // Legacy themes
  'proteção': [212, 168, 83],
  'coragem':  [253, 186, 116],
  'amor':     [255, 180, 190],
  'força':    [196, 181, 253],
  'fé':       [212, 168, 83],
  'esperança':[253, 230, 138],
  'vitória':  [252, 165, 165],
  'paz':      [186, 230, 253],
  'perdão':   [255, 210, 170],
  'provisão': [180, 220, 150],
  'sabedoria':[212, 168, 83],
  'cura':     [255, 200, 200],
  'default':  [212, 168, 83],
};

const heroIndex = {};
function getHeroForTheme(theme) {
  const heroes = THEME_HEROES[theme] || THEME_HEROES['default'];
  if (!heroIndex[theme]) heroIndex[theme] = 0;
  const hero = heroes[heroIndex[theme] % heroes.length];
  heroIndex[theme]++;
  return hero;
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

async function generateImage(verse) {
  const width = 1080;
  const height = 1920;

  const filename = `verse_${verse.ref.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s:]/g, '_').toLowerCase()}.png`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  if (fs.existsSync(outputPath)) {
    console.log(`   🎨 exists: ${filename}`);
    return outputPath;
  }

  const heroFile = getHeroForTheme(verse.theme);
  const heroPath = path.join(HEROES_DIR, heroFile);
  const accent = THEME_ACCENT[verse.theme] || THEME_ACCENT['default'];

  // Step 1: Load hero as PNG buffer (sharp handles JPG→PNG conversion)
  let bgBuffer;
  if (fs.existsSync(heroPath)) {
    bgBuffer = await sharp(heroPath).resize(width, height, { fit: 'cover' }).png().toBuffer();
  } else {
    bgBuffer = await sharp({ create: { width, height, channels: 4, background: { r: 10, g: 8, b: 18, alpha: 1 } } }).png().toBuffer();
    console.log(`   ⚠️ Hero not found: ${heroFile}`);
  }

  // Step 2: Load into pureimage
  const { PassThrough } = require('stream');
  const readable = new PassThrough();
  readable.end(bgBuffer);
  const bgImg = await PImage.decodePNGFromStream(readable);
  bgBuffer = null; // free memory

  const img = PImage.make(width, height);
  const ctx = img.getContext('2d');
  ctx.drawImage(bgImg, 0, 0, width, height, 0, 0, width, height);

  // Step 3: Subtle vignette only (NO heavy overlay — keep hero visible)
  // Top edge fade
  for (let row = 0; row < 300; row++) {
    ctx.globalAlpha = 0.6 * (1 - row / 300);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, row, width, 1);
  }
  // Bottom edge fade
  for (let row = 0; row < 300; row++) {
    ctx.globalAlpha = 0.6 * (1 - row / 300);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, height - row, width, 1);
  }
  ctx.globalAlpha = 1.0;

  // Text layout
  const len = verse.text.length;
  const fontSize = len > 120 ? 44 : len > 90 ? 50 : len > 70 ? 58 : len > 50 ? 66 : 78;
  const maxChars = len > 120 ? 24 : len > 90 ? 22 : len > 70 ? 18 : len > 50 ? 15 : 13;
  const lines = wrapText(verse.text, maxChars);
  const lineHeight = fontSize * 1.5;
  const totalH = lines.length * lineHeight;
  const startY = (height / 2) - (totalH / 2) + 30;

  // Cross icon
  const crossY = startY - 50;
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(width/2, crossY-25); ctx.lineTo(width/2, crossY+25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(width/2-16, crossY-5); ctx.lineTo(width/2+16, crossY-5); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Verse text
  ctx.font = `${fontSize}pt DejaVuSerif`;
  ctx.textAlign = 'center';

  for (let i = 0; i < lines.length; i++) {
    const y = startY + (i * lineHeight);
    // Heavy multi-pass shadow for readability on photos
    // Pass 1: wide soft glow
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    for (let ox = -8; ox <= 8; ox += 2) {
      for (let oy = -8; oy <= 8; oy += 2) {
        ctx.fillText(lines[i], width/2 + ox, y + oy);
      }
    }
    // Pass 2: tight crisp outline
    ctx.fillStyle = 'rgba(0,0,0,0.95)';
    for (let ox = -3; ox <= 3; ox++) {
      for (let oy = -3; oy <= 3; oy++) {
        if (ox === 0 && oy === 0) continue;
        ctx.fillText(lines[i], width/2 + ox, y + oy);
      }
    }
    // Pass 3: white fill
    ctx.fillStyle = 'white';
    ctx.fillText(lines[i], width/2, y);
  }

  // Reference
  const refY = startY + totalH + 50;
  const refSize = Math.round(fontSize * 0.45);
  ctx.font = `${refSize}pt DejaVuBold`;
  ctx.fillStyle = 'rgba(0,0,0,0.9)';
  for (let ox = -3; ox <= 3; ox++) {
    for (let oy = -3; oy <= 3; oy++) {
      if (ox === 0 && oy === 0) continue;
      ctx.fillText(verse.ref, width/2 + ox, refY + oy);
    }
  }
  ctx.fillStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.fillText(verse.ref, width/2, refY);

  // Watermark
  ctx.font = '16pt DejaVuRegular';
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = 'white';
  ctx.fillText('@luz.da.palavra.oficial', width/2, height - 70);
  ctx.globalAlpha = 1.0;

  // Save
  await PImage.encodePNGToStream(img, fs.createWriteStream(outputPath));
  console.log(`   🎨 ✅ ${filename} (${heroFile})`);
  return outputPath;
}

module.exports = { generateImage };
