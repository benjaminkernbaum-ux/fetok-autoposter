// Per-line PT-BR narration with ElevenLabs.
// Returns an array of { line, file, durationSec } so the composer can match
// shot length to actual speech length (the core fix for v1/v2/v3 sync issues).

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { spawnSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const ELEVEN_BASE = 'https://api.elevenlabs.io/v1';

function probeDuration(file) {
  const ffprobe = ffmpegPath.replace(/ffmpeg(\.exe)?$/, 'ffprobe$1');
  const r = spawnSync(ffprobe, [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ]);
  if (r.status !== 0) {
    throw new Error(`ffprobe failed for ${file}: ${r.stderr.toString()}`);
  }
  const d = parseFloat(r.stdout.toString().trim());
  if (!Number.isFinite(d) || d <= 0) {
    throw new Error(`Invalid duration for ${file}`);
  }
  return d;
}

async function ttsLine({
  text,
  voiceId,
  apiKey,
  model = 'eleven_multilingual_v2',
  stability = 0.32,
  similarity = 0.78,
  style = 0.65,
  speakerBoost = true,
  outFile,
  attempt = 1,
}) {
  const url = `${ELEVEN_BASE}/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
  try {
    const resp = await axios.post(
      url,
      {
        text,
        model_id: model,
        voice_settings: {
          stability,
          similarity_boost: similarity,
          style,
          use_speaker_boost: speakerBoost,
        },
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'arraybuffer',
        timeout: 60000,
      }
    );
    fs.writeFileSync(outFile, Buffer.from(resp.data));
    return outFile;
  } catch (err) {
    const body = err.response?.data ? Buffer.from(err.response.data).toString('utf8') : err.message;
    if (attempt < 3 && (err.code === 'ECONNRESET' || err.response?.status >= 500)) {
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      return ttsLine({ text, voiceId, apiKey, model, stability, similarity, style, speakerBoost, outFile, attempt: attempt + 1 });
    }
    throw new Error(`ElevenLabs TTS failed (status ${err.response?.status}): ${body}`);
  }
}

/**
 * Generate per-line audio for every shot in a roteiro.
 * Each shot.lines becomes one MP3 (lines joined with a small pause for delivery).
 * Returns { shots: [{ id, file, durationSec, lines }] }
 */
async function generateNarration({ roteiro, outDir, cache = true }) {
  const apiKey = process.env.ELEVEN_API_KEY;
  const voiceId = process.env.ELEVEN_VOICE_ID;
  if (!apiKey) throw new Error('ELEVEN_API_KEY missing');
  if (!voiceId) throw new Error('ELEVEN_VOICE_ID missing');

  fs.mkdirSync(outDir, { recursive: true });
  const v = roteiro.voice || {};
  const results = [];

  for (const shot of roteiro.shots) {
    const file = path.join(outDir, `${shot.id}.mp3`);
    // ElevenLabs handles SSML-ish pauses with " — " naturally; explicit pause tokens
    // help the model breathe between lines.
    const text = shot.lines.join('  ... ');

    if (cache && fs.existsSync(file) && fs.statSync(file).size > 1000) {
      const durationSec = probeDuration(file);
      results.push({ id: shot.id, file, durationSec, lines: shot.lines, cached: true });
      continue;
    }

    await ttsLine({
      text,
      voiceId,
      apiKey,
      model: v.model,
      stability: v.stability,
      similarity: v.similarity,
      style: v.style,
      speakerBoost: v.speakerBoost,
      outFile: file,
    });

    const durationSec = probeDuration(file);
    results.push({ id: shot.id, file, durationSec, lines: shot.lines, cached: false });
  }

  return { shots: results };
}

module.exports = { generateNarration, probeDuration };
