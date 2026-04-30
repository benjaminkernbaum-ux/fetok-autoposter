/**
 * FéTok Image Generator v3.0 — VIVID CINEMATIC BACKGROUNDS
 * Creates stunning verse images with bright gradient backgrounds
 * No external images needed — fully self-contained SVG rendering
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../output');

/* ═══════════════════════════════════════════════════════════
   VIVID THEME PALETTES — bright, eye-catching colors
   ═══════════════════════════════════════════════════════════ */
const THEME_PALETTES = {
  'proteção': {
    bg1: '#0b1a3d', bg2: '#1a3a7a', bg3: '#2563eb', bg4: '#60a5fa',
    accent: '#93c5fd', glow1: '#3b82f6', glow2: '#1d4ed8',
  },
  'coragem': {
    bg1: '#2d1300', bg2: '#7c2d12', bg3: '#c2410c', bg4: '#fb923c',
    accent: '#fdba74', glow1: '#ea580c', glow2: '#9a3412',
  },
  'amor': {
    bg1: '#3b0015', bg2: '#881337', bg3: '#be123c', bg4: '#fb7185',
    accent: '#fda4af', glow1: '#e11d48', glow2: '#9f1239',
  },
  'força': {
    bg1: '#1e0a3e', bg2: '#4c1d95', bg3: '#7c3aed', bg4: '#a78bfa',
    accent: '#c4b5fd', glow1: '#8b5cf6', glow2: '#6d28d9',
  },
  'fé': {
    bg1: '#052e16', bg2: '#14532d', bg3: '#16a34a', bg4: '#4ade80',
    accent: '#86efac', glow1: '#22c55e', glow2: '#15803d',
  },
  'esperança': {
    bg1: '#2d1a00', bg2: '#78350f', bg3: '#d97706', bg4: '#fbbf24',
    accent: '#fde68a', glow1: '#f59e0b', glow2: '#b45309',
  },
  'gratidão': {
    bg1: '#042f2e', bg2: '#134e4a', bg3: '#0d9488', bg4: '#2dd4bf',
    accent: '#5eead4', glow1: '#14b8a6', glow2: '#0f766e',
  },
  'vitória': {
    bg1: '#450a0a', bg2: '#7f1d1d', bg3: '#dc2626', bg4: '#f87171',
    accent: '#fca5a5', glow1: '#ef4444', glow2: '#b91c1c',
  },
  'paz': {
    bg1: '#0c1445', bg2: '#1e3a8a', bg3: '#3b82f6', bg4: '#7dd3fc',
    accent: '#bae6fd', glow1: '#0ea5e9', glow2: '#0369a1',
  },
  'default': {
    bg1: '#1a0f00', bg2: '#44290a', bg3: '#a16207', bg4: '#d4a853',
    accent: '#fde68a', glow1: '#ca8a04', glow2: '#854d0e',
  },
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

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/**
 * Create a full cinematic SVG with VIVID gradient background + text
 */
function createCinematicSVG(verse, width, height) {
  const palette = THEME_PALETTES[verse.theme] || THEME_PALETTES['default'];
  const { bg1, bg2, bg3, bg4, accent, glow1, glow2 } = palette;

  // Text sizing — make it BIG and readable
  const len = verse.text.length;
  const fontSize = len > 120 ? 42 : len > 90 ? 48 : len > 70 ? 54 : len > 50 ? 60 : 68;
  const maxChars = len > 120 ? 30 : len > 90 ? 26 : len > 70 ? 22 : len > 50 ? 20 : 16;
  const lines = wrapText(verse.text, maxChars);
  const lineHeight = fontSize * 1.55;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height / 2) - (totalTextHeight / 2) + 50;

  const textLines = lines.map((line, i) => {
    const y = startY + (i * lineHeight);
    return `<text x="${width / 2}" y="${y}" 
      font-family="Georgia, 'Times New Roman', serif" 
      font-size="${fontSize}" font-weight="bold" font-style="italic" 
      fill="white" text-anchor="middle" 
      filter="url(#textShadow)">${escapeXml(line)}</text>`;
  }).join('\n    ');

  const refY = startY + totalTextHeight + 55;
  const crossY = startY - 100;
  const watermarkY = height - 55;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- MAIN BACKGROUND: radial gradient from bright center to dark edges -->
    <radialGradient id="bgMain" cx="50%" cy="42%" r="75%" fx="50%" fy="42%">
      <stop offset="0%" stop-color="${bg3}"/>
      <stop offset="35%" stop-color="${bg2}"/>
      <stop offset="70%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>

    <!-- BRIGHT CENTER GLOW -->
    <radialGradient id="centerGlow" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stop-color="${bg4}" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="${bg3}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>

    <!-- TOP DIVINE LIGHT BEAM -->
    <radialGradient id="topBeam" cx="50%" cy="-10%" r="60%">
      <stop offset="0%" stop-color="${bg4}" stop-opacity="0.45"/>
      <stop offset="40%" stop-color="${glow1}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>

    <!-- SECONDARY GLOW (lower) -->
    <radialGradient id="lowerGlow" cx="50%" cy="80%" r="45%">
      <stop offset="0%" stop-color="${glow2}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>

    <!-- LEFT ACCENT -->
    <radialGradient id="leftAccent" cx="10%" cy="50%" r="40%">
      <stop offset="0%" stop-color="${glow1}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>

    <!-- RIGHT ACCENT -->
    <radialGradient id="rightAccent" cx="90%" cy="50%" r="40%">
      <stop offset="0%" stop-color="${glow2}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>

    <!-- TEXT SHADOW — strong contrast -->
    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="15" flood-color="rgba(0,0,0,0.95)"/>
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgba(0,0,0,0.8)"/>
    </filter>

    <!-- GLOW for accent text -->
    <filter id="accentGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${glow1}80"/>
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.8)"/>
    </filter>

    <!-- BLUR for bokeh particles -->
    <filter id="bokeh" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>

    <!-- SMALL sparkle -->
    <filter id="sparkle" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
  </defs>

  <!-- ═══ BACKGROUND LAYERS ═══ -->
  <!-- Base: solid black -->
  <rect width="${width}" height="${height}" fill="#000"/>
  
  <!-- Layer 1: main radial gradient -->
  <rect width="${width}" height="${height}" fill="url(#bgMain)"/>
  
  <!-- Layer 2: bright center glow -->
  <rect width="${width}" height="${height}" fill="url(#centerGlow)"/>
  
  <!-- Layer 3: top divine light beam -->
  <rect width="${width}" height="${height}" fill="url(#topBeam)"/>
  
  <!-- Layer 4: bottom glow -->
  <rect width="${width}" height="${height}" fill="url(#lowerGlow)"/>

  <!-- Layer 5: side accents -->
  <rect width="${width}" height="${height}" fill="url(#leftAccent)"/>
  <rect width="${width}" height="${height}" fill="url(#rightAccent)"/>

  <!-- ═══ BOKEH PARTICLES ═══ -->
  <circle cx="150" cy="180" r="25" fill="${bg4}" opacity="0.2" filter="url(#bokeh)"/>
  <circle cx="920" cy="280" r="18" fill="${glow1}" opacity="0.18" filter="url(#bokeh)"/>
  <circle cx="200" cy="850" r="22" fill="${accent}" opacity="0.15" filter="url(#bokeh)"/>
  <circle cx="880" cy="780" r="20" fill="${bg4}" opacity="0.12" filter="url(#bokeh)"/>
  <circle cx="540" cy="100" r="30" fill="${bg4}" opacity="0.15" filter="url(#bokeh)"/>
  <circle cx="700" cy="950" r="15" fill="${glow1}" opacity="0.1" filter="url(#bokeh)"/>

  <!-- Small sparkle stars -->
  <circle cx="300" cy="150" r="3" fill="white" opacity="0.7" filter="url(#sparkle)"/>
  <circle cx="800" cy="220" r="2.5" fill="white" opacity="0.6" filter="url(#sparkle)"/>
  <circle cx="120" cy="500" r="2" fill="white" opacity="0.5" filter="url(#sparkle)"/>
  <circle cx="960" cy="600" r="2.5" fill="white" opacity="0.55" filter="url(#sparkle)"/>
  <circle cx="400" cy="920" r="2" fill="white" opacity="0.45" filter="url(#sparkle)"/>
  <circle cx="700" cy="130" r="1.5" fill="white" opacity="0.4" filter="url(#sparkle)"/>
  <circle cx="250" cy="700" r="2" fill="white" opacity="0.35" filter="url(#sparkle)"/>
  <circle cx="850" cy="450" r="1.5" fill="white" opacity="0.4" filter="url(#sparkle)"/>

  <!-- ═══ DECORATIVE CROSS ═══ -->
  <g transform="translate(${width/2}, ${crossY})" opacity="0.7">
    <line x1="0" y1="-28" x2="0" y2="28" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    <line x1="-18" y1="-8" x2="18" y2="-8" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Decorative horizontal rules -->
  <line x1="${width * 0.25}" y1="${crossY + 50}" x2="${width * 0.75}" y2="${crossY + 50}" stroke="${accent}" stroke-width="0.8" opacity="0.35"/>

  <!-- ═══ OPENING QUOTE ═══ -->
  <text x="${width * 0.08}" y="${startY - 5}" font-family="Georgia, serif" font-size="140" fill="${accent}" opacity="0.12" filter="url(#textShadow)">\u201C</text>

  <!-- ═══ VERSE TEXT ═══ -->
  ${textLines}

  <!-- ═══ CLOSING QUOTE ═══ -->
  <text x="${width * 0.85}" y="${startY + totalTextHeight + 15}" font-family="Georgia, serif" font-size="140" fill="${accent}" opacity="0.12" filter="url(#textShadow)">\u201D</text>

  <!-- ═══ REFERENCE ═══ -->
  <text x="${width / 2}" y="${refY}" 
    font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" 
    fill="${accent}" text-anchor="middle" 
    filter="url(#accentGlow)" letter-spacing="3">${escapeXml(verse.ref.toUpperCase())}</text>

  <!-- Bottom decorative line -->
  <line x1="${width * 0.3}" y1="${refY + 25}" x2="${width * 0.7}" y2="${refY + 25}" stroke="${accent}" stroke-width="0.8" opacity="0.3"/>

  <!-- ═══ WATERMARK ═══ -->
  <text x="${width / 2}" y="${watermarkY}" 
    font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500" 
    fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="2">✝  @luz.da.palavra.oficial</text>
</svg>`;
}

/**
 * Generate a verse image (1080x1080)
 */
async function generateImage(verse) {
  const width = 1080;
  const height = 1080;

  const filename = `verse_${verse.ref.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s:]/g, '_').toLowerCase()}.png`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  // Skip if already exists
  if (fs.existsSync(outputPath)) {
    console.log(`🎨 Image exists: ${filename}`);
    return outputPath;
  }

  console.log(`🎨 Generating vivid image: ${filename}...`);

  const svg = createCinematicSVG(verse, width, height);
  const svgBuffer = Buffer.from(svg);

  await sharp(svgBuffer)
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log(`🎨 ✅ Image generated: ${filename}`);
  return outputPath;
}

module.exports = { generateImage };
