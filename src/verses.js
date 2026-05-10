/**
 * FéTok Verse Database — Série 4
 * 51 versículos (21 da Série 4 + 30 do pool de reserva)
 * FIRST 21 = posts usados no POSTS_DATA (ordem de prioridade)
 * Organizados por temas — cada um roda uma vez e é marcado como postado
 */

const verses = [
  // ═══ POSTS_DATA VERSES — Série 4 (first 21) ═══
  { text: "Porque aos seus anjos dará ordens a teu respeito, para te guardarem em todos os teus caminhos.", ref: "Salmos 91:11", theme: "proteção", bg: "divine_light" },
  { text: "O Senhor te guardará de todo o mal; ele guardará a tua alma.", ref: "Salmos 121:7", theme: "proteção", bg: "shepherd" },
  { text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", ref: "Salmos 46:1", theme: "proteção", bg: "mountain" },
  { text: "Sê forte e corajoso; não temas, nem te espantes, porque o Senhor teu Deus é contigo.", ref: "Josué 1:9", theme: "coragem", bg: "lion" },
  { text: "Sede fortes e corajosos; não temais, porque o Senhor vosso Deus é quem vai convosco; não vos deixará.", ref: "Deuteronômio 31:6", theme: "coragem", bg: "eagle" },
  { text: "Ninguém tem maior amor do que este: de dar alguém a sua vida pelos seus amigos.", ref: "João 15:13", theme: "amor", bg: "cross_light" },
  { text: "Nem morte nem vida, nem anjos nem demônios poderá nos separar do amor de Deus.", ref: "Romanos 8:38", theme: "amor", bg: "dove" },
  { text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.", ref: "1 Coríntios 13:4", theme: "amor", bg: "sunrise" },
  { text: "Os que esperam no Senhor renovarão as suas forças, subirão com asas como águias.", ref: "Isaías 40:31", theme: "força", bg: "eagle" },
  { text: "Posso todas as coisas em Cristo que me fortalece.", ref: "Filipenses 4:13", theme: "força", bg: "fire" },
  { text: "O Senhor é a minha força e o meu escudo; nele confiou o meu coração, e fui socorrido.", ref: "Salmos 28:7", theme: "força", bg: "shepherd" },
  { text: "A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.", ref: "Hebreus 11:1", theme: "fé", bg: "bible_light" },
  { text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", ref: "Provérbios 3:5", theme: "fé", bg: "narrow_path" },
  { text: "Se algum de vós tem falta de sabedoria, peça-a a Deus, e ser-lhe-á dada.", ref: "Tiago 1:5", theme: "fé", bg: "olive_tree" },
  { text: "Que o Deus da esperança vos encha de todo o gozo e paz em vosso crer.", ref: "Romanos 15:13", theme: "esperança", bg: "sunrise" },
  { text: "As misericórdias do Senhor renovam-se cada manhã; grande é a tua fidelidade.", ref: "Lamentações 3:23", theme: "esperança", bg: "dove" },
  { text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.", ref: "João 14:27", theme: "paz", bg: "walking_water" },
  { text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", ref: "Mateus 11:28", theme: "paz", bg: "shepherd" },
  { text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.", ref: "1 Tessalonicenses 5:18", theme: "gratidão", bg: "olive_tree" },
  { text: "Em todas estas coisas somos mais que vencedores, por aquele que nos amou.", ref: "Romanos 8:37", theme: "vitória", bg: "lion" },
  { text: "Mas graças a Deus que nos dá a vitória por nosso Senhor Jesus Cristo.", ref: "1 Coríntios 15:57", theme: "vitória", bg: "fire" },

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
