// ═══════════════════════════════════════════════════════════════
// CMS-MOC · js/api.js
// Fetch do GAS com cache em memória por sessão
// ═══════════════════════════════════════════════════════════════

let _cacheLocal = null;

/**
 * Faz fetch do JSON completo do GAS e armazena em memória.
 * O endpoint é lido da meta tag <meta name="gas-endpoint" content="...">
 */
export async function fetchCMS() {
  if (_cacheLocal) return _cacheLocal;

  const metaTag = document.querySelector('meta[name="gas-endpoint"]');
  const endpoint = metaTag?.content;

  if (!endpoint || endpoint === 'COLE_SUA_URL_GAS_AQUI') {
    throw new Error('gas-endpoint não configurado. Edite o index.html e cole a URL do GAS.');
  }

  const res = await fetch(`${endpoint}?action=full`, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

  _cacheLocal = await res.json();
  return _cacheLocal;
}

/**
 * Retorna dados de uma chave específica do payload
 * @param {string} chave - ex: 'noticias', 'reunioes', 'documentos'
 */
export async function getData(chave) {
  const cms = await fetchCMS();
  return cms[chave] || [];
}

/** Limpa o cache local (força novo fetch) */
export function limparCache() {
  _cacheLocal = null;
}
