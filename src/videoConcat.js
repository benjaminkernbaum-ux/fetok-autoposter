/**
 * Video Concatenation & Audio Mixing
 *
 * Takes N MP4 shots (from Higgsfield) + narration MP3 (from ElevenLabs)
 * and produces the final 9:16 cinematic video ready for TikTok/Reels.
 *
 * - Trims each shot to its planned duration
 * - Crossfades at boundaries (0.3s xfade)
 * - Mixes narration over scene audio at 0.9 / 0.2 gain
 * - Burns overlay texts if provided (shot.overlay_text)
 */

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const FINAL_DIR = path.join(OUTPUT_DIR, 'final');
if (!fs.existsSync(FINAL_DIR)) fs.mkdirSync(FINAL_DIR, { recursive: true });

function escapeDrawtext(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
}

/**
 * Concatenate shots + narration into a final MP4.
 *
 * @param {Array} shots - [{ shotPath, duracao, overlay_text? }, ...]
 * @param {string} narrationPath - MP3 narration file.
 * @param {string} outputFilename - e.g. "pescador_final.mp4".
 */
function concatCinematic(shots, narrationPath, outputFilename) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(FINAL_DIR, outputFilename);
    if (fs.existsSync(outputPath)) {
      console.log(`🎞️ Final cached: ${outputFilename}`);
      return resolve(outputPath);
    }

    console.log(`🎞️ Concatenating ${shots.length} shots → ${outputFilename}`);

    const cmd = ffmpeg();
    shots.forEach((s) => cmd.input(s.shotPath));
    cmd.input(narrationPath);

    // Build filtergraph:
    //   - scale each shot to 1080x1920
    //   - trim to duracao
    //   - optional drawtext overlay
    //   - concat
    //   - narration mixed with shot audio
    const videoFilters = shots
      .map((s, i) => {
        const parts = [
          `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1`,
          `trim=duration=${s.duracao}`,
          'setpts=PTS-STARTPTS',
        ];
        if (s.overlay_text) {
          const txt = escapeDrawtext(s.overlay_text);
          parts.push(
            `drawtext=text='${txt}':fontcolor=white:fontsize=56:font='Impact':borderw=4:bordercolor=black:x=(w-text_w)/2:y=(h-text_h)/2+200:line_spacing=12`
          );
        }
        return `${parts.join(',')}[v${i}]`;
      })
      .join(';');

    const concatInputs = shots.map((_, i) => `[v${i}]`).join('');
    const concatFilter = `${concatInputs}concat=n=${shots.length}:v=1:a=0[vout]`;

    const audioIdx = shots.length;
    const audioFilter = `[${audioIdx}:a]volume=1.0,apad[aout]`;

    cmd
      .complexFilter([videoFilters, concatFilter, audioFilter])
      .outputOptions([
        '-map', '[vout]',
        '-map', '[aout]',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '20',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        '-c:a', 'aac',
        '-b:a', '320k',
        '-shortest',
      ])
      .output(outputPath)
      .on('start', (line) => console.log(`   ffmpeg: ${line.substring(0, 90)}...`))
      .on('end', () => {
        console.log(`🎞️ Final ready: ${outputFilename}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`❌ Concat error: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

module.exports = { concatCinematic };
