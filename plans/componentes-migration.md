# Plano de Migração de Componentes: Corp → CB

**Projeto:** Elas Podem Website
**Objetivo:** Portar componentes do corp-components para cbcomponents para profissionalizar o site
**Data:** 2026-01-29

---

## 📋 Visão Geral

Atualmente o **cbcomponents** tem apenas 3 componentes:
- ✅ CBButton
- ✅ CBIcon
- ✅ CBNavbar

Precisamos portar componentes do **corp-components** (que usa reka-ui + shadcn) para criar uma biblioteca completa.

---

## 🎯 Fase 1: Componentes Essenciais (CRÍTICO)

### 1.1 Formulários

#### CBInput
- **Origem:** `corp-components/src/components/ui/input/CorpInput.vue`
- **Destino:** `cbcomponents/src/components/CBInput.vue`
- **Prioridade:** 🔴 ALTA
- **Uso no site:** Formulário de contato (nome, email)
- **Features necessárias:**
  - Variants: outlined, filled, underlined
  - States: disabled, error, success
  - Prepend/append icons
  - Helper text e error messages
  - Tipos: text, email, password, number, tel, url

#### CBTextarea
- **Origem:** `corp-components/src/components/ui/textarea/CorpTextarea.vue`
- **Destino:** `cbcomponents/src/components/CBTextarea.vue`
- **Prioridade:** 🔴 ALTA
- **Uso no site:** Campo de mensagem no formulário
- **Features necessárias:**
  - Auto-resize
  - Character counter
  - Min/max rows
  - Error states

#### CBSelect
- **Origem:** `corp-components/src/components/ui/select/CorpSelect.vue`
- **Destino:** `cbcomponents/src/components/CBSelect.vue`
- **Prioridade:** 🔴 ALTA
- **Uso no site:** Dropdown de assunto no formulário
- **Features necessárias:**
  - Single/multiple selection
  - Search/filter
  - Custom options template
  - Placeholder

#### CBLabel
- **Origem:** `corp-components/src/components/ui/label/`
- **Destino:** `cbcomponents/src/components/CBLabel.vue`
- **Prioridade:** 🟡 MÉDIA
- **Uso no site:** Labels dos formulários
- **Features necessárias:**
  - Required indicator
  - Associação com input (for/id)

#### CBCheckbox
- **Origem:** `corp-components/src/components/ui/checkbox/CorpCheckbox.vue`
- **Destino:** `cbcomponents/src/components/CBCheckbox.vue`
- **Prioridade:** 🟡 MÉDIA
- **Uso no site:** Termos e condições, newsletter opt-in
- **Features necessárias:**
  - Checked, unchecked, indeterminate
  - Error states
  - Label integration

---

### 1.2 Layout & Estrutura

#### CBCard
- **Origem:** `corp-components/src/components/ui/card/CorpCard.vue`
- **Destino:** `cbcomponents/src/components/CBCard.vue`
- **Prioridade:** 🔴 ALTA
- **Uso no site:**
  - Cards de programas (📚 Educação, 💼 Empreendedorismo, etc)
  - Cards de apoiadores
  - Testimonials
- **Features necessárias:**
  - Slots: header, content, actions, footer
  - Variants: outlined, elevated, flat
  - Hover effects
  - Image support

#### CBImage
- **Origem:** `corp-components/src/components/ui/image/CorpImage.vue`
- **Destino:** `cbcomponents/src/components/CBImage.vue`
- **Prioridade:** 🔴 ALTA
- **Uso no site:** Imagens nas seções (atualmente placeholders)
- **Features necessárias:**
  - Lazy loading
  - Placeholder/skeleton automático
  - Aspect ratio
  - Fallback image
  - Loading states

---

### 1.3 Overlays

#### CBPopover
- **Origem:** `corp-components/src/components/ui/popover/CorpPopover.vue`
- **Destino:** `cbcomponents/src/components/CBPopover.vue`
- **Prioridade:** 🔴 ALTA
- **Uso no site:** Mobile menu do navbar (modo popover)
- **Features necessárias:**
  - Triggers: click, hover, focus
  - Positioning (floating-ui via reka-ui)
  - Portal/Teleport
  - Collision detection
  - Animações

**Dependências do CBPopover:**
- `Popover.vue` (wrapper do PopoverRoot reka-ui)
- `PopoverTrigger.vue` (wrapper do PopoverTrigger reka-ui)
- `PopoverContent.vue` (wrapper do PopoverContent + Portal reka-ui)

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
- **Origem:** `corp-components/src/components/ui/collapsible/`
- **Destino:** `cbcomponents/src/components/CBCollapsible.vue`
- **Prioridade:** 🟢 BAIXA
- **Uso no site:**
  - FAQ (se adicionarmos seção)
  - "Leia Mais" expandível
  - Detalhes de programas
- **Features necessárias:**
  - Accordion mode (múltiplos collapsibles)
  - Animações suaves
  - Icon toggle

#### CBSeparator
- **Origem:** `corp-components/src/components/ui/separator/`
- **Destino:** `cbcomponents/src/components/CBSeparator.vue`
- **Prioridade:** 🟢 BAIXA
- **Uso no site:** Divisores visuais entre seções
- **Features necessárias:**
  - Horizontal e vertical
  - Variants: solid, dashed, dotted
  - Thickness customizável

#### CBTooltip
- **Origem:** `corp-components/src/components/ui/tooltip/`
- **Destino:** `cbcomponents/src/components/CBTooltip.vue`
- **Prioridade:** 🟢 BAIXA
- **Uso no site:** Hints, ajuda contextual
- **Features necessárias:**
  - Positioning (top, bottom, left, right)
  - Delay customizável
  - Portal

