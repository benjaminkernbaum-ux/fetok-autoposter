// Build an ASS subtitle file with TikTok-style word-by-word highlighting.
// Each line's words are timed proportionally to that line's audio slice.
// ASS chosen over SRT for: bold outline, drop shadow, per-word \k karaoke timing,
// vertical centering for 9:16, safe-zone margin from TikTok UI.

const fs = require('fs');

function fmtTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = (sec % 60).toFixed(2).padStart(5, '0');
  return `${h}:${m.toString().padStart(2, '0')}:${s}`;
}

function escapeAss(text) {
  return text.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\n/g, '\\N');
}

/**
 * @param {Array<{ id, durationSec, lines, startSec, endSec }>} timedShots
 * @param {string} outFile .ass path
 * @param {object} opts { fontName, fontSize, primary, outline }
 */
function buildAss(timedShots, outFile, opts = {}) {
  const fontName = opts.fontName || 'Inter Black';
  const fontSize = opts.fontSize || 78;
  const primary = opts.primary || '&H00FFFFFF'; // white
  const highlight = opts.highlight || '&H0000F0FF'; // TikTok yellow-ish
  const outline = opts.outline || '&H00000000'; // black
  const shadow = opts.shadow || '&H80000000';
  const marginV = opts.marginV || 380; // keep clear of TikTok bottom UI

  const header = `[Script Info]
Title: Cinematic
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap, ${fontName}, ${fontSize}, ${primary}, ${highlight}, ${outline}, ${shadow}, -1, 0, 0, 0, 100, 100, 0, 0, 1, 6, 3, 2, 60, 60, ${marginV}, 1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const events = [];

  for (const shot of timedShots) {
    // Split shot duration across its lines proportional to word count.
    const totalWords = shot.lines.reduce((n, l) => n + l.split(/\s+/).filter(Boolean).length, 0) || 1;
    let cursor = shot.startSec;

    for (const line of shot.lines) {
      const words = line.split(/\s+/).filter(Boolean);
      const wordShare = words.length / totalWords;
      const lineDuration = shot.durationSec * wordShare;
      const lineEnd = cursor + lineDuration;

      // Karaoke per-word with \kf (fill-in). Centiseconds.
      const perWord = (lineDuration / words.length) * 100;
      const karaoke = words
        .map((w) => `{\\kf${Math.round(perWord)}}${escapeAss(w)} `)
        .join('')
        .trim();

      // Slight scale-in for punch
      const fx = `{\\fad(120,80)\\fscx95\\fscy95\\t(0,250,\\fscx100\\fscy100)}`;

      events.push(
        `Dialogue: 0,${fmtTime(cursor)},${fmtTime(lineEnd)},Cap,,0,0,0,,${fx}${karaoke}`
      );
      cursor = lineEnd;
    }
  }

  fs.writeFileSync(outFile, header + events.join('\n') + '\n', 'utf8');
  return outFile;
}

module.exports = { buildAss };
