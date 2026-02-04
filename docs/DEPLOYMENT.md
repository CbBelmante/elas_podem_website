# 🚀 Guia de Deploy - Elas Podem Website

Documentação completa sobre como o site é buildado e deployado no Firebase Hosting.

---

## 📋 Índice

- [O que é SSG (Static Site Generation)](#o-que-é-ssg)
- [Como funciona o Build](#como-funciona-o-build)
- [Configuração Firebase](#configuração-firebase)
- [Processo de Deploy](#processo-de-deploy)
- [CI/CD Automático (GitHub Actions)](#cicd-automático-github-actions)
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

## 🤖 CI/CD Automático (GitHub Actions)

### O que é CI/CD?

**CI/CD** = Continuous Integration / Continuous Deployment = Deploy automático quando você faz `git push`

```
Você faz push → GitHub Actions roda → Site atualizado automaticamente
```

**Vantagens:**
- ✅ Deploy automático (sem comandos manuais)
- ✅ Consistência (sempre o mesmo processo)
- ✅ Logs completos de cada deploy
- ✅ Rollback fácil (via GitHub)

---

### Como funciona

#### Arquivo de configuração

**Local:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main  # Aciona quando fizer push na main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. Checkout do código
      - name: Checkout código
        uses: actions/checkout@v4

      # 2. Configurar Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      # 3. Instalar dependências
      - name: Instalar dependências
        run: npm ci

      # 4. Build estático (SSG)
      - name: Build SSG
        run: npm run generate

      # 5. Deploy Firebase
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: elas-podem-website
          channelId: live
```

---

### Configuração de Secrets

Para o CI/CD funcionar, você precisa adicionar a credencial do Firebase no GitHub.

#### 1. Gerar Service Account do Firebase

**Opção A: Via Firebase Console (recomendado)**

1. Acesse: https://console.firebase.google.com/project/elas-podem-website/settings/serviceaccounts/adminsdk
2. Clique em **"Generate new private key"**
3. Baixe o arquivo JSON

```json
{
  "type": "service_account",
  "project_id": "elas-podem-website",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk@elas-podem-website.iam.gserviceaccount.com",
  ...
}
```

**Opção B: Via CLI**

```bash
firebase login:ci
# Copia o token gerado
```

---

#### 2. Adicionar Secret no GitHub

1. **GitHub** → Repositório → **Settings**
2. **Secrets and variables** → **Actions**
3. **New repository secret**
4. Configurar:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Cola o JSON completo (da Opção A) ou token (da Opção B)

```
Name: FIREBASE_SERVICE_ACCOUNT

Value: {
  "type": "service_account",
  "project_id": "elas-podem-website",
  ...
}
```

5. Clique em **Add secret**

---

### Testando o CI/CD

#### 1. Fazer uma mudança qualquer

```bash
# Edite algum arquivo
echo "<!-- Teste CI/CD -->" >> pages/index.vue
```

#### 2. Commit e push

```bash
git add .
git commit -m "test: CI/CD workflow"
git push origin main
```

#### 3. Acompanhar no GitHub Actions

1. **GitHub** → Repositório → **Actions**
2. Você verá o workflow rodando:

```
Deploy to Firebase Hosting
  ✓ Checkout código (10s)
  ✓ Setup Node.js (20s)
  ✓ Instalar dependências (30s)
  ✓ Build SSG (20s)
  ⏳ Deploy to Firebase (30s)  ← Rodando
```

#### 4. Site atualizado!

Quando o workflow terminar (~2 minutos):

```
✅ Deploy to Firebase Hosting completed
```

Acesse: https://elas-podem-website.web.app

Suas mudanças estarão no ar! 🎉

---

### Entendendo cada passo

#### Passo 1: Checkout código

```yaml
- uses: actions/checkout@v4
```

**O que faz:** Baixa o código do GitHub para o runner (computador virtual)

```bash
# Equivalente a:
git clone https://github.com/você/elas_podem_website.git
cd elas_podem_website
```

---

#### Passo 2: Setup Node.js

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
```

**O que faz:**
- Instala Node.js 22
- Habilita cache do `node_modules` (acelera próximos builds)

```bash
# Equivalente a:
nvm install 22
nvm use 22
```

---

#### Passo 3: Instalar dependências

```yaml
- run: npm ci
```

**O que faz:** Instala dependências do `package.json`

**`npm ci` vs `npm install`:**
- `npm ci` = Instala **exatamente** o `package-lock.json` (reproduzível)
- `npm install` = Pode atualizar versões (menos previsível)

```bash
# Instala: nuxt, vue, lucide-vue-next, etc.
npm ci
```

---

#### Passo 4: Build SSG

```yaml
- run: npm run generate
```

**O que faz:** Gera arquivos HTML estáticos

```bash
# Executa: npx nuxi generate
npm run generate

# Resultado:
.output/public/
├── index.html
├── _nuxt/app.js
└── _nuxt/styles.css
```

---

#### Passo 5: Deploy Firebase

```yaml
- uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    repoToken: ${{ secrets.GITHUB_TOKEN }}
    firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
    projectId: elas-podem-website
    channelId: live
```

**O que faz:**
1. Compacta `.output/public/`
2. Upload para Firebase Storage
3. Atualiza CDN global
4. Site fica disponível

**Parâmetros:**
| Parâmetro | O que é | Onde pegar |
|-----------|---------|------------|
| `repoToken` | Token do GitHub | Gerado automaticamente |
| `firebaseServiceAccount` | Credencial Firebase | Secret que você criou |
| `projectId` | ID do projeto | Firebase Console |
| `channelId: live` | Canal de produção | Predefinido |

---

### Monitorando Deploys

#### GitHub Actions

**Ver todos os deploys:**
- GitHub → Actions → Histórico completo

**Ver logs de um deploy:**
- Clique no workflow → Expande cada passo

```
✓ Checkout código
  Run actions/checkout@v4
  ...

✓ Build SSG
  Run npm run generate
  ℹ Building Nitro Server (preset: static)
  ✔ Built in 2.3s
  ...
```

---

#### Firebase Console

**Ver deploys no Firebase:**

```bash
# Via CLI
firebase hosting:channel:list

# Ou acesse:
https://console.firebase.google.com/project/elas-podem-website/hosting
```

**Métricas:**
- 📅 Histórico de deploys
- 👤 Quem fez deploy
- ⏱️ Tempo de build
- 📊 Uso de banda

---

### Comandos úteis

#### Ver status do último deploy

```bash
gh run list --limit 1
# Requer GitHub CLI: brew install gh
```

#### Cancelar deploy em andamento

GitHub → Actions → Workflow rodando → **Cancel workflow**

#### Rollback (voltar versão anterior)

**Via Firebase:**
```bash
firebase hosting:rollback
```

**Via GitHub Actions:**
1. GitHub → Actions
2. Encontre o deploy que funcionava
3. **Re-run jobs**

---

### Troubleshooting CI/CD

#### Erro: "Secret FIREBASE_SERVICE_ACCOUNT not found"

**Causa:** Secret não foi adicionado no GitHub

**Solução:**
1. GitHub → Settings → Secrets and variables → Actions
2. Adicione `FIREBASE_SERVICE_ACCOUNT`

---

#### Erro: "Firebase deploy failed: Permission denied"

**Causa:** Service account sem permissões

**Solução:**
1. Firebase Console → IAM & Admin
2. Service account deve ter role: **Firebase Hosting Admin**

---

#### Build passa mas site não atualiza

**Causa:** Cache do CDN

**Solução:**
```bash
# Aguarde 1-2 minutos
# Ou force refresh: Ctrl+Shift+R (Chrome)
```

---

#### Deploy muito lento (>5 min)

**Causa:** `node_modules` não está em cache

**Solução:**
Verifique se tem `cache: 'npm'` no setup do Node.js:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'  # ← Isso deve estar presente
```

---

### Fluxo Completo (Visual)

```
┌─────────────────────────────────────────────────────┐
│  SEU COMPUTADOR                                     │
│  ┌─────────────┐                                    │
│  │  git push   │                                    │
│  │  origin main│                                    │
│  └──────┬──────┘                                    │
└─────────┼───────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────┐
│  GITHUB                                             │
│  ┌────────────────────────────────────────────┐    │
│  │  GitHub Actions (Runner Ubuntu)            │    │
│  │  ┌──────────────────────────────────────┐  │    │
│  │  │  1. Checkout código          (10s)   │  │    │
│  │  │  2. Setup Node.js 22         (20s)   │  │    │
│  │  │  3. npm ci                   (30s)   │  │    │
│  │  │  4. npm run generate         (20s)   │  │    │
│  │  │     ↓                                 │  │    │
│  │  │     .output/public/                  │  │    │
│  │  │       ├── index.html                 │  │    │
│  │  │       └── _nuxt/*.js, *.css          │  │    │
│  │  │  5. firebase deploy          (30s)   │  │    │
│  │  └──────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────┘    │
└─────────┬───────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────┐
│  FIREBASE HOSTING (CDN Global)                      │
│  https://elas-podem-website.web.app                 │
│  ✅ Site atualizado!                                │
└─────────────────────────────────────────────────────┘
```

**Tempo total:** ~2 minutos

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

### 2. CMS para Blog

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
