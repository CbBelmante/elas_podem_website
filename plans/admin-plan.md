# Plano do Admin - Elas Podem

**Objetivo:** Criar admin completo, escalável e funcional baseado no padrão Just Prime
**Princípio:** Simplificar a organização, NÃO a funcionalidade. Menos arquivos, mesma qualidade.

---

## 1. Arquitetura: O que muda vs Just Prime

### Mantemos TUDO do Just Prime:
- Section-based editing (cada seção é independente)
- `usePageEditor` como orquestrador central (PageSectionConfig, SaveResult, change tracking)
- `useValidation` com padrão `{ isValid, errors[] }` por seção
- `useFirestoreAdmin` com `savePageSection()` genérico + wrappers + audit logging
- `useFirebaseStorage` com upload, compressão, validação, cleanup de imagens
- Separação editable/readonly nos dados (combine/separate pattern)
- FormUtils com `createDefault*()`, `separate*Data()`, `combine*Data()`
- AdminConfig com cores do tema, validation rules, defaults
- Firebase Firestore + Auth + Storage
- Middleware de autenticação
- Type safety em tudo

### O que simplificamos na ORGANIZAÇÃO:
- Just Prime: 6 FormUtils (1600+ linhas cada) → Nós: 1 FormUtils (home tem 8 seções simples)
- Just Prime: 8+ páginas editáveis → Nós: 1 página (home) - escalável para mais
- Just Prime: types espalhados → Nós: 1 arquivo de types (por enquanto)
- Just Prime: AdminConfigUtils 400+ linhas → Nós: AdminConfig enxuto (sem cores Material Design, sem 6 efeitos hover)
- Hidden data (og, twitter) → SEO only, inline (não precisa de layer separado)

**Resumo: mesmos padrões, menos arquivos, mesma funcionalidade.**

---

## 2. Estrutura de Pastas

```
composables/
├── useFirebase.ts               # Firebase init (app, db, auth, storage)
├── useAuth.ts                   # Autenticação (signIn, signOut, onAuthStateChanged)
├── usePageEditor.ts             # Orquestrador (PageSectionConfig, saveAllSections, change tracking)
├── usePageData.ts               # Leitura de dados (get/watch do Firestore)
├── useFirestoreAdmin.ts         # Escrita no Firestore (savePageSection + wrappers + audit log)
├── useValidation.ts             # Validadores por seção ({ isValid, errors[] })
└── useFirebaseStorage.ts        # Upload, compressão, delete, validação de imagens

types/
└── admin.ts                     # TODOS os types (sections, editable/readonly, forms, page)

utils/
├── HomeFormUtils.ts             # separate/combine/createDefault para cada seção da home
└── AdminConfig.ts               # Cores do tema, validation rules, compression settings, defaults

middleware/
└── admin.ts                     # Proteção de rotas admin

pages/admin/
├── index.vue                    # Dashboard
├── login.vue                    # Login Firebase Auth
└── edit/
    └── homeEdit.vue             # Editor da home (todas as seções)
```

**Total: ~12 arquivos** (Just Prime: ~30+ arquivos para a mesma funcionalidade)

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
    updatedBy: "admin"

/admin_logs
  /{timestamp}_{action}
    action: "page_sections_updated"
    details: { page: "home", sections: ["hero", "mission"], count: 2 }
    timestamp: "2025-01-15T10:30:00.000Z"
    user: "admin"
```

---

## 4. Types (types/admin.ts)

```typescript
// ============================================================
// SECTION DATA — Dados como são no Firebase (flat/complete)
// ============================================================

// ---- Hero ----
export interface IHeroStat {
  icon: string
  number: string
  label: string
}

export interface IHeroSection {
  badge: string
  title: string
  subtitle: string
  btnDonate: string
  btnHistory: string
  stats: IHeroStat[]
}

// ---- Mission ----
export interface IMissionSection {
  badge: string
  title: string
  text1: string
  text2: string
  btnText: string
  image: string
}

// ---- Programs ----
export interface IProgram {
  title: string
  description: string
  icon: string
  color: string       // magenta, coral, rosa, oliva, laranja
  link: string
}

