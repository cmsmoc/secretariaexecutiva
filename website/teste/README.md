# CMS-MOC · Mini CMS com Google Sheets + GAS

> Site estático do Conselho Municipal de Saúde de Montes Claros  
> Stack: Google Sheets (dados) → Apps Script (API JSON) → HTML/JS (frontend) → GitHub Pages (hospedagem)

---

## Estrutura do projeto

```
cms-moc/
├── index.html              ← página principal (shell)
├── css/
│   ├── base.css            ← estilos globais, componentes
│   └── theme.css           ← variáveis CSS (substituídas pelo Sheets)
├── js/
│   ├── main.js             ← orquestrador geral
│   ├── api.js              ← fetch do GAS + cache
│   ├── theme.js            ← aplica tokens de cor do JSON
│   ├── popup.js            ← popup com controle localStorage
│   └── modules/
│       ├── index.js        ← barrel de todos os templates
│       ├── hero-banner.js  ← banner principal
│       ├── stat-cards.js   ← cards de indicadores
│       ├── feed-cards.js   ← notícias em cards
│       ├── lista-datas.js  ← próximas reuniões
│       ├── doc-lista.js    ← lista de documentos
│       ├── grid-cards.js   ← Academia do Conselheiro
│       └── acesso-rapido.js← atalhos para cidadãos
├── pages/
│   ├── noticias.html
│   ├── atas.html
│   ├── documentos.html
│   └── academia.html
└── gas/
    └── Code.gs             ← cole no Google Apps Script
```

---

## PASSO 1 — Criar a Planilha Google Sheets

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma nova planilha
2. Renomeie-a para: **CMS-MOC**
3. Crie as seguintes abas (aba = sheet tab), com exatamente esses nomes:

| Aba | Finalidade |
|---|---|
| `CONFIG` | Configurações gerais (chave/valor) |
| `THEME` | Tokens de cores CSS |
| `MENU` | Itens de navegação |
| `HOME_LAYOUT` | Ordem e ativação dos módulos da home |
| `NOTICIAS` | Publicações e notícias |
| `ATAS` | Atas de reuniões passadas |
| `REUNIOES` | Reuniões futuras agendadas |
| `DOCUMENTOS` | Repositório de documentos |
| `POPUP` | Configuração de popups |
| `BANNERS` | Banners do site |
| `ACADEMIA_CONSELHEIRO` | Conteúdos educativos |

### Cabeçalhos de cada aba

**CONFIG** (colunas: `chave` | `valor`)
```
chave                    | valor
site_nome                | Conselho Municipal de Saúde de Montes Claros
site_sigla               | CMS-MOC
site_descricao           | Participação e controle social na saúde pública
contato_email            | cms@montesclaros.mg.gov.br
total_conselheiros       | 48
reunioes_por_ano         | 12
anos_atuacao             | 30
total_documentos         | 350
```

**THEME** (colunas: `token` | `valor` | `grupo`)
```
token              | valor   | grupo
--color-primary    | #0D2E5A | cores
--color-secondary  | #1B6CB5 | cores
--color-accent     | #F5C400 | cores
--color-success    | #1E8A4A | cores
--color-bg         | #F7F8FA | cores
```

**MENU** (colunas: `label` | `url` | `ordem` | `ativo` | `externo`)
```
label      | url                  | ordem | ativo | externo
Início     | /                    | 1     | TRUE  | FALSE
Notícias   | pages/noticias.html  | 2     | TRUE  | FALSE
Atas       | pages/atas.html      | 3     | TRUE  | FALSE
Documentos | pages/documentos.html| 4     | TRUE  | FALSE
Academia   | pages/academia.html  | 5     | TRUE  | FALSE
```

**HOME_LAYOUT** (colunas: `modulo_id` | `template` | `ordem` | `ativo` | `fonte_dados` | `titulo_override` | `limite` | `fundo`)
```
modulo_id    | template     | ordem | ativo | fonte_dados          | titulo_override      | limite | fundo
hero         | hero-banner  | 1     | TRUE  | banners              |                      |        | 
acesso_rapido| acesso-rapido| 2     | TRUE  | config               | Acesso Rápido        |        | white
stats        | stat-cards   | 3     | TRUE  | config               | Conselho em Números  |        | off-white
noticias     | feed-cards   | 4     | TRUE  | noticias             | Últimas Notícias     | 6      | white
reunioes     | lista-datas  | 5     | TRUE  | reunioes             | Próximas Reuniões    | 5      | off-white
documentos   | doc-lista    | 6     | TRUE  | documentos           | Documentos Recentes  | 8      | white
academia     | grid-cards   | 7     | FALSE | academia_conselheiro  | Academia             | 6      | off-white
```

