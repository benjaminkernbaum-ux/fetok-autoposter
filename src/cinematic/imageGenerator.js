// Cinematic image generation via FAL.ai (flux-pro / flux-1.1-pro).
// Key fixes vs the v1/v2/v3 stills:
//   - characterLock token injected into EVERY prompt so faces stay consistent
//   - shared visualAnchor + colorGrade appended for unified look
//   - negative prompt suppresses cartoon/text/deformed-hands artifacts
//   - 1080x1920 portrait native (no center-crop letterboxing later)
//   - retry with prompt softening on safety-rejection

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const FAL_BASE = 'https://fal.run';
const FAL_MODEL = process.env.FAL_MODEL || 'fal-ai/flux-pro/v1.1';

function buildPrompt(shot, style) {
  return [
    shot.prompt.replace(/\{characterLock\}/g, style.characterLock),
    style.visualAnchor,
    style.colorGrade,
    'vertical 9:16 aspect ratio, full body or three-quarter framing, no text overlays',
  ]
    .filter(Boolean)
    .join('. ');
}

async function generateOne({ prompt, negative, outFile, attempt = 1 }) {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) throw new Error('FAL_KEY missing');

  try {
    const resp = await axios.post(
      `${FAL_BASE}/${FAL_MODEL}`,
      {
        prompt,
        negative_prompt: negative,
        image_size: { width: 1080, height: 1920 },
        num_inference_steps: 35,
        guidance_scale: 4.5,
        num_images: 1,
        enable_safety_checker: true,
        output_format: 'jpeg',
        output_quality: 95,
      },
      {
        headers: {
          Authorization: `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000,
      }
    );

    const url = resp.data?.images?.[0]?.url;
    if (!url) throw new Error(`No image URL returned: ${JSON.stringify(resp.data).slice(0, 300)}`);

    const img = await axios.get(url, { responseType: 'arraybuffer', timeout: 60000 });
    fs.writeFileSync(outFile, Buffer.from(img.data));
    return outFile;
  } catch (err) {
    const status = err.response?.status;
    const body = err.response?.data;
    // soften prompt once on safety rejection
    if (attempt === 1 && (status === 422 || status === 400)) {
      const softened = prompt.replace(/violent|brutal|terror|blood/gi, 'dramatic');
      return generateOne({ prompt: softened, negative, outFile, attempt: attempt + 1 });
    }
    if (attempt < 3 && (status >= 500 || err.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      return generateOne({ prompt, negative, outFile, attempt: attempt + 1 });
    }
    throw new Error(`FAL image gen failed (status ${status}): ${JSON.stringify(body).slice(0, 300)}`);
  }
}

async function generateImages({ roteiro, outDir, cache = true }) {
  fs.mkdirSync(outDir, { recursive: true });
  const style = roteiro.style;
  const out = [];

  for (const shot of roteiro.shots) {
    const file = path.join(outDir, `${shot.id}.jpg`);
    if (cache && fs.existsSync(file) && fs.statSync(file).size > 10000) {
      out.push({ id: shot.id, file, cached: true });
      continue;
    }
    const prompt = buildPrompt(shot, style);
    await generateOne({ prompt, negative: style.negative, outFile: file });
    out.push({ id: shot.id, file, cached: false });
  }

  return { images: out };
}

module.exports = { generateImages, buildPrompt };
