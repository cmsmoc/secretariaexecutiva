// Template: hero-banner — alimentado pela aba BANNERS

export function heroBanner({ modulo, dados, config }) {
  const banner = (dados || []).find(b => b.posicao === 'hero') || dados?.[0];

  const titulo    = banner?.titulo    || config?.site_nome    || 'Conselho Municipal de Saúde';
  const subtitulo = banner?.subtitulo || config?.site_descricao || '';
  const ctaLabel  = banner?.cta_label || 'Saiba mais';
  const ctaUrl    = banner?.cta_url   || '#noticias';
  const corFundo  = banner?.cor_fundo || 'var(--color-primary)';

  return `
    <div class="hero-banner" style="background:${esc(corFundo)}">
      <div class="container">
        <div class="hero-inner">
          <div class="hero-badge">${esc(config?.site_sigla || 'CMS')}</div>
          <h1 class="hero-title">${esc(titulo)}</h1>
          ${subtitulo ? `<p class="hero-sub">${esc(subtitulo)}</p>` : ''}
          <div class="hero-actions">
            <a href="${esc(ctaUrl)}" class="btn btn-primary">${esc(ctaLabel)}</a>
            <a href="#documentos" class="btn btn-outline">Documentos</a>
          </div>
        </div>
      </div>
    </div>
    <style>
      .hero-banner { padding: 80px 0; }
      .hero-inner  { max-width: 620px; }
      .hero-badge  {
        display: inline-block; background: rgba(245,196,0,.15);
        color: var(--color-accent); border: 1px solid rgba(245,196,0,.3);
        font-size: 10px; font-weight: 700; letter-spacing: 2px;
        text-transform: uppercase; padding: 5px 14px; border-radius: 20px;
        margin-bottom: 18px;
      }
      .hero-title {
        font-size: clamp(28px,5vw,52px); font-weight: 900;
        color: #fff; letter-spacing: -1px; line-height: 1.05;
        margin-bottom: 16px;
      }
      .hero-sub {
        font-size: 16px; color: rgba(255,255,255,.65);
        line-height: 1.7; margin-bottom: 28px; max-width: 480px;
      }
      .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    </style>
  `;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
