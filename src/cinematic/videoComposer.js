// Compose the final 1080x1920 TikTok video.
//
// Pipeline per shot:
//   still.jpg  →  scale+pad to 1080x1920 (centered, blurred bg fill if needed)
//             →  Ken Burns (zoompan over shot.durationSec @ 30fps)
//             →  fade in/out at the joints (handled by xfade transition)
//
// Then all shots are xfade-chained (0.6s overlap) into one continuous video.
// Audio: concat all narration MP3s end-to-end with a tiny gap, then mix with
// ambient music ducked under the narration via sidechaincompress.
// Captions are burned in last via ass filter.

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const FPS = 30;
const W = 1080;
const H = 1920;
const XFADE_SEC = 0.6;
const AUDIO_GAP_SEC = 0.18; // tiny pause between narration shots
const NARRATION_FADE = 0.08;
const VIDEO_FADE_IN = 0.5;
const VIDEO_FADE_OUT = 0.8;

function runFfmpeg(args, { label = 'ffmpeg' } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    p.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${label} exited ${code}\n${stderr.slice(-2000)}`));
    });
  });
}

function kenBurnsExpr({ durationSec, mode, zStart, zEnd }) {
  // zoompan operates frame-by-frame. We compute zoom as linear interpolation
  // between zStart and zEnd across the shot's frame range.
  const frames = Math.max(2, Math.round(durationSec * FPS));
  const z = mode === 'in'
    ? `${zStart}+(${zEnd}-${zStart})*on/${frames - 1}`
    : `${zStart}+(${zEnd}-${zStart})*on/${frames - 1}`;
  // Keep subject roughly centered while zooming.
  return { z, frames };
}

/**
 * Build one shot's animated MP4 (silent).
 */
async function renderShotClip({ imageFile, durationSec, kenBurns, zStart, zEnd, outFile }) {
  const { z, frames } = kenBurnsExpr({ durationSec, mode: kenBurns, zStart, zEnd });

  // Two-stage filter:
  //   1) pre-scale image to large canvas so zoompan has detail to crop into
  //   2) zoompan + Ken Burns, output 1080x1920
  const vf = [
    `scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase`,
    `crop=${W * 2}:${H * 2}`,
    `zoompan=z='${z}':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=${FPS}`,
    `format=yuv420p`,
  ].join(',');

  await runFfmpeg(
    [
      '-y',
      '-loop', '1',
      '-i', imageFile,
      '-t', durationSec.toFixed(3),
      '-vf', vf,
      '-r', String(FPS),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'medium',
      '-crf', '18',
      '-movflags', '+faststart',
      outFile,
    ],
    { label: `shot ${path.basename(outFile)}` }
  );
}

/**
 * Chain all shot clips with xfade transitions into one master video (silent).
 */
async function xfadeChain({ clips, durations, outFile }) {
  // Build input list and filter graph
  const inputs = [];
  clips.forEach((c) => inputs.push('-i', c));

  // Cumulative offsets for xfade: offset_i = sum(durations[0..i]) - XFADE_SEC * (i+1) wait — careful.
  // Correct: offset_i = (sum durations[0..i]) - XFADE_SEC, but accounting for prior overlaps.
  // For a chain xfade where each transition consumes XFADE_SEC of overlap:
  //   t0 = duration[0] - XFADE_SEC
  //   t1 = t0 + duration[1] - XFADE_SEC
  //   ...
  // So offset_i = sum(durations[0..i]) - XFADE_SEC*(i+1)
  const filterParts = [];
  let prevLabel = '0:v';
  let cumulative = 0;

  for (let i = 1; i < clips.length; i++) {
    cumulative += durations[i - 1];
    const offset = (cumulative - XFADE_SEC * i).toFixed(3);
    const outLabel = i === clips.length - 1 ? 'vout' : `v${i}`;
    filterParts.push(
      `[${prevLabel}][${i}:v]xfade=transition=fade:duration=${XFADE_SEC}:offset=${offset}[${outLabel}]`
    );
    prevLabel = outLabel;
  }

  // If only one clip, just stream-copy through a passthrough graph
  const filter = filterParts.length
    ? filterParts.join(';')
    : `[0:v]copy[vout]`;

  // Total duration after xfades: sum(durations) - XFADE_SEC * (n-1)
  const totalSec = durations.reduce((a, b) => a + b, 0) - XFADE_SEC * Math.max(0, clips.length - 1);
  const fadeOutStart = Math.max(0, totalSec - VIDEO_FADE_OUT);

  const finalFilter = `${filter};[vout]fade=t=in:st=0:d=${VIDEO_FADE_IN},fade=t=out:st=${fadeOutStart.toFixed(3)}:d=${VIDEO_FADE_OUT}[v]`;

  await runFfmpeg(
    [
      '-y',
      ...inputs,
      '-filter_complex', finalFilter,
      '-map', '[v]',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'medium',
      '-crf', '18',
      '-r', String(FPS),
      '-movflags', '+faststart',
      outFile,
    ],
    { label: 'xfade chain' }
  );

  return { totalSec };
}

/**
 * Concatenate per-shot narration MP3s with a small gap between them.
 * Returns the path to the assembled narration WAV/MP3 and an array of shot start/end
 * times in the final timeline (used by captionBuilder).
 */
async function assembleNarration({ narrationShots, outFile, videoTotalSec }) {
  // Build a filter_complex that concatenates each MP3 with a silent gap.
  // We need each shot's audio to start at a known timestamp so captions line up
  // with the video. Since the video uses xfade overlaps, each shot's *visual*
  // start in the final timeline is: sum(prev shot durations) - XFADE_SEC * (i)
  // We anchor narration to those visual starts.

  const inputs = [];
  narrationShots.forEach((s) => inputs.push('-i', s.file));

  // Compute visual start for each shot
  const starts = [];
  let cum = 0;
  for (let i = 0; i < narrationShots.length; i++) {
    const visualStart = i === 0 ? 0 : cum - XFADE_SEC * i;
    starts.push(visualStart);
    cum += narrationShots[i].durationSec;
  }

  // Each audio input gets adelay so it starts at its visualStart in the timeline,
  // plus a tiny lead-in pad so narration begins ~0.15s after the shot opens.
  const LEAD = 0.15;
  const segs = narrationShots.map((s, i) => {
    const delayMs = Math.max(0, Math.round((starts[i] + LEAD) * 1000));
    const fadeIn = `afade=t=in:st=0:d=${NARRATION_FADE}`;
    const fadeOut = `afade=t=out:st=${Math.max(0, s.durationSec - NARRATION_FADE).toFixed(3)}:d=${NARRATION_FADE}`;
    return `[${i}:a]${fadeIn},${fadeOut},adelay=${delayMs}|${delayMs},apad[a${i}]`;
  });

  const mixLabels = narrationShots.map((_, i) => `[a${i}]`).join('');
  const mix = `${mixLabels}amix=inputs=${narrationShots.length}:duration=longest:normalize=0[mix]`;
  const trim = `[mix]atrim=0:${videoTotalSec.toFixed(3)},asetpts=PTS-STARTPTS[aout]`;

  const filter = [...segs, mix, trim].join(';');

  await runFfmpeg(
    [
      '-y',
      ...inputs,
      '-filter_complex', filter,
      '-map', '[aout]',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-ar', '44100',
      outFile,
    ],
    { label: 'narration assemble' }
  );

  // Return shot timeline for caption builder
  const timed = narrationShots.map((s, i) => ({
    id: s.id,
    lines: s.lines,
    durationSec: s.durationSec,
    startSec: starts[i] + LEAD,
    endSec: starts[i] + LEAD + s.durationSec,
  }));

  return { audioFile: outFile, timedShots: timed };
}

/**
 * Mix narration with ambient music (ducked).
 * If musicFile is missing/null, returns narration unchanged.
 */
async function mixWithMusic({ narrationFile, musicFile, duckDb = -18, fadeInSec = 1.2, fadeOutSec = 2.0, totalSec, outFile }) {
  if (!musicFile || !fs.existsSync(musicFile)) {
    fs.copyFileSync(narrationFile, outFile);
    return outFile;
  }

  // Loop music to cover total, fade in/out, then sidechain-compress against
  // narration so music ducks automatically when narrator speaks.
  const filter = [
    `[1:a]aloop=loop=-1:size=2e9,atrim=0:${totalSec.toFixed(3)},volume=${(10 ** (duckDb / 20)).toFixed(3)},afade=t=in:st=0:d=${fadeInSec},afade=t=out:st=${Math.max(0, totalSec - fadeOutSec).toFixed(3)}:d=${fadeOutSec}[bg]`,
    `[0:a][bg]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400[mixed]`,
  ].join(';');

  await runFfmpeg(
    [
      '-y',
      '-i', narrationFile,
      '-i', musicFile,
      '-filter_complex', filter,
      '-map', '[mixed]',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-ar', '44100',
      outFile,
    ],
    { label: 'music mix' }
  );
  return outFile;
}

/**
 * Burn captions and mux audio with video.
 */
async function muxFinal({ videoFile, audioFile, captionFile, outFile }) {
  const captionFilter = captionFile
    ? `ass=${captionFile.replace(/\\/g, '/').replace(/:/g, '\\:')}`
    : null;

  const args = ['-y', '-i', videoFile, '-i', audioFile];
  if (captionFilter) {
    args.push('-vf', captionFilter);
  }
  args.push(
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'medium',
    '-crf', '18',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    outFile
  );

  await runFfmpeg(args, { label: 'final mux' });
}

module.exports = {
  renderShotClip,
  xfadeChain,
  assembleNarration,
  mixWithMusic,
  muxFinal,
  XFADE_SEC,
  FPS,
  W,
  H,
};
