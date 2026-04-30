/**
 * FéTok Image Generator
 * Creates cinematic verse images using Sharp (SVG text overlay on backgrounds)
 * No native build tools needed — works on Windows + Linux
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Background mapping to existing hero images
const bgMap = {
  golden_rays: 'hero_divine_cross.png',
  walking_water: 'hero_walking_water.png',
  cross_light: 'hero_divine_cross.png',
  divine_light: 'hero_bible_light.png',
  prayer_hands: 'hero_prayer_hands.png',
  shepherd: 'hero_shepherd_mountain.png',
  dove: 'hero_dove_sky.png',
  narrow_path: 'hero_narrow_path.png',
  olive_tree: 'hero_olive_tree.png',
  mountain: 'hero_shepherd_mountain.png',
  bible_light: 'hero_bible_light.png',
  sunrise: 'hero_dove_sky.png',
};

const HERO_DIR = path.resolve(__dirname, '../../tiktok-jesus/img');
const OUTPUT_DIR = path.resolve(__dirname, '../output');

/**
 * Word wrap text for SVG
 */
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
 * Escape XML special characters
 */
function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/**
 * Generate SVG text overlay
 */
function createTextOverlay(verse, width, height) {
  const fontSize = verse.text.length > 80 ? 46 : verse.text.length > 50 ? 54 : 62;
  const maxChars = verse.text.length > 80 ? 28 : verse.text.length > 50 ? 24 : 20;
  const lines = wrapText(verse.text, maxChars);
  const lineHeight = fontSize * 1.4;
  const totalHeight = lines.length * lineHeight;
  const startY = (height / 2) - (totalHeight / 2);

  const textLines = lines.map((line, i) => {
    const y = startY + (i * lineHeight);
    return `<text x="${width / 2}" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="bold" font-style="italic" fill="white" text-anchor="middle" filter="url(#shadow)">${escapeXml(line)}</text>`;
  }).join('\n    ');

  const refY = startY + totalHeight + 40;
  const watermarkY = height - 40;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="8" flood-color="rgba(0,0,0,0.85)" />
    </filter>
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.35)" />
      <stop offset="40%" stop-color="rgba(0,0,0,0.6)" />
      <stop offset="60%" stop-color="rgba(0,0,0,0.6)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.45)" />
    </linearGradient>
  </defs>
  
  <!-- Dark overlay -->
  <rect width="${width}" height="${height}" fill="url(#overlay)" />
  
  <!-- Verse text -->
  ${textLines}
  
  <!-- Reference -->
  <text x="${width / 2}" y="${refY}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600" fill="rgba(212,168,83,0.95)" text-anchor="middle" filter="url(#shadow)">${escapeXml(verse.ref)}</text>
  
  <!-- Watermark -->
  <text x="${width / 2}" y="${watermarkY}" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="500" fill="rgba(255,255,255,0.45)" text-anchor="middle">✝ @luz.da.palavra.oficial</text>
</svg>`;
}

/**
 * Generate a verse image (1080x1080) with cinematic background + text overlay
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

  // Load background
  const bgFile = bgMap[verse.bg] || 'hero_divine_cross.png';
  const bgPath = path.join(HERO_DIR, bgFile);

  let background;
  if (fs.existsSync(bgPath)) {
    background = sharp(bgPath).resize(width, height, { fit: 'cover' });
  } else {
    // Fallback: solid dark background
    background = sharp({
      create: { width, height, channels: 4, background: { r: 10, g: 8, b: 18, alpha: 1 } }
    });
  }

  // Create SVG text overlay
  const svgOverlay = createTextOverlay(verse, width, height);
  const svgBuffer = Buffer.from(svgOverlay);

  // Composite text on background
  await background
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log(`🎨 Image generated: ${filename}`);
  return outputPath;
}

module.exports = { generateImage };
