/**
 * FéTok Image Generator v7.0 — With fonts installed via nixpacks
 * Uses DejaVu Sans (guaranteed by apt package) for SVG text
 * Generates 1080×1920 portrait with text overlay
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../output');

const THEME_PALETTES = {
  'proteção': { bg1: '#0b1a3d', bg2: '#1a3a7a', bg3: '#2563eb', bg4: '#60a5fa', accent: '#93c5fd', glow1: '#3b82f6' },
  'coragem':  { bg1: '#2d1300', bg2: '#7c2d12', bg3: '#c2410c', bg4: '#fb923c', accent: '#fdba74', glow1: '#ea580c' },
  'amor':     { bg1: '#3b0015', bg2: '#881337', bg3: '#be123c', bg4: '#fb7185', accent: '#fda4af', glow1: '#e11d48' },
  'força':    { bg1: '#1e0a3e', bg2: '#4c1d95', bg3: '#7c3aed', bg4: '#a78bfa', accent: '#c4b5fd', glow1: '#8b5cf6' },
  'fé':       { bg1: '#052e16', bg2: '#14532d', bg3: '#16a34a', bg4: '#4ade80', accent: '#86efac', glow1: '#22c55e' },
  'esperança':{ bg1: '#2d1a00', bg2: '#78350f', bg3: '#d97706', bg4: '#fbbf24', accent: '#fde68a', glow1: '#f59e0b' },
  'gratidão': { bg1: '#042f2e', bg2: '#134e4a', bg3: '#0d9488', bg4: '#2dd4bf', accent: '#5eead4', glow1: '#14b8a6' },
  'vitória':  { bg1: '#450a0a', bg2: '#7f1d1d', bg3: '#dc2626', bg4: '#f87171', accent: '#fca5a5', glow1: '#ef4444' },
  'paz':      { bg1: '#0c1445', bg2: '#1e3a8a', bg3: '#3b82f6', bg4: '#7dd3fc', accent: '#bae6fd', glow1: '#0ea5e9' },
  'default':  { bg1: '#1a0f00', bg2: '#44290a', bg3: '#a16207', bg4: '#d4a853', accent: '#fde68a', glow1: '#ca8a04' },
};

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

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function createFullSVG(verse, width, height) {
  const palette = THEME_PALETTES[verse.theme] || THEME_PALETTES['default'];
  const { bg1, bg2, bg3, bg4, accent, glow1 } = palette;

  const len = verse.text.length;
  const fontSize = len > 120 ? 52 : len > 90 ? 60 : len > 70 ? 68 : len > 50 ? 76 : 88;
  const maxChars = len > 120 ? 22 : len > 90 ? 20 : len > 70 ? 17 : len > 50 ? 15 : 13;
  const lines = wrapText(verse.text, maxChars);
  const lineHeight = fontSize * 1.55;
  const totalH = lines.length * lineHeight;
  const startY = (height / 2) - (totalH / 2) + 30;
  const refY = startY + totalH + 70;
  const crossY = startY - 110;

  // Use DejaVu Sans (installed via nixpacks) and Liberation Serif as fallbacks
  const mainFont = "DejaVu Sans, Liberation Sans, FreeSans, Arial, Helvetica, sans-serif";
  const refFont = "DejaVu Sans, Liberation Sans, FreeSans, Arial, Helvetica, sans-serif";

  const textLines = lines.map((line, i) => {
    const y = startY + (i * lineHeight);
    return `<text x="${width/2}" y="${y}" text-anchor="middle" font-family="${mainFont}" font-size="${fontSize}" font-weight="bold" fill="white" stroke="black" stroke-width="3" paint-order="stroke fill">${esc(line)}</text>`;
  }).join('\n    ');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgMain" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="${bg3}"/>
      <stop offset="35%" stop-color="${bg2}"/>
      <stop offset="70%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="#000"/>
    </radialGradient>
    <radialGradient id="cg" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stop-color="${bg4}" stop-opacity="0.55"/>
      <stop offset="50%" stop-color="${bg3}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="tb" cx="50%" cy="0%" r="55%">
      <stop offset="0%" stop-color="${bg4}" stop-opacity="0.4"/>
      <stop offset="40%" stop-color="${glow1}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <filter id="bk"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="sp"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#000"/>
  <rect width="${width}" height="${height}" fill="url(#bgMain)"/>
  <rect width="${width}" height="${height}" fill="url(#cg)"/>
  <rect width="${width}" height="${height}" fill="url(#tb)"/>

  <!-- Bokeh -->
  <circle cx="120" cy="250" r="30" fill="${bg4}" opacity="0.18" filter="url(#bk)"/>
  <circle cx="950" cy="400" r="22" fill="${glow1}" opacity="0.15" filter="url(#bk)"/>
  <circle cx="180" cy="1500" r="28" fill="${bg4}" opacity="0.12" filter="url(#bk)"/>
  <circle cx="900" cy="1350" r="24" fill="${bg4}" opacity="0.1" filter="url(#bk)"/>
  <circle cx="540" cy="200" r="35" fill="${bg4}" opacity="0.12" filter="url(#bk)"/>

  <!-- Stars -->
  <circle cx="250" cy="180" r="3" fill="white" opacity="0.6" filter="url(#sp)"/>
  <circle cx="820" cy="320" r="2.5" fill="white" opacity="0.5" filter="url(#sp)"/>
  <circle cx="970" cy="900" r="2.5" fill="white" opacity="0.5" filter="url(#sp)"/>
  <circle cx="400" cy="1600" r="2" fill="white" opacity="0.4" filter="url(#sp)"/>
  <circle cx="200" cy="1300" r="2" fill="white" opacity="0.3" filter="url(#sp)"/>

  <!-- Cross -->
  <line x1="${width/2}" y1="${crossY-35}" x2="${width/2}" y2="${crossY+35}" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
  <line x1="${width/2-22}" y1="${crossY-10}" x2="${width/2+22}" y2="${crossY-10}" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.65"/>

  <!-- Deco line -->
  <line x1="${width*0.2}" y1="${crossY+55}" x2="${width*0.8}" y2="${crossY+55}" stroke="${accent}" stroke-width="1" opacity="0.25"/>

  <!-- VERSE TEXT -->
  ${textLines}

  <!-- Reference -->
  <text x="${width/2}" y="${refY}" text-anchor="middle" font-family="${refFont}" font-size="40" font-weight="900" fill="${accent}" stroke="black" stroke-width="2" paint-order="stroke fill" letter-spacing="4">${esc(verse.ref.toUpperCase())}</text>

  <!-- Bottom line -->
  <line x1="${width*0.3}" y1="${refY+28}" x2="${width*0.7}" y2="${refY+28}" stroke="${accent}" stroke-width="1" opacity="0.25"/>

  <!-- Watermark -->
  <text x="${width/2}" y="${height-80}" text-anchor="middle" font-family="${refFont}" font-size="22" fill="rgba(255,255,255,0.35)" letter-spacing="2">@luz.da.palavra.oficial</text>
</svg>`;
}

async function generateImage(verse) {
  const width = 1080;
  const height = 1920;

  const filename = `verse_${verse.ref.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s:]/g, '_').toLowerCase()}.png`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  if (fs.existsSync(outputPath)) {
    console.log(`🎨 Image exists: ${filename}`);
    return outputPath;
  }

  console.log(`🎨 Generating: ${filename}...`);

  const svg = createFullSVG(verse, width, height);
  await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(outputPath);

  console.log(`🎨 ✅ ${filename}`);
  return outputPath;
}

module.exports = { generateImage };
