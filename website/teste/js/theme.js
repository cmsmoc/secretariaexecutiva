// ═══════════════════════════════════════════════════════════════
// CMS-MOC · js/theme.js
// Aplica tokens do THEME (Sheets) como CSS variables no :root
// ═══════════════════════════════════════════════════════════════

/**
 * Recebe o array theme[] do JSON e injeta como CSS variables.
 * Cada item: { token: '--color-primary', valor: '#0D2E5A', grupo: 'cores' }
 */
export function aplicarTema(themeArray) {
  if (!themeArray || !Array.isArray(themeArray) || themeArray.length === 0) return;

  const root = document.documentElement;

  themeArray.forEach(item => {
    const token = item.token?.trim();
    const valor = item.valor?.toString().trim();

    if (token && token.startsWith('--') && valor) {
      root.style.setProperty(token, valor);
    }
  });
}

/**
 * Atualiza o <title> e outros metadados com dados do config
 */
export function aplicarConfig(config) {
  if (!config) return;

  if (config.site_nome) {
    document.title = config.site_nome;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = config.site_nome;
  }

  if (config.site_descricao) {
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = config.site_descricao;
  }
}
