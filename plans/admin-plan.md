# Plano do Admin - Elas Podem

**Objetivo:** Criar admin completo, escalável e funcional baseado no padrão Just Prime
**Princípio:** Simplificar a organização, NÃO a funcionalidade. Menos arquivos, mesma qualidade.

---

## 1. Arquitetura: O que muda vs Just Prime

### Mantemos TUDO do Just Prime:
- Section-based editing (cada seção é independente)
- `usePageEditor` como orquestrador central (SaveResult, change tracking)
- `useValidation` com padrão `{ isValid, errors[] }` por seção
- `useFirebaseStorage` com upload, compressão, validação, cleanup de imagens
- Separação editable/readonly nos dados (combine/separate pattern)
- FormUtils com `createDefault*()`, `separate*Data()`, `combine*Data()`
- Definitions com cores do tema, validation rules, defaults
- Firebase Firestore + Auth + Storage
- Middleware de autenticação
- Type safety em tudo

### O que simplificamos na ORGANIZAÇÃO:
- Just Prime: 6 FormUtils (1600+ linhas cada) → Nós: 1 FormUtils (home tem 8 seções simples)
- Just Prime: 8+ páginas editáveis → Nós: 1 página (home) - escalável para mais
- Just Prime: types espalhados → Nós: `types/admin/` organizado em 4 camadas
- Just Prime: AdminConfigUtils 400+ linhas → Nós: definitions/ enxuto (sem cores Material Design, sem 6 efeitos hover)
- Hidden data (og, twitter) → SEO only, inline (não precisa de layer separado)

### O que evoluímos do Just Prime:
- **Factory pattern**: `usePageData` é uma factory genérica — `useHomePageData` é gerado por ela. Novas páginas (sobre, contato) reutilizam a factory sem duplicar código.
- **Save embutido no factory**: Just Prime usa `useFirestoreAdmin` separado. Nós embutimos `saveSection()` e `saveAll()` direto no composable da página — menos indireção, mesma funcionalidade.
- **Multi-role auth**: Just Prime tem admin único. Nós temos sistema multi-role (admin, writer, moderator) com permissões por ação.
- **SECTION_FIELDS como fonte de verdade**: Config centralizada de quais campos são editable/readonly/hidden, usada para gerar types e FormUtils automaticamente.
- **Firestore collections centralizadas**: `definitions/firestoreCollections.ts` — zero strings hardcoded.
- **Audit trail com ID + nome**: `updatedById` + `updatedByName` (não só email).

**Resumo: mesmos padrões, menos arquivos, mesma funcionalidade, melhor escalabilidade.**

---

## 2. Estrutura de Pastas

```
config/
├── constants.ts                 # Constantes da app (ALIAS_DEFINITIONS, APP_CONSTANTS)
└── index.ts                     # useConfig() — .env vars com runtimeConfig

composables/
├── useFirebase.ts               # Firebase init (app, db, auth, storage) — singleton
├── useAuth.ts                   # Autenticação multi-role (signIn, signOut, permissions)
├── useCache.ts                  # Cache 2 níveis (RAM + localStorage) — get/set/getOrFetch
├── usePageData.ts               # Factory base — gera composables por página
├── useHomePageData.ts           # Composable específico da home (gerado pela factory)
├── useValidation.ts             # Validadores config-driven por seção
├── useImageCompression.ts       # Compressão de imagens via Canvas API
├── useFirebaseStorage.ts        # Upload, delete, validação (usa compression)
└── usePageEditor.ts             # Change tracking, image cleanup, navigation guard

types/admin/
├── index.ts                     # Barrel export de todas as camadas
├── sections.ts                  # Camada 1: Interfaces Firestore (IHeroSection, IHomePageData...)
├── editable.ts                  # Camada 2: Editable/Readonly (IHeroEditable, IProgramReadonly...)
├── formsData.ts                 # Camada 3: Container editor (IHomeFormsData)
└── editor.ts                    # Camada 4: Types do orquestrador (SaveResult, ValidationResult...)

definitions/
├── index.ts                     # Barrel export de tudo
├── sectionFields.ts             # SECTION_FIELDS — fonte de verdade editable/readonly/hidden
├── validationConfigs.ts         # *_CONFIG com validationRules + items limits
├── validationRules.ts           # createValidationRules() + isValidUrl()
├── themeOptions.ts              # THEME_COLOR_OPTIONS, ICON_OPTIONS
├── firestoreCollections.ts      # FIRESTORE_COLLECTIONS + PAGE_DOCUMENTS (zero hardcoded)
├── adminRoles.ts                # ADMIN_ROLES, permissões, display names
└── cacheKeys.ts                 # CACHE_KEYS — chaves lógicas centralizadas do cache

utils/
├── HomeFormUtils.ts             # separate/combine/createDefault para cada seção da home
├── Logger.ts                    # Logger com child() e levels (padrão Mnesis)
└── LocalStorage.ts              # Wrapper Safari-safe para localStorage (fallback in-memory)

middleware/
└── admin.global.ts              # Proteção global de rotas admin (redireciona se não autenticado)

plugins/
└── auth.client.ts               # Inicializa auth listener no boot (client-side only)

scripts/
└── seedAdmin.ts                 # Seed interativo (inquirer) — cria Auth + Firestore user

pages/admin/                     # [IMPLEMENTADO — Fase 1]
├── login.vue                    # Login Firebase Auth (standalone, layout: false)
├── index.vue                    # Dashboard admin (hub + status + permissões)
└── edit/
    └── homeEdit.vue             # Editor da home (todas as seções)
```

