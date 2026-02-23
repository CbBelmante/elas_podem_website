# 🎯 Section Fields - Sistema de Modos de Campos

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Sistema que define quais campos do admin sao editaveis, readonly ou hidden a partir de uma unica fonte de verdade.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Mudar um Campo](#-como-mudar-um-campo-essencial) (Essencial)
3. [Os 3 Modos](#-os-3-modos-importante) (Importante)
4. [Arquitetura](#-arquitetura-opcional) (Opcional)
5. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
6. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

Antes, cada campo do admin tinha sua definicao duplicada em 4 lugares:

```
editable.ts     → interface manual (IProgramEditable, IProgramReadonly)
formsData.ts    → container que importa as interfaces
HomeFormUtils.ts → separate/combine listava campo por campo
UI              → form inputs
```

Para mover `icon` de editavel para hidden: **4 arquivos**.

### A Solucao

Agora existe **1 unica fonte de verdade**: `definitions/sectionFields.ts`

```
sectionFields.ts → define o modo de cada campo ('editable' | 'readonly' | 'hidden')
editable.ts      → tipos DERIVADOS automaticamente (FieldsByMode + PreservedFields)
HomeFormUtils.ts  → separate/combine GENERICOS (leem o config em runtime)
UI               → form inputs
```

Para mover `icon` de editavel para hidden: **1 arquivo** (+ ajustar UI).

### Quando Usar

✅ **Consulte este guia quando:**
- Precisar mudar um campo de editavel para readonly/hidden (ou vice-versa)
- Adicionar um campo novo a uma secao
- Adicionar uma secao nova ao admin
- Entender como os tipos sao derivados

❌ **Nao precisa deste guia para:**
- Mudar textos default (va em `HomeFormUtils.ts` → `createDefault*()`)
- Mudar regras de validacao (va em `Validation_GUIDE.md`)
- Entender o fluxo de dados load/save (va em `PageData_GUIDE.md`)
- Mudar opcoes de cores/icones (va em `definitions/themeOptions.ts`)

---

## 🔧 Como Mudar um Campo (Essencial)

### Cenario: Mudar `icon` de editavel para hidden em Programs

**Passo 1** — Mude o modo em `definitions/sectionFields.ts`:

```typescript
programs: {
  title:       'editable',
  description: 'editable',
  icon:        'hidden',      // ← era 'editable', agora 'hidden'
  color:       'hidden',
  link:        'editable',
},
```

**Passo 2** — Ajuste a UI (remova o input do icon no formulario).

**Pronto.** Os tipos se recalculam. O separate/combine se adapta. O build passa.

### Cenario: Adicionar campo novo `subtitle` em Programs

**Passo 1** — Adicione a interface em `types/admin/sections.ts`:

```typescript
export interface IProgram {
  title: string;
  description: string;
  subtitle: string;       // ← NOVO
  icon: string;
  color: string;
  link: string;
}
```

**Passo 2** — Adicione o modo em `definitions/sectionFields.ts`:

```typescript
programs: {
  title:       'editable',
  description: 'editable',
  subtitle:    'editable',  // ← NOVO
  icon:        'editable',
  color:       'hidden',
  link:        'editable',
},
```

**Passo 3** — Adicione o default em `utils/HomeFormUtils.ts`:

```typescript
export function createDefaultProgramEditable(): IProgramEditable {
  return { title: '', description: '', subtitle: '', icon: 'luc-star', link: 'Saiba Mais' };
  //                                   ^^^^^^^^^ NOVO
}

export function createNewProgram(): IProgram {
  return { title: '', description: '', subtitle: '', icon: 'luc-star', color: 'magenta', link: 'Saiba Mais' };
  //                                   ^^^^^^^^^ NOVO
}
```

**Passo 4** — Adicione o input na UI do formulario.

### Cenario: Remover campo `btnHistory` do Hero

**Passo 1** — Remova da interface em `types/admin/sections.ts`:

```typescript
// ANTES:
export interface IHeroSection {
  badge: string;
  title: string;
  description: string;
  btnDonate: string;
  btnHistory: string;    // ← REMOVER
  heroImage: string;
  stats: IHeroStat[];
}

// DEPOIS:
export interface IHeroSection {
  badge: string;
  title: string;
  description: string;
  btnDonate: string;
  heroImage: string;
  stats: IHeroStat[];
}
```

**Passo 2** — Remova do config em `definitions/sectionFields.ts`:

```typescript
// ANTES:
hero: {
  badge: 'editable',
  title: 'editable',
  description: 'editable',
  btnDonate: 'editable',
  btnHistory: 'editable',    // ← REMOVER
  heroImage: 'editable',
  stats: 'editable',
},

// DEPOIS:
hero: {
  badge: 'editable',
  title: 'editable',
  description: 'editable',
  btnDonate: 'editable',
  heroImage: 'editable',
  stats: 'editable',
},
```

**Passo 3** — Siga os erros do TypeScript. O tipo `IHeroEditable` se recalcula automaticamente (nao tem mais `btnHistory`), entao o compilador vai apontar cada lugar que ainda referencia o campo removido:

```
❌ createDefaultHeroEditable() → Property 'btnHistory' does not exist
❌ template do admin → v-model="hero.editable.btnHistory" → erro
```

Corrija cada erro removendo a referencia. O TypeScript te guia — **voce nunca esquece de limpar algo**.

**Passo 4** — Remova o input da UI do formulario.

### Resumo dos 3 cenarios

| Cenario | Arquivos obrigatorios | O que o TypeScript faz |
|---------|----------------------|----------------------|
| **Mudar modo** | `sectionFields.ts` (1 arquivo) | Tipos recalculam, build passa |
| **Adicionar campo** | `sections.ts` + `sectionFields.ts` (2 arquivos) | Tipos expandem, defaults pedem o campo novo |
| **Remover campo** | `sections.ts` + `sectionFields.ts` (2 arquivos) | Tipos encolhem, erros guiam a limpeza |

---

## 🚀 Os 3 Modos (Importante)

| Modo | No form do admin | No save | Exemplo |
|------|-----------------|---------|---------|
| `editable` | Input editavel | Admin muda | title, description, image |
| `readonly` | Texto visivel, nao editavel | Preservado | *(reservado para uso futuro)* |
| `hidden` | Nao aparece | Preservado silenciosamente | color, og |

### Quando usar cada modo

**`editable`** — Conteudo que o admin precisa mudar:
- Textos (titulos, descricoes, botoes)
- Imagens (URLs do Firebase Storage)
- Arrays editaveis (stats, keywords, formSubjects)

**`readonly`** — Dados que o admin deve VER mas nao editar:
- Exemplo futuro: data de criacao, ID do documento
- Aparece no form como texto/badge desabilitado

**`hidden`** — Dados de design/config que o admin nao precisa saber:
- Cores do tema (magenta, coral) — decisao de design
- Config Open Graph (type, siteName, locale) — config tecnica

### Fluxo de dados

```
Firebase (flat)                    Admin (separado)
──────────────                     ──────────────────
{ title: "X",           separate   editable: { title: "X", icon: "star" }
  icon: "star",        ────────→   preserved: { color: "magenta" }
  color: "magenta" }

                                   Admin edita title → "Y"

editable: { title: "Y", icon: "star" }
preserved: { color: "magenta" }    combine    { title: "Y",
                                   ────────→    icon: "star",
                                                color: "magenta" }
                                                      ↓
                                                   Firebase
```

O admin mudou `title`, preservou `icon`, e `color` voltou intacto sem o admin saber.

---

## 🎨 Arquitetura (Opcional)

### Arquivos envolvidos

```
definitions/
└── sectionFields.ts        ← UNICA FONTE DE VERDADE (modos dos campos)

types/admin/
├── sections.ts             ← interfaces base (formato Firebase)
├── editable.ts             ← tipos DERIVADOS (FieldsByMode, PreservedFields)
├── formsData.ts            ← container + orquestrador (IHomeFormsData, ISaveResult, IValidationResult...)
└── index.ts                ← barrel exports

utils/
└── HomeFormUtils.ts        ← separate/combine GENERICOS + defaults
```

### Como os tipos sao derivados

```typescript
// definitions/sectionFields.ts — DEFINE os modos
programs: {
  title: 'editable',
  color: 'hidden',
},

// types/admin/editable.ts — DERIVA os tipos automaticamente

// Utility type: pega campos por modo
type FieldsByMode<T, Config, Mode> = Pick<T, campos onde Config[K] === Mode>

// Utility type: pega tudo que NAO e editable (readonly + hidden)
type PreservedFields<T, Config> = Pick<T, campos onde Config[K] === 'readonly' | 'hidden'>

// Tipos derivados:
type IProgramEditable = FieldsByMode<IProgram, config, 'editable'>
// = { title: string, description: string, icon: string, link: string }

type IProgramReadonly = PreservedFields<IProgram, config>
// = { color: string }
```

### Como o separate/combine funciona em runtime

```typescript
// utils/HomeFormUtils.ts — GENERICOS

function separateByFields(data, fields) {
  // Para cada campo no config:
  //   se mode === 'editable' → vai pro bucket editable
  //   senao (readonly ou hidden) → vai pro bucket readonly
  // Valores sao clonados (nao referencia)
}

function combineFromFields(editable, readonly) {
  // Junta os dois buckets: { ...readonly, ...editable }
  // Editable sobrescreve em caso de conflito
}

// Per-section wrappers chamam os genericos:
function separateProgramsData(data: IProgram[]) {
  return separateArrayByFields(data, SECTION_FIELDS.programs);
}
```

### Caso especial: Contact

Contact tem estrutura aninhada — campos top-level + methods[] com split proprio:

```typescript
// IContactSection = { badge, title, description, methods[], formSubjects[] }
// Os campos top-level sao TODOS editaveis
// Os methods[] tem split proprio (color e hidden)

// Entao Contact usa:
// - SECTION_FIELDS.contactMethod para o split dos methods
// - Campos top-level sao montados manualmente (todos editaveis)
```

---

## 📊 Referencia de Arquivos (Referencia)

### `definitions/sectionFields.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `FieldMode` | type | `'editable' \| 'readonly' \| 'hidden'` |
| `SECTION_FIELDS` | const | Mapa completo de campos por secao com seus modos |

### `types/admin/editable.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `FieldsByMode<T, Config, Mode>` | utility type | Extrai campos de T cujo mode no Config === Mode |
| `PreservedFields<T, Config>` | utility type | Extrai campos readonly + hidden (tudo que NAO e editable) |
| `I*Editable` | type alias | Campos editaveis por secao (derivados via FieldsByMode) |
| `I*Readonly` | type alias | Campos preservados por secao (derivados via PreservedFields) |

### `utils/HomeFormUtils.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `separate*Data()` | function | Firestore → { editable, readonly } |
| `combine*Data()` | function | { editable, readonly } → Firestore |
| `createDefault*()` | function | Valores iniciais para formulario vazio |
| `createNew*()` | function | Item em branco para CRUD [+Novo] |
| `separateAllSections()` | function | Converte IHomePageData inteira em IHomeFormsData |
| `createDefaultHomeForms()` | function | Gera IHomeFormsData completo com defaults |

### Mapa atual de campos

| Secao | Editable | Hidden | Readonly |
|-------|----------|--------|----------|
| **hero** | badge, title, description, btnDonate, btnHistory, heroImage, stats | — | — |
| **mission** | badge, title, text1, text2, btnText, image, imageAlt | — | — |
| **programs** | title, description, icon, link | color | — |
| **testimonials** | quote, name, role, initials, image, imageAlt | — | — |
| **supporters** | name, icon, image, imageAlt, url | color | — |
| **contactMethod** | label, value, icon, url | color | — |
| **values** | title, subtitle | color | — |
| **cta** | title, subtitle, btnDonate, btnProjects | — | — |
| **seo** | title, description, keywords, ogImage | og | — |

---

## 🔬 Como Funciona Por Dentro (Tecnico)

### O papel do `as const`

O `as const` em `sectionFields.ts` e o que permite tudo funcionar:

```typescript
// SEM as const:
const x = { color: 'hidden' }
// TypeScript entende: { color: string }
// Perdeu o valor literal — 'hidden' virou string generico

// COM as const:
const x = { color: 'hidden' } as const
// TypeScript entende: { readonly color: 'hidden' }
// PRESERVA o valor literal — permite filtrar por modo depois
```

Sem `as const`, o TypeScript nao consegue distinguir `'editable'` de `'hidden'` porque ambos sao apenas `string`.

---

### FieldsByMode — passo a passo

```typescript
export type FieldsByMode<
  T,                                      // interface base (ex: IProgram)
  Config extends Record<string, string>,  // config (ex: SECTION_FIELDS.programs)
  Mode extends string,                    // modo desejado (ex: 'editable')
> = Pick<
  T,
  { [K in keyof Config]: Config[K] extends Mode ? K : never }[keyof Config] & keyof T
>;
```

Exemplo concreto — `FieldsByMode<IProgram, SECTION_FIELDS.programs, 'editable'>`:

**Passo 1** — Para cada campo do config, pergunta: "o valor e `'editable'`?"

```
title:       'editable' extends 'editable'? SIM → 'title'
description: 'editable' extends 'editable'? SIM → 'description'
icon:        'editable' extends 'editable'? SIM → 'icon'
color:       'hidden'   extends 'editable'? NAO → never
link:        'editable' extends 'editable'? SIM → 'link'

= { title: 'title', description: 'description', icon: 'icon', color: never, link: 'link' }
```

**Passo 2** — Pega os valores (nomes dos campos aprovados):

```
'title' | 'description' | 'icon' | never | 'link'
= 'title' | 'description' | 'icon' | 'link'     (never desaparece em unions)
```

**Passo 3** — `& keyof T` garante que existem na interface:

```
('title' | 'description' | 'icon' | 'link') & keyof IProgram
= 'title' | 'description' | 'icon' | 'link'     (todos existem)
```

**Passo 4** — `Pick<IProgram, ...>` extrai so esses campos:

```typescript
Pick<IProgram, 'title' | 'description' | 'icon' | 'link'>
= { title: string, description: string, icon: string, link: string }
```

**Resultado:** `color` foi excluido automaticamente porque e `'hidden'`, nao `'editable'`.

Se amanha mudar `icon: 'hidden'` no config, o tipo recalcula sozinho:

```typescript
// Antes: { title, description, icon, link }
// Depois: { title, description, link }    ← icon sumiu automaticamente
```

---

### PreservedFields — a mesma logica invertida

```typescript
export type PreservedFields<T, Config> = Pick<
  T,
  { [K in keyof Config]: Config[K] extends 'readonly' | 'hidden' ? K : never }[keyof Config] & keyof T
>;
```

A diferenca: ao inves de filtrar por UM modo, pega **tudo que NAO e editable**:

```
title:       'editable' extends 'readonly' | 'hidden'? NAO → never
description: 'editable' extends 'readonly' | 'hidden'? NAO → never
icon:        'editable' extends 'readonly' | 'hidden'? NAO → never
color:       'hidden'   extends 'readonly' | 'hidden'? SIM → 'color'
link:        'editable' extends 'readonly' | 'hidden'? NAO → never

Pick<IProgram, 'color'> = { color: string }
```

---

### FieldsByMode e reutilizavel — 1 utility type serve pra tudo

```typescript
// Programs — editaveis
FieldsByMode<IProgram, config.programs, 'editable'>
// = { title, description, icon, link }

// Programs — hidden
FieldsByMode<IProgram, config.programs, 'hidden'>
// = { color }

// SEO — editaveis
FieldsByMode<ISeo, config.seo, 'editable'>
// = { title, description, keywords, ogImage }

// SEO — hidden
FieldsByMode<ISeo, config.seo, 'hidden'>
// = { og }

// Supporters — editaveis
FieldsByMode<ISupporter, config.supporters, 'editable'>
// = { name, icon, image, url }
```

Muda so os 3 parametros: qual interface, qual config, qual modo.

---

### Helpers de runtime — como separate/combine funcionam

Os utility types resolvem os TIPOS em compile time. Em runtime, quem faz o trabalho sao 4 helpers genericos:

#### `cloneValue` — copia segura

```typescript
function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => cloneValue(v));
  if (typeof value === 'object' && value !== null) return { ...value };
  return value;
}
```

Por que: sem clone, editar um campo no form alteraria o dado original do Firebase (mesma referencia em memoria). Com clone, cada um tem sua copia independente.

#### `separateByFields` — separa 1 objeto por modo

```typescript
function separateByFields(data, fields) {
  const editable = {};
  const readonly = {};

  for (const [key, mode] of Object.entries(fields)) {
    if (!(key in data)) continue;
    const target = mode === 'editable' ? editable : readonly;
    target[key] = cloneValue(data[key]);
  }

  return { editable, readonly };
}
```

Exemplo com dado real:

```
data   = { title: 'Comunicacao', icon: 'luc-megaphone', color: 'magenta', ... }
fields = { title: 'editable', icon: 'editable', color: 'hidden', ... }

Loop:
  key='title', mode='editable' → editable.title = 'Comunicacao'
  key='icon',  mode='editable' → editable.icon = 'luc-megaphone'
  key='color', mode='hidden'   → readonly.color = 'magenta'  (nao e 'editable' → vai pro readonly)

Resultado:
  editable: { title: 'Comunicacao', icon: 'luc-megaphone', ... }
  readonly: { color: 'magenta' }
```

**Detalhe:** a unica checagem e `mode === 'editable'`. Tudo que nao e editable (seja `'readonly'` ou `'hidden'`) vai pro mesmo bucket. Simples.

#### `combineFromFields` — junta de volta (1 linha)

```typescript
function combineFromFields(editable, readonly) {
  return { ...readonly, ...editable };
}
```

Na hora do save: `{ color: 'magenta' } + { title: 'Educacao', icon: 'luc-star', ... }` = dado flat completo pro Firebase.

#### `separateArrayByFields` — versao pra arrays

```typescript
function separateArrayByFields(data, fields) {
  const results = data.map((item) => separateByFields(item, fields));
  return {
    editable: results.map((r) => r.editable),
    readonly: results.map((r) => r.readonly),
  };
}
```

Aplica `separateByFields` em cada item do array. Resultado: arrays pareados por indice.

```
Firebase: [
  { title: 'Comunicacao', color: 'magenta' },     // [0]
  { title: 'Educacao',    color: 'coral' },        // [1]
]

editable: [
  { title: 'Comunicacao' },   // [0]
  { title: 'Educacao' },      // [1]
]
readonly: [
  { color: 'magenta' },       // [0] casa com editable[0]
  { color: 'coral' },         // [1] casa com editable[1]
]
```

---

### Tipos vs Runtime — dois lados da mesma moeda

O mesmo config (`SECTION_FIELDS`) alimenta os dois mundos:

```
SECTION_FIELDS.programs = { title: 'editable', color: 'hidden', ... }
        |                                               |
        ↓ (compile time)                                ↓ (runtime)
  FieldsByMode / PreservedFields              separateByFields / combineFromFields
  geram os TIPOS corretos                    separam os DADOS corretamente
  (TypeScript grita se errar)                (JavaScript executa a separacao)
```

Ambos leem o mesmo config, entao estao sempre sincronizados. Se mudar `icon: 'hidden'` no config:
- **Compile time:** FieldsByMode remove `icon` do tipo IProgramEditable → TypeScript grita se a UI tentar acessar `editable.icon`
- **Runtime:** separateByFields coloca `icon` no bucket readonly → o dado vai pro lugar certo

---

## 💡 FAQ (Suporte)

### Mudei o modo de um campo e o build quebrou?

Verifique se o campo existe em `types/admin/sections.ts`. O `SECTION_FIELDS` deve listar **exatamente os mesmos campos** que a interface base.

### Preciso de um 4o modo (ex: 'computed')?

Adicione ao `FieldMode` type em `sectionFields.ts`. Depois decida se `PreservedFields` deve incluir o novo modo ou nao. O `separateByFields` em runtime coloca tudo que nao e `'editable'` no bucket readonly.

### Contact e mais complexo que as outras secoes. Por que?

Porque Contact tem **2 niveis de split**: campos top-level (badge, title) + sub-array methods[] onde cada method tambem tem split (color e hidden). As outras secoes sao flat ou arrays simples.

### Posso ter um campo que e editable em uma secao e hidden em outra?

Sim, cada secao tem seu proprio config independente. `icon` pode ser `'editable'` em programs e `'hidden'` em supporters, por exemplo.

### Como adicionar uma secao nova (ex: gallery)?

1. Crie a interface em `types/admin/sections.ts` (ex: `IGalleryItem`)
2. Adicione em `IHomePageData.content`
3. Adicione os modos em `definitions/sectionFields.ts` (ex: `gallery: { ... }`)
4. Os tipos Editable/Readonly sao derivados automaticamente em `editable.ts`
5. Adicione as funcoes em `HomeFormUtils.ts` (separate, combine, createDefault)
6. Adicione o bloco no `IHomeFormsData` em `formsData.ts`
7. Crie a UI do formulario

---

*📅 Criado em*: 18 FEV 2026
*📋 Versao*: 1.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [arquitetura, admin, tipos, sectionFields, editable, readonly, hidden]
