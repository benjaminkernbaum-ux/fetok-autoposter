/**
 * FéTok — Background Music Generator + Audio Mixer
 * 
 * 1. Synthesizes a warm ambient worship pad (60 min) using FFmpeg
 * 2. Re-assembles each LIVE block with narration + background music
 * 3. Concatenates into final video with full audio mix
 * 
 * Usage: node src/liveMusicMixer.js
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const LIVE_DIR = path.resolve(__dirname, '../output/live');
const AUDIO_DIR = path.join(LIVE_DIR, 'audio');
const SLIDES_DIR = path.join(LIVE_DIR, 'slides');

// Block definitions with durations (must match liveVideoGenerator.js)
const BLOCK_DEFS = [
  { id: 'abertura', dur: 180 },
  { id: 'marcos', dur: 540 },
  { id: 'filipenses', dur: 540 },
  { id: 'isaias', dur: 540 },
  { id: 'meditacao', dur: 480 },
  { id: 'oracao', dur: 600 },
  { id: 'extras', dur: 420 },
  { id: 'encerramento', dur: 300 },
];

const TOTAL_DURATION = BLOCK_DEFS.reduce((s, b) => s + b.dur, 0); // 3600s = 60min

// ═══════════════════════════════════════════
//  STEP 1: Generate ambient worship pad
// ═══════════════════════════════════════════

function generateAmbientPad(outputPath, durationSec) {
  if (fs.existsSync(outputPath)) {
    console.log('🎵 Ambient pad exists, skipping...');
    return;
  }

  console.log(`🎵 Generating ${durationSec}s ambient worship pad...`);

  // Create a warm, evolving ambient pad using layered sine waves
  // Frequencies chosen for a calming, worship-like feel:
  // - C3 (130.81 Hz) base
  // - E3 (164.81 Hz) major third  
  // - G3 (196.00 Hz) perfect fifth
  // - C4 (261.63 Hz) octave
  // Plus slow LFO modulation for a "breathing" feel
  const filterComplex = [
    // Layer 1: Deep warm base (C3)
    `sine=frequency=130.81:sample_rate=44100:duration=${durationSec},volume=0.08[s1]`,
    // Layer 2: Major third (E3)  
    `sine=frequency=164.81:sample_rate=44100:duration=${durationSec},volume=0.06[s2]`,
    // Layer 3: Perfect fifth (G3)
    `sine=frequency=196.00:sample_rate=44100:duration=${durationSec},volume=0.05[s3]`,
    // Layer 4: High octave shimmer (C4)
    `sine=frequency=261.63:sample_rate=44100:duration=${durationSec},volume=0.03[s4]`,
    // Layer 5: Subtle fifth above (G4) for brightness
    `sine=frequency=392.00:sample_rate=44100:duration=${durationSec},volume=0.02[s5]`,
    // Mix all layers
    `[s1][s2]amix=inputs=2[m1]`,
    `[m1][s3]amix=inputs=2[m2]`,
    `[m2][s4]amix=inputs=2[m3]`,
    `[m3][s5]amix=inputs=2[mixed]`,
    // Apply effects: low-pass filter for warmth + slow tremolo for "breathing"
    `[mixed]lowpass=f=800,tremolo=f=0.1:d=0.3,afade=t=in:st=0:d=5,afade=t=out:st=${durationSec - 5}:d=5[final]`,
  ].join(';');

  const args = [
    '-y',
    '-f', 'lavfi', '-i', `anullsrc=r=44100:cl=stereo`,
    '-filter_complex', filterComplex,
    '-map', '[final]',
    '-t', String(durationSec),
    '-c:a', 'libmp3lame', '-b:a', '128k',
    outputPath,
  ];

  execFileSync(ffmpegPath, args, { stdio: 'pipe', timeout: 120000 });
  console.log('🎵 ✅ Ambient pad generated');
}

// ═══════════════════════════════════════════
//  STEP 2: Mix narration + music per block
// ═══════════════════════════════════════════

function mixBlockAudio(narrationPath, bgMusicPath, durationSec, outputPath) {
  if (fs.existsSync(outputPath)) {
    console.log(`   🔊 Mixed audio exists: ${path.basename(outputPath)}`);
    return;
  }

  // Get narration duration
  let narrDuration;
  try {
    const probe = execFileSync(ffmpegPath, [
      '-i', narrationPath, '-f', 'null', '-'
    ], { stdio: 'pipe', timeout: 30000 }).toString();
  } catch (e) {
    // FFmpeg outputs duration to stderr
    const match = e.stderr.toString().match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      narrDuration = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseFloat(match[3]);
    }
  }

  // Mix: narration at 100% volume + background music at 15% volume
  // Music starts 2s before narration and continues for full block duration
  const args = [
    '-y',
    '-i', narrationPath,      // input 0: narration
    '-i', bgMusicPath,         // input 1: background music (full pad)
    '-filter_complex',
    // Trim bg music to block duration, reduce volume to 15%
    `[1:a]atrim=0:${durationSec},asetpts=PTS-STARTPTS,volume=0.15[bg];` +
    // Pad narration with silence to match block duration
    `[0:a]apad=whole_dur=${durationSec}[narr];` +
    // Mix narration (loud) + background (quiet)
    `[narr][bg]amix=inputs=2:duration=longest:dropout_transition=3,` +
    // Add fade in/out to the mix
    `afade=t=in:st=0:d=3,afade=t=out:st=${durationSec - 4}:d=4[out]`,
    '-map', '[out]',
    '-c:a', 'libmp3lame', '-b:a', '128k',
    '-t', String(durationSec),
    outputPath,
  ];

  execFileSync(ffmpegPath, args, { stdio: 'pipe', timeout: 120000 });
  console.log(`   🔊 ✅ Mixed: ${path.basename(outputPath)}`);
}

// ═══════════════════════════════════════════
//  STEP 3: Re-assemble blocks with mixed audio
// ═══════════════════════════════════════════

function assembleBlockWithMusic(slidePath, mixedAudioPath, durationSec, outputPath) {
  if (fs.existsSync(outputPath)) {
    console.log(`   🎬 Block exists: ${path.basename(outputPath)}`);
    return;
  }

  const args = [
    '-y',
    '-loop', '1', '-i', slidePath,
    '-i', mixedAudioPath,
    '-vf', `zoompan=z='1.0+on*0.000005':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${durationSec * 30}:s=1080x1920:fps=30,fade=t=in:st=0:d=3,fade=t=out:st=${durationSec - 3}:d=3`,
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
    '-c:a', 'aac', '-b:a', '128k',
    '-t', String(durationSec),
    '-pix_fmt', 'yuv420p',
    '-shortest',
    outputPath,
  ];

  console.log(`   🎬 Assembling block with music (${durationSec}s)...`);
  execFileSync(ffmpegPath, args, { stdio: 'pipe', timeout: 300000 });
  console.log(`   🎬 ✅ ${path.basename(outputPath)}`);
}

// ═══════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════

async function main() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  🎵 LIVE MUSIC MIXER — Adding Worship Background ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // 1) Generate ambient worship pad
  const padPath = path.join(AUDIO_DIR, 'bg_worship_pad_60min.mp3');
  generateAmbientPad(padPath, TOTAL_DURATION);

  // 2) Mix each block's narration with background music
  const musicBlocks = [];

  for (const block of BLOCK_DEFS) {
    console.log(`\n━━━ ${block.id.toUpperCase()} (${block.dur}s) ━━━`);

    const narrationPath = path.join(AUDIO_DIR, `narr_${block.id}.mp3`);
    const slidePath = path.join(SLIDES_DIR, `slide_${block.id}.png`);
    const mixedAudioPath = path.join(AUDIO_DIR, `mixed_${block.id}.mp3`);
    const blockVideoPath = path.join(LIVE_DIR, `block_music_${block.id}.mp4`);

    if (!fs.existsSync(narrationPath)) {
      console.log(`   ⚠️ Narration not found: ${narrationPath}`);
      console.log(`   Run "npm run live-generate" first!`);
      continue;
    }

    // Calculate offset into the pad for this block
    let padOffset = 0;
    for (const b of BLOCK_DEFS) {
      if (b.id === block.id) break;
      padOffset += b.dur;
    }

    // Trim the pad to this block's section
    const blockPadPath = path.join(AUDIO_DIR, `pad_${block.id}.mp3`);
    if (!fs.existsSync(blockPadPath)) {
      execFileSync(ffmpegPath, [
        '-y', '-i', padPath,
        '-ss', String(padOffset), '-t', String(block.dur),
        '-c:a', 'libmp3lame', '-b:a', '128k',
        blockPadPath,
      ], { stdio: 'pipe', timeout: 60000 });
    }

    // Mix narration + pad
    mixBlockAudio(narrationPath, blockPadPath, block.dur, mixedAudioPath);

    // Assemble video with mixed audio
    assembleBlockWithMusic(slidePath, mixedAudioPath, block.dur, blockVideoPath);
    musicBlocks.push(blockVideoPath);
  }

  // 3) Concatenate all blocks into final video
  console.log('\n━━━ FINAL ASSEMBLY ━━━');
  const finalOutput = path.join(LIVE_DIR, 'live_oracao_poderosa_FINAL.mp4');

  if (fs.existsSync(finalOutput)) {
    fs.unlinkSync(finalOutput); // Always rebuild final
  }

  const concatList = path.join(LIVE_DIR, 'concat_music_list.txt');
  fs.writeFileSync(concatList, musicBlocks.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'));

  console.log('🎬 Concatenating all blocks with music...');
  execFileSync(ffmpegPath, [
    '-y', '-f', 'concat', '-safe', '0', '-i', concatList,
    '-c', 'copy', finalOutput,
  ], { stdio: 'pipe', timeout: 600000 });

  fs.unlinkSync(concatList);

  const stats = fs.statSync(finalOutput);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);

  console.log(`\n╔══════════════════════════════════════════════════╗`);
  console.log(`║  ✅ LIVE VIDEO WITH MUSIC READY!                   ║`);
  console.log(`║  📁 ${path.basename(finalOutput)}`);
  console.log(`║  📊 ${sizeMB} MB · ⏱️ ~60 minutes`);
  console.log(`║  🎵 Narração AI + Worship Pad de fundo             ║`);
  console.log(`║                                                    ║`);
  console.log(`║  OBS → Media Source → TikTok LIVE 🔴               ║`);
  console.log(`╚══════════════════════════════════════════════════╝`);
}

main().catch(err => {
  console.error('❌ Music mixer failed:', err.message);
  process.exit(1);
});
