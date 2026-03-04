# 🎯 Section Fields - Sistema de Modos de Campos

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-2.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Sistema que define quais campos do admin sao editaveis, readonly ou hidden a partir de uma unica fonte de verdade.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Mudar um Campo](#-como-mudar-um-campo-essencial) (Essencial)
3. [Como Adicionar um Campo](#-como-adicionar-um-campo-essencial) (Essencial)
4. [Como Remover um Campo](#-como-remover-um-campo-essencial) (Essencial)
5. [Os 3 Modos](#-os-3-modos-importante) (Importante)
6. [Arquitetura](#-arquitetura-opcional) (Opcional)
7. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
8. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

Antes, cada campo do admin tinha sua definicao duplicada em 4+ lugares:

```
sections.ts      → interface base
editable.ts      → interface manual (IProgramEditable, IProgramReadonly)
HomeFormUtils.ts → separate/combine listava campo por campo
sectionDefaults  → defaults
UI               → form inputs
```

Para mover `icon` de editavel para hidden: **4+ arquivos**.

### A Solucao

Agora existe **1 unica fonte de verdade**: `definitions/sectionFields.ts`

```
sectionFields.ts      → define o modo de cada campo ('editable' | 'readonly' | 'hidden')
editable.ts           → tipos DERIVADOS automaticamente (FieldsByMode + PreservedFields)
sectionFieldsUtils.ts → helpers genéricos de split/combine (leem o config em runtime)
HomeFormUtils.ts      → thin wrappers por secao (delegam pros genericos)
UI                    → form inputs
```

Para mover `icon` de editavel para hidden: **1 arquivo** (+ ajustar UI).

### Dois tipos de secao

| Tipo | Descricao | Exemplo | Estrutura no config |
|------|-----------|---------|---------------------|
| **Flat** | Campos simples no root | hero, mission, values, cta, seo | `{ campo: 'editable' }` |
| **Wrapper** | Campos section-level + array de items | programs, testimonials, supporters, contact | `{ badge: 'editable', items: { name: 'editable' } }` |

### Quando Usar

✅ **Consulte este guia quando:**
- Precisar mudar um campo de editavel para readonly/hidden (ou vice-versa)
- Adicionar um campo novo a uma secao
- Remover um campo existente
- Adicionar uma secao nova ao admin
- Entender como os tipos sao derivados

❌ **Nao precisa deste guia para:**
- Mudar textos default (va em `definitions/sectionDefaults.ts`)
- Mudar regras de validacao (va em `Validation_GUIDE.md`)
- Entender o fluxo de dados load/save (va em `PageData_GUIDE.md`)
- Mudar opcoes de cores/icones (va em `definitions/themeOptions.ts`)

---

## 🔧 Como Mudar um Campo (Essencial)

### Cenario: Mudar `color` de editable para hidden em Programs

**Passo 1** — Mude o modo em `definitions/sectionFields.ts`:

```typescript
programs: {
  badge: 'editable',
  title: 'editable',
  subtitle: 'editable',
  items: {
    title: 'editable',
    description: 'editable',
    icon: 'editable',
    color: 'hidden',      // ← era 'editable', agora 'hidden'
    link: 'editable',
    tags: 'editable',
    tagColor: 'editable',
  },
},
```

**Passo 2** — Ajuste a UI (remova o input do color no formulario).

**Pronto.** Os tipos se recalculam. O separate/combine se adapta. O build passa.

---

## ➕ Como Adicionar um Campo (Essencial)

### Cenario A: Adicionar campo item-level `subtitle` em Programs

**Passo 1** — Adicione na interface em `types/admin/sections.ts`:

```typescript
export interface IProgram {
  title: string;
  description: string;
  subtitle: string;       // ← NOVO
  icon: string;
  color: string;
  link: string;
  tags: string[];
  tagColor: string;
}
```

**Passo 2** — Adicione o modo em `definitions/sectionFields.ts`:

```typescript
programs: {
  badge: 'editable',
  title: 'editable',
  subtitle: 'editable',
  items: {
    title: 'editable',
    description: 'editable',
    subtitle: 'editable',  // ← NOVO
    icon: 'editable',
    color: 'editable',
    link: 'editable',
    tags: 'editable',
    tagColor: 'editable',
  },
},
```

**Passo 3** — Adicione o default em `definitions/sectionDefaults.ts`:

```typescript
export const PROGRAM_ITEM_DEFAULTS = {
  title: '',
  description: '',
  subtitle: '',            // ← NOVO
  icon: 'luc-star',
  color: 'magenta',
  link: 'Saiba Mais',
  tags: [],
  tagColor: 'magenta',
} as const;
```

**Passo 4** — Adicione o input na UI do formulario.

**Pronto.** O tipo `IProgramEditable` ja inclui `subtitle` automaticamente. O `separateWrapperByFields` ja le o novo campo do config. Zero mudanca em `editable.ts` ou `HomeFormUtils.ts`.

### Cenario B: Adicionar campo section-level `logoSize` em Supporters

**Passo 1** — Adicione na interface da secao em `types/admin/sections.ts`:

```typescript
export interface ISupporter {
  name: string;
  icon: string;
  image: string;
  imageAlt: string;
  url: string;
  logoSize: number;       // ← NOVO (item-level, cada supporter tem o seu)
}
```

> **Decisao:** campo section-level (um valor pra todos) ou item-level (cada item tem o seu)?
> Section-level → vai no root do config. Item-level → vai dentro de `items`.

**Passo 2** — Adicione o modo em `definitions/sectionFields.ts`:

```typescript
supporters: {
  badge: 'editable',
  title: 'editable',
  subtitle: 'editable',
  marqueeSpeed: 'editable',
  items: {
    name: 'editable',
    icon: 'editable',
    image: 'editable',
    imageAlt: 'editable',
    url: 'editable',
    logoSize: 'editable',   // ← NOVO
  },
},
```

**Passo 3** — Adicione o default em `definitions/sectionDefaults.ts`:

```typescript
export const SUPPORTER_ITEM_DEFAULTS = {
  name: '',
  icon: 'luc-building-2',
  image: '',
  imageAlt: '',
  url: '',
  logoSize: 48,            // ← NOVO
} as const;
```

**Passo 4** — Adicione o input na UI do formulario.

### Resumo: Adicionar campo

| Nivel | Arquivos | O que muda automaticamente |
|-------|----------|---------------------------|
| **Item-level** (ex: `subtitle` em IProgram) | `sections.ts` + `sectionFields.ts` + `sectionDefaults.ts` (3 arquivos) | Tipos expandem, separate/combine adaptam |
| **Section-level** (ex: `marqueeSpeed` em ISupportersSection) | `sections.ts` + `sectionFields.ts` + `sectionDefaults.ts` (3 arquivos) | Tipos expandem, separate/combine adaptam |

---

## ➖ Como Remover um Campo (Essencial)

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
  btnDonate: 'editable',
  btnHistory: 'editable',    // ← REMOVER
  heroImage: 'editable',
},

// DEPOIS:
hero: {
  btnDonate: 'editable',
  heroImage: 'editable',
},
```

**Passo 3** — Remova do default em `definitions/sectionDefaults.ts` (se existir).

**Passo 4** — Siga os erros do TypeScript. O tipo `IHeroEditable` se recalcula automaticamente (nao tem mais `btnHistory`), entao o compilador vai apontar cada lugar que ainda referencia o campo removido:

```
❌ createDefaultHeroEditable() → Property 'btnHistory' does not exist
❌ template do admin → v-model="hero.editable.btnHistory" → erro
```

Corrija cada erro removendo a referencia. O TypeScript te guia — **voce nunca esquece de limpar algo**.

### Resumo dos 3 cenarios

| Cenario | Arquivos obrigatorios | O que o TypeScript faz |
|---------|----------------------|----------------------|
| **Mudar modo** | `sectionFields.ts` (1 arquivo) | Tipos recalculam, build passa |
| **Adicionar campo** | `sections.ts` + `sectionFields.ts` + `sectionDefaults.ts` (3 arquivos) | Tipos expandem, defaults pedem o campo novo |
| **Remover campo** | `sections.ts` + `sectionFields.ts` + `sectionDefaults.ts` (3 arquivos) | Tipos encolhem, erros guiam a limpeza |

---

## 🚀 Os 3 Modos (Importante)

| Modo | No form do admin | No save | Exemplo |
|------|-----------------|---------|---------|
| `editable` | Input editavel | Admin muda | title, description, image |
| `readonly` | Texto visivel, nao editavel | Preservado | *(reservado para uso futuro)* |
| `hidden` | Nao aparece | Preservado silenciosamente | og (Open Graph) |

### Quando usar cada modo

**`editable`** — Conteudo que o admin precisa mudar:
- Textos (titulos, descricoes, botoes)
- Imagens (URLs do Storage — Cloudinary/Firebase)
- Arrays editaveis (stats, keywords, formSubjects, tags)
- Numeros de config (marqueeSpeed, logoSize, heroImageOpacity)

**`readonly`** — Dados que o admin deve VER mas nao editar:
- Exemplo futuro: data de criacao, ID do documento
- Aparece no form como texto/badge desabilitado

**`hidden`** — Dados de config tecnica que o admin nao precisa saber:
- Config Open Graph (type, siteName, locale) — `seo.og` e o unico campo hidden atualmente

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
├── sectionFields.ts         ← UNICA FONTE DE VERDADE (modos dos campos)
└── sectionDefaults.ts       ← valores default por secao/item

types/admin/
├── sections.ts              ← interfaces base (formato Firebase)
├── editable.ts              ← tipos DERIVADOS (FieldsByMode, PreservedFields, ExtractItemConfig)
├── formsData.ts             ← container (IHomeFormsData, ISaveResult, IValidationResult)
└── index.ts                 ← barrel exports

utils/
├── sectionFieldsUtils.ts    ← helpers GENERICOS de split/combine (nao sabe sobre secoes)
└── HomeFormUtils.ts         ← thin wrappers por secao (delegam pros genericos)
```

### Secoes flat vs wrapper

**Secoes flat** (hero, mission, values, cta, seo):
- Campos direto no root do config
- Usam `separateByFields` / `combineFromFields`
- Tipos: `FieldsByMode<IHeroSection, config.hero, 'editable'>`

**Secoes wrapper** (programs, testimonials, supporters, contact):
- Section-level no root + item-level em `items` (ou `methods` no contact)
- Usam `separateWrapperByFields` / `combineWrapperFromFields`
- Tipos: section-level (`FieldsByMode` no root) + item-level (`FieldsByMode` via `ExtractItemConfig`)
- O tipo final e a intersecao: `ISectionEditable & { items: IItemEditable[] }`

```typescript
// Exemplo: Supporters

// Config:
supporters: {
  badge: 'editable',        // section-level
  title: 'editable',        // section-level
  marqueeSpeed: 'editable', // section-level
  items: {                   // item-level
    name: 'editable',
    logoSize: 'editable',
  },
}

// Tipo derivado:
type ISupportersSectionEditable = { badge: string; title: string; marqueeSpeed: number }
type ISupporterEditable = { name: string; logoSize: number }
type ISupportersEditable = ISupportersSectionEditable & { items: ISupporterEditable[] }
// = { badge, title, marqueeSpeed, items: [{ name, logoSize }] }
```

### Como os tipos sao derivados

```typescript
// definitions/sectionFields.ts — DEFINE os modos
programs: {
  badge: 'editable',     // section-level
  items: {
    title: 'editable',   // item-level
    color: 'hidden',     // item-level
  },
},

// types/admin/editable.ts — DERIVA os tipos automaticamente

// Utility types:
type FieldsByMode<T, Config, Mode>        // Pega campos onde Config[K] === Mode
type PreservedFields<T, Config>           // Pega campos readonly + hidden
type ExtractItemConfig<Config, 'items'>   // Extrai o sub-config de items

// Item-level:
type IProgramEditable = FieldsByMode<IProgram, ExtractItemConfig<config, 'items'>, 'editable'>
// = { title: string, description: string, icon: string, link: string, tags: string[], tagColor: string }

type IProgramReadonly = PreservedFields<IProgram, ExtractItemConfig<config, 'items'>>
// = { color: string }

// Section-level:
type IProgramsSectionEditable = FieldsByMode<IProgramsSection, config.programs, 'editable'>
// = { badge: string, title: string, subtitle: string }

// Tipo final (intersecao):
type IProgramsEditable = IProgramsSectionEditable & { items: IProgramEditable[] }
```

### Helpers genericos (sectionFieldsUtils.ts)

| Funcao | Tipo | Descricao |
|--------|------|-----------|
| `separateByFields(data, fields)` | flat | Separa 1 objeto em editable/readonly por modo |
| `combineFromFields(editable, readonly)` | flat | Junta editable + readonly de volta |
| `separateArrayByFields(data, fields)` | array | Separa array em editable[]/readonly[] pareados |
| `combineArrayFromFields({ editable, readonly })` | array | Junta arrays pareados de volta |
| `separateWrapperByFields({ data, fields, sectionDefaults })` | wrapper | Separa section-level + item-level automaticamente |
| `combineWrapperFromFields({ editable, readonly, fields })` | wrapper | Junta section-level + item-level de volta |
| `getItemFields(fields)` | descoberta | Encontra a chave nested (items/methods) no config |
| `getSectionFields(fields)` | descoberta | Filtra apenas campos section-level (string FieldMode) |

### Thin wrappers (HomeFormUtils.ts)

Cada secao wrapper tem 4 funcoes que delegam pros genericos:

| Funcao | Faz o que |
|--------|-----------|
| `separate*Data(data)` | Chama `separateWrapperByFields` + cast de tipo |
| `combine*Data(editable, readonly)` | Chama `combineWrapperFromFields` + cast de tipo |
| `createDefault*Editable()` | Cria editable vazio (estado inicial do form) |
| `createNew*()` | Cria 1 item novo (botao [+Novo] do CRUD) |

Secoes flat (hero, mission, values, cta, seo) delegam pra `separateByFields` / `combineFromFields`.

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
| `ExtractItemConfig<Config, Key>` | utility type | Extrai sub-config de items/methods |
| `I*Editable` | type alias | Campos editaveis por secao (derivados via FieldsByMode) |
| `I*Readonly` | type alias | Campos preservados por secao (derivados via PreservedFields) |

### `utils/sectionFieldsUtils.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `separateByFields()` | function | Objeto flat → { editable, readonly } |
| `combineFromFields()` | function | { editable, readonly } → objeto flat |
| `separateArrayByFields()` | function | Array → { editable[], readonly[] } pareados |
| `combineArrayFromFields()` | function | { editable[], readonly[] } → array flat |
| `separateWrapperByFields()` | function | Wrapper → { editable, readonly } com section + items |
| `combineWrapperFromFields()` | function | { editable, readonly } → wrapper flat |
| `getItemFields()` | function | Descobre chave nested no config (items/methods) |
| `getSectionFields()` | function | Filtra campos section-level do config |

### `utils/HomeFormUtils.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `separate*Data()` | function | Firestore → { editable, readonly } por secao |
| `combine*Data()` | function | { editable, readonly } → Firestore por secao |
| `createDefault*Editable()` | function | Valores iniciais para formulario vazio |
| `createNew*()` | function | Item em branco para CRUD [+Novo] |
| `separateAllSections()` | function | Converte IHomePageData inteira em IHomeFormsData |
| `createDefaultHomeForms()` | function | Gera IHomeFormsData completo com defaults |

### Mapa atual de campos

#### Secoes flat

| Secao | Editable | Hidden |
|-------|----------|--------|
| **hero** | badge, title, description, btnDonate, btnDonateColor, btnDonateVariant, btnHistory, btnHistoryColor, btnHistoryVariant, heroImage, heroImageOpacity, stats | — |
| **mission** | badge, title, paragraphs, btnText, btnColor, btnVariant, image, imageOpacity, imageAlt | — |
| **values** | title, subtitle, color | — |
| **cta** | title, subtitle, btnDonate, btnDonateColor, btnDonateVariant, btnProjects, btnProjectsColor, btnProjectsVariant | — |
| **seo** | title, description, keywords, ogImage | og |

#### Secoes wrapper

| Secao | Section-level (editable) | Item-level (editable) | Item-level (hidden) |
|-------|--------------------------|-----------------------|---------------------|
| **programs** | badge, title, subtitle | title, description, icon, color, link, tags, tagColor | — |
| **testimonials** | autoplay, autoplayInterval | quote, name, role, initials, image, imageAlt | — |
| **supporters** | badge, title, subtitle, marqueeSpeed | name, icon, image, imageAlt, url, logoSize | — |
| **contact** | badge, title, description, formSubjects | label, value, icon, color, url (via `methods`) | — |

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
  T,                                        // interface base (ex: IProgram)
  Config extends Record<string, unknown>,   // config (ex: SECTION_FIELDS.programs.items)
  Mode extends string,                      // modo desejado (ex: 'editable')
> = Pick<
  T,
  { [K in keyof Config]: Config[K] extends Mode ? K : never }[keyof Config] & keyof T
>;
```

Exemplo concreto — `FieldsByMode<IProgram, config.programs.items, 'editable'>`:

**Passo 1** — Para cada campo do config, pergunta: "o valor e `'editable'`?"

```
title:       'editable' extends 'editable'? SIM → 'title'
description: 'editable' extends 'editable'? SIM → 'description'
icon:        'editable' extends 'editable'? SIM → 'icon'
color:       'hidden'   extends 'editable'? NAO → never
link:        'editable' extends 'editable'? SIM → 'link'
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

### Por que FieldsByMode funciona com secoes wrapper

Na secao wrapper, o root tem strings (`badge: 'editable'`) + um objeto (`items: { ... }`). O `FieldsByMode` usa `Config[K] extends Mode` — como `Mode` e uma string ('editable'), o objeto `items` **nunca** matcheia `extends 'editable'`, entao e ignorado automaticamente:

```
badge:  'editable' extends 'editable'? SIM → 'badge'
title:  'editable' extends 'editable'? SIM → 'title'
items:  { name: 'editable', ... } extends 'editable'? NAO → never  (objeto ≠ string)
```

---

### ExtractItemConfig — extrair sub-config de items

```typescript
type ExtractItemConfig<Config, Key extends string> =
  Config extends Record<Key, infer S extends Record<string, unknown>>
    ? S
    : never;
```

Pega o sub-objeto `items` (ou `methods`) do config wrapper:

```typescript
ExtractItemConfig<typeof SECTION_FIELDS.programs, 'items'>
// = { title: 'editable', description: 'editable', icon: 'editable', color: 'editable', ... }
```

Isso permite derivar os tipos item-level:

```typescript
type IProgramEditable = FieldsByMode<IProgram, ExtractItemConfig<config, 'items'>, 'editable'>
```

---

### Helpers de runtime — como separate/combine funcionam

#### Secoes flat: `separateByFields` + `combineFromFields`

```typescript
// separateByFields: para cada campo no config, separa por modo
for (const [key, mode] of Object.entries(fields)) {
  const target = mode === 'editable' ? editable : readonly;
  target[key] = cloneValue(data[key]);
}

// combineFromFields: junta de volta (1 linha)
return { ...readonly, ...editable };
```

#### Secoes wrapper: `separateWrapperByFields` + `combineWrapperFromFields`

```
separateWrapperByFields:
  1. getItemFields(config) → descobre 'items' (ou 'methods')
  2. getSectionFields(config) → filtra campos section-level (strings)
  3. Separa section-level por modo → sectionEditable
  4. Separa array item-level por modo → itemsEditable[], itemsReadonly[]
  5. Retorna { editable: { ...sectionEditable, items: itemsEditable }, readonly: { items: itemsReadonly } }

combineWrapperFromFields:
  1. getItemFields(config) → descobre 'items'
  2. Copia campos section-level do editable/readonly pro result
  3. Recombina arrays item a item (combineArrayFromFields)
  4. Retorna objeto flat pro Firestore
```

---

### Tipos vs Runtime — dois lados da mesma moeda

O mesmo config (`SECTION_FIELDS`) alimenta os dois mundos:

```
SECTION_FIELDS.programs = { badge: 'editable', items: { title: 'editable', color: 'hidden' } }
        |                                               |
        ↓ (compile time)                                ↓ (runtime)
  FieldsByMode / ExtractItemConfig              separateWrapperByFields / combineWrapperFromFields
  geram os TIPOS corretos                      separam os DADOS corretamente
  (TypeScript grita se errar)                  (JavaScript executa a separacao)
```

Ambos leem o mesmo config, entao estao sempre sincronizados.

---

## 💡 FAQ (Suporte)

### Mudei o modo de um campo e o build quebrou?

Verifique se o campo existe em `types/admin/sections.ts`. O `SECTION_FIELDS` deve listar **exatamente os mesmos campos** que a interface base.

### Preciso de um 4o modo (ex: 'computed')?

Adicione ao `FieldMode` type em `sectionFields.ts`. Depois decida se `PreservedFields` deve incluir o novo modo ou nao. O `separateByFields` em runtime coloca tudo que nao e `'editable'` no bucket readonly.

### Qual a diferenca entre section-level e item-level?

- **Section-level**: se aplica a secao inteira (ex: `badge`, `marqueeSpeed`)
- **Item-level**: se aplica a cada item individual (ex: `name`, `logoSize`)
- No config: section-level fica no root, item-level fica dentro de `items` (ou `methods`)
- No tipo: o tipo final e a intersecao dos dois

### Por que Contact usa `methods` em vez de `items`?

Porque o Firestore armazena como `methods` (sao metodos de contato: email, telefone, WhatsApp). O `getItemFields()` detecta qualquer chave nested automaticamente — nao depende do nome ser `items`.

### Posso ter um campo que e editable em uma secao e hidden em outra?

Sim, cada secao tem seu proprio config independente. `icon` pode ser `'editable'` em programs e `'hidden'` em supporters.

### Como adicionar uma secao nova (ex: gallery)?

1. Crie a interface em `types/admin/sections.ts` (ex: `IGalleryItem`, `IGallerySection`)
2. Adicione em `IHomePageData.content`
3. Adicione os modos em `definitions/sectionFields.ts`
4. Adicione defaults em `definitions/sectionDefaults.ts`
5. Os tipos Editable/Readonly sao derivados automaticamente em `editable.ts`
6. Adicione thin wrappers em `HomeFormUtils.ts` (separate, combine, createDefault, createNew)
7. Adicione o bloco no `IHomeFormsData` em `formsData.ts`
8. Adicione fallback em `definitions/homeFallbacks.ts`
9. Crie a UI do formulario

### Onde ficam os helpers genericos?

Em `utils/sectionFieldsUtils.ts`. Esses helpers nao sabem nada sobre secoes especificas — so leem configs e separam/combinam dados. A HomeFormUtils.ts importa deles e faz thin wrappers tipados por secao.

---

*📅 Criado em*: 18 FEV 2026
*📅 Ultima atualizacao*: 03 MAR 2026
*📋 Versao*: 2.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [arquitetura, admin, tipos, sectionFields, editable, readonly, hidden, wrapper, section-level, item-level]
