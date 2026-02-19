# 🏠 Admin Pages - Login e Dashboard

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Paginas do painel admin: login standalone com identidade visual e dashboard hub com status real e permissoes por role.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Login Page](#-login-page-essencial) (Essencial)
3. [Dashboard](#-dashboard-essencial) (Essencial)
4. [Fluxo Completo](#-fluxo-completo-importante) (Importante)
5. [Permissoes por Role](#-permissoes-por-role-importante) (Importante)
6. [Decisoes Tecnicas](#-decisoes-tecnicas-opcional) (Opcional)
7. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
8. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O que sao

Duas paginas Vue que formam a porta de entrada do admin:

- **`login.vue`** — Tela de autenticacao (email/senha via Firebase Auth)
- **`index.vue`** — Dashboard hub com status das paginas e acoes por role

### Quando voce precisa deste guia

- ✅ Entender como funciona o fluxo login → dashboard
- ✅ Adicionar uma nova pagina ao dashboard (novo card)
- ✅ Entender como permissoes afetam o que cada role ve
- ✅ Modificar o visual do login ou dashboard

### Nao precisa deste guia para

- ❌ Entender o sistema de auth/roles → va em `Auth_GUIDE.md`
- ❌ Entender como dados sao carregados do Firestore → va em `PageData_GUIDE.md`
- ❌ Entender validacao de formularios → va em `Validation_GUIDE.md`

---

## 🔐 Login Page (Essencial)

### Arquivo: `pages/admin/login.vue`

Tela standalone — nao usa nenhum layout (`definePageMeta({ layout: false })`).

### O que faz

1. Mostra formulario com email + senha usando componentes `@cb/components`
2. Chama `useAuth().signIn(email, password)` no submit
3. Se sucesso → `navigateTo('/admin')`
4. Se falha → mostra erro inline (cor coral do tema)
5. Se ja logado (onMounted) → redireciona direto pra `/admin`

### Elementos visuais

```
┌─────────────────────────────────┐
│         [Logo Elas Podem]       │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Painel Administrativo   │  │
│  │   Entre com credenciais   │  │
│  │                           │  │
│  │   [Erro inline se houver] │  │
│  │                           │  │
│  │   📧 Email               │  │
│  │   🔒 Senha          👁️  │  │
│  │                           │  │
│  │   [████ Entrar ████]      │  │
│  └───────────────────────────┘  │
│                                 │
│     Elas Podem — Painel Admin   │
└─────────────────────────────────┘
  Fundo: var(--bg-hero) + glow
```

### Composables usados

| Composable | O que usa |
|------------|-----------|
| `useAuth()` | `signIn`, `isAuthenticated`, `isLoading` |

### Detalhes importantes

- **Sem validacao local** — Firebase Auth valida email/senha e retorna erros claros
- **Toggle de senha** — botao `type="button"` (nao dispara submit)
- **Enter funciona** — `@submit.prevent` no `<form>` trata Enter naturalmente
- **Loading** — botao mostra spinner e desabilita inputs durante submit

---

## 📊 Dashboard (Essencial)

### Arquivo: `pages/admin/index.vue`

Hub de navegacao com status real das paginas.

### O que faz

1. Mostra welcome com `displayName` + badge da role do usuario
2. Lista paginas editaveis com status (quem editou, quando)
3. Filtra acoes por permissoes (canEdit, canViewLogs)
4. Botao de logout no header

### Elementos visuais

```
┌─────────────────────────────────────────┐
│ Ola, Elisa          [Administradora] [Sair] │
│                                             │
│ Paginas                                     │
│ ┌─────────────────────────────────────────┐ │
│ │ 🏠 Home Page                            │ │
│ │ Pagina principal — 8 secoes editaveis   │ │
│ │ ──────────────────────────────────       │ │
│ │ 👤 Elisa  🕐 19/02/2026, 14:30         │ │
│ │                    [Editar Pagina]       │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Atividade Recente (se canViewLogs)          │
│ ┌─────────────────────────────────────────┐ │
│ │ 📜 Audit log disponivel na Fase 2       │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│          Elas Podem — Painel Admin          │
└─────────────────────────────────────────────┘
```

### Composables usados

| Composable | O que usa |
|------------|-----------|
| `useAuth()` | `userData`, `permissions`, `signOut` |
| `useHomePageData()` | `originalData`, `isLoading`, `loadPageData` |

### Status real do Firestore

O dashboard le metadados do documento `pages/home`:

```ts
const homeStatus = computed(() => {
  const data = originalData.value as Record<string, unknown> | null;
  if (!data) return null;
  return {
    lastUpdated: data.lastUpdated as string | null,
    updatedByName: data.updatedByName as string | null,
  };
});
```

Esses campos sao escritos automaticamente pelo `saveSection()` / `saveAll()` da factory `usePageData`.

### Como adicionar nova pagina ao dashboard

1. Criar o composable da pagina (ex: `useAboutPageData`)
2. Importar no dashboard
3. Duplicar o bloco `<!-- Card: Home Page -->` e ajustar:
   - Icone, titulo, descricao
   - Computed de status apontando pro novo composable
   - Funcao de navegacao (`navigateTo('/admin/edit/aboutEdit')`)

---

## 🔄 Fluxo Completo (Importante)

### Cenario 1: Primeiro acesso (nao logado)

```
Usuario digita /admin
   ↓
middleware/admin.global.ts detecta: nao autenticado
   ↓
Redireciona → /admin/login
   ↓
login.vue renderiza (layout: false)
   ↓
Usuario preenche email + senha → Enter
   ↓
handleLogin() → useAuth().signIn()
   ↓
Firebase Auth OK → Firestore busca userData
   ↓
Valida: active? role valida?
   ↓
navigateTo('/admin')
   ↓
dashboard carrega → loadPageData() → mostra status
```

### Cenario 2: Ja logado

```
Usuario digita /admin/login
   ↓
middleware escapa /admin/login (nao protege)
   ↓
login.vue renderiza
   ↓
onMounted: isAuthenticated === true
   ↓
navigateTo('/admin') → dashboard
```

### Cenario 3: Sessao expirada

```
Usuario esta no dashboard
   ↓
Navega pra /admin/edit/homeEdit (futuro)
   ↓
middleware detecta: $auth.currentUser === null
   ↓
Redireciona → /admin/login
```

---

## 🎭 Permissoes por Role (Importante)

O dashboard adapta a interface por role:

| Elemento | Admin | Writer | Moderator |
|----------|-------|----------|------------|
| Welcome + nome | ✅ | ✅ | ✅ |
| Badge role | Administradora | Writer | Moderator |
| Botao "Editar Pagina" | ✅ (canEdit) | ✅ (canEdit) | ❌ |
| Badge "Sem permissao" | ❌ | ❌ | ✅ |
| Secao "Atividade Recente" | ✅ (canViewLogs) | ❌ | ✅ (canViewLogs) |
| Botao "Sair" | ✅ | ✅ | ✅ |

Permissoes vem de `ADMIN_ROLE_PERMISSIONS` em `adminRoles.ts`. O dashboard so le — nao define logica propria.

---

## 🧠 Decisoes Tecnicas (Opcional)

### Por que layout: false nas duas paginas?

O login e standalone por natureza — nao tem navbar nem sidebar. O dashboard tambem usa `layout: false` por agora porque ainda nao temos `layouts/admin.vue`. Quando criarmos o layout admin (Fase 2, com sidebar), o dashboard passara a usar `layout: 'admin'`.

### Por que carregar useHomePageData so pro status?

O dashboard carrega o documento `pages/home` inteiro so pra ler 2 campos (`lastUpdated`, `updatedByName`). Parece desperdicio, mas:
- E 1 documento Firestore (nao uma query)
- O documento e pequeno (conteudo da home)
- O singleton ja cacheia — se o usuario navegar pro editor, os dados ja estao carregados
- Otimizacao prematura (query so de metadados) nao vale a complexidade extra

### Por que audit log foi adiado pra Fase 2?

O plano original incluia audit log no dashboard. Adiamos porque:
- Nenhuma acao foi logada ainda (homeEdit nao existe)
- Mostrar lista vazia nao agrega valor
- A collection `admin_logs` existe mas esta vazia
- Quando homeEdit for implementado (Fase 2), cada save logara acoes → ai o audit log faz sentido

### Por que o middleware virou .global.ts?

O `middleware/admin.ts` (named) so rodava em paginas que declarassem `definePageMeta({ middleware: 'admin' })`. Renomeando pra `admin.global.ts`, ele roda em TODAS as rotas automaticamente — a logica interna ja filtra (`to.path.startsWith('/admin')` e escapa `/admin/login`).

---

## 📁 Referencia de Arquivos (Referencia)

### Arquivos criados

| Arquivo | Descricao |
|---------|-----------|
| `pages/admin/login.vue` | Tela de login standalone |
| `pages/admin/index.vue` | Dashboard admin hub |

### Arquivo renomeado

| De | Para | Motivo |
|----|------|--------|
| `middleware/admin.ts` | `middleware/admin.global.ts` | Protecao automatica de todas as rotas /admin/* |

### Dependencias

| Arquivo | Depende de |
|---------|-----------|
| `login.vue` | `useAuth()`, `@cb/components`, `theme.css` |
| `index.vue` | `useAuth()`, `useHomePageData()`, `adminRoles.ts`, `@cb/components`, `theme.css` |

### Documentacao relacionada

| Guia | Relacao |
|------|---------|
| `Auth_GUIDE.md` | Sistema de auth, roles e permissoes |
| `PageData_GUIDE.md` | Factory, loadPageData, originalData |
| `PageEditor_GUIDE.md` | Change tracking (usado no editor, nao no dashboard) |

---

## ❓ FAQ (Suporte)

### P: Como testo o login sem usuario no Firestore?

R: Voce precisa criar um usuario no Firebase Auth E um documento na collection `/users` com `email`, `displayName`, `role`, `active: true`. Sem o documento Firestore, o login retorna "Dados do usuario nao encontrados".

### P: O dashboard mostra "Carregando dados..." infinitamente?

R: Provavelmente o documento `pages/home` nao existe no Firestore. O `loadPageData()` tenta carregar e usa defaults. Verifique o console — o Logger mostra warnings.

### P: Posso adicionar mais cards de pagina ao dashboard?

R: Sim. Duplique o bloco `<!-- Card: Home Page -->`, ajuste icone/titulo/descricao, e aponte o `navigateTo` pro editor correto. Se a pagina tiver composable proprio (ex: `useAboutPageData`), importe-o e crie um computed de status.

### P: Por que a moderator nao ve o botao "Editar"?

R: Porque `ADMIN_ROLE_PERMISSIONS.moderator.canEdit === false`. O template usa `v-if="permissions?.canEdit"`. Se quiser que moderator edite, mude a permissao em `adminRoles.ts`.

### P: O audit log vai funcionar quando?

R: Na Fase 2, quando `homeEdit.vue` for implementado. Cada `saveSection()` logara acoes na collection `admin_logs`. O dashboard ja tem o placeholder visual e a secao condicional (`v-if="permissions?.canViewLogs"`).

---

*📅 Criado em*: 19 FEV 26
*📅 Ultima atualizacao*: 19 FEV 26
*📋 Versao*: 1.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [admin, login, dashboard, paginas, permissoes, roles, firebase-auth]
