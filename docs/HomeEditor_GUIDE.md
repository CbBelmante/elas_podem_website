# 🖊️ Home Editor - UI do Editor da Homepage

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Camada de UI do editor: 1 orquestrador + 8 editores de secao + 2 componentes compartilhados. Cada secao edita, valida, salva e reordena itens independentemente.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Usar / Modificar](#-como-usar--modificar-essencial) (Essencial)
3. [Anatomia de um Editor de Secao](#-anatomia-de-um-editor-de-secao-essencial) (Essencial)
4. [Fluxo Completo](#-fluxo-completo-importante) (Importante)
5. [Padroes Reutilizaveis](#-padroes-reutilizaveis-importante) (Importante)
6. [Arquitetura](#-arquitetura-opcional) (Opcional)
7. [Como Funciona Por Dentro](#-como-funciona-por-dentro-tecnico) (Tecnico)
8. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
9. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

A home tem 8 secoes editaveis (Hero, Missao, Programas, Depoimentos, Apoiadores, Contato, CTA, SEO). Cada uma precisa de:
- Formulario com campos tipados
- CRUD de arrays (add/remove) com drag-and-drop
- Upload de imagem com preview
- Validacao inline + pre-save
- Save/discard independente por secao
- Deteccao de alteracoes + navigation guard

Se tudo ficasse em 1 arquivo: 3500+ linhas. Impossivel de manter.

### A Solucao

11 componentes com responsabilidades claras:

```
pages/admin/edit/
  homeEdit.vue                 ← orquestrador (~510 linhas)

components/admin/
  HomeEditorSection.vue        ← wrapper colapsavel generico
  HomeImageUploader.vue        ← upload compartilhado
  HomeHeroEditor.vue           ← Hero: textos + stats CRUD + drag
  HomeMissionEditor.vue        ← Missao: textos + image upload
  HomeProgramsEditor.vue       ← Programas: CRUD + drag + readonly pareado
  HomeTestimonialsEditor.vue   ← Depoimentos: CRUD + image + drag
  HomeSupportersEditor.vue     ← Apoiadores: CRUD + image + drag + readonly pareado
  HomeContactEditor.vue        ← Contato: campos + 2 arrays (methods + subjects)
  HomeCtaEditor.vue            ← CTA: 4 campos de texto (mais simples)
  HomeSeoEditor.vue            ← SEO: campos + keywords + char counter + image
```

Cada arquivo fica entre 80-250 linhas. O dev abre e entende.

### Quando Usar

✅ **Consulte este guia quando:**
- Quiser entender como os componentes do editor se comunicam
- Precisar adicionar campo a uma secao existente
- Precisar criar editor para secao nova
- Quiser entender drag-and-drop, CRUD ou paired arrays
- Precisar modificar o fluxo save/discard/validation

❌ **Nao precisa deste guia para:**
- Entender como dados fluem pro Firestore → va em `PageData_GUIDE.md`
- Mudar modos de campos (editable/readonly) → va em `SectionFields_GUIDE.md`
- Mudar regras de validacao → va em `Validation_GUIDE.md`
- Entender upload/compressao de imagens → va em `Storage_GUIDE.md`
- Entender change tracking/cleanup → va em `PageEditor_GUIDE.md`

---

## 🔧 Como Usar / Modificar (Essencial)

### Adicionar campo a secao existente

Exemplo: adicionar campo `videoUrl` ao Hero.

**1. Type** — adicionar o campo na interface editable (`types/admin/editable.ts`):

```typescript
export type IHeroEditable = FieldsByMode<typeof SECTION_FIELDS.hero, IHero, 'editable'>;
// Se videoUrl for 'editable' no sectionFields, ja aparece aqui automaticamente
```

**2. Config** — adicionar regra de validacao (`definitions/validationConfigs.ts`):

```typescript
export const HERO_CONFIG = {
  validationRules: {
    // ... campos existentes ...
    videoUrl: { required: false, maxLength: 200 },  // ← NOVO
  },
};
```

**3. Template** — adicionar input no `HomeHeroEditor.vue`:

```vue
<CBInput
  :model-value="forms.editable.videoUrl"
  label="URL do Video"
  :rules="createValidationRules(rules.videoUrl)"
  @update:model-value="forms.editable.videoUrl = $event; emit('changed')"
/>
```

**Pronto.** Validacao inline (`:rules`), validacao pre-save (`useValidation` le o config automaticamente), e save (`usePageData` ja inclui o campo).

### Adicionar item novo a um array

Exemplo: adicionar campo `highlight` ao programa.

**1. sectionFields.ts** — definir o modo:

```typescript
programs: {
  title: 'editable',
  description: 'editable',
  icon: 'editable',
  link: 'editable',
  color: 'readonly',
  highlight: 'editable',  // ← NOVO
},
```

**2. createNewProgram()** em `HomeFormUtils.ts` — valor padrao:

```typescript
export function createNewProgram() {
  return { title: '', description: '', icon: 'luc-book-open', link: '', color: '#E6346B', highlight: false };
}
```

**3. HomeProgramsEditor.vue** — input no template (dentro do `#item`):

```vue
<CBInput
  :model-value="element.highlight"
  label="Destaque"
  @update:model-value="element.highlight = $event; emit('changed')"
/>
```

### Criar editor para secao nova

Se uma nova secao for adicionada a home (ex: "Parceiros"):

1. Criar type + sectionFields → `SectionFields_GUIDE.md`
2. Criar config de validacao → `Validation_GUIDE.md`
3. Criar `HomePartnersEditor.vue` seguindo o pattern dos existentes
4. Registrar no `homeEdit.vue`:
   - Import do componente
   - Adicionar na array `sections`
   - Adicionar no `validators` map
   - Adicionar bloco `<HomeEditorSection>` no template

---

## 🧩 Anatomia de um Editor de Secao (Essencial)

Todos os 8 editores seguem o mesmo pattern. A diferenca e o que tem dentro.

### Estrutura de um editor

```vue
<script setup lang="ts">
/**
 * 🧩 HomeXxxEditor — Editor da secao Xxx.
 *
 * [Descricao curta do que a secao tem]
 */

import { CBInput, ... } from '@cb/components';
import { XXX_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@definitions/validationRules';
import type { IXxxEditable } from '@appTypes/admin';

// ============== PROPS ==============
interface Props {
  forms: { editable: IXxxEditable };
}
const props = defineProps<Props>();

// ============== EMITS ==============
const emit = defineEmits<{
  changed: [];          // sempre — notifica orquestrador de mudanca
  uploaded: [url: string];  // se tem upload — tracking de imagens temp
}>();

// ============== VALIDATION ==============
const rules = XXX_CONFIG.validationRules;

// ============== METHODS (CRUD se array) ==============
</script>
```

### Os 3 tipos de editor

| Tipo | Exemplos | Caracteristicas |
|------|----------|----------------|
| **Campos simples** | CTA, Mission | So inputs/textareas, sem arrays |
| **Array sem readonly** | Testimonials | CRUD + drag, tudo editavel |
| **Array com readonly pareado** | Programs, Supporters, Contact | CRUD + drag, editable[] e readonly[] em sync |

### Comunicacao: Props down, Emits up

```
homeEdit.vue (orquestrador)
  │
  │  :forms="(forms as any).hero"     ← passa dados (referencia reativa)
  │  @changed="markSectionChanged"    ← recebe notificacao de mudanca
  │  @uploaded="handleImageUploaded"  ← recebe URL de upload temp
  │
  ▼
HomeHeroEditor.vue (editor)
  │
  │  forms.editable.title = $event    ← muta diretamente (mesma referencia)
  │  emit('changed')                  ← notifica orquestrador
  │
  ▼
Orquestrador sabe: "hero foi alterado" → habilita Save/Discard
```

Os editores **mutam os forms diretamente** (mesma referencia reativa do Vue) e **emitem `changed`** para o orquestrador saber qual secao mudou. Simples e direto.

---

## 🔄 Fluxo Completo (Importante)

### Cenario 1: Editar campo e salvar

```
1. Pagina carrega
   homeEdit.vue → onMounted → loadPageData()
   forms preenchido com dados do Firestore
   Hero accordion expandido por padrao

2. Usuario edita titulo do Hero
   CBInput @update:model-value → forms.editable.title = 'novo'
   HomeHeroEditor emit('changed')
   homeEdit.vue → markSectionChanged('hero')
   changedSections = {'hero'}
   hasChanges = true
   HomeEditorSection mostra badge "Alterado" + habilita Save

3. Usuario clica "Salvar Secao"
   homeEdit.vue → handleSave('hero')
   ├─ getValidationData('hero') → forms.hero.editable
   ├─ validators.hero(data) → validateHero() → { isValid: true }
   ├─ saveSection('hero') → Firestore updateDoc (dot notation)
   ├─ changedSections.delete('hero')
   ├─ successMessage = "Secao Hero salva!"
   └─ setTimeout(() => successMessage = '', 3000)
```

### Cenario 2: Adicionar item, reordenar e salvar (array com readonly pareado)

```
1. Usuario clica "Adicionar Programa"
   addProgram():
   ├─ createNewProgram() → novo item completo
   ├─ for (const [key, mode] of Object.entries(SECTION_FIELDS.programs))
   │    separa em editable/readonly
   ├─ forms.editable.push(editable)
   ├─ forms.readonly.push(readonly)
   └─ emit('changed')

2. Usuario arrasta programa 3 pra posicao 1
   vuedraggable move em forms.editable automaticamente
   @end → onDragEnd({ oldIndex: 2, newIndex: 0 })
   ├─ forms.readonly.splice(2, 1) → remove item 3
   ├─ forms.readonly.splice(0, 0, item) → insere na posicao 1
   └─ emit('changed')
   Ambos arrays (editable + readonly) sincronizados por index

3. Usuario salva
   saveSection('programs')
   ├─ combineProgramsData(editable, readonly) → reconstroi array completo
   └─ updateDoc('content.programs': [...]) → Firestore
```

### Cenario 3: Fazer upload de imagem e cancelar

```
1. Usuario faz upload de foto no depoimento
   HomeImageUploader → handleFileSelect()
   ├─ validateImageFile(file) → ok
   ├─ uploadImage(file, 'testimonials') → URL no Firebase Storage
   ├─ emit('update:modelValue', url) → forms.editable.image = url
   └─ emit('uploaded', url) → homeEdit.vue → tempUploadedImages.push(url)

2. Usuario clica "Voltar" sem salvar
   onBeforeRouteLeave → canExit(tempUploadedImages)
   ├─ hasChanges = true → confirm("Alteracoes nao salvas...")
   ├─ Usuario confirma → cleanupTempUploads()
   │    → deleteFile(url) → remove do Firebase Storage
   └─ return true → navigateTo('/admin')
   Nenhum lixo no Storage.
```

### Cenario 4: Descartar alteracoes

```
1. Usuario edita titulo + descricao do CTA
   changedSections = {'cta'}

2. Usuario clica "Descartar"
   handleDiscard('cta'):
   ├─ resetSection('cta') → restaura forms.cta pro originalData
   ├─ changedSections.delete('cta')
   ├─ sectionErrors.cta = []
   └─ if (changedSections.size === 0) → resetChanges()
   Campos voltam ao que eram. Badge "Alterado" some.
```

---

## 🔁 Padroes Reutilizaveis (Importante)

### Drag-and-drop com vuedraggable

Toda secao com array usa o mesmo pattern:

```vue
<draggable
  v-model="forms.editable"
  item-key="_dragId"
  handle=".dragHandle"
  :animation="200"
  ghost-class="xxxEditor__ghost"
  @end="emit('changed')"
>
  <template #item="{ element, index }">
    <div class="xxxEditor__card">
      <div class="dragHandle">
        <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
      </div>
      <!-- campos do item -->
      <CBButton prepend-icon="luc-trash-2" @click="removeItem(index)" />
    </div>
  </template>
</draggable>
```

**Regras:**
- `item-key="_dragId"` — campo unico gerado pelo `createNew*()` (`Date.now() + Math.random()`)
- `handle=".dragHandle"` — so arrasta pelo icone grip, nao pela card toda
- `:animation="200"` — transicao suave de 200ms
- `ghost-class` — estilo do item fantasma durante drag

### Readonly pareado: sync de 2 arrays

Secoes com campos readonly (Programs, Supporters, Contact methods) mantem **2 arrays** pareados por index:

```
editable[0] ↔ readonly[0]   // Programa 1
editable[1] ↔ readonly[1]   // Programa 2
editable[2] ↔ readonly[2]   // Programa 3
```

**Add:** push em ambos arrays.

```typescript
function addProgram(): void {
  const newItem = createNewProgram();
  const editable: Record<string, unknown> = {};
  const readonly: Record<string, unknown> = {};
  for (const [key, mode] of Object.entries(SECTION_FIELDS.programs)) {
    if (mode === 'editable') editable[key] = (newItem as Record<string, unknown>)[key];
    else readonly[key] = (newItem as Record<string, unknown>)[key];
  }
  props.forms.editable.push(editable as unknown as IProgramEditable);
  props.forms.readonly.push(readonly as unknown as IProgramReadonly);
  emit('changed');
}
```

**Remove:** splice em ambos arrays.

```typescript
function removeProgram(index: number): void {
  props.forms.editable.splice(index, 1);
  props.forms.readonly.splice(index, 1);
  emit('changed');
}
```

**Reorder:** vuedraggable reordena `editable` automaticamente. O `@end` handler sincroniza `readonly`:

```typescript
function onDragEnd(evt: { oldIndex?: number; newIndex?: number }): void {
  const { oldIndex, newIndex } = evt;
  if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;
  const [item] = props.forms.readonly.splice(oldIndex, 1);
  props.forms.readonly.splice(newIndex, 0, item);
  emit('changed');
}
```

### Validacao em 2 niveis

| Nivel | Quando | Onde | O que faz |
|-------|--------|------|-----------|
| **Inline** | Tempo real (keyup) | CBInput `:rules` | Feedback visual imediato |
| **Pre-save** | Ao clicar "Salvar" | `useValidation()` | Bloqueia save se invalido |

```vue
<!-- Nivel 1: inline via :rules -->
<CBInput
  :model-value="forms.editable.title"
  :rules="createValidationRules(rules.title)"
/>
```

```typescript
// Nivel 2: pre-save no orquestrador
const validator = validators[sectionName];
const result = validator(data);
if (!result.isValid) {
  sectionErrors.value[sectionName] = result.errors;
  return;  // bloqueia save
}
```

Ambos leem do mesmo `*_CONFIG` em `validationConfigs.ts`. 1 lugar define, 2 lugares consomem.

### CRUD de arrays simples (strings)

Keywords (SEO) e formSubjects (Contato) sao arrays de strings simples:

```typescript
function addKeyword(): void {
  if (props.forms.editable.keywords.length >= SEO_CONFIG.keywords.max) return;
  props.forms.editable.keywords.push('');
  emit('changed');
}

function removeKeyword(index: number): void {
  if (props.forms.editable.keywords.length <= SEO_CONFIG.keywords.min) return;
  props.forms.editable.keywords.splice(index, 1);
  emit('changed');
}

function updateKeyword(index: number, value: string): void {
  props.forms.editable.keywords[index] = value;
  emit('changed');
}
```

Sem readonly pareado. Sem separacao editable/readonly. Direto.

---

## 🎨 Arquitetura (Opcional)

### Mapa de componentes

```
homeEdit.vue (orquestrador)
  │
  ├── useHomePageData()    → forms, loadPageData, saveSection, resetSection
  ├── useValidation()      → validateHero, validateMission, ...
  ├── usePageEditor()      → hasChanges, markAsChanged, canExit
  ├── useAuth()            → userData.displayName (header)
  │
  ├── HomeEditorSection × 8  (wrapper colapsavel generico)
  │     │
  │     ├── HomeHeroEditor
  │     │     └── CBInput, CBTextarea, CBSelect, draggable (stats)
  │     │
  │     ├── HomeMissionEditor
  │     │     ├── CBInput, CBTextarea
  │     │     └── HomeImageUploader → useFirebaseStorage
  │     │
  │     ├── HomeProgramsEditor
  │     │     └── CBInput, CBTextarea, CBSelect, draggable (readonly pareado)
  │     │
  │     ├── HomeTestimonialsEditor
  │     │     ├── CBInput, CBTextarea, draggable
  │     │     └── HomeImageUploader × N (1 por depoimento)
  │     │
  │     ├── HomeSupportersEditor
  │     │     ├── CBInput, CBSelect, draggable (readonly pareado)
  │     │     └── HomeImageUploader × N (1 por apoiador)
  │     │
  │     ├── HomeContactEditor
  │     │     ├── CBInput, CBTextarea, CBSelect
  │     │     ├── draggable (methods, readonly pareado)
  │     │     └── draggable (formSubjects, strings simples)
  │     │
  │     ├── HomeCtaEditor
  │     │     └── CBInput, CBTextarea
  │     │
  │     └── HomeSeoEditor
  │           ├── CBInput, CBTextarea (com char counter)
  │           ├── draggable (keywords, strings simples)
  │           └── HomeImageUploader (ogImage)
  │
  └── @cb/components: CBButton, CBIcon, CBLabel, CBInput, CBTextarea,
                      CBSelect, CBBadge, CBCard
```

### Diagrama de dependencias

```
definitions/                          composables/
├── validationConfigs.ts ─────────►  useValidation.ts ──┐
├── validationRules.ts ───────────►  (CBInput :rules)   │
├── themeOptions.ts ──────────────►  (CBSelect :items)   │
├── sectionFields.ts ─────────────►  (addItem: split)   │
│                                                        │
utils/                                                   │
├── HomeFormUtils.ts ─────────────►  (createNew*())      │
│                                                        │
composables/                                             │
├── useHomePageData.ts ───────────►  homeEdit.vue ◄──────┘
├── usePageEditor.ts ─────────────►       │
├── useAuth.ts ───────────────────►       │
├── useFirebaseStorage.ts ────────►  HomeImageUploader.vue
│
types/admin/
├── editable.ts ──────────────────►  (Props dos editors)
├── formsData.ts ─────────────────►  (IHomeFormsData)
├── editor.ts ────────────────────►  (SaveResult, ValidationResult)
```

### Secoes e suas capacidades

| Secao | Campos | Array | Drag | Image | Readonly Pareado |
|-------|--------|-------|------|-------|-----------------|
| Hero | 5 | stats (1-6) | ✅ | - | - |
| Missao | 5 | - | - | ✅ 1 | - |
| Programas | - | programs (1-8) | ✅ | - | ✅ color |
| Depoimentos | - | testimonials (1-12) | ✅ | ✅ por item | - |
| Apoiadores | - | supporters (1-20) | ✅ | ✅ por item | ✅ color |
| Contato | 3 | methods (1-8) + subjects (1-10) | ✅ ambos | - | ✅ methods |
| CTA | 4 | - | - | - | - |
| SEO | 2 (+counter) | keywords (1-20) | ✅ | ✅ 1 (og) | - |

---

## 🔬 Como Funciona Por Dentro (Tecnico)

### O orquestrador homeEdit.vue

O arquivo tem 5 responsabilidades claras:

**1. Estado central:**

```typescript
const expandedSections = ref<Set<string>>(new Set(['hero']));  // quais secoes abertas
const changedSections = ref<Set<string>>(new Set());           // quais secoes alteradas
const sectionErrors = ref<Record<string, string[]>>({});       // erros por secao
const tempUploadedImages = ref<string[]>([]);                  // uploads pra cleanup
const successMessage = ref('');                                // feedback pos-save
```

**2. Mapa de validadores:**

```typescript
const validators: Record<string, (data) => ValidationResult> = {
  hero: (data) => validateHero(data),
  mission: (data) => validateMission(data),
  programs: () => validatePrograms(forms.value?.programs?.editable),
  // ... 8 secoes
};
```

Note que `programs`, `testimonials` e `supporters` passam o **array editable** diretamente (nao o objeto). Os demais passam o objeto `data` (campos simples).

**3. handleSave(sectionName):**

```typescript
async function handleSave(sectionName: string): Promise<void> {
  successMessage.value = '';
  const data = getValidationData(sectionName);
  const validator = validators[sectionName];

  if (validator) {
    const result = validator(data);
    if (!result.isValid) {
      sectionErrors.value[sectionName] = result.errors;
      return;  // guard clause — nao salva
    }
  }

  sectionErrors.value[sectionName] = [];
  const saveResult = await saveSection(sectionName);

  if (saveResult.success) {
    changedSections.value.delete(sectionName);
    if (changedSections.value.size === 0) resetChanges();
    successMessage.value = saveResult.message;
    setTimeout(() => { successMessage.value = ''; }, 3000);
  } else {
    sectionErrors.value[sectionName] = [saveResult.message];
  }
}
```

**4. handleDiscard(sectionName):**

```typescript
function handleDiscard(sectionName: string): void {
  resetSection(sectionName);
  changedSections.value.delete(sectionName);
  sectionErrors.value[sectionName] = [];
  if (changedSections.value.size === 0) resetChanges();
}
```

**5. Navigation guard:**

```typescript
onBeforeRouteLeave(async () => {
  return await canExit(tempUploadedImages);
});

// + beforeunload nativo (browser tab close)
window.addEventListener('beforeunload', (e) => {
  if (hasChanges.value) e.preventDefault();
});
```

### HomeEditorSection.vue — o wrapper generico

Renderizado 8 vezes no template, uma por secao:

```vue
<HomeEditorSection
  title="Hero"
  icon="luc-star"
  section-name="hero"
  :expanded="expandedSections.has('hero')"
  :errors="sectionErrors.hero ?? []"
  :is-saving="isSaving"
  :has-changes="changedSections.has('hero')"
  @toggle="toggleSection('hero')"
  @save="handleSave('hero')"
  @discard="handleDiscard('hero')"
>
  <HomeHeroEditor ... />  <!-- slot -->
</HomeEditorSection>
```

O wrapper cuida de: expand/collapse, badge de erros, badge "Alterado", botoes Save/Discard. O conteudo vem via slot.

### HomeImageUploader.vue — upload compartilhado

Fluxo interno:

```
triggerFileInput() → input.click()
    ↓
handleFileSelect(event)
    ├─ file = input.files[0]
    ├─ validateImageFile(file) → tipo + tamanho
    │    invalido? → uploadError = msg → return
    │
    ├─ isUploading = true
    ├─ url = await uploadImage(file, category) → comprime + upload Firebase
    ├─ emit('update:modelValue', url) → pai atualiza forms
    ├─ emit('uploaded', url) → pai rastreia pra cleanup
    └─ isUploading = false
```

O `category` (ex: `'mission'`, `'testimonials'`) define o preset de compressao em `COMPRESSION_SETTINGS` — ver `Storage_GUIDE.md`.

---

## 📊 Referencia de Arquivos (Referencia)

### Componentes criados

| Arquivo | Linhas | Descricao |
|---------|--------|-----------|
| `pages/admin/edit/homeEdit.vue` | ~510 | Orquestrador: load, save, discard, validation, guard |
| `components/admin/HomeEditorSection.vue` | ~220 | Wrapper colapsavel generico (×8) |
| `components/admin/HomeImageUploader.vue` | ~180 | Upload com preview, validacao e compressao |
| `components/admin/HomeHeroEditor.vue` | ~245 | Hero: textos + stats CRUD/drag |
| `components/admin/HomeMissionEditor.vue` | ~100 | Missao: textos + image upload |
| `components/admin/HomeProgramsEditor.vue` | ~225 | Programas: CRUD/drag + readonly pareado |
| `components/admin/HomeTestimonialsEditor.vue` | ~210 | Depoimentos: CRUD/drag + image por item |
| `components/admin/HomeSupportersEditor.vue` | ~230 | Apoiadores: CRUD/drag + image + readonly pareado |
| `components/admin/HomeContactEditor.vue` | ~345 | Contato: campos + methods + formSubjects |
| `components/admin/HomeSeoEditor.vue` | ~210 | SEO: campos + keywords + char counter + ogImage |
| `components/admin/HomeCtaEditor.vue` | ~85 | CTA: 4 campos de texto |

### Dependencia externa

| Pacote | Versao | Uso |
|--------|--------|-----|
| `vuedraggable` | `@next` (v4) | Drag-and-drop em arrays. SortableJS oficial para Vue 3. |

### Documentacao relacionada

| Guia | Relacao |
|------|---------|
| `PageData_GUIDE.md` | Factory que gera `useHomePageData` (load/save/reset) |
| `PageEditor_GUIDE.md` | `usePageEditor` — change tracking, cleanup, navigation guard |
| `Validation_GUIDE.md` | `useValidation` + `validationConfigs` — regras pre-save |
| `Storage_GUIDE.md` | `useFirebaseStorage` — upload, compressao, delete |
| `SectionFields_GUIDE.md` | `SECTION_FIELDS` — define quais campos sao editable/readonly |
| `AdminPages_GUIDE.md` | Login + Dashboard — porta de entrada antes do editor |
| `Auth_GUIDE.md` | `useAuth` — permissoes e dados do usuario logado |

---

## 💡 FAQ (Suporte)

### Por que `(forms as any).hero` no template do orquestrador?

O `forms` vem tipado como `Ref<IHomeFormsData | null>` do composable. No template, acessar `forms.hero` diretamente causa erro de tipo (pode ser null). O `as any` e um pragmatismo para template bindings — a existencia ja e garantida pelo `v-if="forms"` no componente pai.

### Por que cada editor muta props diretamente?

No Vue 3, props de objetos/arrays passam por **referencia reativa**. Quando o pai passa `forms.hero`, o filho recebe a mesma referencia. Mutar `element.title = $event` no filho atualiza o estado do pai automaticamente. O `emit('changed')` so serve pra notificar — nao pra passar dados.

### Por que nao usar v-model no lugar de :model-value + @update:model-value?

O `v-model` simplificaria, mas teriamos 2 problemas:
1. Nao poderiamos emitir `changed` junto com a atualizacao
2. Em campos de arrays (element.title), o `v-model` com expressao inline fica ambiguo

O pattern `:model-value` + `@update:model-value` com `emit('changed')` inline e explicito e previsivel.

### Posso ter mais de uma secao aberta ao mesmo tempo?

Sim. `expandedSections` e um `Set<string>`. Clicar em uma secao faz toggle individual. Nenhuma logica de "fechar as outras" — o usuario abre quantas quiser.

### O que acontece se o save falhar?

O `handleSave` captura o erro e coloca em `sectionErrors.value[sectionName]`. O `HomeEditorSection` renderiza os erros em vermelho acima do conteudo. O `changedSections` nao e limpo (badge "Alterado" permanece).

### Por que HomeContactEditor e o mais complexo?

Porque tem **3 areas** de edicao:
1. Campos top-level (badge, title, description)
2. Array `methods` (CRUD + drag + readonly pareado)
3. Array `formSubjects` (CRUD + drag + strings simples)

Sao 2 instancias de `<draggable>` no mesmo componente, cada uma com CRUD independente.

### Posso reutilizar esses componentes pra outra pagina?

O `HomeEditorSection` e `HomeImageUploader` sao genericos — podem ser reutilizados. Os editores de secao (HomeHeroEditor, etc.) sao especificos da home. Para outra pagina, criaria editores novos seguindo o mesmo pattern.

### Por que vuedraggable@next e nao SortableJS puro?

`vuedraggable@next` (v4) e o wrapper oficial do SortableJS para Vue 3. Suporta `v-model`, `handle`, `ghost-class`, `item-key`, `@end` — tudo integrado com reatividade Vue. SortableJS puro exigiria manipulacao manual do DOM e sincronizacao com o state.

---

*📅 Criado em*: 19 FEV 2026
*📋 Versao*: 1.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [admin, editor, home, componentes, drag-and-drop, vuedraggable, CRUD, upload, validacao]
