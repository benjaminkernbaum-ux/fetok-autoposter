/**
 * FéTok Video Generator v3.0
 * Input: 1080×1920 PNG (already 9:16 portrait)
 * Output: 1080×1920 MP4, 10s, gentle zoom + fade
 */

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

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

    ffmpeg()
      .input(imagePath)
      .inputOptions(['-loop', '1'])
      .videoFilters([
        // Image is already 1080x1920. Gentle zoom from 1.0 to 1.08 centered.
        "zoompan=z='1.0+on*0.00003':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1080x1920:fps=30",
        // Fade in/out
        'fade=t=in:st=0:d=1.5',
        'fade=t=out:st=8.5:d=1.5',
      ])
      .outputOptions([
        '-c:v', 'libx264',
        '-t', '10',
        '-pix_fmt', 'yuv420p',
        '-preset', 'medium',
        '-crf', '20',
      ])
      .output(outputPath)
      .on('end', () => {
        console.log(`✅ Video ready: ${filename}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`❌ Video error: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

module.exports = { generateVideo };
