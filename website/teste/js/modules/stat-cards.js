// Template: stat-cards — indicadores fixos do CONFIG

export function statCards({ modulo, dados, config }) {
  const stats = [
    { label: 'Conselheiros',    valor: config?.total_conselheiros || '—', icon: '👥' },
    { label: 'Reuniões/ano',    valor: config?.reunioes_por_ano   || '—', icon: '📅' },
    { label: 'Anos de atuação', valor: config?.anos_atuacao       || '—', icon: '🏛️' },
    { label: 'Documentos',      valor: config?.total_documentos   || '—', icon: '📄' },
  ];

  const cards = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-valor">${esc(s.valor)}</div>
      <div class="stat-label">${esc(s.label)}</div>
    </div>
  `).join('');

  return `
    <div class="container">
      <div class="stat-grid">${cards}</div>
    </div>
    <style>
      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      .stat-card {
        background: var(--color-white);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: 28px 24px;
        text-align: center;
        box-shadow: var(--shadow-sm);
      }
      .stat-icon  { font-size: 28px; margin-bottom: 8px; }
      .stat-valor { font-size: 36px; font-weight: 900; color: var(--color-primary); line-height: 1; margin-bottom: 6px; }
      .stat-label { font-size: 12px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: var(--color-muted); }
    </style>
  `;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
