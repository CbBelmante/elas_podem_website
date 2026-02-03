# 🚀 Guia de Deploy - Elas Podem Website

Documentação completa sobre como o site é buildado e deployado no Firebase Hosting.

---

## 📋 Índice

- [O que é SSG (Static Site Generation)](#o-que-é-ssg)
- [Como funciona o Build](#como-funciona-o-build)
- [Configuração Firebase](#configuração-firebase)
- [Processo de Deploy](#processo-de-deploy)
- [SEO e Performance](#seo-e-performance)
- [Atualizando o Site](#atualizando-o-site)

---

## 🎯 O que é SSG (Static Site Generation)?

### Conceito

**SSG** = Static Site Generation = Geração de Site Estático

Ao invés de gerar HTML no servidor a cada requisição (SSR) ou no navegador (SPA), o SSG **gera todos os arquivos HTML durante o build**, criando um site 100% estático.

### Como funciona

```
┌─────────────┐     Build Time      ┌──────────────┐
│  Nuxt 4     │  ─────────────────> │  HTML Files  │
│  (Vue 3)    │   npm run generate  │  CSS Files   │
│  Components │                     │  JS Files    │
└─────────────┘                     └──────────────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │   Firebase   │
                                    │   Hosting    │
                                    └──────────────┘
```

**Resultado:**
- Cada página vira um arquivo `.html` completo
- Google vê HTML pronto = **SEO perfeito** ✅
- Site super rápido (só arquivos estáticos)
- Custo zero (Firebase free tier)

### SSG vs SSR vs SPA

| Característica | SSG (Nosso) | SSR | SPA |
|----------------|-------------|-----|-----|
| **SEO** | ⭐⭐⭐⭐⭐ Perfeito | ⭐⭐⭐⭐⭐ Perfeito | ⭐⭐ Ruim |
| **Performance** | ⭐⭐⭐⭐⭐ Muito rápido | ⭐⭐⭐ Bom | ⭐⭐⭐⭐ Rápido |
| **Custo** | ⭐⭐⭐⭐⭐ Grátis | ⭐⭐ Caro (servidor) | ⭐⭐⭐⭐⭐ Grátis |
| **Atualização** | ⚠️ Precisa rebuild | ✅ Tempo real | ✅ Tempo real |

---

## 🔨 Como funciona o Build

### 1. Comando de Build

```bash
npm run generate
# ou
npx nuxi generate
```

### 2. O que acontece internamente

#### Passo 1: Build do Cliente
```
┌─────────────────────────────────────┐
│  Vite compila Vue components        │
│  ↓                                   │
│  Transforma .vue → JavaScript       │
│  ↓                                   │
│  Minifica e otimiza                 │
│  ↓                                   │
│  Gera: _nuxt/*.js, *.css            │
└─────────────────────────────────────┘
```

#### Passo 2: Pre-rendering (SSR)
```
┌─────────────────────────────────────┐
│  Nitro inicia servidor temporário   │
│  ↓                                   │
│  Para cada rota, executa:           │
│    - Renderiza Vue no servidor      │
│    - Gera HTML completo             │
│    - Extrai CSS crítico             │
│  ↓                                   │
│  Salva: index.html, 404.html, etc   │
└─────────────────────────────────────┘
```

#### Passo 3: Output Final
```
.output/public/
├── index.html          ← Página principal (HTML completo!)
├── 404.html            ← Página de erro
├── 200.html            ← Fallback SPA
├── _nuxt/              ← JavaScript e CSS
│   ├── *.js
│   └── *.css
├── _payload.json       ← Dados pré-carregados
├── favicon.ico
├── logo-elas-podem.png
└── robots.txt
```

### 3. Configuração no `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],

  // SSR ativado = Nuxt renderiza HTML no servidor durante build
  // ssr: true é o padrão, não precisa especificar
})
```

**O que NÃO fazer:**
```typescript
// ❌ ERRADO - Isso desabilita SSR
ssr: false

// ❌ ERRADO - Preset manual não é necessário
nitro: { preset: 'static' }
```

**Por que funciona sem configuração extra?**
- Nuxt 4 detecta automaticamente quando você roda `generate`
- O comando `generate` força o preset correto
- Mantém config simples e limpa

---

## ⚙️ Configuração Firebase

### 1. Arquivo `firebase.json`

```json
{
  "hosting": {
    "public": ".output/public",  ← Pasta com arquivos gerados
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "cleanUrls": true             ← Remove .html das URLs
  }
}
```

**O que cada configuração faz:**

| Configuração | Função |
|--------------|--------|
| `"public": ".output/public"` | Pasta que o Firebase vai servir |
| `"cleanUrls": true` | `/about.html` vira `/about` |
| `"ignore"` | Arquivos que não sobem |

### 2. Firebase CLI

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Login
firebase login

# Listar projetos
firebase projects:list

# Selecionar projeto
firebase use elas-podem-website

# Habilitar suporte a frameworks Nuxt
firebase experiments:enable webframeworks
```

---

## 🚀 Processo de Deploy

### Fluxo Completo

```bash
# 1. Build estático (gera HTML)
npm run generate

# 2. Deploy para Firebase
firebase deploy --only hosting
```

### O que acontece no `firebase deploy`

```
┌────────────────────────────────────────┐
│  1. Firebase CLI lê firebase.json      │
│     ↓                                   │
│  2. Compacta arquivos .output/public/  │
│     ↓                                   │
│  3. Upload para Firebase Storage       │
│     ↓                                   │
│  4. Atualiza CDN global                │
│     ↓                                   │
│  5. Site fica disponível em:           │
│     https://elas-podem-website.web.app │
└────────────────────────────────────────┘
```

### Comandos úteis

```bash
# Deploy completo
npm run generate && firebase deploy --only hosting

# Preview local (testa antes do deploy)
npm run generate
npx serve .output/public

# Ver logs do Firebase
firebase hosting:channel:list

# Rollback (voltar versão anterior)
firebase hosting:rollback
```

---

## 🎨 SEO e Performance

### Por que SSG é bom para SEO?

#### ✅ HTML Completo no Source

**SSG:**
```html
<!-- Google vê isso: -->
<html>
  <head>
    <title>Elas Podem - Capacitação Feminina</title>
    <meta name="description" content="...">
  </head>
  <body>
    <h1>Elas Podem</h1>
    <p>Conteúdo completo aqui...</p>
  </body>
</html>
```

**SPA (ruim):**
```html
<!-- Google vê isso: -->
<html>
  <body>
    <div id="app"></div>
    <script src="app.js"></script>
  </body>
</html>
```

### Performance

| Métrica | SSG | Motivo |
|---------|-----|--------|
| **First Contentful Paint** | ~0.5s | HTML já vem pronto |
| **Time to Interactive** | ~1.2s | JS hidrata página existente |
| **Lighthouse Score** | 95-100 | HTML + CSS crítico inline |
| **Tamanho** | ~200KB | Sem servidor Node.js |

### Otimizações Automáticas

Nuxt 4 faz automaticamente:
- ✅ Code splitting (JS dividido em chunks)
- ✅ CSS crítico inline
- ✅ Lazy loading de componentes
- ✅ Prefetch de rotas
- ✅ Compressão gzip/brotli

---

## 🔄 Atualizando o Site

### Fluxo de Atualização

```
┌──────────────┐
│ 1. Editar    │  Muda componentes/páginas
│    código    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 2. Testar    │  npm run dev (localhost)
│    local     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 3. Commit    │  git add . && git commit
│              │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 4. Build     │  npm run generate
│              │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 5. Deploy    │  firebase deploy --only hosting
│              │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 6. Site      │  https://elas-podem-website.web.app
│    atualizado│
└──────────────┘
```

### Quando Fazer Rebuild?

**Sempre que mudar:**
- ✅ Conteúdo das páginas
- ✅ Textos, imagens
- ✅ Componentes Vue
- ✅ Estilos CSS
- ✅ Configurações

**Não precisa rebuild para:**
- ❌ Não se aplica (site 100% estático)

### Script Helper

Adicione ao `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run generate && firebase deploy --only hosting",
    "deploy:preview": "npm run generate && npx serve .output/public"
  }
}
```

Uso:
```bash
# Deploy direto
npm run deploy

# Testar antes
npm run deploy:preview
```

---

## 📊 Monitoramento

### Firebase Console

Acesse: https://console.firebase.google.com/project/elas-podem-website

**Métricas disponíveis:**
- 📈 Visitas/mês
- 🌍 Países dos visitantes
- 📱 Devices (mobile/desktop)
- 🚀 Velocidade de carregamento

### Analytics (Opcional)

Para adicionar Google Analytics:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/google-analytics'],

  googleAnalytics: {
    id: 'G-XXXXXXXXXX'
  }
})
```

---

## 🎯 Próximos Passos

### 1. Domínio Customizado

Conectar `elaspodem.org`:

```bash
# No Firebase Console:
1. Hosting → Add custom domain
2. Digite: elaspodem.org
3. Siga instruções DNS
```

### 2. CI/CD Automático

**GitHub Actions** (deploy automático):

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - run: npm install
      - run: npm run generate

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_TOKEN }}'
          projectId: elas-podem-website
```

**Benefício:**
- Push para `main` → Deploy automático
- Não precisa rodar comandos manuais

### 3. CMS para Blog

Para adicionar blog dinâmico (futuro):

**Opções:**
1. **Strapi** (headless CMS)
2. **Contentful** (SaaS)
3. **Firebase Firestore** (já usa Firebase)

**Estratégia híbrida:**
```typescript
// nuxt.config.ts
routeRules: {
  '/': { prerender: true },        // Homepage estática
  '/sobre': { prerender: true },   // Sobre estática
  '/blog/**': { ssr: false }        // Blog via API
}
```

---

## 🐛 Troubleshooting

### Erro: "Page Not Found"

**Causa:** Arquivos não foram gerados ou pasta errada

**Solução:**
```bash
# 1. Verificar se build gerou arquivos
ls -la .output/public/

# 2. Deve ter index.html
# Se não tiver, rodar:
npm run generate

# 3. Verificar firebase.json
# "public" deve apontar para ".output/public"
```

### Erro: "Firebase experiments not enabled"

**Causa:** Feature experimental do Firebase não ativada

**Solução:**
```bash
firebase experiments:enable webframeworks
```

### Build demora muito

**Causa:** Dependências ou componentes pesados

**Solução:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    analyze: true  // Ver o que está pesado
  }
})
```

### CSS não aparece

**Causa:** CSS não foi extraído corretamente

**Solução:**
```bash
# Limpar cache
rm -rf .nuxt .output node_modules/.cache
npm run generate
```

---

## 📚 Recursos

- [Nuxt 4 Docs](https://nuxt.com)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [SSG Explained](https://jamstack.org/generators/)

---

💜 **Desenvolvido para Elas Podem - Capacitação Feminina em Tecnologia**
