# 💜 Elas Podem - Website Institucional

Website oficial da ONG **Elas Podem** - Projeto acadêmico focado em capacitação feminina em tecnologia e política.

## 📖 Sobre o Projeto

Website institucional desenvolvido com **Nuxt 4 + Vue 3** e **@cb/components**, biblioteca customizada de componentes. Inclui landing page pública (SSG) e painel administrativo (SPA) para edição de conteúdo em tempo real via Firebase.

## 🛠️ Tecnologias e Dependências

- **⚡ Vue 3**: Framework progressivo para construção de interfaces
- **🏗️ Nuxt 4**: Framework Vue.js full-stack moderno
- **📦 @cb/components**: Biblioteca customizada de componentes UI
- **🔥 Firebase**: Auth, Firestore, Hosting
- **☁️ Cloudinary**: Upload e CDN de imagens
- **🎯 Reka UI**: Primitivos headless para componentes acessíveis
- **🎨 Lucide Icons**: Biblioteca moderna de ícones
- **🌐 vue-i18n**: Internacionalização (pt-BR, en, es)
- **🔍 ESLint**: Linter + formatação de código

### Stack Completa

- **Framework**: Nuxt 4 + Vue 3 (Composition API, `<script setup>`)
- **Backend**: Firebase (Auth + Firestore) + Cloudinary (imagens)
- **Componentes**: @cb/components (customizados) + Reka UI (primitivos)
- **Ícones**: Lucide Vue Next
- **i18n**: vue-i18n (pt-BR, en, es)
- **Estilo**: CSS Variables + tema customizado
- **Fontes**: Fraunces (headings) + DM Sans (body)
- **Qualidade**: ESLint

## 📂 Estrutura do Projeto

```text
elas_podem_website/
├── pages/
│   ├── index.vue              # Landing page pública
│   └── admin/
│       ├── index.vue          # Dashboard admin
│       ├── login.vue          # Login Firebase Auth
│       └── edit/              # Editors por seção
├── components/
│   ├── admin/                 # Editors (HomeHeroEditor, AdminColorPicker, etc.)
│   ├── AppFooter.vue
│   ├── LanguageSwitcher.vue
│   └── LoadingOverlay.vue
├── composables/               # Lógica reutilizável
│   ├── useAuth.ts             # Autenticação Firebase
│   ├── useFirebase.ts         # Instâncias Firebase (app, auth, db, storage)
│   ├── useCloudinaryStorage.ts # Upload de imagens (Cloudinary)
│   ├── useHomePublicData.ts   # Dados da home (Firestore + cache)
│   ├── usePageData.ts         # CRUD genérico Firestore
│   ├── usePageEditor.ts       # Lógica do editor (forms, save, dirty state)
│   ├── useCache.ts            # Cache layer
│   ├── useImageCompression.ts # Compressão de imagens antes do upload
│   └── useValidation.ts       # Validação de formulários
├── layouts/
│   ├── default.vue            # Layout público
│   └── admin.vue              # Layout admin (sidebar + topbar)
├── middleware/
│   └── admin.global.ts        # Proteção de rotas /admin/*
├── plugins/
│   ├── auth.client.ts         # Init Firebase Auth (client-only)
│   ├── logger.client.ts       # Config CbLogger (forceDebug)
│   └── i18n.ts                # Config vue-i18n
├── definitions/               # Constantes, defaults, configs de validação
│   ├── themeOptions.ts        # Cores, gradientes, ícones, variantes
│   ├── sectionFields.ts       # Campos editable/readonly por seção
│   ├── sectionDefaults.ts     # Valores default quando Firestore vazio
│   ├── validationConfigs.ts   # Limites e regras por seção
│   ├── firestoreCollections.ts
│   ├── adminRoles.ts
│   ├── homeFallbacks.ts
│   ├── cacheKeys.ts
│   └── index.ts               # Barrel export
├── types/admin/               # Interfaces das seções (IHeroSection, etc.)
├── config/                    # Aliases e configurações
├── utils/                     # Funções utilitárias
├── locales/                   # Traduções (pt-BR, en, es)
├── assets/css/                # Estilos globais
│   ├── main.css              # Ponto de entrada (importa theme + sections)
│   ├── theme.css             # CSS variables do tema (cores, gradientes, tokens)
│   ├── sections.css          # Classes compartilhadas entre páginas (títulos, CTA)
│   └── reset.css             # Reset CSS base
├── public/                    # Assets estáticos
├── scripts/                   # Scripts TypeScript via bun (postinstall, link, seed)
├── docs/                      # Documentação técnica
├── nuxt.config.ts
├── firebase.json
└── package.json
```