**NOTICIAS** (colunas: `id` | `titulo` | `resumo` | `data_publicacao` | `categoria` | `slug` | `status` | `destaque`)
```
Categorias válidas: resolucao | reuniao | conferencia | informe | deliberacao
Status válidos: rascunho | publicado
```

**REUNIOES** (colunas: `numero` | `tipo` | `data` | `horario` | `local` | `pauta_url` | `status`)
```
Tipos: ordinaria | extraordinaria | especial
Status: agendada | realizada | cancelada
```

**ATAS** (colunas: `numero` | `tipo` | `data` | `status_ata` | `pdf_url` | `pauta_resumo` | `destaque`)
```
status_ata: pendente | publicada | arquivada
```

**DOCUMENTOS** (colunas: `id` | `titulo` | `tipo` | `data` | `url` | `tamanho_kb` | `status` | `destaque`)
```
Tipos: resolucao | ata | relatorio | legislacao | formulario | material
```

**POPUP** (colunas: `id` | `ativo` | `prioridade` | `titulo` | `mensagem` | `botao_label` | `botao_url` | `data_inicio` | `data_fim` | `frequencia`)
```
frequencia: sempre | uma_vez | por_sessao
```

**BANNERS** (colunas: `id` | `ativo` | `posicao` | `titulo` | `subtitulo` | `cta_label` | `cta_url` | `cor_fundo` | `data_expiracao`)
```
posicao: hero | topo | rodape
```

**ACADEMIA_CONSELHEIRO** (colunas: `id` | `titulo` | `descricao` | `tipo_conteudo` | `url` | `categoria` | `nivel` | `data_publicacao` | `status` | `destaque` | `duracao_min`)
```
tipo_conteudo: pdf | video | texto | oficina | link
nivel: basico | intermediario | avancado
```

---

## PASSO 2 — Configurar o Google Apps Script (GAS)

1. Na sua planilha, clique em **Extensões → Apps Script**
2. Apague o código padrão (`function myFunction() {}`)
3. Cole **todo o conteúdo** do arquivo `gas/Code.gs` deste repositório
4. Salve com `Ctrl+S` (ou `Cmd+S`)
5. No menu esquerdo, clique em **Executar → testarPayload** para confirmar que lê a planilha corretamente
   - Aceite as permissões quando solicitado (é a sua própria conta)
   - Veja o log: deve aparecer as chaves do payload

### Deployar como Web App

1. Clique em **Implantar → Novo deployment**
2. Em "Tipo", selecione **Aplicativo Web**
3. Configure:
   - **Descrição**: `CMS-MOC v1.0`
   - **Executar como**: `Eu mesmo (seu@email.com)`
   - **Quem tem acesso**: `Qualquer pessoa`
4. Clique em **Implantar**
5. **Copie a URL gerada** — ela tem o formato:
   ```
   https://script.google.com/macros/s/AKfy.../exec
   ```
6. Teste no navegador: abra `{sua-url}?action=full` — deve retornar um JSON

> ⚠️ **Importante**: cada vez que alterar o código `.gs`, você deve criar um novo deployment (Implantar → Gerenciar deployments → editar → nova versão). Alterações na **planilha** não precisam de redeploy.

---

## PASSO 3 — Configurar o Frontend

Em **todos** os arquivos HTML (`index.html` e todos em `pages/`), localize:

```html
<meta name="gas-endpoint" content="COLE_SUA_URL_GAS_AQUI">
```

e substitua `COLE_SUA_URL_GAS_AQUI` pela URL do seu GAS. Exemplo:

```html
<meta name="gas-endpoint" content="https://script.google.com/macros/s/AKfy.../exec">
```

Arquivos para editar:
- `index.html`
- `pages/noticias.html`
- `pages/atas.html`
- `pages/documentos.html`
- `pages/academia.html`

---

## PASSO 4 — Deploy no GitHub Pages

### 4a. Criar repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `cms-moc` (ou `site-cms-montesclaros`)
3. Deixe **Público** (necessário para GitHub Pages gratuito)
4. Clique em **Create repository**

### 4b. Fazer upload dos arquivos