// ---- Testimonials ----
export interface ITestimonial {
  quote: string
  name: string
  role: string
  initials: string
  image: string
}

// ---- Supporters ----
export interface ISupporter {
  name: string
  icon: string
  color: string
  image: string
  url: string
}

// ---- Contact ----
export interface IContactMethod {
  label: string
  value: string
  icon: string
  color: string
  url?: string
}

export interface IContactSection {
  badge: string
  title: string
  description: string
  methods: IContactMethod[]
  formSubjects: string[]
}

// ---- CTA ----
export interface ICtaSection {
  title: string
  subtitle: string
  btnDonate: string
  btnProjects: string
}

// ---- SEO ----
export interface ISeoOg {
  type: string
  siteName: string
  locale: string
}

export interface ISeo {
  title: string
  description: string
  keywords: string[]
  ogImage: string
  og: ISeoOg
}

// ============================================================
// EDITABLE / READONLY SPLIT — Para o admin separar o que edita
// ============================================================

// ---- Hero ----
export interface IHeroEditable {
  badge: string
  title: string
  subtitle: string
  btnDonate: string
  btnHistory: string
  stats: IHeroStat[]
}
// Hero não tem readonly (tudo é editável)

// ---- Mission ----
export interface IMissionEditable {
  badge: string
  title: string
  text1: string
  text2: string
  btnText: string
  image: string
}

// ---- Programs ----
export interface IProgramEditable {
  title: string
  description: string
  icon: string
  link: string
}

export interface IProgramReadonly {
  color: string       // cor vem do tema, admin não muda
}

// ---- Testimonials ----
export interface ITestimonialEditable {
  quote: string
  name: string
  role: string
  initials: string
  image: string
}

// ---- Supporters ----
export interface ISupporterEditable {
  name: string
  icon: string
  image: string
  url: string
}

export interface ISupporterReadonly {
  color: string
}

// ---- Contact ----
export interface IContactMethodEditable {
  label: string
  value: string
  icon: string
  url?: string
}

export interface IContactMethodReadonly {
  color: string
}

export interface IContactEditable {
  badge: string
  title: string
  description: string
  methods: IContactMethodEditable[]
  formSubjects: string[]
}

export interface IContactReadonly {
  methods: IContactMethodReadonly[]
}

// ---- CTA ----
export interface ICtaEditable {
  title: string
  subtitle: string
  btnDonate: string
  btnProjects: string
}

// ---- SEO ----
export interface ISeoEditable {
  title: string
  description: string
  keywords: string[]
  ogImage: string
}

export interface ISeoReadonly {
  og: ISeoOg  // og config não muda pelo admin
}

// ============================================================
// FORMS DATA — Container para o editor (editable + readonly)
// ============================================================

export interface IHomeFormsData {
  hero: {
    editable: IHeroEditable
  }
  mission: {
    editable: IMissionEditable
  }
  programs: {
    editable: IProgramEditable[]
    readonly: IProgramReadonly[]
  }
  testimonials: {
    editable: ITestimonialEditable[]
  }
  supporters: {
    editable: ISupporterEditable[]
    readonly: ISupporterReadonly[]
  }
  contact: {
    editable: IContactEditable
    readonly: IContactReadonly
  }
  cta: {
    editable: ICtaEditable
  }
  seo: {
    editable: ISeoEditable
    readonly: ISeoReadonly
  }
}

// ============================================================
// PAGE COMPLETA — Como fica no Firestore
// ============================================================

export interface IHomePageData {
  content: {
    hero: IHeroSection
    mission: IMissionSection
    programs: IProgram[]
    testimonials: ITestimonial[]
    supporters: ISupporter[]
    contact: IContactSection
    cta: ICtaSection
  }
  seo: ISeo
  lastUpdated: string
  updatedBy: string
}

// ============================================================
// PAGE EDITOR — Types do orquestrador
// ============================================================

export interface PageSectionConfig {
  name: string                                                    // "Hero Section"
  form: Ref<any>                                                  // Vue ref ao form state
  originalData: () => any                                         // getter dos dados originais do Firebase
  validator: (data: any) => { isValid: boolean; errors: string[] }
  saveFunction: (data: any) => Promise<void>
  getImageUrls: () => { old?: string; new?: string }              // para cleanup de imagens
  updateLocalData: (data: any) => void                            // atualiza estado local após save
}

