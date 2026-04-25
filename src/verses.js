/**
 * FéTok Verse Database — SÉRIE 2
 * 50+ versículos NOVOS organizados por tema
 * Todos diferentes da Série 1
 */

const verses = [
  // ═══ GRAÇA ═══
  { text: "As misericórdias do Senhor são a causa de não sermos consumidos; renovam-se cada manhã.", ref: "Lamentações 3:22-23", theme: "graça", bg: "golden_rays", music: "Ana Nóbrega → Jardim da Oração", musicSearch: "ana nobrega jardim da oração" },
  { text: "Porque pela graça sois salvos, por meio da fé; isto não vem de vós, é dom de Deus.", ref: "Efésios 2:8-9", theme: "graça", bg: "divine_light", music: "Priscilla Alcantara → Girassol", musicSearch: "priscilla alcantara girassol" },
  { text: "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.", ref: "2 Coríntios 12:9", theme: "graça", bg: "cross_light", music: "Morada → Só Quero Ver Você", musicSearch: "morada so quero ver voce" },
  { text: "Graça e verdade vieram por meio de Jesus Cristo.", ref: "João 1:17", theme: "graça", bg: "sunrise", music: "Ministério Zoe → Lugar Secreto", musicSearch: "ministerio zoe lugar secreto" },
  { text: "Mas onde abundou o pecado, superabundou a graça.", ref: "Romanos 5:20", theme: "graça", bg: "divine_light", music: "Fernandinho → Grandes Coisas", musicSearch: "fernandinho grandes coisas" },

  // ═══ PAZ ═══
  { text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.", ref: "João 14:27", theme: "paz", bg: "dove", music: "Laura Souguellis → Todavia Me Alegrarei", musicSearch: "laura souguellis todavia me alegrarei" },
  { text: "Não andeis ansiosos de coisa alguma; a paz de Deus guardará os vossos corações.", ref: "Filipenses 4:6-7", theme: "paz", bg: "olive_tree", music: "Casa Worship → Vai Valer a Pena", musicSearch: "casa worship vai valer a pena" },
  { text: "Tu conservarás em paz aquele cuja mente está firme em ti.", ref: "Isaías 26:3", theme: "paz", bg: "walking_water", music: "Vocal Livre → Santo Espírito", musicSearch: "vocal livre santo espirito" },
  { text: "Estas coisas vos tenho dito para que em mim tenhais paz.", ref: "João 16:33", theme: "paz", bg: "golden_rays", music: "Gabriel Guedes → Vai Passar", musicSearch: "gabriel guedes vai passar" },
  { text: "Bem-aventurados os pacificadores, porque serão chamados filhos de Deus.", ref: "Mateus 5:9", theme: "paz", bg: "shepherd", music: "Diante do Trono → Águas Purificadoras", musicSearch: "diante do trono aguas purificadoras" },

  // ═══ ESPERANÇA ═══
  { text: "O Deus da esperança vos encha de todo o gozo e paz no crer.", ref: "Romanos 15:13", theme: "esperança", bg: "sunrise", music: "Eli Soares → Cante e Deixe o Rio Fluir", musicSearch: "eli soares cante e deixe o rio fluir" },
  { text: "Por que estás abatida, ó minha alma? Espera em Deus, pois ainda o louvarei.", ref: "Salmos 42:11", theme: "esperança", bg: "mountain", music: "Nívea Soares → Rio de Deus", musicSearch: "nivea soares rio de deus" },
  { text: "Ele dá força ao cansado e multiplica as forças ao que não tem vigor.", ref: "Isaías 40:29", theme: "esperança", bg: "divine_light", music: "Thalles Roberto → Deus Me Ama", musicSearch: "thalles roberto deus me ama" },
  { text: "A esperança não nos decepciona, porque o amor de Deus é derramado em nossos corações.", ref: "Romanos 5:5", theme: "esperança", bg: "golden_rays", music: "Aline Barros → Consagração", musicSearch: "aline barros consagracao" },
  { text: "Levanta-te, resplandece, porque vem a tua luz, e a glória do Senhor vai nascendo sobre ti.", ref: "Isaías 60:1", theme: "esperança", bg: "sunrise", music: "Isaias Saad → Enche-me", musicSearch: "isaias saad enche-me" },

  // ═══ VITÓRIA ═══
  { text: "Sê forte e corajoso; não temas nem te espantes, pois o Senhor teu Deus é contigo.", ref: "Deuteronômio 31:6", theme: "vitória", bg: "mountain", music: "André Valadão → Faz Chover", musicSearch: "andre valadao faz chover" },
  { text: "Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.", ref: "2 Timóteo 1:7", theme: "vitória", bg: "shepherd", music: "Bruna Karla → Como Águia", musicSearch: "bruna karla como aguia" },
  { text: "Em todas estas coisas somos mais que vencedores por aquele que nos amou.", ref: "Romanos 8:37", theme: "vitória", bg: "cross_light", music: "Heloisa Rosa → Consagração", musicSearch: "heloisa rosa consagracao" },
  { text: "Mas graças a Deus, que nos dá a vitória por meio de nosso Senhor Jesus Cristo.", ref: "1 Coríntios 15:57", theme: "vitória", bg: "divine_light", music: "Fernanda Brum → Gigante do Amor", musicSearch: "fernanda brum gigante do amor" },
  { text: "Nenhuma arma forjada contra ti prosperará.", ref: "Isaías 54:17", theme: "vitória", bg: "prayer_hands", music: "Ton Carfi → Deus é Deus", musicSearch: "ton carfi deus e deus" },

  // ═══ CURA ═══
  { text: "Eu te restaurarei a saúde e curarei as tuas feridas, diz o Senhor.", ref: "Jeremias 30:17", theme: "cura", bg: "prayer_hands", music: "Eyshila → Fiel a Mim", musicSearch: "eyshila fiel a mim" },
  { text: "Ele sara os quebrantados de coração e lhes pensa as feridas.", ref: "Salmos 147:3", theme: "cura", bg: "dove", music: "Amanda Wanessa → Tu és Fiel", musicSearch: "amanda wanessa tu es fiel" },
  { text: "Restituir-vos-ei os anos que foram consumidos pelo gafanhoto.", ref: "Joel 2:25", theme: "cura", bg: "olive_tree", music: "Kemuel → Lugar Seguro", musicSearch: "kemuel lugar seguro" },
  { text: "Pelas suas feridas fomos sarados.", ref: "Isaías 53:5", theme: "cura", bg: "cross_light", music: "Gabriela Rocha → Deus Provará", musicSearch: "gabriela rocha deus provera" },
  { text: "Cura-me, Senhor, e serei curado; salva-me, e serei salvo.", ref: "Jeremias 17:14", theme: "cura", bg: "divine_light", music: "Priscilla Alcantara → Eu Vou", musicSearch: "priscilla alcantara eu vou" },

  // ═══ PROPÓSITO ═══
  { text: "Somos feitura de Deus, criados em Cristo Jesus para boas obras.", ref: "Efésios 2:10", theme: "propósito", bg: "golden_rays", music: "Ton Carfi → Meu Melhor Louvor", musicSearch: "ton carfi meu melhor louvor" },
  { text: "Se algum de vós tem falta de sabedoria, peça a Deus, que a todos dá liberalmente.", ref: "Tiago 1:5", theme: "propósito", bg: "bible_light", music: "Luma Elpídio → Eu Sou de Jesus", musicSearch: "luma elpidio eu sou de jesus" },
  { text: "Que se requer de ti? Que pratiques a justiça, ames a misericórdia e andes humildemente.", ref: "Miquéias 6:8", theme: "propósito", bg: "narrow_path", music: "Daniela Araújo → Abertura", musicSearch: "daniela araujo abertura" },
  { text: "Eu sei os planos que tenho para vocês, planos de paz e não de mal.", ref: "Jeremias 29:11", theme: "propósito", bg: "sunrise", music: "Mariana Valadão → Vai Ser Tão Lindo", musicSearch: "mariana valadao vai ser tao lindo" },
  { text: "Porque dele, e por ele, e para ele são todas as coisas.", ref: "Romanos 11:36", theme: "propósito", bg: "divine_light", music: "Paulo César Baruk → Santo", musicSearch: "paulo cesar baruk santo" },

  // ═══ ADORAÇÃO ═══
  { text: "Entrai pelas suas portas com ação de graças, pelos seus átrios com louvor.", ref: "Salmos 100:4", theme: "adoração", bg: "golden_rays", music: "Sarah Beatriz → Superação", musicSearch: "sarah beatriz superacao" },
  { text: "Ele enxugará toda lágrima dos seus olhos. Não haverá mais morte, nem pranto.", ref: "Apocalipse 21:4", theme: "adoração", bg: "divine_light", music: "Damares → Sabor de Mel", musicSearch: "damares sabor de mel" },
  { text: "Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei.", ref: "Mateus 11:28", theme: "adoração", bg: "prayer_hands", music: "Aline Barros → Rendido Estou", musicSearch: "aline barros rendido estou" },
  { text: "Cantai ao Senhor um cântico novo, porque fez maravilhas.", ref: "Salmos 98:1", theme: "adoração", bg: "sunrise", music: "Ministério Avivah → Yeshua", musicSearch: "ministerio avivah yeshua" },
  { text: "Eu te louvarei, Senhor, de todo o meu coração.", ref: "Salmos 9:1", theme: "adoração", bg: "cross_light", music: "Nívea Soares → Eu Conto Pra Ti", musicSearch: "nivea soares eu conto pra ti" },
];

/**
 * Get the next unposted verse, optionally filtered by theme
 */
function getNextVerse(theme = null) {
  const available = verses.filter(v => !v.posted && (theme ? v.theme === theme : true));
  if (available.length === 0) {
    verses.forEach(v => v.posted = false);
    return verses.find(v => theme ? v.theme === theme : true);
  }
  return available[0];
}

function markPosted(ref) {
  const v = verses.find(v => v.ref === ref);
  if (v) v.posted = true;
}

function getAllVerses() {
  return verses;
}

function getStats() {
  return {
    total: verses.length,
    posted: verses.filter(v => v.posted).length,
    remaining: verses.filter(v => !v.posted).length,
  };
}

module.exports = { getNextVerse, markPosted, getAllVerses, getStats, verses };
