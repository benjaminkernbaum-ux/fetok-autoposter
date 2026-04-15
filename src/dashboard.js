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

  // Serve generated videos
  app.use('/videos', express.static(OUTPUT_DIR));

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
