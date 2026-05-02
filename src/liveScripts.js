/**
 * FéTok LIVE Script Engine — Complete Script for Thursday "Oração Poderosa"
 * Date: 2026-05-08 20:00 BRT
 * Theme: "Deus Acalma a Tempestade da Sua Vida" (Ansiedade, Medo, Paz)
 */

const LIVE_SCRIPTS = {
  oracao_poderosa_001: {
    id: 'oracao_poderosa_001',
    title: '🙏 ORAÇÃO PODEROSA — Deus Acalma a Tempestade da Sua Vida',
    tiktokTitle: '🙏 ORAÇÃO PODEROSA — Deus Acalma Sua Tempestade ✝️',
    date: '2026-05-08',
    time: '20:00',
    timezone: 'BRT',
    duration: '45-60 min',
    theme: 'Ansiedade, Medo e Paz',
    themeEmoji: '🌊',
    status: 'scheduled', // scheduled | completed | cancelled

    // ── SETUP ──
    setup: {
      equipment: [
        { item: 'Celular', detail: 'Carregado 100% + carregador conectado' },
        { item: 'Tripé/Apoio', detail: 'Tripé de mesa ou livros empilhados' },
        { item: 'Iluminação', detail: 'Ring light OU abajur atrás do celular' },
        { item: 'Áudio', detail: 'Fone com microfone (earbuds)' },
        { item: 'Internet', detail: 'WiFi 5Ghz ou 4G forte' },
      ],
      background: 'Parede escura/limpa + velas/LED + cruz ou quadro com versículo',
      musicSearch: [
        'worship instrumental piano oração 1 hora',
        'piano instrumental gospel calmo fundo',
        'fundo musical para oração piano instrumental gospel 1 hora',
      ],
      musicVolume: '15-20% do volume da voz',
    },

    // ── CHECKLIST PRÉ-LIVE ──
    checklist: [
      { item: 'Celular carregado + carregador', done: false },
      { item: 'Tripé posicionado', done: false },
      { item: 'Iluminação OK', done: false },
      { item: 'Fone com mic conectado', done: false },
      { item: 'Fundo limpo + vela acesa', done: false },
      { item: 'Música instrumental tocando', done: false },
      { item: 'WiFi estável testado', done: false },
      { item: 'Modo Não Perturbe ativado', done: false },
      { item: 'Bíblia/versículos ao lado', done: false },
      { item: 'Copo de água por perto', done: false },
      { item: 'Vídeo teaser postado 15min antes', done: false },
    ],

    // ── CRONOGRAMA DO DIA ──
    daySchedule: [
      { time: '06:00', action: 'Postar vídeo FéTok normal (manhã)' },
      { time: '12:00', action: 'Postar vídeo FéTok + story "HOJE TEM LIVE 20H 🙏"' },
      { time: '19:00', action: 'Postar vídeo TEASER 15s: "Daqui 1h, ORAÇÃO PODEROSA 🙏"' },
      { time: '19:45', action: 'Setup técnico (checklist)' },
      { time: '19:55', action: 'Música tocando, cenário pronto' },
      { time: '20:00', action: '🔴 INICIAR LIVE' },
      { time: '21:00', action: 'Encerrar + stories agradecendo' },
    ],

    // ── 3 VERSÍCULOS PRINCIPAIS ──
    verses: [
      {
        reference: 'Marcos 4:39',
        text: 'Levantando-se, repreendeu o vento e disse ao mar: Acalma-te, emudece! O vento cessou e fez-se grande bonança.',
        theme: 'Jesus acalmando a tempestade',
        storytelling: 'Discípulos no barco, tempestade violenta, Jesus dormindo, acorda e acalma o mar com 3 palavras',
      },
      {
        reference: 'Filipenses 4:6-7',
        text: 'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo o entendimento, guardará o coração e a mente de vocês.',
        theme: 'Paulo escrevendo da prisão sobre paz',
        storytelling: 'Paulo preso, acorrentado, sem saber se viveria, e mesmo assim escreveu sobre não ter ansiedade',
      },
      {
        reference: 'Isaías 41:10',
        text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus. Eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel.',
        theme: 'Deus dizendo para não temer',
        storytelling: 'Deus olhando nos seus olhos e declarando: EU ESTOU COM VOCÊ',
      },
    ],

    // ── VERSÍCULOS EXTRAS (backup) ──
    backupVerses: [
      { ref: 'Salmos 23:4', text: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque Tu estás comigo.' },
      { ref: 'Mateus 11:28', text: 'Venham a mim todos os que estão cansados e sobrecarregados, e eu lhes darei descanso.' },
      { ref: 'Salmos 46:10', text: 'Aquietem-se e saibam que eu sou Deus.' },
      { ref: 'Jeremias 29:11', text: 'Pois eu sei os planos que tenho para vocês, planos de fazê-los prosperar e não de causar dano.' },
      { ref: 'Romanos 8:28', text: 'Todas as coisas cooperam para o bem daqueles que amam a Deus.' },
      { ref: '2 Coríntios 12:9', text: 'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.' },
    ],

    // ── ROTEIRO — 9 BLOCOS ──
    blocks: [
      {
        id: 1, name: 'Abertura Emocional', emoji: '🌅',
        timeStart: '0:00', timeEnd: '5:00', durationMin: 5,
        musicLevel: '20%', mood: 'Acolhedor, calmo, sorriso suave',
        summary: 'Boas vindas + perguntar cidades + pedir compartilhamento',
        keyPhrases: [
          'Que bom que você veio. Deus trouxe você aqui.',
          'Comenta de onde você está assistindo! Qual sua cidade?',
          'Compartilha essa live com alguém que precisa de uma oração hoje.',
        ],
        giftTrigger: null,
        engagementAction: 'Pedir cidade nos comentários',
      },
      {
        id: 2, name: 'Revelação do Tema', emoji: '🌊',
        timeStart: '5:00', timeEnd: '10:00', durationMin: 5,
        musicLevel: '20%', mood: 'Sério, empático, pausa dramática',
        summary: 'Revelar o tema: ansiedade, medo, tempestade interior',
        keyPhrases: [
          'O tema de hoje atinge MILHÕES de pessoas.',
          'A TEMPESTADE NA SUA VIDA. A ansiedade. O medo.',
          'O MESMO DEUS QUE ACALMOU A TEMPESTADE NO MAR VAI ACALMAR A TEMPESTADE DENTRO DE VOCÊ.',
        ],
        giftTrigger: null,
        engagementAction: 'Comenta "PAZ" se precisa da paz de Deus',
      },
      {
        id: 3, name: 'Versículo 1 — Marcos 4:39', emoji: '⛵',
        timeStart: '10:00', timeEnd: '18:00', durationMin: 8,
        musicLevel: '25% crescendo', mood: 'Storytelling intenso, dramático',
        summary: 'História de Jesus acalmando a tempestade — storytelling cinematográfico',
        keyPhrases: [
          'Os discípulos tinham CERTEZA que iam morrer.',
          'Jesus simplesmente LEVANTOU e disse: ACALMA-TE. EMUDECE.',
          'Se Jesus está no barco, O BARCO NÃO AFUNDA.',
        ],
        giftTrigger: {
          phrase: 'Se essa história tocou o seu coração, manda uma rosa 🌹 pra abençoar essa live.',
          emoji: '🌹',
          timing: 'Após storytelling (min ~17)',
        },
        engagementAction: 'Comenta AMÉM se crê que Jesus está no seu barco',
      },
      {
        id: 4, name: 'Versículo 2 — Filipenses 4:6-7', emoji: '📖',
        timeStart: '18:00', timeEnd: '25:00', durationMin: 7,
        musicLevel: '20%', mood: 'Reflexivo, profundo',
        summary: 'Paulo na prisão escrevendo sobre paz — a paz não depende da situação',
        keyPhrases: [
          'Paulo escreveu isso DA PRISÃO.',
          'A paz de Deus não depende da situação. Depende da PRESENÇA de Deus.',
          'Em TUDO, pela ORAÇÃO, apresente seus pedidos.',
        ],
        giftTrigger: null,
        engagementAction: 'Pedir para escrever pedidos de oração no chat',
      },
      {
        id: 5, name: 'Versículo 3 — Isaías 41:10', emoji: '💪',
        timeStart: '25:00', timeEnd: '30:00', durationMin: 5,
        musicLevel: '20%', mood: 'Firme, declarativo',
        summary: 'Deus dizendo para não temer — transição para oração',
        keyPhrases: [
          'NÃO TEMAS. Porque EU SOU CONTIGO.',
          'Você pode não saber o que vai acontecer amanhã. Mas sabe quem VAI ESTAR com você.',
        ],
        giftTrigger: {
          phrase: 'Manda um presente pra empurrar essa live pra mais gente que precisa. ⭐🌹',
          emoji: '⭐',
          timing: 'Após 3º versículo (min ~30)',
        },
        engagementAction: 'Comenta "DEUS ESTÁ COMIGO"',
      },
      {
        id: 6, name: 'Pedidos de Oração', emoji: '🙏',
        timeStart: '30:00', timeEnd: '40:00', durationMin: 10,
        musicLevel: '10% piano suave', mood: 'Reverente, íntimo',
        summary: 'Ler 10-15 pedidos do chat e orar por cada um individualmente',
        keyPhrases: [
          'Escreve no chat: qual é o seu pedido de oração?',
          'Pode ser cura, emprego, paz no casamento, libertação.',
          'Em nome de Jesus, está feito. Amém.',
        ],
        giftTrigger: null,
        engagementAction: 'Pedidos de oração no chat (máximo engajamento)',
      },
      {
        id: 7, name: 'ORAÇÃO COLETIVA INTENSA', emoji: '🔥',
        timeStart: '40:00', timeEnd: '50:00', durationMin: 10,
        musicLevel: '30-40% CRESCENDO', mood: 'CLÍMAX — máxima emoção e intensidade',
        summary: 'Oração coletiva intensa com música alta — momento mais poderoso da LIVE',
        keyPhrases: [
          'FECHE OS OLHOS. Coloca a mão no peito.',
          'ACALMA A TEMPESTADE. Assim como Tu acalmaste o mar.',
          'TODO MEDO — SAI AGORA. TODA ANSIEDADE — SAI AGORA.',
          'Declaro PAZ sobre essa vida. PAZ sobre essa casa. PAZ sobre essa família.',
        ],
        giftTrigger: {
          phrase: 'Se sentiu a presença de Deus, manda um coração ❤️. Cada presente faz essa live alcançar mais vidas. 🙏',
          emoji: '❤️',
          timing: 'Após oração (min ~50) — MÁXIMA EMOÇÃO',
        },
        engagementAction: 'Olhos fechados + mão no peito',
      },
      {
        id: 8, name: 'Testemunhos', emoji: '💬',
        timeStart: '50:00', timeEnd: '55:00', durationMin: 5,
        musicLevel: '15%', mood: 'Celebração, alegria suave',
        summary: 'Ler reações emocionantes do chat + pedir testemunhos',
        keyPhrases: [
          'Olha esse chat. Olha quantas vidas tocadas.',
          'Alguém quer compartilhar um testemunho?',
          'Deus é fiel. Sempre foi e sempre será.',
        ],
        giftTrigger: null,
        engagementAction: 'Ler comentários e testemunhos',
      },
      {
        id: 9, name: 'Encerramento + CTA', emoji: '🔔',
        timeStart: '55:00', timeEnd: '60:00', durationMin: 5,
        musicLevel: '15%', mood: 'Amoroso, grato',
        summary: 'Pedir compartilhamento + seguir + anunciar próxima live',
        keyPhrases: [
          'COMPARTILHA essa live com alguém que precisa.',
          'Segue @luz.da.palavra.oficial 🔔',
          'Toda quinta às 20h tem ORAÇÃO PODEROSA.',
          'Não temas, porque Eu sou contigo.',
        ],
        giftTrigger: { phrase: 'Apenas agradecer quem mandou presentes', emoji: '🙏', timing: 'Orgânico' },
        engagementAction: 'Seguir + compartilhar + ativar notificações',
      },
    ],

    // ── PÓS-LIVE ──
    postLive: [
      { action: 'Postar agradecimento nos stories', when: 'Imediatamente' },
      { action: 'Salvar gravação da LIVE', when: 'Imediatamente' },
      { action: 'Editar trecho 60s da oração → postar como vídeo', when: 'Sexta manhã' },
      { action: 'Anotar métricas: viewers, pico, presentes', when: 'Sexta manhã' },
      { action: 'Preparar tema da próxima live', when: 'Sábado' },
    ],
  },
};

module.exports = { LIVE_SCRIPTS };
