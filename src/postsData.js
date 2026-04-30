/**
 * FéTok POSTS_DATA — Série 3
 * 21 posts NOVOS (zero overlap com Série 2)
 * 7 dias × 3 slots (06:00 / 12:00 / 20:00)
 */

const POSTS_DATA = [
  // ══════════════ DIA 1 ══════════════
  { day:1, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Salmos 34:7', theme:'proteção', themeEmoji:'🛡️',
    text:'O anjo do Senhor acampa-se ao redor dos que o temem e os livra.',
    videoFile:'video_salmos_34_7.mp4',
    music:'Isaias Saad → Bondade de Deus',
    musicSearch:'isaias saad bondade de deus',
    caption:`O anjo do Senhor acampa-se ao redor dos que o temem e os livra. 🛡️✝️
Salmos 34:7

ANJOS estão ao seu redor AGORA MESMO. Você não está sozinho! 🙏
Deixe um ❤️ se você crê na proteção de Deus!
Salve esse vídeo. Você vai precisar dele. 🔖

#versiculododia #biblia #fe #jesus #deus #anjos #proteção #salmos #fetok #fyp #viral #foryou #gospel #cristao #palavradedeus`
  },
  { day:1, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Salmos 27:14', theme:'coragem', themeEmoji:'💪',
    text:'Espera no Senhor, anima-te e ele fortalecerá o teu coração.',
    videoFile:'video_salmos_27_14.mp4',
    music:'Fernandinho → Grandes Coisas',
    musicSearch:'fernandinho grandes coisas',
    caption:`Espera no Senhor, anima-te e ele fortalecerá o teu coração. 💪✝️
Salmos 27:14

Cansado de esperar? DEUS ESTÁ TRABALHANDO no silêncio! 🔥
A resposta vem na hora CERTA. Confia! 🙏
Comenta AMÉM se você está esperando no Senhor! ❤️

#versiculododia #biblia #fe #jesus #deus #espera #coragem #salmos #fetok #fyp #viral #gospel #cristao #fortaleza`
  },
  { day:1, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Colossenses 3:14', theme:'amor', themeEmoji:'💕',
    text:'Acima de tudo, porém, revistam-se do amor, que é o elo perfeito.',
    videoFile:'video_colossenses_3_14.mp4',
    music:'Preto no Branco → Ninguém Explica Deus',
    musicSearch:'preto no branco ninguém explica deus',
    caption:`Acima de tudo, porém, revistam-se do amor, que é o elo perfeito. 💕✝️
Colossenses 3:14

O AMOR é a roupa mais bonita que você pode vestir. ❤️
Vista-se de amor TODOS OS DIAS! 🙏
Marque alguém que você AMA e envie esse versículo! 💛

#versiculododia #biblia #fe #jesus #deus #amor #colossenses #perfeito #fetok #fyp #viral #gospel #cristao #amordedeus`
  },

  // ══════════════ DIA 2 ══════════════
  { day:2, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Isaías 54:17', theme:'proteção', themeEmoji:'🛡️',
    text:'Nenhuma arma forjada contra ti prosperará.',
    videoFile:'video_isaias_54_17.mp4',
    music:'Gabriela Rocha → Lugar Secreto',
    musicSearch:'gabriela rocha lugar secreto',
    caption:`Nenhuma arma forjada contra ti prosperará. 🛡️✝️
Isaías 54:17

NENHUMA. Nem inveja, nem maldade, nem doença. NADA prospera contra você! 🔥
Deus é o seu ESCUDO INVENCÍVEL! 🙏
Comenta "PROTEGIDO" se você crê nessa promessa! ❤️

#versiculododia #biblia #fe #jesus #deus #nenhuma #arma #isaias #proteção #fetok #fyp #viral #gospel #cristao #promessa`
  },
  { day:2, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'2 Timóteo 1:7', theme:'coragem', themeEmoji:'⚔️',
    text:'Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.',
    videoFile:'video_2_timoteo_1_7.mp4',
    music:'Anderson Freire → Primeira Essência',
    musicSearch:'anderson freire primeira essencia',
    caption:`Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio. ⚔️✝️
2 Timóteo 1:7

Você NÃO nasceu pra ter MEDO. Nasceu pra ter PODER! 🔥
Levante a cabeça, guerreiro de Deus! 👑
Comenta AMÉM se você recebe esse poder AGORA! 🙏

#versiculododia #biblia #fe #jesus #deus #poder #coragem #timoteo #fetok #fyp #viral #gospel #cristao #guerreiro`
  },
  { day:2, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'1 João 4:19', theme:'amor', themeEmoji:'❤️',
    text:'Nós amamos porque ele nos amou primeiro.',
    videoFile:'video_1_joao_4_19.mp4',
    music:'Isaias Saad → Me Atraiu',
    musicSearch:'isaias saad me atraiu',
    caption:`Nós amamos porque ele nos amou primeiro. ❤️✝️
1 João 4:19

Antes de você sequer PENSAR em Deus, Ele já te AMAVA. 😭
O amor de Deus não depende de NADA que você faça! 💛
Deixe ❤️ se você sente esse amor! 🙏

#versiculododia #biblia #fe #jesus #deus #amor #primeiro #joao #fetok #fyp #viral #gospel #cristao #amordedeus`
  },

  // ══════════════ DIA 3 ══════════════
  { day:3, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Provérbios 18:10', theme:'proteção', themeEmoji:'🏰',
    text:'O nome do Senhor é uma torre forte; o justo corre para ela e está seguro.',
    videoFile:'video_proverbios_18_10.mp4',
    music:'Aline Barros → Ressuscita-me',
    musicSearch:'aline barros ressuscita-me',
    caption:`O nome do Senhor é uma torre forte; o justo corre para ela e está seguro. 🏰✝️
Provérbios 18:10

Quando o mundo desabar, CORRA pro nome de JESUS! 🙏
Ele é sua TORRE FORTE. Nada te derruba lá dentro! 🔥
Salve esse vídeo pra lembrar disso sempre! 🔖

#versiculododia #biblia #fe #jesus #deus #torre #forte #proverbios #fetok #fyp #viral #gospel #cristao #seguro`
  },
  { day:3, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Habacuque 3:19', theme:'força', themeEmoji:'🦌',
    text:'O Senhor Deus é a minha força; ele me dá pés como de corça e me faz andar sobre os altos.',
    videoFile:'video_habacuque_3_19.mp4',
    music:'Fernandinho → Faz Chover',
    musicSearch:'fernandinho faz chover',
    caption:`O Senhor Deus é a minha força; ele me dá pés como de corça e me faz andar sobre os altos. 🦌✝️
Habacuque 3:19

Deus te faz SUBIR onde os outros não conseguem! ⛰️
Ele te coloca NO TOPO mesmo quando tudo parece impossível! 🔥
Comenta AMÉM se você crê que está subindo! 🙏

#versiculododia #biblia #fe #jesus #deus #força #habacuque #altos #fetok #fyp #viral #gospel #cristao #vitoria`
  },
  { day:3, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Salmos 126:5', theme:'esperança', themeEmoji:'🌅',
    text:'Aqueles que semeiam com lágrimas, com cânticos de júbilo colherão.',
    videoFile:'video_salmos_126_5.mp4',
    music:'Gabriela Rocha → Deus Provará',
    musicSearch:'gabriela rocha deus provará',
    caption:`Aqueles que semeiam com lágrimas, com cânticos de júbilo colherão. 🌅✝️
Salmos 126:5

Suas LÁGRIMAS de hoje serão sua COLHEITA amanhã! 😭➡️🎉
Não desista. A colheita está chegando! 🙏
Comenta "EU VOU COLHER" se você crê! ❤️

#versiculododia #biblia #fe #jesus #deus #lágrimas #colheita #esperança #fetok #fyp #viral #gospel #cristao #promessa`
  },

  // ══════════════ DIA 4 ══════════════
  { day:4, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Mateus 17:20', theme:'fé', themeEmoji:'🌿',
    text:'Se tiverdes fé como um grão de mostarda, direis a este monte: passa daqui e ele passará.',
    videoFile:'video_mateus_17_20.mp4',
    music:'Aline Barros → Sonda-me',
    musicSearch:'aline barros sonda-me',
    caption:`Se tiverdes fé como um grão de mostarda, direis a este monte: passa daqui e ele passará. 🌿✝️
Mateus 17:20

Não precisa de fé GRANDE. Precisa de fé VERDADEIRA! 🔥
Um GRÃO de fé move MONTANHAS inteiras! ⛰️
Comenta "EU CREIO" se sua fé move montanhas! 🙏

#versiculododia #biblia #fe #jesus #deus #mostarda #montanha #mateus #fetok #fyp #viral #gospel #cristao #milagre`
  },
  { day:4, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'2 Coríntios 12:10', theme:'força', themeEmoji:'💪',
    text:'Quando sou fraco, então é que sou forte.',
    videoFile:'video_2_corintios_12_10.mp4',
    music:'Anderson Freire → Raridade',
    musicSearch:'anderson freire raridade',
    caption:`Quando sou fraco, então é que sou forte. 💪✝️
2 Coríntios 12:10

Sua FRAQUEZA é o palco da FORÇA de Deus! 🔥
Quando você não aguenta mais, DEUS ASSUME! ⚡
Comenta AMÉM se Deus já te deu forças quando você estava no chão! 🙏

#versiculododia #biblia #fe #jesus #deus #fraco #forte #corintios #fetok #fyp #viral #gospel #cristao #superação`
  },
  { day:4, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Sofonias 3:17', theme:'amor', themeEmoji:'🎶',
    text:'O Senhor teu Deus está no meio de ti, poderoso para te salvar; ele se deleitará em ti com alegria.',
    videoFile:'video_sofonias_3_17.mp4',
    music:'Soraya Moraes → Quão Grande É o Meu Deus',
    musicSearch:'soraya moraes quão grande é o meu deus',
    caption:`O Senhor teu Deus está no meio de ti, poderoso para te salvar; ele se deleitará em ti com alegria. 🎶✝️
Sofonias 3:17

Deus se ALEGRA com você. Ele CANTA por causa de você! 🎵
Imagine o Criador do universo sorrindo por SUA causa! 😭❤️
Compartilhe com alguém que precisa saber disso! 🙏

#versiculododia #biblia #fe #jesus #deus #alegria #sofonias #deleite #fetok #fyp #viral #gospel #cristao #amordedeus`
  },

  // ══════════════ DIA 5 ══════════════
  { day:5, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Salmos 103:2', theme:'gratidão', themeEmoji:'🙌',
    text:'Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum dos seus benefícios.',
    videoFile:'video_salmos_103_2.mp4',
    music:'Gabriela Rocha → Eu Navegarei',
    musicSearch:'gabriela rocha eu navegarei',
    caption:`Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum dos seus benefícios. 🙌✝️
Salmos 103:2

PARE e lembre de TUDO que Deus já fez por você! 🙏
Cada dia que você acorda é um PRESENTE dele! ☀️
Comenta um benefício que Deus te deu! ❤️

#versiculododia #biblia #fe #jesus #deus #gratidão #benefícios #salmos #fetok #fyp #viral #gospel #cristao #louvor`
  },
  { day:5, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Êxodo 14:14', theme:'vitória', themeEmoji:'👑',
    text:'O Senhor pelejará por vós, e vós vos calareis.',
    videoFile:'video_exodo_14_14.mp4',
    music:'Fernandinho → Eu Vou Abrir o Mar',
    musicSearch:'fernandinho eu vou abrir o mar',
    caption:`O Senhor pelejará por vós, e vós vos calareis. 👑✝️
Êxodo 14:14

PARE DE LUTAR SOZINHO. Deus vai LUTAR por você! ⚔️
Quando Deus entra na batalha, o inimigo FOGE! 🔥
Comenta "DEUS PELEJA POR MIM" se você crê! 🙏

#versiculododia #biblia #fe #jesus #deus #vitória #peleja #exodo #fetok #fyp #viral #gospel #cristao #batalha`
  },
  { day:5, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Isaías 26:3', theme:'paz', themeEmoji:'🕊️',
    text:'Tu conservarás em paz aquele cuja mente está firme em ti.',
    videoFile:'video_isaias_26_3.mp4',
    music:'Isaias Saad → Bondade de Deus',
    musicSearch:'isaias saad bondade de deus',
    caption:`Tu conservarás em paz aquele cuja mente está firme em ti. 🕊️✝️
Isaías 26:3

Mente em DEUS = coração em PAZ. 🙏
Não importa o caos ao redor, FIXE seus olhos no Senhor! ✨
Salve esse vídeo e assista quando a ansiedade bater! 🔖

#versiculododia #biblia #fe #jesus #deus #paz #mente #isaias #fetok #fyp #viral #gospel #cristao #descanso`
  },

  // ══════════════ DIA 6 ══════════════
  { day:6, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Marcos 9:23', theme:'fé', themeEmoji:'🙏',
    text:'Tudo é possível ao que crê.',
    videoFile:'video_marcos_9_23.mp4',
    music:'Aline Barros → Consagração',
    musicSearch:'aline barros consagração',
    caption:`Tudo é possível ao que crê. 🙏✝️
Marcos 9:23

TUDO. Não "algumas coisas". TUDO! 🔥
Cura? POSSÍVEL. Restauração? POSSÍVEL. Milagre? POSSÍVEL! ⚡
Comenta "EU CREIO" se você acredita no impossível! ❤️

#versiculododia #biblia #fe #jesus #deus #possível #crê #marcos #fetok #fyp #viral #gospel #cristao #milagre`
  },
  { day:6, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'Neemias 8:10', theme:'força', themeEmoji:'😊',
    text:'A alegria do Senhor é a minha força.',
    videoFile:'video_neemias_8_10.mp4',
    music:'Anderson Freire → Identidade',
    musicSearch:'anderson freire identidade',
    caption:`A alegria do Senhor é a minha força. 😊✝️
Neemias 8:10

Não é a TRISTEZA que te fortalece. É a ALEGRIA de Deus! 🎉
Mesmo na dor, a alegria do Senhor te SUSTENTA! 💪
Comenta "ALEGRIA" se Deus te dá forças pra sorrir! 🙏

#versiculododia #biblia #fe #jesus #deus #alegria #força #neemias #fetok #fyp #viral #gospel #cristao #felicidade`
  },
  { day:6, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Apocalipse 21:4', theme:'esperança', themeEmoji:'🌈',
    text:'Ele enxugará dos seus olhos toda lágrima, e não haverá mais morte, nem pranto, nem dor.',
    videoFile:'video_apocalipse_21_4.mp4',
    music:'Isaias Saad → Creio que Tu és a Cura',
    musicSearch:'isaias saad creio que tu és a cura',
    caption:`Ele enxugará dos seus olhos toda lágrima, e não haverá mais morte, nem pranto, nem dor. 🌈✝️
Apocalipse 21:4

Um dia, TODA lágrima vai secar. TODA dor vai acabar. 😭➡️😊
Deus vai enxugar SEU rosto com as próprias mãos! 🙏
Deixe ❤️ se você espera esse dia!

#versiculododia #biblia #fe #jesus #deus #lágrima #esperança #apocalipse #fetok #fyp #viral #gospel #cristao #eternidade`
  },

  // ══════════════ DIA 7 ══════════════
  { day:7, slot:'06:00', slotKey:'morning', emoji:'☀️', verse:'Jeremias 33:3', theme:'fé', themeEmoji:'📖',
    text:'Clama a mim e eu te responderei e te anunciarei coisas grandes e ocultas.',
    videoFile:'video_jeremias_33_3.mp4',
    music:'Gabriela Rocha → Deus Provará',
    musicSearch:'gabriela rocha deus provará',
    caption:`Clama a mim e eu te responderei e te anunciarei coisas grandes e ocultas. 📖✝️
Jeremias 33:3

Deus tem COISAS GRANDES preparadas pra você! 🔥
Coisas que seus olhos NÃO VIRAM ainda! ✨
Comenta "EU CLAMO" se você quer ver o impossível! 🙏

#versiculododia #biblia #fe #jesus #deus #clama #grandes #jeremias #fetok #fyp #viral #gospel #cristao #ocultas`
  },
  { day:7, slot:'12:00', slotKey:'afternoon', emoji:'🌤️', verse:'2 Timóteo 4:7', theme:'vitória', themeEmoji:'🏆',
    text:'Combati o bom combate, terminei a corrida, guardei a fé.',
    videoFile:'video_2_timoteo_4_7.mp4',
    music:'Preto no Branco → Me Deixa Aqui',
    musicSearch:'preto no branco me deixa aqui',
    caption:`Combati o bom combate, terminei a corrida, guardei a fé. 🏆✝️
2 Timóteo 4:7

Não importa quantas vezes você caiu. O que importa é que NÃO DESISTIU! 🔥
TERMINE a corrida. A coroa te espera! 👑
Comenta "NÃO DESISTO" se você vai até o fim! 🙏

#versiculododia #biblia #fe #jesus #deus #combate #corrida #timoteo #fetok #fyp #viral #gospel #cristao #vitoria`
  },
  { day:7, slot:'20:00', slotKey:'evening', emoji:'🌙', verse:'Filipenses 4:6', theme:'paz', themeEmoji:'🕊️',
    text:'Não andem ansiosos por coisa alguma; apresentem seus pedidos a Deus.',
    videoFile:'video_filipenses_4_6.mp4',
    music:'Isaias Saad → Bondade de Deus',
    musicSearch:'isaias saad bondade de deus',
    caption:`Não andem ansiosos por coisa alguma; apresentem seus pedidos a Deus. 🕊️✝️
Filipenses 4:6

ANSIEDADE? Entregue a Deus. MEDO? Entregue a Deus. DÚVIDA? Entregue a Deus! 🙏
Ele cuida de TUDO por você! ❤️
Comenta "ENTREGO" se você entrega tudo nas mãos de Deus! 🙏

Esse foi o último post da semana. Se essa página te abençoou, SIGA para mais versículos diários! 🔔

#versiculododia #biblia #fe #jesus #deus #ansiedade #paz #filipenses #fetok #fyp #viral #gospel #cristao #descanso`
  },
];

module.exports = { POSTS_DATA };
