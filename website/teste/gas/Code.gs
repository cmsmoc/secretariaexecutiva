// ═══════════════════════════════════════════════════════════════
// CMS-MOC · Google Apps Script · Code.gs
// Versão: 1.0 · Abril 2026
// ═══════════════════════════════════════════════════════════════

// ── CONSTANTES DE ABAS ─────────────────────────────────────────
const ABA = {
  CONFIG:    'CONFIG',
  THEME:     'THEME',
  LAYOUT:    'HOME_LAYOUT',
  MENU:      'MENU',
  NOTICIAS:  'NOTICIAS',
  ATAS:      'ATAS',
  REUNIOES:  'REUNIOES',
  DOCUMENTOS:'DOCUMENTOS',
  POPUP:     'POPUP',
  BANNERS:   'BANNERS',
  ACADEMIA:  'ACADEMIA_CONSELHEIRO',
};

// ── CACHE ──────────────────────────────────────────────────────
const CACHE_KEY = 'cms_json_v1';
const CACHE_TTL = 300; // segundos (5 min)

// ── CORS HEADERS ───────────────────────────────────────────────
function setCORSHeaders(output) {
  // GAS Web App não permite headers customizados no ContentService,
  // mas publica como JSON público — o fetch do frontend usa no-cors ou
  // redireciona. Usar mode: 'no-cors' ou jsonp se necessário.
  return output;
}

// ── ENDPOINT PRINCIPAL ─────────────────────────────────────────
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'full';

  const output = ContentService
    .createTextOutput(getPayload(action))
    .setMimeType(ContentService.MimeType.JSON);

  return output;
}

// ── PAYLOAD COM CACHE ──────────────────────────────────────────
function getPayload(action) {
  const cache = CacheService.getScriptCache();
  const cacheKey = `${CACHE_KEY}_${action}`;
  const cached = cache.get(cacheKey);

  if (cached) return cached;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let data;

  switch (action) {
    case 'full':
      data = buildFullPayload(ss); break;
    case 'noticias':
      data = readSheet(ss, ABA.NOTICIAS, filterPublicado, sortDataDesc); break;
    case 'reunioes':
      data = readSheet(ss, ABA.REUNIOES, filterFuturas, sortDataAsc); break;
    case 'documentos':
      data = readSheet(ss, ABA.DOCUMENTOS, filterPublicado, sortDataDesc); break;
    case 'atas':
      data = readSheet(ss, ABA.ATAS, filterPublicado, sortDataDesc); break;
    case 'academia':
      data = readSheet(ss, ABA.ACADEMIA, filterPublicado, sortDataDesc); break;
    default:
      data = { error: 'action inválida', actions_validas: ['full','noticias','reunioes','documentos','atas','academia'] };
  }

  const json = JSON.stringify(data);
  cache.put(cacheKey, json, CACHE_TTL);
  return json;
}

// ── BUILD PAYLOAD COMPLETO ─────────────────────────────────────
function buildFullPayload(ss) {
  const hoje = new Date();

  return {
    _gerado_em: hoje.toISOString(),
    _versao:    '1.0',
    config:     readConfig(ss),
    theme:      readTheme(ss),
    menu:       readSheet(ss, ABA.MENU,      filterAtivo,    sortOrdem),
    home_layout:readSheet(ss, ABA.LAYOUT,    filterAtivo,    sortOrdem),
    noticias:   readSheet(ss, ABA.NOTICIAS,  filterPublicado, sortDataDesc),
    atas:       readSheet(ss, ABA.ATAS,      filterPublicado, sortDataDesc),
    reunioes:   readSheet(ss, ABA.REUNIOES,  filterFuturas,   sortDataAsc),
    documentos: readSheet(ss, ABA.DOCUMENTOS,filterPublicado, sortDataDesc),
    popup:      readPopup(ss, hoje),
    banners:    readBanners(ss, hoje),
    academia:   readSheet(ss, ABA.ACADEMIA,  filterPublicado, sortDataDesc),
  };
}

