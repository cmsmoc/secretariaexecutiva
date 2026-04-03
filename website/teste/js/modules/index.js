// ═══════════════════════════════════════════════════════════════
// CMS-MOC · js/modules/index.js
// Barrel de todos os templates de módulo
// Cada chave corresponde ao campo "template" no HOME_LAYOUT
// ═══════════════════════════════════════════════════════════════

export { heroBanner   } from './hero-banner.js';
export { statCards    } from './stat-cards.js';
export { feedCards    } from './feed-cards.js';
export { listaDatas   } from './lista-datas.js';
export { docLista     } from './doc-lista.js';
export { gridCards    } from './grid-cards.js';
export { acessoRapido } from './acesso-rapido.js';

// Mapa de template_id → função (usado pelo main.js)
export const TEMPLATES = {
  'hero-banner':  'heroBanner',
  'stat-cards':   'statCards',
  'feed-cards':   'feedCards',
  'lista-datas':  'listaDatas',
  'doc-lista':    'docLista',
  'grid-cards':   'gridCards',
  'acesso-rapido':'acessoRapido',
};
