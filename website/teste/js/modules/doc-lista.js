// Template: doc-lista — documentos e resoluções

const tipoIcon = {
  resolucao:  '📋', ata: '📝', relatorio: '📊',
  legislacao: '⚖️', formulario: '📄', material: '📚', default: '📁',
};

export function docLista({ modulo, dados }) {
  const titulo = modulo.titulo_override || 'Documentos';
  const limite = modulo.limite || 8;
  const itens  = (dados || []).filter(d => d.destaque || true).slice(0, limite);

  if (itens.length === 0) {
    return `<div class="container" id="documentos">
      <div class="section-header"><h2 class="section-title">${esc(titulo)}</h2></div>
      <p class="text-muted">Nenhum documento publicado.</p>
    </div>`;
  }

  const rows = itens.map(d => {
    const icon = tipoIcon[d.tipo] || tipoIcon.default;
    const dt   = d.data ? new Date(d.data + 'T12:00:00').toLocaleDateString('pt-BR') : '';
    const kb   = d.tamanho_kb ? `${d.tamanho_kb} KB` : '';
    return `
      <li class="doc-item">
        <span class="doc-icon">${icon}</span>
        <div class="doc-info">
          <div class="doc-titulo">
            <a href="${esc(d.url || '#')}" target="_blank" rel="noopener">${esc(d.titulo)}</a>
          </div>
          <div class="doc-meta">
            ${dt ? `<span>${dt}</span>` : ''}
            ${kb ? `<span>· ${kb}</span>` : ''}
            ${d.tipo ? `<span class="tag tag-navy" style="padding:1px 6px;font-size:9px">${esc(d.tipo)}</span>` : ''}
          </div>
        </div>
        ${d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener" class="doc-dl" title="Abrir documento">↗</a>` : ''}
      </li>
    `;
  }).join('');

  return `
    <div class="container" id="documentos">
      <div class="section-header">
        <h2 class="section-title">${esc(titulo)}</h2>
        <a href="pages/documentos.html" class="more-link">Ver todos →</a>
      </div>
      <ul class="doc-list">${rows}</ul>
    </div>
    <style>
      .doc-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
      .doc-item {
        display: flex; align-items: center; gap: 12px;
        background: var(--color-white);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: 14px 16px;
        transition: box-shadow .18s;
      }
      .doc-item:hover { box-shadow: var(--shadow-sm); }
      .doc-icon { font-size: 20px; flex-shrink: 0; }
      .doc-info { flex: 1; min-width: 0; }
      .doc-titulo { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .doc-titulo a { color: var(--color-ink); }
      .doc-titulo a:hover { color: var(--color-secondary); }
      .doc-meta { display: flex; align-items: center; gap: 6px; margin-top: 4px; font-size: 12px; color: var(--color-muted); flex-wrap: wrap; }
      .doc-dl {
        font-size: 16px; color: var(--color-secondary);
        padding: 4px 8px; border-radius: 6px;
        background: var(--color-bg); flex-shrink: 0;
        text-decoration: none;
      }
      .doc-dl:hover { background: var(--color-border); }
    </style>
  `;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