export interface PageEditorConfig {
  pageName: string                    // "home"
  sections: PageSectionConfig[]
  pageData: Ref<any>
  tempUploadedImages: Ref<string[]>   // tracks uploads temporários para cleanup no cancel
}

export interface SaveResult {
  success: boolean
  message: string
  savedSections: string[]
  error?: Error
}

// ============================================================
// VALIDATION
// ============================================================

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// ============================================================
// ADMIN LOG
// ============================================================

export interface IAdminLog {
  action: string
  details: Record<string, any>
  timestamp: string
  user: string
}
```

---

## 5. Utils

### HomeFormUtils.ts — Separação/Combinação de dados

```typescript
// ============ PATTERN ============
// Firebase (flat) → separate*Data() → { editable, readonly }
// { editable, readonly } → combine*Data() → Firebase (flat)
// createDefault*() → valores iniciais para formulários vazios

// ============ HERO ============
export function separateHeroData(data: IHeroSection): { editable: IHeroEditable }
export function combineHeroData(editable: IHeroEditable): IHeroSection
export function createDefaultHeroEditable(): IHeroEditable

// ============ MISSION ============
export function separateMissionData(data: IMissionSection): { editable: IMissionEditable }
export function combineMissionData(editable: IMissionEditable): IMissionSection
export function createDefaultMissionEditable(): IMissionEditable

// ============ PROGRAMS ============
export function separateProgramsData(data: IProgram[]): { editable: IProgramEditable[], readonly: IProgramReadonly[] }
export function combineProgramsData(editable: IProgramEditable[], readonly: IProgramReadonly[]): IProgram[]
export function createDefaultProgramEditable(): IProgramEditable
export function createNewProgram(): IProgram   // para o CRUD [+Novo]

// ============ TESTIMONIALS ============
export function separateTestimonialsData(data: ITestimonial[]): { editable: ITestimonialEditable[] }
export function combineTestimonialsData(editable: ITestimonialEditable[]): ITestimonial[]
export function createDefaultTestimonialEditable(): ITestimonialEditable
export function createNewTestimonial(): ITestimonial

// ============ SUPPORTERS ============
export function separateSupportersData(data: ISupporter[]): { editable: ISupporterEditable[], readonly: ISupporterReadonly[] }
export function combineSupportersData(editable: ISupporterEditable[], readonly: ISupporterReadonly[]): ISupporter[]
export function createDefaultSupporterEditable(): ISupporterEditable
export function createNewSupporter(): ISupporter

// ============ CONTACT ============
export function separateContactData(data: IContactSection): { editable: IContactEditable, readonly: IContactReadonly }
export function combineContactData(editable: IContactEditable, readonly: IContactReadonly): IContactSection
export function createDefaultContactEditable(): IContactEditable
export function createNewContactMethod(): IContactMethod

// ============ CTA ============
export function separateCtaData(data: ICtaSection): { editable: ICtaEditable }
export function combineCtaData(editable: ICtaEditable): ICtaSection
export function createDefaultCtaEditable(): ICtaEditable

// ============ SEO ============
export function separateSeoData(data: ISeo): { editable: ISeoEditable, readonly: ISeoReadonly }
export function combineSeoData(editable: ISeoEditable, readonly: ISeoReadonly): ISeo
export function createDefaultSeoEditable(): ISeoEditable

// ============ PAGE COMPLETA ============
export function createDefaultHomeForms(): IHomeFormsData   // deep clone de todos os defaults
export function separateAllSections(pageData: IHomePageData): IHomeFormsData
```

### AdminConfig.ts — Configuração centralizada

```typescript
// ============ CORES DO TEMA ============
// Cores disponíveis no site Elas Podem (para selects no admin)
export const THEME_COLOR_OPTIONS = [
  { value: 'magenta', label: 'Magenta' },
  { value: 'coral', label: 'Coral' },
  { value: 'rosa', label: 'Rosa' },
  { value: 'oliva', label: 'Oliva' },
  { value: 'laranja', label: 'Laranja' },
]