**Total atual: ~23 arquivos** (Just Prime: ~30+ arquivos para a mesma funcionalidade)

---

## 3. Modelo de Dados (Firestore)

### Estrutura no Firebase:

```
/pages
  /home
    content:
      hero:
        badge: "MOVIMENTO NACIONAL DESDE 2020"
        title: "ELAS PO+DEM"
        subtitle: "..."
        btnDonate: "Doe Agora"
        btnHistory: "Nossa História"
        stats: [
          { icon: "luc-award", number: "2025", label: "Sede Própria" },
          { icon: "luc-megaphone", number: "5ª", label: "Conferência Nacional" },
          { icon: "luc-users", number: "MS", label: "Campo Grande" }
        ]

      mission:
        badge: "NOSSA MISSÃO"
        title: "Elas Podem Amar, Elas Podem Ser, Elas Podem TUDO!"
        text1: "..."
        text2: "..."
        btnText: "Conheça Nossa História"
        image: ""   # URL da imagem

      programs: [
        { title: "Comunicação", description: "...", icon: "luc-megaphone", color: "magenta", link: "Saiba Mais" },
        { title: "Educação", description: "...", icon: "luc-graduation-cap", color: "coral", link: "Saiba Mais" },
        { title: "Ação Social", description: "...", icon: "luc-users", color: "rosa", link: "Saiba Mais" },
        { title: "Participação Política", description: "...", icon: "luc-scale", color: "oliva", link: "Saiba Mais" }
      ]

      testimonials: [
        { quote: "...", name: "Elisa Dinelli", role: "Líder Comunitária", initials: "ED", image: "" },
        { quote: "...", name: "Ana Clara Santos", role: "Participante", initials: "AS", image: "" },
        { quote: "...", name: "Roberto Mendes", role: "Parceiro", initials: "RM", image: "" }
      ]

      supporters: [
        { name: "Apoiador 1", icon: "luc-building-2", color: "magenta", image: "", url: "" },
        { name: "Apoiador 2", icon: "luc-heart-handshake", color: "coral", image: "", url: "" }
      ]

      contact:
        badge: "CONTATO"
        title: "Vamos Conversar?"
        description: "..."
        methods: [
          { label: "Instagram", value: "@coletivoelaspodem", icon: "luc-instagram", color: "magenta", url: "" },
          { label: "Presidente", value: "Ladielly de Souza Silva", icon: "luc-user-check", color: "coral" },
          { label: "Sede", value: "Campo Grande - MS", icon: "luc-map-pin", color: "rosa" }
        ]
        formSubjects: ["Quero ser voluntária", "Quero doar", "Parcerias", "Dúvidas gerais"]

      cta:
        title: "Juntas Somos Mais Fortes"
        subtitle: "..."
        btnDonate: "Doar Agora"
        btnProjects: "Conhecer Projetos"

    seo:
      title: "Elas Podem - Coletivo de Mulheres"
      description: "..."
      keywords: ["elas podem", "mulheres", "empoderamento"]
      ogImage: ""
      og:
        type: "website"
        siteName: "Elas Podem"
        locale: "pt_BR"

    lastUpdated: timestamp
    updatedById: "abc123"          # ID do Firestore
    updatedByName: "Maria Silva"   # displayName do admin

/users
  /{userId}
    email: "maria@example.com"
    displayName: "Maria Silva"
    role: "superAdmin"              # superAdmin | admin | writer | moderator
    active: true
    lastLogin: Timestamp

/admin_logs
  /{timestamp}_{action}
    action: "page_sections_updated"
    details: { page: "home", sections: ["hero", "mission"], count: 2 }
    timestamp: "2025-01-15T10:30:00.000Z"
    user: "admin"
```

---

## 4. Types (`types/admin/`)

Os types são organizados em **4 camadas**, cada uma em seu arquivo:

### Camada 1: `sections.ts` — Dados como são no Firestore
```typescript
// Interfaces que espelham o formato exato dos dados no Firestore
export interface IHeroStat { icon: string; number: string; label: string }
export interface IHeroSection { badge, title, subtitle, btnDonate, btnHistory, stats: IHeroStat[] }
export interface IMissionSection { badge, title, text1, text2, btnText, image }
export interface IProgram { title, description, icon, color, link }
export interface ITestimonial { quote, name, role, initials, image }
export interface ISupporter { name, icon, color, image, url }
export interface IContactMethod { label, value, icon, color, url? }
export interface IContactSection { badge, title, description, methods: IContactMethod[], formSubjects: string[] }
export interface ICtaSection { title, subtitle, btnDonate, btnProjects }
export interface ISeoOg { type, siteName, locale }
export interface ISeo { title, description, keywords: string[], ogImage, og: ISeoOg }

export interface IHomePageData {
  content: { hero, mission, programs[], testimonials[], supporters[], contact, cta }
  seo: ISeo
  lastUpdated: string
  updatedById: string       # ID do Firestore
  updatedByName: string     # displayName do admin
}
```

### Camada 2: `editable.ts` — Separação editable/readonly
```typescript
// Cada seção tem seu par editable/readonly (quando aplicável)
export interface IHeroEditable { badge, title, subtitle, btnDonate, btnHistory, stats: IHeroStat[] }
export interface IProgramEditable { title, description, icon, link }
export interface IProgramReadonly { color }
export interface ISeoEditable { title, description, keywords[], ogImage }
export interface ISeoReadonly { og: ISeoOg }
// ... etc. Gerados de acordo com SECTION_FIELDS (fonte de verdade)
```

### Camada 3: `formsData.ts` — Container para o editor
```typescript
export interface IHomeFormsData {
  hero: { editable: IHeroEditable }
  mission: { editable: IMissionEditable }
  programs: { editable: IProgramEditable[]; readonly: IProgramReadonly[] }
  testimonials: { editable: ITestimonialEditable[] }
  supporters: { editable: ISupporterEditable[]; readonly: ISupporterReadonly[] }
  contact: { editable: IContactEditable; readonly: IContactReadonly }
  cta: { editable: ICtaEditable }
  seo: { editable: ISeoEditable; readonly: ISeoReadonly }
}
```

### Camada 4: `editor.ts` — Types do orquestrador
```typescript
export interface SaveResult {
  success: boolean; message: string; savedSections: string[]; error?: Error
}
export interface ValidationResult { isValid: boolean; errors: string[] }
export interface IAdminLog { action, details, timestamp, user }
```

---

## 5. Definitions (`definitions/`)

### `sectionFields.ts` — Fonte de verdade editable/readonly/hidden
```typescript
// Define quais campos de cada seção são editable, readonly ou hidden.
// Usado para gerar types editable/readonly e guiar os FormUtils.
export const SECTION_FIELDS = {
  hero: { editable: ['badge', 'title', 'subtitle', 'btnDonate', 'btnHistory', 'stats'] },
  programs: { editable: ['title', 'description', 'icon', 'link'], readonly: ['color'] },
  seo: { editable: ['title', 'description', 'keywords', 'ogImage'], readonly: ['og'] },
  // ... etc
}
```

### `validationConfigs.ts` — Regras de validação por seção
```typescript
export const HERO_CONFIG = {
  validationRules: {
    badge:      { required: true, minLength: 3, maxLength: 60 },
    title:      { required: true, minLength: 3, maxLength: 30 },
    subtitle:   { required: true, minLength: 10, maxLength: 300 },
    btnDonate:  { required: true, minLength: 2, maxLength: 30 },
    btnHistory: { required: true, minLength: 2, maxLength: 30 },
  },
  stats: { min: 1, max: 6 },
}
// ... MISSION_CONFIG, PROGRAMS_CONFIG, TESTIMONIALS_CONFIG,
//     SUPPORTERS_CONFIG, CONTACT_CONFIG, CTA_CONFIG, SEO_CONFIG,
//     COMPRESSION_SETTINGS
```

### `firestoreCollections.ts` — Collections centralizadas (zero hardcoded)
```typescript
export const FIRESTORE_COLLECTIONS = {
  PAGES: 'pages',
  USERS: 'users',
  ADMIN_LOGS: 'admin_logs',
} as const satisfies Record<string, string>;

export const PAGE_DOCUMENTS = {
  HOME: 'home',
} as const satisfies Record<string, string>;
// Novas páginas: adicionar aqui (ABOUT: 'about', CONTACT: 'contact'...)
```

