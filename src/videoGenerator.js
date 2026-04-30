/**
 * FéTok Video Generator v2.0
 * Converts verse images into TikTok-ready 9:16 videos using FFmpeg
 * Optimized for cinematic gradient images — no black bars
 */

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const OUTPUT_DIR = path.resolve(__dirname, '../output');

/**
 * Generate a TikTok video from a verse image
 * - Input: 1080x1080 PNG (cinematic gradient + text)
 * - Output: 1080x1920 MP4 (9:16), 10 seconds
 * - Effects: Slow zoom starting CENTERED on the text, fade in/out
 * 
 * Strategy: Use zoompan to fill the 9:16 canvas by zooming into
 * the center of the 1080x1080 image, starting at ~1.78x zoom
 * (1920/1080) and slowly pushing in further. This eliminates
 * black bars and keeps text visible.
 */
function generateVideo(imagePath, verse) {
  return new Promise((resolve, reject) => {
    const filename = `video_${verse.ref.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s:]/g, '_').toLowerCase()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Skip if video already exists
    if (fs.existsSync(outputPath)) {
      console.log(`🎬 Video already exists: ${filename}`);
      return resolve(outputPath);
    }

    console.log(`🎬 Generating video: ${filename}...`);

    ffmpeg()
      .input(imagePath)
      .inputOptions(['-loop', '1'])
      .videoFilters([
        // zoompan: start zoomed at 1.78x (fills 9:16), slowly zoom to 1.95x
        // x/y centered on the image center, output 1080x1920
        "zoompan=z='1.78+on*0.00006':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1080x1920:fps=30",
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