// ============ ÍCONES DISPONÍVEIS ============
export const ICON_OPTIONS = [
  { value: 'luc-award', label: 'Prêmio' },
  { value: 'luc-megaphone', label: 'Megafone' },
  { value: 'luc-users', label: 'Pessoas' },
  { value: 'luc-heart-handshake', label: 'Apoio' },
  { value: 'luc-graduation-cap', label: 'Educação' },
  { value: 'luc-scale', label: 'Justiça' },
  { value: 'luc-globe', label: 'Globo' },
  { value: 'luc-star', label: 'Estrela' },
  { value: 'luc-building-2', label: 'Prédio' },
  { value: 'luc-instagram', label: 'Instagram' },
  { value: 'luc-user-check', label: 'Usuário' },
  { value: 'luc-map-pin', label: 'Localização' },
  // extensível...
]

// ============ VALIDATION RULES POR SEÇÃO ============
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

export const MISSION_CONFIG = {
  validationRules: {
    badge:   { required: true, minLength: 3, maxLength: 60 },
    title:   { required: true, minLength: 5, maxLength: 100 },
    text1:   { required: true, minLength: 20, maxLength: 500 },
    text2:   { required: true, minLength: 20, maxLength: 500 },
    btnText: { required: true, minLength: 2, maxLength: 40 },
  },
}

export const PROGRAMS_CONFIG = {
  validationRules: {
    title:       { required: true, minLength: 3, maxLength: 40 },
    description: { required: true, minLength: 10, maxLength: 200 },
    link:        { required: true, minLength: 2, maxLength: 30 },
  },
  items: { min: 1, max: 8 },
}

export const TESTIMONIALS_CONFIG = {
  validationRules: {
    quote: { required: true, minLength: 20, maxLength: 500 },
    name:  { required: true, minLength: 2, maxLength: 60 },
    role:  { required: true, minLength: 2, maxLength: 60 },
  },
  items: { min: 1, max: 12 },
}

export const SUPPORTERS_CONFIG = {
  validationRules: {
    name: { required: true, minLength: 2, maxLength: 60 },
  },
  items: { min: 1, max: 20 },
}

export const CONTACT_CONFIG = {
  validationRules: {
    badge:       { required: true, minLength: 3, maxLength: 60 },
    title:       { required: true, minLength: 3, maxLength: 60 },
    description: { required: true, minLength: 10, maxLength: 300 },
  },
  methods: { min: 1, max: 8 },
  formSubjects: { min: 1, max: 10 },
}

export const CTA_CONFIG = {
  validationRules: {
    title:       { required: true, minLength: 5, maxLength: 80 },
    subtitle:    { required: true, minLength: 10, maxLength: 300 },
    btnDonate:   { required: true, minLength: 2, maxLength: 30 },
    btnProjects: { required: true, minLength: 2, maxLength: 30 },
  },
}

export const SEO_CONFIG = {
  validationRules: {
    title:       { required: true, minLength: 5, maxLength: 60 },
    description: { required: true, minLength: 10, maxLength: 160 },
  },
  keywords: { min: 1, max: 20 },
}

// ============ COMPRESSION SETTINGS ============
export const COMPRESSION_SETTINGS = {
  mission:    { enabled: true, quality: 0.8, maxWidth: 800, maxHeight: 600 },
  supporters: { enabled: true, quality: 0.8, maxWidth: 200, maxHeight: 200 },
  seo:        { enabled: true, quality: 0.9, maxWidth: 1200, maxHeight: 630 },
  testimonials: { enabled: true, quality: 0.8, maxWidth: 200, maxHeight: 200 },
}

// ============ UTILITY FUNCTIONS ============
export function createValidationRules(rules: {
  required?: boolean
  minLength?: number
  maxLength?: number
}): Array<(value: any) => string | boolean>
// Retorna array de funções para usar em :rules do CBInput
// Ex: [(v) => !!v || 'Campo obrigatório', (v) => v.length >= 5 || 'Mínimo 5 chars']

