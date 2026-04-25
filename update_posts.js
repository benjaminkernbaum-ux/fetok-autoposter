const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, 'src', 'dashboard.js');
let dash = fs.readFileSync(dashPath, 'utf8');

// New Serie 2 POSTS_DATA
const NEW_POSTS = `const POSTS_DATA = [
  // DIA 1 — GRAÇA
  { day:1, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Lamentações 3:22-23', theme:'graça', themeEmoji:'🕊️',
    text:'As misericórdias do Senhor são a causa de não sermos consumidos; renovam-se cada manhã.',
    videoFile:'verse_lamentacoes_3.mp4', music:'Ana Nóbrega → Jardim da Oração', musicSearch:'ana nobrega jardim da oração',
    caption:\`As misericórdias do Senhor são a causa de não sermos consumidos; renovam-se cada manhã. 🕊️✝️\\nLamentações 3:22-23\\n\\nVocê ACORDOU hoje? Isso já é misericórdia de Deus! 🌅\\nA cada manhã Ele renova Suas promessas sobre a sua vida. 💛\\nComenta AMÉM se você crê nisso! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #misericordia #graça #fetok #fyp #viral #gospel #cristao\` },
  { day:1, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Efésios 2:8-9', theme:'graça', themeEmoji:'✨',
    text:'Porque pela graça sois salvos, por meio da fé; isto não vem de vós, é dom de Deus.',
    videoFile:'verse_efesios_2.mp4', music:'Priscilla Alcantara → Girassol', musicSearch:'priscilla alcantara girassol',
    caption:\`Porque pela graça sois salvos, por meio da fé; isto não vem de vós, é dom de Deus. ✨✝️\\nEfésios 2:8-9\\n\\nVocê NÃO precisa merecer. A graça é DE GRAÇA. 🎁\\nDeus já te aceitou como você é! ❤️\\nSalve e envie pra quem precisa ouvir isso! 🔥\\n\\n#versiculododia #biblia #fe #jesus #deus #graça #salvação #fetok #fyp #viral #gospel #cristao\` },
  { day:1, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'2 Coríntios 12:9', theme:'graça', themeEmoji:'💎',
    text:'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.',
    videoFile:'verse_2corintios_12.mp4', music:'Morada → Só Quero Ver Você', musicSearch:'morada so quero ver voce',
    caption:\`A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza. 💎✝️\\n2 Coríntios 12:9\\n\\nVocê está se sentindo FRACO? Ótimo. 💪\\nÉ na sua fraqueza que Deus mostra Seu PODER! 🔥\\nComenta "A graça me basta" se você crê! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #graça #fraqueza #poder #fetok #fyp #viral #gospel #cristao\` },
  // DIA 2 — PAZ
  { day:2, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'João 14:27', theme:'paz', themeEmoji:'☮️',
    text:'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.',
    videoFile:'verse_joao_14.mp4', music:'Laura Souguellis → Todavia Me Alegrarei', musicSearch:'laura souguellis todavia me alegrarei',
    caption:\`Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. ☮️✝️\\nJoão 14:27\\n\\nA paz do MUNDO é temporária. A paz de JESUS é eterna! 🕊️\\nSe seu coração está inquieto, receba essa palavra AGORA. 💛\\nComenta PAZ e compartilhe! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #paz #coração #fetok #fyp #viral #gospel #cristao\` },
  { day:2, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Filipenses 4:6-7', theme:'paz', themeEmoji:'🙇',
    text:'Não andeis ansiosos de coisa alguma; a paz de Deus guardará os vossos corações.',
    videoFile:'verse_filipenses_4.mp4', music:'Casa Worship → Vai Valer a Pena', musicSearch:'casa worship vai valer a pena',
    caption:\`Não andeis ansiosos de coisa alguma; a paz de Deus guardará os vossos corações. 🙇✝️\\nFilipenses 4:6-7\\n\\nVocê está ANSIOSO? Deus tem uma ordem: PARE. 🛑\\nEntregue TUDO nas mãos Dele. A paz já é sua! 🕊️\\nComenta 🙏 se você precisa dessa paz HOJE!\\n\\n#versiculododia #biblia #fe #jesus #deus #ansiedade #paz #fetok #fyp #viral #gospel #cristao\` },
  { day:2, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Isaías 26:3', theme:'paz', themeEmoji:'🧠',
    text:'Tu conservarás em paz aquele cuja mente está firme em ti.',
    videoFile:'verse_isaias_26.mp4', music:'Vocal Livre → Santo Espírito', musicSearch:'vocal livre santo espirito',
    caption:\`Tu conservarás em paz aquele cuja mente está firme em ti. 🧠✝️\\nIsaías 26:3\\n\\nQuer PAZ? Firme sua mente em DEUS. É simples assim. 🎯\\nPare de olhar pro problema e olhe pro CRIADOR! 🔥\\nSalve esse vídeo e assista quando a ansiedade bater! 💛\\n\\n#versiculododia #biblia #fe #jesus #deus #mente #paz #fetok #fyp #viral #gospel #cristao\` },
  // DIA 3 — ESPERANÇA
  { day:3, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Romanos 15:13', theme:'esperança', themeEmoji:'🌈',
    text:'O Deus da esperança vos encha de todo o gozo e paz no crer.',
    videoFile:'verse_romanos_15.mp4', music:'Eli Soares → Cante e Deixe o Rio Fluir', musicSearch:'eli soares cante e deixe o rio fluir',
    caption:\`O Deus da esperança vos encha de todo o gozo e paz no crer. 🌈✝️\\nRomanos 15:13\\n\\nDeus não é o Deus do DESESPERO. Ele é o Deus da ESPERANÇA! 🌅\\nEle está preparando algo LINDO pra você. ✨\\nComenta ESPERANÇA e receba essa promessa! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #esperança #gozo #fetok #fyp #viral #gospel #cristao\` },
  { day:3, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Salmos 42:11', theme:'esperança', themeEmoji:'💧',
    text:'Por que estás abatida, ó minha alma? Espera em Deus, pois ainda o louvarei.',
    videoFile:'verse_salmos_42.mp4', music:'Nívea Soares → Rio de Deus', musicSearch:'nivea soares rio de deus',
    caption:\`Por que estás abatida, ó minha alma? Espera em Deus, pois ainda o louvarei. 💧✝️\\nSalmos 42:11\\n\\nSua alma está CANSADA? Seu coração está PESADO? 😢\\nDeus está te dizendo: NÃO DESISTA. O louvor vem DEPOIS do choro. 🌅\\nComenta EU CREIO! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #alma #esperança #fetok #fyp #viral #gospel #cristao\` },
  { day:3, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Isaías 40:29', theme:'esperança', themeEmoji:'⚡',
    text:'Ele dá força ao cansado e multiplica as forças ao que não tem vigor.',
    videoFile:'verse_isaias_40.mp4', music:'Thalles Roberto → Deus Me Ama', musicSearch:'thalles roberto deus me ama',
    caption:\`Ele dá força ao cansado e multiplica as forças ao que não tem vigor. ⚡✝️\\nIsaías 40:29\\n\\nVocê está SEM FORÇAS? Deus vai MULTIPLICAR o que você nem tem! 💪\\nNão dependa da sua energia — dependa da DELE! 🔥\\nCompartilhe com quem está precisando de forças! ❤️\\n\\n#versiculododia #biblia #fe #jesus #deus #força #cansaço #fetok #fyp #viral #gospel #cristao\` },
  // DIA 4 — VITÓRIA
  { day:4, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Deuteronômio 31:6', theme:'vitória', themeEmoji:'🦁',
    text:'Sê forte e corajoso; não temas nem te espantes, pois o Senhor teu Deus é contigo.',
    videoFile:'verse_deuteronomio_31.mp4', music:'André Valadão → Faz Chover', musicSearch:'andre valadao faz chover',
    caption:\`Sê forte e corajoso; não temas nem te espantes, pois o Senhor teu Deus é contigo. 🦁✝️\\nDeuteronômio 31:6\\n\\nDeus NÃO te mandou ter medo. Ele te mandou ser CORAJOSO! 💪\\nVAI COM DEUS! 🔥\\nComenta CORAGEM se você vai enfrentar essa semana com fé! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #coragem #vitória #fetok #fyp #viral #gospel #cristao\` },
  { day:4, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'2 Timóteo 1:7', theme:'vitória', themeEmoji:'🔥',
    text:'Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.',
    videoFile:'verse_2timoteo_1.mp4', music:'Bruna Karla → Como Águia', musicSearch:'bruna karla como aguia',
    caption:\`Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação. 🔥✝️\\n2 Timóteo 1:7\\n\\nPARA de viver com MEDO! 🛑\\nDeus te deu PODER. Deus te deu AMOR. Deus te deu DOMÍNIO! 👑\\nVocê é mais FORTE do que imagina! Comenta AMÉM! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #poder #amor #fetok #fyp #viral #gospel #cristao\` },
  { day:4, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Romanos 8:37', theme:'vitória', themeEmoji:'🏆',
    text:'Em todas estas coisas somos mais que vencedores por aquele que nos amou.',
    videoFile:'verse_romanos_8.mp4', music:'Heloisa Rosa → Consagração', musicSearch:'heloisa rosa consagracao',
    caption:\`Em todas estas coisas somos mais que vencedores por aquele que nos amou. 🏆✝️\\nRomanos 8:37\\n\\nVocê NÃO é derrotado. Você é MAIS QUE VENCEDOR! 👑\\nA vitória já é SUA! 🔥\\nComenta "Sou vencedor" e declare isso sobre a sua vida! 💪\\n\\n#versiculododia #biblia #fe #jesus #deus #vencedor #vitória #fetok #fyp #viral #gospel #cristao\` },
  // DIA 5 — CURA
  { day:5, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Jeremias 30:17', theme:'cura', themeEmoji:'💚',
    text:'Eu te restaurarei a saúde e curarei as tuas feridas, diz o Senhor.',
    videoFile:'verse_jeremias_30.mp4', music:'Eyshila → Fiel a Mim', musicSearch:'eyshila fiel a mim',
    caption:\`Eu te restaurarei a saúde e curarei as tuas feridas, diz o Senhor. 💚✝️\\nJeremias 30:17\\n\\nDeus está te dizendo: EU VOU TE CURAR. 🩹\\nSeja no corpo, na alma ou no coração — Ele é o MÉDICO! 🏥\\nComenta CURA e receba essa promessa! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #cura #restauração #fetok #fyp #viral #gospel #cristao\` },
  { day:5, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Salmos 147:3', theme:'cura', themeEmoji:'❤️‍🩹',
    text:'Ele sara os quebrantados de coração e lhes pensa as feridas.',
    videoFile:'verse_salmos_147.mp4', music:'Amanda Wanessa → Tu és Fiel', musicSearch:'amanda wanessa tu es fiel',
    caption:\`Ele sara os quebrantados de coração e lhes pensa as feridas. ❤️‍🩹✝️\\nSalmos 147:3\\n\\nSeu coração está PARTIDO? Deus é especialista em COLAR os pedaços. 💔→❤️\\nEle não só cura — Ele CUIDA de cada ferida com amor. 🩹\\nEnvie pra alguém com o coração machucado! 💛\\n\\n#versiculododia #biblia #fe #jesus #deus #coração #cura #fetok #fyp #viral #gospel #cristao\` },
  { day:5, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Joel 2:25', theme:'cura', themeEmoji:'🌱',
    text:'Restituir-vos-ei os anos que foram consumidos pelo gafanhoto.',
    videoFile:'verse_joel_2.mp4', music:'Kemuel → Lugar Seguro', musicSearch:'kemuel lugar seguro',
    caption:\`Restituir-vos-ei os anos que foram consumidos pelo gafanhoto. 🌱✝️\\nJoel 2:25\\n\\nVocê sente que PERDEU tempo? Que desperdiçou ANOS? 😔\\nDeus prometeu: EU VOU RESTITUIR TUDO! 🔄\\nO melhor da sua vida ainda NÃO aconteceu! Comenta EU CREIO! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #restituição #tempo #fetok #fyp #viral #gospel #cristao\` },
  // DIA 6 — PROPÓSITO
  { day:6, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Efésios 2:10', theme:'propósito', themeEmoji:'🎯',
    text:'Somos feitura de Deus, criados em Cristo Jesus para boas obras.',
    videoFile:'verse_efesios_2_10.mp4', music:'Ton Carfi → Meu Melhor Louvor', musicSearch:'ton carfi meu melhor louvor',
    caption:\`Somos feitura de Deus, criados em Cristo Jesus para boas obras. 🎯✝️\\nEfésios 2:10\\n\\nVocê NÃO é um acidente. Você é OBRA-PRIMA de Deus! 🎨\\nEle te criou com um PROPÓSITO específico. ✨\\nComenta "Tenho propósito" e declare isso! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #propósito #obraprima #fetok #fyp #viral #gospel #cristao\` },
  { day:6, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Tiago 1:5', theme:'propósito', themeEmoji:'📖',
    text:'Se algum de vós tem falta de sabedoria, peça a Deus, que a todos dá liberalmente.',
    videoFile:'verse_tiago_1.mp4', music:'Luma Elpídio → Eu Sou de Jesus', musicSearch:'luma elpidio eu sou de jesus',
    caption:\`Se algum de vós tem falta de sabedoria, peça a Deus, que a todos dá liberalmente. 📖✝️\\nTiago 1:5\\n\\nNão sabe o que fazer? PEÇA A DEUS! 🙏\\nEle vai te dar SABEDORIA de graça! 🧠\\nComenta SABEDORIA e ore antes de decidir! 💛\\n\\n#versiculododia #biblia #fe #jesus #deus #sabedoria #decisão #fetok #fyp #viral #gospel #cristao\` },
  { day:6, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Miquéias 6:8', theme:'propósito', themeEmoji:'⚖️',
    text:'Que se requer de ti? Que pratiques a justiça, ames a misericórdia e andes humildemente.',
    videoFile:'verse_miqueias_6.mp4', music:'Daniela Araújo → Abertura', musicSearch:'daniela araujo abertura',
    caption:\`Que se requer de ti? Que pratiques a justiça, ames a misericórdia e andes humildemente. ⚖️✝️\\nMiquéias 6:8\\n\\nQuer saber o que Deus ESPERA de você? 🤔\\nNão é perfeição. É JUSTIÇA, MISERICÓRDIA e HUMILDADE. 🕊️\\nComenta AMÉM se você vai viver isso! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #justiça #misericordia #fetok #fyp #viral #gospel #cristao\` },
  // DIA 7 — ADORAÇÃO
  { day:7, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Salmos 100:4', theme:'adoração', themeEmoji:'🎶',
    text:'Entrai pelas suas portas com ação de graças, pelos seus átrios com louvor.',
    videoFile:'verse_salmos_100.mp4', music:'Sarah Beatriz → Superação', musicSearch:'sarah beatriz superacao',
    caption:\`Entrai pelas suas portas com ação de graças, pelos seus átrios com louvor. 🎶✝️\\nSalmos 100:4\\n\\nDOMINGO é dia de ADORAR! 🙌\\nEntre na presença de Deus com GRATIDÃO e LOUVOR! 🎵\\nComenta o nome da sua igreja e marque um irmão! ⛪\\n\\n#versiculododia #biblia #fe #jesus #deus #louvor #adoração #fetok #fyp #viral #gospel #cristao #domingo\` },
  { day:7, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Apocalipse 21:4', theme:'adoração', themeEmoji:'👑',
    text:'Ele enxugará toda lágrima dos seus olhos. Não haverá mais morte, nem pranto.',
    videoFile:'verse_apocalipse_21.mp4', music:'Damares → Sabor de Mel', musicSearch:'damares sabor de mel',
    caption:\`Ele enxugará toda lágrima dos seus olhos. Não haverá mais morte, nem pranto. 👑✝️\\nApocalipse 21:4\\n\\nUm dia TODA DOR vai acabar. TODA lágrima vai secar. 😭→😊\\nDeus prometeu um futuro onde SÓ existe alegria! 🌅\\nComenta EU CREIO! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #eternidade #promessa #fetok #fyp #viral #gospel #cristao\` },
  { day:7, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Mateus 11:28', theme:'adoração', themeEmoji:'🤗',
    text:'Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei.',
    videoFile:'verse_mateus_11.mp4', music:'Aline Barros → Rendido Estou', musicSearch:'aline barros rendido estou',
    caption:\`Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei. 🤗✝️\\nMateus 11:28\\n\\nÚLTIMA palavra da semana: DESCANSE em Jesus. 🛌\\nPare de carregar o peso SOZINHO. Entregue TUDO a Ele! 💛\\nComenta DESCANSO e comece a semana renovado! 🙏\\n\\nSe essa página te abençoou, SIGA para mais versículos diários! 🔔\\n\\n#versiculododia #biblia #fe #jesus #deus #descanso #alivio #fetok #fyp #viral #gospel #cristao\` },
];`;

