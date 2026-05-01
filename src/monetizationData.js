/**
 * FéTok Monetization Engine — Data Module
 * All monetization tiers, products, LIVE scripts, and revenue projections
 */

/* ═══════════════════════════════════════════════════════════════
   MONETIZATION PILLARS — 5 Revenue Streams
   ═══════════════════════════════════════════════════════════════ */

const MONETIZATION_PILLARS = [
  {
    id: 'live_gifts',
    name: 'LIVE Gifts + Diamantes',
    icon: '💎',
    status: 'active',        // active | locked | coming_soon
    unlockAt: 94,            // Already unlocked via mobile!
    description: 'Presentes virtuais durante transmissões ao vivo (LIVE já acessível pelo celular!)',
    revenueRange: { min: 500, max: 15000, currency: 'BRL' },
    priority: 1,
  },
  {
    id: 'creator_rewards',
    name: 'Creator Rewards Program',
    icon: '🎬',
    status: 'locked',
    unlockAt: 10000,
    description: 'Pagamento por visualizações qualificadas (vídeos +1 min)',
    revenueRange: { min: 1000, max: 4000, currency: 'BRL' },
    priority: 2,
  },
  {
    id: 'tiktok_shop',
    name: 'TikTok Shop & Afiliados',
    icon: '🛍️',
    status: 'locked',
    unlockAt: 5000,
    description: 'Comissões de produtos marcados nos vídeos',
    revenueRange: { min: 500, max: 8000, currency: 'BRL' },
    priority: 3,
  },
  {
    id: 'brand_deals',
    name: 'Parcerias com Marcas',
    icon: '🤝',
    status: 'locked',
    unlockAt: 5000,
    description: 'Cachês fixos via Creator Marketplace',
    revenueRange: { min: 500, max: 10000, currency: 'BRL' },
    priority: 4,
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions + Tips',
    icon: '⭐',
    status: 'locked',
    unlockAt: 10000,
    description: 'Assinaturas mensais e gorjetas',
    revenueRange: { min: 1500, max: 20000, currency: 'BRL' },
    priority: 5,
  },
];

/* ═══════════════════════════════════════════════════════════════
   SUBSCRIPTION TIERS
   ═══════════════════════════════════════════════════════════════ */

