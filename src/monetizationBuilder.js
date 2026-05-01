/**
 * FéTok Monetization HTML Builder
 * Pre-builds the monetization tab HTML for the dashboard
 */

const {
  MONETIZATION_PILLARS, SUBSCRIPTION_TIERS, AFFILIATE_PRODUCTS,
  OWN_PRODUCTS, LIVE_SCHEDULE, BRAND_TARGETS, REVENUE_PHASES,
  LONG_FORM_TEMPLATES, MILESTONES,
} = require('./monetizationData');

function buildMonetizationTabHTML() {
  const pillarsHTML = MONETIZATION_PILLARS.map(p => {
    const isActive = p.status === 'active';
    const borderColor = isActive ? 'rgba(52,199,89,0.4)' : 'var(--border)';
    const bgColor = isActive ? 'rgba(52,199,89,0.06)' : 'var(--bg-card)';
    const badge = isActive
      ? '<span style="font-size:0.6rem;padding:2px 8px;background:rgba(52,199,89,0.15);color:#34c759;border-radius:10px;font-weight:700;">ATIVO</span>'
      : '<span style="font-size:0.6rem;padding:2px 8px;background:rgba(255,149,0,0.15);color:#ff9500;border-radius:10px;font-weight:700;">\u{1F512} ' + p.unlockAt.toLocaleString() + ' seg.</span>';
    return '<div style="background:' + bgColor + ';border:1px solid ' + borderColor + ';border-radius:var(--radius);padding:16px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
      + '<span style="font-size:1.5rem;">' + p.icon + '</span>' + badge + '</div>'
      + '<div style="font-size:0.85rem;font-weight:800;margin-bottom:4px;">' + p.name + '</div>'
      + '<div style="font-size:0.68rem;color:var(--text-secondary);line-height:1.4;margin-bottom:10px;">' + p.description + '</div>'
      + '<div style="font-size:0.7rem;color:var(--gold);font-weight:700;">R$ ' + p.revenueRange.min.toLocaleString() + ' \u2014 R$ ' + p.revenueRange.max.toLocaleString() + '/m\u00EAs</div>'
      + '</div>';
  }).join('');

  const milestonesHTML = MILESTONES.map(m => {
    const bg = m.achieved ? 'linear-gradient(135deg,#34c759,#30b350)' : 'var(--bg-card)';
    const bc = m.achieved ? '#34c759' : 'var(--border)';
    const col = m.achieved ? '#34c759' : 'var(--text-secondary)';
    const icon = m.achieved ? '\u2705' : m.icon;
    const fLabel = m.followers >= 1000 ? (m.followers / 1000) + 'K' : String(m.followers);
    return '<div style="text-align:center;flex:1;">'
      + '<div style="width:28px;height:28px;border-radius:50%;background:' + bg + ';border:2px solid ' + bc + ';display:flex;align-items:center;justify-content:center;font-size:0.7rem;margin:0 auto 6px;">' + icon + '</div>'
      + '<div style="font-size:0.6rem;font-weight:700;color:' + col + ';">' + fLabel + '</div>'
      + '<div style="font-size:0.55rem;color:var(--text-tertiary);max-width:70px;margin:2px auto 0;">' + m.label + '</div>'
      + '</div>';
  }).join('');

  const liveHTML = LIVE_SCHEDULE.map(l => {
    const scriptRows = l.script.map(s =>
      '<div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.03);">'
      + '<span style="font-size:0.62rem;color:var(--gold);font-weight:700;min-width:32px;">' + s.time + '</span>'
      + '<span style="font-size:0.62rem;font-weight:700;color:var(--text-primary);min-width:80px;">' + s.block + '</span>'
      + '<span style="font-size:0.62rem;color:var(--text-tertiary);">' + s.content.substring(0, 55) + '...</span>'
      + '</div>'
    ).join('');
    const triggers = l.giftTriggers.map(g =>
      '<div style="font-size:0.6rem;color:var(--text-secondary);padding:2px 0;">\u2022 ' + g + '</div>'
    ).join('');
    return '<div style="background:var(--bg-card);border:1px solid var(--border);border-left:4px solid ' + l.color + ';border-radius:var(--radius);padding:16px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'
      + '<div><div style="font-size:1rem;font-weight:900;">' + l.emoji + ' ' + l.name + '</div>'
      + '<div style="font-size:0.7rem;color:var(--text-secondary);">' + l.day + ' \u00B7 ' + l.time + ' BRT \u00B7 ' + l.duration + '</div></div>'
      + '<span style="font-size:0.6rem;padding:3px 10px;background:rgba(254,44,85,0.12);color:#fe2c55;border-radius:10px;font-weight:700;">\uD83D\uDD34 LIVE</span></div>'
      + '<div style="font-size:0.72rem;color:var(--text-secondary);line-height:1.6;">' + scriptRows + '</div>'
      + '<div style="margin-top:10px;padding:8px;background:rgba(212,168,83,0.06);border-radius:var(--radius-sm);">'
      + '<div style="font-size:0.6rem;color:var(--gold);font-weight:700;margin-bottom:4px;">\uD83D\uDC8E Gatilhos de Presentes:</div>'
      + triggers + '</div></div>';
  }).join('');

  const revenueHTML = REVENUE_PHASES.map(ph => {
    const streams = Object.entries(ph.streams).map(([k, v]) =>
      '<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.03);">'
      + '<span>' + k.replace(/_/g, ' ') + '</span>'
      + '<span style="color:var(--gold);">R$ ' + v.min + '-' + v.max + '</span></div>'
    ).join('');
    return '<div style="background:var(--bg-card);border:1px solid var(--border);border-top:3px solid ' + ph.color + ';border-radius:var(--radius);padding:16px;">'
      + '<div style="font-size:1.3rem;text-align:center;margin-bottom:6px;">' + ph.emoji + '</div>'
      + '<div style="font-size:0.9rem;font-weight:900;text-align:center;margin-bottom:4px;">' + ph.name + '</div>'
      + '<div style="font-size:0.65rem;color:var(--text-tertiary);text-align:center;margin-bottom:12px;">' + ph.followerRange + ' seg \u00B7 ' + ph.timeframe + '</div>'
      + '<div style="text-align:center;padding:10px;background:rgba(212,168,83,0.06);border-radius:var(--radius-sm);margin-bottom:12px;">'
      + '<div style="font-size:1.1rem;font-weight:900;color:var(--gold);">R$ ' + ph.totalMin.toLocaleString() + ' \u2014 R$ ' + ph.totalMax.toLocaleString() + '</div>'
      + '<div style="font-size:0.6rem;color:var(--text-tertiary);">receita mensal estimada</div></div>'
      + '<div style="font-size:0.65rem;color:var(--text-secondary);">' + streams + '</div></div>';
  }).join('');

  const ownProdHTML = OWN_PRODUCTS.map(p =>
    '<div style="background:var(--bg-card);border:1px solid rgba(212,168,83,0.2);border-radius:var(--radius);padding:14px;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
    + '<span style="font-size:1.2rem;">' + p.emoji + '</span>'
    + '<span style="font-size:0.9rem;font-weight:900;color:var(--gold);">R$ ' + p.price.toFixed(2) + '</span></div>'
    + '<div style="font-size:0.8rem;font-weight:800;margin-bottom:4px;">' + p.name + '</div>'
    + '<div style="font-size:0.65rem;color:var(--text-secondary);line-height:1.4;">' + p.description + '</div>'
    + '<div style="display:flex;justify-content:space-between;margin-top:8px;">'
    + '<span style="font-size:0.6rem;color:#34c759;">' + p.margin + '% margem</span>'
    + '<span style="font-size:0.6rem;padding:2px 8px;background:rgba(255,149,0,0.1);color:#ff9500;border-radius:8px;">Fase ' + p.launchPhase + '</span></div></div>'
  ).join('');

  const affHTML = AFFILIATE_PRODUCTS.map(p =>
    '<tr><td style="font-weight:700;">' + p.name + '</td>'
    + '<td>' + p.category + '</td>'
    + '<td>' + p.priceRange + '</td>'
    + '<td style="color:var(--gold);font-weight:700;">' + p.commission + '</td>'
    + '<td>' + '\u2B50'.repeat(p.fit) + '</td></tr>'
  ).join('');

  return `
    <div style="background:linear-gradient(135deg,rgba(52,199,89,0.1),rgba(212,168,83,0.1));border:1px solid rgba(52,199,89,0.3);border-radius:var(--radius);padding:20px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <span style="font-size:2rem;">\uD83D\uDD34</span>
        <div>
          <div style="font-size:1.1rem;font-weight:900;color:#34c759;">LIVE J\u00C1 DESBLOQUEADA!</div>
          <div style="font-size:0.75rem;color:var(--text-secondary);">Voc\u00EA pode come\u00E7ar a monetizar AGORA via LIVE no celular. Presentes = Diamantes = Dinheiro real.</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
        <div style="text-align:center;padding:10px;background:var(--bg-card);border-radius:var(--radius-sm);"><div style="font-size:1.3rem;font-weight:900;color:var(--gold);">94</div><div style="font-size:0.62rem;color:var(--text-tertiary);">Seguidores</div></div>
        <div style="text-align:center;padding:10px;background:var(--bg-card);border-radius:var(--radius-sm);"><div style="font-size:1.3rem;font-weight:900;color:#34c759;">1.1K</div><div style="font-size:0.62rem;color:var(--text-tertiary);">Views 30d</div></div>
        <div style="text-align:center;padding:10px;background:var(--bg-card);border-radius:var(--radius-sm);"><div style="font-size:1.3rem;font-weight:900;color:#fe2c55;">\uD83D\uDD34</div><div style="font-size:0.62rem;color:var(--text-tertiary);">LIVE Ativa</div></div>
        <div style="text-align:center;padding:10px;background:var(--bg-card);border-radius:var(--radius-sm);"><div style="font-size:1.3rem;font-weight:900;color:#af82ff;">5</div><div style="font-size:0.62rem;color:var(--text-tertiary);">Pilares de Receita</div></div>
      </div>
    </div>
    <div class="section"><div class="section-header"><div class="section-title">\uD83D\uDCB0 5 PILARES DE MONETIZA\u00C7\u00C3O</div><span class="section-badge">Roadmap completo</span></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">${pillarsHTML}</div></div>
    <div class="section"><div class="section-header"><div class="section-title">\uD83C\uDFC6 MARCOS DE CRESCIMENTO</div><span class="section-badge">94 \u2192 100K seguidores</span></div>
      <div style="display:flex;justify-content:space-between;position:relative;padding:10px 0;">${milestonesHTML}</div></div>
    <div class="section"><div class="section-header"><div class="section-title">\uD83D\uDD34 PROGRAMA\u00C7\u00C3O DE LIVES</div><span class="section-badge">3x por semana</span></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;">${liveHTML}</div></div>
    <div class="section"><div class="section-header"><div class="section-title">\uD83D\uDCCA PROJE\u00C7\u00C3O DE RECEITA POR FASE</div><span class="section-badge">3 fases de crescimento</span></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">${revenueHTML}</div></div>
    <div class="section"><div class="section-header"><div class="section-title">\uD83D\uDECD\uFE0F PRODUTOS</div><span class="section-badge">${AFFILIATE_PRODUCTS.length} afiliados + ${OWN_PRODUCTS.length} pr\u00F3prios</span></div>
      <div style="margin-bottom:16px;"><div style="font-size:0.8rem;font-weight:800;margin-bottom:10px;color:var(--gold);">\uD83D\uDCE6 Infoprodutos Pr\u00F3prios</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;">${ownProdHTML}</div></div>
      <div><div style="font-size:0.8rem;font-weight:800;margin-bottom:10px;color:#af82ff;">\uD83D\uDED2 Produtos Afiliados (TikTok Shop)</div>
        <div style="overflow-x:auto;"><table class="music-table" style="width:100%;"><thead><tr><th>Produto</th><th>Categoria</th><th>Pre\u00E7o</th><th>Comiss\u00E3o</th><th>Fit</th></tr></thead><tbody>${affHTML}</tbody></table></div></div></div>`;
}

module.exports = { buildMonetizationTabHTML };
