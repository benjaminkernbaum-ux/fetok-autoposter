/**
 * FéTok Dashboard v2.0 — Complete Content Management Hub
 * All 21 videos + captions + viral music + mobile-responsive
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const { getAllVerses, getStats } = require('./verses');
const { buildCaption } = require('./captionBuilder');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const PORT = process.env.PORT || 3000;

/* ═══════════════════════════════════════════════════════════════
   COMPLETE 21-POST DATA — All captions from guia_21_posts.md
   with enhanced viral formatting
   ═══════════════════════════════════════════════════════════════ */
const POSTS_DATA = [
  // DIA 1 — GRAÇA
  { day:1, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Lamentações 3:22-23', theme:'graça', themeEmoji:'🕊️',
    text:'As misericórdias do Senhor são a causa de não sermos consumidos; renovam-se cada manhã.',
    videoFile:'verse_lamentacoes_3.mp4', music:'Ana Nóbrega → Jardim da Oração', musicSearch:'ana nobrega jardim da oração',
    caption:`As misericórdias do Senhor são a causa de não sermos consumidos; renovam-se cada manhã. 🕊️✝️\nLamentações 3:22-23\n\nVocê ACORDOU hoje? Isso já é misericórdia de Deus! 🌅\nA cada manhã Ele renova Suas promessas sobre a sua vida. 💛\nComenta AMÉM se você crê nisso! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #misericordia #graça #fetok #fyp #viral #gospel #cristao` },
  { day:1, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Efésios 2:8-9', theme:'graça', themeEmoji:'✨',
    text:'Porque pela graça sois salvos, por meio da fé; isto não vem de vós, é dom de Deus.',
    videoFile:'verse_efesios_2.mp4', music:'Priscilla Alcantara → Girassol', musicSearch:'priscilla alcantara girassol',
    caption:`Porque pela graça sois salvos, por meio da fé; isto não vem de vós, é dom de Deus. ✨✝️\nEfésios 2:8-9\n\nVocê NÃO precisa merecer. A graça é DE GRAÇA. 🎁\nDeus já te aceitou como você é! ❤️\nSalve e envie pra quem precisa ouvir isso! 🔥\n\n#versiculododia #biblia #fe #jesus #deus #graça #salvação #fetok #fyp #viral #gospel #cristao` },
  { day:1, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'2 Coríntios 12:9', theme:'graça', themeEmoji:'💎',
    text:'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.',
    videoFile:'verse_2corintios_12.mp4', music:'Morada → Só Quero Ver Você', musicSearch:'morada so quero ver voce',
    caption:`A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza. 💎✝️\n2 Coríntios 12:9\n\nVocê está se sentindo FRACO? Ótimo. 💪\nÉ na sua fraqueza que Deus mostra Seu PODER! 🔥\nComenta "A graça me basta" se você crê! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #graça #fraqueza #poder #fetok #fyp #viral #gospel #cristao` },
  // DIA 2 — PAZ
  { day:2, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'João 14:27', theme:'paz', themeEmoji:'☮️',
    text:'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.',
    videoFile:'verse_joao_14.mp4', music:'Laura Souguellis → Todavia Me Alegrarei', musicSearch:'laura souguellis todavia me alegrarei',
    caption:`Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. ☮️✝️\nJoão 14:27\n\nA paz do MUNDO é temporária. A paz de JESUS é eterna! 🕊️\nSe seu coração está inquieto, receba essa palavra AGORA. 💛\nComenta PAZ e compartilhe! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #paz #coração #fetok #fyp #viral #gospel #cristao` },
  { day:2, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Filipenses 4:6-7', theme:'paz', themeEmoji:'🙇',
    text:'Não andeis ansiosos de coisa alguma; a paz de Deus guardará os vossos corações.',
    videoFile:'verse_filipenses_4.mp4', music:'Casa Worship → Vai Valer a Pena', musicSearch:'casa worship vai valer a pena',
    caption:`Não andeis ansiosos de coisa alguma; a paz de Deus guardará os vossos corações. 🙇✝️\nFilipenses 4:6-7\n\nVocê está ANSIOSO? Deus tem uma ordem: PARE. 🛑\nEntregue TUDO nas mãos Dele. A paz já é sua! 🕊️\nComenta 🙏 se você precisa dessa paz HOJE!\n\n#versiculododia #biblia #fe #jesus #deus #ansiedade #paz #fetok #fyp #viral #gospel #cristao` },
  { day:2, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Isaías 26:3', theme:'paz', themeEmoji:'🧠',
    text:'Tu conservarás em paz aquele cuja mente está firme em ti.',
    videoFile:'verse_isaias_26.mp4', music:'Vocal Livre → Santo Espírito', musicSearch:'vocal livre santo espirito',
    caption:`Tu conservarás em paz aquele cuja mente está firme em ti. 🧠✝️\nIsaías 26:3\n\nQuer PAZ? Firme sua mente em DEUS. É simples assim. 🎯\nPare de olhar pro problema e olhe pro CRIADOR! 🔥\nSalve esse vídeo e assista quando a ansiedade bater! 💛\n\n#versiculododia #biblia #fe #jesus #deus #mente #paz #fetok #fyp #viral #gospel #cristao` },
  // DIA 3 — ESPERANÇA
  { day:3, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Romanos 15:13', theme:'esperança', themeEmoji:'🌈',
    text:'O Deus da esperança vos encha de todo o gozo e paz no crer.',
    videoFile:'verse_romanos_15.mp4', music:'Eli Soares → Cante e Deixe o Rio Fluir', musicSearch:'eli soares cante e deixe o rio fluir',
    caption:`O Deus da esperança vos encha de todo o gozo e paz no crer. 🌈✝️\nRomanos 15:13\n\nDeus não é o Deus do DESESPERO. Ele é o Deus da ESPERANÇA! 🌅\nEle está preparando algo LINDO pra você. ✨\nComenta ESPERANÇA e receba essa promessa! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #esperança #gozo #fetok #fyp #viral #gospel #cristao` },
  { day:3, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Salmos 42:11', theme:'esperança', themeEmoji:'💧',
    text:'Por que estás abatida, ó minha alma? Espera em Deus, pois ainda o louvarei.',
    videoFile:'verse_salmos_42.mp4', music:'Nívea Soares → Rio de Deus', musicSearch:'nivea soares rio de deus',
    caption:`Por que estás abatida, ó minha alma? Espera em Deus, pois ainda o louvarei. 💧✝️\nSalmos 42:11\n\nSua alma está CANSADA? Seu coração está PESADO? 😢\nDeus está te dizendo: NÃO DESISTA. O louvor vem DEPOIS do choro. 🌅\nComenta EU CREIO! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #alma #esperança #fetok #fyp #viral #gospel #cristao` },
  { day:3, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Isaías 40:29', theme:'esperança', themeEmoji:'⚡',
    text:'Ele dá força ao cansado e multiplica as forças ao que não tem vigor.',
    videoFile:'verse_isaias_40.mp4', music:'Thalles Roberto → Deus Me Ama', musicSearch:'thalles roberto deus me ama',
    caption:`Ele dá força ao cansado e multiplica as forças ao que não tem vigor. ⚡✝️\nIsaías 40:29\n\nVocê está SEM FORÇAS? Deus vai MULTIPLICAR o que você nem tem! 💪\nNão dependa da sua energia — dependa da DELE! 🔥\nCompartilhe com quem está precisando de forças! ❤️\n\n#versiculododia #biblia #fe #jesus #deus #força #cansaço #fetok #fyp #viral #gospel #cristao` },
  // DIA 4 — VITÓRIA
  { day:4, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Deuteronômio 31:6', theme:'vitória', themeEmoji:'🦁',
    text:'Sê forte e corajoso; não temas nem te espantes, pois o Senhor teu Deus é contigo.',
    videoFile:'verse_deuteronomio_31.mp4', music:'André Valadão → Faz Chover', musicSearch:'andre valadao faz chover',
    caption:`Sê forte e corajoso; não temas nem te espantes, pois o Senhor teu Deus é contigo. 🦁✝️\nDeuteronômio 31:6\n\nDeus NÃO te mandou ter medo. Ele te mandou ser CORAJOSO! 💪\nVAI COM DEUS! 🔥\nComenta CORAGEM se você vai enfrentar essa semana com fé! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #coragem #vitória #fetok #fyp #viral #gospel #cristao` },
  { day:4, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'2 Timóteo 1:7', theme:'vitória', themeEmoji:'🔥',
    text:'Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.',
    videoFile:'verse_2timoteo_1.mp4', music:'Bruna Karla → Como Águia', musicSearch:'bruna karla como aguia',
    caption:`Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação. 🔥✝️\n2 Timóteo 1:7\n\nPARA de viver com MEDO! 🛑\nDeus te deu PODER. Deus te deu AMOR. Deus te deu DOMÍNIO! 👑\nVocê é mais FORTE do que imagina! Comenta AMÉM! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #poder #amor #fetok #fyp #viral #gospel #cristao` },
  { day:4, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Romanos 8:37', theme:'vitória', themeEmoji:'🏆',
    text:'Em todas estas coisas somos mais que vencedores por aquele que nos amou.',
    videoFile:'verse_romanos_8.mp4', music:'Heloisa Rosa → Consagração', musicSearch:'heloisa rosa consagracao',
    caption:`Em todas estas coisas somos mais que vencedores por aquele que nos amou. 🏆✝️\nRomanos 8:37\n\nVocê NÃO é derrotado. Você é MAIS QUE VENCEDOR! 👑\nA vitória já é SUA! 🔥\nComenta "Sou vencedor" e declare isso sobre a sua vida! 💪\n\n#versiculododia #biblia #fe #jesus #deus #vencedor #vitória #fetok #fyp #viral #gospel #cristao` },
  // DIA 5 — CURA
  { day:5, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Jeremias 30:17', theme:'cura', themeEmoji:'💚',
    text:'Eu te restaurarei a saúde e curarei as tuas feridas, diz o Senhor.',
    videoFile:'verse_jeremias_30.mp4', music:'Eyshila → Fiel a Mim', musicSearch:'eyshila fiel a mim',
    caption:`Eu te restaurarei a saúde e curarei as tuas feridas, diz o Senhor. 💚✝️\nJeremias 30:17\n\nDeus está te dizendo: EU VOU TE CURAR. 🩹\nSeja no corpo, na alma ou no coração — Ele é o MÉDICO! 🏥\nComenta CURA e receba essa promessa! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #cura #restauração #fetok #fyp #viral #gospel #cristao` },
  { day:5, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Salmos 147:3', theme:'cura', themeEmoji:'❤️‍🩹',
    text:'Ele sara os quebrantados de coração e lhes pensa as feridas.',
    videoFile:'verse_salmos_147.mp4', music:'Amanda Wanessa → Tu és Fiel', musicSearch:'amanda wanessa tu es fiel',
    caption:`Ele sara os quebrantados de coração e lhes pensa as feridas. ❤️‍🩹✝️\nSalmos 147:3\n\nSeu coração está PARTIDO? Deus é especialista em COLAR os pedaços. 💔→❤️\nEle não só cura — Ele CUIDA de cada ferida com amor. 🩹\nEnvie pra alguém com o coração machucado! 💛\n\n#versiculododia #biblia #fe #jesus #deus #coração #cura #fetok #fyp #viral #gospel #cristao` },
  { day:5, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Joel 2:25', theme:'cura', themeEmoji:'🌱',
    text:'Restituir-vos-ei os anos que foram consumidos pelo gafanhoto.',
    videoFile:'verse_joel_2.mp4', music:'Kemuel → Lugar Seguro', musicSearch:'kemuel lugar seguro',
    caption:`Restituir-vos-ei os anos que foram consumidos pelo gafanhoto. 🌱✝️\nJoel 2:25\n\nVocê sente que PERDEU tempo? Que desperdiçou ANOS? 😔\nDeus prometeu: EU VOU RESTITUIR TUDO! 🔄\nO melhor da sua vida ainda NÃO aconteceu! Comenta EU CREIO! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #restituição #tempo #fetok #fyp #viral #gospel #cristao` },
  // DIA 6 — PROPÓSITO
  { day:6, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Efésios 2:10', theme:'propósito', themeEmoji:'🎯',
    text:'Somos feitura de Deus, criados em Cristo Jesus para boas obras.',
    videoFile:'verse_efesios_2_10.mp4', music:'Ton Carfi → Meu Melhor Louvor', musicSearch:'ton carfi meu melhor louvor',
    caption:`Somos feitura de Deus, criados em Cristo Jesus para boas obras. 🎯✝️\nEfésios 2:10\n\nVocê NÃO é um acidente. Você é OBRA-PRIMA de Deus! 🎨\nEle te criou com um PROPÓSITO específico. ✨\nComenta "Tenho propósito" e declare isso! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #propósito #obraprima #fetok #fyp #viral #gospel #cristao` },
  { day:6, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Tiago 1:5', theme:'propósito', themeEmoji:'📖',
    text:'Se algum de vós tem falta de sabedoria, peça a Deus, que a todos dá liberalmente.',
    videoFile:'verse_tiago_1.mp4', music:'Luma Elpídio → Eu Sou de Jesus', musicSearch:'luma elpidio eu sou de jesus',
    caption:`Se algum de vós tem falta de sabedoria, peça a Deus, que a todos dá liberalmente. 📖✝️\nTiago 1:5\n\nNão sabe o que fazer? PEÇA A DEUS! 🙏\nEle vai te dar SABEDORIA de graça! 🧠\nComenta SABEDORIA e ore antes de decidir! 💛\n\n#versiculododia #biblia #fe #jesus #deus #sabedoria #decisão #fetok #fyp #viral #gospel #cristao` },
  { day:6, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Miquéias 6:8', theme:'propósito', themeEmoji:'⚖️',
    text:'Que se requer de ti? Que pratiques a justiça, ames a misericórdia e andes humildemente.',
    videoFile:'verse_miqueias_6.mp4', music:'Daniela Araújo → Abertura', musicSearch:'daniela araujo abertura',
    caption:`Que se requer de ti? Que pratiques a justiça, ames a misericórdia e andes humildemente. ⚖️✝️\nMiquéias 6:8\n\nQuer saber o que Deus ESPERA de você? 🤔\nNão é perfeição. É JUSTIÇA, MISERICÓRDIA e HUMILDADE. 🕊️\nComenta AMÉM se você vai viver isso! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #justiça #misericordia #fetok #fyp #viral #gospel #cristao` },
  // DIA 7 — ADORAÇÃO
  { day:7, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Salmos 100:4', theme:'adoração', themeEmoji:'🎶',
    text:'Entrai pelas suas portas com ação de graças, pelos seus átrios com louvor.',
    videoFile:'verse_salmos_100.mp4', music:'Sarah Beatriz → Superação', musicSearch:'sarah beatriz superacao',
    caption:`Entrai pelas suas portas com ação de graças, pelos seus átrios com louvor. 🎶✝️\nSalmos 100:4\n\nDOMINGO é dia de ADORAR! 🙌\nEntre na presença de Deus com GRATIDÃO e LOUVOR! 🎵\nComenta o nome da sua igreja e marque um irmão! ⛪\n\n#versiculododia #biblia #fe #jesus #deus #louvor #adoração #fetok #fyp #viral #gospel #cristao #domingo` },
  { day:7, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Apocalipse 21:4', theme:'adoração', themeEmoji:'👑',
    text:'Ele enxugará toda lágrima dos seus olhos. Não haverá mais morte, nem pranto.',
    videoFile:'verse_apocalipse_21.mp4', music:'Damares → Sabor de Mel', musicSearch:'damares sabor de mel',
    caption:`Ele enxugará toda lágrima dos seus olhos. Não haverá mais morte, nem pranto. 👑✝️\nApocalipse 21:4\n\nUm dia TODA DOR vai acabar. TODA lágrima vai secar. 😭→😊\nDeus prometeu um futuro onde SÓ existe alegria! 🌅\nComenta EU CREIO! 🙏\n\n#versiculododia #biblia #fe #jesus #deus #eternidade #promessa #fetok #fyp #viral #gospel #cristao` },
  { day:7, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Mateus 11:28', theme:'adoração', themeEmoji:'🤗',
    text:'Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei.',
    videoFile:'verse_mateus_11.mp4', music:'Aline Barros → Rendido Estou', musicSearch:'aline barros rendido estou',
    caption:`Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei. 🤗✝️\nMateus 11:28\n\nÚLTIMA palavra da semana: DESCANSE em Jesus. 🛌\nPare de carregar o peso SOZINHO. Entregue TUDO a Ele! 💛\nComenta DESCANSO e comece a semana renovado! 🙏\n\nSe essa página te abençoou, SIGA para mais versículos diários! 🔔\n\n#versiculododia #biblia #fe #jesus #deus #descanso #alivio #fetok #fyp #viral #gospel #cristao` },
];

