/**
 * FéTok Image Generator v9 — CINEMATIC SMOOTH GRADIENTS
 * Pure JS (pureimage) + bundled DejaVu fonts
 * Pixel-level smooth radial gradients for professional TikTok look
 */

const PImage = require('pureimage');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const FONT_DIR = path.resolve(__dirname, '../fonts');

// Register & load fonts
const fontBold = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSans-Bold.ttf'), 'DejaVuBold');
fontBold.loadSync();
const fontRegular = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSans.ttf'), 'DejaVuRegular');
fontRegular.loadSync();
console.log('✅ Fonts loaded');

const THEMES = {
  'proteção': { stops: [[8,20,55],[15,45,110],[30,80,190],[55,130,235],[100,180,253]], accent: [147,197,253] },
  'coragem':  { stops: [[40,15,0],[110,35,12],[180,60,10],[240,140,55],[253,186,116]], accent: [253,186,116] },
  'amor':     { stops: [[50,0,18],[120,15,45],[175,15,50],[240,100,125],[253,164,175]], accent: [253,164,175] },
  'força':    { stops: [[25,8,55],[65,25,130],[110,50,210],[160,130,250],[196,181,253]], accent: [196,181,253] },
  'fé':       { stops: [[4,38,18],[15,70,38],[18,140,60],[60,200,110],[134,239,172]], accent: [134,239,172] },
  'esperança':{ stops: [[40,22,0],[105,45,12],[200,110,5],[245,185,30],[253,230,138]], accent: [253,230,138] },
  'gratidão': { stops: [[3,40,38],[15,65,60],[10,130,115],[40,195,175],[94,234,212]], accent: [94,234,212] },
  'vitória':  { stops: [[58,8,8],[110,22,22],[200,30,30],[240,100,100],[252,165,165]], accent: [252,165,165] },
  'paz':      { stops: [[10,16,58],[25,50,120],[50,110,210],[110,190,248],[186,230,253]], accent: [186,230,253] },
  'default':  { stops: [[22,12,0],[58,35,8],[145,88,5],[200,155,70],[253,230,138]], accent: [253,230,138] },
};

function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

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

/**
 * Draw smooth multi-stop radial gradient pixel-by-pixel
 */
function drawSmoothRadialGradient(ctx, w, h, cx, cy, maxR, stops) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      let dist = Math.sqrt(dx * dx + dy * dy) / maxR;
      dist = Math.min(dist, 1.0);
      
      // Map dist to stop index
      const segCount = stops.length - 1;
      const segF = dist * segCount;
      const segI = Math.min(Math.floor(segF), segCount - 1);
      const t = segF - segI;
      
      const c0 = stops[segI];
      const c1 = stops[segI + 1];
      
      const r = lerp(c1[0], c0[0], 1 - t);
      const g = lerp(c1[1], c0[1], 1 - t);
      const b = lerp(c1[2], c0[2], 1 - t);
      
      const idx = (y * w + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
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

  const theme = THEMES[verse.theme] || THEMES['default'];
  const { stops, accent } = theme;

  const img = PImage.make(width, height);
  const ctx = img.getContext('2d');

  // === SMOOTH RADIAL GRADIENT (pixel-by-pixel) ===
  const maxR = Math.sqrt((width/2)*(width/2) + (height*0.58)*(height*0.58));
  drawSmoothRadialGradient(ctx, width, height, width/2, height*0.42, maxR, stops);

  // === SUBTLE LIGHT BLOOM at center ===
  const bloomR = 280;
  for (let r = bloomR; r > 0; r -= 1) {
    const alpha = 0.12 * (1 - r / bloomR);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgb(${stops[4][0]},${stops[4][1]},${stops[4][2]})`;
    ctx.beginPath();
    ctx.arc(width/2, height*0.42, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // === BOKEH PARTICLES ===
  const bokeh = [
    { x: 130, y: 280, r: 35, a: 0.08 },
    { x: 940, y: 420, r: 25, a: 0.06 },
    { x: 200, y: 1520, r: 30, a: 0.05 },
    { x: 880, y: 1380, r: 28, a: 0.04 },
    { x: 520, y: 220, r: 40, a: 0.07 },
    { x: 310, y: 1150, r: 22, a: 0.04 },
    { x: 780, y: 1720, r: 20, a: 0.03 },
  ];
  for (const b of bokeh) {
    for (let r = b.r; r > 0; r -= 1) {
      ctx.globalAlpha = b.a * (1 - r / b.r);
      ctx.fillStyle = `rgb(${stops[4][0]},${stops[4][1]},${stops[4][2]})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // === SPARKLE STARS ===
  const stars = [
    { x: 260, y: 190, r: 2.5 }, { x: 830, y: 340, r: 2 },
    { x: 960, y: 920, r: 2 },  { x: 410, y: 1620, r: 1.8 },
    { x: 210, y: 1320, r: 1.5 }, { x: 720, y: 180, r: 1.5 },
    { x: 110, y: 780, r: 1.8 }, { x: 890, y: 1680, r: 1.5 },
  ];
  for (const s of stars) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // === CROSS ===
  const crossY = 640;
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(width/2, crossY-32); ctx.lineTo(width/2, crossY+32); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(width/2-20, crossY-8); ctx.lineTo(width/2+20, crossY-8); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // === DECORATIVE LINE ===
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(width*0.22, crossY+52); ctx.lineTo(width*0.78, crossY+52); ctx.stroke();
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
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    for (let ox = -4; ox <= 4; ox++) {
      for (let oy = -4; oy <= 4; oy++) {
        if (Math.abs(ox) + Math.abs(oy) < 3) continue;
        ctx.fillText(lines[i], width/2 + ox, y + oy);
      }
    }
    // White
    ctx.fillStyle = 'white';
    ctx.fillText(lines[i], width/2, y);
  }

  // === REFERENCE ===
  const refY = startY + totalH + 80;
  const refSize = Math.round(fontSize * 0.48);
  ctx.font = `${refSize}pt DejaVuBold`;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  for (let ox = -3; ox <= 3; ox++) {
    for (let oy = -3; oy <= 3; oy++) {
      if (ox === 0 && oy === 0) continue;
      ctx.fillText(verse.ref.toUpperCase(), width/2 + ox, refY + oy);
    }
  }
  ctx.fillStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.fillText(verse.ref.toUpperCase(), width/2, refY);

  // === BOTTOM LINE ===
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(width*0.32, refY+25); ctx.lineTo(width*0.68, refY+25); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // === WATERMARK ===
  ctx.font = '18pt DejaVuRegular';
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = 'white';
  ctx.fillText('✝  @luz.da.palavra.oficial', width/2, height-75);
  ctx.globalAlpha = 1.0;

  // === SAVE ===
  await PImage.encodePNGToStream(img, fs.createWriteStream(outputPath));
  console.log(`   🎨 ✅ ${filename}`);
  return outputPath;
}

module.exports = { generateImage };
