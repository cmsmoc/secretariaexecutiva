// ═══════════════════════════════════════════════════════════════
// CMS-MOC · js/popup.js
// Renderiza popup controlado por localStorage
// ═══════════════════════════════════════════════════════════════

const POPUP_PREFIX = 'cms_popup_';

export function renderizarPopup(popups) {
  if (!popups || popups.length === 0) return;

  // Pega o de menor prioridade
  const popup = popups[0];
  if (!popup || !popup.ativo) return;

  // Controle de frequência
  const key = `${POPUP_PREFIX}${popup.id}`;
  const freq = popup.frequencia || 'sempre';

  if (freq === 'uma_vez') {
    if (localStorage.getItem(key)) return;
  } else if (freq === 'por_sessao') {
    if (sessionStorage.getItem(key)) return;
  }

  // Cria overlay
  const overlay = document.getElementById('cms-popup-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="popup-box" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <button class="popup-close" id="popup-close-btn" aria-label="Fechar">×</button>
      <div class="popup-title" id="popup-title">${esc(popup.titulo || '')}</div>
      <div class="popup-msg">${esc(popup.mensagem || '')}</div>
      ${popup.botao_label && popup.botao_url ? `
        <a href="${esc(popup.botao_url)}" class="btn btn-primary" id="popup-cta">
          ${esc(popup.botao_label)}
        </a>
      ` : ''}
    </div>
  `;
  overlay.classList.remove('hidden');

  function fechar() {
    overlay.classList.add('hidden');
    if (freq === 'uma_vez')   localStorage.setItem(key, '1');
    if (freq === 'por_sessao') sessionStorage.setItem(key, '1');
  }

  document.getElementById('popup-close-btn')?.addEventListener('click', fechar);
  overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); }, { once: true });
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
