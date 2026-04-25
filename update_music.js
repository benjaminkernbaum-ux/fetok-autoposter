const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, 'src', 'dashboard.js');
let dash = fs.readFileSync(dashPath, 'utf8');

// New VIRAL_MUSIC for Serie 2
const NEW_MUSIC = `const VIRAL_MUSIC = [
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
];`;

// Replace VIRAL_MUSIC
const startMarker = 'const VIRAL_MUSIC = [';
const startIdx = dash.indexOf(startMarker);
let depth = 0;
let endIdx;
for (let i = startIdx; i < dash.length; i++) {
  if (dash[i] === '[') depth++;
  if (dash[i] === ']') { depth--; if (depth === 0) { endIdx = i + 2; break; } }
}

dash = dash.substring(0, startIdx) + NEW_MUSIC + dash.substring(endIdx);
fs.writeFileSync(dashPath, dash, 'utf8');
console.log('✅ VIRAL_MUSIC updated!');
