# Plano de Migração de Componentes: Corp → CB

**Projeto:** Elas Podem Website
**Objetivo:** Portar componentes do corp-components para cbcomponents para profissionalizar o site
**Data:** 2026-01-29

---

## 📋 Visão Geral

O **cbcomponents** possui atualmente **9 componentes**:
- ✅ CBButton (existente + documentado)
- ✅ CBIcon (existente + documentado)
- ✅ CBNavbar (existente + documentado)
- ✅ CBCard (migrado + documentado)
- ✅ CBImage (migrado + documentado)
- ✅ CBInput (migrado + documentado)
- ✅ CBTextarea (migrado + documentado)
- ✅ CBLabel (migrado + documentado)
- ✅ CBHintLine (interno, usado por CBInput/CBTextarea)

O **site elas_podem** usa atualmente **4 componentes**: CBNavbar, CBButton, CBCard, CBIcon.

O formulário de contato ainda usa **HTML nativo** (`<input>`, `<select>`, `<textarea>`, `<label>`).

---

## 🎯 Fase 1: Componentes Essenciais (CRÍTICO)

### 1.1 Formulários

#### ✅ CBInput — PRONTO (existe no cbcomponents, falta integrar no site)
- **Status:** ✅ Componente criado | ❌ Não integrado no site
- **Ação:** Substituir `<input class="formInput">` no formulário de contato
- **Uso no site:** Campos nome e email do formulário
- **Features disponíveis:**
  - Variants: elevated, outlined, filled, underlined
  - States: disabled, error, success
  - Prepend/append icons
  - Helper text e error messages (via CBHintLine)
  - Máscaras brasileiras (CPF, CNPJ, telefone)
  - Tipos: text, email, password, number, tel, url

#### ✅ CBTextarea — PRONTO (existe no cbcomponents, falta integrar no site)
- **Status:** ✅ Componente criado | ❌ Não integrado no site
- **Ação:** Substituir `<textarea class="formTextarea">` no formulário de contato
- **Uso no site:** Campo de mensagem no formulário
- **Features disponíveis:**
  - Auto-resize
  - Character counter
  - Min/max rows
  - Error states
  - Variants (mesmas do CBInput)

#### ✅ CBLabel — PRONTO (existe no cbcomponents, falta integrar no site)
- **Status:** ✅ Componente criado | ❌ Não integrado no site
- **Ação:** Substituir `<label class="formLabel">` no formulário de contato
- **Uso no site:** Labels dos campos do formulário
- **Features disponíveis:**
  - Tamanhos (xs, sm, md, lg, xl)
  - Cores semânticas e customizadas
  - Modifiers (bold, italic, uppercase, etc)

#### 🎯 CBSelect — CRIAR
- **Origem:** `corp-components/src/components/ui/select/CorpSelect.vue`
- **Destino:** `cbcomponents/src/components/CBSelect.vue`
- **Prioridade:** 🔴 ALTA
- **Uso no site:** Dropdown de assunto no formulário de contato
- **Features necessárias:**
  - Single selection (múltipla é bonus)
  - Placeholder
  - Options com label/value
  - Integração visual com CBInput (mesma estética)
  - Error states
  - Usa reka-ui Select primitives

#### 🎯 CBCheckbox — CRIAR
- **Origem:** `corp-components/src/components/ui/checkbox/CorpCheckbox.vue`
- **Destino:** `cbcomponents/src/components/CBCheckbox.vue`
- **Prioridade:** 🟡 MÉDIA
- **Uso no site:** Termos e condições, newsletter opt-in
- **Features necessárias:**
  - Checked, unchecked, indeterminate
  - Error states
  - Label integrado
  - Usa reka-ui Checkbox primitives

---

### 1.2 Layout & Estrutura

#### ✅ CBCard — PRONTO (existe e já usado no site, mas pode expandir uso)
- **Status:** ✅ Componente criado | ⚠️ Usado parcialmente no site
- **Ação:** Substituir `<div class="programCard">` (4 cards de programas) por CBCard
- **Uso atual:** Cards de contato (3x) + wrapper do formulário (1x)
- **Uso pendente:** Cards de programas (4x), cards de apoiadores (5x), testimonial card

#### ✅ CBImage — PRONTO (existe no cbcomponents, falta integrar no site)
- **Status:** ✅ Componente criado | ❌ Não integrado no site
- **Ação:** Substituir SVG placeholder da seção Missão por CBImage
- **Features disponíveis:**
  - Lazy loading
  - Placeholder/skeleton automático
  - Aspect ratio
  - Fallback image
  - Shapes e efeitos

---

### 1.3 Overlays

