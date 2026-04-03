// Template: grid-cards — Academia do Conselheiro

const nivelCls = { basico: 'tag-green', intermediario: 'tag-blue', avancado: 'tag-red' };
const tipoIcon2 = { pdf: '📄', video: '▶️', texto: '📖', oficina: '🎓', link: '🔗' };

export function gridCards({ modulo, dados }) {
  const titulo = modulo.titulo_override || 'Academia do Conselheiro';
  const limite = modulo.limite || 6;
  const itens  = (dados || []).slice(0, limite);

  if (itens.length === 0) {
    return `<div class="container" id="academia">
      <div class="section-header"><h2 class="section-title">${esc(titulo)}</h2></div>
      <p class="text-muted">Nenhum conteúdo publicado.</p>
    </div>`;
  }

  const cards = itens.map(a => {
    const nivCls = nivelCls[a.nivel] || 'tag-navy';
    const icon   = tipoIcon2[a.tipo_conteudo] || '📁';
    return `
      <div class="academia-card">
        <div class="academia-top">
          <span class="academia-icon">${icon}</span>
          <span class="tag ${nivCls}">${esc(a.nivel || '')}</span>
        </div>
        <h3 class="academia-titulo">${esc(a.titulo)}</h3>
        ${a.descricao ? `<p class="academia-desc">${esc(a.descricao)}</p>` : ''}
        <div class="academia-footer">
          ${a.categoria ? `<span class="tag tag-navy" style="font-size:9px">${esc(a.categoria)}</span>` : ''}
          ${a.duracao_min ? `<span class="academia-dur">⏱ ${a.duracao_min} min</span>` : ''}
          ${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener" class="academia-link">Acessar →</a>` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="container" id="academia">
      <div class="section-header">
        <h2 class="section-title">${esc(titulo)}</h2>
        <a href="pages/academia.html" class="more-link">Ver tudo →</a>
      </div>
      <div class="academia-grid">${cards}</div>
    </div>
    <style>
      .academia-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
      }
      .academia-card {
        background: var(--color-white);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: 20px; display: flex; flex-direction: column; gap: 10px;
      }
      .academia-top { display: flex; align-items: center; gap: 8px; }
      .academia-icon { font-size: 20px; }
      .academia-titulo { font-size: 15px; font-weight: 700; color: var(--color-ink); line-height: 1.35; }
      .academia-desc { font-size: 13px; color: var(--color-muted); line-height: 1.55; flex: 1; }
      .academia-footer { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: auto; }
      .academia-dur  { font-size: 11px; color: var(--color-muted); }
      .academia-link { font-size: 12px; font-weight: 600; color: var(--color-secondary); margin-left: auto; }
    </style>
  `;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