export function isValidUrl(url: string): boolean
// Valida URL com new URL() constructor
```

---

## 6. Composables

### useFirebase.ts
```typescript
// Inicializa Firebase App, Firestore, Auth, Storage
// Config via environment variables (.env)
// Exporta instâncias prontas

export function useFirebase() {
  return {
    $app: FirebaseApp,
    $db: Firestore,
    $auth: Auth,
    $storage: FirebaseStorage,
  }
}
```

### useAuth.ts
```typescript
export function useAuth() {
  return {
    // State
    currentUser: Ref<User | null>,
    isAuthenticated: ComputedRef<boolean>,

    // Actions
    signIn(email: string, password: string): Promise<void>,
    signOut(): Promise<void>,

    // Lifecycle
    initAuthListener(): void,  // onAuthStateChanged
  }
}
```

### usePageEditor.ts — Orquestrador Central (padrão Just Prime)
```typescript
// O coração do admin. Mesmo padrão do Just Prime.

export function createSectionConfig(
  name: string,
  form: Ref<any>,
  originalDataGetter: () => any,
  validator: (data: any) => ValidationResult,
  saveFunction: (data: any) => Promise<void>,
  imageUrlsGetter: () => { old?: string; new?: string },
  localDataUpdater: (data: any) => void,
): PageSectionConfig

export function createPageConfig(
  pageName: string,
  sections: PageSectionConfig[],
  pageData: Ref<any>,
  tempUploadedImages: Ref<string[]>,
): PageEditorConfig

export function usePageEditor() {
  return {
    // State
    isSaving: Ref<boolean>,
    hasChanges: Ref<boolean>,

    // Main operations
    saveAllSections(config: PageEditorConfig, showError: Function, showSuccess: Function): Promise<SaveResult>,
    // Fluxo:
    // 1. isSaving = true
    // 2. Para cada seção:
    //    a. Merge originalData() + form.value → sectionData
    //    b. Roda validator → se inválido, retorna com erro
    //    c. Coleta em sectionsToSave[]
    // 3. Para cada seção coletada:
    //    a. Chama saveFunction()
    //    b. cleanupOldImage() — deleta imagem antiga do Storage se URL mudou
    //    c. Remove de tempUploadedImages[]
    //    d. Chama updateLocalData() — sincroniza estado local
    // 4. logAdminAction('page_sections_updated', { page, sections, count })
    // 5. hasChanges = false
    // 6. finally: isSaving = false

    // Change tracking
    markAsChanged(): void,
    setHasChanges(value: boolean): void,

    // Navigation guard
    canExit(tempUploadedImages: Ref<string[]>): boolean,
    // Se hasChanges, mostra confirm(). Se confirmou sair, chama cleanupTempUploads()

    // Image lifecycle
    cleanupTempUploads(tempUploadedImages: Ref<string[]>): Promise<void>,
    // Deleta todas as imagens temporárias do Storage (cancelamento/saída)
    cleanupOldImage(oldUrl?: string, newUrl?: string, sectionName?: string): Promise<void>,
    // Se a URL mudou e a antiga é do Firebase, deleta a antiga (silent fail)
  }
}
```

### usePageData.ts
```typescript
export function usePageData() {
  return {
    // Busca dados do Firestore
    getPageData(pageId: string): Promise<IHomePageData>,

    // Realtime listener
    watchPageData(pageId: string): Ref<IHomePageData>,

    // Fallback para defaults quando Firebase offline/vazio
    // Usa createDefaultHomeForms() do HomeFormUtils
  }
}
```

### useFirestoreAdmin.ts — Escrita + Audit Log (padrão Just Prime)
```typescript
export function useFirestoreAdmin() {
  return {
    // ============ GENÉRICO ============
    savePageSection(
      collection: string,    // "pages"
      documentId: string,    // "home"
      fieldPath: string,     // "content.hero", "seo"
      sectionData: any,
      sectionName: string,   // para logging
    ): Promise<void>,
    // Internamente:
    // - updateDoc({ [fieldPath]: sectionData, lastUpdated: ISO, updatedBy: 'admin' })

    // ============ WRAPPERS POR SEÇÃO ============
    saveHomeHeroSection(data: IHeroSection): Promise<void>,
    // → savePageSection('pages', 'home', 'content.hero', data, 'Hero')
    saveHomeMissionSection(data: IMissionSection): Promise<void>,
    saveHomeProgramsSection(data: IProgram[]): Promise<void>,
    saveHomeTestimonialsSection(data: ITestimonial[]): Promise<void>,
    saveHomeSupportersSection(data: ISupporter[]): Promise<void>,
    saveHomeContactSection(data: IContactSection): Promise<void>,
    saveHomeCtaSection(data: ICtaSection): Promise<void>,
    saveHomeSeoSection(data: ISeo): Promise<void>,

    // ============ AUDIT LOG ============
    logAdminAction(action: string, details: Record<string, any>): Promise<void>,
    // Collection: admin_logs
    // Doc ID: `${Date.now()}_${action}`
    // Campos: { action, details, timestamp: ISO, user: 'admin' }
    // Silent fail — não quebra se logging falhar
  }
}
```

### useValidation.ts — Validadores por seção (padrão Just Prime)
```typescript
// Todos retornam { isValid: boolean, errors: string[] }

