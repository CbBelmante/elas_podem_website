# 🗄️ Cache System - Cache em 2 Niveis (RAM + localStorage)

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-2.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Sistema de cache automatico em 2 niveis com persistencia entre sessoes.**

> Cache automatico com fallback inteligente — sem Pinia, sem scope multi-empresa, simples e direto.
> Controle de cache em 2 niveis: global (features.enableCache) e per-key (CACHE_KEYS.*.hasCache).

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Usar](#-como-usar-essencial) (Essencial)
3. [Controle de Cache](#-controle-de-cache-essencial) (Essencial)
4. [Fluxo de Cache](#-fluxo-de-cache-importante) (Importante)
5. [Arquitetura](#-arquitetura-importante) (Importante)
6. [Como Funciona Por Dentro](#-como-funciona-por-dentro-tecnico) (Tecnico)
7. [Como Escalar](#-como-escalar-tecnico) (Tecnico)
8. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
9. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

Quando o usuario recarrega a pagina do admin:

```
1. Firebase Auth checa sessao (IndexedDB)     → ~200ms
2. onAuthStateChanged dispara                  → callback
3. fetchUserData() busca Firestore             → ~150ms
4. state.userData preenchido                   → UI renderiza
```

Total: **~350ms de tela vazia** (flash de loading). Pior em redes lentas.

### A Solucao

Cache em 2 niveis que restaura dados instantaneamente:

```
Nivel 1: RAM (objeto JS)       → ~0ms   ⚡ instantaneo (entre navegacoes)
Nivel 2: localStorage           → ~2ms   💾 persistente (entre sessoes)
Nivel 3: Firestore              → ~150ms 🌐 fonte de verdade (atualiza depois)
```

```
Browser recarrega
  │
  ├─ initAuthStateListener()
  │     → cache.get(CACHE_KEYS.USER_DATA) → restaura do localStorage (~2ms)
  │     → UI ja mostra nome/role do usuario ✅
  │
  └─ onAuthStateChanged dispara
        → fetchUserData() do Firestore (~150ms)
        → cache.set(CACHE_KEYS.USER_DATA, fresh) → atualiza ambos os niveis
        → UI atualiza se mudou algo
```

### Quando Usar

✅ **Consulte este guia quando:**
- Precisar cachear dados novos (sections, conteudo, etc)
- Quiser entender como o cache funciona por dentro
- Precisar debugar dados desatualizados

❌ **Nao precisa deste guia para:**
- Entender login/logout (va em `Auth_GUIDE.md`)
- Entender as telas do admin (va em `AdminPages_GUIDE.md`)

---

## 🔧 Como Usar (Essencial)

Cada metodo recebe um **`CacheKeyEntry`** (objeto `{ key, hasCache }` de `CACHE_KEYS`), nao uma string.

### Salvar e buscar dado

```typescript
import { useCache } from '@composables/useCache';
import { CACHE_KEYS } from '@definitions/cacheKeys';

const cache = useCache();

// Salvar (RAM + localStorage) — so salva se hasCache = true
cache.set(CACHE_KEYS.USER_DATA, { role: 'admin', displayName: 'Margareth' });

// Buscar (RAM → localStorage → null) — retorna null se hasCache = false
const user = cache.get<IUserData>(CACHE_KEYS.USER_DATA);
```

### Cache-first com fallback (getOrFetch)

```typescript
// Busca do cache. Se nao tem (ou cache desabilitado), executa a funcao.
const userData = await cache.getOrFetch(
  CACHE_KEYS.USER_DATA,
  () => fetchUserData(email),  // so executa se cache MISS ou desabilitado
);
```

### Remover dado

```typescript
// Remove de ambos os niveis
cache.remove(CACHE_KEYS.USER_DATA);
```

### Limpar tudo

```typescript
// Remove TODOS os dados do cache (RAM + localStorage)
cache.clearAll();
```

### Verificar existencia

```typescript
if (cache.has(CACHE_KEYS.USER_DATA)) {
  // existe no cache (RAM ou localStorage) E cache esta habilitado
}
```

---

## 🔒 Controle de Cache (Essencial)

O cache tem **2 niveis de controle** (inspirado no `hasCache` do ApiCrudRepository do mneis_frontend):

### Global: `features.enableCache`

Desabilita **todo** o cache da aplicacao. Util para debug.

```typescript
// config/constants.ts
features: {
  enableCache: false,  // true → habilita cache; false → NENHUM cache funciona
}
```

### Per-key: `CACHE_KEYS.*.hasCache`

Desabilita cache **individualmente** por chave. Util quando uma entidade muda frequentemente.

```typescript
// definitions/cacheKeys.ts
export const CACHE_KEYS = {
  USER_DATA: { key: 'userData', hasCache: true },   // cache normal
  HOME_PAGE: { key: 'homePage', hasCache: true },   // cache normal
  // Se precisar desabilitar temporariamente:
  // HOME_PAGE: { key: 'homePage', hasCache: false }, // bypass total
} as const;
```

### Como funciona

```
cache.get(CACHE_KEYS.USER_DATA)
  │
  ├─ enableCache = false?  → return null (bypass global)
  ├─ hasCache = false?     → return null (bypass per-key)
  └─ ambos true?           → busca RAM → localStorage → null
```

O helper interno `isCacheEnabled(entry)` checa ambos:

```typescript
function isCacheEnabled(entry: CacheKeyEntry): boolean {
  if (!APP_CONSTANTS.features.enableCache) return false;  // global off
  return entry.hasCache;                                   // per-key
}
```

### Quando desabilitar

- **Global off**: Debug de dados desatualizados, verificar se um bug e do cache
- **Per-key off**: Entidade que muda a cada request (nao faz sentido cachear)

> **Cuidado**: Desabilitar o cache do USER_DATA faz o flash de loading voltar no reload (~150ms de tela vazia).

---

## 🔄 Fluxo de Cache (Importante)

### Login

```
signIn('admin@elas.com', 'senha123')
  │
  ├─ Firebase Auth → valida credenciais
  │
  ├─ fetchUserData() → busca Firestore
  │     → { role: 'admin', active: true, displayName: 'Margareth' }
  │
  ├─ state.userData = userData
  │
  └─ cache.set(CACHE_KEYS.USER_DATA, userData)
        ├─ RAM: _ram['userData'] = userData
        └─ localStorage: 'ep_cache:userData' = JSON.stringify(userData)
```

### Reload da pagina (flash evitado)

```
Browser recarrega
  │
  ├─ plugins/auth.client.ts
  │     → useAuth().initAuthStateListener()
  │
  ├─ ANTES do Firebase responder:
  │     cache.get(CACHE_KEYS.USER_DATA)
  │       ├─ isCacheEnabled? → checa global + hasCache
  │       ├─ RAM? → MISS (limpa no reload)
  │       └─ localStorage? → HIT! (~2ms)
  │           → state.userData = cached
  │           → UI ja mostra o usuario ✅
  │
  └─ DEPOIS, Firebase responde:
        onAuthStateChanged(firebaseUser)
          → fetchUserData() do Firestore (~150ms)
          → state.userData = fresh (dados atualizados)
          → cache.set(CACHE_KEYS.USER_DATA, fresh)
          → UI atualiza se mudou
```

### Logout

```
signOut()
  │
  ├─ Firebase Auth → destroi sessao
  │
  ├─ state.user = null
  │   state.userData = null
  │
  ├─ cache.remove(CACHE_KEYS.USER_DATA)
  │     ├─ RAM: delete _ram['userData']
  │     └─ localStorage: removeItem('ep_cache:userData')
  │
  └─ navigateTo('/')
```

### Navegacao entre paginas (sem reload)

```
/admin/dashboard → /admin/sections
  │
  └─ cache.get(CACHE_KEYS.USER_DATA)
       └─ RAM? → HIT! (~0ms) ⚡
          → Nem toca o localStorage
```

---

## 🏗️ Arquitetura (Importante)

### Componentes

```
┌─────────────────────────────────────┐
│  useAuth (composable)               │  ← Consome o cache
│  signIn → cache.set()               │
│  signOut → cache.remove()           │
│  initAuthStateListener → cache.get  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  useCache (composable)              │  ← Gerencia 2 niveis
│                                     │
│  get()       → RAM → localStorage   │
│  set()       → RAM + localStorage   │
│  getOrFetch  → cache-first pattern  │
│  remove()    → limpa ambos          │
│  clearAll()  → limpa tudo           │
│  has()       → verifica existencia  │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌──────────┐   ┌──────────────┐
│  _ram    │   │ LocalStorage │
│ (objeto) │   │  (wrapper)   │
│  ~0ms    │   │    ~2ms      │
└──────────┘   └──────────────┘
```

### Arquivos envolvidos

```
definitions/
├── cacheKeys.ts          ← CACHE_KEYS ({ key, hasCache } — controle per-key)

composables/
├── useCache.ts           ← cache 2 niveis (RAM + localStorage) + isCacheEnabled()
├── useAuth.ts            ← consome useCache pra userData
├── useHomePublicData.ts  ← consome useCache pra homePage

utils/
├── LocalStorage.ts       ← wrapper Safari-safe do localStorage

config/
├── constants.ts          ← APP_CONSTANTS.app.localStoragePrefix ('ep_') + features.enableCache
```

### Chaves no localStorage

| CACHE_KEYS entry | Chave no localStorage | hasCache | O que guarda |
|------------------|----------------------|----------|--------------|
| `USER_DATA` | `ep_cache:userData` | `true` | `{ role, displayName, active, email, ... }` |
| `HOME_PAGE` | `ep_cache:homePage` | `true` | `IHomePageData (conteudo da home)` |

O prefix `ep_cache:` e gerado automaticamente pelo `useCache`. Voce so trabalha com a chave logica (`CACHE_KEYS.USER_DATA`, `CACHE_KEYS.HOME_PAGE`).

---

## 🔬 Como Funciona Por Dentro (Tecnico)

### O RAM cache e um objeto simples

```typescript
const _ram: Record<string, unknown> = {};
```

Nao e `reactive()` nem `ref()`. Por que?
- Nenhum componente Vue lê do cache diretamente
- Quem lê e o `useAuth`, que tem seu proprio `reactive()` state
- Menos overhead, mais simples

### O prefix vem do constants.ts

```typescript
const CACHE_PREFIX = `${APP_CONSTANTS.app.localStoragePrefix}cache:`;
// → 'ep_cache:'
```

Se mudar o prefix no `constants.ts`, todas as chaves mudam automaticamente. Zero duplicacao.

### LocalStorage.ts e Safari-safe

O `LocalStorage` nao e `window.localStorage` direto. E um wrapper que:

1. **Detecta suporte** — Safari modo privado bloqueia localStorage
2. **Fallback pra memoria** — se localStorage nao funciona, usa um `Map` interno
3. **Trata QuotaExceeded** — se disco cheio, tenta limpar dados antigos
4. **JSON automatico** — `setObj()`/`getObj()` stringifica/parseia sem voce se preocupar

```typescript
// Por baixo do cache:
cache.set(CACHE_KEYS.USER_DATA, { role: 'admin' });
// → isCacheEnabled({ key: 'userData', hasCache: true }) → true
// → _ram['userData'] = { role: 'admin' }
// → LocalStorage.setObj('ep_cache:userData', { role: 'admin' })
//   → window.localStorage.setItem('ep_cache:userData', '{"role":"admin"}')
```

### isCacheEnabled() — guarda de entrada

Todos os metodos passam por este helper antes de acessar o cache:

```typescript
function isCacheEnabled(entry: CacheKeyEntry): boolean {
  if (!APP_CONSTANTS.features.enableCache) return false;  // global off → tudo desabilitado
  return entry.hasCache;                                   // per-key override
}
```

### get() busca em ordem

```typescript
function get<T>(entry: CacheKeyEntry): T | null {
  if (!isCacheEnabled(entry)) return null;  // cache desabilitado → bypass

  const key = entry.key;

  // 1. RAM (~0ms)
  if (key in _ram) return _ram[key] as T;

  // 2. localStorage (~2ms)
  const stored = LocalStorage.getObj<T>(makeStorageKey(key));
  if (stored !== null) {
    _ram[key] = stored;  // hidrata RAM pro proximo acesso
    return stored;
  }

  return null;
}
```

Na primeira leitura apos reload: pega do localStorage e hidrata RAM.
Na segunda leitura: pega direto da RAM (0ms).

### getOrFetch() e o padrao cache-first

```typescript
async function getOrFetch<T>(entry: CacheKeyEntry, fetchFn: () => Promise<T>): Promise<T> {
  const cached = get<T>(entry);
  if (cached !== null) return cached;  // HIT → retorna instantaneo

  const fresh = await fetchFn();       // MISS → busca fonte (ou cache desabilitado)
  set(entry, fresh);                   // salva pra proxima vez (se habilitado)
  return fresh;
}
```

Generico — funciona com objetos, arrays, qualquer tipo.
Se `hasCache = false`, **sempre** executa `fetchFn` (sem cachear o resultado).

---

## 📈 Como Escalar (Tecnico)

### Adicionar nova chave de cache

**Passo 1** — Adicione em `definitions/cacheKeys.ts`:

```typescript
export const CACHE_KEYS = {
  USER_DATA: { key: 'userData', hasCache: true },
  HOME_PAGE: { key: 'homePage', hasCache: true },
  ABOUT_PAGE: { key: 'aboutPage', hasCache: true },   // ← novo
  BLOG_POSTS: { key: 'blogPosts', hasCache: false },   // ← novo (sem cache — muda frequentemente)
} as const;
```

**Passo 2** — Use no composable:

```typescript
const cache = useCache();

// Cache-first: so busca Firestore se cache vazio (ou hasCache = false → sempre busca)
const aboutData = await cache.getOrFetch(
  CACHE_KEYS.ABOUT_PAGE,
  () => fetchAboutFromFirestore(),
);
```

**Passo 3** — Invalide quando os dados mudarem:

```typescript
// Apos editar a pagina
await saveAboutPage(updatedData);
cache.remove(CACHE_KEYS.ABOUT_PAGE);  // proxima leitura busca fresco
```

### Desabilitar cache para debug

Duas opcoes:

```typescript
// Opcao 1: Desabilitar TUDO (global)
// config/constants.ts
features: { enableCache: false }

// Opcao 2: Desabilitar uma chave especifica (per-key)
// definitions/cacheKeys.ts
HOME_PAGE: { key: 'homePage', hasCache: false },
```

### Adicionar metodos (se precisar no futuro)

Se o admin crescer e precisar de `updateItem` / `removeItem`, e so adicionar no `useCache.ts`:

```typescript
// Exemplo: atualizar 1 item dentro de um array cacheado
function updateItem<T>(entry: CacheKeyEntry, item: T, idField: string = 'id'): void {
  const cached = get<T[]>(entry);
  if (!cached) return;

  const itemRecord = item as Record<string, unknown>;
  const index = cached.findIndex(
    (i) => (i as Record<string, unknown>)?.[idField] === itemRecord[idField]
  );

  if (index >= 0) {
    cached.splice(index, 1, item);
  } else {
    cached.unshift(item);
  }

  set(entry, cached);
}
```

Zero refactor no codigo existente — so adiciona.

---

## 📊 Referencia de Arquivos (Referencia)

### `definitions/cacheKeys.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `CACHE_KEYS` | const | Chaves logicas do cache (`{ USER_DATA: { key: 'userData', hasCache: true } }`) |
| `CacheKeyEntry` | type | Tipo de cada entrada (`{ key: string, hasCache: boolean }`) |
| `CacheKey` | type | Union type dos valores de `key` (`'userData' \| 'homePage'`) |

### `composables/useCache.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `useCache()` | composable | Retorna metodos do cache |
| `UseCache` | type | ReturnType do composable |

#### Retorno do useCache()

| Metodo | Assinatura | Descricao |
|--------|-----------|-----------|
| `get` | `<T>(entry: CacheKeyEntry) → T \| null` | Busca RAM → localStorage (null se desabilitado) |
| `set` | `<T>(entry: CacheKeyEntry, data: T) → void` | Salva RAM + localStorage (noop se desabilitado) |
| `getOrFetch` | `<T>(entry: CacheKeyEntry, fetchFn) → Promise<T>` | Cache-first com fallback |
| `remove` | `(entry: CacheKeyEntry) → void` | Remove de ambos os niveis |
| `clearAll` | `() → void` | Limpa todo o cache |
| `has` | `(entry: CacheKeyEntry) → boolean` | Verifica existencia (false se desabilitado) |

### `utils/LocalStorage.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `LocalStorage` | singleton | Wrapper Safari-safe do localStorage |
| `storageIsEnable()` | function | Verifica se localStorage esta disponivel |
| `getItem()` / `setItem()` | function | Atalhos globais para strings |
| `getObj()` / `setObj()` | function | Atalhos globais para objetos (JSON) |

### Performance

| Operacao | Tempo | Fonte |
|----------|-------|-------|
| `get()` — RAM hit | ~0ms | Objeto JS |
| `get()` — localStorage hit | ~2ms | localStorage + JSON.parse |
| `getOrFetch()` — cache miss | ~150ms | Firestore (rede) |
| `set()` | ~2ms | Objeto JS + JSON.stringify + localStorage |
| `remove()` | ~1ms | delete + removeItem |

---

## 💡 FAQ (Suporte)

### O cache sobrevive a recargas de pagina?

Sim. O nivel 2 (localStorage) persiste entre sessoes. No reload, a RAM esta vazia mas o localStorage restaura os dados em ~2ms.

### E se o localStorage estiver cheio?

O `LocalStorage.ts` tem tratamento de `QuotaExceededError` — tenta limpar dados antigos (>30 dias) e dados grandes (>100KB). Se ainda nao couber, usa um fallback em memoria (funciona na sessao, mas nao persiste).

### E se o usuario desativar cookies/localStorage (Safari)?

O `LocalStorage.ts` detecta isso no boot e usa um `Map` interno como fallback. O cache funciona normalmente na sessao (nivel 1 + fallback do nivel 2), so nao persiste entre sessoes.

### Os dados do cache podem ficar desatualizados?

Sim, por design. O cache e **otimista**: mostra o dado cacheado primeiro (rapido) e busca o dado fresco depois (atualiza se mudou). No caso do `userData`, o `initAuthStateListener` faz isso automaticamente:

```
1. Restaura cache → UI mostra instantaneo
2. Firebase responde → fetch Firestore → atualiza cache + UI
```

Se alguem mudar a role do usuario no Firestore, ele vera a role antiga por ~150ms ate o Firestore responder. Na pratica, isso e imperceptivel.

### Posso ver o cache no DevTools?

Sim. Abra DevTools > Application > Local Storage > seu dominio. Procure por chaves com prefix `ep_cache:`.

```
Chave: ep_cache:userData
Valor: {"email":"admin@elaspodem.org","role":"admin","displayName":"Margareth",...}
```

### Qual a diferenca entre useCache e LocalStorage?

- **LocalStorage** — wrapper baixo nivel. Le/escreve strings e JSON no localStorage. Trata erros e Safari.
- **useCache** — cache alto nivel. Gerencia 2 niveis (RAM + localStorage). Tem `getOrFetch`, logs, prefix automatico.

Use `useCache` pra dados da aplicacao. Use `LocalStorage` diretamente so se precisar de controle fino (chaves customizadas, sem RAM).

### Por que nao usamos Pinia?

Nosso projeto tem 1 composable singleton (`useAuth`) com `reactive()` — que ja faz o mesmo papel de um store Pinia. Adicionar Pinia seria complexidade sem ganho.

### Como desabilitar o cache pra debug?

Duas opcoes:

1. **Global**: Mude `enableCache: false` em `config/constants.ts > features`. Todo cache vira no-op.
2. **Per-key**: Mude `hasCache: false` na entrada desejada em `definitions/cacheKeys.ts`. So essa chave e bypassed.

### Qual a diferenca entre enableCache e hasCache?

- `enableCache` (global): flag em `APP_CONSTANTS.features`. Quando `false`, **nenhum** cache funciona — todos os metodos retornam null/noop.
- `hasCache` (per-key): flag em cada entrada de `CACHE_KEYS`. Quando `false`, **so aquela chave** e bypassed.

Ambos precisam ser `true` para o cache funcionar. O `isCacheEnabled()` checa os dois.

### O cache mostra dados antigos apos alterar o modelo (ex: adicionar campo)?

Sim! Se voce adicionar um campo novo ao modelo (ex: `values` em `IHomePageData`), o cache antigo em localStorage **nao tera esse campo**. Solucao:

1. **Limpar localStorage** no DevTools (Application > Local Storage > remover chave `ep_cache:*`)
2. **Ou** desabilitar cache temporariamente (`hasCache: false`) para forcar fetch fresco
3. **Ou** reiniciar o dev server para limpar o `_ram` singleton

Este e um cenario comum durante desenvolvimento, nao afeta producao (onde o Firestore ja tem o modelo completo).

---

*📅 Criado em*: 19 FEV 2026
*📅 Atualizado em*: 21 FEV 2026
*📋 Versao*: 2.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [arquitetura, cache, localStorage, performance]