/* ═══════════════════════════════════════════════════════════════
   VIRAL MUSIC DATABASE — Top trending gospel sounds on TikTok
   ═══════════════════════════════════════════════════════════════ */
const VIRAL_MUSIC = [
  { rank: 1, title: 'Jardim da Oração', artist: 'Ana Nóbrega', videos: '1.9M+', growth: '+320%', category: 'Worship', tip: 'Perfeito para posts matinais e devocionais.', searchTerm: 'ana nobrega jardim da oração' },
  { rank: 2, title: 'Girassol', artist: 'Priscilla Alcantara', videos: '3.2M+', growth: '+290%', category: 'Gospel Pop', tip: 'SOM VIRAL — público jovem ama. Use nos posts de graça.', searchTerm: 'priscilla alcantara girassol' },
  { rank: 3, title: 'Só Quero Ver Você', artist: 'Morada', videos: '1.8M+', growth: '+260%', category: 'Worship', tip: 'Intimidade com Deus — gera muitos saves e shares.', searchTerm: 'morada so quero ver voce' },
  { rank: 4, title: 'Todavia Me Alegrarei', artist: 'Laura Souguellis', videos: '1.5M+', growth: '+240%', category: 'Worship', tip: 'Forte em posts sobre paz e superação.', searchTerm: 'laura souguellis todavia me alegrarei' },
  { rank: 5, title: 'Vai Valer a Pena', artist: 'Casa Worship', videos: '2.1M+', growth: '+230%', category: 'Worship', tip: '⚡ SOM EM ASCENSÃO — aproveiete antes de saturar!', searchTerm: 'casa worship vai valer a pena' },
  { rank: 6, title: 'Santo Espírito', artist: 'Vocal Livre', videos: '980K+', growth: '+200%', category: 'Gospel', tip: 'Clássico gospel — gera nostalgia e engajamento.', searchTerm: 'vocal livre santo espirito' },
  { rank: 7, title: 'Cante e Deixe o Rio Fluir', artist: 'Eli Soares', videos: '870K+', growth: '+185%', category: 'Worship', tip: 'Perfeito para posts de esperança e renovação.', searchTerm: 'eli soares cante e deixe o rio fluir' },
  { rank: 8, title: 'Rio de Deus', artist: 'Nívea Soares', videos: '750K+', growth: '+170%', category: 'Worship', tip: 'Forte em devocionais — muitos comentários "Amém".', searchTerm: 'nivea soares rio de deus' },
  { rank: 9, title: 'Deus Me Ama', artist: 'Thalles Roberto', videos: '1.3M+', growth: '+160%', category: 'Gospel', tip: 'Audiência ampla e fiel — gera compartilhamentos.', searchTerm: 'thalles roberto deus me ama' },
  { rank: 10, title: 'Faz Chover', artist: 'André Valadão', videos: '920K+', growth: '+150%', category: 'Praise', tip: 'Energia alta — use em posts de vitória.', searchTerm: 'andre valadao faz chover' },
  { rank: 11, title: 'Como Águia', artist: 'Bruna Karla', videos: '680K+', growth: '+140%', category: 'Gospel', tip: 'Posts sobre força e superação.', searchTerm: 'bruna karla como aguia' },
  { rank: 12, title: 'Consagração', artist: 'Heloisa Rosa', videos: '590K+', growth: '+125%', category: 'Worship', tip: 'Forte nos domingos — conteúdo de culto.', searchTerm: 'heloisa rosa consagracao' },
  { rank: 13, title: 'Fiel a Mim', artist: 'Eyshila', videos: '520K+', growth: '+115%', category: 'Gospel', tip: 'Para posts sobre cura e restauração.', searchTerm: 'eyshila fiel a mim' },
  { rank: 14, title: 'Tu és Fiel', artist: 'Amanda Wanessa', videos: '480K+', growth: '+105%', category: 'Worship', tip: 'Emocional — gera muitos comentários.', searchTerm: 'amanda wanessa tu es fiel' },
  { rank: 15, title: 'Lugar Seguro', artist: 'Kemuel', videos: '1.1M+', growth: '+100%', category: 'Gospel Pop', tip: '⚡ Público jovem — alta taxa de saves.', searchTerm: 'kemuel lugar seguro' },
  { rank: 16, title: 'Meu Melhor Louvor', artist: 'Ton Carfi', videos: '450K+', growth: '+95%', category: 'Gospel', tip: 'Posts sobre propósito e identidade.', searchTerm: 'ton carfi meu melhor louvor' },
  { rank: 17, title: 'Eu Sou de Jesus', artist: 'Luma Elpídio', videos: '380K+', growth: '+85%', category: 'Worship', tip: 'Intimidade — perfeito para devocionais.', searchTerm: 'luma elpidio eu sou de jesus' },
  { rank: 18, title: 'Abertura', artist: 'Daniela Araújo', videos: '340K+', growth: '+80%', category: 'Gospel', tip: 'Para posts sobre justiça e humildade.', searchTerm: 'daniela araujo abertura' },
  { rank: 19, title: 'Superação', artist: 'Sarah Beatriz', videos: '290K+', growth: '+75%', category: 'Viral Gospel', tip: '⚡ SOM EMERGENTE — começando a viralizar forte!', searchTerm: 'sarah beatriz superacao' },
  { rank: 20, title: 'Rendido Estou', artist: 'Aline Barros', videos: '620K+', growth: '+70%', category: 'Gospel', tip: 'Encerramento perfeito — posts de entrega e descanso.', searchTerm: 'aline barros rendido estou' },
];