export function useValidation() {
  return {
    // ============ DISPATCHER GENÉRICO ============
    validateSection(
      name: string,             // "Hero Section"
      data: any,
      validator: Function,      // validador específico abaixo
      showError: Function,      // callback de UI (toast/alert)
    ): boolean,
    // Chama validator(data), se inválido mostra showError com errors.join(', ')

    // ============ VALIDADORES POR SEÇÃO ============
    validateHeroSection(data: IHeroEditable): ValidationResult,
    // - badge, title, subtitle, btnDonate, btnHistory required (usa HERO_CONFIG)
    // - stats: min 1, max 6; cada stat precisa de icon, number, label

    validateMissionSection(data: IMissionEditable): ValidationResult,
    // - badge, title, text1, text2, btnText required (usa MISSION_CONFIG)

    validateProgramsSection(data: IProgramEditable[]): ValidationResult,
    // - min 1, max 8 programs (usa PROGRAMS_CONFIG)
    // - cada program: title, description, icon, link required

    validateTestimonialsSection(data: ITestimonialEditable[]): ValidationResult,
    // - min 1, max 12 testimonials (usa TESTIMONIALS_CONFIG)
    // - cada item: quote (min 20), name, role required

    validateSupportersSection(data: ISupporterEditable[]): ValidationResult,
    // - min 1, max 20 supporters (usa SUPPORTERS_CONFIG)
    // - cada item: name required

    validateContactSection(data: IContactEditable): ValidationResult,
    // - badge, title, description required (usa CONTACT_CONFIG)
    // - methods: min 1, max 8; cada method: label, value, icon
    // - formSubjects: min 1, max 10

    validateCtaSection(data: ICtaEditable): ValidationResult,
    // - title, subtitle, btnDonate, btnProjects required (usa CTA_CONFIG)

    validateSeoSection(data: ISeoEditable): ValidationResult,
    // - title (max 60), description (max 160) required (usa SEO_CONFIG)
    // - keywords: min 1, max 20
    // - ogImage: isValidUrl() se preenchido

    // ============ HELPERS ============
    isValidUrl(url: string): boolean,
  }
}
```

### useFirebaseStorage.ts — Upload com compressão (padrão Just Prime)
```typescript
export function useFirebaseStorage() {
  return {
    // ============ UPLOAD GENÉRICO ============
    uploadFile(file: File, path: string): Promise<string>,
    // Faz upload para Firebase Storage, retorna download URL

    // ============ UPLOAD COM COMPRESSÃO ============
    uploadImage(
      file: File,
      category: keyof typeof COMPRESSION_SETTINGS,  // 'mission', 'supporters', 'seo', 'testimonials'
      customPath?: string,
    ): Promise<string>,
    // Fluxo:
    // 1. Valida tipo (image/*)
    // 2. Busca config em COMPRESSION_SETTINGS[category]
    // 3. Se compression.enabled:
    //    a. Comprime com canvas (quality, maxWidth, maxHeight)
    //    b. Fallback para original se compressão falhar
    // 4. Gera filename: `${category}-${Date.now()}[_compressed].{ext}`
    // 5. Path: `images/${category}/${fileName}`
    // 6. uploadFile() e retorna URL

    // ============ DELETE ============
    deleteFile(url: string): Promise<void>,
    // Extrai path da URL do Firebase (decodeURIComponent)
    // deleteObject(ref)
    // Silent fail

    // ============ VALIDAÇÃO ============
    validateImageFile(file: File, maxSizeMB?: number): { isValid: boolean; error?: string },
    // 1. Tipo deve começar com 'image/'
    // 2. Tamanho <= maxSizeMB * 1024 * 1024 (default: 5MB)
    // 3. Extensão deve ser jpg, jpeg, png, webp
  }
}
```

---

## 7. Fluxo de Dados Completo

### No Editor (Admin):
```
┌─ Firebase ────────────────────────────────────────────────────────────────┐
│  getPageData('home') → IHomePageData (flat)                              │
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
┌─ Save Flow (usePageEditor.saveAllSections) ──────────────────────────────┐
│  1. combine*Data(editable, readonly) → flat data                        │
│  2. validator(flatData) → { isValid, errors }                           │
│  3. saveFunction(flatData) → Firestore                                  │
│  4. cleanupOldImage() se imagem mudou                                   │
│  5. logAdminAction()                                                    │
│  6. updateLocalData()                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### No Site (Público):
```
Firebase Firestore → usePageData().watchPageData('home') → ref<IHomePageData> → Template
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

## 8. Admin Pages

### Dashboard (pages/admin/index.vue)
```
Layout simples com cards linkando para cada seção:
- [Home Page] → /admin/edit/homeEdit
- [Configurações] → /admin/settings (futuro)

