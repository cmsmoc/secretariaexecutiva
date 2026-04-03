// Template: feed-cards — notícias

const catMap = {
  resolucao:   { label: 'Resolução',   cls: 'tag-green'  },
  reuniao:     { label: 'Reunião',     cls: 'tag-blue'   },
  conferencia: { label: 'Conferência', cls: 'tag-yellow'  },
  informe:     { label: 'Informe',     cls: 'tag-navy'   },
  deliberacao: { label: 'Deliberação', cls: 'tag-green'  },
};

export function feedCards({ modulo, dados }) {
  const titulo  = modulo.titulo_override || 'Últimas Notícias';
  const limite  = modulo.limite || 6;
  const itens   = (dados || []).slice(0, limite);

  if (itens.length === 0) {
    return `<div class="container"><p class="text-muted mt-16">Nenhuma notícia publicada ainda.</p></div>`;
  }

  const cards = itens.map(n => {
    const cat = catMap[n.categoria] || { label: n.categoria || 'Notícia', cls: 'tag-navy' };
    const dt  = n.data_publicacao
      ? new Date(n.data_publicacao + 'T12:00:00').toLocaleDateString('pt-BR')
      : '';
    const destBadge = n.destaque ? '<span class="destaque-badge">★ Destaque</span>' : '';
    return `
      <article class="feed-card${n.destaque ? ' feed-card--destaque' : ''}">
        <div class="feed-card-top">
          <span class="tag ${cat.cls}">${esc(cat.label)}</span>
          ${destBadge}
          <time class="feed-date">${dt}</time>
        </div>
        <h3 class="feed-title">
          <a href="pages/noticia.html#${esc(n.slug || n.id)}">${esc(n.titulo)}</a>
        </h3>
        ${n.resumo ? `<p class="feed-resumo">${esc(n.resumo)}</p>` : ''}
      </article>
    `;
  }).join('');

  return `
    <div class="container" id="noticias">
      <div class="section-header">
        <h2 class="section-title">${esc(titulo)}</h2>
        <a href="pages/noticias.html" class="more-link">Ver todas →</a>
      </div>
      <div class="feed-grid">${cards}</div>
    </div>
    <style>
      .feed-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }
      .feed-card {
        background: var(--color-white);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: 20px;
        display: flex; flex-direction: column; gap: 10px;
        transition: box-shadow .2s, transform .2s;
      }
      .feed-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
      .feed-card--destaque { border-color: var(--color-accent); border-width: 2px; }
      .feed-card-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .feed-date { font-size: 11px; color: var(--color-muted); margin-left: auto; }
      .feed-title { font-size: 15px; font-weight: 700; color: var(--color-ink); line-height: 1.4; }
      .feed-title a { color: inherit; }
      .feed-title a:hover { color: var(--color-secondary); text-decoration: none; }
      .feed-resumo { font-size: 13px; color: var(--color-muted); line-height: 1.6; }
      .destaque-badge { font-size: 10px; color: #9A7A00; font-weight: 700; }
    </style>
  `;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