## ⚙️ Desenvolvimento

### Pré-requisitos

- **Node.js**: 24.x
- **npm**: >= 10.0.0

### Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento (localhost:3333)
npm run dev
```

### Scripts Principais

```bash
# Desenvolvimento
npm run dev              # Dev server (porta 3333)
npm run build            # Build produção
npm run generate         # SSG — gera HTML estático
npm run preview          # Preview do build local

# Deploy
npm run deploy           # generate + firebase deploy
npm run deployPreview    # generate + serve local

# Admin
npm run seedAdmin        # Criar usuário admin no Firebase

# @cb/components (desenvolvimento local)
npm run cbcomponentsLinkLocal   # Linkar versão local via npm link
npm run cbcomponentsLinkRemote  # Voltar pra versão do registry
npm run cleanViteCache          # Limpar caches (.nuxt, .vite, .cache)

# Qualidade de Código
npm run lint             # Verificar lint
npm run lintFix          # Corrigir automaticamente
npm run format           # Formatar código
npm run format:check     # Verificar formatação
```

## 🎨 Bibliotecas UI

### Componentes Principais

- **@cb/components**: Biblioteca customizada do projeto (CBButton, CBCard, CBIcon, CBNavbar)
- **Reka UI**: Primitivos headless para componentes acessíveis
- **Lucide Icons**: 16.000+ ícones modernos e customizáveis

### Sistema de Design

- **CSS Variables**: Design tokens customizáveis em `assets/css/theme.css` (cores, gradientes, espaçamentos)
- **Tema**: `@cb/components/style.css` (base) + `main.css` (theme + sections) — ordem importa
- **Classes globais**: `sections.css` — títulos, badges, CTA e responsivos compartilhados entre páginas
- **Fontes**: Fraunces (headings) + DM Sans (body text) via Google Fonts
- **Responsivo**: Breakpoints em 768px e 480px

## 📝 Convenções de Código

### Componentes

- **Customizados**: Prefixo `Cb` (ex: `CbButton`, `CbCard`)
- **Nuxt/Vue**: PascalCase padrão
- **Estrutura SFC**: `<script setup>` → `<template>` → `<style>`

### Nomenclatura

- **Arquivos**: PascalCase para componentes (`CbButton.vue`)
- **Funções/Variáveis**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Tipos TypeScript**: PascalCase

### TypeScript

```typescript
// Props com validação
const props = defineProps<{
  title: string
  isActive?: boolean
  items?: Array<Item>
}>()
```

## 🚀 Deploy e Produção

### 🌐 Site ao Vivo

**URL Produção**: https://elas-podem-website.web.app

### 📦 Tecnologia de Deploy

- **Estratégia**: SSG (Static Site Generation) + SPA híbrido
- **Hosting**: Firebase Hosting
- **Build**: Nuxt 4 `generate` command
- **Páginas públicas**: SSG — HTML pré-renderizado, SEO otimizado
- **Páginas admin** (`/admin/**`): SPA — excluídas do pre-render via `routeRules`
- **Performance**: ⚡ ~0.5s First Contentful Paint

### 🔨 Como Fazer Deploy

#### Primeira vez (setup)

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login no Firebase
firebase login

# 3. Configurar projeto (só na primeira vez)
firebase use --add
# Selecione: elas-podem-website
# Alias: default
```

#### Deploy

```bash
npm run deploy
```

Isso roda `npm run generate` + `firebase deploy --only hosting` automaticamente.

**Documentação completa**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### 🎯 O que é SSG?

**SSG** = Gerar HTML estático durante o build (não no servidor a cada request)

**Vantagens:**
- ✅ SEO perfeito (Google vê HTML completo)
- ✅ Performance máxima (só arquivos estáticos)
- ✅ Custo zero (Firebase free tier)
- ✅ Segurança (sem servidor para atacar)

**Como funciona:**
```
Vue Components → npm run generate → HTML Files → Firebase Hosting
```

---

## 🚀 Features

### Implementadas

- ✅ Landing page institucional completa
- ✅ Hero section com animações e gradientes
- ✅ Seções: Missão, Programas, Depoimentos, Parceiros, Contato, CTA
- ✅ Componentes reutilizáveis (@cb/components)
- ✅ Design responsivo mobile-first (breakpoints 768px / 480px)
- ✅ Animações on-scroll com IntersectionObserver
- ✅ **Painel Admin** — edição de conteúdo em tempo real (Firebase Auth + Firestore)
- ✅ **Upload de imagens** com compressão automática (Cloudinary)
- ✅ **Cores/gradientes customizáveis** nos botões via AdminColorPicker
- ✅ **Internacionalização** (pt-BR, en, es) com vue-i18n
- ✅ **SSG + SPA híbrido** — páginas públicas pré-renderizadas, admin client-side
- ✅ **Deploy automatizado** Firebase Hosting
- ✅ ESLint configurado (lint + formatação)

### Planejadas

- 🚧 Páginas adicionais (Sobre, Projetos, Blog)
- 🚧 Domínio customizado (elaspodem.org)
- 🚧 CI/CD com GitHub Actions
- 🚧 Analytics e tracking

## 🛡️ Painel Administrativo

Painel para edição de conteúdo da home em tempo real, acessível em `/admin`.

- **Autenticação**: Firebase Authentication (email/password)
- **Dados**: Firestore — cada seção da home é um documento separado
- **Imagens**: Cloudinary com compressão automática antes do upload
- **Editors**: Um editor por seção (Hero, Missão, Programas, Depoimentos, Parceiros, Contato, CTA, SEO)
- **Cores**: AdminColorPicker permite escolher gradientes e cores dos botões visualmente
- **Proteção**: Middleware `admin.global.ts` protege todas as rotas `/admin/*`
- **Rendering**: Rotas admin excluídas do SSG via `routeRules` — rodam como SPA puro

### Rotas Admin

| Rota | Descrição |
|------|-----------|
| `/admin/login` | Login (única rota admin sem proteção) |
| `/admin` | Dashboard com cards de navegação |
| `/admin/edit/homeEdit` | Editor completo da home (todas as seções) |

## 📚 Documentação Técnica

A pasta `docs/` contém guias detalhados:

| Guia | Conteúdo |
|------|----------|
| [AdminPages_GUIDE](./docs/AdminPages_GUIDE.md) | Estrutura das páginas admin |
| [HomeEditor_GUIDE](./docs/HomeEditor_GUIDE.md) | Como funcionam os editors |
| [PageEditor_GUIDE](./docs/PageEditor_GUIDE.md) | Composable usePageEditor |
| [PageData_GUIDE](./docs/PageData_GUIDE.md) | Composable usePageData |
| [Auth_GUIDE](./docs/Auth_GUIDE.md) | Autenticação Firebase |
| [Cache_GUIDE](./docs/Cache_GUIDE.md) | Sistema de cache |
| [Storage_GUIDE](./docs/Storage_GUIDE.md) | Upload de imagens |
| [Validation_GUIDE](./docs/Validation_GUIDE.md) | Validação de formulários |
| [SectionFields_GUIDE](./docs/SectionFields_GUIDE.md) | Campos editable/readonly |
| [DEPLOYMENT](./docs/DEPLOYMENT.md) | Deploy e Firebase Hosting |

## 🔧 Configurações

### Editor (VSCode)

Extensões recomendadas:

- **Volar** (Vue Language Features) - **Obrigatório**
- **TypeScript Vue Plugin** - **Obrigatório**
- **ESLint** - Recomendado

> **Atenção**: Desinstale **Vetur** (conflita com Volar)

## 📄 Licença

Projeto acadêmico - ONG Elas Podem

## 👥 Contribuição

Projeto desenvolvido como trabalho de conclusão de curso.

---

💜 **Desenvolvido para capacitação feminina em tecnologia e política**