#### CBSwitch
- **Origem:** `corp-components/src/components/ui/switch/CorpSwitch.vue`
- **Destino:** `cbcomponents/src/components/CBSwitch.vue`
- **Prioridade:** 🟢 BAIXA
- **Uso no site:** Toggle newsletter, preferências
- **Features necessárias:**
  - Checked/unchecked
  - Disabled state
  - Loading state

---

## 🔧 Processo de Migração

### Para cada componente:

1. **Análise**
   - [ ] Ler componente original no corp-components
   - [ ] Identificar dependências (reka-ui, utils, etc)
   - [ ] Listar features necessárias

2. **Preparação**
   - [ ] Verificar se reka-ui já está no cbcomponents (já está!)
   - [ ] Verificar utils necessários (ColorUtils, etc)
   - [ ] Criar arquivo no cbcomponents

3. **Adaptação**
   - [ ] Copiar código base
   - [ ] Renomear `Corp*` → `CB*`
   - [ ] Ajustar imports:
     - `@/utils/CorpColorUtils` → `../utils/CbColorUtils`
     - `@/lib/utils` → `../utils/`
     - `@commonStyles` → ajustar conforme estrutura CB
   - [ ] Ajustar CSS variables:
     - `--corp-*` → `--cb-*`
     - Verificar theme.css do cbcomponents

4. **Testes**
   - [ ] Testar no projeto demo do cbcomponents
   - [ ] Testar no site Elas Podem
   - [ ] Verificar responsividade
   - [ ] Verificar dark mode (se houver)

5. **Build & Export**
   - [ ] Adicionar export em `src/index.ts`
   - [ ] Adicionar tipos em `src/types.ts` (se houver)
   - [ ] Build: `npm run build`
   - [ ] Testar no projeto linkado

---

## 📦 Dependências Compartilhadas

### Já existe em ambos:
- ✅ **reka-ui** (v2.7.0)
- ✅ **vue** (v3.5.x)
- ✅ **lucide-vue-next** (ícones)

### Precisa adicionar ao cbcomponents:
- ❓ **@vueuse/core** (usado pelo CorpPopover)
- ❓ **class-variance-authority** (CVA - para variants)
- ❓ **clsx / tailwind-merge** (para merge de classes)

### Utils necessários:
- **CbColorUtils.ts** - Resolver cores semânticas
- **cn()** - Merge de classes (similar ao corp)
- **resolveRounded()** - Resolver border-radius

---

## 🎨 Sistema de Design

### CSS Variables (cbcomponents)

Verificar/criar no `assets/css/theme.css`:

```css
:root {
  /* Colors */
  --cb-primary: ...;
  --cb-primary-foreground: ...;
  --cb-secondary: ...;
  --cb-background: ...;
  --cb-foreground: ...;
  --cb-muted: ...;
  --cb-border: ...;

  /* Input */
  --cb-input-background: ...;
  --cb-input-border: ...;
  --cb-input-text: ...;

  /* Card */
  --cb-card-background: ...;
  --cb-card-border: ...;

  /* Spacing */
  --cb-spacing-xs: 0.25rem;
  --cb-spacing-sm: 0.5rem;
  --cb-spacing-md: 1rem;
  --cb-spacing-lg: 1.5rem;
  --cb-spacing-xl: 2rem;

  /* Radius */
  --cb-radius-sm: 0.25rem;
  --cb-radius-md: 0.375rem;
  --cb-radius-lg: 0.5rem;
  --cb-radius-circle: 9999px;
}
```

---

## 📝 Checklist Geral

### Fase 1 (Semana 1-2)
- [ ] CBInput
- [ ] CBTextarea
- [ ] CBSelect
- [ ] CBLabel
- [ ] CBCheckbox
- [ ] CBCard
- [ ] CBImage
- [ ] CBPopover + dependências (Popover, PopoverTrigger, PopoverContent)

### Fase 2 (Semana 3-4)
- [ ] CBDialog
- [ ] CBSheet
- [ ] CBBadge
- [ ] CBSkeleton
- [ ] CBProgress

### Fase 3 (Semana 5+)
- [ ] CBCollapsible
- [ ] CBSeparator
- [ ] CBTooltip
- [ ] CBSwitch

### Infraestrutura
- [ ] Adicionar @vueuse/core ao cbcomponents
- [ ] Criar/atualizar CbColorUtils.ts
- [ ] Criar utils/cn.ts (merge de classes)
- [ ] Atualizar theme.css com todas as variables
- [ ] Documentação de cada componente

---

## 🚀 Próximos Passos

1. **Começar com Fase 1:** Formulários são críticos
2. **Testar incrementalmente:** Após cada componente, testar no site
3. **Manter consistência:** Seguir padrões do CBNavbar/CBButton existentes
4. **Documentar:** Adicionar exemplos de uso em cada componente

---

## 📊 Impacto Esperado

### Antes (atual):
- 3 componentes básicos
- Formulários HTML nativos
- Cards estáticos
- Sem feedback visual
- Aparência genérica

### Depois (com migração completa):
- 20+ componentes profissionais
- Formulários consistentes e validados
- Cards reutilizáveis e bonitos
- Loading states e feedback
- Aparência polida e profissional
- Site pronto para produção 🚀

---

**Última atualização:** 2026-01-29
**Status:** 📋 Planejamento concluído - Pronto para execução
