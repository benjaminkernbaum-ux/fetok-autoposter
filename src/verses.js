/**
 * FéTok Verse Database — Série 5
 * 51+ versículos (zero overlap com Séries 1-4)
 * FIRST 21 = posts usados no POSTS_DATA (ordem de prioridade)
 * Organizados por temas — cada um roda uma vez e é marcado como postado
 */

const verses = [
  // ═══ POSTS_DATA VERSES — Série 5 (first 21) ═══
  { text: "Ninguém te poderá resistir todos os dias da tua vida; como fui com Moisés, assim serei contigo.", ref: "Josué 1:5", theme: "fidelidade", bg: "divine_light" },
  { text: "Deus não é homem para que minta, nem filho de homem para que se arrependa.", ref: "Números 23:19", theme: "fidelidade", bg: "golden_rays" },
  { text: "Fiel é o que vos chama, o qual também o fará.", ref: "1 Tessalonicenses 5:24", theme: "fidelidade", bg: "cross_light" },
  { text: "Eis que faço coisa nova, e agora sairá à luz; não a conhecereis?", ref: "Isaías 43:19", theme: "renovação", bg: "sunrise" },
  { text: "Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da mente.", ref: "Romanos 12:2", theme: "renovação", bg: "mountain" },
  { text: "Dar-vos-ei um coração novo e porei dentro de vós um espírito novo.", ref: "Ezequiel 36:26", theme: "renovação", bg: "dove" },
  { text: "Os que confiam no Senhor serão como o Monte Sião, que não se abala, firme para sempre.", ref: "Salmos 125:1", theme: "confiança", bg: "mountain" },
  { text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", ref: "Provérbios 3:5-6", theme: "confiança", bg: "prayer_hands" },
  { text: "Quando eu tiver medo, confiarei em ti.", ref: "Salmos 56:3", theme: "confiança", bg: "narrow_path" },
  { text: "Eu sei os planos que tenho para vocês; planos de paz e não de mal, para dar-vos futuro e esperança.", ref: "Jeremias 29:11", theme: "promessa", bg: "sunrise" },
  { text: "A visão é ainda para o tempo determinado; se tardar, espera-o, porque certamente virá.", ref: "Habacuque 2:3", theme: "promessa", bg: "golden_rays" },
  { text: "Porque todas as promessas de Deus são nEle sim, e por Ele o amém.", ref: "2 Coríntios 1:20", theme: "promessa", bg: "cross_light" },
  { text: "Se o Filho vos libertar, verdadeiramente sereis livres.", ref: "João 8:36", theme: "libertação", bg: "divine_light" },
  { text: "Para a liberdade Cristo nos libertou; permanecei firmes e não vos submetais de novo ao jugo.", ref: "Gálatas 5:1", theme: "libertação", bg: "walking_water" },
  { text: "Tirou-os das trevas e da sombra da morte e despedaçou as suas cadeias.", ref: "Salmos 107:14", theme: "libertação", bg: "narrow_path" },
  { text: "Tudo o que fizerem, seja em palavra seja em ação, façam-no em nome do Senhor Jesus, dando graças.", ref: "Colossenses 3:17", theme: "gratidão", bg: "olive_tree" },
  { text: "Deem graças ao Senhor porque Ele é bom; o seu amor dura para sempre.", ref: "Salmos 136:1", theme: "gratidão", bg: "golden_rays" },
  { text: "Louvem ao Senhor porque Ele é bom; a sua bondade dura para sempre.", ref: "1 Crônicas 16:34", theme: "gratidão", bg: "shepherd" },
  { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho para que todo o que nele crê não pereça.", ref: "João 3:16", theme: "eternidade", bg: "cross_light" },
  { text: "Eu sou a ressurreição e a vida. Quem crê em mim, ainda que morra, viverá.", ref: "João 11:25", theme: "eternidade", bg: "divine_light" },
  { text: "Já não haverá noite. Não precisarão de luz, pois o Senhor Deus os iluminará.", ref: "Apocalipse 22:5", theme: "eternidade", bg: "sunrise" },

  // ═══ EXTRA VERSES (backup pool) ═══
  { text: "Tu és o meu esconderijo; tu me preservas da angústia e me cercas de cânticos de livramento.", ref: "Salmos 32:7", theme: "proteção", bg: "mountain" },
  { text: "Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo.", ref: "Salmos 23:4", theme: "proteção", bg: "narrow_path" },
  { text: "O Senhor é a minha força e o meu escudo; nele confia o meu coração e fui socorrido.", ref: "Salmos 28:7", theme: "coragem", bg: "shepherd" },
  { text: "Tenham coragem! Eu venci o mundo.", ref: "João 16:33", theme: "coragem", bg: "cross_light" },
  { text: "Nem a morte, nem a vida poderá nos separar do amor de Deus que está em Cristo Jesus.", ref: "Romanos 8:38-39", theme: "amor", bg: "golden_rays" },
  { text: "Posso todas as coisas por meio daquele que me dá forças.", ref: "Filipenses 4:13b", theme: "força", bg: "prayer_hands" },
  { text: "Bem-aventurados os que não viram e creram.", ref: "João 20:29", theme: "fé", bg: "narrow_path" },
  { text: "Eis que faço novas todas as coisas.", ref: "Apocalipse 21:5", theme: "esperança", bg: "divine_light" },
  { text: "Porque o Senhor é bom; a sua misericórdia dura para sempre.", ref: "Salmos 100:5", theme: "esperança", bg: "golden_rays" },
  { text: "A misericórdia, a paz e o amor vos sejam multiplicados.", ref: "Judas 1:2", theme: "paz", bg: "dove" },
  { text: "O fruto do Espírito é amor, alegria, paz, paciência, bondade.", ref: "Gálatas 5:22", theme: "paz", bg: "olive_tree" },
  { text: "Entrem pelas portas dele com ação de graças e nos seus átrios com louvor.", ref: "Salmos 100:4", theme: "gratidão", bg: "golden_rays" },
  { text: "Graças a Deus pelo seu dom inefável!", ref: "2 Coríntios 9:15", theme: "gratidão", bg: "divine_light" },
  { text: "Toda boa dádiva e todo dom perfeito vêm do alto.", ref: "Tiago 1:17", theme: "gratidão", bg: "olive_tree" },
  { text: "Eu, eu mesmo, sou o que apago as tuas transgressões por amor de mim.", ref: "Isaías 43:25", theme: "perdão", bg: "cross_light" },
  { text: "Se o Filho vos libertar, verdadeiramente sereis livres.", ref: "João 8:36", theme: "perdão", bg: "divine_light" },
  { text: "Perdoem como o Senhor lhes perdoou.", ref: "Colossenses 3:13", theme: "perdão", bg: "dove" },
  { text: "O Senhor é o meu pastor e nada me faltará. Em verdes pastagens me faz repousar.", ref: "Salmos 23:1-2", theme: "provisão", bg: "shepherd" },
  { text: "Olhem para as aves do céu: não semeiam nem colhem, e o Pai celestial as alimenta.", ref: "Mateus 6:26", theme: "provisão", bg: "dove" },
  { text: "Abres a tua mão e satisfazes de benevolência os desejos de todo ser vivente.", ref: "Salmos 145:16", theme: "provisão", bg: "golden_rays" },
  { text: "Feliz é o homem que acha sabedoria, e o homem que adquire conhecimento.", ref: "Provérbios 3:13", theme: "sabedoria", bg: "bible_light" },
  { text: "Ensina-nos a contar os nossos dias, para que alcancemos coração sábio.", ref: "Salmos 90:12", theme: "sabedoria", bg: "narrow_path" },
  { text: "A sabedoria que vem do alto é antes de tudo pura, depois pacífica, amável.", ref: "Tiago 3:17", theme: "sabedoria", bg: "olive_tree" },
  { text: "O princípio da sabedoria é: adquire a sabedoria; sim, com tudo que possuis adquire o entendimento.", ref: "Provérbios 4:7", theme: "sabedoria", bg: "divine_light" },
  { text: "Não se deixem vencer pelo mal, mas vençam o mal com o bem.", ref: "Romanos 12:21", theme: "vitória", bg: "mountain" },
  { text: "Graças a Deus, que sempre nos conduz em triunfo em Cristo.", ref: "2 Coríntios 2:14", theme: "vitória", bg: "shepherd" },
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
