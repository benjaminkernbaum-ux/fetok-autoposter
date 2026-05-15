// Orchestrator. Runs narration → images → shot clips → xfade chain → audio
// assembly → music mix → caption burn → final mux. Idempotent: every stage
// is cache-aware so reruns are cheap.

const fs = require('fs');
const path = require('path');
const { generateNarration } = require('./narrationGenerator');
const { generateImages } = require('./imageGenerator');
const { buildAss } = require('./captionBuilder');
const {
  renderShotClip,
  xfadeChain,
  assembleNarration,
  mixWithMusic,
  muxFinal,
  XFADE_SEC,
} = require('./videoComposer');

function loadRoteiro(slug) {
  const p = path.join(__dirname, 'roteiros', `${slug}.json`);
  if (!fs.existsSync(p)) throw new Error(`Roteiro not found: ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ts() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

async function runShow({ slug, useCache = true, musicDir = process.env.MUSIC_DIR }) {
  const t0 = Date.now();
  const roteiro = loadRoteiro(slug);
  const stamp = ts();
  const workDir = path.join(__dirname, 'output', `${slug}_${stamp}`);
  const audioDir = path.join(workDir, 'audio');
  const imgDir = path.join(workDir, 'images');
  const clipDir = path.join(workDir, 'clips');
  [workDir, audioDir, imgDir, clipDir].forEach((d) => fs.mkdirSync(d, { recursive: true }));

  console.log(`▶ ${roteiro.title} — ${roteiro.shots.length} shots`);

  // 1. Narration (per-shot MP3 + duration). This drives EVERYTHING downstream.
  console.log('▶ [1/6] Narração PT-BR...');
  const { shots: narrationShots } = await generateNarration({
    roteiro,
    outDir: audioDir,
    cache: useCache,
  });
  narrationShots.forEach((s) => console.log(`   ${s.id}: ${s.durationSec.toFixed(2)}s ${s.cached ? '(cache)' : ''}`));

  // 2. Images (one per shot, character-locked)
  console.log('▶ [2/6] Imagens cinematográficas...');
  const { images } = await generateImages({
    roteiro,
    outDir: imgDir,
    cache: useCache,
  });

  // 3. Per-shot animated clips — duration = actual narration duration so audio
  //    and visuals stay locked even if TTS came back longer than expected.
  console.log('▶ [3/6] Ken Burns + clips por cena...');
  const clipPaths = [];
  const clipDurations = [];
  for (let i = 0; i < roteiro.shots.length; i++) {
    const shot = roteiro.shots[i];
    const narr = narrationShots[i];
    const img = images[i];
    // Add XFADE_SEC tail to all but the last clip so xfade has overlap material.
    const isLast = i === roteiro.shots.length - 1;
    const duration = narr.durationSec + (isLast ? 0 : XFADE_SEC);
    const out = path.join(clipDir, `${shot.id}.mp4`);
    await renderShotClip({
      imageFile: img.file,
      durationSec: duration,
      kenBurns: shot.kenBurns || 'in',
      zStart: shot.zoomStart ?? 1.0,
      zEnd: shot.zoomEnd ?? 1.12,
      outFile: out,
    });
    clipPaths.push(out);
    clipDurations.push(duration);
  }

  // 4. xfade chain → silent master video
  console.log('▶ [4/6] Crossfade entre cenas...');
  const silentVideo = path.join(workDir, 'silent.mp4');
  const { totalSec } = await xfadeChain({
    clips: clipPaths,
    durations: clipDurations,
    outFile: silentVideo,
  });
  console.log(`   total: ${totalSec.toFixed(2)}s`);

  // 5. Narration timeline + music duck
  console.log('▶ [5/6] Áudio + música ambiente...');
  const narrationFile = path.join(workDir, 'narration.m4a');
  const { audioFile, timedShots } = await assembleNarration({
    narrationShots,
    outFile: narrationFile,
    videoTotalSec: totalSec,
  });
  const musicFile = roteiro.music?.track && musicDir
    ? path.join(musicDir, roteiro.music.track)
    : null;
  const mixedAudio = path.join(workDir, 'mix.m4a');
  await mixWithMusic({
    narrationFile: audioFile,
    musicFile,
    duckDb: roteiro.music?.duckDb ?? -18,
    fadeInSec: roteiro.music?.fadeInSec ?? 1.2,
    fadeOutSec: roteiro.music?.fadeOutSec ?? 2.0,
    totalSec,
    outFile: mixedAudio,
  });

  // 6. Captions (timed against the visual timeline, not raw narration) + final mux
  console.log('▶ [6/6] Legendas + render final...');
  const captionFile = path.join(workDir, 'captions.ass');
  buildAss(timedShots, captionFile, {
    fontName: process.env.CAPTION_FONT || 'Inter Black',
  });
  const finalOut = path.join(workDir, `${slug}_${stamp}.mp4`);
  await muxFinal({
    videoFile: silentVideo,
    audioFile: mixedAudio,
    captionFile,
    outFile: finalOut,
  });

  const stats = fs.statSync(finalOut);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const manifest = {
    title: roteiro.title,
    slug: roteiro.slug,
    file: finalOut,
    durationSec: totalSec,
    sizeBytes: stats.size,
    shots: timedShots.map((s) => ({ id: s.id, durationSec: s.durationSec })),
    renderedAt: new Date().toISOString(),
    renderTimeSec: parseFloat(elapsed),
  };
  fs.writeFileSync(path.join(workDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('');
  console.log('✅ DONE');
  console.log(`   file:     ${finalOut}`);
  console.log(`   duration: ${totalSec.toFixed(2)}s`);
  console.log(`   size:     ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   render:   ${elapsed}s`);

  return manifest;
}

module.exports = { runShow };
