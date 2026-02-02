# 🔗 Guia de Desenvolvimento Local de Bibliotecas

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-GUIA-purple?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-2.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-ESSENCIAL-red?style=for-the-badge)

</div>

**Workflow completo para desenvolvimento local de bibliotecas usando npm link, com verificação de bundle e configurações para Nuxt/Vite.**

> **Filosofia**: Desenvolva bibliotecas localmente com feedback instantâneo usando symlinks, sem publicar no npm a cada mudança.

💡 **Use este guia** quando precisar desenvolver ou testar mudanças em bibliotecas locais antes de publicar

---

## 📋 Índice

1. [**🎯 O Que É Desenvolvimento Local**](#-o-que-é-desenvolvimento-local)
2. [**🔧 npm link: Como Funciona**](#-npm-link-como-funciona)
3. [**✅ Verificação de Bundle**](#-verificação-de-bundle)
4. [**⚙️ Configuração Nuxt/Vite**](#️-configuração-nuxtvite)
5. [**🚀 Workflow Completo**](#-workflow-completo)
6. [**🐛 Troubleshooting**](#-troubleshooting)
7. [**📋 Template para Qualquer Biblioteca**](#-template-para-qualquer-biblioteca)

---

## 🎯 O Que É Desenvolvimento Local

### **Problema que Resolve**

Durante o desenvolvimento de bibliotecas, você precisa:
- ✅ Testar mudanças em projetos reais
- ✅ Ver resultados imediatamente (hot reload)
- ✅ Não publicar versões de teste no npm
- ✅ Trabalhar em múltiplos projetos simultaneamente

### **Soluções Disponíveis**

| Método | Vantagens | Desvantagens | Quando Usar |
|--------|-----------|--------------|-------------|
| **npm link** | ✅ Nativo do npm<br>✅ Symlinks automáticos<br>✅ Sem instalação extra | ⚠️ Requer config Vite<br>⚠️ Cache pode confundir | **RECOMENDADO** para desenvolvimento |
| **yalc** | ✅ Copia arquivos<br>✅ Evita symlinks | ⚠️ Requer instalação<br>⚠️ Push manual | Quando npm link não funciona |
| **npm pack** | ✅ Simula publicação real | ❌ Muito lento<br>❌ Sem hot reload | Teste final pré-publicação |

**✨ Escolha deste projeto: npm link** (rápido, nativo, funciona bem com Nuxt)

---

## 🔧 npm link: Como Funciona

### **Conceito**

npm link cria **symlinks** (atalhos) entre a biblioteca e o projeto:

```
┌─────────────────────────┐
│  Biblioteca Local       │
│  ~/my-library/          │
│  └── dist/              │ ←──────┐ Symlink
└─────────────────────────┘        │
                                   │
┌─────────────────────────┐        │
│  Projeto                │        │
│  ~/my-project/          │        │
│  └── node_modules/      │        │
│      └── @scope/        │        │
│          my-library ────┘────────┘
└─────────────────────────┘
```

### **2 Comandos Essenciais**

#### **1. Na Biblioteca (cria link global)**

```bash
cd ~/workspaces/my-library
npm link
```

**O que faz:**
- Cria symlink em `~/.npm-global/lib/node_modules/@scope/my-library`
- Registra a biblioteca globalmente

#### **2. No Projeto (usa o link)**

```bash
cd ~/workspaces/my-project
npm link @scope/my-library
```

**O que faz:**
- Cria symlink em `node_modules/@scope/my-library` → biblioteca local
- Substitui a versão do npm pela versão local

### **Verificar Link Ativo**

```bash
# No projeto
ls -la node_modules/@scope/my-library

# Saída esperada:
# lrwxrwxrwx ... node_modules/@scope/my-library -> ../../../my-library
```

---

## ✅ Verificação de Bundle

### **Por Que Verificar?**

Erros comuns que causam problemas:
- ❌ Bundle não gerado (pasta `dist/` vazia)
- ❌ Arquivos errados exportados
- ❌ Tipos TypeScript faltando
- ❌ CSS não incluído

### **Checklist de Verificação**

Use este checklist **ANTES** de fazer npm link:

#### **1. Build Executado**

```bash
cd ~/workspaces/my-library
npm run build

# ✅ Deve mostrar: "built in X.XXs"
# ✅ Não deve ter erros
```

#### **2. Pasta dist/ Existe**

```bash
ls -lh dist/

# ✅ Deve conter:
# - library.es.js   (bundle ES modules)
# - library.umd.js  (bundle UMD)
# - style.css       (estilos)
# - index.d.ts      (tipos TypeScript)
```

#### **3. Tamanho do Bundle Razoável**

```bash
du -sh dist/library.es.js

# ✅ Esperado: Depende da biblioteca (100KB - 2MB típico)
# ⚠️ Se muito pequeno: Provavelmente faltam arquivos
# ⚠️ Se muito grande: Verificar dependências incluídas
```

#### **4. CSS Gerado (se aplicável)**

```bash
ls -lh dist/style.css

# ✅ Deve existir se sua biblioteca tem estilos
```

#### **5. package.json Correto**

```bash
cat package.json | grep -E '"main"|"module"|"types"'

# ✅ Deve ter:
# "main": "./dist/library.umd.js"
# "module": "./dist/library.es.js"
# "types": "./dist/index.d.ts"
```

#### **6. Exportações Funcionais**

```bash
node -e "const lib = require('./dist/library.umd.js'); console.log(Object.keys(lib))"

# ✅ Deve listar exports da biblioteca
# ⚠️ Se vazio: exports não configurados
```

### **Script de Verificação Automatizada**

Adicione ao `package.json` da biblioteca:

```json
{
  "scripts": {
    "verify": "node scripts/verifyBuild.js"
  }
}
```

Crie `scripts/verifyBuild.js`:

```javascript
const fs = require('fs');
const path = require('path');

const checks = {
  'Bundle ES': 'dist/library.es.js',
  'Bundle UMD': 'dist/library.umd.js',
  'Styles': 'dist/style.css',
  'Types': 'dist/index.d.ts',
};

console.log('🔍 Verificando build...\n');

let hasErrors = false;

for (const [name, file] of Object.entries(checks)) {
  const exists = fs.existsSync(file);
  const size = exists ? fs.statSync(file).size : 0;
  const sizeKB = (size / 1024).toFixed(2);

  if (!exists) {
    console.log(`❌ ${name}: FALTANDO`);
    hasErrors = true;
  } else if (size < 1000) {
    console.log(`⚠️  ${name}: ${sizeKB}KB (muito pequeno?)`);
  } else {
    console.log(`✅ ${name}: ${sizeKB}KB`);
  }
}

if (hasErrors) {
  console.log('\n❌ Build INCOMPLETO! Execute: npm run build');
  process.exit(1);
} else {
  console.log('\n✅ Build OK! Pode fazer npm link.');
}
```

**Uso:**

```bash
npm run build && npm run verify && npm link
```

---

## ⚙️ Configuração Nuxt/Vite

### **⚠️ CRÍTICO: Configuração Obrigatória**

Vite cacheia dependências. Sem essa config, mudanças não aparecem!

### **nuxt.config.ts**

```typescript
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      exclude: ['@scope/my-library'],  // ← CRÍTICO! Substitua pelo nome da sua biblioteca
      force: true, // Re-otimizar sempre (opcional)
    },
  },
});
```

### **Configuração Avançada (Opcional)**

Para detectar automaticamente se está usando npm link:

```typescript
import { resolve } from 'path';
import { existsSync } from 'fs';

export default defineNuxtConfig(() => {
  // Detectar se biblioteca está em npm link
  const libraryPath = resolve(__dirname, '../my-library');
  const hasLocalLibrary = existsSync(libraryPath);

  // Log do modo
  if (hasLocalLibrary) {
    console.log('*** Biblioteca: Modo DESENVOLVIMENTO (npm link detectado)');
  } else {
    console.log('*** Biblioteca: Modo PRODUÇÃO (usando versão npm)');
  }

  return {
    vite: {
      optimizeDeps: {
        exclude: ['@scope/my-library'],  // ← CRÍTICO!
      },
      server: {
        fs: hasLocalLibrary ? {
          // Permitir servir arquivos via symlink
          allow: ['.', libraryPath],
        } : undefined,
      },
    },
  };
});
```

### **Por Que Isso É Necessário?**

```
SEM exclude:
Vite otimiza → Cacheia → Mudanças NÃO aparecem ❌

COM exclude:
Vite ignora → Lê direto do link → Hot reload funciona ✅
```

---

## 🚀 Workflow Completo

### **Configuração Inicial (Uma Vez)**

#### **1. Na Biblioteca**

```bash
cd ~/workspaces/my-library

# Build inicial
npm run build

# Verificar (opcional mas recomendado)
npm run verify

# Criar link global
npm link

# ✅ Saída: "created symlink in ~/.npm-global/lib/node_modules/@scope/my-library"
```

#### **2. No Projeto**

```bash
cd ~/workspaces/my-project

# Adicionar exclude no nuxt.config.ts (veja seção anterior)

# Linkar biblioteca
npm link @scope/my-library

# ✅ Saída: "created symlink in node_modules/@scope/my-library"

# Verificar link
ls -la node_modules/@scope/my-library

# Limpar cache
rm -rf .nuxt .output .vite node_modules/.vite node_modules/.cache

# Iniciar dev server
npm run dev
```

---

### **Desenvolvimento Diário**

#### **Ciclo de Trabalho**

```bash
# 1. Editar código da biblioteca
vim ~/workspaces/my-library/src/components/Button.vue

# 2. Build (mudanças refletem automaticamente via symlink)
cd ~/workspaces/my-library
npm run build

# 3. Verificar no projeto (hot reload automático!)
# Abra http://localhost:3000 no navegador
```

#### **Se Hot Reload Não Funcionar**

```bash
# No projeto
cd ~/workspaces/my-project

# Limpar cache e reiniciar
rm -rf .nuxt .output .vite node_modules/.vite node_modules/.cache
npm run dev
```

---

### **Finalizar Desenvolvimento**

#### **1. Publicar Biblioteca no npm**

```bash
cd ~/workspaces/my-library

# Verificar build final
npm run build
npm run verify

# Atualizar versão
npm version patch  # ou minor/major

# Publicar
npm publish
```

#### **2. Desfazer npm link**

```bash
# No projeto
cd ~/workspaces/my-project

# Remover link
npm unlink @scope/my-library

# Instalar do npm
npm install @scope/my-library@latest

# Limpar cache
rm -rf .nuxt .output .vite node_modules/.vite node_modules/.cache

# Reiniciar
npm run dev
```

---

## 🐛 Troubleshooting

### **Problema 1: Mudanças Não Aparecem**

**Sintoma:** Build executado, mas projeto usa código antigo

**Solução:**

```bash
# 1. Verificar se link está ativo
cd ~/workspaces/my-project
ls -la node_modules/@scope/my-library

# Deve mostrar: lrwxrwxrwx ... -> ../../../my-library

# 2. Se não for symlink, refazer link
npm unlink @scope/my-library
cd ~/workspaces/my-library && npm link
cd ~/workspaces/my-project && npm link @scope/my-library

# 3. Limpar cache
rm -rf .nuxt .output .vite node_modules/.vite node_modules/.cache

# 4. Hard reload no navegador (Ctrl+Shift+R)
```

### **Problema 2: Erro "Cannot find module"**

**Sintoma:** `Error: Cannot find module '@scope/my-library'`

**Causa:** Link quebrado ou não criado

**Solução:**

```bash
# 1. Verificar se biblioteca tem link global
ls -la ~/.npm-global/lib/node_modules/@scope/my-library

# 2. Se não existir, criar
cd ~/workspaces/my-library
npm link

# 3. Verificar build
npm run build && npm run verify

# 4. Linkar no projeto
cd ~/workspaces/my-project
npm link @scope/my-library
```

### **Problema 3: Erro no Build da Biblioteca**

**Sintoma:** `npm run build` falha

**Solução:**

```bash
# 1. Limpar cache da biblioteca
cd ~/workspaces/my-library
rm -rf node_modules dist

# 2. Reinstalar dependências
npm install

# 3. Build novamente
npm run build

# 4. Verificar erros no terminal
```

### **Problema 4: Tipos TypeScript Desatualizados**

**Sintoma:** IDE mostra tipos antigos

**Solução:**

```bash
# 1. Rebuild biblioteca (inclui tipos)
cd ~/workspaces/my-library
npm run build

# 2. Reiniciar TypeScript server
# VSCode: Ctrl+Shift+P → "TypeScript: Restart TS Server"

# 3. Se não resolver, limpar cache do projeto
cd ~/workspaces/my-project
rm -rf .nuxt node_modules/.cache
```

### **Problema 5: Symlink Não Funciona no Windows**

**Sintoma:** npm link cria cópia em vez de symlink

**Causa:** Windows requer permissões especiais para symlinks

**Solução:**

```bash
# Opção A: Executar terminal como Administrador

# Opção B: Habilitar modo desenvolvedor
# Configurações → Atualização e Segurança → Para Desenvolvedores → Ativar

# Opção C: Usar yalc em vez de npm link
npm install -g yalc
cd ~/workspaces/my-library && yalc publish
cd ~/workspaces/my-project && yalc add @scope/my-library
```

---

## 📋 Template para Qualquer Biblioteca

Use este template para configurar **qualquer biblioteca**:

### **1. Criar Scripts Helper**

Adicione ao `package.json` da biblioteca:

```json
{
  "scripts": {
    "build": "vite build",
    "verify": "node scripts/verifyBuild.js",
    "link:setup": "npm run build && npm run verify && npm link",
    "link:update": "npm run build && npm run verify"
  }
}
```

### **2. Configurar Vite Build**

`vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist/lib',
    minify: false, // Facilita debug em dev
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'YourLibrary',
      fileName: (format) => `YourLibrary.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
```

### **3. Configurar package.json da Biblioteca**

```json
{
  "name": "@yourscope/yourlibrary",
  "version": "1.0.0",
  "main": "./dist/lib/YourLibrary.umd.js",
  "module": "./dist/lib/YourLibrary.es.js",
  "types": "./dist/lib/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/lib/YourLibrary.es.js",
      "require": "./dist/lib/YourLibrary.umd.js",
      "types": "./dist/lib/index.d.ts"
    },
    "./style.css": "./dist/lib/style.css"
  },
  "files": [
    "dist"
  ]
}
```

### **4. Configurar Projeto Consumidor**

`nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      exclude: ['@yourscope/yourlibrary'],  // ← Substitua aqui
    },
  },
});
```

### **5. Workflow Completo**

```bash
# === BIBLIOTECA ===
cd ~/yourlib
npm run link:setup  # Build + verify + link (primeira vez)

# Durante desenvolvimento:
npm run link:update  # Build + verify (atualiza automaticamente)

# === PROJETO ===
cd ~/yourproject
npm link @yourscope/yourlibrary
npm run dev
```

---

## ✅ Checklist de Verificação

### **Antes de npm link**

- [ ] Build da biblioteca executado (`npm run build`)
- [ ] Pasta `dist/` existe e contém arquivos
- [ ] Bundle ES (`.es.js`) gerado
- [ ] CSS (`style.css`) gerado (se aplicável)
- [ ] Tipos (`index.d.ts`) gerados (se TypeScript)
- [ ] `package.json` tem `main`, `module`, `types`

### **Durante npm link**

- [ ] Link global criado (`npm link` na biblioteca)
- [ ] Link local criado (`npm link @lib` no projeto)
- [ ] Symlink verificado (`ls -la node_modules/@lib`)
- [ ] `nuxt.config.ts` tem biblioteca no `exclude`
- [ ] Cache limpo (`.nuxt`, `.vite`, etc)
- [ ] Dev server reiniciado

### **Durante Desenvolvimento**

- [ ] Build da biblioteca funciona (`npm run build`)
- [ ] Mudanças aparecem automaticamente (~2-3s)
- [ ] Hot reload funciona
- [ ] Tipos TypeScript atualizam (reiniciar TS server)

### **Ao Finalizar**

- [ ] Biblioteca publicada no npm (`npm publish`)
- [ ] npm link desfeito (`npm unlink @lib`)
- [ ] Biblioteca instalada do npm (`npm install @lib@latest`)
- [ ] Symlink removido (volta a ser pasta normal)
- [ ] Cache limpo final

---

## 🎯 Resumo (TL;DR)

### **3 Comandos Essenciais**

```bash
# 1. Setup (uma vez)
cd ~/biblioteca && npm run build && npm link
cd ~/projeto && npm link @scope/library

# 2. Desenvolvimento (loop)
cd ~/biblioteca && npm run build
# Hot reload automático! ✨

# 3. Finalizar
cd ~/projeto && npm unlink @scope/library && npm install @scope/library@latest
```

### **Configuração Obrigatória**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      exclude: ['@scope/library'],  // ← CRÍTICO!
    },
  },
});
```

### **Verificação Rápida**

```bash
# Biblioteca buildada?
ls dist/lib/

# Link ativo?
ls -la node_modules/@scope/library

# Cache limpo?
rm -rf .nuxt .output .vite node_modules/.vite node_modules/.cache
```

---

## 🔗 Referências

- [npm link docs](https://docs.npmjs.com/cli/v8/commands/npm-link)
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [Nuxt Vite Config](https://nuxt.com/docs/api/nuxt-config#vite)

---

*📅 Criado em*: 27 JAN 26
*📅 Última atualização*: 27 JAN 26
*📋 Versão*: 2.0
*👥 Responsável*: CbBelmante
*🏷️ Tags*: [npm-link, desenvolvimento-local, bibliotecas, nuxt, vite, workflow, verificacao-bundle]
