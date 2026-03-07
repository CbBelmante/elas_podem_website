# Elas Podem Website

## Stack

- **Framework**: Nuxt 4 (Vue 3 + TypeScript)
- **UI Library**: `@cb/components` (cbcomponents — lib local via `npm link`)
- **Backend**: Firebase (Auth, Firestore) + Cloudinary (image storage/CDN)
- **i18n**: vue-i18n (pt-BR + en)
- **CSS**: Scoped styles + CSS variables (tema em cbcomponents/theme.ts)

## Estrutura do Projeto

```
pages/            → Rotas (index, about, projetos, admin/*)
layouts/          → default (público) + admin (sidebar)
components/       → front/* (público) + admin/* (editors)
composables/      → useAuth, usePageData (factory), useHomePublicData, useAboutPublicData
types/admin/      → common.ts (genéricos) + home*.ts + about*.ts (por página)
definitions/      → sectionDefaults, sectionFields, validationConfigs, fallbacks, cacheKeys
utils/            → HomeFormUtils, AboutFormUtils, colorResolver, validationRules
config/           → constants.ts (estáticos) + index.ts (useConfig com runtimeConfig)
middleware/       → admin.global.ts (auth guard)
plugins/          → auth.client.ts, logger.client.ts, i18n.ts
locales/          → pt-BR.json, en.json
docs/             → Guias técnicos (CODE_STYLE_GUIDE, Auth, Cache, PageData, etc.)
```

## Padrão Admin (nova página editável)

Sequência de criação — cada camada depende da anterior:

1. **Types**: `types/admin/{page}Sections.ts` → `{page}Editable.ts` → `{page}FormsData.ts`
2. **Definitions**: `sectionDefaults.ts` + `sectionFields.ts` + `validationConfigs.ts` + `{page}Fallbacks.ts`
3. **Utils**: `{Page}FormUtils.ts` (separate/combine/createDefault/createNew)
4. **Composable**: `use{Page}PageData.ts` (via `createPageDataComposable` factory)
5. **Editors**: `components/admin/{Page}{Section}Editor.vue` (um por seção)
6. **Page**: `pages/admin/edit/{page}Edit.vue` (orquestrador)
7. **Público**: `composables/use{Page}PublicData.ts` + `pages/{page}.vue`
8. **i18n**: chaves em `locales/pt-BR.json` e `en.json`
9. **Barrel**: re-exportar types novos em `types/admin/index.ts`

## cbcomponents

- Source: `~/Workspaces/cbcomponents`
- Workflow: editar source → `npm run build` → limpar cache Nuxt → restart dev
- Limpar cache: `rm -rf .nuxt node_modules/.vite node_modules/.cache`
- AGENT_RULES: `~/Workspaces/cbcomponents/docs/AGENT_RULES.md`
- Theme: `~/Workspaces/cbcomponents/src/theme.ts` (CSS variables)
- Logger: `import { Logger } from '@cb/components'` (CbLogger)
- DateUtils: `import { formatDayjs, DATE_TIME_BR } from '@cb/components'` (CbDateUtils)

## Comportamento Obrigatório

Seguir `docs/AGENT_RULES.md`. Em resumo:

1. **Explique antes de agir**: A cada ação, diga O QUE vai fazer, COMO e POR QUÊ.
2. **Proponha antes de executar**: NUNCA saia fazendo. Apresente o plano e aguarde aprovação.
3. **3 opções (Alpha/Bravo/Charlie)**: Quando houver ambiguidade ou decisão de design, apresente 3 abordagens com prós/contras. Aguarde o usuário escolher.
4. **Documente didaticamente**: Explique de forma clara, como professor de código.

## Convenções

- **Commits**: Conventional commits em português. NUNCA adicionar `Co-Authored-By`.
- **Props Vue**: Options API (`defineProps({ prop: { type: String, default: '' } })`)
- **CSS colors**: Usar CSS variables do theme (`var(--color-wine)`, `var(--color-magenta)`)
- **Custom colors**: Seguir padrão CBBadge (`--cb-custom-bg`, `--cb-custom-color`)
- **Types**: Interfaces com prefixo `I` (`IHeroSection`), constants em `SCREAMING_SNAKE`
- **Imports**: Sempre via aliases (`@appTypes/admin`, `@composables/`, `@definitions/`)
- **Firebase data**: Fallback local → cache → Firestore (padrão usePageData factory)

## Referências

- `README.md` — Visão geral do projeto, stack, estrutura, setup, deploy
- `docs/CODE_STYLE_GUIDE.md` — Nomenclatura, imports, Vue SFC, CSS
- `docs/AGENT_RULES.md` — Protocolo de 3 opções (Alpha/Bravo/Charlie)
- `docs/PageData_GUIDE.md` — Factory usePageData (load/save/reset)
- `docs/SectionFields_GUIDE.md` — Como adicionar campos editáveis
- `docs/Validation_GUIDE.md` — Sistema de validação
- `docs/Storage_GUIDE.md` — Upload de imagens (Cloudinary + compressão)
- `docs/Auth_GUIDE.md` — Autenticação Firebase + roles admin
