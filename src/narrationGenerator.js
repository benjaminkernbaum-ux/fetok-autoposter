/**
 * ElevenLabs Narration Generator (PT-BR)
 *
 * Converts roteiro narration text into a cinematic voice-over MP3
 * using ElevenLabs multilingual v2.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ELEVEN_API = 'https://api.elevenlabs.io/v1';
const AUDIO_DIR = path.resolve(__dirname, '../output/audio');

if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

/**
 * Generate narration MP3 from text.
 *
 * @param {string} text - Narration script in PT-BR.
 * @param {object} voiceCfg - { voice_id, model_id, settings }
 * @param {string} filename - Output file name (e.g. "pescador_narration.mp3").
 */
async function generateNarration(text, voiceCfg, filename) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY not set');

  const outputPath = path.join(AUDIO_DIR, filename);
  if (fs.existsSync(outputPath)) {
    console.log(`🎙️ Narration cached: ${filename}`);
    return outputPath;
  }

  const voiceId = voiceCfg.voice_id || process.env.ELEVENLABS_VOICE_ID;
  if (!voiceId) throw new Error('voice_id missing');

  console.log(`🎙️ ElevenLabs → ${filename}`);

  const { data } = await axios.post(
    `${ELEVEN_API}/text-to-speech/${voiceId}`,
    {
      text,
      model_id: voiceCfg.model_id || 'eleven_multilingual_v2',
      voice_settings: voiceCfg.settings || {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    },
    {
      headers: {
        'xi-api-key': key,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      responseType: 'arraybuffer',
      timeout: 60000,
    }
  );

  fs.writeFileSync(outputPath, data);
  console.log(`🎙️ Narration ready: ${filename}`);
  return outputPath;
}

module.exports = { generateNarration };