#### 🎯 CBPopover — CRIAR (baixa urgência)
- **Origem:** `corp-components/src/components/ui/popover/CorpPopover.vue`
- **Destino:** `cbcomponents/src/components/CBPopover.vue`
- **Prioridade:** 🟢 BAIXA (navbar já gerencia popover internamente)
- **Nota:** O CBNavbar já usa reka-ui Popover internamente para o menu mobile. CBPopover como componente standalone é útil, mas não bloqueia o site.

---

## 📊 Fase 1 - Plano de Execução

### Etapa A: Integrar componentes existentes no site (vitória rápida)

| # | Ação | Componente | Onde no site |
|---|------|-----------|--------------|
| 1 | Substituir `<input>` nativo | CBInput | Formulário contato (nome, email) |
| 2 | Substituir `<textarea>` nativo | CBTextarea | Formulário contato (mensagem) |
| 3 | Substituir `<label>` nativo | CBLabel | Formulário contato (labels) |
| 4 | Substituir `<div class="programCard">` | CBCard | Seção programas (4 cards) |
| 5 | Substituir SVG placeholder | CBImage | Seção missão |

### Etapa B: Criar componentes novos no cbcomponents

| # | Componente | Prioridade | Dependência |
|---|-----------|-----------|-------------|
| 1 | **CBSelect** | 🔴 ALTA | reka-ui Select |
| 2 | **CBCheckbox** | 🟡 MÉDIA | reka-ui Checkbox |

### Etapa C: Integrar componentes novos no site

| # | Ação | Componente | Onde no site |
|---|------|-----------|--------------|
| 1 | Substituir `<select>` nativo | CBSelect | Formulário contato (assunto) |
| 2 | Adicionar checkbox | CBCheckbox | Formulário contato (termos, newsletter) |

---

## 🌟 Fase 2: Componentes de Impacto Visual

### 2.1 Feedback & Interação

#### CBDialog
- **Origem:** `corp-components/src/components/ui/dialog/`
- **Destino:** `cbcomponents/src/components/CBDialog.vue`
- **Prioridade:** 🟡 MÉDIA
- **Uso no site:**
  - Modal de doação
  - Confirmação de envio de formulário
  - Galeria de imagens expandida
- **Features necessárias:**
  - Portal/Teleport
  - Backdrop com blur
  - Animações de entrada/saída
  - Persistent mode
  - Max-width customizável
  - Slots: header, content, actions

#### CBSheet
- **Origem:** `corp-components/src/components/ui/sheet/`
- **Destino:** `cbcomponents/src/components/CBSheet.vue`
- **Prioridade:** 🟡 MÉDIA
- **Uso no site:** Drawer lateral para informações extras
- **Features necessárias:**
  - Side: left, right, top, bottom
  - Backdrop
  - Animações slide

#### CBBadge
- **Origem:** `corp-components/src/components/ui/badge/CorpBadge.vue`
- **Destino:** `cbcomponents/src/components/CBBadge.vue`
- **Prioridade:** 🟡 MÉDIA
- **Uso no site:**
  - Tags nas estatísticas (2.500+, 45, R$ 1.2M)
  - Status de projetos
  - Categorias
- **Features necessárias:**
  - Variants: default, success, warning, error, info
  - Sizes: sm, md, lg
  - Dot variant
  - Icon support

---

### 2.2 Estados & Feedback

#### CBSkeleton
- **Origem:** `corp-components/src/components/ui/skeleton/`
- **Destino:** `cbcomponents/src/components/CBSkeleton.vue`
- **Prioridade:** 🟡 MÉDIA
- **Uso no site:** Loading states ao carregar dados da API
- **Features necessárias:**
  - Shapes: text, circle, rectangle
  - Animation: pulse, wave
  - Custom dimensions

#### CBProgress
- **Origem:** `corp-components/src/components/ui/progress/CorpProgressBar.vue`
- **Destino:** `cbcomponents/src/components/CBProgress.vue`
- **Prioridade:** 🟡 MÉDIA
- **Uso no site:**
  - Meta de doações atingida
  - Progresso de campanhas
  - Indicadores de impacto
- **Features necessárias:**
  - Linear e circular
  - Determinate e indeterminate
  - Colors customizáveis
  - Label/value display

---

## 💡 Fase 3: Polish & Refinamento

### 3.1 Utilidades

#### CBCollapsible
- **Prioridade:** 🟢 BAIXA
- **Uso no site:** FAQ, "Leia Mais" expandível

#### CBSeparator
- **Prioridade:** 🟢 BAIXA
- **Uso no site:** Divisores visuais entre seções

#### CBTooltip
- **Prioridade:** 🟢 BAIXA
- **Uso no site:** Hints, ajuda contextual