// ── LEITURA GENÉRICA DE ABA ────────────────────────────────────
function readSheet(ss, nomeAba, filterFn, sortFn) {
  const sheet = ss.getSheetByName(nomeAba);
  if (!sheet) {
    Logger.log(`[AVISO] Aba não encontrada: ${nomeAba}`);
    return [];
  }

  const range = sheet.getDataRange();
  if (range.getNumRows() < 2) return []; // só header, sem dados

  const [headers, ...rows] = range.getValues();

  let data = rows
    .filter(r => r.some(c => c !== '')) // remove linhas completamente vazias
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        const key = h.toString().toLowerCase().trim().replace(/\s+/g, '_');
        if (key) obj[key] = _normalize(row[i]);
      });
      return obj;
    });

  if (filterFn) data = data.filter(filterFn);
  if (sortFn)   data = data.sort(sortFn);
  return data;
}

// ── CONFIG: key → valor em objeto ─────────────────────────────
function readConfig(ss) {
  const rows = readSheet(ss, ABA.CONFIG);
  const obj = {};
  rows.forEach(r => {
    if (r.chave) obj[r.chave] = r.valor;
  });
  return obj;
}

// ── THEME: array de tokens CSS ────────────────────────────────
function readTheme(ss) {
  return readSheet(ss, ABA.THEME);
}

// ── POPUP com filtro de data ───────────────────────────────────
function readPopup(ss, hoje) {
  return readSheet(ss, ABA.POPUP, row => {
    if (!row.ativo) return false;
    if (row.data_inicio && new Date(row.data_inicio) > hoje) return false;
    if (row.data_fim   && new Date(row.data_fim)   < hoje) return false;
    return true;
  }, (a, b) => (a.prioridade || 99) - (b.prioridade || 99));
}

// ── BANNERS com expiração ─────────────────────────────────────
function readBanners(ss, hoje) {
  return readSheet(ss, ABA.BANNERS, row => {
    if (!row.ativo) return false;
    if (row.data_expiracao && new Date(row.data_expiracao) < hoje) return false;
    return true;
  });
}

// ── NORMALIZAÇÃO de células ────────────────────────────────────
function _normalize(val) {
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (val === 'TRUE'  || val === true)  return true;
  if (val === 'FALSE' || val === false) return false;
  if (val === '') return null;
  return val;
}

// ── FILTROS ────────────────────────────────────────────────────
const filterAtivo      = r => r.ativo === true;
const filterPublicado  = r => r.status === 'publicado';
const filterFuturas    = r => r.status === 'agendada';

// ── ORDENAÇÕES ──────────────────────────────────────────────────
const sortOrdem    = (a, b) => (a.ordem || 99) - (b.ordem || 99);
const sortDataDesc = (a, b) => new Date(b.data_publicacao || b.data || 0) - new Date(a.data_publicacao || a.data || 0);
const sortDataAsc  = (a, b) => new Date(a.data || 0) - new Date(b.data || 0);

// ── INVALIDAR CACHE (chamar manualmente ou via trigger) ────────
function invalidarCache() {
  const cache = CacheService.getScriptCache();
  cache.removeAll([
    'cms_json_v1_full',
    'cms_json_v1_noticias',
    'cms_json_v1_reunioes',
    'cms_json_v1_documentos',
    'cms_json_v1_atas',
    'cms_json_v1_academia',
  ]);
  Logger.log('Cache invalidado em: ' + new Date().toISOString());
}

// ── TRIGGER: Invalidar cache ao editar a planilha ──────────────
// Para ativar: Gatilhos → onEdit → instalar como trigger de planilha
function onEdit(e) {
  invalidarCache();
}

// ── TESTE LOCAL (executar no editor GAS para debugar) ──────────
function testarPayload() {
  const json = getPayload('full');
  const obj = JSON.parse(json);
  Logger.log('Chaves: ' + Object.keys(obj).join(', '));
  Logger.log('Noticias: ' + (obj.noticias || []).length);
  Logger.log('Reunioes: ' + (obj.reunioes || []).length);
  Logger.log('Config: ' + JSON.stringify(obj.config));
}
