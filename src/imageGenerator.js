/**
 * FéTok Image Generator v10 — CINEMATIC HERO BACKGROUNDS
 * Uses REAL cinematic images as backgrounds (like the originals on TikTok)
 * Text overlay via pureimage (pure JS) with bundled DejaVu fonts
 * Zero system font dependency — identical on Windows + Railway Linux
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
console.log('✅ Fonts loaded (Bold + Regular + Serif)');

// Map themes to cinematic hero backgrounds
const THEME_HEROES = {
  'proteção': ['hero_fire_warrior.png', 'hero_divine_cross.png', 'hero_lion_judah.png'],
  'coragem':  ['hero_eagle_soaring.png', 'hero_shepherd.png', 'hero_fire_warrior.png'],
  'amor':     ['hero_prayer_hands.png', 'hero_dove_sky.png', 'hero_sunrise_cross.png'],
  'força':    ['hero_fire_warrior.png', 'hero_lion_judah.png', 'hero_eagle_soaring.png'],
  'fé':       ['hero_bible_light.png', 'hero_narrow_path.png', 'hero_olive_tree.png'],
  'esperança':['hero_dove_sky.png', 'hero_sunrise_cross.png', 'hero_shepherd.png'],
  'gratidão': ['hero_olive_tree.png', 'hero_prayer_hands.png', 'hero_bible_light.png'],
  'vitória':  ['hero_lion_judah.png', 'hero_fire_warrior.png', 'hero_eagle_soaring.png'],
  'paz':      ['hero_walking_water.png', 'hero_shepherd.png', 'hero_dove_sky.png'],
  'default':  ['hero_divine_cross.png', 'hero_bible_light.png', 'hero_sunrise_cross.png'],
};

const THEME_ACCENT = {
  'proteção': [212, 168, 83],  // gold
  'coragem':  [253, 186, 116], // orange
  'amor':     [255, 180, 190], // pink
  'força':    [196, 181, 253], // purple
  'fé':       [212, 168, 83],  // gold
  'esperança':[253, 230, 138], // yellow
  'gratidão': [94, 234, 212],  // teal
  'vitória':  [252, 165, 165], // red
  'paz':      [186, 230, 253], // light blue
  'default':  [212, 168, 83],  // gold
};

// Track which hero was last used per theme to rotate
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

  // Step 1: Resize hero image to 1080x1920 using Sharp
  let bgBuffer;
  if (fs.existsSync(heroPath)) {
    bgBuffer = await sharp(heroPath)
      .resize(width, height, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer();
  } else {
    // Fallback: solid dark
    bgBuffer = await sharp({
      create: { width, height, channels: 4, background: { r: 10, g: 8, b: 18, alpha: 1 } }
    }).png().toBuffer();
    console.log(`   ⚠️ Hero not found: ${heroFile}, using dark fallback`);
  }

  // Step 2: Load into pureimage for text overlay
  const bgStream = require('stream');
  const readable = new bgStream.PassThrough();
  readable.end(bgBuffer);
  const bgImg = await PImage.decodePNGFromStream(readable);
  
  const img = PImage.make(width, height);
  const ctx = img.getContext('2d');
  
  // Draw background
  ctx.drawImage(bgImg, 0, 0, width, height, 0, 0, width, height);

  // Step 3: Dark overlay for text readability
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, width, height);
  
  // Extra dark band in text area
  const len = verse.text.length;
  const fontSize = len > 120 ? 44 : len > 90 ? 50 : len > 70 ? 58 : len > 50 ? 66 : 78;
  const maxChars = len > 120 ? 24 : len > 90 ? 22 : len > 70 ? 18 : len > 50 ? 15 : 13;
  const lines = wrapText(verse.text, maxChars);
  const lineHeight = fontSize * 1.5;
  const totalH = lines.length * lineHeight;
  const startY = (height / 2) - (totalH / 2) + 30;

  // Subtle darker gradient behind text
  for (let row = 0; row < totalH + 200; row++) {
    const y = startY - 100 + row;
    if (y < 0 || y >= height) continue;
    const distFromCenter = Math.abs(row - (totalH + 200) / 2) / ((totalH + 200) / 2);
    const alpha = 0.35 * (1 - distFromCenter * distFromCenter);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, y, width, 1);
  }
  ctx.globalAlpha = 1.0;

  // Step 4: Cross icon
  const crossY = startY - 60;
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(width/2, crossY-28); ctx.lineTo(width/2, crossY+28); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(width/2-18, crossY-5); ctx.lineTo(width/2+18, crossY-5); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Step 5: Verse text (italic serif for biblical feel)
  ctx.font = `${fontSize}pt DejaVuSerif`;
  ctx.textAlign = 'center';

  for (let i = 0; i < lines.length; i++) {
    const y = startY + (i * lineHeight);
    // Heavy shadow for contrast on photos
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    for (let ox = -4; ox <= 4; ox++) {
      for (let oy = -4; oy <= 4; oy++) {
        if (Math.abs(ox) + Math.abs(oy) < 3) continue;
        ctx.fillText(lines[i], width/2 + ox, y + oy);
      }
    }
    ctx.fillStyle = 'white';
    ctx.fillText(lines[i], width/2, y);
  }

  // Step 6: Reference
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

  // Step 7: Watermark
  ctx.font = '16pt DejaVuRegular';
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = 'white';
  ctx.fillText('✝  @luz.da.palavra.oficial', width/2, height - 70);
  ctx.globalAlpha = 1.0;

  // Step 8: Save
  await PImage.encodePNGToStream(img, fs.createWriteStream(outputPath));
  console.log(`   🎨 ✅ ${filename} (hero: ${heroFile})`);
  return outputPath;
}

module.exports = { generateImage };
