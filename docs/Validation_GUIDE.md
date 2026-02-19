# 🛡️ Validation - Sistema de Validacao Config-Driven

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Sistema de validacao que le regras de configs centralizados. Adicionar campo no config = validacao automatica, sem listar campos manualmente.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Usar no Editor](#-como-usar-no-editor-essencial) (Essencial)
3. [Como Adicionar Validacao](#-como-adicionar-validacao-essencial) (Essencial)
4. [Configs de Validacao](#-configs-de-validacao-importante) (Importante)
5. [Arquitetura](#-arquitetura-opcional) (Opcional)
6. [Como Funciona Por Dentro](#-como-funciona-por-dentro-tecnico) (Tecnico)
7. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
8. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

Cada secao do admin tem campos com regras diferentes:
- Hero: titulo obrigatorio, 3-30 caracteres
- SEO: description max 160 caracteres, keywords min 1
- Programs: min 1, max 8 programas, cada um com titulo obrigatorio

Sem centralizacao, regras ficam espalhadas no codigo — dificil mudar e facil esquecer.

### A Solucao

2 camadas que trabalham juntas:

```
definitions/validationConfigs.ts    →  REGRAS (o que validar)
composables/useValidation.ts        →  LOGICA (como validar)
```

O `useValidation` le as regras dos configs em **runtime**. Adicionar campo no config = validacao automatica.

```
Antes: Para validar campo novo → editar config + editar validador + editar lista de campos
Agora: Para validar campo novo → editar config (so 1 lugar)
```

### Quando Usar

✅ **Consulte este guia quando:**
- Precisar adicionar regra de validacao para campo novo
- Quiser mudar limites (minLength, maxLength, min items)
- Precisar criar validador para secao nova
- Quiser entender como validacao e acionada antes do save

❌ **Nao precisa deste guia para:**
- Mudar modos de campos (editable/readonly) → va em `SectionFields_GUIDE.md`
- Entender o fluxo de dados → va em `PageData_GUIDE.md`
- Validacao de formulario na UI (`:rules` do CBInput) → va em `validationRules.ts`

---

## 🔧 Como Usar no Editor (Essencial)

### Validar antes de salvar

```typescript
const { validateHero } = useValidation();
const { forms, saveSection } = useHomePageData();

const handleSave = async () => {
  // 1. Valida
  const result = validateHero(forms.value.hero.editable);

  if (!result.isValid) {
    // Mostra erros pro usuario
    console.error(result.errors);
    // → ["Erros em Hero:", '"title" e obrigatorio', '"subtitle" precisa ter no minimo 10 caracteres']
    return;
  }

  // 2. Salva (so se valido)
  await saveSection('hero');
};
```

### Validar array de itens

```typescript
const { validatePrograms } = useValidation();

const result = validatePrograms(forms.value.programs.editable);
// Valida quantidade (min 1, max 8) + cada item (title, description obrigatorios)

if (!result.isValid) {
  console.error(result.errors);
  // → ["Programas: minimo 1 item(ns)", 'Erros em Programa #1:', '"title" e obrigatorio']
}
```

### Validar secao com sub-arrays

```typescript
const { validateContact } = useValidation();

const result = validateContact(forms.value.contact.editable);
// Valida campos top-level (badge, title, description)
// + methods (min 1, max 8)
// + formSubjects (min 1, max 10)
```

### Formato do resultado

Toda funcao de validacao retorna `ValidationResult`:

```typescript
interface ValidationResult {
  isValid: boolean;     // true = sem erros, pode salvar
  errors: string[];     // array vazio se valido, mensagens se invalido
}
```

---

## 🔧 Como Adicionar Validacao (Essencial)

### Cenario 1: Adicionar campo existente a uma secao

Basta adicionar a regra no config. O validador ja le automaticamente.

```typescript
// definitions/validationConfigs.ts
export const HERO_CONFIG = {
  validationRules: {
    badge:      { required: true, minLength: 3, maxLength: 60 },
    title:      { required: true, minLength: 3, maxLength: 30 },
    subtitle:   { required: true, minLength: 10, maxLength: 300 },
    btnDonate:  { required: true, minLength: 2, maxLength: 30 },
    btnHistory: { required: true, minLength: 2, maxLength: 30 },
    videoUrl:   { required: false, maxLength: 200 },   // ← NOVO CAMPO
  },
};
```

**Pronto.** `validateHero()` ja valida `videoUrl` automaticamente (le o config em runtime).

### Cenario 2: Mudar limites

```typescript
// Antes: title max 30
title: { required: true, minLength: 3, maxLength: 30 },

// Depois: title max 50
title: { required: true, minLength: 3, maxLength: 50 },
```

**1 lugar.** Todos os validadores que usam `HERO_CONFIG.validationRules` pegam o novo limite.

### Cenario 3: Criar validador para secao nova

```typescript
// composables/useValidation.ts — adicionar no return

const validateAboutIntro = (data: Record<string, unknown>): ValidationResult => {
  return validateFields(data, ABOUT_INTRO_CONFIG.validationRules, 'Intro');
};
```

Onde `ABOUT_INTRO_CONFIG` segue o mesmo pattern dos configs existentes:

```typescript
// definitions/validationConfigs.ts
export const ABOUT_INTRO_CONFIG = {
  validationRules: {
    title: { required: true, minLength: 5, maxLength: 80 },
    description: { required: true, minLength: 20, maxLength: 500 },
  },
};
```

### Cenario 4: Validar campo com logica especial

Para regras que vao alem de required/minLength/maxLength, adicione no validador:

```typescript
const validateSeo = (data: Record<string, unknown>): ValidationResult => {
  const result = validateFields(data, SEO_CONFIG.validationRules, 'SEO');
  const errors = [...result.errors];

  // ↓ Validacao especial: URL precisa ser valida
  if (data.ogImage && typeof data.ogImage === 'string' && !isValidUrl(data.ogImage)) {
    errors.push('SEO: URL da imagem OG invalida');
  }

  return { isValid: errors.length === 0, errors };
};
```

---

## 📐 Configs de Validacao (Importante)

### Estrutura de um config

Cada config tem 2 tipos de regras:

```typescript
export const SECTION_CONFIG = {
  // Regras por campo (required, minLength, maxLength)
  validationRules: {
    campo1: { required: true, minLength: 5, maxLength: 100 },
    campo2: { required: false, maxLength: 200 },
  },

  // Regras de quantidade (para arrays)
  items: { min: 1, max: 10 },

  // Sub-arrays podem ter regras proprias
  subItems: { min: 1, max: 5 },
};
```

### Todos os configs atuais

| Config | Secao | Campos validados | Arrays |
|--------|-------|-----------------|--------|
| `HERO_CONFIG` | Hero | badge, title, subtitle, btnDonate, btnHistory | stats: 1-6 |
| `MISSION_CONFIG` | Missao | badge, title, text1, text2, btnText | — |
| `PROGRAMS_CONFIG` | Programas | title, description, link | items: 1-8 |
| `TESTIMONIALS_CONFIG` | Depoimentos | quote, name, role | items: 1-12 |
| `SUPPORTERS_CONFIG` | Apoiadores | name | items: 1-20 |
| `CONTACT_CONFIG` | Contato | badge, title, description | methods: 1-8, formSubjects: 1-10 |
| `CTA_CONFIG` | CTA | title, subtitle, btnDonate, btnProjects | — |
| `SEO_CONFIG` | SEO | title, description | keywords: 1-20 |

### Regras disponiveis por campo

| Regra | Tipo | Descricao | Exemplo |
|-------|------|-----------|---------|
| `required` | boolean | Campo obrigatorio (nao pode ser vazio) | `{ required: true }` |
| `minLength` | number | Minimo de caracteres | `{ minLength: 3 }` |
| `maxLength` | number | Maximo de caracteres | `{ maxLength: 60 }` |

### validationRules.ts vs validationConfigs.ts

Sao coisas diferentes:

```
validationConfigs.ts  →  DADOS: limites por secao (min, max, required)
                          Usado pelo useValidation (validacao pre-save)

validationRules.ts    →  FUNCOES: gera array de rules para CBInput (:rules)
                          Usado na UI (validacao em tempo real)
```

```typescript
// validationRules.ts — gera rules pro CBInput
const rules = createValidationRules({ required: true, minLength: 5 });
// → [(v) => !!v || 'Campo obrigatorio', (v) => v.length >= 5 || 'Minimo 5 caracteres']

// Template:
<CBInput v-model="title" :rules="rules" />
```

---

## 🎨 Arquitetura (Opcional)

### Arquivos envolvidos

```
definitions/
├── validationConfigs.ts    ← *_CONFIG com regras por secao
├── validationRules.ts      ← createValidationRules() + isValidUrl()

composables/
├── useValidation.ts        ← helpers genericos + validadores por secao

types/admin/
├── editor.ts               ← ValidationResult
```

### Diagrama de dependencias

```
definitions/validationConfigs.ts
    │  HERO_CONFIG, MISSION_CONFIG, ...
    │
    ▼
composables/useValidation.ts
    │  validateHero(), validateMission(), ...
    │
    ▼
pages/admin/edit/homeEdit.vue
    │  chama validateHero() antes do saveSection()
    │
    ▼
composables/useHomePageData.ts
    saveSection('hero')
```

---

## 🔬 Como Funciona Por Dentro (Tecnico)

### O motor generico: validateFields()

O coracao do sistema. Recebe dados + regras e valida cada campo:

```typescript
function validateFields(
  data: Record<string, unknown>,       // dados do formulario
  validationRules: Record<string, IFieldRule>,  // regras do config
  sectionLabel: string,                // nome pra mensagem de erro
): ValidationResult {
  const errors: string[] = [];

  // Itera sobre as REGRAS (nao sobre os dados)
  for (const [field, rules] of Object.entries(validationRules)) {
    const fieldErrors = validateField(field, data[field], rules);
    errors.push(...fieldErrors);
  }

  if (errors.length > 0) {
    errors.unshift(`Erros em ${sectionLabel}:`);  // header
  }

  return { isValid: errors.length === 0, errors };
}
```

O ponto chave: itera sobre `Object.entries(validationRules)`. Isso significa que **qualquer campo adicionado no config e automaticamente validado** — sem precisar listar campos manualmente.

### validateField() — validacao de um campo

```typescript
function validateField(fieldName: string, value: unknown, rules: IFieldRule): string[] {
  const errors: string[] = [];
  const text = typeof value === 'string' ? value.trim() : '';

  // Required
  if (rules.required && !text) {
    errors.push(`"${fieldName}" e obrigatorio`);
    return errors;  // early return — nao precisa checar length de ''
  }

  if (!text) return errors;  // campo vazio e nao required → valido

  // MinLength
  if (rules.minLength && text.length < rules.minLength) {
    errors.push(`"${fieldName}" precisa ter no minimo ${rules.minLength} caracteres`);
  }

  // MaxLength
  if (rules.maxLength && text.length > rules.maxLength) {
    errors.push(`"${fieldName}" pode ter no maximo ${rules.maxLength} caracteres`);
  }

  return errors;
}
```

### Validadores de secao sao wrappers finos

Cada validador de secao e uma funcao de 1-5 linhas que passa o config certo:

```typescript
// Secao simples (so campos)
const validateMission = (data) => {
  return validateFields(data, MISSION_CONFIG.validationRules, 'Missao');
};

// Secao com array
const validatePrograms = (items) => {
  const errors = [];
  errors.push(...validateItemCount(items, PROGRAMS_CONFIG.items, 'Programas'));
  errors.push(...validateArrayItems(items, PROGRAMS_CONFIG.validationRules, 'Programa'));
  return { isValid: errors.length === 0, errors };
};

// Secao com sub-arrays
const validateContact = (data) => {
  const result = validateFields(data, CONTACT_CONFIG.validationRules, 'Contato');
  const errors = [...result.errors];
  if (Array.isArray(data.methods)) {
    errors.push(...validateItemCount(data.methods, CONTACT_CONFIG.methods, 'Metodos'));
  }
  if (Array.isArray(data.formSubjects)) {
    errors.push(...validateItemCount(data.formSubjects, CONTACT_CONFIG.formSubjects, 'Assuntos'));
  }
  return { isValid: errors.length === 0, errors };
};
```

### Os 4 helpers genericos

| Helper | Entrada | Saida | Uso |
|--------|---------|-------|-----|
| `validateField()` | 1 campo + regras | `string[]` erros | Valida 1 campo individual |
| `validateFields()` | objeto + regras | `ValidationResult` | Valida todos os campos de um objeto |
| `validateItemCount()` | array + min/max | `string[]` erros | Valida quantidade de itens |
| `validateArrayItems()` | array + regras | `string[]` erros | Valida cada item do array |

Esses 4 helpers sao **exportados pelo composable** e podem ser reutilizados para qualquer pagina, nao so a home.

---

## 📊 Referencia de Arquivos (Referencia)

### `composables/useValidation.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `useValidation()` | composable | Retorna helpers + validadores |
| `UseValidation` | type | ReturnType do composable |

#### Retorno do useValidation()

| Retorno | Tipo | Descricao |
|---------|------|-----------|
| `validateFields()` | function | Generico: valida objeto contra config |
| `validateItemCount()` | function | Generico: valida quantidade em array |
| `validateArrayItems()` | function | Generico: valida cada item de array |
| `validateHero()` | function | Hero: campos + stats count |
| `validateMission()` | function | Missao: campos |
| `validatePrograms()` | function | Programas: count + cada item |
| `validateTestimonials()` | function | Depoimentos: count + cada item |
| `validateSupporters()` | function | Apoiadores: count + cada item |
| `validateContact()` | function | Contato: campos + methods + formSubjects |
| `validateCta()` | function | CTA: campos |
| `validateSeo()` | function | SEO: campos + keywords + ogImage URL |

### `definitions/validationConfigs.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `HERO_CONFIG` | const | Regras do Hero |
| `MISSION_CONFIG` | const | Regras da Missao |
| `PROGRAMS_CONFIG` | const | Regras dos Programas |
| `TESTIMONIALS_CONFIG` | const | Regras dos Depoimentos |
| `SUPPORTERS_CONFIG` | const | Regras dos Apoiadores |
| `CONTACT_CONFIG` | const | Regras do Contato |
| `CTA_CONFIG` | const | Regras do CTA |
| `SEO_CONFIG` | const | Regras do SEO |
| `COMPRESSION_SETTINGS` | const | Settings de compressao de imagem |

### `definitions/validationRules.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `createValidationRules()` | function | Gera array de rules para `:rules` do CBInput |
| `isValidUrl()` | function | Valida URL com `new URL()` |

---

## 💡 FAQ (Suporte)

### Qual a diferenca entre useValidation e validationRules?

- `useValidation` → validacao **pre-save** (antes de salvar no Firestore)
- `validationRules.ts` → validacao **na UI** (feedback em tempo real no CBInput)

Os dois usam os mesmos limites dos `*_CONFIG`, mas em momentos diferentes.

### Se eu adicionar campo no config, preciso mudar mais alguma coisa?

Nao. O `validateFields()` le `Object.entries(validationRules)` em runtime — qualquer campo novo no config e validado automaticamente.

### E se um campo nao esta no config mas esta no formulario?

Ele nao sera validado pelo `useValidation`. Isso e intencional — campos opcionais sem regras nao precisam estar no config.

### Posso validar campos que nao sao string?

O `validateField()` atual trata tudo como string (`typeof value === 'string' ? value.trim() : ''`). Para arrays e objetos, use `validateItemCount()` e `validateArrayItems()` diretamente no validador da secao.

### Como adicionar regra nova (ex: regex, email)?

Estenda a interface `IFieldRule` e adicione a logica em `validateField()`:

```typescript
interface IFieldRule {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;     // ← NOVA
}

// Em validateField():
if (rules.pattern && !rules.pattern.test(text)) {
  errors.push(`"${fieldName}" formato invalido`);
}
```

### Por que mensagens de erro em portugues?

O admin e voltado para usuarios brasileiros. As mensagens sao simples e diretas (`"title" e obrigatorio`). Se precisar de i18n nas mensagens de validacao, o ponto de mudanca e o `validateField()`.

---

*📅 Criado em*: 19 FEV 2026
*📋 Versao*: 1.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [arquitetura, admin, validacao, config-driven, useValidation, validationConfigs]
