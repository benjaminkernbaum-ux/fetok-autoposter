/**
 * FéTok LIVE Video Generator — 100% AI Automated
 * Generates a 60-minute cinematic prayer video for TikTok LIVE
 * 
 * Pipeline: TTS narration → Slide images → FFmpeg assembly → Final MP4
 * 
 * Usage: node src/liveVideoGenerator.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const PImage = require('pureimage');
const sharp = require('sharp');
const googleTTS = require('@sefinek/google-tts-api');

const OUTPUT_DIR = path.resolve(__dirname, '../output/live');
const SLIDES_DIR = path.join(OUTPUT_DIR, 'slides');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const HEROES_DIR = path.resolve(__dirname, '../heroes');
const FONT_DIR = path.resolve(__dirname, '../fonts');

// Ensure dirs
[OUTPUT_DIR, SLIDES_DIR, AUDIO_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// Load fonts
const fontBold = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSans-Bold.ttf'), 'DejaVuBold');
fontBold.loadSync();
const fontSerif = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSerif-Bold.ttf'), 'DejaVuSerif');
fontSerif.loadSync();
const fontRegular = PImage.registerFont(path.join(FONT_DIR, 'DejaVuSans.ttf'), 'DejaVuRegular');
fontRegular.loadSync();

// ═══════════════════════════════════════════
//  NARRATION SCRIPT — Complete TTS texts
// ═══════════════════════════════════════════

const BLOCKS = [
  {
    id: 'abertura', name: 'Abertura', durationSec: 180,
    slideType: 'title', slideText: '🙏 Oração Poderosa', slideSubtext: 'Deus Acalma a Tempestade da Sua Vida',
    narration: `Bem-vindo à Oração Poderosa.
Esta noite, nós vamos mergulhar na palavra de Deus. Sobre um tema que toca milhões de pessoas: a ansiedade, o medo, e a paz que só Deus pode dar.
Se você está sentindo o peso do mundo nos seus ombros, se a sua mente não para, se o medo do amanhã te sufoca, fique aqui. Deus tem uma palavra pra você esta noite.
Feche os olhos, se puder. Respire fundo. E deixe a palavra de Deus acalmar a tempestade dentro de você.`,
  },
  {
    id: 'marcos', name: 'Marcos 4:39', durationSec: 540,
    slideType: 'verse', verseRef: 'Marcos 4:39',
    slideText: 'Levantando-se, repreendeu o vento e disse ao mar: Acalma-te, emudece! O vento cessou e fez-se grande bonança.',
    narration: `O primeiro versículo desta noite vem do evangelho de Marcos, capítulo quatro, versículo trinta e nove.
Levantando-se, repreendeu o vento e disse ao mar: Acalma-te, emudece! O vento cessou e fez-se grande bonança.
Marcos, capítulo quatro, versículo trinta e nove.`,
    reflection: `Imagine a cena.
Os discípulos estavam num barco, no meio do mar, quando uma tempestade violenta caiu sobre eles.
As ondas batiam. O barco enchia de água. Eles tinham certeza de que iam morrer.
E Jesus? Jesus estava dormindo.
Eles o acordaram, desesperados: Mestre! Não te importas que estamos morrendo?
E Jesus simplesmente levantou, olhou para a tempestade, e disse apenas três palavras:
Acalma-te. Emudece.
E o mar obedeceu. O vento parou. Silêncio absoluto.
O que isso significa pra você?
A tempestade na sua vida, a ansiedade, o medo, a preocupação, a dívida, a doença,
Jesus está dizendo agora mesmo: Acalma-te. Emudece.
Não é sobre a tempestade ter poder sobre você.
É sobre você ter Jesus no seu barco.
E se Jesus está no barco, o barco não afunda.`,
  },
  {
    id: 'filipenses', name: 'Filipenses 4:6-7', durationSec: 540,
    slideType: 'verse', verseRef: 'Filipenses 4:6-7',
    slideText: 'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo o entendimento, guardará o coração de vocês.',
    narration: `O segundo versículo vem da carta de Paulo aos Filipenses, capítulo quatro, versículos seis e sete.
Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, com ação de graças, apresentem seus pedidos a Deus.
E a paz de Deus, que excede todo o entendimento, guardará o coração e a mente de vocês em Cristo Jesus.`,
    reflection: `Você sabia que Paulo escreveu essas palavras de dentro de uma prisão?
Ele estava acorrentado. Sem saber se viveria ou morreria.
E de dentro da cadeia, ele escreveu: Não andem ansiosos por coisa alguma.
Como alguém preso consegue dizer isso?
Porque ele descobriu um segredo.
A paz de Deus não depende da sua situação.
A paz de Deus depende da presença de Deus.
Você pode estar na pior fase da sua vida e ainda assim ter paz.
Porque a paz que Deus dá excede todo entendimento.
É uma paz que o mundo não consegue explicar.
Se você está ouvindo isso agora, feche os olhos e entregue tudo que te preocupa nas mãos de Deus.`,
  },
  {
    id: 'isaias', name: 'Isaías 41:10', durationSec: 540,
    slideType: 'verse', verseRef: 'Isaías 41:10',
    slideText: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus. Eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel.',
    narration: `O terceiro versículo vem do livro de Isaías, capítulo quarenta e um, versículo dez.
Não temas, porque eu sou contigo. Não te assombres, porque eu sou o teu Deus.
Eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel.`,
    reflection: `Deus olha nos seus olhos agora e diz:
Não tenha medo.
Não é não tenha medo porque vai dar tudo certo.
É: Não tenha medo, porque EU estou com você.
Você pode não saber o que vai acontecer amanhã.
Mas sabe quem vai estar com você amanhã? Deus.
E se Deus está com você, de quem você vai ter medo?
Eu te fortaleço. Eu te ajudo. Eu te sustento com a minha mão.
Essa é a promessa de Deus para a sua vida. Hoje. Amanhã. Sempre.`,
  },
  {
    id: 'meditacao', name: 'Meditação Guiada', durationSec: 480,
    slideType: 'ambient', slideText: '',
    narration: `Agora, respire fundo.
Inspire, e solte o ar devagar.
Imagine que cada preocupação que você carrega está sendo retirada dos seus ombros.
O medo do amanhã, entregue.
A ansiedade, entregue.
A preocupação com dinheiro, entregue.
A dor que ninguém vê, entregue.
Deus está dizendo pra você:
Descansa. Eu estou no controle.
Você não precisa resolver tudo sozinho.
Você não precisa carregar esse peso.
Eu sou o teu Deus. Eu te sustento.`,
  },
  {
    id: 'oracao', name: 'Oração Coletiva', durationSec: 600,
    slideType: 'cross', slideText: '',
    narration: `Senhor Deus,
Eu venho diante do teu trono nesta noite, em nome de cada pessoa que está ouvindo agora.
Tu conheces cada um pelo nome. Tu sabes o que está tirando o sono deles. Tu sabes a dor que eles carregam em silêncio.
Eu peço agora: acalma a tempestade.
Assim como tu acalmaste o mar da Galileia, acalma o coração ansioso. Acalma a mente que não para. Acalma o medo do amanhã.
Em nome de Jesus: todo medo, sai agora. Toda ansiedade, sai agora. Todo desespero, sai agora.
Declaro paz sobre essa vida. Paz sobre essa casa. Paz sobre essa família.
A paz que excede todo entendimento. A paz que o mundo não pode dar e não pode tirar.
Porque tu és Deus. E tu estás conosco.
Obrigado, Senhor. Obrigado por cada pessoa aqui.
Em nome de Jesus. Amém.`,
  },
  {
    id: 'extras', name: 'Versículos Extras', durationSec: 420,
    slideType: 'verse_sequence',
    verses: [
      { ref: 'Salmos 23:4', text: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo.' },
      { ref: 'Mateus 11:28', text: 'Venham a mim todos os que estão cansados e sobrecarregados, e eu lhes darei descanso.' },
      { ref: 'Salmos 46:10', text: 'Aquietem-se e saibam que eu sou Deus.' },
      { ref: 'Jeremias 29:11', text: 'Pois eu sei os planos que tenho para vocês, planos de fazê-los prosperar e não de causar dano.' },
    ],
  },
  {
    id: 'encerramento', name: 'Encerramento', durationSec: 300,
    slideType: 'title', slideText: 'Obrigado por estar aqui', slideSubtext: '@luz.da.palavra.oficial\nToda quinta, 20h\nSiga para mais ✝️',
    narration: `Obrigado por estar aqui esta noite.
Se essa oração tocou o seu coração, compartilhe com alguém que precisa ouvir isso.
Siga @luz.da.palavra.oficial para receber um versículo novo todos os dias.
Toda quinta-feira às vinte horas, tem Oração Poderosa aqui.
Lembre-se sempre: Não temas, porque eu sou contigo.
Boa noite. Deus abençoe o seu sono.`,
  },
];

// ═══════════════════════════════════════════
//  TTS — Download narration as MP3
// ═══════════════════════════════════════════

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(dest); });
    }).on('error', (e) => { fs.unlinkSync(dest); reject(e); });
  });
}

async function generateTTS(text, outputPath) {
  if (fs.existsSync(outputPath)) {
    console.log(`   🗣️ TTS exists: ${path.basename(outputPath)}`);
    return outputPath;
  }

  // Google TTS has a ~200 char limit per request, split into sentences
  const sentences = text.replace(/\n/g, '. ').split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const chunks = [];
  let current = '';

  for (const s of sentences) {
    if ((current + ' ' + s).length > 180 && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = current ? current + ' ' + s : s;
    }
  }
  if (current) chunks.push(current.trim());

  // Download each chunk
  const chunkFiles = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkPath = outputPath.replace('.mp3', `_chunk${i}.mp3`);
    if (!fs.existsSync(chunkPath)) {
      const url = googleTTS.getAudioUrl(chunks[i], { lang: 'pt-BR', slow: false });
      await downloadFile(url, chunkPath);
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }
    chunkFiles.push(chunkPath);
  }

  // Concatenate chunks with FFmpeg + add 0.8s silence between
  if (chunkFiles.length === 1) {
    fs.copyFileSync(chunkFiles[0], outputPath);
  } else {
    const listFile = outputPath.replace('.mp3', '_list.txt');
    const silencePath = path.join(AUDIO_DIR, 'silence_800ms.mp3');

    // Generate silence file if needed
    if (!fs.existsSync(silencePath)) {
      execFileSync(ffmpegPath, ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', '0.8', '-q:a', '9', silencePath], { stdio: 'pipe' });
    }

    const lines = [];
    chunkFiles.forEach((f, i) => {
      lines.push(`file '${f.replace(/\\/g, '/')}'`);
      if (i < chunkFiles.length - 1) lines.push(`file '${silencePath.replace(/\\/g, '/')}'`);
    });
    fs.writeFileSync(listFile, lines.join('\n'));

    execFileSync(ffmpegPath, ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', outputPath], { stdio: 'pipe' });
    fs.unlinkSync(listFile);
  }

  // Cleanup chunk files
  chunkFiles.forEach(f => { try { fs.unlinkSync(f); } catch(e) {} });

  console.log(`   🗣️ ✅ TTS: ${path.basename(outputPath)} (${chunks.length} chunks)`);
  return outputPath;
}

// ═══════════════════════════════════════════
//  SLIDE IMAGE GENERATOR — Cinematic slides
// ═══════════════════════════════════════════

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = []; let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars && current) {
      lines.push(current.trim()); current = word;
    } else { current = current ? current + ' ' + word : word; }
  }
  if (current) lines.push(current.trim());
  return lines;
}

async function generateSlide(block, outputPath) {
  if (fs.existsSync(outputPath)) {
    console.log(`   🎨 Slide exists: ${path.basename(outputPath)}`);
    return outputPath;
  }

  const W = 1080, H = 1920;
  const accent = [212, 168, 83]; // gold

  // Try to use a hero background
  const heroFiles = fs.existsSync(HEROES_DIR) ? fs.readdirSync(HEROES_DIR).filter(f => /\.(jpg|png)$/i.test(f)) : [];
  const heroFile = heroFiles.length > 0 ? heroFiles[Math.floor(Math.random() * heroFiles.length)] : null;

  let bgBuffer;
  if (heroFile) {
    bgBuffer = await sharp(path.join(HEROES_DIR, heroFile)).resize(W, H, { fit: 'cover' }).png().toBuffer();
  } else {
    bgBuffer = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 8, g: 6, b: 18, alpha: 1 } } }).png().toBuffer();
  }

  const { PassThrough } = require('stream');
  const readable = new PassThrough();
  readable.end(bgBuffer);
  const bgImg = await PImage.decodePNGFromStream(readable);
  bgBuffer = null;

  const img = PImage.make(W, H);
  const ctx = img.getContext('2d');
  ctx.drawImage(bgImg, 0, 0, W, H, 0, 0, W, H);

  // Dark overlay for readability
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1.0;

  // Vignette edges
  for (let row = 0; row < 350; row++) {
    ctx.globalAlpha = 0.5 * (1 - row / 350);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, row, W, 1);
    ctx.fillRect(0, H - row, W, 1);
  }
  ctx.globalAlpha = 1.0;

  const text = block.slideText || '';
  if (text) {
    const len = text.length;
    const fontSize = len > 150 ? 38 : len > 100 ? 44 : len > 70 ? 52 : len > 40 ? 62 : 72;
    const maxChars = len > 150 ? 28 : len > 100 ? 24 : len > 70 ? 20 : len > 40 ? 16 : 13;
    const lines = wrapText(text, maxChars);
    const lineH = fontSize * 1.55;
    const totalH = lines.length * lineH;
    const startY = (H / 2) - (totalH / 2) + 30;

    ctx.font = `${fontSize}pt DejaVuSerif`;
    ctx.textAlign = 'center';

    for (let i = 0; i < lines.length; i++) {
      const y = startY + (i * lineH);
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      for (let ox = -5; ox <= 5; ox += 2) {
        for (let oy = -5; oy <= 5; oy += 2) {
          ctx.fillText(lines[i], W / 2 + ox, y + oy);
        }
      }
      // White text
      ctx.fillStyle = 'white';
      ctx.fillText(lines[i], W / 2, y);
    }

    // Verse reference
    if (block.verseRef) {
      const refY = startY + totalH + 60;
      ctx.font = `${Math.round(fontSize * 0.45)}pt DejaVuBold`;
      ctx.fillStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
      ctx.fillText(block.verseRef, W / 2, refY);
    }
  }

  // Cross icon at top
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
  ctx.lineWidth = 3;
  const crossY = 280;
  ctx.beginPath(); ctx.moveTo(W/2, crossY-30); ctx.lineTo(W/2, crossY+30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W/2-20, crossY-8); ctx.lineTo(W/2+20, crossY-8); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Watermark
  ctx.font = '18pt DejaVuRegular';
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('@luz.da.palavra.oficial', W / 2, H - 80);
  ctx.globalAlpha = 1.0;

  await PImage.encodePNGToStream(img, fs.createWriteStream(outputPath));
  console.log(`   🎨 ✅ Slide: ${path.basename(outputPath)}`);
  return outputPath;
}

// ═══════════════════════════════════════════
//  FFMPEG — Assemble final 60min video
// ═══════════════════════════════════════════

function assembleBlock(slidePath, narrationPath, durationSec, outputPath) {
  if (fs.existsSync(outputPath)) {
    console.log(`   🎬 Block exists: ${path.basename(outputPath)}`);
    return outputPath;
  }

  // Create video from still image with slow zoom + narration
  const args = [
    '-y',
    '-loop', '1', '-i', slidePath,               // background image
    '-i', narrationPath,                           // narration audio
    '-vf', `zoompan=z='1.0+on*0.000005':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${durationSec * 30}:s=1080x1920:fps=30,fade=t=in:st=0:d=3,fade=t=out:st=${durationSec - 3}:d=3`,
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
    '-c:a', 'aac', '-b:a', '128k',
    '-t', String(durationSec),
    '-pix_fmt', 'yuv420p',
    '-shortest',
    outputPath,
  ];

  console.log(`   🎬 Assembling block (${durationSec}s)...`);
  execFileSync(ffmpegPath, args, { stdio: 'pipe', timeout: 300000 });
  console.log(`   🎬 ✅ Block: ${path.basename(outputPath)}`);
  return outputPath;
}

// ═══════════════════════════════════════════
//  MAIN PIPELINE
// ═══════════════════════════════════════════

async function generateLiveVideo() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  🙏 LIVE VIDEO GENERATOR — Oração Poderosa  ║');
  console.log('║  100% AI · Zero Human · Full Automation   ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const blockVideos = [];

  for (const block of BLOCKS) {
    console.log(`\n━━━ BLOCO: ${block.name} (${block.durationSec}s) ━━━`);

    // 1) Generate TTS narration
    let narrationPath;
    const fullText = [block.narration, block.reflection].filter(Boolean).join('\n\n');

    if (block.slideType === 'verse_sequence') {
      // For verse sequence, generate TTS for each verse
      const verseTexts = block.verses.map(v => `${v.ref}. ${v.text}`).join('\n\n');
      narrationPath = path.join(AUDIO_DIR, `narr_${block.id}.mp3`);
      await generateTTS(verseTexts, narrationPath);
    } else if (fullText) {
      narrationPath = path.join(AUDIO_DIR, `narr_${block.id}.mp3`);
      await generateTTS(fullText, narrationPath);
    } else {
      // Generate silence for ambient blocks
      narrationPath = path.join(AUDIO_DIR, `narr_${block.id}.mp3`);
      if (!fs.existsSync(narrationPath)) {
        execFileSync(ffmpegPath, ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', String(block.durationSec), '-q:a', '9', narrationPath], { stdio: 'pipe' });
      }
    }

    // 2) Generate slide image
    let slidePath;
    if (block.slideType === 'verse_sequence') {
      // Use first verse as main slide
      const firstVerse = block.verses[0];
      slidePath = path.join(SLIDES_DIR, `slide_${block.id}.png`);
      await generateSlide({ ...block, slideText: firstVerse.text, verseRef: firstVerse.ref }, slidePath);
    } else {
      slidePath = path.join(SLIDES_DIR, `slide_${block.id}.png`);
      await generateSlide(block, slidePath);
    }

    // 3) Assemble block video
    const blockVideo = path.join(OUTPUT_DIR, `block_${block.id}.mp4`);
    assembleBlock(slidePath, narrationPath, block.durationSec, blockVideo);
    blockVideos.push(blockVideo);
  }

  // 4) Concatenate all blocks into final 60min video
  console.log('\n━━━ FINAL ASSEMBLY ━━━');
  const finalOutput = path.join(OUTPUT_DIR, 'live_oracao_poderosa_001.mp4');

  if (fs.existsSync(finalOutput)) {
    console.log(`✅ Final video already exists: ${finalOutput}`);
    return finalOutput;
  }

  const concatList = path.join(OUTPUT_DIR, 'concat_list.txt');
  const lines = blockVideos.map(f => `file '${f.replace(/\\/g, '/')}'`);
  fs.writeFileSync(concatList, lines.join('\n'));

  console.log('🎬 Concatenating all blocks...');
  execFileSync(ffmpegPath, [
    '-y', '-f', 'concat', '-safe', '0', '-i', concatList,
    '-c', 'copy', finalOutput,
  ], { stdio: 'pipe', timeout: 600000 });

  fs.unlinkSync(concatList);

  const stats = fs.statSync(finalOutput);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);

  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  ✅ LIVE VIDEO READY!                     ║`);
  console.log(`║  📁 ${finalOutput}`);
  console.log(`║  📊 ${sizeMB} MB`);
  console.log(`║  ⏱️  ~60 minutes`);
  console.log(`║                                          ║`);
  console.log(`║  Next: Open OBS → Add Media Source →     ║`);
  console.log(`║  Stream to TikTok LIVE at 20:00 BRT      ║`);
  console.log(`╚══════════════════════════════════════════╝`);

  return finalOutput;
}

// Run if called directly
if (require.main === module) {
  generateLiveVideo().catch(err => {
    console.error('❌ LIVE generation failed:', err);
    process.exit(1);
  });
}

module.exports = { generateLiveVideo };
