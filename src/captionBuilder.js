/**
 * FéTok Caption Builder
 * Generates optimized TikTok captions with verse, CTA, and hashtags
 */

// CTA variations to rotate (keeps content fresh)
const ctas = [
  "Marque alguém que precisa ouvir isso hoje! ❤️",
  "Salve esse vídeo. Você vai precisar. 🙏",
  "Comenta AMÉM se você crê! 🙏",
  "Isso não foi coincidência. Deus te trouxe aqui. ✝️",
  "Compartilhe com quem precisa de uma palavra hoje! 💛",
  "Deus quer que você saiba disso AGORA. 🙏",
  "Envie para alguém que está passando por dificuldades. ❤️",
  "Se esse versículo tocou seu coração, salve e compartilhe! 🙏",
  "Comenta o emoji 🙏 se você recebe essa palavra!",
  "Pare de rolar. Esse versículo é pra VOCÊ. ✝️",
];

// Theme-specific emojis
const themeEmojis = {
  proteção: "🛡️✝️",
  coragem: "💪✝️",
  amor: "❤️✝️",
  força: "⚡✝️",
  fé: "🙏✝️",
  esperança: "🌅✝️",
  paz: "🕊️✝️",
  gratidão: "🙌✝️",
  perdão: "💛✝️",
  provisão: "🌿✝️",
  sabedoria: "📖✝️",
  vitória: "👑✝️",
  cura: "💚✝️",
};

// Core hashtags (always included)
const coreHashtags = "#versiculododia #biblia #fe #jesus #deus #fetok #fyp #viral #foryou #gospel";

// Theme-specific hashtags
const themeHashtags = {
  proteção: "#salmos #proteção #deuscuida",
  coragem: "#coragem #naotemas #fortaleza",
  amor: "#amor #deusteama #amordedeus",
  força: "#força #tudoposso #guerreiro",
  fé: "#fidelidade #confiança #crer",
  esperança: "#esperança #promessa #futuro",
  paz: "#paz #descanso #tranquilidade",
  gratidão: "#gratidão #obrigadodeus #louvado",
  perdão: "#perdão #graça #misericordia",
  provisão: "#provisão #suprimento #abundancia",
  sabedoria: "#sabedoria #proverbios #conhecimento",
  vitória: "#vitória #vencedor #maisquevencedor",
  cura: "#cura #restauração #milagre",
};

let ctaIndex = 0;

/**
 * Build a complete TikTok caption for a verse
 */
function buildCaption(verse) {
  const emoji = themeEmojis[verse.theme] || "🙏✝️";
  const cta = ctas[ctaIndex % ctas.length];
  ctaIndex++;

  const extra = themeHashtags[verse.theme] || "";

  return [
    `${verse.text} ${emoji}`,
    verse.ref,
    "",
    cta,
    "",
    `${coreHashtags} ${extra}`,
  ].join("\n");
}

module.exports = { buildCaption };