### `adminRoles.ts` — Sistema multi-role
```typescript
export const ADMIN_ROLES = { SUPER_ADMIN: 'superAdmin', ADMIN: 'admin', WRITER: 'writer', MODERATOR: 'moderator' } as const;
export const ADMIN_ROLE_PERMISSIONS = {
  admin: { canEdit: true, canPublish: true, canManageUsers: true, canViewLogs: true },
  writer: { canEdit: true, canPublish: false, canManageUsers: false, canViewLogs: false },
  moderator: { canEdit: false, canPublish: true, canManageUsers: false, canViewLogs: true },
}
export function isValidRole(role: string): role is AdminRole
export function getRolePermissions(role: AdminRole): RolePermissions
```

### `themeOptions.ts` — Cores e ícones
```typescript
export const THEME_COLOR_OPTIONS = [
  { value: 'magenta', label: 'Magenta' },
  { value: 'coral', label: 'Coral' },
  // ...
]
export const ICON_OPTIONS = [
  { value: 'luc-award', label: 'Prêmio' },
  // ...
]
```

### `validationRules.ts` — Funções de validação para UI
```typescript
export function createValidationRules(rules: { required?, minLength?, maxLength? }): Array<(v: any) => string | boolean>
export function isValidUrl(url: string): boolean
```

### `cacheKeys.ts` — Chaves lógicas do cache [IMPLEMENTADO]
```typescript
// Chaves centralizadas para useCache. Novas chaves = adicionar aqui.
export const CACHE_KEYS = {
  USER_DATA: 'userData',
  // futuro: PAGE_HOME: 'pageHome', etc.
} as const;
export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
```

---

## 6. Composables

### `useFirebase.ts` — Singleton Firebase [IMPLEMENTADO]
```typescript
// Inicializa Firebase App, Firestore, Auth, Storage como singleton.
// Config via useConfig() (runtimeConfig do .env).
export function useFirebase() {
  return { $app, $db, $auth, $storage }
}
```

### `useAuth.ts` — Autenticação multi-role [IMPLEMENTADO]
```typescript
// Singleton com Firebase Auth + Firestore users (multi-role).
// Login, logout, auth state listener, permissões por role.
export function useAuth() {
  return {
    // Estado (refs do reactive singleton)
    ...toRefs(state),  // user, userData, isLoading, error

    // Computed
    isAuthenticated, isSuperAdmin, isAdmin, isWriter, isModerator,
    userRole, permissions,

    // Actions
    signIn(email, password): Promise<IAuthResult>,
    signOut(): Promise<IAuthResult>,
    refreshUserData(): Promise<void>,
    hasAdminAccess(): boolean,
    initAuthStateListener(),  // chamado pelo plugin auth.client.ts
  }
}
```

### `useCache.ts` — Cache 2 níveis [IMPLEMENTADO]
```typescript
// Cache lean com 2 níveis: RAM (~0ms) → localStorage (~2ms).
// Singleton sem Pinia/Vue — plain object pra RAM, LocalStorage.ts pra disco.
// Prefixo automático: ep_cache: (via APP_CONSTANTS.app.localStoragePrefix).
// Usado pelo useAuth pra restaurar userData instantaneamente no boot.
export function useCache() {
  return {
    get<T>(key): T | null,          // RAM → localStorage → null
    set<T>(key, data): void,        // grava nos 2 níveis
    getOrFetch<T>(key, fetchFn): Promise<T>,  // cache-first, fetch se miss
    remove(key): void,              // remove dos 2 níveis
    clearAll(): void,               // limpa tudo com prefixo ep_cache:*
    has(key): boolean,              // checa existência
  }
}
```

### `usePageData.ts` — Factory base [IMPLEMENTADO]
```typescript
// Factory genérica que gera composables singleton por página.
// Cada composable carrega do Firestore, transforma via separate/combine,
// e expõe load/save/reset com audit trail.

export interface IPageDataConfig<TPageData, TFormsData> {
  collection: string;       // ex: 'pages' (via FIRESTORE_COLLECTIONS.PAGES)
  document: string;         // ex: 'home' (via PAGE_DOCUMENTS.HOME)
  pageName: string;         // ex: 'home' (pra logs)
  separateAll: (data: TPageData) => TFormsData;
  createDefaults: () => TFormsData;
  combineSections: { [K in keyof TFormsData]: (forms: TFormsData) => Record<string, unknown> };
  // ^ mapped type — TypeScript EXIGE que TODAS as seções estejam presentes
}

export function createPageDataComposable<TPageData, TFormsData>(config) {
  // Closure cria singleton isolado por página
  let _state = null;

  return function() {
    // Composable retornado
    return {
      ...toRefs(state),  // forms, originalData, isLoading, isSaving, error
      isLoaded,
      loadPageData(),     // Firestore → separateAll → forms
      saveSection(name),  // combineSection → updateDoc (dot notation) → reload
      saveAll(),          // combina TODAS as seções → updateDoc atômico → reload
      resetSection(name), // volta pro originalData (ou defaults)
      resetAll(),
    }
  }
}
```