Status: última atualização, quem editou
Audit log: últimas ações (lê de admin_logs)
```

### Home Editor (pages/admin/edit/homeEdit.vue)

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
- Cada seção registrada via `createSectionConfig()`
- Validação em tempo real com `createValidationRules()` do AdminConfig
- Validação final no save com `validateSection()` do useValidation
- Change tracking (hasChanges) com confirmação ao sair
- Upload de imagens com compressão automática
- Cleanup de imagens temporárias no cancel
- Audit logging de cada save
- CRUD (add/edit/delete) para arrays (stats, programs, testimonials, supporters, methods)
- Usa CBInput, CBTextarea, CBSelect, CBCard, CBButton do cbcomponents

### Como cada seção é registrada no editor:
```typescript
// No homeEdit.vue setup:
const { saveAllSections, hasChanges, markAsChanged, canExit, cleanupTempUploads } = usePageEditor()
const { saveHomeHeroSection, saveHomeMissionSection, ... } = useFirestoreAdmin()
const { validateHeroSection, validateMissionSection, ... } = useValidation()

const pageData = await getPageData('home')
const forms = ref(separateAllSections(pageData))
const tempUploadedImages = ref<string[]>([])

const sections: PageSectionConfig[] = [
  createSectionConfig(
    'Hero',
    computed(() => forms.value.hero.editable),
    () => pageData.content.hero,
    validateHeroSection,
    saveHomeHeroSection,
    () => ({}),  // hero não tem imagem
    (data) => { pageData.content.hero = data },
  ),
  createSectionConfig(
    'Missão',
    computed(() => forms.value.mission.editable),
    () => pageData.content.mission,
    validateMissionSection,
    saveHomeMissionSection,
    () => ({
      old: pageData.content.mission.image,
      new: forms.value.mission.editable.image,
    }),
    (data) => { pageData.content.mission = data },
  ),
  // ... demais seções
]

const pageConfig = createPageConfig('home', sections, ref(pageData), tempUploadedImages)

// Save
const handleSave = () => saveAllSections(pageConfig, showError, showSuccess)

