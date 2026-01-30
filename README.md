# 💜 Elas Podem - Website Institucional

Website oficial da ONG **Elas Podem** - Projeto acadêmico focado em capacitação feminina em tecnologia e política.

## 📖 Sobre o Projeto

Plataforma web institucional desenvolvida com **Nuxt 4 + Vue 3** e **@corp/components**, biblioteca customizada de componentes. Sistema completo com gestão de conteúdo, autenticação e backend via **Supabase**.

## 🛠️ Tecnologias e Dependências

- **⚡ Vue 3**: Framework progressivo para construção de interfaces
- **🏗️ Nuxt 4**: Framework Vue.js full-stack moderno
- **🎨 Tailwind CSS v4**: Framework CSS utility-first
- **📦 @corp/components**: Biblioteca customizada de componentes UI
- **🎯 Shadcn-nuxt**: Componentes acessíveis e customizáveis
- **📝 TypeScript**: Superset JavaScript com tipagem estática
- **💾 Supabase**: Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **📊 Pinia**: Gerenciamento de estado oficial do Vue
- **🖼️ Nuxt Image**: Otimização automática de imagens
- **✨ Prettier**: Formatador de código
- **🔍 ESLint**: Linter para manter qualidade do código

### Stack Completa

- **Frontend**: Vue 3 (Composition API) + Nuxt 4 + TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn + @corp/components
- **Backend**: Supabase (Auth + Database + Storage)
- **State**: Pinia
- **Content**: Markdown (marked + markdown-it) + DOMPurify
- **Qualidade**: ESLint + Prettier + Husky + lint-staged

## 📂 Estrutura do Projeto

```text
elas_podem_website/
├── app/                    # Código fonte Nuxt 4
│   ├── components/         # Componentes Vue reutilizáveis
│   │   ├── ui/            # Componentes de interface
│   │   └── layout/        # Componentes de layout
│   ├── composables/       # Composables Vue (lógica reutilizável)
│   ├── pages/             # Páginas/Rotas da aplicação
│   ├── layouts/           # Layouts Nuxt
│   ├── assets/            # Recursos (CSS, imagens)
│   ├── stores/            # Pinia stores (estado global)
│   ├── utils/             # Funções utilitárias
│   └── types/             # Definições TypeScript
├── components/            # Componentes Shadcn
│   └── shadcn/           # Componentes base Shadcn
├── server/                # API Routes Nuxt
│   └── api/              # Endpoints do servidor
├── public/                # Arquivos estáticos
├── lib/                   # Bibliotecas auxiliares
├── nuxt.config.ts         # Configuração Nuxt
├── tailwind.config.js     # Configuração Tailwind
└── package.json           # Dependências do projeto
```

## ⚙️ Desenvolvimento

### Pré-requisitos

- **Node.js**: 24.x
- **npm**: >= 10.0.0

### Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# 3. Iniciar servidor de desenvolvimento (localhost:3000)
npm run dev
```

### Scripts Principais

```bash
# Desenvolvimento
npm run dev              # Servidor local
npm run build           # Build produção
npm run preview         # Preview build local

# Qualidade de Código
npm run lint            # Verificar lint
npm run lintFix         # Corrigir automaticamente
npm run format          # Formatar código
npm run format:check    # Verificar formatação
```

## 🔄 Qualidade Automática

O projeto utiliza **Husky + lint-staged** para garantir qualidade:

- ✅ **Lint automático no commit**
- ✅ **Formatação automática** com Prettier
- ✅ **Verificação inteligente** (só arquivos modificados)

```bash
# Ao fazer commit, automaticamente executa:
git commit -m "feat: nova funcionalidade"
# ↓
# 1. ESLint (.vue, .ts, .js)
# 2. Prettier (formatação)
# 3. Auto-correção quando possível
```

## 🎨 Bibliotecas UI

### Componentes Principais

- **@corp/components**: Biblioteca customizada do projeto
- **Shadcn-nuxt**: Componentes acessíveis base
- **Lucide Icons**: Ícones modernos
- **Tailwind CSS**: Utilitários e design system
- **Reka UI**: Primitivos headless para componentes

### Utilitários de Estilo

- `class-variance-authority`: Variants de componentes
- `clsx`: Composição de classes CSS
- `tailwind-merge`: Merge inteligente de classes Tailwind

## 🗄️ Backend e Dados

### Supabase

- **Autenticação**: Login, registro, recuperação de senha
- **Banco de Dados**: PostgreSQL com Row Level Security
- **Storage**: Upload e gestão de arquivos

### Content Management

- **Markdown**: Suporte completo para posts e conteúdo
  - `marked`: Parser Markdown performático
  - `markdown-it`: Renderização avançada
- **DOMPurify**: Sanitização de HTML (segurança XSS)
- **Highlight.js**: Syntax highlighting para code blocks

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
// Composables
export const useExample = () => {
  // lógica
  return { data, methods }
}

// Props com validação
const props = defineProps<{
  title: string
  isActive?: boolean
  items?: Array<Item>
}>()
```

## 🚀 Features

### Implementadas

- ✅ Estrutura Nuxt 4 moderna
- ✅ Integração @corp/components
- ✅ Suporte Markdown completo
- ✅ Sistema de autenticação pronto
- ✅ Tailwind CSS v4
- ✅ TypeScript configurado
- ✅ ESLint + Prettier + Husky

### Planejadas

- 🚧 Páginas institucionais (Home, Sobre, Projetos)
- 🚧 Sistema de blog com Markdown
- 🚧 Área administrativa
- 🚧 Galeria de projetos
- 🚧 Formulários de contato
- 🚧 SEO otimizado

## 🔧 Configurações

### Editor (VSCode)

Extensões recomendadas:

- **Volar** (Vue Language Features) - **Obrigatório**
- **TypeScript Vue Plugin** - **Obrigatório**
- **Tailwind CSS IntelliSense** - Recomendado
- **ESLint** - Recomendado
- **Prettier** - Recomendado

> **Atenção**: Desinstale **Vetur** (conflita com Volar)

### ESLint

Configuração em `eslint.config.mjs` com suporte a:
- Vue 3 + TypeScript
- Prettier integration
- Nuxt auto-imports

## 📄 Licença

Projeto acadêmico - ONG Elas Podem

## 👥 Contribuição

Projeto desenvolvido como trabalho de conclusão de curso.

---

💜 **Desenvolvido para capacitação feminina em tecnologia e política**
