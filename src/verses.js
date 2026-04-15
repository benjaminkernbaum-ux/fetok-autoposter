/**
 * FéTok Verse Database — 50+ versículos organizados por tema
 * Cada versículo roda uma vez e é marcado como postado
 */

const verses = [
  // ═══ PROTEÇÃO ═══
  { text: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1", theme: "proteção", bg: "golden_rays", posted: true },
  { text: "Aquele que habita no abrigo do Altíssimo descansará à sombra do Todo-Poderoso.", ref: "Salmos 91:1", theme: "proteção", bg: "divine_light" },
  { text: "O Senhor é a minha luz e a minha salvação; de quem terei medo?", ref: "Salmos 27:1", theme: "proteção", bg: "golden_rays" },
  { text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", ref: "Salmos 46:1", theme: "proteção", bg: "mountain" },
  { text: "O Senhor está perto de todos os que o invocam.", ref: "Salmos 145:18", theme: "proteção", bg: "divine_light" },

  // ═══ CORAGEM ═══
  { text: "Tende bom ânimo! Sou eu. Não temais.", ref: "Mateus 14:27", theme: "coragem", bg: "walking_water", posted: true },
  { text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.", ref: "Isaías 41:10", theme: "coragem", bg: "mountain" },
  { text: "Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor está com você.", ref: "Josué 1:9", theme: "coragem", bg: "shepherd" },
  { text: "Quando passares pelas águas, estarei contigo.", ref: "Isaías 43:2", theme: "coragem", bg: "walking_water" },
  { text: "O Senhor dos Exércitos está conosco; o Deus de Jacó é o nosso refúgio.", ref: "Salmos 46:7", theme: "coragem", bg: "divine_light" },

  // ═══ AMOR ═══
  { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.", ref: "João 3:16", theme: "amor", bg: "cross_light", posted: true },
  { text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.", ref: "1 Coríntios 13:4", theme: "amor", bg: "dove" },
  { text: "Nisto se manifestou o amor de Deus para conosco: Deus enviou seu Filho unigênito ao mundo.", ref: "1 João 4:9", theme: "amor", bg: "cross_light" },
  { text: "Mas Deus prova o seu próprio amor para conosco, pelo fato de ter Cristo morrido por nós.", ref: "Romanos 5:8", theme: "amor", bg: "cross_light" },
  { text: "Porque as montanhas se retirarão, mas a minha graça não se apartará de ti.", ref: "Isaías 54:10", theme: "amor", bg: "mountain" },

  // ═══ FORÇA ═══
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13", theme: "força", bg: "prayer_hands" },
  { text: "Os que esperam no Senhor renovam as suas forças; sobem com asas como águias.", ref: "Isaías 40:31", theme: "força", bg: "dove" },
  { text: "O Senhor é a minha força e o meu cântico; ele é a minha salvação.", ref: "Êxodo 15:2", theme: "força", bg: "divine_light" },
  { text: "Mas os que esperam no Senhor renovarão as suas forças.", ref: "Isaías 40:31", theme: "força", bg: "mountain" },
  { text: "Fortalecei-vos no Senhor e na força do seu poder.", ref: "Efésios 6:10", theme: "força", bg: "shepherd" },

  // ═══ FÉ ═══
  { text: "Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.", ref: "Hebreus 11:1", theme: "fé", bg: "divine_light" },
  { text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", ref: "Provérbios 3:5", theme: "fé", bg: "olive_tree" },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.", ref: "Salmos 37:5", theme: "fé", bg: "narrow_path" },
  { text: "Porque andamos por fé e não por vista.", ref: "2 Coríntios 5:7", theme: "fé", bg: "narrow_path" },
  { text: "Se Deus é por nós, quem será contra nós?", ref: "Romanos 8:31", theme: "fé", bg: "cross_light" },

  // ═══ ESPERANÇA ═══
  { text: "Eu sei os planos que tenho para vocês. Planos de fazê-los prosperar e não de lhes causar dano.", ref: "Jeremias 29:11", theme: "esperança", bg: "sunrise" },
  { text: "Porque eu, o Senhor teu Deus, te tomo pela tua mão direita e te digo: Não temas.", ref: "Isaías 41:13", theme: "esperança", bg: "divine_light" },
  { text: "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus.", ref: "Romanos 8:28", theme: "esperança", bg: "golden_rays" },
  { text: "O choro pode durar uma noite, mas a alegria vem pela manhã.", ref: "Salmos 30:5", theme: "esperança", bg: "sunrise" },
  { text: "Porque a nossa leve e momentânea tribulação produz para nós um eterno peso de glória.", ref: "2 Coríntios 4:17", theme: "esperança", bg: "divine_light" },

  // ═══ PAZ ═══
  { text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.", ref: "Mateus 11:28", theme: "paz", bg: "prayer_hands" },
  { text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.", ref: "João 14:27", theme: "paz", bg: "dove" },
  { text: "E a paz de Deus, que excede todo o entendimento, guardará o vosso coração.", ref: "Filipenses 4:7", theme: "paz", bg: "olive_tree" },
  { text: "Aquietai-vos e sabei que eu sou Deus.", ref: "Salmos 46:10", theme: "paz", bg: "walking_water" },
  { text: "Em paz me deito e logo adormeço, porque só tu, Senhor, me fazes habitar em segurança.", ref: "Salmos 4:8", theme: "paz", bg: "golden_rays" },

  // ═══ GRATIDÃO ═══
  { text: "Deem graças ao Senhor porque ele é bom; o seu amor dura para sempre.", ref: "Salmos 107:1", theme: "gratidão", bg: "sunrise" },
  { text: "Deem graças em todas as circunstâncias, pois esta é a vontade de Deus.", ref: "1 Tessalonicenses 5:18", theme: "gratidão", bg: "olive_tree" },
  { text: "Grandes coisas fez o Senhor por nós, e por isso estamos alegres.", ref: "Salmos 126:3", theme: "gratidão", bg: "golden_rays" },

  // ═══ PERDÃO ═══
  { text: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar.", ref: "1 João 1:9", theme: "perdão", bg: "cross_light" },
  { text: "Tão longe quanto o oriente do ocidente, assim afastou de nós as nossas transgressões.", ref: "Salmos 103:12", theme: "perdão", bg: "mountain" },

  // ═══ PROVISÃO ═══
  { text: "E o meu Deus suprirá todas as vossas necessidades segundo as suas riquezas na glória.", ref: "Filipenses 4:19", theme: "provisão", bg: "golden_rays" },
  { text: "Buscai primeiro o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.", ref: "Mateus 6:33", theme: "provisão", bg: "narrow_path" },
  { text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", ref: "1 Pedro 5:7", theme: "provisão", bg: "shepherd" },

  // ═══ SABEDORIA ═══
  { text: "Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente.", ref: "Tiago 1:5", theme: "sabedoria", bg: "bible_light" },
  { text: "O temor do Senhor é o princípio da sabedoria.", ref: "Provérbios 9:10", theme: "sabedoria", bg: "divine_light" },
  { text: "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.", ref: "Salmos 119:105", theme: "sabedoria", bg: "narrow_path" },

  // ═══ VITÓRIA ═══
  { text: "Mas graças a Deus, que nos dá a vitória por meio de nosso Senhor Jesus Cristo.", ref: "1 Coríntios 15:57", theme: "vitória", bg: "cross_light" },
  { text: "Em todas estas coisas somos mais do que vencedores, por aquele que nos amou.", ref: "Romanos 8:37", theme: "vitória", bg: "mountain" },
  { text: "Porque todo o que é nascido de Deus vence o mundo.", ref: "1 João 5:4", theme: "vitória", bg: "shepherd" },

  // ═══ CURA ═══
  { text: "Pelas suas feridas fomos sarados.", ref: "Isaías 53:5", theme: "cura", bg: "cross_light" },
  { text: "Ele sara os de coração quebrantado e lhes pensa as feridas.", ref: "Salmos 147:3", theme: "cura", bg: "prayer_hands" },
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
