/**
 * FéTok Dashboard — Web UI for monitoring
 * Shows schedule, history, stats, and video previews
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const { getAllVerses, getStats } = require('./verses');
const { buildCaption } = require('./captionBuilder');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const PORT = process.env.PORT || 3000;

function startDashboard() {
  const app = express();

  // Serve generated videos and AI videos
  app.use('/videos', express.static(OUTPUT_DIR));
  app.use('/videos/hq', express.static(path.join(OUTPUT_DIR, 'videos')));
  app.use('/videos/images', express.static(path.join(OUTPUT_DIR, 'ai_images')));

  // API: Stats
  app.get('/api/stats', (req, res) => {
    const stats = getStats();
    const historyFile = path.join(OUTPUT_DIR, 'history.json');
    let history = [];
    if (fs.existsSync(historyFile)) {
      try { history = JSON.parse(fs.readFileSync(historyFile, 'utf8')); } catch(e) {}
    }
    res.json({ ...stats, postsToday: history.filter(h => h.timestamp?.startsWith(new Date().toISOString().split('T')[0])).length, totalPosts: history.length });
  });

  // API: History
  app.get('/api/history', (req, res) => {
    const historyFile = path.join(OUTPUT_DIR, 'history.json');
    if (fs.existsSync(historyFile)) {
      res.json(JSON.parse(fs.readFileSync(historyFile, 'utf8')));
    } else {
      res.json([]);
    }
  });

  // API: Schedule
  app.get('/api/schedule', (req, res) => {
    const scheduleFile = path.join(OUTPUT_DIR, 'schedule.json');
    if (fs.existsSync(scheduleFile)) {
      res.json(JSON.parse(fs.readFileSync(scheduleFile, 'utf8')));
    } else {
      res.json([]);
    }
  });

  // API: Verses
  app.get('/api/verses', (req, res) => {
    res.json(getAllVerses());
  });

  // API: Generate post now (manual trigger)
  app.post('/api/generate/:slot', async (req, res) => {
    const slot = req.params.slot;
    if (!['morning', 'afternoon', 'evening'].includes(slot)) {
      return res.status(400).json({ error: 'Invalid slot. Use: morning, afternoon, evening' });
    }
    try {
      const { createPost } = require('./index');
      const result = await createPost(slot);
      res.json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Serve the guide markdown
  app.get('/api/guide', (req, res) => {
    const guidePath = path.resolve(__dirname, '../guia_21_posts.md');
    if (fs.existsSync(guidePath)) {
      res.type('text/markdown').send(fs.readFileSync(guidePath, 'utf8'));
    } else {
      res.status(404).send('Guide not found');
    }
  });

  // GUIDE PAGE — 21 Posts with copy-to-clipboard
  app.get('/guide', (req, res) => {
    const posts = [
      { day:1, slot:'06:00', emoji:'☀️', ref:'Salmos 91:1', video:'verse_salmos_91.mp4', music:'Isaias Saad → Bondade de Deus', caption:'Aquele que habita no abrigo do Altíssimo descansará à sombra do Todo-Poderoso. 🛡️✝️\\nSalmos 91:1\\n\\nVocê está debaixo da proteção de Deus AGORA. 🙏\\nDeixe um ❤️ se você crê nessa promessa!\\nSalve esse vídeo. Você vai precisar dele. 🔖\\n\\n#versiculododia #biblia #fe #jesus #deus #salmos91 #proteção #deuscuida #fetok #fyp #viral #foryou #gospel #cristao #palavradedeus' },
      { day:1, slot:'12:00', emoji:'🌤️', ref:'Salmos 27:1', video:'verse_salmos_27.mp4', music:'Gabriela Rocha → Lugar Secreto', caption:'O Senhor é a minha luz e a minha salvação; de quem terei medo? 💡✝️\\nSalmos 27:1\\n\\nNINGUÉM pode te derrubar quando Deus está ao seu lado! 🔥\\nComenta AMÉM se você não tem medo porque Deus está contigo! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #salmos #luz #salvação #naotemas #fetok #fyp #viral #gospel #cristao #deusefiel' },
      { day:1, slot:'20:00', emoji:'🌙', ref:'Salmos 46:1', video:'verse_salmos_46.mp4', music:'Fernandinho → Grandes Coisas', caption:'Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia. 🏰✝️\\nSalmos 46:1\\n\\nSe você está passando por uma tempestade, PARE e leia isso de novo. 🙏\\nDeus é sua FORTALEZA. Nunca esqueça disso. ❤️\\nCompartilhe com alguém que precisa ouvir isso HOJE!\\n\\n#versiculododia #biblia #fe #jesus #deus #refúgio #fortaleza #angustia #fetok #fyp #viral #gospel #cristao #salmos' },
      { day:2, slot:'06:00', emoji:'☀️', ref:'Salmos 145:18', video:'verse_salmos_145.mp4', music:'Aline Barros → Ressuscita-me', caption:'O Senhor está perto de todos os que o invocam. 🙏✝️\\nSalmos 145:18\\n\\nDeus NUNCA te abandonou. Ele está mais perto do que você imagina. 💛\\nSe você precisa de Deus nesse momento, comenta 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #oração #perto #fetok #fyp #viral #gospel #cristao #devocional' },
      { day:2, slot:'12:00', emoji:'🌤️', ref:'Isaías 41:10', video:'verse_isaias_41.mp4', music:'Isaias Saad → Me Atraiu', caption:'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus. 💪✝️\\nIsaías 41:10\\n\\nIsso não foi coincidência. Deus te trouxe até esse vídeo AGORA. ✨\\nVocê NÃO está sozinho nessa luta! 🔥\\nComenta AMÉM e salva esse vídeo! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #naotemas #coragem #isaias #fetok #fyp #viral #gospel #cristao #fortaleza' },
      { day:2, slot:'20:00', emoji:'🌙', ref:'Josué 1:9', video:'verse_josue_1.mp4', music:'Anderson Freire → Primeira Essência', caption:'Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor está com você. ⚔️✝️\\nJosué 1:9\\n\\nGuerreiro de Deus, LEVANTE A CABEÇA! 👑\\nA batalha é do Senhor e a vitória já é SUA! 🔥\\nMarque alguém que precisa de CORAGEM hoje! ❤️\\n\\n#versiculododia #biblia #fe #jesus #deus #coragem #guerreiro #josue #fetok #fyp #viral #gospel #cristao #vitoria' },
      { day:3, slot:'06:00', emoji:'☀️', ref:'Isaías 43:2', video:'verse_isaias_43.mp4', music:'Gabriela Rocha → Eu Navegarei', caption:'Quando passares pelas águas, estarei contigo. 🌊✝️\\nIsaías 43:2\\n\\nNas águas mais profundas, Deus SEGURA sua mão. 🤝\\nVocê pode estar na tempestade, mas NÃO vai se afogar! 🙏\\nDeixe um 💙 se Deus já te salvou!\\n\\n#versiculododia #biblia #fe #jesus #deus #tempestade #águas #isaias #fetok #fyp #viral #gospel #cristao #proteção' },
      { day:3, slot:'12:00', emoji:'🌤️', ref:'Salmos 46:7', video:'verse_salmos_46_7.mp4', music:'Fernandinho → Eu Vou Abrir o Mar', caption:'O Senhor dos Exércitos está conosco; o Deus de Jacó é o nosso refúgio. 🏰✝️\\nSalmos 46:7\\n\\nO DEUS DOS EXÉRCITOS luta por VOCÊ! ⚔️\\nNenhum inimigo prevalecerá! 🔥\\nComenta "DEUS É FIEL" se você crê nisso! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #exercitos #refúgio #salmos #fetok #fyp #viral #gospel #cristao #batalha' },
      { day:3, slot:'20:00', emoji:'🌙', ref:'1 Coríntios 13:4', video:'verse_1cor_13.mp4', music:'Preto no Branco → Ninguém Explica Deus', caption:'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. 💕✝️\\n1 Coríntios 13:4\\n\\nO verdadeiro amor vem de DEUS. ❤️\\nMarque a pessoa que você AMA! 💛🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #amor #corintios #fetok #fyp #viral #gospel #cristao #amordedeus' },
      { day:4, slot:'06:00', emoji:'☀️', ref:'Jeremias 29:11', video:'verse_jeremias_29.mp4', music:'Aline Barros → Sonda-me', caption:'Eu sei os planos que tenho para vocês. Planos de fazê-los prosperar e não de lhes causar dano. 🌅✝️\\nJeremias 29:11\\n\\nDeus tem um PLANO para sua vida! Confie no processo! ✨\\nComenta "EU CONFIO" se você entrega seus planos a Deus! ❤️\\n\\n#versiculododia #biblia #fe #jesus #deus #planos #jeremias #fetok #fyp #viral #gospel #cristao' },
      { day:4, slot:'12:00', emoji:'🌤️', ref:'Romanos 5:8', video:'verse_romanos_5.mp4', music:'Isaias Saad → Bondade de Deus', caption:'Mas Deus prova o seu próprio amor para conosco, pelo fato de ter Cristo morrido por nós. ✝️❤️\\nRomanos 5:8\\n\\nEle MORREU por você. Enquanto você ainda era pecador. 😭\\nNão existe amor MAIOR que esse! 🙏\\nDeixe ❤️ e compartilhe!\\n\\n#versiculododia #biblia #fe #jesus #deus #amor #cruz #romanos #fetok #fyp #viral #gospel #cristao #calvario' },
      { day:4, slot:'20:00', emoji:'🌙', ref:'Isaías 54:10', video:'verse_isaias_54.mp4', music:'Gabriela Rocha → Deus Provará', caption:'Porque as montanhas se retirarão, mas a minha graça não se apartará de ti. 🏔️✝️\\nIsaías 54:10\\n\\nAs MONTANHAS vão cair. Mas o amor de Deus? JAMAIS. 💛\\nSalve esse vídeo e assista quando precisar de força! 🔖\\n\\n#versiculododia #biblia #fe #jesus #deus #graça #montanhas #isaias #fetok #fyp #viral #gospel #cristao #promessa' },
      { day:5, slot:'06:00', emoji:'☀️', ref:'Filipenses 4:13', video:'verse_filipenses_4.mp4', music:'Anderson Freire → Raridade', caption:'Tudo posso naquele que me fortalece. 💪✝️\\nFilipenses 4:13\\n\\nTUDO. Não é "algumas coisas". É TUDO! 🔥\\nCom Deus, não existe limite pra você! ⚡\\nComenta AMÉM se você crê! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #tudoposso #força #filipenses #fetok #fyp #viral #gospel #cristao #guerreiro' },
      { day:5, slot:'12:00', emoji:'🌤️', ref:'Isaías 40:31', video:'verse_isaias_40.mp4', music:'Fernandinho → Faz Chover', caption:'Os que esperam no Senhor renovam as suas forças; sobem com asas como águias. 🦅✝️\\nIsaías 40:31\\n\\nVocê tá cansado? ESPERE no Senhor! 🙏\\nEle vai te fazer VOAR como águia! ⚡\\nMarque alguém que precisa renovar as forças! ❤️\\n\\n#versiculododia #biblia #fe #jesus #deus #águia #renovar #isaias #fetok #fyp #viral #gospel #cristao' },
      { day:5, slot:'20:00', emoji:'🌙', ref:'Êxodo 15:2', video:'verse_isaias_54.mp4', music:'Soraya Moraes → Quão Grande É', caption:'O Senhor é a minha força e o meu cântico; ele é a minha salvação. 🎵✝️\\nÊxodo 15:2\\n\\nDeus é sua FORÇA quando você está fraco! 💪\\nComenta 🎵 se Deus é a sua música! 🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #força #salvação #exodo #fetok #fyp #viral #gospel #cristao #louvor' },
      { day:6, slot:'06:00', emoji:'☀️', ref:'Romanos 8:28', video:'verse_romanos_8.mp4', music:'Aline Barros → Consagração', caption:'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus. 🌈✝️\\nRomanos 8:28\\n\\nTUDO coopera pro seu bem. Até aquilo que parece ruim AGORA. ✨\\nDeixe ❤️ se você confia que Deus está trabalhando!\\n\\n#versiculododia #biblia #fe #jesus #deus #romanos #propósito #fetok #fyp #viral #gospel #cristao #confiança' },
      { day:6, slot:'12:00', emoji:'🌤️', ref:'Efésios 6:10', video:'verse_efesios_6.mp4', music:'Anderson Freire → Identidade', caption:'Fortalecei-vos no Senhor e na força do seu poder. ⚔️✝️\\nEfésios 6:10\\n\\nVista a ARMADURA de Deus! 🛡️\\nComenta "SOU GUERREIRO DE DEUS" se você está pronto! ⚔️🙏\\n\\n#versiculododia #biblia #fe #jesus #deus #armadura #guerreiro #efesios #fetok #fyp #viral #gospel #cristao #vitoria' },
      { day:6, slot:'20:00', emoji:'🌙', ref:'Hebreus 11:1', video:'verse_hebreus_11.mp4', music:'Isaias Saad → Me Atraiu', caption:'Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos. 🙏✝️\\nHebreus 11:1\\n\\nVocê não precisa VER pra CRER. Isso é FÉ! 🔥\\nComenta "EU CREIO" se você anda por fé! ❤️\\n\\n#versiculododia #biblia #fe #jesus #deus #hebreus #certeza #crer #fetok #fyp #viral #gospel #cristao #confiança' },
      { day:7, slot:'06:00', emoji:'☀️', ref:'Provérbios 3:5', video:'verse_proverbios_3.mp4', music:'Gabriela Rocha → Deus Provará', caption:'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento. 📖✝️\\nProvérbios 3:5\\n\\nPare de tentar ENTENDER tudo. Apenas CONFIE! 🙏\\nComenta "EU CONFIO" se você entrega tudo a Deus! ❤️\\n\\n#versiculododia #biblia #fe #jesus #deus #confiança #proverbios #fetok #fyp #viral #gospel #cristao #entrega' },
      { day:7, slot:'12:00', emoji:'🌤️', ref:'Salmos 37:5', video:'verse_salmos_37.mp4', music:'Preto no Branco → Me Deixa Aqui', caption:'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará. 🫒✝️\\nSalmos 37:5\\n\\nENTREGUE. CONFIE. E DESCANSE. Deus vai fazer! 🙏\\nCompartilhe com quem está carregando um fardo pesado! ❤️\\n\\n#versiculododia #biblia #fe #jesus #deus #entrega #caminho #salmos #fetok #fyp #viral #gospel #cristao #descanso' },
      { day:7, slot:'20:00', emoji:'🌙', ref:'2 Coríntios 5:7', video:'verse_2cor_5.mp4', music:'Isaias Saad → Bondade de Deus', caption:'Porque andamos por fé e não por vista. 🌫️✝️\\n2 Coríntios 5:7\\n\\nVocê não precisa ver o CAMINHO inteiro. Só o PRÓXIMO PASSO. 🚶‍♂️\\nComenta "FÉ" se você caminha confiando em Deus! 🙏❤️\\nSIGA para mais versículos diários! 🔔\\n\\n#versiculododia #biblia #fe #jesus #deus #fé #corintios #fetok #fyp #viral #gospel #cristao #jornada' },
    ];

    const postCards = posts.map((p, i) => `
      <div class="post-card" id="post-${i}">
        <div class="post-header">
          <span class="post-day">Dia ${p.day}</span>
          <span class="post-time">${p.emoji} ${p.slot}</span>
        </div>
        <div class="post-ref">${p.ref}</div>
        <div class="post-media">
          <video controls muted playsinline preload="metadata" poster="/videos/images/${p.video.replace('.mp4','')}_preview.png"><source src="/videos/hq/${p.video}" type="video/mp4"></video>
        </div>
        <div class="post-music">🎵 ${p.music}</div>
        <pre class="post-caption" id="caption-${i}">${p.caption.replace(/\\n/g, '\n')}</pre>
        <div class="btn-row">
          <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('caption-${i}').textContent).then(()=>this.textContent='✅ Copiado!')">📋 Copiar Legenda</button>
          <a class="download-btn" href="/videos/hq/${p.video}" download>⬇️ Baixar Vídeo</a>
        </div>
      </div>
    `).join('');

    res.send(`<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>FéTok — 21 Posts Guide</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,sans-serif;background:#0a0a0f;color:#fff;min-height:100vh}
.container{max-width:800px;margin:0 auto;padding:24px}
h1{font-size:1.6rem;margin-bottom:4px}
h1 span{background:linear-gradient(135deg,#d4a853,#f0d78c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{color:rgba(255,255,255,0.4);font-size:0.8rem;margin-bottom:24px}
.post-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px;margin-bottom:16px}
.post-header{display:flex;justify-content:space-between;margin-bottom:8px}
.post-day{font-size:0.7rem;font-weight:700;color:#d4a853;text-transform:uppercase;letter-spacing:0.05em}
.post-time{font-size:0.8rem;font-weight:600}
.post-ref{font-size:1.1rem;font-weight:800;margin-bottom:8px}
.post-media{margin-bottom:12px;border-radius:12px;overflow:hidden;max-width:280px}
.post-media video{width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:12px;background:#111}
.post-music{font-size:0.8rem;color:#d4a853;margin-bottom:8px;padding:6px 10px;background:rgba(212,168,83,0.08);border:1px solid rgba(212,168,83,0.2);border-radius:8px;display:inline-block}
.post-caption{font-family:inherit;font-size:0.78rem;color:rgba(255,255,255,0.7);background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:12px;white-space:pre-wrap;word-wrap:break-word;line-height:1.5;margin-bottom:10px}
.btn-row{display:flex;gap:8px;flex-wrap:wrap}
.copy-btn{display:inline-flex;align-items:center;gap:4px;padding:8px 16px;background:#d4a853;color:#000;border:none;border-radius:8px;font-weight:700;font-size:0.78rem;cursor:pointer;transition:all 0.2s}
.copy-btn:hover{opacity:0.85;transform:scale(1.02)}
.download-btn{display:inline-flex;align-items:center;gap:4px;padding:8px 16px;background:rgba(255,255,255,0.08);color:#fff;border-radius:8px;font-weight:600;font-size:0.78rem;text-decoration:none;transition:all 0.2s}
.download-btn:hover{background:rgba(255,255,255,0.15)}
.back{display:inline-flex;padding:6px 14px;background:rgba(255,255,255,0.06);color:#fff;border-radius:8px;font-size:0.75rem;text-decoration:none;margin-bottom:16px}
</style></head><body><div class="container">
<a href="/" class="back">← Dashboard</a>
<h1>Fe<span>Tok</span> — 21 Posts Prontos ✝️</h1>
<p class="sub">Clique "Copiar Legenda" e cole no TikTok Studio • 7 dias × 3 posts/dia</p>
${postCards}
<p style="text-align:center;color:rgba(255,255,255,0.2);font-size:0.65rem;margin-top:24px">FéTok Auto-Poster v1.0 · Pasta: fetok-autoposter/output/videos/</p>
</div></body></html>`);
  });

  // Dashboard HTML
  app.get('/', (req, res) => {
    const stats = getStats();
    const historyFile = path.join(OUTPUT_DIR, 'history.json');
    let history = [];
    if (fs.existsSync(historyFile)) {
      try { history = JSON.parse(fs.readFileSync(historyFile, 'utf8')); } catch(e) {}
    }

    // List available videos
    const videos = fs.existsSync(OUTPUT_DIR) 
      ? fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp4')).sort()
      : [];

    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FéTok Dashboard</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',-apple-system,sans-serif; background:#0a0a0f; color:#fff; min-height:100vh; }
    .container { max-width:1200px; margin:0 auto; padding:24px; }
    h1 { font-size:1.8rem; margin-bottom:8px; }
    h1 span { background:linear-gradient(135deg,#d4a853,#f0d78c); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .subtitle { color:rgba(255,255,255,0.5); margin-bottom:32px; font-size:0.85rem; }
    .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
    .stat-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:20px; text-align:center; }
    .stat-value { font-size:2rem; font-weight:800; color:#d4a853; }
    .stat-label { font-size:0.7rem; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.05em; margin-top:4px; }
    .section { margin-bottom:32px; }
    .section-title { font-size:0.75rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px; }
    .schedule-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
    .time-slot { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; }
    .time-slot h3 { font-size:0.9rem; color:#d4a853; margin-bottom:4px; }
    .time-slot p { font-size:0.75rem; color:rgba(255,255,255,0.5); }
    .history-item { display:flex; align-items:center; gap:12px; padding:12px 16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; margin-bottom:8px; }
    .history-dot { width:8px; height:8px; border-radius:50%; background:#34c759; flex-shrink:0; }
    .history-dot.manual { background:#ff9500; }
    .history-info { flex:1; }
    .history-verse { font-size:0.85rem; font-weight:600; }
    .history-time { font-size:0.7rem; color:rgba(255,255,255,0.4); }
    .video-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }
    .video-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; overflow:hidden; }
    .video-card video { width:100%; aspect-ratio:9/16; object-fit:cover; }
    .video-card .name { padding:8px 12px; font-size:0.7rem; color:rgba(255,255,255,0.5); }
    .btn { display:inline-flex; padding:8px 16px; background:#d4a853; color:#000; border:none; border-radius:8px; font-weight:700; font-size:0.8rem; cursor:pointer; text-decoration:none; }
    .btn:hover { opacity:0.9; }
    .cron-status { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:rgba(52,199,89,0.15); border:1px solid rgba(52,199,89,0.3); border-radius:8px; font-size:0.7rem; color:#34c759; }
    .cron-status::before { content:''; width:6px; height:6px; border-radius:50%; background:#34c759; animation:pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  </style>
</head>
<body>
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <h1>Fe<span>Tok</span> Dashboard ✝️</h1>
      <span class="cron-status">CRON ATIVO — 3x/dia</span>
    </div>
    <p class="subtitle">@luz.da.palavra.oficial · Auto-poster pipeline · ${new Date().toLocaleDateString('pt-BR')}</p>

    <div class="stats">
      <div class="stat-card"><div class="stat-value">${stats.total}</div><div class="stat-label">Versículos</div></div>
      <div class="stat-card"><div class="stat-value">${stats.posted}</div><div class="stat-label">Postados</div></div>
      <div class="stat-card"><div class="stat-value">${stats.remaining}</div><div class="stat-label">Na fila</div></div>
      <div class="stat-card"><div class="stat-value">${videos.length}</div><div class="stat-label">Vídeos prontos</div></div>
    </div>

    <div class="section">
      <div class="section-title">⏰ Horários de Publicação (BRT)</div>
      <div class="schedule-grid">
        <div class="time-slot"><h3>☀️ 06:00</h3><p>Devocional matinal — fé, proteção, gratidão</p></div>
        <div class="time-slot"><h3>🌤️ 12:00</h3><p>Motivacional — força, coragem, vitória</p></div>
        <div class="time-slot"><h3>🌙 20:00</h3><p>Emocional — amor, paz, esperança</p></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📋 Últimos Posts</div>
      ${history.length === 0 ? '<p style="color:rgba(255,255,255,0.3);font-size:0.8rem;">Nenhum post ainda. O cron vai disparar nos horários programados.</p>' : 
        history.slice(-10).reverse().map(h => `
        <div class="history-item">
          <div class="history-dot ${h.posted ? '' : 'manual'}"></div>
          <div class="history-info">
            <div class="history-verse">📖 ${h.verse} — ${h.text?.substring(0,40)}...</div>
            <div class="history-time">${h.timestamp} · ${h.slot} · ${h.posted ? '✅ Auto' : '⚠️ Manual'}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title">🎬 Vídeos Gerados (${videos.length})</div>
      <div class="video-grid">
        ${videos.slice(0, 12).map(v => `
        <div class="video-card">
          <video controls muted playsinline preload="metadata"><source src="/videos/${v}" type="video/mp4"></video>
          <div class="name">${v}</div>
        </div>
        `).join('')}
      </div>
    </div>

    <div style="margin-top:24px;text-align:center;">
      <p style="color:rgba(255,255,255,0.3);font-size:0.7rem;">FéTok Auto-Poster v1.0 · Railway · Node.js + FFmpeg + Sharp</p>
    </div>
  </div>
</body>
</html>`);
  });

  app.listen(PORT, () => {
    console.log(`📊 Dashboard running on port ${PORT}`);
    console.log(`   http://localhost:${PORT}\n`);
  });

  return app;
}

module.exports = { startDashboard };