const SUBSCRIPTION_TIERS = [
  {
    id: 'comunhao',
    name: 'Comunhão',
    emoji: '🕊️',
    price: 9.90,
    currency: 'BRL',
    color: '#64d2ff',
    benefits: [
      'Badge exclusivo nos comentários',
      'Emojis especiais da comunidade',
      'Acesso antecipado aos vídeos',
      'Nome na lista de apoiadores',
    ],
  },
  {
    id: 'discipulo',
    name: 'Discípulo',
    emoji: '✝️',
    price: 24.90,
    currency: 'BRL',
    color: '#d4a853',
    benefits: [
      'Tudo do tier Comunhão',
      'Vídeos devocional exclusivos (3x/semana)',
      'Grupo de oração privado',
      'Acesso ao estudo bíblico semanal',
    ],
  },
  {
    id: 'apostolo',
    name: 'Apóstolo',
    emoji: '👑',
    price: 49.90,
    currency: 'BRL',
    color: '#af82ff',
    benefits: [
      'Tudo dos tiers anteriores',
      'Menção nas LIVES',
      'Estudo bíblico exclusivo mensal (1h)',
      'Pedido de oração personalizado',
      'Wallpapers e conteúdo digital exclusivo',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   AFFILIATE PRODUCTS — TikTok Shop
   ═══════════════════════════════════════════════════════════════ */

const AFFILIATE_PRODUCTS = [
  { id: 'biblia_estudo', category: '📖 Bíblias', name: 'Bíblia de Estudo NVI Premium', commission: '10-15%', fit: 5, priceRange: 'R$ 80-250' },
  { id: 'biblia_devocional', category: '📖 Bíblias', name: 'Bíblia Devocional 365 Dias', commission: '10-15%', fit: 5, priceRange: 'R$ 60-120' },
  { id: 'terco_madeira', category: '📿 Acessórios', name: 'Terço de Madeira Artesanal', commission: '15-20%', fit: 4, priceRange: 'R$ 25-80' },
  { id: 'pulseira_crista', category: '📿 Acessórios', name: 'Pulseira Cristã "Fé"', commission: '15-20%', fit: 4, priceRange: 'R$ 20-60' },
  { id: 'camiseta_gospel', category: '👕 Vestuário', name: 'Camiseta Gospel Premium', commission: '15-20%', fit: 4, priceRange: 'R$ 50-120' },
  { id: 'livro_devocional', category: '📚 Livros', name: 'Devocional Cristão (top sellers)', commission: '10-15%', fit: 5, priceRange: 'R$ 30-80' },
  { id: 'quadro_versiculo', category: '🕯️ Decoração', name: 'Quadro com Versículo', commission: '15-20%', fit: 4, priceRange: 'R$ 40-150' },
  { id: 'caneca_fe', category: '🕯️ Decoração', name: 'Caneca "Café com Deus"', commission: '15-20%', fit: 4, priceRange: 'R$ 30-60' },
  { id: 'planner_oracao', category: '📓 Planners', name: 'Planner de Oração & Devocional', commission: '15-25%', fit: 5, priceRange: 'R$ 40-100' },
];

/* ═══════════════════════════════════════════════════════════════
   OWN DIGITAL PRODUCTS (Infoprodutos)
   ═══════════════════════════════════════════════════════════════ */

const OWN_PRODUCTS = [
  {
    id: 'ebook_21dias',
    name: 'E-book "21 Dias de Fé"',
    emoji: '📖',
    price: 29.90,
    margin: 90,
    description: 'Compilação dos 21 versículos da Série FéTok com reflexões diárias, orações guiadas e espaço para journaling.',
    status: 'planned',
    launchPhase: 1,
  },
  {
    id: 'guia_oracao',
    name: 'Guia de Oração Digital',
    emoji: '🙏',
    price: 19.90,
    margin: 90,
    description: 'Templates de oração para manhã, tarde e noite. 30 modelos prontos + versículos.',
    status: 'planned',
    launchPhase: 1,
  },
  {
    id: 'planner_devocional',
    name: 'Planner Devocional Anual',
    emoji: '📅',
    price: 49.90,
    margin: 60,
    description: 'Planner impresso (print-on-demand) com 365 versículos, espaço para anotações e tracker de leitura bíblica.',
    status: 'planned',
    launchPhase: 2,
  },
  {
    id: 'wallpapers_pack',
    name: 'Pack de Wallpapers "Luz da Palavra"',
    emoji: '🎨',
    price: 14.90,
    margin: 95,
    description: '21 wallpapers premium com versículos em design cinematográfico para celular e desktop.',
    status: 'planned',
    launchPhase: 1,
  },
];

/* ═══════════════════════════════════════════════════════════════
   LIVE STREAMING SCHEDULE & SCRIPTS
   ═══════════════════════════════════════════════════════════════ */

const LIVE_SCHEDULE = [
  {
    id: 'devocional_manha',
    name: 'Devocionais da Manhã',
    emoji: '🌅',
    day: 'Terça-feira',
    time: '06:30',
    timezone: 'BRT',
    duration: '30-45 min',
    format: 'Devocional interativo',
    color: '#ffc400',
    script: [
      { time: '0:00', block: 'Abertura', content: 'Boas vindas + oração de abertura. Cumprimentar quem está chegando pelo nome.' },
      { time: '5:00', block: 'Versículo do Dia', content: 'Ler o versículo do FéTok do dia. Mostrar o vídeo na tela se possível.' },
      { time: '10:00', block: 'Reflexão', content: 'Storytelling bíblico aprofundado. Conectar com a vida real da audiência.' },
      { time: '20:00', block: 'Pedidos de Oração', content: 'Ler pedidos do chat. Orar individualmente por cada pessoa mencionada.' },
      { time: '30:00', block: 'Encerramento', content: 'Oração coletiva poderosa. CTA: "Sigam para devocional todo dia 🔔"' },
    ],
    giftTriggers: [
      'Se essa palavra tocou seu coração, manda uma rosa 🌹',
      'Quem crê na proteção de Deus, manda um presente de fé 🙏',
    ],
  },
  {
    id: 'oracao_poderosa',
    name: 'Oração Poderosa',
    emoji: '🙏',
    day: 'Quinta-feira',
    time: '20:00',
    timezone: 'BRT',
    duration: '45-60 min',
    format: 'Oração intensa + worship',
    color: '#af82ff',
    script: [
      { time: '0:00', block: 'Worship', content: 'Música gospel instrumental de fundo. Atmosfera de adoração.' },
      { time: '5:00', block: 'Tema da Noite', content: 'Anunciar o tema (ex: "Deus cura ansiedade", "Libertação do medo")' },
      { time: '15:00', block: '3 Versículos', content: 'Três versículos sobre o tema com explicação profunda e aplicação prática.' },
      { time: '25:00', block: 'Pedidos de Oração', content: 'Ler pedidos do chat ao vivo. Cada pedido recebe uma oração direcionada.' },
      { time: '35:00', block: 'Oração Intensa', content: 'Oração coletiva com música gospel crescendo. Momento mais emocional da live.' },
      { time: '45:00', block: 'Testemunhos', content: 'Abrir para testemunhos do chat. Celebrar vitórias da comunidade.' },
      { time: '55:00', block: 'Encerramento', content: 'Bênção final. CTA: "Compartilhem com quem precisa dessa oração 🙏"' },
    ],
    giftTriggers: [
      'Se Deus já te curou de algo, manda um coração ❤️',
      'Quem quer que essa oração alcance sua família, manda um presente 🙏',
      'Se você sentiu a presença de Deus agora, manda uma estrela ⭐',
    ],
  },
  {
    id: 'estudo_biblico',
    name: 'Estudo Bíblico',
    emoji: '✝️',
    day: 'Sábado',
    time: '15:00',
    timezone: 'BRT',
    duration: '60 min',
    format: 'Estudo + Q&A',
    color: '#34c759',
    script: [
      { time: '0:00', block: 'Recap', content: 'Resumo dos melhores vídeos da semana. Mostrar stats e engajamento.' },
      { time: '10:00', block: 'Estudo Temático', content: 'Estudo bíblico profundo sobre um personagem ou tema (Davi, Moisés, Fé, Graça, etc.)' },
      { time: '30:00', block: 'Q&A', content: 'Perguntas e respostas com a comunidade. Responder dúvidas bíblicas.' },
      { time: '45:00', block: 'Desafio da Semana', content: 'Lançar um desafio espiritual (ex: "Leia Salmos 91 todo dia essa semana")' },
      { time: '55:00', block: 'Encerramento', content: 'Oração + CTA: "Ativem as notificações 🔔 pra não perder o próximo estudo"' },
    ],
    giftTriggers: [
      'Se esse estudo te ensinou algo novo, manda um presente 📖',
      'Quem vai aceitar o desafio da semana, manda uma rosa 🌹',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   BRAND PARTNERS — Target list for gospel niche
   ═══════════════════════════════════════════════════════════════ */

const BRAND_TARGETS = [
  { name: 'Editora Vida', category: 'Livros/Bíblias', feeRange: 'R$ 500-2.000', minFollowers: 5000 },
  { name: 'CPAD', category: 'Livros/Bíblias', feeRange: 'R$ 500-2.000', minFollowers: 5000 },
  { name: 'Thomas Nelson Brasil', category: 'Livros/Bíblias', feeRange: 'R$ 800-3.000', minFollowers: 10000 },
  { name: 'Glorify App', category: 'Tech/App', feeRange: 'R$ 1.000-5.000', minFollowers: 10000 },
  { name: 'Abide App', category: 'Tech/App', feeRange: 'R$ 1.000-5.000', minFollowers: 10000 },
  { name: 'YouVersion Bible App', category: 'Tech/App', feeRange: 'R$ 1.500-8.000', minFollowers: 25000 },
  { name: 'Gospel Wear', category: 'Moda', feeRange: 'R$ 300-1.500', minFollowers: 5000 },
  { name: 'Conferências (Hillsong, etc)', category: 'Eventos', feeRange: 'R$ 500-3.000', minFollowers: 10000 },
];

/* ═══════════════════════════════════════════════════════════════
   REVENUE PROJECTIONS BY PHASE
   ═══════════════════════════════════════════════════════════════ */

const REVENUE_PHASES = [
  {
    id: 'semente',
    name: 'Semente',
    emoji: '🌱',
    followerRange: '94-1K',
    timeframe: '0-45 dias',
    color: '#34c759',
    streams: {
      live_gifts: { min: 500, max: 1500 },
      infoprodutos: { min: 200, max: 500 },
    },
    totalMin: 700,
    totalMax: 2000,
  },
  {
    id: 'crescimento',
    name: 'Crescimento',
    emoji: '🌿',
    followerRange: '5K-10K',
    timeframe: '60-90 dias',
    color: '#ff9500',
    streams: {
      live_gifts: { min: 2000, max: 5000 },
      afiliados: { min: 500, max: 2000 },
      parcerias: { min: 500, max: 1500 },
      infoprodutos: { min: 500, max: 2000 },
    },
    totalMin: 3500,
    totalMax: 10500,
  },
  {
    id: 'colheita',
    name: 'Colheita',
    emoji: '🌾',
    followerRange: '10K+',
    timeframe: '90-180 dias',
    color: '#d4a853',
    streams: {
      live_gifts: { min: 5000, max: 15000 },
      creator_rewards: { min: 1000, max: 4000 },
      afiliados: { min: 2000, max: 8000 },
      parcerias: { min: 2000, max: 10000 },
      subscriptions: { min: 1500, max: 20000 },
      infoprodutos: { min: 2000, max: 5000 },
    },
    totalMin: 13500,
    totalMax: 62000,
  },
];

/* ═══════════════════════════════════════════════════════════════
   LONG-FORM VIDEO TEMPLATES (for Creator Rewards >1 min)
   ═══════════════════════════════════════════════════════════════ */

const LONG_FORM_TEMPLATES = [
  {
    id: 'cinematic_story',
    name: 'História Cinematográfica',
    duration: '90-180s',
    structure: [
      { section: 'hook', time: '0:00-0:03', description: 'Hook explosivo — gancho emocional impossível de ignorar' },
      { section: 'setup', time: '0:03-0:15', description: 'Setup da história bíblica — contexto e personagens' },
      { section: 'build', time: '0:15-0:45', description: 'Desenvolvimento dramático com narração + música crescendo' },
      { section: 'climax', time: '0:45-1:15', description: 'Clímax emocional + revelação do versículo' },
      { section: 'reflect', time: '1:15-1:30', description: 'Reflexão pessoal e aplicação na vida real' },
      { section: 'cta', time: '1:30-1:45', description: 'CTA + versículo final + "Siga para mais"' },
    ],
    bestFor: 'Histórias bíblicas épicas (Pescador, Filho Pródigo, Vale dos Ossos)',
  },
  {
    id: 'deep_verse',
    name: 'Versículo Profundo',
    duration: '60-90s',
    structure: [
      { section: 'hook', time: '0:00-0:05', description: 'Pergunta provocativa sobre o versículo' },
      { section: 'context', time: '0:05-0:20', description: 'Contexto histórico do versículo (quem escreveu, quando, por quê)' },
      { section: 'meaning', time: '0:20-0:40', description: 'Significado profundo — o que a maioria não sabe' },
      { section: 'apply', time: '0:40-0:55', description: 'Aplicação prática na vida moderna' },
      { section: 'cta', time: '0:55-1:05', description: 'CTA emocional + "Salve e compartilhe"' },
    ],
    bestFor: 'Versículos do dia com contexto aprofundado',
  },
  {
    id: 'testimony_format',
    name: 'Testemunho Visual',
    duration: '60-120s',
    structure: [
      { section: 'hook', time: '0:00-0:05', description: '"Eu estava no fundo do poço quando..."' },
      { section: 'before', time: '0:05-0:25', description: 'A situação antes — dor, desespero, solidão' },
      { section: 'encounter', time: '0:25-0:45', description: 'O encontro com Deus — momento de virada' },
      { section: 'after', time: '0:45-1:00', description: 'Transformação — como a vida mudou' },
      { section: 'verse', time: '1:00-1:15', description: 'Versículo que sustentou tudo + oração' },
    ],
    bestFor: 'Conteúdo de prova social e conexão emocional',
  },
];

/* ═══════════════════════════════════════════════════════════════
   MILESTONES TRACKER
   ═══════════════════════════════════════════════════════════════ */

const MILESTONES = [
  { followers: 94, label: 'LIVE Desbloqueada (Mobile)', icon: '🔴', unlocks: ['LIVE Gifts via Mobile', 'Construir comunidade'], achieved: true, note: 'TikTok liberou LIVE no mobile mesmo com <1K seguidores' },
  { followers: 1000, label: 'LIVE Estável + Presentes', icon: '💎', unlocks: ['Presentes confirmados', 'Maior alcance LIVE'], achieved: false },
  { followers: 2500, label: 'Micro-Influencer', icon: '📈', unlocks: ['Primeiras parcerias informais'], achieved: false },
  { followers: 5000, label: 'TikTok Shop', icon: '🛍️', unlocks: ['Afiliados', 'Sacola de produtos'], achieved: false },
  { followers: 10000, label: 'Creator Rewards', icon: '💰', unlocks: ['RPM por views', 'Subscriptions', 'Creator Marketplace'], achieved: false },
  { followers: 25000, label: 'Autoridade', icon: '👑', unlocks: ['Parcerias premium', 'Eventos'], achieved: false },
  { followers: 50000, label: 'Top Creator', icon: '🏆', unlocks: ['Marca procura VOCÊ', 'Revenue share'], achieved: false },
  { followers: 100000, label: 'Elite', icon: '💎', unlocks: ['Full monetization stack', 'Embaixador'], achieved: false },
];

module.exports = {
  MONETIZATION_PILLARS,
  SUBSCRIPTION_TIERS,
  AFFILIATE_PRODUCTS,
  OWN_PRODUCTS,
  LIVE_SCHEDULE,
  BRAND_TARGETS,
  REVENUE_PHASES,
  LONG_FORM_TEMPLATES,
  MILESTONES,
};
