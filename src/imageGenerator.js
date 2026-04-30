/**
 * FéTok Image Generator v6.0 — FONT-FREE approach
 * Background: SVG gradient (no text)
 * Text: rendered by Sharp's built-in text API (no fonts needed)
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

/**
 * Create background-only SVG (gradients + bokeh, ZERO text)
 */
function createBackgroundSVG(width, height, palette) {
  const { bg1, bg2, bg3, bg4, glow1, accent } = palette;
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgMain" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="${bg3}"/>
      <stop offset="35%" stop-color="${bg2}"/>
      <stop offset="70%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="#000"/>
    </radialGradient>
    <radialGradient id="centerGlow" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stop-color="${bg4}" stop-opacity="0.55"/>
      <stop offset="50%" stop-color="${bg3}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="topBeam" cx="50%" cy="0%" r="55%">
      <stop offset="0%" stop-color="${bg4}" stop-opacity="0.4"/>
      <stop offset="40%" stop-color="${glow1}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <filter id="b"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="s"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="#000"/>
  <rect width="${width}" height="${height}" fill="url(#bgMain)"/>
  <rect width="${width}" height="${height}" fill="url(#centerGlow)"/>
  <rect width="${width}" height="${height}" fill="url(#topBeam)"/>
  <!-- Bokeh -->
  <circle cx="120" cy="250" r="30" fill="${bg4}" opacity="0.18" filter="url(#b)"/>
  <circle cx="950" cy="400" r="22" fill="${glow1}" opacity="0.15" filter="url(#b)"/>
  <circle cx="180" cy="1500" r="28" fill="${bg4}" opacity="0.12" filter="url(#b)"/>
  <circle cx="900" cy="1350" r="24" fill="${bg4}" opacity="0.1" filter="url(#b)"/>
  <circle cx="540" cy="200" r="35" fill="${bg4}" opacity="0.12" filter="url(#b)"/>
  <!-- Stars -->
  <circle cx="250" cy="180" r="3" fill="white" opacity="0.6" filter="url(#s)"/>
  <circle cx="820" cy="320" r="2.5" fill="white" opacity="0.5" filter="url(#s)"/>
  <circle cx="970" cy="900" r="2.5" fill="white" opacity="0.5" filter="url(#s)"/>
  <circle cx="400" cy="1600" r="2" fill="white" opacity="0.4" filter="url(#s)"/>
  <!-- Cross -->
  <line x1="${width/2}" y1="600" x2="${width/2}" y2="670" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  <line x1="${width/2-22}" y1="620" x2="${width/2+22}" y2="620" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  <!-- Deco line -->
  <line x1="${width*0.2}" y1="690" x2="${width*0.8}" y2="690" stroke="${accent}" stroke-width="1" opacity="0.25"/>
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

  const palette = THEME_PALETTES[verse.theme] || THEME_PALETTES['default'];

  // 1. Render background
  const bgSvg = createBackgroundSVG(width, height, palette);
  const bgBuffer = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  // 2. We'll let FFmpeg handle the text overlay instead
  // Just save the background image — videoGenerator will add text via drawtext
  await sharp(bgBuffer).png({ quality: 95 }).toFile(outputPath);

  console.log(`🎨 ✅ ${filename}`);
  return outputPath;
}

module.exports = { generateImage };