### `useHomePageData.ts` — Home específico [IMPLEMENTADO]
```typescript
// Uma chamada à factory com config específica da home.
// Usa FIRESTORE_COLLECTIONS e PAGE_DOCUMENTS (zero hardcoded).
export const useHomePageData = createPageDataComposable<IHomePageData, IHomeFormsData>({
  collection: FIRESTORE_COLLECTIONS.PAGES,
  document: PAGE_DOCUMENTS.HOME,
  pageName: 'home',
  separateAll: separateAllSections,          // HomeFormUtils
  createDefaults: createDefaultHomeForms,    // HomeFormUtils
  combineSections: {
    hero: (forms) => ({ 'content.hero': combineHeroData(forms.hero.editable) }),
    mission: (forms) => ({ 'content.mission': combineMissionData(forms.mission.editable) }),
    // ... todas as 8 seções mapeadas
  },
});
```

### `useValidation.ts` — Validadores config-driven [IMPLEMENTADO]
```typescript
// Genérico — lê regras dos *_CONFIG em runtime.
// Adicionar campo no config = validação automática (sem listar campos manualmente).
export function useValidation() {
  return {
    // Genéricos (reutilizáveis para qualquer página)
    validateFields(data, validationRules, sectionLabel): ValidationResult,
    validateItemCount(items, rules, label): string[],
    validateArrayItems(items, validationRules, sectionLabel): string[],

    // Específicos da home (wrappers finos que passam o config certo)
    validateHero(data): ValidationResult,
    validateMission(data): ValidationResult,
    validatePrograms(items): ValidationResult,
    validateTestimonials(items): ValidationResult,
    validateSupporters(items): ValidationResult,
    validateContact(data): ValidationResult,
    validateCta(data): ValidationResult,
    validateSeo(data): ValidationResult,
  }
}
```

### `useImageCompression.ts` — Compressão de imagens [IMPLEMENTADO]
```typescript
// Comprime imagens via Canvas API (client-side).
// Responsabilidade única: compressão. Não sabe de Firebase.
// Fallback seguro: se falhar, retorna o arquivo original.
export function useImageCompression() {
  return {
    compressImage(file, options?): Promise<File>,  // redimensiona + ajusta qualidade JPEG
    isCompressionSupported(): boolean,             // checa Canvas API
  }
}
```

### `useFirebaseStorage.ts` — Upload e gerenciamento de arquivos [IMPLEMENTADO]
```typescript
// Upload genérico, upload com compressão por categoria,
// delete com silent fail, e validação de imagens.
// Limites vêm de IMAGE_UPLOAD_CONFIG (definitions/validationConfigs.ts).
// Compressão delegada ao useImageCompression.
export function useFirebaseStorage() {
  return {
    validateImageFile(file, maxSizeMB?): IFileValidation,  // tipo + tamanho + extensão
    uploadFile(file, path): Promise<string>,               // upload genérico
    uploadImage(file, category, customPath?): Promise<string>,  // comprime + upload
    deleteFile(url): Promise<void>,                        // silent fail
  }
}
```

### `usePageEditor.ts` — Orquestrador do editor [IMPLEMENTADO]
```typescript
// Change tracking, image cleanup, navigation guard.
// NÃO faz save (save está no usePageData factory).
// Usa useFirebaseStorage.deleteFile() para cleanup.
export function usePageEditor() {
  return {
    hasChanges: Readonly<Ref<boolean>>,   // flag de mudanças
    markAsChanged(),                       // seta hasChanges = true
    resetChanges(),                        // seta hasChanges = false (após save)
    cleanupOldImage(oldUrl, newUrl): Promise<void>,        // deleta imagem antiga
    cleanupTempUploads(tempUploadedImages): Promise<void>, // limpa uploads não salvos
    canExit(tempUploadedImages): Promise<boolean>,         // guard com confirm
  }
}
```

---

## 7. Utils

### `HomeFormUtils.ts` — Separação/Combinação de dados [IMPLEMENTADO]
```typescript
// Pattern: Firebase (flat) → separate*Data() → { editable, readonly }
//          { editable, readonly } → combine*Data() → Firebase (flat)
//          createDefault*() → valores iniciais para formulários vazios

// Por seção: separateHeroData, combineHeroData, createDefaultHeroEditable, ...
// Agregadores: separateAllSections(pageData), createDefaultHomeForms()
```

### `Logger.ts` — Logger estruturado [IMPLEMENTADO]
```typescript
// Logger com child() e levels (padrão Mnesis).
// Cada composable cria child com contexto: Logger.child({ composable: 'useAuth' })
export class Logger {
  static child(context): Logger
  info(msg, meta?), warn(msg, meta?), error(msg, error?, meta?), debug(msg, meta?)
}
```

