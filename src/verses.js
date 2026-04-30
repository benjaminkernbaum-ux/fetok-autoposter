/**
 * FéTok Verse Database — Série 3
 * 55 versículos NOVOS (zero overlap com Série 1 e 2)
 * Organizados por 13 temas — cada um roda uma vez e é marcado como postado
 */

const verses = [
  // ═══ PROTEÇÃO ═══
  { text: "O anjo do Senhor acampa-se ao redor dos que o temem e os livra.", ref: "Salmos 34:7", theme: "proteção", bg: "divine_light" },
  { text: "Tu és o meu esconderijo; tu me preservas da angústia e me cercas de cânticos de livramento.", ref: "Salmos 32:7", theme: "proteção", bg: "mountain" },
  { text: "Nenhuma arma forjada contra ti prosperará.", ref: "Isaías 54:17", theme: "proteção", bg: "shepherd" },
  { text: "O nome do Senhor é uma torre forte; o justo corre para ela e está seguro.", ref: "Provérbios 18:10", theme: "proteção", bg: "golden_rays" },
  { text: "Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo.", ref: "Salmos 23:4", theme: "proteção", bg: "narrow_path" },

  // ═══ CORAGEM ═══
  { text: "Espera no Senhor, anima-te e ele fortalecerá o teu coração.", ref: "Salmos 27:14", theme: "coragem", bg: "mountain" },
  { text: "Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.", ref: "2 Timóteo 1:7", theme: "coragem", bg: "divine_light" },
  { text: "O Senhor é a minha força e o meu escudo; nele confia o meu coração e fui socorrido.", ref: "Salmos 28:7", theme: "coragem", bg: "shepherd" },
  { text: "Tenham coragem! Eu venci o mundo.", ref: "João 16:33", theme: "coragem", bg: "cross_light" },

  // ═══ AMOR ═══
  { text: "Acima de tudo, porém, revistam-se do amor, que é o elo perfeito.", ref: "Colossenses 3:14", theme: "amor", bg: "dove" },
  { text: "Nós amamos porque ele nos amou primeiro.", ref: "1 João 4:19", theme: "amor", bg: "cross_light" },
  { text: "O Senhor teu Deus está no meio de ti, poderoso para te salvar; ele se deleitará em ti com alegria.", ref: "Sofonias 3:17", theme: "amor", bg: "sunrise" },
  { text: "Nem a morte, nem a vida poderá nos separar do amor de Deus que está em Cristo Jesus.", ref: "Romanos 8:38-39", theme: "amor", bg: "golden_rays" },

  // ═══ FORÇA ═══
  { text: "O Senhor Deus é a minha força; ele me dá pés como de corça e me faz andar sobre os altos.", ref: "Habacuque 3:19", theme: "força", bg: "mountain" },
  { text: "Posso todas as coisas por meio daquele que me dá forças.", ref: "Filipenses 4:13b", theme: "força", bg: "prayer_hands" },
  { text: "Quando sou fraco, então é que sou forte.", ref: "2 Coríntios 12:10", theme: "força", bg: "cross_light" },
  { text: "A alegria do Senhor é a minha força.", ref: "Neemias 8:10", theme: "força", bg: "sunrise" },

  // ═══ FÉ ═══
  { text: "Se tiverdes fé como um grão de mostarda, direis a este monte: passa daqui e ele passará.", ref: "Mateus 17:20", theme: "fé", bg: "mountain" },
  { text: "Tudo é possível ao que crê.", ref: "Marcos 9:23", theme: "fé", bg: "divine_light" },
  { text: "Clama a mim e eu te responderei e te anunciarei coisas grandes e ocultas.", ref: "Jeremias 33:3", theme: "fé", bg: "golden_rays" },
  { text: "Bem-aventurados os que não viram e creram.", ref: "João 20:29", theme: "fé", bg: "narrow_path" },

  // ═══ ESPERANÇA ═══
  { text: "Aqueles que semeiam com lágrimas, com cânticos de júbilo colherão.", ref: "Salmos 126:5", theme: "esperança", bg: "sunrise" },
  { text: "Eis que faço novas todas as coisas.", ref: "Apocalipse 21:5", theme: "esperança", bg: "divine_light" },
  { text: "Ele enxugará dos seus olhos toda lágrima, e não haverá mais morte, nem pranto, nem dor.", ref: "Apocalipse 21:4", theme: "esperança", bg: "dove" },
  { text: "Porque o Senhor é bom; a sua misericórdia dura para sempre.", ref: "Salmos 100:5", theme: "esperança", bg: "golden_rays" },

  // ═══ PAZ ═══
  { text: "Tu conservarás em paz aquele cuja mente está firme em ti.", ref: "Isaías 26:3", theme: "paz", bg: "olive_tree" },
  { text: "Não andem ansiosos por coisa alguma; apresentem seus pedidos a Deus.", ref: "Filipenses 4:6", theme: "paz", bg: "prayer_hands" },
  { text: "A misericórdia, a paz e o amor vos sejam multiplicados.", ref: "Judas 1:2", theme: "paz", bg: "dove" },
  { text: "O fruto do Espírito é amor, alegria, paz, paciência, bondade.", ref: "Gálatas 5:22", theme: "paz", bg: "olive_tree" },

  // ═══ GRATIDÃO ═══
  { text: "Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum dos seus benefícios.", ref: "Salmos 103:2", theme: "gratidão", bg: "sunrise" },
  { text: "Entrem pelas portas dele com ação de graças e nos seus átrios com louvor.", ref: "Salmos 100:4", theme: "gratidão", bg: "golden_rays" },
  { text: "Graças a Deus pelo seu dom inefável!", ref: "2 Coríntios 9:15", theme: "gratidão", bg: "divine_light" },
  { text: "Toda boa dádiva e todo dom perfeito vêm do alto.", ref: "Tiago 1:17", theme: "gratidão", bg: "olive_tree" },

  // ═══ PERDÃO ═══
  { text: "Eu, eu mesmo, sou o que apago as tuas transgressões por amor de mim.", ref: "Isaías 43:25", theme: "perdão", bg: "cross_light" },
  { text: "Se o Filho vos libertar, verdadeiramente sereis livres.", ref: "João 8:36", theme: "perdão", bg: "divine_light" },
  { text: "Perdoem como o Senhor lhes perdoou.", ref: "Colossenses 3:13", theme: "perdão", bg: "dove" },

  // ═══ PROVISÃO ═══
  { text: "O Senhor é o meu pastor e nada me faltará. Em verdes pastagens me faz repousar.", ref: "Salmos 23:1-2", theme: "provisão", bg: "shepherd" },
  { text: "Olhem para as aves do céu: não semeiam nem colhem, e o Pai celestial as alimenta.", ref: "Mateus 6:26", theme: "provisão", bg: "dove" },
  { text: "Abres a tua mão e satisfazes de benevolência os desejos de todo ser vivente.", ref: "Salmos 145:16", theme: "provisão", bg: "golden_rays" },

  // ═══ SABEDORIA ═══
  { text: "Feliz é o homem que acha sabedoria, e o homem que adquire conhecimento.", ref: "Provérbios 3:13", theme: "sabedoria", bg: "bible_light" },
  { text: "Ensina-nos a contar os nossos dias, para que alcancemos coração sábio.", ref: "Salmos 90:12", theme: "sabedoria", bg: "narrow_path" },
  { text: "A sabedoria que vem do alto é antes de tudo pura, depois pacífica, amável.", ref: "Tiago 3:17", theme: "sabedoria", bg: "olive_tree" },
  { text: "O princípio da sabedoria é: adquire a sabedoria; sim, com tudo que possuis adquire o entendimento.", ref: "Provérbios 4:7", theme: "sabedoria", bg: "divine_light" },

  // ═══ VITÓRIA ═══
  { text: "Não se deixem vencer pelo mal, mas vençam o mal com o bem.", ref: "Romanos 12:21", theme: "vitória", bg: "mountain" },
  { text: "O Senhor pelejará por vós, e vós vos calareis.", ref: "Êxodo 14:14", theme: "vitória", bg: "walking_water" },
  { text: "Combati o bom combate, terminei a corrida, guardei a fé.", ref: "2 Timóteo 4:7", theme: "vitória", bg: "cross_light" },
  { text: "Graças a Deus, que sempre nos conduz em triunfo em Cristo.", ref: "2 Coríntios 2:14", theme: "vitória", bg: "shepherd" },

  // ═══ CURA ═══
  { text: "Eu sou o Senhor que te sara.", ref: "Êxodo 15:26", theme: "cura", bg: "divine_light" },
  { text: "Cura-me, Senhor, e serei curado; salva-me, e serei salvo.", ref: "Jeremias 17:14", theme: "cura", bg: "prayer_hands" },
  { text: "E a oração da fé salvará o doente, e o Senhor o levantará.", ref: "Tiago 5:15", theme: "cura", bg: "cross_light" },
  { text: "Mas para vós que temeis o meu nome nascerá o Sol da Justiça, trazendo cura nas suas asas.", ref: "Malaquias 4:2", theme: "cura", bg: "sunrise" },
];

/**
 * Get the next unposted verse, optionally filtered by theme
 */
function getNextVerse(theme = null) {
  const available = verses.filter(v => !v.posted && (theme ? v.theme === theme : true));
  if (available.length === 0) {
    // Reset all posted flags if we ran out
    verses.forEach(v => v.posted = false);
    return verses.find(v => theme ? v.theme === theme : true);
  }
  return available[0];
}

/**
 * Mark a verse as posted
 */
function markPosted(ref) {
  const v = verses.find(v => v.ref === ref);
  if (v) v.posted = true;
}

/**
 * Get all verses (for dashboard)
 */
function getAllVerses() {
  return verses;
}

/**
 * Get verse count stats
 */
function getStats() {
  return {
    total: verses.length,
    posted: verses.filter(v => v.posted).length,
    remaining: verses.filter(v => !v.posted).length,
  };
}

module.exports = { getNextVerse, markPosted, getAllVerses, getStats, verses };

