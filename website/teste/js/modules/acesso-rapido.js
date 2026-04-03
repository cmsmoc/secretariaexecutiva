// Template: acesso-rapido — atalhos rápidos para cidadãos

export function acessoRapido({ modulo, config }) {
  const titulo = modulo.titulo_override || 'Acesso Rápido';

  const atalhos = [
    { label: 'Notícias',       icon: '📰', href: '#noticias'  },
    { label: 'Próximas Reuniões', icon: '📅', href: '#reunioes' },
    { label: 'Documentos',     icon: '📁', href: '#documentos'},
    { label: 'Academia',       icon: '🎓', href: '#academia'  },
    { label: 'Contato',        icon: '✉️', href: `mailto:${config?.contato_email || '#'}` },
    { label: 'Atas de Reunião',icon: '📝', href: 'pages/atas.html' },
  ];

  const items = atalhos.map(a => `
    <a href="${esc(a.href)}" class="atalho-card">
      <span class="atalho-icon">${a.icon}</span>
      <span class="atalho-label">${esc(a.label)}</span>
    </a>
  `).join('');

  return `
    <div class="container">
      <h2 class="section-title" style="margin-bottom:20px">${esc(titulo)}</h2>
      <div class="atalho-grid">${items}</div>
    </div>
    <style>
      .atalho-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
      }
      .atalho-card {
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        background: var(--color-white);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: 20px 16px;
        text-decoration: none; color: var(--color-ink);
        transition: box-shadow .18s, transform .18s;
        text-align: center;
      }
      .atalho-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); text-decoration: none; }
      .atalho-icon  { font-size: 28px; }
      .atalho-label { font-size: 13px; font-weight: 600; }
    </style>
  `;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
