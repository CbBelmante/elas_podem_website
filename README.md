# 💜 Elas Podem - Website Institucional

Website oficial da ONG **Elas Podem** - Projeto acadêmico focado em capacitação feminina em tecnologia e política.

## 📖 Sobre o Projeto

Landing page institucional desenvolvida com **Nuxt 4 + Vue 3** e **@cb/components**, biblioteca customizada de componentes. Site estático focado em apresentação da ONG e suas ações.

## 🛠️ Tecnologias e Dependências

- **⚡ Vue 3**: Framework progressivo para construção de interfaces
- **🏗️ Nuxt 4**: Framework Vue.js full-stack moderno
- **📦 @cb/components**: Biblioteca customizada de componentes UI
- **🎯 Reka UI**: Primitivos headless para componentes acessíveis
- **🎨 Lucide Icons**: Biblioteca moderna de ícones
- **✨ Prettier**: Formatador de código
- **🔍 ESLint**: Linter para manter qualidade do código

### Stack Completa

- **Framework**: Nuxt 4 + Vue 3 (Composition API)
- **Componentes**: @cb/components (customizados) + Reka UI (primitivos)
- **Ícones**: Lucide Vue Next
- **Estilo**: CSS Variables + CSS Modules
- **Qualidade**: ESLint + Prettier

## 📂 Estrutura do Projeto

```text
elas_podem_website/
├── pages/                 # Páginas/Rotas (Nuxt auto-routing)
│   └── index.vue         # Landing page principal
├── assets/                # Recursos estáticos
│   └── css/              # Estilos globais e temas
├── public/                # Arquivos públicos (imagens, fonts)
├── docs/                  # Documentação do projeto
├── nuxt.config.ts         # Configuração Nuxt
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

# 2. Iniciar servidor de desenvolvimento (localhost:3000)
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

## 🎨 Bibliotecas UI

### Componentes Principais

- **@cb/components**: Biblioteca customizada do projeto (CBButton, CBCard, CBIcon, CBNavbar)
- **Reka UI**: Primitivos headless para componentes acessíveis
- **Lucide Icons**: 16.000+ ícones modernos e customizáveis

### Sistema de Design

- **CSS Variables**: Design tokens customizáveis (cores, espaçamentos, sombras)
- **CSS Modules**: Estilos escopados por componente
- **Fontes**: Poppins (headings) + Lato (body text)

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

## 🚀 Features

### Implementadas

- ✅ Landing page institucional completa
- ✅ Hero section com animações e gradientes
- ✅ Seções: Missão, Programas, Depoimentos, Parceiros, Contato
- ✅ Componentes reutilizáveis (@cb/components)
- ✅ Design responsivo mobile-first
- ✅ Animações on-scroll com IntersectionObserver
- ✅ ESLint + Prettier configurados

### Planejadas

- 🚧 Páginas adicionais (Sobre, Projetos, Blog)
- 🚧 Sistema de CMS para conteúdo dinâmico
- 🚧 Integração com formulários (backend)
- 🚧 SEO otimizado (meta tags, sitemap)
- 🚧 Analytics e tracking

## 🔧 Configurações

### Editor (VSCode)

Extensões recomendadas:

- **Volar** (Vue Language Features) - **Obrigatório**
- **TypeScript Vue Plugin** - **Obrigatório**
- **ESLint** - Recomendado
- **Prettier** - Recomendado

> **Atenção**: Desinstale **Vetur** (conflita com Volar)

## 📄 Licença

Projeto acadêmico - ONG Elas Podem

## 👥 Contribuição

Projeto desenvolvido como trabalho de conclusão de curso.

---

💜 **Desenvolvido para capacitação feminina em tecnologia e política**
