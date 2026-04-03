// ═══════════════════════════════════════════════════════════════
// CMS-MOC · js/main.js
// Orquestrador: init, fetch, render menu, render módulos
// ═══════════════════════════════════════════════════════════════

import { fetchCMS }        from './api.js';
import { aplicarTema, aplicarConfig } from './theme.js';
import { renderizarPopup } from './popup.js';
import * as Modulos        from './modules/index.js';

// Mapa template_id → função exportada
const TEMPLATE_MAP = {
  'hero-banner':  Modulos.heroBanner,
  'stat-cards':   Modulos.statCards,
  'feed-cards':   Modulos.feedCards,
  'lista-datas':  Modulos.listaDatas,
  'doc-lista':    Modulos.docLista,
  'grid-cards':   Modulos.gridCards,
  'acesso-rapido':Modulos.acessoRapido,
};

async function init() {
  const loading = document.getElementById('cms-loading');
  const errorEl = document.getElementById('cms-error');

  try {
    const cms = await fetchCMS();

    // ── 1. Tema e config ──────────────────────────────────────
    aplicarTema(cms.theme);
    aplicarConfig(cms.config);

    // ── 2. Navbar ─────────────────────────────────────────────
    renderizarNav(cms.menu, cms.config);

    // ── 3. Módulos da home em ordem ───────────────────────────
    const main = document.getElementById('cms-main');
    const modulos = (cms.home_layout || []).filter(m => m.ativo);

    for (const modulo of modulos) {
      const fonteKey = (modulo.fonte_dados || '').toLowerCase();
      const dados    = cms[fonteKey] || cms.banners || [];
      const fn       = TEMPLATE_MAP[modulo.template];

      if (!fn) {
        console.warn(`[CMS] Template não encontrado: "${modulo.template}"`);
        continue;
      }

      const html = fn({ modulo, dados, config: cms.config });

      const section = document.createElement('section');
      section.className = 'section-wrap ' + (modulo.fundo ? `fundo-${modulo.fundo}` : 'fundo-off-white');
      section.setAttribute('data-modulo', modulo.modulo_id);
      section.innerHTML = html;
      main.appendChild(section);
    }

    // ── 4. Footer ─────────────────────────────────────────────
    renderizarFooter(cms.config);

    // ── 5. Popup ──────────────────────────────────────────────
    renderizarPopup(cms.popup);

    // ── 6. Esconde loading ────────────────────────────────────
    loading?.classList.add('hidden');

  } catch (err) {
    console.error('[CMS] Erro ao carregar:', err);
    loading?.classList.add('hidden');
    if (errorEl) {
      errorEl.classList.add('visible');
      const msgEl = errorEl.querySelector('#error-detail');
      if (msgEl) msgEl.textContent = err.message;
    }
  }
}

// ── RENDERIZAR NAVBAR ──────────────────────────────────────────
function renderizarNav(menu, config) {
  const nav = document.getElementById('cms-nav');
  if (!nav) return;

  const sigla  = config?.site_sigla || 'CMS';
  const nome   = config?.site_nome  || 'Conselho Municipal de Saúde';
  const itens  = (menu || [])
    .filter(m => m.ativo)
    .sort((a, b) => (a.ordem || 99) - (b.ordem || 99));

  const links = itens.map(m => {
    const href = m.url || '#';
    const ext  = m.externo ? 'target="_blank" rel="noopener"' : '';
    return `<li><a href="${esc(href)}" ${ext}>${esc(m.label || m.titulo || '')}</a></li>`;
  }).join('');

  nav.innerHTML = `
    <div class="container nav-inner">
      <a href="/" class="nav-brand">
        <span class="nav-brand-sigla">${esc(sigla)}</span>
        <span class="nav-brand-nome">${esc(nome)}</span>
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-links">${links}</ul>
    </div>
  `;

  // Toggle mobile
  const toggle = document.getElementById('nav-toggle');
  const ul     = document.getElementById('nav-links');
  toggle?.addEventListener('click', () => {
    const open = ul.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// ── RENDERIZAR FOOTER ──────────────────────────────────────────
function renderizarFooter(config) {
  const footer = document.getElementById('cms-footer');
  if (!footer) return;
  const nome  = config?.site_nome  || 'Conselho Municipal de Saúde';
  const email = config?.contato_email || '';
  const ano   = new Date().getFullYear();
  footer.innerHTML = `
    <strong>${esc(nome)}</strong><br>
    ${email ? `<a href="mailto:${esc(email)}" style="color:rgba(255,255,255,.5)">${esc(email)}</a> · ` : ''}
    © ${ano} · Desenvolvido com Google Sheets + GAS
  `;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── BOOT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