### `LocalStorage.ts` — Wrapper Safari-safe [IMPLEMENTADO]
```typescript
// Wrapper robusto para localStorage com fallback in-memory (Map).
// Trata: Safari Private Mode, QuotaExceededError, SSR (sem window).
// API tipada: getObj<T>/setObj<T> para objetos, getString/setString para primitivos.
// Usado internamente pelo useCache — consumidores não chamam direto.
export class LocalStorage {
  static getString(key): string | null
  static setString(key, value): void
  static getObj<T>(key): T | null
  static setObj<T>(key, value): void
  static removeItem(key): void
  static getAllKeysWithPrefix(prefix): string[]
}
```

---

## 8. Infra auxiliar

### `middleware/admin.global.ts` [IMPLEMENTADO]
```typescript
// Proteção global de todas as rotas /admin/*.
// Redireciona para /admin/login se não autenticado.
// Escapa /admin/login (não protege a própria tela de login).
```

### `plugins/auth.client.ts` [IMPLEMENTADO]
```typescript
// Nuxt plugin (client-side only).
// Chama initAuthStateListener() do useAuth no boot da aplicação.
```

### `config/constants.ts` [IMPLEMENTADO]
```typescript
// ALIAS_DEFINITIONS — fonte única de path aliases (@composables, @definitions, etc.)
// getAliases(baseUrl) — converte para formato Nuxt/Vite
// APP_CONSTANTS — constantes da app (nome, versão, features flags)
```

---

## 9. Fluxo de Dados Completo

### No Editor (Admin):
```
┌─ Firebase ────────────────────────────────────────────────────────────────┐
│  loadPageData() → getDoc('pages/home') → IHomePageData (flat)            │
└──────────────────────────────────────────┬────────────────────────────────┘
                                           ↓
┌─ HomeFormUtils ──────────────────────────────────────────────────────────┐
│  separateAllSections(pageData) → IHomeFormsData                         │
│    hero:         { editable: IHeroEditable }                            │
│    programs:     { editable: IProgramEditable[], readonly: [...] }      │
│    contact:      { editable: IContactEditable, readonly: IContactRO }   │
│    seo:          { editable: ISeoEditable, readonly: ISeoReadonly }     │
└──────────────────────────────────────────┬────────────────────────────────┘
                                           ↓
┌─ Editor UI ──────────────────────────────────────────────────────────────┐
│  Admin edita APENAS os campos editable                                  │
│  Readonly é preservado mas não mostrado (ou mostrado como read-only)    │
└──────────────────────────────────────────┬────────────────────────────────┘
                                           ↓
┌─ Save Flow (useHomePageData.saveSection / saveAll) ──────────────────────┐
│  1. combine*Data(editable, readonly) → Firestore update data            │
│  2. updateDoc com dot notation ('content.hero': {...})                  │
│  3. Audit trail: updatedById + updatedByName + lastUpdated              │
│  4. Reload automático (loadPageData)                                    │
│  5. cleanupOldImage() se imagem mudou [via usePageEditor]               │
└──────────────────────────────────────────────────────────────────────────┘
```

### No Site (Público):
```
Firebase Firestore → loadPageData() → separateAllSections() → Template
                                              ↓
                                     Fallback: createDefaultHomeForms() se vazio
```

### Upload de Imagens:
```
┌─ Upload Flow ────────────────────────────────────────────────────────────┐
│  1. User seleciona arquivo                                              │
│  2. validateImageFile(file, 5) → { isValid, error }                     │
│  3. uploadImage(file, 'mission') → comprime + upload → URL              │
│  4. URL salva em tempUploadedImages[] (tracking)                        │
│  5. URL atribuída ao form.value.image                                   │
│                                                                          │
│  On Save:                                                                │
│    cleanupOldImage(oldUrl, newUrl) → deleta antiga se mudou             │
│    remove de tempUploadedImages[]                                        │
│                                                                          │
│  On Cancel/Exit:                                                         │
│    cleanupTempUploads() → deleta TODAS as imagens temporárias           │
│    (evita lixo no Storage)                                              │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Admin Pages

### Login (`pages/admin/login.vue`) [IMPLEMENTADO]
```
Tela standalone (layout: false) com identidade visual do tema.
Fundo var(--bg-hero), card com glassmorphism, logo, email/senha.
Usa useAuth().signIn() e redireciona para /admin no sucesso.
Toggle de senha, erro inline (coral), loading state no botão.
onMounted: se já logado, redireciona direto.
```

### Dashboard (`pages/admin/index.vue`) [IMPLEMENTADO]
```
Hub de navegação com status real do Firestore.
Welcome com displayName + badge da role.
Card "Home Page" com lastUpdated e updatedByName (do originalData).
Permissões por role: canEdit → botão "Editar", canViewLogs → seção audit.
Audit log: placeholder visual (Fase 2 — sem ações logadas ainda).
Logout no header.