// Replace POSTS_DATA
const startMarker = 'const POSTS_DATA = [';
const endMarker = '];';
const startIdx = dash.indexOf(startMarker);
let endIdx = dash.indexOf(endMarker, startIdx);
// Find the correct closing bracket (after all nested objects)
let depth = 0;
for (let i = startIdx; i < dash.length; i++) {
  if (dash[i] === '[') depth++;
  if (dash[i] === ']') { depth--; if (depth === 0) { endIdx = i + 2; break; } }
}

dash = dash.substring(0, startIdx) + NEW_POSTS + dash.substring(endIdx);

// Add new theme CSS classes
const oldThemes = `.theme-proteção { background: rgba(52,199,89,0.12); color: #34c759; }
    .theme-coragem { background: rgba(255,149,0,0.12); color: #ff9500; }
    .theme-amor { background: rgba(255,45,85,0.12); color: #ff2d55; }
    .theme-força { background: rgba(175,130,255,0.12); color: #af82ff; }
    .theme-fé { background: rgba(0,122,255,0.12); color: #007aff; }
    .theme-esperança { background: rgba(255,214,10,0.12); color: #ffd60a; }`;

const newThemes = `.theme-proteção { background: rgba(52,199,89,0.12); color: #34c759; }
    .theme-coragem { background: rgba(255,149,0,0.12); color: #ff9500; }
    .theme-amor { background: rgba(255,45,85,0.12); color: #ff2d55; }
    .theme-força { background: rgba(175,130,255,0.12); color: #af82ff; }
    .theme-fé { background: rgba(0,122,255,0.12); color: #007aff; }
    .theme-esperança { background: rgba(255,214,10,0.12); color: #ffd60a; }
    .theme-graça { background: rgba(168,85,247,0.12); color: #a855f7; }
    .theme-paz { background: rgba(6,182,212,0.12); color: #06b6d4; }
    .theme-vitória { background: rgba(239,68,68,0.12); color: #ef4444; }
    .theme-cura { background: rgba(34,197,94,0.12); color: #22c55e; }
    .theme-propósito { background: rgba(59,130,246,0.12); color: #3b82f6; }
    .theme-adoração { background: rgba(236,72,153,0.12); color: #ec4899; }`;

dash = dash.replace(oldThemes, newThemes);

// Update header text
dash = dash.replace('@luz.da.palavra.oficial', '@luz.da.palavra.oficial · Série 2');
dash = dash.replace('22 vídeos prontos', '21 novos versículos');

fs.writeFileSync(dashPath, dash, 'utf8');
console.log('✅ dashboard.js updated with Serie 2 content!');
console.log(`   File size: ${(fs.statSync(dashPath).size / 1024).toFixed(1)} KB`);