#### CBSwitch
- **Prioridade:** 🟢 BAIXA
- **Uso no site:** Toggle newsletter, preferências

---

## 📦 Dependências Compartilhadas

### Já existe em ambos:
- ✅ **reka-ui** (v2.7.0)
- ✅ **vue** (v3.5.x)
- ✅ **lucide-vue-next** (ícones)
- ✅ **@vueuse/core** (v14.1.0)

### Já resolvido no cbcomponents:
- ✅ **CbColorUtils.ts** - Resolver cores semânticas
- ✅ **cn()** - Merge de classes (src/utils/cn.ts)
- ✅ **resolveRounded()** - Resolver border-radius
- ✅ **theme.ts + generateTheme** - Sistema de variáveis CSS

### NÃO usa (por design):
- ❌ **class-variance-authority** (CVA) - cbcomponents usa CSS puro
- ❌ **tailwind-merge** - cbcomponents usa cn() próprio
- ❌ **Tailwind** - cbcomponents usa CSS Variables first

---

## 📝 Checklist Geral

### Fase 1 - Componentes no cbcomponents
- [x] CBButton ✅
- [x] CBIcon ✅
- [x] CBNavbar ✅
- [x] CBCard ✅
- [x] CBImage ✅
- [x] CBInput ✅
- [x] CBTextarea ✅
- [x] CBLabel ✅
- [ ] CBSelect 🎯
- [ ] CBCheckbox 🎯
- [ ] CBPopover (baixa urgência)

### Fase 1 - Integrações no site elas_podem
- [ ] Substituir `<input>` → CBInput no formulário
- [ ] Substituir `<textarea>` → CBTextarea no formulário
- [ ] Substituir `<label>` → CBLabel no formulário
- [ ] Substituir `<select>` → CBSelect no formulário
- [ ] Adicionar CBCheckbox no formulário (termos, newsletter)
- [ ] Substituir `<div class="programCard">` → CBCard nos programas
- [ ] Substituir SVG placeholder → CBImage na missão

### Fase 2
- [ ] CBDialog
- [ ] CBSheet
- [ ] CBBadge
- [ ] CBSkeleton
- [ ] CBProgress

### Fase 3
- [ ] CBCollapsible
- [ ] CBSeparator
- [ ] CBTooltip
- [ ] CBSwitch

### Infraestrutura ✅ (tudo resolvido)
- [x] @vueuse/core no cbcomponents ✅
- [x] CbColorUtils.ts ✅
- [x] cn.ts ✅
- [x] resolveRounded.ts ✅
- [x] theme.ts + generateTheme ✅
- [x] Auto-discovery (routes.ts + discoveryUtils.ts) ✅

---

## 📊 Impacto Esperado

### Antes (atual):
- 4 componentes usados no site (Navbar, Button, Card, Icon)
- Formulário com HTML nativo (sem validação, sem estilo consistente)
- Cards de programas com div puro
- Placeholder SVG na missão

### Depois (Fase 1 completa):
- 9+ componentes usados no site
- Formulário profissional com CBInput, CBTextarea, CBSelect, CBLabel, CBCheckbox
- Cards de programas usando CBCard (hover, elevation, slots)
- Imagem real na missão com CBImage (lazy loading, fallback)
- Aparência consistente e polida
- Site pronto para produção 🚀

---

**Última atualização:** 2026-02-07
**Status:** 🚧 Em progresso - 8/11 componentes Fase 1 criados (72.7%) | 0/7 integrações no site

### Progresso Atual (cbcomponents):
- ✅ **CBButton** - Componente base com variants, cores, tamanhos, ícones e estados
- ✅ **CBIcon** - Sistema de ícones Lucide com cores e tamanhos customizados
- ✅ **CBNavbar** - Navbar responsiva com dropdowns e menu mobile
- ✅ **CBCard** - Cards com variants, densities, elevations e slots
- ✅ **CBImage** - Imagens com lazy loading, shapes, sizes e efeitos
- ✅ **CBInput** - Input com máscaras brasileiras, validação e ícones
- ✅ **CBTextarea** - Textarea com auto-resize, counter, validação
- ✅ **CBLabel** - Typography com tamanhos, cores e modifiers
- ✅ **Auto-discovery** - Sistema automático de rotas e documentação

### Próximos passos:
1. 🎯 **Criar CBSelect** no cbcomponents (reka-ui Select)
2. 🎯 **Criar CBCheckbox** no cbcomponents (reka-ui Checkbox)
3. 🔄 **Integrar** CBInput, CBTextarea, CBLabel, CBSelect, CBCheckbox no formulário do site
4. 🔄 **Expandir** uso de CBCard nos program cards e supporter cards
5. 🔄 **Integrar** CBImage na seção missão