TODO Fase 2: audit log real (admin_logs), cards de páginas adicionais,
layouts/admin.vue com sidebar.
```

### Home Editor (`pages/admin/edit/homeEdit.vue`) [PENDENTE — Fase 2]

**Layout:** Accordion/Tabs com cada seção expandível

```
┌─────────────────────────────────────────────┐
│  Editor - Página Home                        │
│                                              │
│  ▼ Hero Section                              │
│    [badge] [title] [subtitle]                │
│    [btnDonate] [btnHistory]                  │
│    Stats: [+Novo] [edit] [delete]            │
│    Validation: ✓ título (3-30 chars)         │
│                                              │
│  ▶ Missão (click to expand)                  │
│  ▶ Programas                                 │
│  ▼ Depoimentos                               │
│    [+Novo] Lista com drag/drop               │
│    Card: [quote] [name] [role] [image upload]│
│                                              │
│  ▼ Apoiadores                                │
│    [+Novo] Lista com drag/drop               │
│    Card: [name] [icon] [image upload] [url]  │
│                                              │
│  ▶ Contato                                   │
│  ▶ CTA                                       │
│  ▼ SEO                                       │
│    [title] counter: 45/60                    │
│    [description] counter: 120/160            │
│    [keywords] chips                          │
│    [ogImage upload]                          │
│                                              │
│  [Salvar Tudo]  [Descartar]                  │
│  unsaved changes warning ⚠                   │
└─────────────────────────────────────────────┘
```

**Funcionalidades do editor:**
- Cada seção usa `useHomePageData().saveSection('hero')` direto
- Validação com `useValidation().validateHero(data)` antes do save
- Change tracking (hasChanges) com confirmação ao sair
- Upload de imagens com compressão automática
- Cleanup de imagens temporárias no cancel
- CRUD (add/edit/delete) para arrays (stats, programs, testimonials, supporters, methods)
- Usa CBInput, CBTextarea, CBSelect, CBCard, CBButton do cbcomponents

---

## 11. Sobre o i18n

### Manter i18n para:
- Labels de UI fixos (botões "Enviar", "Voltar", etc)
- Placeholders de formulário
- Navegação (navbar)

### Migrar para Firebase:
- Todo conteúdo editável (textos, descrições, quotes)
- Dados dinâmicos (testimonials, supporters, programs)
- SEO data

### Estratégia:
- Fase 1: Admin salva no Firebase, site lê do Firebase
- Fase 2: Remover chaves i18n que migraram
- Fase 3: i18n só para UI/multi-idioma (se necessário)

---

## 12. Firebase Setup

### .env
```
NUXT_PUBLIC_FIREBASE_API_KEY=...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NUXT_PUBLIC_FIREBASE_PROJECT_ID=...
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NUXT_PUBLIC_FIREBASE_APP_ID=...
```

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leitura pública (site)
    match /pages/{pageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Users — só admin autenticado
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    // Audit logs — só admin
    match /admin_logs/{logId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 13. Checklist de Implementação

### Fase 0: Setup Firebase
- [x] Criar projeto Firebase
- [x] Configurar Firestore
- [x] Configurar Storage
- [x] Configurar Authentication (Email/Password)
- [x] Criar usuário admin no Firestore (/users) — via `npm run seedAdmin` (script interativo)
- [x] Adicionar variáveis no .env
- [x] Instalar firebase SDK no projeto

### Fase 1: Infraestrutura
- [x] `types/admin/` — 4 camadas (sections, editable, formsData, editor)
- [x] `definitions/sectionFields.ts` — fonte de verdade editable/readonly
- [x] `definitions/validationConfigs.ts` — regras por seção + compression settings
- [x] `definitions/validationRules.ts` — createValidationRules + isValidUrl
- [x] `definitions/themeOptions.ts` — cores e ícones
- [x] `definitions/firestoreCollections.ts` — collections + documents centralizados
- [x] `definitions/adminRoles.ts` — sistema multi-role com permissões
- [x] `utils/HomeFormUtils.ts` — separate/combine/createDefault para cada seção
- [x] `utils/Logger.ts` — Logger estruturado com child()
- [x] `config/constants.ts` — ALIAS_DEFINITIONS + APP_CONSTANTS
- [x] `composables/useFirebase.ts` — init singleton
- [x] `composables/useAuth.ts` — login/logout/listener/multi-role
- [x] `composables/usePageData.ts` — factory base genérica
- [x] `composables/useHomePageData.ts` — composable home (gerado pela factory)
- [x] `composables/useValidation.ts` — 8 validadores config-driven
- [x] `composables/useImageCompression.ts` — compressão Canvas API (responsabilidade separada)
- [x] `composables/useFirebaseStorage.ts` — upload + delete + validação (lê IMAGE_UPLOAD_CONFIG)
- [x] `composables/usePageEditor.ts` — change tracking + image cleanup + navigation guard
- [x] `middleware/admin.global.ts` — proteção global de rotas /admin/* (renomeado de admin.ts)
- [x] `plugins/auth.client.ts` — init auth listener
- [x] `pages/admin/login.vue` — tela standalone com identidade visual, toggle senha, erro inline
- [x] `pages/admin/index.vue` — dashboard com status real, permissões por role, logout
- [x] `scripts/seedAdmin.ts` — seed interativo com @inquirer/prompts (cria Auth + Firestore user)
- [x] `utils/LocalStorage.ts` — wrapper Safari-safe com fallback in-memory
- [x] `definitions/cacheKeys.ts` — chaves lógicas centralizadas (CACHE_KEYS)
- [x] `composables/useCache.ts` — cache 2 níveis (RAM + localStorage), usado pelo useAuth

### Fase 2: Editor da Home
- [ ] `pages/admin/edit/homeEdit.vue` (editor com seções)
- [ ] Seção Hero (textos + stats CRUD + validação inline)
- [ ] Seção Missão (textos + image upload com compressão)
- [ ] Seção Programas (CRUD de cards + seletor de ícones)
- [ ] Seção Depoimentos (CRUD + image upload)
- [ ] Seção Apoiadores (CRUD + image upload + URL)
- [ ] Seção Contato (métodos CRUD + subjects CRUD)
- [ ] Seção CTA (textos)
- [ ] Seção SEO (meta tags + char counters + ogImage upload)
- [ ] Navigation guard (unsaved changes warning)
- [ ] Cleanup de imagens temporárias no cancel/exit

### Fase 3: Conectar Site ao Firebase
- [ ] Substituir i18n/hardcoded por dados do Firebase no index.vue
- [ ] Fallback para defaults quando Firebase offline/vazio
- [ ] Loading states com CBSkeleton
- [ ] Testar fluxo completo: admin edita → Firebase atualiza → site reflete

---

## 14. Decisões Arquiteturais

### Por que factory ao invés de herança?
O `usePageData` é uma **factory function** (não uma classe base). Cada chamada cria um composable singleton isolado via closure. Escolhido porque:
- É o padrão Vue idiomático (composables, não classes)
- Closure garante isolamento entre páginas sem `this`
- TypeScript genéricos (`<TPageData, TFormsData>`) dão type-safety completa
- Para nova página: `createPageDataComposable<IAboutPageData, IAboutFormsData>({...})`

### Por que não useFirestoreAdmin separado?
No Just Prime, o save fica em composable separado. Aqui o save está DENTRO do factory (`saveSection`, `saveAll`). Motivo:
- Menos indireção — o composable que carrega os dados também salva
- Dot notation é gerada pelo `combineSections` config — não precisa wrapper
- Audit trail (updatedById + updatedByName) é adicionado automaticamente

### Por que cache 2 níveis (e não Pinia)?
O `useCache` usa plain object (RAM) + `LocalStorage` (disco). Sem Pinia porque:
- Nenhum componente Vue lê diretamente do cache — quem consome é o `useAuth`, que tem seu próprio `reactive()` state
- Pinia adicionaria overhead desnecessário (devtools, plugins, reactive proxy)
- Plain object `{}` é ~0ms de acesso, perfeito pra cache intermediário
- O cache é infraestrutura interna, não estado de UI

### Por que SECTION_FIELDS?
Fonte única de verdade para editable/readonly. Garante que:
- `types/admin/editable.ts` corresponde exatamente ao config
- `HomeFormUtils.ts` separate/combine respeita a classificação
- Adicionar campo = 1 lugar (SECTION_FIELDS) e propagação automática

---

## 15. Escalabilidade Futura

Quando precisar crescer:
1. **Nova página** → novo `*FormUtils.ts` + nova config em `createPageDataComposable()` + novo `PAGE_DOCUMENTS.ABOUT`
2. **Nova seção** → nova interface em types + campo no SECTION_FIELDS + validador + combine/separate
3. **Novo idioma** → duplicar documento com prefixo (`home_en`, `home_es`)
4. **Blog** → nova collection no Firestore + CRUD page
5. **Projetos** → mesma coisa, collection própria
6. **Novo role** → adicionar em `ADMIN_ROLES` + definir permissões em `ADMIN_ROLE_PERMISSIONS`

O padrão aguenta porque:
- Cada seção é independente
- A factory gera composables completos para qualquer página
- Validação é config-driven (não precisa código novo)
- Collections e documents são centralizados

---

**Status:** Fase 1 concluída (100%)
**Próximos passos:** Fase 2 — pages/admin/edit/homeEdit.vue (editor das 8 seções da home)
