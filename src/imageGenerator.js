/**
 * FéTok Image Generator v8.0 — PURE JS TEXT RENDERING
 * Uses pureimage (pure JavaScript canvas) with bundled DejaVu fonts
 * No system font dependency — works EVERYWHERE
 */

const PImage = require('pureimage');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const FONT_DIR = path.resolve(__dirname, '../fonts');

// Register & load fonts synchronously
const fontBold = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSans-Bold.ttf'), 'DejaVuBold');
fontBold.loadSync();
const fontRegular = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSans.ttf'), 'DejaVuRegular');
fontRegular.loadSync();
console.log('✅ Fonts loaded: DejaVu Sans Bold + Regular');

const THEME_PALETTES = {
  'proteção': { colors: ['#000000','#0b1a3d','#1a3a7a','#2563eb','#60a5fa'], accent: [147,197,253] },
  'coragem':  { colors: ['#000000','#2d1300','#7c2d12','#c2410c','#fb923c'], accent: [253,186,116] },
  'amor':     { colors: ['#000000','#3b0015','#881337','#be123c','#fb7185'], accent: [253,164,175] },
  'força':    { colors: ['#000000','#1e0a3e','#4c1d95','#7c3aed','#a78bfa'], accent: [196,181,253] },
  'fé':       { colors: ['#000000','#052e16','#14532d','#16a34a','#4ade80'], accent: [134,239,172] },
  'esperança':{ colors: ['#000000','#2d1a00','#78350f','#d97706','#fbbf24'], accent: [253,230,138] },
  'gratidão': { colors: ['#000000','#042f2e','#134e4a','#0d9488','#2dd4bf'], accent: [94,234,212] },
  'vitória':  { colors: ['#000000','#450a0a','#7f1d1d','#dc2626','#f87171'], accent: [252,165,165] },
  'paz':      { colors: ['#000000','#0c1445','#1e3a8a','#3b82f6','#7dd3fc'], accent: [186,230,253] },
  'default':  { colors: ['#000000','#1a0f00','#44290a','#a16207','#d4a853'], accent: [253,230,138] },
};

function hexToRGB(hex) {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)] : [0,0,0];
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

  const palette = THEME_PALETTES[verse.theme] || THEME_PALETTES['default'];
  const { colors, accent } = palette;

  const img = PImage.make(width, height);
  const ctx = img.getContext('2d');

  // === BACKGROUND: layered colored circles for gradient effect ===
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, width, height);

  const gradientLayers = [
    { cx: width/2, cy: height*0.42, r: 950, color: colors[1], alpha: 0.7 },
    { cx: width/2, cy: height*0.42, r: 700, color: colors[2], alpha: 0.65 },
    { cx: width/2, cy: height*0.42, r: 450, color: colors[3], alpha: 0.6 },
    { cx: width/2, cy: height*0.42, r: 220, color: colors[4], alpha: 0.45 },
  ];

  for (const layer of gradientLayers) {
    ctx.globalAlpha = layer.alpha;
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.arc(layer.cx, layer.cy, layer.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // === BOKEH PARTICLES ===
  const bokeh = [
    { x: 120, y: 250, r: 35, a: 0.12 },
    { x: 950, y: 400, r: 25, a: 0.1 },
    { x: 180, y: 1500, r: 30, a: 0.08 },
    { x: 900, y: 1350, r: 28, a: 0.07 },
    { x: 540, y: 200, r: 40, a: 0.1 },
    { x: 300, y: 1100, r: 22, a: 0.06 },
    { x: 750, y: 1700, r: 20, a: 0.05 },
  ];
  for (const b of bokeh) {
    ctx.globalAlpha = b.a;
    ctx.fillStyle = colors[4];
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stars
  const stars = [
    { x: 250, y: 180, r: 3, a: 0.6 },
    { x: 820, y: 320, r: 2.5, a: 0.5 },
    { x: 970, y: 900, r: 2.5, a: 0.5 },
    { x: 400, y: 1600, r: 2, a: 0.4 },
    { x: 200, y: 1300, r: 2, a: 0.3 },
    { x: 700, y: 170, r: 1.8, a: 0.35 },
    { x: 100, y: 750, r: 2, a: 0.3 },
  ];
  for (const s of stars) {
    ctx.globalAlpha = s.a;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // === CROSS ===
  const crossY = 640;
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(width/2, crossY-35); ctx.lineTo(width/2, crossY+35); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(width/2-22, crossY-10); ctx.lineTo(width/2+22, crossY-10); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // === DECORATIVE LINE ===
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(width*0.2, crossY+55); ctx.lineTo(width*0.8, crossY+55); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // === VERSE TEXT ===
  const len = verse.text.length;
  const fontSize = len > 120 ? 44 : len > 90 ? 50 : len > 70 ? 58 : len > 50 ? 66 : 78;
  const maxChars = len > 120 ? 24 : len > 90 ? 22 : len > 70 ? 18 : len > 50 ? 15 : 13;
  const lines = wrapText(verse.text, maxChars);
  const lineHeight = fontSize * 1.6;
  const totalH = lines.length * lineHeight;
  const startY = (height / 2) - (totalH / 2) + 60;

  ctx.font = `${fontSize}pt DejaVuBold`;
  ctx.textAlign = 'center';

  for (let i = 0; i < lines.length; i++) {
    const y = startY + (i * lineHeight);
    // Black outline
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    for (let ox = -3; ox <= 3; ox++) {
      for (let oy = -3; oy <= 3; oy++) {
        if (Math.abs(ox) + Math.abs(oy) < 2) continue;
        ctx.fillText(lines[i], width/2 + ox, y + oy);
      }
    }
    // White text
    ctx.fillStyle = 'white';
    ctx.fillText(lines[i], width/2, y);
  }

  // === REFERENCE ===
  const refY = startY + totalH + 80;
  const refSize = Math.round(fontSize * 0.5);
  ctx.font = `${refSize}pt DejaVuBold`;
  // Outline
  ctx.fillStyle = 'rgba(0,0,0,0.9)';
  for (let ox = -2; ox <= 2; ox++) {
    for (let oy = -2; oy <= 2; oy++) {
      if (ox === 0 && oy === 0) continue;
      ctx.fillText(verse.ref.toUpperCase(), width/2 + ox, refY + oy);
    }
  }
  ctx.fillStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.fillText(verse.ref.toUpperCase(), width/2, refY);

  // === BOTTOM LINE ===
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(width*0.3, refY+28); ctx.lineTo(width*0.7, refY+28); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // === WATERMARK ===
  ctx.font = '18pt DejaVuRegular';
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = 'white';
  ctx.fillText('@luz.da.palavra.oficial', width/2, height-80);
  ctx.globalAlpha = 1.0;

  // === SAVE ===
  await PImage.encodePNGToStream(img, fs.createWriteStream(outputPath));
  console.log(`   🎨 ✅ ${filename}`);
  return outputPath;
}

module.exports = { generateImage };