// Navigation guard
onBeforeRouteLeave(() => canExit(tempUploadedImages))
```

---

## 9. Sobre o i18n

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

## 10. Firebase Setup

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

## 11. Checklist de Implementação

### Fase 0: Setup Firebase
- [ ] Criar projeto Firebase
- [ ] Configurar Firestore
- [ ] Configurar Storage
- [ ] Configurar Authentication (Email/Password)
- [ ] Criar usuário admin
- [ ] Adicionar variáveis no .env
- [ ] Instalar firebase SDK no projeto

### Fase 1: Infraestrutura
- [ ] types/admin.ts (interfaces completas: sections + editable/readonly + forms + editor + validation)
- [ ] utils/AdminConfig.ts (cores, ícones, validation rules, compression settings)
- [ ] utils/HomeFormUtils.ts (separate/combine/createDefault para cada seção)
- [ ] composables/useFirebase.ts (init)
- [ ] composables/useAuth.ts (login/logout/listener)
- [ ] composables/usePageData.ts (get/watch + fallback)
- [ ] composables/useValidation.ts (8 validadores + dispatcher)
- [ ] composables/useFirestoreAdmin.ts (savePageSection + 8 wrappers + audit log)
- [ ] composables/useFirebaseStorage.ts (upload + compressão + delete + validação)
- [ ] composables/usePageEditor.ts (orquestrador: saveAllSections + change tracking + image cleanup)
- [ ] middleware/admin.ts (proteção de rotas)
- [ ] pages/admin/login.vue
- [ ] pages/admin/index.vue (dashboard + audit log)

### Fase 2: Editor da Home
- [ ] pages/admin/edit/homeEdit.vue (registro de seções via createSectionConfig)
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
- [ ] Substituir i18n/hardcoded por usePageData().watchPageData() no index.vue
- [ ] Fallback para defaults quando Firebase offline/vazio
- [ ] Loading states com CBSkeleton
- [ ] Testar fluxo completo: admin edita → Firebase atualiza → site reflete

---

## 12. Dependências Novas

```json
{
  "dependencies": {
    "firebase": "^11.x"
  }
}
```

---

## 13. Resumo: Just Prime vs Elas Podem

| Aspecto | Just Prime | Elas Podem |
|---------|-----------|------------|
| Páginas editáveis | 8+ | 1 (home) — escalável |
| FormUtils | 6 arquivos (1600+ linhas cada) | 1 arquivo (~300 linhas) |
| Types | Espalhados por seção | 1 arquivo organizado |
| Camadas de dados | editable + readonly + hidden | editable + readonly (hidden inline no SEO) |
| AdminConfig | 400+ linhas (Material Design, 6 efeitos) | ~150 linhas (cores do tema, ícones, rules) |
| Composables | 5+ pesados | 7 enxutos (mesma API) |
| Validadores | 30+ funções | 8 funções (1 por seção) |
| Save wrappers | 25+ funções | 8 funções (1 por seção) |
| Audit logging | Sim | Sim |
| Image compression | Sim (5 presets) | Sim (4 presets) |
| Image cleanup | Sim (old/new + temp) | Sim (mesmo padrão) |
| Change tracking | Sim | Sim |
| Navigation guard | Sim | Sim |
| **Funcionalidade total** | **100%** | **100%** |
| **Arquivos** | **~30+** | **~12** |
| **Linhas estimadas** | **~8000+** | **~2500** |

**Resultado: mesma funcionalidade, 1/3 dos arquivos, 1/3 do código.**

---

## 14. Escalabilidade Futura

Quando precisar crescer:
1. **Nova página** → novo documento no Firestore + novo `*FormUtils.ts` + novo `*Edit.vue`
2. **Nova seção** → nova interface em types + novo validador + novo save wrapper + seção no editor
3. **Novo idioma** → duplicar documento com prefixo (`home_en`, `home_es`)
4. **Blog** → nova collection no Firestore + CRUD page
5. **Projetos** → mesma coisa, collection própria
6. **Multi-admin** → Firebase Auth com roles + updatedBy dinâmico

O padrão aguenta porque cada seção é independente.
Adicionar seção nova = 1 interface + 1 validador + 1 save wrapper + 1 createSectionConfig no editor.

---

**Status:** Pronto para implementação
**Primeiro passo:** Firebase setup + types/admin.ts + utils (AdminConfig + HomeFormUtils)
