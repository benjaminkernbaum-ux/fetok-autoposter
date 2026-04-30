/**
 * FéTok Video Generator
 * Converts verse images into TikTok-ready 9:16 videos using FFmpeg
 */

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const OUTPUT_DIR = path.resolve(__dirname, '../output');

/**
 * Generate a TikTok video from a verse image
 * - Input: 1080x1080 PNG
 * - Output: 1080x1920 MP4 (9:16), 10 seconds
 * - Effects: Ken Burns zoom, fade in/out
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
        // Scale to 1080x1920 with padding (9:16 format)
        'scale=1080:1920:force_original_aspect_ratio=decrease',
        'pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
        // Ken Burns slow zoom effect
        "zoompan=z='min(zoom+0.0008,1.15)':d=300:s=1080x1920:fps=30",
        // Fade in/out
        'fade=t=in:st=0:d=1',
        'fade=t=out:st=9:d=1',
      ])
      .outputOptions([
        '-c:v', 'libx264',
        '-t', '10',
        '-pix_fmt', 'yuv420p',
        '-preset', 'medium',
        '-crf', '18',
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