function startDashboard() {
  const app = express();

  // ── STATIC FILE SERVING with proper headers ──
  const staticOpts = {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Accept-Ranges', 'bytes');
      }
    }
  };
  app.use('/media', express.static(path.join(OUTPUT_DIR, 'videos'), staticOpts));
  app.use('/images', express.static(path.join(OUTPUT_DIR, 'ai_images')));
  app.use('/output', express.static(OUTPUT_DIR, staticOpts));

  // ── DEDICATED DOWNLOAD ROUTE — handles Unicode filenames properly ──
  const VIDEOS_DIR = path.join(OUTPUT_DIR, 'videos');
  app.get('/download/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(VIDEOS_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Download 404: ${filename} not found at ${filePath}`);
      return res.status(404).json({ error: 'File not found', requested: filename, path: filePath });
    }
    
    const stat = fs.statSync(filePath);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });

  // ── DEDICATED VIDEO STREAM ROUTE — for reliable playback ──
  app.get('/video/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(VIDEOS_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Video not found', requested: filename });
    }
    
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });

  // ── DIAGNOSTIC ENDPOINT — verify all files on Railway ──
  app.get('/api/diagnostic', (req, res) => {
    const allFiles = fs.existsSync(OUTPUT_DIR) ? fs.readdirSync(OUTPUT_DIR) : [];
    const mp4Files = allFiles.filter(f => f.endsWith('.mp4'));
    const pngFiles = allFiles.filter(f => f.endsWith('.png'));
    const videoDir = path.join(OUTPUT_DIR, 'videos');
    const videoFiles = fs.existsSync(videoDir) ? fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4')) : [];
    
    // Check which POSTS_DATA videos exist
    const postVideoStatus = POSTS_DATA.map(p => ({
      day: p.day,
      slot: p.slot,
      verse: p.verse,
      videoFile: p.videoFile,
      existsInOutput: fs.existsSync(path.join(OUTPUT_DIR, p.videoFile)),
      existsInVideos: fs.existsSync(path.join(videoDir, p.videoFile)),
    }));
    
    res.json({
      outputDir: OUTPUT_DIR,
      totalFilesInOutput: allFiles.length,
      mp4InOutput: mp4Files,
      pngInOutput: pngFiles.length,
      mp4InVideosSubdir: videoFiles,
      postVideoStatus,
      missingVideos: postVideoStatus.filter(v => !v.existsInOutput),
    });
  });

  // API endpoints
  app.get('/api/stats', (req, res) => {
    const stats = getStats();
    const historyFile = path.join(OUTPUT_DIR, 'history.json');
    let history = [];
    if (fs.existsSync(historyFile)) {
      try { history = JSON.parse(fs.readFileSync(historyFile, 'utf8')); } catch(e) {}
    }
    res.json({ ...stats, postsToday: history.filter(h => h.timestamp?.startsWith(new Date().toISOString().split('T')[0])).length, totalPosts: history.length });
  });

  app.get('/api/history', (req, res) => {
    const historyFile = path.join(OUTPUT_DIR, 'history.json');
    if (fs.existsSync(historyFile)) {
      res.json(JSON.parse(fs.readFileSync(historyFile, 'utf8')));
    } else { res.json([]); }
  });

  app.get('/api/schedule', (req, res) => {
    const scheduleFile = path.join(OUTPUT_DIR, 'schedule.json');
    if (fs.existsSync(scheduleFile)) {
      res.json(JSON.parse(fs.readFileSync(scheduleFile, 'utf8')));
    } else { res.json([]); }
  });

  app.get('/api/verses', (req, res) => { res.json(getAllVerses()); });

  app.get('/api/posts', (req, res) => { res.json(POSTS_DATA); });

  app.get('/api/music', (req, res) => { res.json(VIRAL_MUSIC); });

  app.post('/api/generate/:slot', async (req, res) => {
    const slot = req.params.slot;
    if (!['morning', 'afternoon', 'evening'].includes(slot)) {
      return res.status(400).json({ error: 'Invalid slot' });
    }
    try {
      const { createPost } = require('./index');
      const result = await createPost(slot);
      res.json({ success: true, result });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.get('/api/guide', (req, res) => {
    const guidePath = path.resolve(__dirname, '../guia_21_posts.md');
    if (fs.existsSync(guidePath)) {
      res.type('text/markdown').send(fs.readFileSync(guidePath, 'utf8'));
    } else { res.status(404).send('Guide not found'); }
  });

  /* ═══════════════════════════════════════════════════════════
     CSS DESIGN SYSTEM
     ═══════════════════════════════════════════════════════════ */
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    :root {
      --bg-primary: #06060b;
      --bg-card: rgba(255,255,255,0.03);
      --bg-card-hover: rgba(255,255,255,0.06);
      --border: rgba(255,255,255,0.07);
      --border-hover: rgba(255,255,255,0.14);
      --gold: #d4a853;
      --gold-light: #f0d78c;
      --gold-bg: rgba(212,168,83,0.08);
      --gold-border: rgba(212,168,83,0.2);
      --green: #34c759;
      --green-bg: rgba(52,199,89,0.12);
      --red: #ff2d55;
      --blue: #007aff;
      --purple: #af82ff;
      --orange: #ff9500;
      --text: #ffffff;
      --text-secondary: rgba(255,255,255,0.55);
      --text-tertiary: rgba(255,255,255,0.3);
      --radius: 16px;
      --radius-sm: 10px;
      --radius-xs: 6px;
    }

    * { margin:0; padding:0; box-sizing:border-box; }
    
    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

    /* ── LAYOUT ── */
    .app { max-width: 1400px; margin: 0 auto; padding: 20px; }

    /* ── TOP NAV ── */
    .topnav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 12px;
    }
    .topnav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .topnav-brand h1 {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .topnav-brand h1 span {
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .topnav-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--green-bg);
      border: 1px solid rgba(52,199,89,0.25);
      border-radius: 20px;
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--green);
    }
    .topnav-status::before {
      content: '';
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--green);
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .topnav-handle {
      font-size: 0.78rem;
      color: var(--text-secondary);
    }

    /* ── TAB NAVIGATION ── */
    .tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 28px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 4px;
    }
    .tab {
      padding: 10px 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
      text-decoration: none;
    }
    .tab:hover {
      background: var(--bg-card-hover);
      color: var(--text);
      border-color: var(--border-hover);
    }
    .tab.active {
      background: var(--gold-bg);
      border-color: var(--gold-border);
      color: var(--gold);
    }

    /* ── STATS ROW ── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }
    .stat-value {
      font-size: 2.2rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }
    .stat-label {
      font-size: 0.68rem;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 6px;
    }

    /* ── SECTION ── */
    .section {
      margin-bottom: 36px;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--gold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-badge {
      font-size: 0.65rem;
      padding: 3px 10px;
      background: var(--gold-bg);
      border: 1px solid var(--gold-border);
      border-radius: 20px;
      color: var(--gold);
      font-weight: 700;
    }

    /* ── DAY SEPARATOR ── */
    .day-separator {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 24px 0 16px;
      padding: 12px 20px;
      background: linear-gradient(135deg, rgba(212,168,83,0.08), rgba(212,168,83,0.02));
      border: 1px solid var(--gold-border);
      border-radius: var(--radius);
    }
    .day-number {
      font-size: 1.6rem;
      font-weight: 900;
      color: var(--gold);
    }
    .day-info {
      flex: 1;
    }
    .day-label {
      font-size: 0.9rem;
      font-weight: 700;
    }
    .day-date {
      font-size: 0.7rem;
      color: var(--text-tertiary);
    }
    .day-themes {
      display: flex;
      gap: 6px;
    }
    .theme-pill {
      font-size: 0.62rem;
      padding: 3px 8px;
      border-radius: 20px;
      font-weight: 600;
    }
    .theme-proteção { background: rgba(52,199,89,0.12); color: #34c759; }
    .theme-coragem { background: rgba(255,149,0,0.12); color: #ff9500; }
    .theme-amor { background: rgba(255,45,85,0.12); color: #ff2d55; }
    .theme-força { background: rgba(175,130,255,0.12); color: #af82ff; }
    .theme-fé { background: rgba(0,122,255,0.12); color: #007aff; }
    .theme-esperança { background: rgba(255,214,10,0.12); color: #ffd60a; }

    /* ── POST CARD ── */
    .post-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      margin-bottom: 14px;
      transition: all 0.3s ease;
    }
    .post-card:hover {
      border-color: var(--border-hover);
      background: var(--bg-card-hover);
    }
    .post-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .post-card-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .post-slot-badge {
      font-size: 0.72rem;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 700;
    }
    .slot-morning { background: rgba(255,196,0,0.15); color: #ffc400; }
    .slot-afternoon { background: rgba(255,149,0,0.15); color: #ff9500; }
    .slot-evening { background: rgba(175,130,255,0.15); color: #af82ff; }
    
    .post-verse-ref {
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .post-theme-badge {
      font-size: 0.62rem;
      padding: 3px 10px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .post-card-body {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 20px;
      align-items: start;
    }
    .post-video-wrap {
      border-radius: 14px;
      overflow: hidden;
      background: #111;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .post-video-wrap video {
      width: 100%;
      aspect-ratio: 9/16;
      object-fit: cover;
      display: block;
    }
    .post-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Music badge */
    .post-music {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: var(--gold-bg);
      border: 1px solid var(--gold-border);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      color: var(--gold);
      font-weight: 600;
    }
    .post-music-icon {
      font-size: 1rem;
    }
    .post-music-search {
      font-size: 0.65rem;
      color: var(--text-tertiary);
      margin-top: 2px;
    }

    /* Caption box */
    .post-caption-wrap {
      position: relative;
    }
    .post-caption {
      font-family: 'Inter', sans-serif;
      font-size: 0.78rem;
      color: rgba(255,255,255,0.75);
      background: rgba(0,0,0,0.35);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.65;
      max-height: 220px;
      overflow-y: auto;
      transition: max-height 0.3s ease;
    }
    .post-caption.expanded {
      max-height: none;
    }
    .expand-btn {
      display: block;
      text-align: center;
      padding: 6px;
      font-size: 0.7rem;
      color: var(--gold);
      cursor: pointer;
      background: transparent;
      border: none;
      font-weight: 600;
    }
    .expand-btn:hover { opacity: 0.8; }

    /* Action buttons */
    .post-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border: none;
      border-radius: var(--radius-sm);
      font-family: 'Inter', sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
    }
    .btn:active { transform: scale(0.97); }
    .btn-gold {
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      color: #0a0a0f;
    }
    .btn-gold:hover { opacity: 0.9; box-shadow: 0 4px 20px rgba(212,168,83,0.3); }
    .btn-outline {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text);
    }
    .btn-outline:hover { background: var(--bg-card-hover); border-color: var(--border-hover); }
    .btn-green {
      background: var(--green-bg);
      border: 1px solid rgba(52,199,89,0.25);
      color: var(--green);
    }
    .btn-green:hover { background: rgba(52,199,89,0.2); }

    /* ── MUSIC TABLE ── */
    .music-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 6px;
    }
    .music-table th {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 8px 14px;
      text-align: left;
    }
    .music-table td {
      padding: 14px;
      background: var(--bg-card);
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .music-table tr:hover td {
      background: var(--bg-card-hover);
    }
    .music-table td:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
    .music-table td:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
    .music-rank {
      font-weight: 900;
      font-size: 1rem;
      color: var(--gold);
      min-width: 30px;
    }
    .music-rank.top3 {
      font-size: 1.2rem;
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .music-title {
      font-weight: 700;
    }
    .music-artist {
      font-size: 0.7rem;
      color: var(--text-secondary);
    }
    .music-videos {
      font-weight: 700;
      color: var(--gold);
    }
    .music-growth {
      font-weight: 700;
      color: var(--green);
      font-size: 0.75rem;
    }
    .music-cat {
      font-size: 0.65rem;
      padding: 3px 8px;
      border-radius: 20px;
      background: var(--gold-bg);
      color: var(--gold);
      font-weight: 600;
      white-space: nowrap;
    }
    .music-tip {
      font-size: 0.7rem;
      color: var(--text-secondary);
      max-width: 250px;
    }
    .music-search-btn {
      padding: 6px 12px;
      background: var(--bg-card-hover);
      border: 1px solid var(--border);
      border-radius: var(--radius-xs);
      color: var(--text-secondary);
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .music-search-btn:hover {
      background: var(--gold-bg);
      border-color: var(--gold-border);
      color: var(--gold);
    }

    /* ── FILTER BAR ── */
    .filter-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      align-items: center;
    }
    .filter-btn {
      padding: 7px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn:hover, .filter-btn.active {
      background: var(--gold-bg);
      border-color: var(--gold-border);
      color: var(--gold);
    }

    /* ── NOTIFICATION TOAST ── */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      padding: 12px 24px;
      background: var(--green);
      color: #fff;
      border-radius: var(--radius-sm);
      font-size: 0.82rem;
      font-weight: 700;
      z-index: 9999;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
      box-shadow: 0 8px 30px rgba(52,199,89,0.4);
    }
    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* ── TAB CONTENT ── */
    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* ── CALENDAR GRID ── */
    .calendar-week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-bottom: 20px;
    }
    .calendar-day {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .calendar-day:hover, .calendar-day.active {
      border-color: var(--gold-border);
      background: var(--gold-bg);
    }
    .calendar-day-num {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--gold);
    }
    .calendar-day-label {
      font-size: 0.62rem;
      color: var(--text-tertiary);
      margin-top: 2px;
    }
    .calendar-day-posts {
      display: flex;
      justify-content: center;
      gap: 3px;
      margin-top: 6px;
    }
    .calendar-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
    }
    .dot-morning { background: #ffc400; }
    .dot-afternoon { background: #ff9500; }
    .dot-evening { background: #af82ff; }

    /* ── QUICK COPY SECTION ── */
    .quick-copy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }
    .quick-copy-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quick-copy-card:hover {
      border-color: var(--gold-border);
      background: var(--bg-card-hover);
    }
    .quick-copy-card:active {
      transform: scale(0.98);
    }

    /* ── MOBILE RESPONSIVE ── */
    @media (max-width: 768px) {
      .app { padding: 12px; }
      .topnav { flex-direction: column; align-items: stretch; gap: 8px; }
      .topnav-brand { justify-content: space-between; }
      .stats-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .stat-value { font-size: 1.6rem; }
      .post-card-body { grid-template-columns: 1fr; }
      .post-video-wrap { max-width: 300px; margin: 0 auto; }
      .music-table { font-size: 0.72rem; }
      .music-table th:nth-child(n+5),
      .music-table td:nth-child(n+5) { display: none; }
      .calendar-week { grid-template-columns: repeat(4, 1fr); }
      .tabs { gap: 4px; }
      .tab { padding: 8px 14px; font-size: 0.72rem; }
      .quick-copy-grid { grid-template-columns: 1fr; }
      .day-separator { flex-direction: column; text-align: center; gap: 8px; }
    }
    @media (max-width: 480px) {
      .stats-row { grid-template-columns: 1fr 1fr; }
      .stat-card { padding: 14px; }
      .post-card { padding: 14px; }
      .post-actions { flex-direction: column; }
      .btn { justify-content: center; }
      .calendar-week { grid-template-columns: repeat(3, 1fr); }
    }
  `;

  /* ═══════════════════════════════════════════════════════════
     MAIN DASHBOARD — / route
     ═══════════════════════════════════════════════════════════ */
  app.get('/', (req, res) => {
    const stats = getStats();
    const historyFile = path.join(OUTPUT_DIR, 'history.json');
    let history = [];
    if (fs.existsSync(historyFile)) {
      try { history = JSON.parse(fs.readFileSync(historyFile, 'utf8')); } catch(e) {}
    }

    const videos = fs.existsSync(OUTPUT_DIR) 
      ? fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp4')).sort()
      : [];

    // Build post cards HTML
    let currentDay = 0;
    let postsHTML = '';
    const dayNames = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    POSTS_DATA.forEach((p, i) => {
      // Day separator
      if (p.day !== currentDay) {
        currentDay = p.day;
        const themes = [...new Set(POSTS_DATA.filter(x => x.day === p.day).map(x => x.theme))];
        postsHTML += `
          <div class="day-separator" id="day-${p.day}">
            <div class="day-number">${p.day}</div>
            <div class="day-info">
              <div class="day-label">📅 Dia ${p.day} — ${dayNames[p.day] || ''}</div>
              <div class="day-date">3 posts programados</div>
            </div>
            <div class="day-themes">
              ${themes.map(t => `<span class="theme-pill theme-${t}">${t}</span>`).join('')}
            </div>
          </div>
        `;
      }

      // Post card
      const slotClass = p.slotKey === 'morning' ? 'slot-morning' : p.slotKey === 'afternoon' ? 'slot-afternoon' : 'slot-evening';
      const themeClass = `theme-${p.theme}`;
      
      postsHTML += `
        <div class="post-card" data-day="${p.day}" data-slot="${p.slotKey}" data-theme="${p.theme}">
          <div class="post-card-header">
            <div class="post-card-left">
              <span class="post-slot-badge ${slotClass}">${p.emoji} ${p.slot}</span>
              <span class="post-verse-ref">${p.themeEmoji} ${p.verse}</span>
            </div>
            <span class="post-theme-badge ${themeClass}">${p.theme}</span>
          </div>
          <div class="post-card-body">
            <div class="post-video-wrap">
              <video controls muted playsinline preload="metadata">
                <source src="/video/${encodeURIComponent(p.videoFile)}" type="video/mp4">
                Seu navegador não suporta vídeo.
              </video>
            </div>
            <div class="post-content">
              <div class="post-music">
                <span class="post-music-icon">🎵</span>
                <div>
                  <div>${p.music}</div>
                  <div class="post-music-search">Buscar: "${p.musicSearch}"</div>
                </div>
              </div>
              <div class="post-caption-wrap">
                <pre class="post-caption" id="caption-${i}">${escapeHtml(p.caption)}</pre>
                <button class="expand-btn" onclick="toggleCaption(${i})">▼ Expandir legenda</button>
              </div>
              <div class="post-actions">
                <button class="btn btn-gold" onclick="copyCaption(${i})">📋 Copiar Legenda</button>
                <a class="btn btn-outline" href="/download/${encodeURIComponent(p.videoFile)}" download="${p.videoFile}">⬇️ Baixar Vídeo</a>
                <button class="btn btn-green" onclick="markAsPosted(${i}, '${p.verse}')">✅ Marcar Postado</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    // Build music table HTML
    const musicHTML = VIRAL_MUSIC.map(m => `
      <tr>
        <td><span class="music-rank ${m.rank <= 3 ? 'top3' : ''}">${m.rank <= 3 ? ['🥇','🥈','🥉'][m.rank-1] : '#'+m.rank}</span></td>
        <td>
          <div class="music-title">${m.title}</div>
          <div class="music-artist">${m.artist}</div>
        </td>
        <td><span class="music-videos">${m.videos}</span> vídeos</td>
        <td><span class="music-growth">${m.growth}</span></td>
        <td><span class="music-cat">${m.category}</span></td>
        <td><span class="music-tip">${m.tip}</span></td>
        <td><button class="music-search-btn" onclick="navigator.clipboard.writeText('${m.searchTerm}');showToast('🎵 Termo copiado: ${m.searchTerm}')">📋 Copiar busca</button></td>
      </tr>
    `).join('');

    // Calendar HTML
    const calendarHTML = Array.from({length: 7}, (_, i) => {
      const d = i + 1;
      return `
        <div class="calendar-day" onclick="scrollToDay(${d})">
          <div class="calendar-day-num">${d}</div>
          <div class="calendar-day-label">Dia ${d}</div>
          <div class="calendar-day-posts">
            <span class="calendar-dot dot-morning"></span>
            <span class="calendar-dot dot-afternoon"></span>
            <span class="calendar-dot dot-evening"></span>
          </div>
        </div>
      `;
    }).join('');

    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FéTok — Content Hub</title>
  <meta name="description" content="FéTok Content Management Hub — 21 posts prontos para viralizar no TikTok">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✝️</text></svg>">
  <style>${CSS}</style>
</head>
<body>
  <div class="app">
    <!-- TOP NAV -->
    <div class="topnav">
      <div class="topnav-brand">
        <h1>Fé<span>Tok</span> Content Hub ✝️</h1>
        <span class="topnav-status">PIPELINE ATIVO</span>
      </div>
      <div class="topnav-handle">@luz.da.palavra.oficial · Série 2 · ${new Date().toLocaleDateString('pt-BR')} · ${videos.length} vídeos prontos</div>
    </div>

    <!-- STATS -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">21</div>
        <div class="stat-label">Posts Prontos</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${videos.length}</div>
        <div class="stat-label">Vídeos Gerados</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">7</div>
        <div class="stat-label">Dias Programados</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${VIRAL_MUSIC.length}</div>
        <div class="stat-label">Músicas Virais</div>
      </div>
    </div>

    <!-- TAB NAVIGATION -->
    <div class="tabs">
      <div class="tab active" onclick="switchTab('posts')">📱 21 Posts</div>
      <div class="tab" onclick="switchTab('calendar')">📅 Calendário</div>
      <div class="tab" onclick="switchTab('captions')">📝 Legendas</div>
      <div class="tab" onclick="switchTab('music')">🎵 Músicas Virais</div>
      <div class="tab" onclick="switchTab('rotina')">🔥 Rotina</div>
    </div>

    <!-- ═══ TAB: 21 POSTS ═══ -->
    <div class="tab-content active" id="tab-posts">
      <div class="section">
        <div class="section-header">
          <div class="section-title">📱 TODOS OS 21 POSTS — PRONTOS PARA POSTAR</div>
          <span class="section-badge">7 dias × 3/dia</span>
        </div>

        <!-- Filters -->
        <div class="filter-bar">
          <span style="font-size:0.7rem;color:var(--text-tertiary);margin-right:4px;">Filtrar:</span>
          <button class="filter-btn active" onclick="filterPosts('all', this)">Todos</button>
          <button class="filter-btn" onclick="filterPosts('morning', this)">☀️ Manhã</button>
          <button class="filter-btn" onclick="filterPosts('afternoon', this)">🌤️ Tarde</button>
          <button class="filter-btn" onclick="filterPosts('evening', this)">🌙 Noite</button>
          <button class="filter-btn" onclick="filterByTheme('proteção', this)">🛡️ Proteção</button>
          <button class="filter-btn" onclick="filterByTheme('coragem', this)">💪 Coragem</button>
          <button class="filter-btn" onclick="filterByTheme('amor', this)">❤️ Amor</button>
          <button class="filter-btn" onclick="filterByTheme('força', this)">⚡ Força</button>
          <button class="filter-btn" onclick="filterByTheme('fé', this)">🙏 Fé</button>
        </div>

        ${postsHTML}
      </div>
    </div>

    <!-- ═══ TAB: CALENDÁRIO ═══ -->
    <div class="tab-content" id="tab-calendar">
      <div class="section">
        <div class="section-header">
          <div class="section-title">📅 CALENDÁRIO DE POSTAGENS</div>
          <span class="section-badge">Clique no dia para navegar</span>
        </div>
        <div class="calendar-week">${calendarHTML}</div>
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;">
          <h3 style="font-size:0.9rem;margin-bottom:12px;">📊 Horários de Ouro (Brasil)</h3>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
            <div style="text-align:center;padding:14px;background:rgba(255,196,0,0.08);border:1px solid rgba(255,196,0,0.2);border-radius:var(--radius-sm);">
              <div style="font-size:1.3rem;font-weight:900;color:#ffc400;">06:00</div>
              <div style="font-size:0.68rem;color:var(--text-secondary);margin-top:4px;">☀️ Devocional matinal</div>
              <div style="font-size:0.62rem;color:var(--text-tertiary);margin-top:2px;">fé · proteção · gratidão</div>
            </div>
            <div style="text-align:center;padding:14px;background:rgba(255,149,0,0.08);border:1px solid rgba(255,149,0,0.2);border-radius:var(--radius-sm);">
              <div style="font-size:1.3rem;font-weight:900;color:#ff9500;">12:00</div>
              <div style="font-size:0.68rem;color:var(--text-secondary);margin-top:4px;">🌤️ Motivacional</div>
              <div style="font-size:0.62rem;color:var(--text-tertiary);margin-top:2px;">força · coragem · vitória</div>
            </div>
            <div style="text-align:center;padding:14px;background:rgba(175,130,255,0.08);border:1px solid rgba(175,130,255,0.2);border-radius:var(--radius-sm);">
              <div style="font-size:1.3rem;font-weight:900;color:#af82ff;">20:00</div>
              <div style="font-size:0.68rem;color:var(--text-secondary);margin-top:4px;">🌙 Emocional</div>
              <div style="font-size:0.62rem;color:var(--text-tertiary);margin-top:2px;">amor · paz · esperança</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TAB: LEGENDAS (QUICK COPY) ═══ -->
    <div class="tab-content" id="tab-captions">
      <div class="section">
        <div class="section-header">
          <div class="section-title">📝 LEGENDAS PRONTAS — CLIQUE PARA COPIAR</div>
          <span class="section-badge">Toque em qualquer legenda para copiar</span>
        </div>
        <div class="quick-copy-grid">
          ${POSTS_DATA.map((p, i) => `
            <div class="quick-copy-card" onclick="navigator.clipboard.writeText(${JSON.stringify(p.caption).replace(/'/g, "\\'")}); showToast('📋 Legenda copiada: ${p.verse}'); this.style.borderColor='var(--gold-border)'">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-weight:800;font-size:0.85rem;">${p.themeEmoji} ${p.verse}</span>
                <span class="post-slot-badge ${p.slotKey === 'morning' ? 'slot-morning' : p.slotKey === 'afternoon' ? 'slot-afternoon' : 'slot-evening'}" style="font-size:0.65rem;">${p.emoji} Dia ${p.day} · ${p.slot}</span>
              </div>
              <div style="font-size:0.72rem;color:var(--text-secondary);line-height:1.5;white-space:pre-wrap;max-height:100px;overflow:hidden;">${escapeHtml(p.caption.split('\n').slice(0,4).join('\n'))}</div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                <span style="font-size:0.65rem;color:var(--gold);">🎵 ${p.music}</span>
                <span style="font-size:0.65rem;color:var(--text-tertiary);">📋 Toque para copiar</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- ═══ TAB: MÚSICAS VIRAIS ═══ -->
    <div class="tab-content" id="tab-music">
      <div class="section">
        <div class="section-header">
          <div class="section-title">🎵 TOP 20 MÚSICAS VIRAIS GOSPEL — TIKTOK 2026</div>
          <span class="section-badge">Ranking por engajamento</span>
        </div>
        <div style="padding:14px;background:rgba(212,168,83,0.06);border:1px solid var(--gold-border);border-left:4px solid var(--gold);border-radius:0 var(--radius-sm) var(--radius-sm) 0;margin-bottom:20px;font-size:0.75rem;color:var(--text-secondary);">
          💡 <strong style="color:var(--gold);">DICA PRO:</strong> No TikTok, vá em "Sons" → cole o termo de busca → escolha a versão com <strong>MAIS vídeos</strong> = mais viral. O algoritmo prioriza sons em alta!
        </div>
        <div style="overflow-x:auto;">
          <table class="music-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Música</th>
                <th>Vídeos</th>
                <th>Crescimento</th>
                <th>Categoria</th>
                <th>Dica de Uso</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              ${musicHTML}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-title" style="margin-bottom:16px;">⚡ ESTRATÉGIA MUSICAL PARA VIRALIZAÇÃO</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;">
            <h3 style="font-size:0.85rem;margin-bottom:8px;">🔥 Regra #1: Sons em Alta</h3>
            <p style="font-size:0.72rem;color:var(--text-secondary);line-height:1.5;">O algoritmo do TikTok prioriza vídeos que usam sons TRENDING. Use os sons do TOP 5 para maximizar alcance.</p>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;">
            <h3 style="font-size:0.85rem;margin-bottom:8px;">🎯 Regra #2: Match com Conteúdo</h3>
            <p style="font-size:0.72rem;color:var(--text-secondary);line-height:1.5;">Posts de PROTEÇÃO → musicas suaves. Posts de FORÇA → músicas com energia. Posts EMOCIONAIS → músicas que fazem chorar.</p>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;">
            <h3 style="font-size:0.85rem;margin-bottom:8px;">⏱️ Regra #3: Timing</h3>
            <p style="font-size:0.72rem;color:var(--text-secondary);line-height:1.5;">Use o mesmo som por 3-5 vídeos SEGUIDOS. O TikTok te associa ao som e mostra seu conteúdo para quem curtiu aquele som.</p>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;">
            <h3 style="font-size:0.85rem;margin-bottom:8px;">📈 Regra #4: Sons Emergentes</h3>
            <p style="font-size:0.72rem;color:var(--text-secondary);line-height:1.5;">Sons com < 100K vídeos mas crescendo RÁPIDO são OURO. Menos competição + algoritmo empurra = viralização fácil.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TAB: ROTINA ═══ -->
    <div class="tab-content" id="tab-rotina">
      ${getRotinaSectionHTML()}
    </div>
  </div>

  <!-- TOAST -->
  <div class="toast" id="toast"></div>

  <script>
    // Tab switching
    function switchTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + tabName).classList.add('active');
      event.target.classList.add('active');
    }

    // Copy caption
    function copyCaption(i) {
      const el = document.getElementById('caption-' + i);
      navigator.clipboard.writeText(el.textContent).then(() => {
        showToast('📋 Legenda copiada! Cole no TikTok Studio');
      });
    }

    // Toggle caption expand
    function toggleCaption(i) {
      const el = document.getElementById('caption-' + i);
      el.classList.toggle('expanded');
      const btn = el.nextElementSibling;
      btn.textContent = el.classList.contains('expanded') ? '▲ Recolher' : '▼ Expandir legenda';
    }

    // Mark as posted
    function markAsPosted(i, verse) {
      const key = 'fetok_posted_' + i;
      localStorage.setItem(key, 'true');
      const card = document.querySelectorAll('.post-card')[i];
      if (card) {
        card.style.opacity = '0.5';
        card.style.borderColor = 'rgba(52,199,89,0.3)';
      }
      showToast('✅ ' + verse + ' marcado como postado!');
    }

    // Filter posts
    function filterPosts(slot, btn) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.post-card').forEach(card => {
        if (slot === 'all' || card.dataset.slot === slot) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
      document.querySelectorAll('.day-separator').forEach(s => s.style.display = slot === 'all' ? '' : 'none');
    }

    function filterByTheme(theme, btn) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.post-card').forEach(card => {
        card.style.display = card.dataset.theme === theme ? '' : 'none';
      });
      document.querySelectorAll('.day-separator').forEach(s => s.style.display = 'none');
    }

    // Calendar navigation
    function scrollToDay(day) {
      switchTab('posts');
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
        if (t.textContent.includes('21 Posts')) t.classList.add('active');
      });
      setTimeout(() => {
        const el = document.getElementById('day-' + day);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    // Toast notification
    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Restore posted states
    document.querySelectorAll('.post-card').forEach((card, i) => {
      if (localStorage.getItem('fetok_posted_' + i) === 'true') {
        card.style.opacity = '0.5';
        card.style.borderColor = 'rgba(52,199,89,0.3)';
      }
    });

    // Checkbox persistence (rotina tab)
    document.querySelectorAll('.rotina-check input').forEach((cb, i) => {
      const key = 'fetok_rotina_' + new Date().toDateString() + '_' + i;
      cb.checked = localStorage.getItem(key) === 'true';
      if (cb.checked) cb.closest('.rotina-check').classList.add('done');
      cb.addEventListener('change', () => {
        localStorage.setItem(key, cb.checked);
        cb.closest('.rotina-check').classList.toggle('done', cb.checked);
      });
    });
  </script>
</body>
</html>`);
  });

  app.listen(PORT, () => {
    console.log(`📊 FéTok Content Hub running on port ${PORT}`);
    console.log(`   http://localhost:${PORT}\n`);
  });

  return app;
}

/* ═══════════════════════════════════════════════════════════
   HELPER: Rotina section
   ═══════════════════════════════════════════════════════════ */
function getRotinaSectionHTML() {
  const today = new Date();
  const dayNames = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  const dayName = dayNames[today.getDay()];
  const dateStr = today.toLocaleDateString('pt-BR');
  const isSunday = today.getDay() === 0;

  const checkItems = [
    { title: '☀️ Post da Manhã (06:00)', desc: 'Upload vídeo + legenda + música gospel → postar 06:00', time: '06:00', timeClass: 'slot-morning' },
    { title: '🔥 Engajar após post da manhã', desc: 'Curtir 10 vídeos em #versiculododia + comentar 5 deles', time: '06:30', timeClass: 'slot-morning' },
    { title: '🌤️ Post do Almoço (12:00)', desc: 'Upload vídeo motivacional + legenda + música', time: '12:00', timeClass: 'slot-afternoon' },
    { title: '📱 Seguir 10-15 criadores gospel', desc: 'Buscar #gospel #fé → seguir contas ativas do nicho', time: '12:30', timeClass: 'slot-afternoon' },
    { title: '💬 Responder TODOS os comentários', desc: 'Respostas geram notificações = mais engajamento = algoritmo te promove', time: 'Qualquer hora', timeClass: '' },
    { title: '🌙 Post da Noite (20:00)', desc: 'Upload vídeo emocional + legenda + música', time: '20:00', timeClass: 'slot-evening' },
    { title: '🌟 Comentar em 5 vídeos de criadores GRANDES', desc: 'Isaias Saad, Fernandinho, Gabriela Rocha — seu nome aparece no feed deles', time: '21:00', timeClass: 'slot-evening' },
  ];

  const comments = [
    '🙏 Que palavra poderosa! Isso tocou meu coração. AMÉM!',
    'Deus te abençoe por compartilhar isso! Salvei pra reler 🔖❤️',
    'Esse versículo mudou meu dia INTEIRO! Glória a Deus 🔥🙏',
    'AMÉM! Isso não foi coincidência, Deus me trouxe até aqui ✝️',
    'Chorei com esse vídeo 😭🙏 Deus é maravilhoso!',
    'Quem precisa ouvir isso HOJE? Marque nos comentários! ❤️',
    'Obrigado Senhor por essa palavra! Comenta AMÉM quem recebe 🙏',
    'Isso é pra mim! O Senhor está falando comigo nesse momento 💛✝️',
  ];

  return `
    <div class="section">
      <div class="section-header">
        <div class="section-title">🔥 ROTINA DIÁRIA DE ENGAJAMENTO</div>
        <span class="section-badge">${dayName}, ${dateStr}</span>
      </div>

      <div style="margin-bottom:20px;">
        ${checkItems.map((item, i) => `
          <div class="rotina-check" style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:6px;cursor:pointer;transition:all 0.2s;" onclick="this.querySelector('input').click()">
            <input type="checkbox" style="margin-top:3px;accent-color:var(--gold);width:16px;height:16px;cursor:pointer;" onclick="event.stopPropagation()">
            <div style="flex:1;">
              <div style="font-size:0.82rem;font-weight:600;">${item.title}</div>
              <div style="font-size:0.68rem;color:var(--text-tertiary);">${item.desc}</div>
            </div>
            <span class="post-slot-badge ${item.timeClass}" style="font-size:0.62rem;">${item.time}</span>
          </div>
        `).join('')}
        ${isSunday ? `
          <div class="rotina-check" style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:rgba(255,45,85,0.05);border:1px solid rgba(255,45,85,0.2);border-radius:var(--radius-sm);margin-bottom:6px;cursor:pointer;" onclick="this.querySelector('input').click()">
            <input type="checkbox" style="margin-top:3px;accent-color:var(--red);width:16px;height:16px;cursor:pointer;" onclick="event.stopPropagation()">
            <div style="flex:1;">
              <div style="font-size:0.82rem;font-weight:600;">🔴 LIVE DE ORAÇÃO (Domingo 20h)</div>
              <div style="font-size:0.68rem;color:var(--text-tertiary);">30-60 min de oração ao vivo — MAIOR acelerador de crescimento!</div>
            </div>
            <span style="font-size:0.62rem;padding:4px 10px;background:rgba(255,45,85,0.2);color:var(--red);border-radius:20px;font-weight:600;">LIVE</span>
          </div>
        ` : ''}
      </div>

      <div class="section-title" style="margin-bottom:12px;">💬 COMENTÁRIOS PRONTOS — CLIQUE PARA COPIAR</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:6px;margin-bottom:28px;">
        ${comments.map(c => `
          <div style="padding:10px 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:0.75rem;color:var(--text-secondary);cursor:pointer;transition:all 0.2s;" onclick="navigator.clipboard.writeText('${c.replace(/'/g, "\\'")}');showToast('💬 Comentário copiado!');this.style.borderColor='var(--gold-border)'" onmouseenter="this.style.background='var(--bg-card-hover)'" onmouseleave="this.style.background='var(--bg-card)'">${c}</div>
        `).join('')}
      </div>

      <div class="section-title" style="margin-bottom:12px;">👥 CONTAS PARA INTERAGIR</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:20px;">
        ${[
          {handle:'@isaiassaad', desc:'Worship · 5M+'},
          {handle:'@fernandinhoficial', desc:'Gospel · 3M+'},
          {handle:'@gabrielarocha', desc:'Worship · 4M+'},
          {handle:'@pretononbranco', desc:'Gospel Duo · 2M+'},
          {handle:'@alinebarros', desc:'Gospel · 6M+'},
          {handle:'@andersonfreire', desc:'Gospel · 3M+'},
          {handle:'@tiagobrunet', desc:'Pregação · 2M+'},
          {handle:'@lucianosubira', desc:'Teologia · 1M+'},
        ].map(a => `
          <div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);">
            <div>
              <div style="font-weight:700;color:var(--gold);font-size:0.78rem;">${a.handle}</div>
              <div style="font-size:0.62rem;color:var(--text-tertiary);">${a.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="padding:12px 16px;background:var(--gold-bg);border:1px solid var(--gold-border);border-left:4px solid var(--gold);border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:0.72rem;color:var(--text-secondary);">
        💡 <strong style="color:var(--gold);">DICA:</strong> Comente nos vídeos RECENTES deles (últimas 2h) — seu comentário fica no topo e outros seguidores veem o seu perfil!
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   HELPER: HTML Escape
   ═══════════════════════════════════════════════════════════ */
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

module.exports = { startDashboard };
