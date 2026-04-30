/**
 * FéTok Image Generator v2.0
 * Creates CINEMATIC verse images using Sharp + SVG
 * Beautiful gradient backgrounds — no external images needed
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../output');

/* ═══════════════════════════════════════════════════════════
   CINEMATIC GRADIENT PALETTES — one per theme
   Each has a rich multi-stop gradient + accent glow
   ═══════════════════════════════════════════════════════════ */
const THEME_PALETTES = {
  proteção: {
    stops: ['#0a1628', '#0d2847', '#0f3460', '#1a1a5e', '#0a1628'],
    accent: '#4a90d9',
    glow: 'rgba(74,144,217,0.3)',
    icon: '🛡️',
  },
  coragem: {
    stops: ['#1a0a00', '#3d1c00', '#6b3000', '#8b4513', '#3d1c00'],
    accent: '#ff8c42',
    glow: 'rgba(255,140,66,0.25)',
    icon: '⚔️',
  },
  amor: {
    stops: ['#1a0010', '#3d0024', '#6b0037', '#8b1a4a', '#3d0024'],
    accent: '#ff4081',
    glow: 'rgba(255,64,129,0.25)',
    icon: '❤️',
  },
  força: {
    stops: ['#0a0020', '#1a0040', '#2d1070', '#4a1a8a', '#1a0040'],
    accent: '#b388ff',
    glow: 'rgba(179,136,255,0.3)',
    icon: '💪',
  },
  fé: {
    stops: ['#0a1a10', '#0d3320', '#1a5c3a', '#0d3320', '#0a1a10'],
    accent: '#69f0ae',
    glow: 'rgba(105,240,174,0.25)',
    icon: '✝️',
  },
  esperança: {
    stops: ['#1a1000', '#3d2800', '#6b4500', '#d4a853', '#6b4500'],
    accent: '#ffd54f',
    glow: 'rgba(255,213,79,0.3)',
    icon: '🌅',
  },
  gratidão: {
    stops: ['#0a1a1a', '#0d3333', '#1a5c5c', '#0d3333', '#0a1a1a'],
    accent: '#4dd0e1',
    glow: 'rgba(77,208,225,0.25)',
    icon: '🙌',
  },
  vitória: {
    stops: ['#1a0a00', '#4a1500', '#7a2000', '#b03000', '#4a1500'],
    accent: '#ff6e40',
    glow: 'rgba(255,110,64,0.3)',
    icon: '👑',
  },
  paz: {
    stops: ['#05101a', '#0a2040', '#0f3060', '#1a4080', '#0a2040'],
    accent: '#80cbc4',
    glow: 'rgba(128,203,196,0.25)',
    icon: '🕊️',
  },
  // Fallback
  default: {
    stops: ['#06060b', '#0d1117', '#161b22', '#0d1117', '#06060b'],
    accent: '#d4a853',
    glow: 'rgba(212,168,83,0.3)',
    icon: '✝️',
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
 * Create a full cinematic SVG image (background + text)
 * This is rendered entirely in SVG — no external images needed
 */
function createCinematicSVG(verse, width, height) {
  const palette = THEME_PALETTES[verse.theme] || THEME_PALETTES.default;
  const [c1, c2, c3, c4, c5] = palette.stops;

  // Text sizing
  const len = verse.text.length;
  const fontSize = len > 100 ? 38 : len > 80 ? 44 : len > 60 ? 50 : len > 40 ? 56 : 64;
  const maxChars = len > 100 ? 32 : len > 80 ? 28 : len > 60 ? 24 : len > 40 ? 22 : 18;
  const lines = wrapText(verse.text, maxChars);
  const lineHeight = fontSize * 1.5;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height / 2) - (totalTextHeight / 2) + 40;

  const textLines = lines.map((line, i) => {
    const y = startY + (i * lineHeight);
    return `<text x="${width / 2}" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="bold" font-style="italic" fill="white" text-anchor="middle" filter="url(#textGlow)">${escapeXml(line)}</text>`;
  }).join('\n    ');

  const refY = startY + totalTextHeight + 50;
  const watermarkY = height - 50;

  // Decorative cross position
  const crossY = startY - 80;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Main gradient background -->
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="${c3}"/>
      <stop offset="40%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c1}"/>
    </radialGradient>

    <!-- Accent glow -->
    <radialGradient id="accentGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${palette.glow}"/>
      <stop offset="60%" stop-color="transparent"/>
    </radialGradient>

    <!-- Top light rays -->
    <radialGradient id="topLight" cx="50%" cy="0%" r="60%">
      <stop offset="0%" stop-color="${palette.glow}"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>

    <!-- Bottom vignette -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="50%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.6)"/>
    </radialGradient>

    <!-- Text glow filter -->
    <filter id="textGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="rgba(0,0,0,0.9)"/>
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.7)"/>
    </filter>

    <!-- Soft glow for decorative elements -->
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Star sparkle -->
    <filter id="sparkle" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
  </defs>

  <!-- === BACKGROUND LAYERS === -->
  <!-- Base gradient -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

  <!-- Accent glow center -->
  <rect width="${width}" height="${height}" fill="url(#accentGlow)"/>

  <!-- Top divine light -->
  <rect width="${width}" height="${height}" fill="url(#topLight)" opacity="0.5"/>

  <!-- Vignette edges -->
  <rect width="${width}" height="${height}" fill="url(#vignette)"/>

  <!-- === DECORATIVE ELEMENTS === -->
  <!-- Large soft glow orb -->
  <circle cx="${width/2}" cy="${height * 0.38}" r="200" fill="${palette.glow}" filter="url(#softGlow)" opacity="0.4"/>

  <!-- Small accent orbs -->
  <circle cx="${width * 0.2}" cy="${height * 0.25}" r="80" fill="${palette.glow}" filter="url(#softGlow)" opacity="0.15"/>
  <circle cx="${width * 0.8}" cy="${height * 0.7}" r="60" fill="${palette.glow}" filter="url(#softGlow)" opacity="0.12"/>

  <!-- Subtle stars -->
  <circle cx="180" cy="120" r="2" fill="white" opacity="0.6" filter="url(#sparkle)"/>
  <circle cx="900" cy="200" r="1.5" fill="white" opacity="0.5" filter="url(#sparkle)"/>
  <circle cx="350" cy="900" r="2" fill="white" opacity="0.4" filter="url(#sparkle)"/>
  <circle cx="780" cy="850" r="1.5" fill="white" opacity="0.5" filter="url(#sparkle)"/>
  <circle cx="100" cy="600" r="1" fill="white" opacity="0.3" filter="url(#sparkle)"/>
  <circle cx="950" cy="500" r="1.5" fill="white" opacity="0.35" filter="url(#sparkle)"/>

  <!-- Decorative cross -->
  <g transform="translate(${width/2}, ${crossY})" opacity="0.6">
    <line x1="0" y1="-20" x2="0" y2="20" stroke="${palette.accent}" stroke-width="2.5" opacity="0.8"/>
    <line x1="-12" y1="-6" x2="12" y2="-6" stroke="${palette.accent}" stroke-width="2.5" opacity="0.8"/>
  </g>

  <!-- Top decorative line -->
  <line x1="${width * 0.3}" y1="${crossY + 40}" x2="${width * 0.7}" y2="${crossY + 40}" stroke="${palette.accent}" stroke-width="0.5" opacity="0.3"/>

  <!-- === TEXT CONTENT === -->
  <!-- Opening quote mark -->
  <text x="${width * 0.12}" y="${startY - 10}" font-family="Georgia, serif" font-size="120" fill="${palette.accent}" opacity="0.15">"</text>

  <!-- Verse text -->
  ${textLines}

  <!-- Closing quote mark -->
  <text x="${width * 0.82}" y="${startY + totalTextHeight + 10}" font-family="Georgia, serif" font-size="120" fill="${palette.accent}" opacity="0.15">"</text>

  <!-- Reference -->
  <text x="${width / 2}" y="${refY}" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="${palette.accent}" text-anchor="middle" filter="url(#textGlow)" letter-spacing="2">${escapeXml(verse.ref)}</text>

  <!-- Bottom decorative line -->
  <line x1="${width * 0.35}" y1="${refY + 20}" x2="${width * 0.65}" y2="${refY + 20}" stroke="${palette.accent}" stroke-width="0.5" opacity="0.4"/>

  <!-- Watermark -->
  <text x="${width / 2}" y="${watermarkY}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="500" fill="rgba(255,255,255,0.35)" text-anchor="middle" letter-spacing="1">✝  @luz.da.palavra.oficial</text>
</svg>`;
}

/**
 * Generate a verse image (1080x1080) with cinematic SVG background
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

  console.log(`🎨 Generating cinematic image: ${filename}...`);

  // Create full cinematic SVG (background + text in one)
  const svg = createCinematicSVG(verse, width, height);
  const svgBuffer = Buffer.from(svg);

  // Render SVG to PNG
  await sharp(svgBuffer)
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log(`🎨 Image generated: ${filename}`);
  return outputPath;
}

module.exports = { generateImage };