**Opção A — Via interface web (mais rápido):**

1. No repositório criado, clique em **Add file → Upload files**
2. Arraste toda a pasta `cms-moc/` (ou selecione todos os arquivos)
3. Clique em **Commit changes**

**Opção B — Via Git (recomendado para manutenção):**

```bash
# Na pasta cms-moc/ do seu computador:
git init
git add .
git commit -m "feat: CMS-MOC v1.0 - deploy inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cms-moc.git
git push -u origin main
```

### 4c. Ativar GitHub Pages

1. No repositório, clique em **Settings** (configurações)
2. No menu lateral, clique em **Pages**
3. Em "Source", selecione: **Deploy from a branch**
4. Branch: `main` / Pasta: `/ (root)`
5. Clique em **Save**
6. Aguarde ~2 minutos. O site estará disponível em:
   ```
   https://SEU_USUARIO.github.io/cms-moc/
   ```

---

## PASSO 5 — Testar o sistema

Abra o site e verifique no console do navegador (`F12 → Console`):

✅ Sem erros em vermelho  
✅ Módulos carregando (hero, stats, notícias, reuniões...)  
✅ Tema visual correto (cores do Sheets)  

**Teste rápido de ponta a ponta:**
1. Abra a planilha
2. Na aba `NOTICIAS`, adicione uma linha com `status = publicado`
3. Aguarde 5 minutos (ou execute `invalidarCache()` no GAS)
4. Recarregue o site — a notícia deve aparecer

---

## Operação diária

### Publicar uma notícia
1. Aba `NOTICIAS` → nova linha no final
2. Preencher: `titulo`, `resumo`, `data_publicacao` (AAAA-MM-DD), `categoria`
3. Deixar `status = rascunho` para revisar
4. Quando pronto: mudar `status` para `publicado`
5. Site atualiza em até 5 minutos

### Invalidar cache imediatamente
1. Abrir Apps Script da planilha
2. Selecionar a função `invalidarCache` no menu
3. Clicar em ▶ Executar

### Desativar um módulo da home
1. Aba `HOME_LAYOUT`
2. Linha do módulo → coluna `ativo` → mudar para `FALSE`
3. O módulo some do site sem apagar os dados

### Ativar um popup
1. Aba `POPUP` → nova linha
2. Preencher: `titulo`, `mensagem`, `botao_label`, `botao_url`
3. `ativo = TRUE`, `frequencia = uma_vez`
4. Site mostra o popup na próxima visita

---

## Atualizar código após mudanças

Sempre que modificar qualquer arquivo `.html`, `.css` ou `.js`:

```bash
git add .
git commit -m "fix: descrição da mudança"
git push origin main
```

O GitHub Pages atualiza automaticamente em ~1 minuto.

Se modificar o `Code.gs` do GAS:
1. Salvar no editor GAS
2. Implantar → Gerenciar deployments → editar → selecionar "Nova versão" → Implantar

---

## Troubleshooting

| Problema | Solução |
|---|---|
| Site carrega mas sem dados | Verificar URL do GAS no meta tag `gas-endpoint` |
| JSON retorna erro | Abrir URL do GAS no navegador e ler a mensagem |
| Dados desatualizados | Executar `invalidarCache()` no GAS |
| Módulo não aparece | Verificar `ativo = TRUE` e `template` correto no HOME_LAYOUT |
| Cores erradas | Verificar coluna `token` e `valor` na aba THEME |
| Popup não aparece | Verificar `ativo = TRUE` e datas de `data_inicio`/`data_fim` |
| Erro CORS | O GAS com "Qualquer pessoa" já resolve — não usar `mode: 'cors'` no fetch |

---

## Governança

- Nunca apagar linhas — use `status = arquivado` ou `ativo = FALSE`
- Datas sempre no formato `AAAA-MM-DD`
- Booleanos: `TRUE` ou `FALSE` (maiúsculo)
- Não mesclar células
- IDs sequenciais, nunca reutilizados
- Novas seções: nova aba + novo arquivo JS em `modules/` + linha em `HOME_LAYOUT`
- Fazer backup mensal via Google Takeout

---

## Stack técnica resumida

```
Editor (Sheets) → GAS (API JSON) → fetch() → JS Modules → DOM
     ↑                  ↑                                    ↓
  Sem código        Cache 5 min                       Cidadão vê
```

**Custo**: R$ 0,00 — usa GitHub Pages gratuito + Google Workspace gratuito
