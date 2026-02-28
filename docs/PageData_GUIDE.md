# 🏭 Page Data - Factory de Dados por Pagina

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Sistema que gera composables de dados por pagina usando uma factory generica. Carrega, salva e reseta dados do Firestore com type-safety completa.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Usar no Editor](#-como-usar-no-editor-essencial) (Essencial)
3. [Como Criar Nova Pagina](#-como-criar-nova-pagina-essencial) (Essencial)
4. [Fluxo de Dados](#-fluxo-de-dados-importante) (Importante)
5. [Arquitetura](#-arquitetura-opcional) (Opcional)
6. [Como Funciona Por Dentro](#-como-funciona-por-dentro-tecnico) (Tecnico)
7. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
8. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

Cada pagina do admin precisa:
- Carregar dados do Firestore
- Transformar pro formato do editor (editable/readonly)
- Salvar seções individuais ou todas de uma vez
- Resetar pro estado original
- Manter audit trail (quem editou, quando)

Sem factory, cada pagina (home, sobre, contato) duplicaria toda essa logica.

### A Solucao

```
usePageData.ts (factory base + instancias)
    │
    ├── useHomePageData     → composable da home (dentro de usePageData.ts)
    ├── useAboutPageData    → composable do sobre (futuro)
    └── useContactPageData  → composable do contato (futuro)
```

A factory `createPageDataComposable()` recebe uma **config** e gera um composable completo com load/save/reset. Cada pagina so precisa dizer:
- Qual collection e documento no Firestore
- Como transformar os dados (separate/combine)
- Quais secoes existem

### Quando Usar

✅ **Consulte este guia quando:**
- Precisar criar um editor para nova pagina
- Quiser entender como os dados fluem (Firestore → editor → save)
- Precisar debugar save/load de secoes
- Quiser entender o pattern factory + singleton

❌ **Nao precisa deste guia para:**
- Mudar modos de campos (editable/readonly) → va em `SectionFields_GUIDE.md`
- Mudar regras de validacao → va em `Validation_GUIDE.md`
- Entender autenticacao → va em `Auth_GUIDE.md`

---

## 🔧 Como Usar no Editor (Essencial)

### Carregar dados

```typescript
const { forms, isLoading, loadPageData } = useHomePageData();

// No onMounted ou setup
await loadPageData();

// forms agora tem todas as secoes
// forms.value.hero.editable.title → "ELAS PO+DEM"
// forms.value.programs.editable → [{ title, description, icon, link }, ...]
// forms.value.seo.readonly.og → { type: "website", siteName: "Elas Podem" }
```

### Salvar uma secao

```typescript
const { saveSection } = useHomePageData();

const result = await saveSection('hero');
if (result.success) {
  // Secao salva! Dados recarregados automaticamente.
} else {
  console.error(result.message);  // "Erro ao salvar"
}
```

### Salvar todas as secoes

```typescript
const { saveAll } = useHomePageData();

const result = await saveAll();
// result.savedSections → ['hero', 'mission', 'programs', ...]
```

### Resetar (descartar alteracoes)

```typescript
const { resetSection, resetAll } = useHomePageData();

// Resetar uma secao pro estado original (ultimo load)
resetSection('hero');

// Resetar TODAS as secoes
resetAll();
```

### Editar campos no template

```vue
<template>
  <!-- Editable: admin pode mudar -->
  <CBInput v-model="forms.hero.editable.title" label="Titulo" />
  <CBInput v-model="forms.hero.editable.description" label="Descricao" />

  <!-- Readonly: exibir mas nao editar -->
  <span>{{ forms.seo.readonly.og.siteName }}</span>
</template>
```

---

## 🔧 Como Criar Nova Pagina (Essencial)

Exemplo: criar editor da pagina "Sobre".

### Passo 1 — Types em `types/admin/`

```typescript
// sections.ts — adicionar
export interface IAboutPageData {
  content: {
    intro: IIntroSection;
    team: ITeamMember[];
    timeline: ITimelineEvent[];
  }
  seo: ISeo;
  lastUpdated: string;
  updatedById: string;
  updatedByName: string;
}
```

```typescript
// formsData.ts — adicionar
export interface IAboutFormsData {
  intro: { editable: IIntroEditable }
  team: { editable: ITeamMemberEditable[] }
  timeline: { editable: ITimelineEventEditable[] }
  seo: { editable: ISeoEditable; readonly: ISeoReadonly }
}
```

### Passo 2 — Document em `definitions/firestoreCollections.ts`

```typescript
export const PAGE_DOCUMENTS = {
  HOME: 'home',
  ABOUT: 'about',   // ← NOVO
} as const satisfies Record<string, string>;
```

### Passo 3 — FormUtils em `utils/AboutFormUtils.ts`

```typescript
// Mesmo pattern do HomeFormUtils:
// separateIntroData(), combineIntroData(), createDefaultIntroEditable()
// separateAllSections(), createDefaultAboutForms()
```

### Passo 4 — Composable em `composables/useAboutPageData.ts`

```typescript
import { createPageDataComposable } from '@composables/usePageData';
import { FIRESTORE_COLLECTIONS, PAGE_DOCUMENTS } from '@definitions/firestoreCollections';
import { separateAllSections, createDefaultAboutForms, ... } from '@utils/AboutFormUtils';
import type { IAboutPageData, IAboutFormsData } from '@appTypes/admin';

export const useAboutPageData = createPageDataComposable<IAboutPageData, IAboutFormsData>({
  collection: FIRESTORE_COLLECTIONS.PAGES,
  document: PAGE_DOCUMENTS.ABOUT,
  pageName: 'sobre',
  separateAll: separateAllSections,
  createDefaults: createDefaultAboutForms,
  combineSections: {
    intro: (forms) => ({ 'content.intro': combineIntroData(forms.intro.editable) }),
    team: (forms) => ({ 'content.team': combineTeamData(forms.team.editable) }),
    timeline: (forms) => ({ 'content.timeline': combineTimelineData(forms.timeline.editable) }),
    seo: (forms) => ({ seo: combineSeoData(forms.seo.editable, forms.seo.readonly) }),
  },
});
```

**Pronto.** O composable ja tem `loadPageData`, `saveSection`, `saveAll`, `resetSection`, `resetAll` — tudo tipado.

### Checklist para nova pagina

- [ ] Types: `IXxxPageData` + `IXxxFormsData` + interfaces editable/readonly
- [ ] Document: `PAGE_DOCUMENTS.XXX` em `firestoreCollections.ts`
- [ ] FormUtils: `utils/XxxFormUtils.ts` (separate/combine/defaults)
- [ ] Composable: `composables/useXxxPageData.ts` (1 chamada a `createPageDataComposable`)
- [ ] Validacao: validators em `useValidation.ts` (se necessario)
- [ ] Editor: `pages/admin/edit/xxxEdit.vue`

---

## 🔄 Fluxo de Dados (Importante)

### Load: Firestore → Editor

```
Firestore                       Factory                          Editor
─────────                       ───────                          ──────
pages/home                      loadPageData()
  content:                        │
    hero: { badge, title, ... }   ├─ getDoc('pages', 'home')
    programs: [{ ... }]           ├─ separateAllSections(data)
  seo: { title, ... }            │     ├─ separateHeroData()    →  forms.hero.editable
                                  │     ├─ separateProgramsData() → forms.programs.editable
                                  │     │                           forms.programs.readonly
                                  │     └─ separateSeoData()     →  forms.seo.editable
                                  │                                  forms.seo.readonly
                                  └─ state.originalData = data   (snapshot pra reset)
```

### Save: Editor → Firestore

```
Editor                          Factory                          Firestore
──────                          ───────                          ─────────
forms.hero.editable             saveSection('hero')
  → { badge, title, ... }        │
                                  ├─ combineSections.hero(forms)
                                  │    → { 'content.hero': combineHeroData(editable) }
                                  │
                                  ├─ updateDoc(docRef, {
                                  │     'content.hero': { ... },
                                  │     lastUpdated: ISO,
                                  │     updatedById: 'abc123',
                                  │     updatedByName: 'Maria',
                                  │   })
                                  │
                                  └─ loadPageData()              (reload automatico)
```

### Save All: Atomico

```
saveAll()
  ├─ combina TODAS as secoes em 1 objeto
  │    'content.hero': { ... }
  │    'content.mission': { ... }
  │    'content.programs': [...]
  │    'seo': { ... }
  │
  ├─ updateDoc(docRef, { tudo_junto })   ← 1 unico write (atomico)
  │
  └─ loadPageData()
```

### Dot notation no Firestore

O `updateDoc` com dot notation atualiza **apenas o campo especificado** sem sobrescrever os vizinhos:

```typescript
// Isso atualiza SÓ content.hero, sem tocar em content.mission, content.programs, etc.
updateDoc(docRef, { 'content.hero': { badge: 'NOVO', title: 'NOVO' } });
```

Se usasse sem dot notation, sobrescreveria `content` inteiro (perdendo mission, programs...).

---

## 🎨 Arquitetura (Opcional)

### Arquivos envolvidos

```
composables/
├── usePageData.ts          ← factory base + useHomePageData (instancia da home)
├── useFirebase.ts          ← $db (Firestore instance)
├── useAuth.ts              ← userData (pra audit trail)

utils/
├── HomeFormUtils.ts        ← separate/combine/defaults

definitions/
├── firestoreCollections.ts ← FIRESTORE_COLLECTIONS, PAGE_DOCUMENTS

types/admin/
├── sections.ts             ← IHomePageData
├── formsData.ts            ← IHomeFormsData
├── formsData.ts            ← IHomeFormsData, ISaveResult
```

### Diagrama de dependencias

```
                   useConfig()
                       │
                       ▼
                  useFirebase()     ← singleton ($db)
                       │
                       ▼
   useAuth()      usePageData()    ← factory base
      │           /          \
      │          ▼            ▼
      │    useHomePageData()   useAboutPageData() (futuro)
      │         │
      │         ├── HomeFormUtils (separate/combine)
      │         ├── firestoreCollections (PAGES, HOME)
      │         └── types/admin (IHomePageData, IHomeFormsData)
      │
      └── userData.id / userData.displayName → audit trail
```

### useHomePageData (dentro de usePageData.ts)

A instancia da home fica no final de `usePageData.ts`, logo apos a factory:

```typescript
// ============== HOME (instancia gerada pela factory) ==============

export const useHomePageData = createPageDataComposable<IHomePageData, IHomeFormsData>({
  collection: FIRESTORE_COLLECTIONS.PAGES,
  document: PAGE_DOCUMENTS.HOME,
  pageName: 'home',
  separateAll: separateAllSections,
  createDefaults: createDefaultHomeForms,
  combineSections: {
    hero: (forms) => ({ 'content.hero': combineHeroData(forms.hero.editable) }),
    mission: (forms) => ({ 'content.mission': combineMissionData(forms.mission.editable) }),
    // ... demais secoes
  },
});

export type UseHomePageData = ReturnType<typeof useHomePageData>;
```

---

## 🔬 Como Funciona Por Dentro (Tecnico)

### O pattern factory + closure + singleton

A factory resolve 2 problemas simultaneamente:

**Problema 1 — Estado compartilhado entre componentes:**
Se 3 componentes chamam `useHomePageData()`, todos precisam do MESMO estado.

**Problema 2 — Estado isolado entre paginas:**
`useHomePageData()` e `useAboutPageData()` precisam de estados SEPARADOS.

A solucao e a closure:

```typescript
export function createPageDataComposable(config) {
  // ↓ Essa variável vive na closure — UMA por chamada da factory
  let _state = null;

  function getState() {
    if (_state) return _state;        // ja existe? retorna o mesmo
    _state = reactive({ ... });       // nao? cria uma vez so
    return _state;
  }

  // ↓ Esse é o composable que os componentes chamam
  return function () {
    const state = getState();         // TODOS recebem o mesmo _state
    return { ...toRefs(state), ... };
  };
}
```

```
createPageDataComposable(homeConfig)     createPageDataComposable(aboutConfig)
         │                                         │
    closure A: _state_home                    closure B: _state_about
         │                                         │
    useHomePageData()                         useAboutPageData()
    Componente 1 → _state_home                Componente X → _state_about
    Componente 2 → _state_home                Componente Y → _state_about
    Componente 3 → _state_home
```

### O mapped type em combineSections

```typescript
interface IPageDataConfig<TPageData, TFormsData> {
  combineSections: { [K in keyof TFormsData]: (forms: TFormsData) => Record<string, unknown> };
  //                 ^^^^^^^^^^^^^^^^^^^^^^^^^
  //                 TODAS as keys de TFormsData sao obrigatorias
}
```

Se `IHomeFormsData` tem 8 secoes (hero, mission, programs...), o TypeScript exige que `combineSections` tenha exatamente essas 8 keys. Esquecer uma → erro de compilacao.

### SectionName derivado

```typescript
type SectionName = keyof TFormsData & string;
```

O `& string` e necessario porque `keyof` pode incluir `symbol` e `number`. O `& string` filtra so as chaves string (que e o que queremos para nomes de secao).

### Audit trail automatico

Todo save adiciona automaticamente:

```typescript
await updateDoc(docRef, {
  ...sectionData,                                  // dados da secao
  lastUpdated: new Date().toISOString(),           // quando
  updatedById: userData.value?.id ?? 'unknown',    // quem (ID Firestore)
  updatedByName: userData.value?.displayName ?? 'unknown',  // quem (nome)
});
```

O `userData` vem do `useAuth()` — e o usuario logado no momento.

### Reload automatico apos save

Depois de cada `saveSection` ou `saveAll`, a factory chama `loadPageData()` automaticamente:

```typescript
const saveSection = async (section) => {
  // ... updateDoc ...
  await loadPageData();  // ← recarrega do Firestore
  return { success: true, ... };
};
```

Isso garante que `forms` e `originalData` estejam sincronizados com o Firestore.

---

## 📊 Referencia de Arquivos (Referencia)

### `composables/usePageData.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `createPageDataComposable()` | factory | Gera composable singleton por pagina |
| `IPageDataConfig` | interface | Config que cada pagina fornece |
| `IPageDataState` | interface | Estado reativo interno |

### `composables/usePageData.ts` (exports adicionais da home)

| Export | Tipo | Descricao |
|--------|------|-----------|
| `useHomePageData` | composable | Instancia da home (gerado pela factory) |
| `UseHomePageData` | type | ReturnType do composable |

### Retorno de qualquer composable gerado pela factory

| Retorno | Tipo | Descricao |
|---------|------|-----------|
| `forms` | `Ref<TFormsData>` | Dados do editor (editable/readonly por secao) |
| `originalData` | `Ref<TPageData \| null>` | Snapshot do Firestore (pra reset) |
| `isLoading` | `Ref<boolean>` | Carregando do Firestore |
| `isSaving` | `Ref<boolean>` | Salvando no Firestore |
| `error` | `Ref<string \| null>` | Mensagem de erro |
| `isLoaded` | `ComputedRef<boolean>` | Dados ja carregados? |
| `loadPageData()` | `async` | Carrega/recarrega do Firestore |
| `saveSection(name)` | `async` | Salva 1 secao (dot notation) |
| `saveAll()` | `async` | Salva todas as secoes (atomico) |
| `resetSection(name)` | `void` | Reseta 1 secao pro original |
| `resetAll()` | `void` | Reseta todas as secoes |

### `definitions/firestoreCollections.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `FIRESTORE_COLLECTIONS` | const | `{ PAGES, USERS, ADMIN_LOGS }` |
| `PAGE_DOCUMENTS` | const | `{ HOME }` |
| `FirestoreCollection` | type | Union dos nomes de collections |
| `PageDocument` | type | Union dos IDs de documentos |

---

## 💡 FAQ (Suporte)

### Posso salvar secoes individualmente?

Sim. `saveSection('hero')` salva SO a secao hero sem tocar nas outras. Usa dot notation do Firestore (`'content.hero'`).

### E se eu salvar tudo, e atomico?

Sim. `saveAll()` combina TODAS as secoes em um unico `updateDoc()`. Se falhar, nenhuma secao e salva.

### O que acontece se o documento nao existir no Firestore?

`loadPageData()` detecta e usa `createDefaults()` (valores iniciais). O primeiro `saveSection`/`saveAll` cria o documento.

### O que e `originalData`?

E um snapshot dos dados como vieram do Firestore no ultimo `loadPageData()`. Serve como referencia para `resetSection`/`resetAll` — "voltar pro que era antes de editar".

### Por que o save esta embutido na factory?

O save esta embutido na factory (e nao em composable separado com wrappers por secao) porque:
- Menos indireção — quem carrega os dados tambem salva
- Dot notation e gerada pelo `combineSections` config — nao precisa wrapper
- Audit trail e adicionado automaticamente
- Novo composable de pagina ja vem com save "de graca"

### Por que `as const satisfies Record<string, string>` nas collections?

```typescript
export const FIRESTORE_COLLECTIONS = {
  PAGES: 'pages',
  USERS: 'users',
} as const satisfies Record<string, string>;
```

- `as const` → literais exatos (`'pages'`, nao `string`)
- `satisfies` → valida formato sem perder os literais
- Resultado: `FIRESTORE_COLLECTIONS.PAGES` tem tipo `'pages'` (nao `string`)

### Como debugar se o save nao funciona?

1. Verifique os logs do `Logger` — cada save loga secao e quem salvou
2. Verifique `state.error` — mensagem de erro do Firestore
3. Verifique se o `combineSections` da secao retorna o path correto (`'content.hero'`, nao `'hero'`)
4. Verifique permissoes do Firestore Rules (precisa estar autenticado)

---

*📅 Criado em*: 19 FEV 2026
*📋 Versao*: 1.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [arquitetura, admin, factory, composable, firestore, dados, singleton, closure]
