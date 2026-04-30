/**
 * FéTok Video Generator v4.0
 * Burns text INTO the video using FFmpeg drawtext
 * Input: 1080×1920 PNG (gradient background only)
 * Output: 1080×1920 MP4 with text overlay, 10s, gentle zoom + fade
 */

const { execFileSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../output');

const ACCENT_COLORS = {
  'proteção': '93c5fd', 'coragem': 'fdba74', 'amor': 'fda4af',
  'força': 'c4b5fd', 'fé': '86efac', 'esperança': 'fde68a',
  'gratidão': '5eead4', 'vitória': 'fca5a5', 'paz': 'bae6fd',
  'default': 'fde68a',
};

function ffEscape(str) {
  return str.replace(/'/g, "\u2019").replace(/:/g, '\\:').replace(/%/g, '%%');
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

function generateVideo(imagePath, verse) {
  return new Promise((resolve, reject) => {
    const filename = `video_${verse.ref.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s:]/g, '_').toLowerCase()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(outputPath)) {
      console.log(`🎬 Video exists: ${filename}`);
      return resolve(outputPath);
    }

    console.log(`🎬 Generating video: ${filename}...`);

    const accentHex = ACCENT_COLORS[verse.theme] || ACCENT_COLORS['default'];

    const len = verse.text.length;
    const fontSize = len > 120 ? 48 : len > 90 ? 54 : len > 70 ? 60 : len > 50 ? 68 : 80;
    const maxChars = len > 120 ? 24 : len > 90 ? 22 : len > 70 ? 18 : len > 50 ? 16 : 14;
    const lines = wrapText(verse.text, maxChars);
    
    const lineHeight = fontSize * 1.6;
    const totalH = lines.length * lineHeight;
    const startY = Math.round(960 - totalH / 2);
    
    const textFilters = lines.map((line, i) => {
      const y = startY + Math.round(i * lineHeight);
      const escaped = ffEscape(line);
      return `drawtext=text='${escaped}':fontsize=${fontSize}:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=${y}`;
    });

    const refY = startY + Math.round(lines.length * lineHeight) + 60;
    const refEscaped = ffEscape(verse.ref.toUpperCase());
    const refFontSize = Math.round(fontSize * 0.55);
    textFilters.push(
      `drawtext=text='${refEscaped}':fontsize=${refFontSize}:fontcolor=0x${accentHex}:borderw=2:bordercolor=black:x=(w-text_w)/2:y=${refY}`
    );

    textFilters.push(
      `drawtext=text='@luz.da.palavra.oficial':fontsize=22:fontcolor=white@0.35:x=(w-text_w)/2:y=h-80`
    );

    const filterChain = [
      "zoompan=z='1.0+on*0.00002':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1080x1920:fps=30",
      'fade=t=in:st=0:d=1.5',
      'fade=t=out:st=8.5:d=1.5',
      ...textFilters,
    ].join(',');

    const args = [
      '-y',
      '-loop', '1',
      '-i', imagePath,
      '-vf', filterChain,
      '-c:v', 'libx264',
      '-t', '10',
      '-pix_fmt', 'yuv420p',
      '-preset', 'medium',
      '-crf', '20',
      outputPath,
    ];

    try {
      execFileSync(ffmpegPath, args, { stdio: 'pipe', timeout: 120000 });
      console.log(`✅ Video ready: ${filename}`);
      resolve(outputPath);
    } catch (err) {
      console.error(`❌ drawtext failed, trying without text...`);
      // Fallback: no text overlay
      try {
        const fallbackArgs = [
          '-y', '-loop', '1', '-i', imagePath,
          '-vf', "zoompan=z='1.0+on*0.00002':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1080x1920:fps=30,fade=t=in:st=0:d=1.5,fade=t=out:st=8.5:d=1.5",
          '-c:v', 'libx264', '-t', '10', '-pix_fmt', 'yuv420p',
          '-preset', 'medium', '-crf', '20', outputPath,
        ];
        execFileSync(ffmpegPath, fallbackArgs, { stdio: 'pipe', timeout: 120000 });
        console.log(`✅ Video ready (gradient only): ${filename}`);
        resolve(outputPath);
      } catch (err2) {
        reject(err2);
      }
    }
  });
}

module.exports = { generateVideo };
