// Template: lista-datas — próximas reuniões

export function listaDatas({ modulo, dados }) {
  const titulo = modulo.titulo_override || 'Próximas Reuniões';
  const limite = modulo.limite || 5;
  const itens  = (dados || []).slice(0, limite);

  if (itens.length === 0) {
    return `
      <div class="container" id="reunioes">
        <div class="section-header"><h2 class="section-title">${esc(titulo)}</h2></div>
        <p class="text-muted">Nenhuma reunião agendada.</p>
      </div>`;
  }

  const tipoLabel = { ordinaria: 'Ordinária', extraordinaria: 'Extraordinária', especial: 'Especial' };

  const rows = itens.map(r => {
    const dt = r.data ? new Date(r.data + 'T12:00:00') : null;
    const dtStr = dt
      ? dt.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
      : '';
    const tipo = tipoLabel[r.tipo] || r.tipo || 'Reunião';
    const tipoCls = r.tipo === 'extraordinaria' ? 'tag-yellow' : r.tipo === 'especial' ? 'tag-red' : 'tag-blue';
    return `
      <li class="reuniao-item">
        <div class="reuniao-data">
          ${dt ? `<div class="reuniao-dia">${dt.getDate()}</div><div class="reuniao-mes">${dt.toLocaleDateString('pt-BR',{month:'short'}).replace('.','')}</div>` : ''}
        </div>
        <div class="reuniao-info">
          <div class="reuniao-topo">
            <span class="tag ${tipoCls}">${esc(tipo)}</span>
            <span class="reuniao-num">Nº ${esc(r.numero || '')}</span>
          </div>
          <div class="reuniao-detalhe">
            ${r.horario ? `🕐 ${esc(r.horario)}` : ''}
            ${r.local ? `· 📍 ${esc(r.local)}` : ''}
          </div>
          ${r.pauta_url ? `<a href="${esc(r.pauta_url)}" target="_blank" rel="noopener" class="reuniao-link">Ver pauta →</a>` : ''}
        </div>
      </li>
    `;
  }).join('');

  return `
    <div class="container" id="reunioes">
      <div class="section-header">
        <h2 class="section-title">${esc(titulo)}</h2>
        <a href="pages/atas.html" class="more-link">Atas anteriores →</a>
      </div>
      <ul class="reunioes-list">${rows}</ul>
    </div>
    <style>
      .reunioes-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
      .reuniao-item {
        display: flex; gap: 16px; align-items: flex-start;
        background: var(--color-white);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: 18px 20px;
      }
      .reuniao-data {
        min-width: 48px; text-align: center;
        background: var(--color-primary); color: #fff;
        border-radius: 8px; padding: 8px 6px;
      }
      .reuniao-dia  { font-size: 22px; font-weight: 900; line-height: 1; }
      .reuniao-mes  { font-size: 11px; text-transform: uppercase; opacity: .7; }
      .reuniao-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
      .reuniao-topo { display: flex; align-items: center; gap: 8px; }
      .reuniao-num  { font-size: 12px; color: var(--color-muted); }
      .reuniao-detalhe { font-size: 13px; color: var(--color-muted); }
      .reuniao-link { font-size: 12px; color: var(--color-secondary); font-weight: 600; }
    </style>
  `;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
