# 🔐 Auth System - Autenticacao e Roles do Admin

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Sistema de autenticacao Firebase Auth + roles multi-usuario com permissoes por funcao.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Fazer Login](#-como-fazer-login-essencial) (Essencial)
3. [Roles e Permissoes](#-roles-e-permissoes-importante) (Importante)
4. [Fluxo Completo](#-fluxo-completo-importante) (Importante)
5. [Arquitetura](#-arquitetura-opcional) (Opcional)
6. [Como Funciona Por Dentro](#-como-funciona-por-dentro-tecnico) (Tecnico)
7. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
8. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

O admin precisa de:
- Login seguro (nao qualquer pessoa pode editar o site)
- Diferentes niveis de acesso (admin faz tudo, redatora so edita, moderadora so aprova)
- Protecao de rotas (nao pode acessar `/admin/*` sem login)
- Estado compartilhado (se logou, toda a app sabe)

### A Solucao

```
Firebase Auth          →  valida email/senha (seguranca)
Firestore /users       →  guarda role e status (permissoes)
useAuth() singleton    →  estado compartilhado (reatividade)
plugin auth.client.ts  →  inicializa no boot (persistencia)
middleware admin.ts    →  protege rotas (porteiro)
```

### Quando Usar

✅ **Consulte este guia quando:**
- Precisar adicionar nova role
- Precisar adicionar nova permissao
- Quiser entender o fluxo de login
- Precisar proteger uma nova rota

❌ **Nao precisa deste guia para:**
- Editar conteudo das secoes (va em `SectionFields_GUIDE.md`)
- Mudar regras de validacao (va em `definitions/validationConfigs.ts`)
- Configurar Firebase (va em `config/index.ts`)

---

## 🔧 Como Fazer Login (Essencial)

### Na pagina de login

```typescript
const { signIn, error, isLoading } = useAuth();

const handleLogin = async () => {
  const result = await signIn(email.value, password.value);
  if (result.success) {
    await navigateTo('/admin/dashboard');
  }
};
```

### Verificar se esta logado

```typescript
const { isAuthenticated, userRole, permissions } = useAuth();

if (isAuthenticated.value) {
  console.log('Logado como:', userRole.value);  // 'admin' | 'redatora' | 'moderadora'
}
```

### Verificar permissoes

```typescript
const { permissions } = useAuth();

if (permissions.value?.canEdit) {
  // mostrar botao de editar
}

if (permissions.value?.canPublish) {
  // mostrar botao de publicar
}
```

### Logout

```typescript
const { signOut } = useAuth();
await signOut();  // limpa estado + redireciona pra home
```

---

## 🚀 Roles e Permissoes (Importante)

### As 3 Roles

| Role | Quem é | O que faz |
|------|--------|-----------|
| `admin` | Administradora | Acesso total — edita, publica, gerencia usuarios, ve logs |
| `redatora` | Redatora de conteudo | Edita textos e imagens, mas nao publica sozinha |
| `moderadora` | Moderadora/Revisora | Nao edita, mas aprova e publica, ve logs |

### Tabela de Permissoes

```
               canEdit   canPublish   canManageUsers   canViewLogs
admin            ✅          ✅            ✅              ✅
redatora         ✅          ❌            ❌              ❌
moderadora       ❌          ✅            ❌              ✅
```

### Como adicionar nova role

**Passo 1** — Adicione em `definitions/adminRoles.ts`:

```typescript
export const ADMIN_ROLES = {
  ADMIN: 'admin',
  REDATORA: 'redatora',
  MODERADORA: 'moderadora',
  FINANCEIRA: 'financeira',   // ← NOVA
} as const satisfies Record<string, string>;
```

**Passo 2** — O TypeScript vai reclamar em 3 lugares (siga os erros):
- `ADMIN_ROLE_DISPLAY_NAMES` → adicione o display name
- `ADMIN_ROLE_DESCRIPTIONS` → adicione a descricao
- `ADMIN_ROLE_PERMISSIONS` → defina as permissoes

**Passo 3** — Crie o usuario no Firestore com `role: 'financeira'`.

### Como adicionar nova permissao

**Passo 1** — Adicione no tipo de `ADMIN_ROLE_PERMISSIONS`:

```typescript
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, {
  canEdit: boolean;
  canPublish: boolean;
  canManageUsers: boolean;
  canViewLogs: boolean;
  canManageFinances: boolean;   // ← NOVA
}> = {
  // TypeScript vai reclamar em cada role — adicione o valor
};
```

**Passo 2** — Use na UI:

```typescript
if (permissions.value?.canManageFinances) {
  // mostrar aba financeira
}
```

---

## 🔄 Fluxo Completo (Importante)

### Boot da aplicacao (antes de qualquer pagina)

```
Browser abre o site
  │
  ├─ Nuxt inicia
  │
  ├─ plugins/auth.client.ts executa
  │     → useAuth().initAuthStateListener()
  │     → Firebase checa: "tem sessao ativa no browser?"
  │         SIM → busca userData do Firestore → state preenchido
  │         NAO → state.user = null, isLoading = false
  │
  └─ App renderiza (auth state ja resolvido)
```

### Login

```
Usuario acessa /admin/login
  │
  ├─ Preenche email + senha
  │
  ├─ signIn('admin@elas.com', 'senha123')
  │     │
  │     ├─ 1. Firebase Auth → valida credenciais
  │     │     → FirebaseUser { uid: 'abc123', email: 'admin@elas.com' }
  │     │
  │     ├─ 2. Firestore /users → query where email == 'admin@elas.com'
  │     │     → { role: 'admin', active: true, displayName: 'Margareth' }
  │     │
  │     ├─ 3. Valida: dados existem? ativo? role valida?
  │     │
  │     ├─ 4. state.user = FirebaseUser
  │     │     state.userData = { role: 'admin', active: true, ... }
  │     │     → isAuthenticated = true
  │     │     → isAdmin = true
  │     │     → permissions = { canEdit: true, canPublish: true, ... }
  │     │
  │     └─ 5. updateLastLogin() no Firestore
  │
  └─ navigateTo('/admin/dashboard')
```

### Navegacao protegida

```
Usuario acessa /admin/dashboard
  │
  ├─ middleware/admin.ts executa ANTES da pagina
  │     path = '/admin/dashboard'
  │     path === '/admin/login'? NAO
  │     path.startsWith('/admin')? SIM
  │     $auth.currentUser?
  │         SIM → deixa passar → pagina renderiza
  │         NAO → navigateTo('/admin/login')
```

### Logout

```
signOut()
  │
  ├─ Firebase Auth → destroi sessao
  │
  ├─ state.user = null
  │   state.userData = null
  │   → isAuthenticated = false
  │   → permissions = null
  │
  └─ navigateTo('/') → volta pro site publico
```

---

## 🎨 Arquitetura (Opcional)

### Arquivos envolvidos

```
config/
├── constants.ts          ← ALIAS_DEFINITIONS + getAliases()

definitions/
├── adminRoles.ts         ← ADMIN_ROLES, permissoes, helpers

composables/
├── useFirebase.ts        ← singleton Firebase (app, db, auth, storage)
├── useAuth.ts            ← singleton auth (login, logout, state, roles)

plugins/
├── auth.client.ts        ← inicializa listener no boot (client-only)

middleware/
├── admin.ts              ← protege rotas /admin/*

utils/
├── Logger.ts             ← logs estruturados (copiado do Mnesis)
```

### Diagrama de dependencias

```
                    useConfig()
                        │
                        ▼
                   useFirebase()     ← singleton ($app, $db, $auth, $storage)
                   /         \
                  ▼           ▼
            useAuth()    middleware/admin.ts
               │              │
               │         checa $auth.currentUser
               │
               ├─ Firebase Auth (signIn, signOut, onAuthStateChanged)
               ├─ Firestore /users (role, active, displayName)
               ├─ Logger (logs estruturados)
               └─ adminRoles (ADMIN_ROLES, permissions)
                     │
                     ▼
              plugins/auth.client.ts
              (inicializa listener no boot)
```

### Estrutura no Firestore

```
/users
  /{uid}
    email: "admin@elaspodem.org"
    displayName: "Margareth"
    role: "admin"                    ← AdminRole
    active: true                     ← pode desativar sem deletar
    lastLogin: Timestamp(2026-02-19)

/admin_logs
  /{timestamp_action}
    action: "page_sections_updated"
    details: { page: "home", sections: ["hero"], count: 1 }
    timestamp: "2026-02-19T10:30:00.000Z"
    user: "admin"
```

---

## 🔬 Como Funciona Por Dentro (Tecnico)

### O padrao singleton

O Just Prime tinha um problema: cada componente que chama `useAuth()` cria estado novo.

```typescript
// ❌ Just Prime — estado duplicado
export const useAuth = () => {
  const authState = reactive({ user: null });  // novo a cada chamada!
  return { ...toRefs(authState) };
};
```

Nos resolvemos com singleton no escopo do modulo:

```typescript
// ✅ Elas Podem — estado compartilhado
let _state = null;  // vive fora da funcao (escopo do modulo)

function getState() {
  if (_state) return _state;           // ja existe? retorna
  _state = reactive({ user: null });   // nao? cria uma vez so
  return _state;
}

export function useAuth() {
  const state = getState();  // todos recebem o MESMO state
  // ...
}
```

Resultado:
```
Componente A: useAuth() → _state (o mesmo objeto)
Componente B: useAuth() → _state (o mesmo objeto)
Middleware:   useAuth() → _state (o mesmo objeto)
Plugin:       useAuth() → _state (o mesmo objeto)
```

### Por que 2 fontes de dados (Auth + Firestore)?

```
Firebase Auth                    Firestore /users
─────────────                    ─────────────────
email ✅                         email ✅
uid ✅                           displayName ✅
senha (hash) ✅                  role ✅ (admin/redatora/moderadora)
                                 active ✅ (pode desativar)
                                 lastLogin ✅
```

Firebase Auth so guarda credenciais. Role e permissoes ficam no Firestore porque:
- **Flexibilidade** — mudar role nao precisa mexer no Auth
- **Desativar** — `active: false` bloqueia sem deletar conta
- **Dados extras** — displayName, lastLogin, qualquer campo novo

### O tipo derivado AdminRole

```typescript
export const ADMIN_ROLES = {
  ADMIN: 'admin',
  REDATORA: 'redatora',
  MODERADORA: 'moderadora',
} as const satisfies Record<string, string>;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];
```

Passo a passo:
```
1. typeof ADMIN_ROLES
   = { readonly ADMIN: 'admin', readonly REDATORA: 'redatora', readonly MODERADORA: 'moderadora' }

2. keyof typeof ADMIN_ROLES
   = 'ADMIN' | 'REDATORA' | 'MODERADORA'

3. (typeof ADMIN_ROLES)['ADMIN' | 'REDATORA' | 'MODERADORA']
   = 'admin' | 'redatora' | 'moderadora'
```

O `Record<AdminRole, ...>` nos display names e permissoes garante que se adicionar role nova, o TypeScript reclama em todos os mapas que faltam — impossivel esquecer.

### Como o middleware protege sem loop infinito

```typescript
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return;     // ← ESCAPE: nao protege login
  if (!to.path.startsWith('/admin')) return;   // ← ESCAPE: so rotas admin

  const { $auth } = useFirebase();
  if (!$auth.currentUser) {
    return navigateTo('/admin/login');         // ← redireciona
  }
});
```

Sem o primeiro escape:
```
/admin/login → middleware → nao logado → redireciona /admin/login → middleware → ... ∞
```

### Por que o middleware checa $auth.currentUser e nao isAuthenticated?

`$auth.currentUser` e do Firebase diretamente — e a fonte mais confiavel. O `isAuthenticated` e computed do nosso state, que depende do plugin ter rodado. Se o middleware executa antes do plugin (pode acontecer na primeira carga), o state ainda esta vazio mas o Firebase ja sabe se tem sessao.

### O plugin auth.client.ts e o .client

```typescript
// plugins/auth.client.ts
export default defineNuxtPlugin(() => {
  const { initAuthStateListener } = useAuth();
  initAuthStateListener();
});
```

O sufixo `.client.ts` diz pro Nuxt: "so roda no browser". Sem isso, tentaria rodar no servidor (SSR) onde nao existe `localStorage` nem `cookies` do Firebase Auth — daria erro.

O `onAuthStateChanged` dispara imediatamente quando registrado:
1. Firebase checa se tem sessao ativa no browser
2. SIM → callback com `firebaseUser` preenchido → busca Firestore
3. NAO → callback com `null` → state limpo

Isso e o que faz a sessao "sobreviver" a recargas de pagina.

---

## 📊 Referencia de Arquivos (Referencia)

### `definitions/adminRoles.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `ADMIN_ROLES` | const | `{ ADMIN: 'admin', REDATORA: 'redatora', MODERADORA: 'moderadora' }` |
| `AdminRole` | type | `'admin' \| 'redatora' \| 'moderadora'` |
| `ADMIN_ROLE_DISPLAY_NAMES` | const | Nomes de exibicao por role |
| `ADMIN_ROLE_DESCRIPTIONS` | const | Descricoes por role |
| `ADMIN_ROLE_PERMISSIONS` | const | Permissoes (canEdit, canPublish, etc) por role |
| `isValidRole()` | function | Type guard — valida se string e AdminRole |
| `getRoleDisplayName()` | function | Retorna display name ou fallback |
| `getRolePermissions()` | function | Retorna permissoes ou null |
| `ALL_ROLES` | const | Array com todas as roles |

### `composables/useAuth.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `useAuth()` | composable | Retorna estado + actions de autenticacao |
| `IUserData` | interface | Dados do usuario no Firestore |
| `IAuthResult` | interface | Resultado de operacao (success/error) |
| `UseAuth` | type | ReturnType do composable |

#### Retorno do useAuth()

| Retorno | Tipo | Descricao |
|---------|------|-----------|
| `user` | `Ref<FirebaseUser \| null>` | Usuario Firebase (uid, email) |
| `userData` | `Ref<IUserData \| null>` | Dados Firestore (role, displayName, active) |
| `isLoading` | `Ref<boolean>` | True enquanto resolve auth |
| `error` | `Ref<string \| null>` | Mensagem de erro |
| `isAuthenticated` | `ComputedRef<boolean>` | Tem usuario logado? |
| `isAdmin` | `ComputedRef<boolean>` | Role admin + ativo? |
| `isRedatora` | `ComputedRef<boolean>` | Role redatora + ativo? |
| `isModeradora` | `ComputedRef<boolean>` | Role moderadora + ativo? |
| `userRole` | `ComputedRef<AdminRole \| null>` | Role atual |
| `permissions` | `ComputedRef<Permissions \| null>` | Objeto de permissoes |
| `signIn(email, password)` | `async` | Login com email/senha |
| `signOut()` | `async` | Logout + redireciona pra home |
| `refreshUserData()` | `async` | Re-busca dados do Firestore |
| `hasAdminAccess()` | `function` | Checa se pode acessar admin |
| `initAuthStateListener()` | `function` | Inicia observer do Firebase |

### Mapa de aliases (`config/constants.ts`)

| Alias | Caminho | Uso |
|-------|---------|-----|
| `@` | `.` | Raiz do projeto |
| `@config` | `./config` | Configuracoes |
| `@components` | `./components` | Componentes Vue |
| `@composables` | `./composables` | Composables |
| `@utils` | `./utils` | Utilitarios |
| `@definitions` | `./definitions` | Constantes e definicoes |
| `@appTypes` | `./types` | Types e interfaces |
| `@plugins` | `./plugins` | Plugins Nuxt |
| `@assets` | `./assets` | CSS, imagens |
| `@data` | `./data` | Dados estaticos |

---

## 💡 FAQ (Suporte)

### Como criar um usuario admin no Firestore?

Crie um documento na collection `/users` com o uid do Firebase Auth:

```
/users/{uid}
  email: "admin@elaspodem.org"
  displayName: "Margareth"
  role: "admin"
  active: true
  lastLogin: null
```

O uid voce pega no console do Firebase > Authentication > Users.

### Posso ter mais de um admin?

Sim. Cada documento em `/users` e um usuario independente. Pode ter 3 admins, 2 redatoras e 1 moderadora — cada um com seu email/senha e role propria.

### Como desativar um usuario sem deletar?

Mude `active: false` no documento Firestore. O login vai falhar com "Usuario desativado". Nao precisa mexer no Firebase Auth.

### O usuario fez login mas permissions e null?

Verifique se:
1. O documento existe em `/users` com o email correto
2. O campo `role` tem valor valido (`admin`, `redatora` ou `moderadora`)
3. O campo `active` e `true`

### Como adicionar nova role?

Veja secao [Como adicionar nova role](#como-adicionar-nova-role) — sao 3 passos, TypeScript guia os erros.

### A sessao sobrevive a recargas de pagina?

Sim. O Firebase Auth persiste a sessao no browser (IndexedDB). No boot, o plugin `auth.client.ts` detecta a sessao e re-busca os dados do Firestore automaticamente.

### Qual a diferenca entre isAuthenticated e hasAdminAccess?

- `isAuthenticated` — tem usuario logado (qualquer um, mesmo inativo)
- `hasAdminAccess()` — logado E ativo (pode acessar o admin)

---

*📅 Criado em*: 19 FEV 2026
*📋 Versao*: 1.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [arquitetura, admin, auth, roles, firebase, permissoes, middleware]
