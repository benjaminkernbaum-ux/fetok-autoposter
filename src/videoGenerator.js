/**
 * FéTok Video Generator v5.0
 * Input: 1080×1920 PNG with text already baked in
 * Output: 1080×1920 MP4, 10s, gentle zoom + fade
 */

const { execFileSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../output');

function generateVideo(imagePath, verse) {
  return new Promise((resolve, reject) => {
    const filename = `video_${verse.ref.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s:]/g, '_').toLowerCase()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(outputPath)) {
      console.log(`🎬 Video exists: ${filename}`);
      return resolve(outputPath);
    }

    console.log(`🎬 Generating video: ${filename}...`);

    const args = [
      '-y',
      '-loop', '1',
      '-i', imagePath,
      '-vf', "zoompan=z='1.0+on*0.00002':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1080x1920:fps=30,fade=t=in:st=0:d=1.5,fade=t=out:st=8.5:d=1.5",
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
      console.error(`❌ Video error: ${err.stderr ? err.stderr.toString().slice(-300) : err.message}`);
      reject(err);
    }
  });
}

module.exports = { generateVideo };
