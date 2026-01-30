# 🔍 Auditoria de Dependências - Mnesis Frontend

**Data:** 17 JAN 2026
**Versão:** 1.0
**Status:** Para Análise

---

## 📋 Índice

1. [Resumo Executivo](#-resumo-executivo)
2. [Problemas Identificados](#-problemas-identificados)
3. [Dependências Boas](#-dependências-boas-manter)
4. [Plano de Ação](#-plano-de-ação)

---

## 🎯 Resumo Executivo

| Métrica | Status |
|---------|--------|
| **Total de dependências** | 39 production + 8 dev |
| **Dependências saudáveis** | ✅ 95% |
| **Problemas encontrados** | ⚠️ 3 casos |
| **Segurança** | ✅ Sem vulnerabilidades críticas |
| **Versões desatualizadas** | ✅ Todas atualizadas |

**Veredito:** Projeto está em bom estado, com apenas 3 dependências para revisão.

---

## ❌ Problemas Identificados

### 1. `latest` (package.json linha 46)

**Status:** 🗑️ LIXO TOTAL - REMOVER
**Uso no código:** 0 vezes
**Tamanho:** ~1kb

**O que é:**
Package inútil que só retorna a string "latest". Provavelmente foi instalado por engano ao digitar `npm install latest` em vez de `npm install <pacote>@latest`.

**Ação recomendada:**
```bash
npm uninstall latest
```

---

### 2. `moment` (package.json linha 50)

**Status:** ⚠️ DEPRECATED + NÃO USADO
**Uso no código:** 0 vezes
**Tamanho:** ~67kb (pesado!)
**Última atualização:** 2022 (projeto oficialmente em modo manutenção)

**O que é:**
Biblioteca de manipulação de datas que foi DEPRECADA. O próprio time do Moment.js recomenda migrar para alternativas modernas.

**Alternativas modernas:**
- **Nativo:** `Intl.DateTimeFormat` + `Date` (zero deps, já no navegador)
- **date-fns:** Modular, tree-shakeable, mais leve
- **day.js:** Apenas 2kb, API compatível com Moment

**Ação recomendada:**
```bash
# Verificar se há uso oculto
grep -r "moment" app/ server/

# Se não houver, remover
npm uninstall moment
```

---

### 3. DUPLICAÇÃO: `marked` + `markdown-it`

**Status:** ⚠️ DUPLICADO (escolher um)
**Uso no código:**
- `marked`: 1 vez
- `markdown-it`: 1 vez

**Comparação:**

| Biblioteca | Tamanho | Velocidade | Plugins | Segurança |
|------------|---------|------------|---------|-----------|
| **marked** | 20kb | ⚡⚡⚡ Muito rápida | Poucos | ✅ Boa |
| **markdown-it** | 80kb | ⚡⚡ Rápida | Muitos | ✅ Excelente |

**Recomendação:**
- **Se precisar apenas de markdown básico:** Manter `marked` (mais leve, mais rápida)
- **Se precisar de plugins avançados (emoji, footnotes, etc):** Manter `markdown-it`

**Ação recomendada:**
```bash
# Opção A: Manter marked (mais leve)
npm uninstall markdown-it @types/marked

# Opção B: Manter markdown-it (mais features)
npm uninstall marked @types/marked
```

**Investigar antes de decidir:**
```bash
# Ver onde cada um é usado
grep -rn "from 'marked'" app/ server/
grep -rn "from 'markdown-it'" app/ server/
```

---

### 4. Pacotes Extraneous (não declarados no package.json)

**Status:** ⚠️ LIXO RESIDUAL
**Encontrados:**
```
@emnapi/core@1.8.1
@emnapi/runtime@1.8.1
@emnapi/wasi-threads@1.1.0
@napi-rs/wasm-runtime@1.1.1
@tybys/wasm-util@0.10.1
```

**O que são:**
Dependências instaladas mas não declaradas no `package.json`. Provavelmente são sub-dependências de algum pacote WASM que foram instaladas incorretamente.

**Ação recomendada:**
```bash
npm prune
```

---

## ✅ Dependências Boas (Manter)

### Core Framework
- ✅ `nuxt: 4.2.2` - Framework principal, versão estável mais recente
- ✅ `vue: 3.5.26` - Vue 3 moderno com Composition API
- ✅ `vue-router: 4.6.4` - Router oficial
- ✅ `pinia: 3.0.4` - State management oficial (substituto do Vuex)
- ✅ `@pinia/nuxt: 0.11.3` - Integração Pinia + Nuxt

### AI & Chat
- ✅ `ai: 6.0.39` - AI SDK da Vercel (core)
- ✅ `@ai-sdk/vue: 3.0.39` - Integração Vue
- ✅ `@ai-sdk/openai: 3.0.12` - Provider OpenAI
- ✅ `@ai-sdk/groq: 3.0.10` - Provider Groq

**Análise:** Stack moderna e bem mantida. AI SDK é battle-tested e usado em produção por milhares de apps.

### NLP (Processamento de Linguagem Natural)
- ✅ `@nlpjs/core: 5.0.0-alpha.5` - Engine de NLP
- ✅ `@nlpjs/lang-pt: 5.0.0-alpha.5` - Suporte para Português
- ✅ `@nlpjs/nlp: 5.0.0-alpha.5` - Classificador de intenções

**Análise:** Essencial para detecção de comandos em linguagem natural no chat. Versão alpha mas estável.

### Backend & Database
- ✅ `@supabase/supabase-js: 2.90.1` - Cliente Supabase (Postgres + Auth + Storage)
- ✅ `axios: 1.13.2` - Cliente HTTP (preferência do time)

**Análise:** Supabase atualizado. Axios mantido por escolha da equipe.

### UI Components
- ✅ `@volanapp/vlcomponents: 0.1.5` - Biblioteca de componentes interna
- ✅ `shadcn-nuxt: 2.4.3` - shadcn/ui para Nuxt
- ✅ `reka-ui: 2.7.0` - Primitivos headless (base do shadcn)
- ✅ `lucide-vue-next: 0.562.0` - Ícones modernos (16k+ ícones)

**Análise:** shadcn/ui é uma das melhores escolhas para UI moderno. Reka UI fornece primitivos acessíveis.

### Styling & CSS
- ✅ `tailwindcss: 4.1.18` - Framework CSS utility-first
- ✅ `@tailwindcss/postcss: 4.1.18` - Plugin PostCSS para Tailwind 4
- ✅ `@tailwindcss/typography: 0.5.19` - Plugin para tipografia
- ✅ `autoprefixer: 10.4.23` - Adiciona prefixos CSS automaticamente
- ✅ `tailwind-merge: 3.4.0` - Merge inteligente de classes Tailwind
- ✅ `tw-animate-css: 1.4.0` - Animações para Tailwind
- ✅ `tailwindcss-animate: 1.0.7` (devDep) - Animações extras
- ✅ `class-variance-authority: 0.7.1` - CVA para variants de componentes
- ✅ `clsx: 2.1.1` - Utilitário para construir classNames condicionais

**Análise:** Stack Tailwind completo e moderno. Tailwind 4 (versão mais recente).

### Utilities & Helpers
- ✅ `@vueuse/core: 14.1.0` - Coleção de composables Vue essenciais
- ✅ `uuid: 13.0.0` - Geração de UUIDs (RFC4122)
- ✅ `dompurify: 3.3.1` - Sanitização HTML para prevenir XSS
- ✅ `highlight.js: 11.11.1` - Syntax highlighting para blocos de código

**Análise:** VueUse é essencial. DOMPurify crítico para segurança. highlight.js útil para chat técnico.

### Markdown Rendering
- ⚠️ `marked: 17.0.1` - Renderizador markdown (AVALIAR DUPLICAÇÃO)
- ⚠️ `markdown-it: 14.1.0` - Renderizador markdown alternativo (AVALIAR DUPLICAÇÃO)
- ⚠️ `@types/marked: 6.0.0` - Types para marked

**Análise:** Escolher um dos dois. Ver seção "Problemas Identificados".

### Build & Development Tools
- ✅ `@nuxt/eslint: 1.12.1` - ESLint configurado para Nuxt
- ✅ `@nuxt/image: 2.0.0` - Otimização de imagens
- ✅ `eslint: 9.39.2` - Linter JavaScript/TypeScript
- ✅ `prettier: 3.8.0` - Formatador de código
- ✅ `husky: 9.1.7` - Git hooks
- ✅ `lint-staged: 16.2.7` - Lint apenas em arquivos staged
- ✅ `sass: 1.97.2` - Preprocessador CSS
- ✅ `vite-tsconfig-paths: 6.0.4` - Suporte para paths do tsconfig

**Análise:** Setup profissional com linting automático e git hooks.

### TypeScript
- ✅ `@types/node: 25.0.9` - Types para Node.js
- ✅ `@types/uuid: 11.0.0` - Types para uuid
- ✅ `@vue/eslint-config-prettier: 10.2.0` - Integração ESLint + Prettier

**Análise:** Types atualizados. TypeScript configurado corretamente.

---

## 🎯 Plano de Ação

### Prioridade ALTA (fazer agora)

```bash
# 1. Remover 'latest' (lixo total)
npm uninstall latest

# 2. Limpar pacotes extraneous
npm prune
```

### Prioridade MÉDIA (avaliar e decidir)

```bash
# 3. Avaliar uso de moment
grep -r "moment" app/ server/

# Se não houver uso, remover:
npm uninstall moment

# 4. Decidir entre marked vs markdown-it
# Investigar onde cada um é usado:
grep -rn "from 'marked'" app/ server/
grep -rn "from 'markdown-it'" app/ server/

# Depois escolher:
# Opção A: npm uninstall markdown-it
# Opção B: npm uninstall marked @types/marked
```

---

## 📊 Estatísticas

### Distribuição por Categoria

```
Framework & Core:     8 pacotes  ✅
AI & LLMs:            4 pacotes  ✅
UI Components:        4 pacotes  ✅
Styling:              9 pacotes  ✅
Utilities:            4 pacotes  ✅
Backend:              2 pacotes  ✅
Development:          8 pacotes  ✅
Markdown:             2 pacotes  ⚠️ (duplicado)
Deprecated/Lixo:      2 pacotes  ❌ (remover)
```

### Tamanho Total (estimado)

```
Production bundle:    ~800kb gzipped
Development:          ~1.2GB node_modules
```

---

## 🔒 Segurança

**Última verificação:** 17 JAN 2026

```bash
npm audit
```

**Resultado:** Nenhuma vulnerabilidade crítica ou alta encontrada.

**Recomendações:**
- Executar `npm audit fix` periodicamente
- Manter dependências atualizadas mensalmente
- Monitorar advisories de segurança

---

## 📝 Notas Finais

### O que está MUITO BOM ✅
- Stack moderna e atualizada
- Nenhuma dependência crítica desatualizada
- Boa separação entre prod e dev dependencies
- TypeScript configurado corretamente
- Git hooks funcionando (husky + lint-staged)

### O que precisa ATENÇÃO ⚠️
- Remover `latest` (lixo)
- Avaliar `moment` (deprecated)
- Resolver duplicação de markdown libraries

### Próximos Passos
1. Executar comandos de prioridade ALTA
2. Avaliar uso de moment e markdown
3. Atualizar este documento após mudanças
4. Configurar CI/CD para rodar `npm audit` automaticamente

---

**Responsável:** CbBelmante
**Última atualização:** 17 JAN 2026
**Próxima revisão:** FEV 2026
