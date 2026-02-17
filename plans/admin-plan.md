# Plano do Admin - Elas Podem

**Objetivo:** Criar admin simples, escalável e funcional baseado no padrão Just Prime
**Princípio:** Simplicidade > Complexidade. Menos código, mais resultado.

---

## 1. Arquitetura Simplificada

### O que pegar do Just Prime:
- Section-based editing (cada seção é independente)
- `usePageEditor` como orquestrador central
- Firebase Firestore para persistência
- Type safety em tudo
- Middleware de autenticação

### O que simplificar:
- SEM separação editable/readonly (overkill para nós - CSS fica no código)
- SEM FormUtils pesados (usar defaults inline)
- SEM AdminConfigUtils gigante (config simples por seção)
- Composables enxutos e diretos

---

## 2. Estrutura de Pastas

```
pages/admin/
├── index.vue                    # Dashboard com links para seções
├── login.vue                    # Login Firebase Auth
└── edit/
    └── homeEdit.vue             # Editor da home (todas as seções)

composables/
├── useFirebase.ts               # Firebase init (app, db, auth, storage)
├── useAuth.ts                   # Autenticação
├── usePageData.ts               # Leitura de dados (get)
├── usePageSave.ts               # Salvamento de dados (save)
└── useImageUpload.ts            # Upload de imagens

types/
└── admin.ts                     # TODOS os types do admin (simples, 1 arquivo)

middleware/
└── admin.ts                     # Proteção de rotas

utils/
└── adminDefaults.ts             # Dados padrão para cada seção
```

**Por que 1 arquivo de types?**
O site tem 8 seções simples. Não precisa de 8 arquivos de types.
Quando crescer, aí sim separa.

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
        image: ""   # URL da imagem (substituir SVG placeholder)

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

    lastUpdated: timestamp
    updatedBy: "admin"
```

---

## 4. Types (types/admin.ts)

```typescript
// ============ HERO ============
interface IHeroStat {
  icon: string
  number: string
  label: string
}

interface IHeroSection {
  badge: string
  title: string
  subtitle: string
  btnDonate: string
  btnHistory: string
  stats: IHeroStat[]
}

// ============ MISSION ============
interface IMissionSection {
  badge: string
  title: string
  text1: string
  text2: string
  btnText: string
  image: string
}

// ============ PROGRAMS ============
interface IProgram {
  title: string
  description: string
  icon: string
  color: string       // magenta, coral, rosa, oliva, laranja
  link: string
}

// ============ TESTIMONIALS ============
interface ITestimonial {
  quote: string
  name: string
  role: string
  initials: string
  image?: string
}

// ============ SUPPORTERS ============
interface ISupporter {
  name: string
  icon: string
  color: string
  image?: string      // Logo do apoiador (quando tiver)
  url?: string        // Link externo
}

// ============ CONTACT ============
interface IContactMethod {
  label: string
  value: string
  icon: string
  color: string
  url?: string
}

interface IContactSection {
  badge: string
  title: string
  description: string
  methods: IContactMethod[]
  formSubjects: string[]
}

// ============ CTA ============
interface ICtaSection {
  title: string
  subtitle: string
  btnDonate: string
  btnProjects: string
}

// ============ SEO ============
interface ISeo {
  title: string
  description: string
  keywords: string[]
  ogImage: string
}

// ============ PAGE COMPLETA ============
interface IHomePageData {
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
```

---

## 5. Composables

### useFirebase.ts
```
- Inicializa Firebase App, Firestore, Auth, Storage
- Exporta instâncias prontas
- Config via environment variables (.env)
```

### useAuth.ts
```
- signIn(email, password)
- signOut()
- isAuthenticated (computed)
- isAdmin (computed)
- currentUser (computed)
- Listener onAuthStateChanged
```

### usePageData.ts
```
- getPageData(pageId: string): Promise<IHomePageData>
- watchPageData(pageId: string): Ref<IHomePageData>  (realtime)
- Retorna dados do Firestore
- Fallback para defaults se não existir
```

### usePageSave.ts (inspirado no usePageEditor do Just Prime)
```
- saveSection(pageId, sectionPath, data): Promise
- saveAllSections(pageId, sections[]): Promise
- Valida antes de salvar
- Atualiza lastUpdated e updatedBy
- Log de ações
```

### useImageUpload.ts
```
- uploadImage(file, path): Promise<string>  (retorna URL)
- deleteImage(url): Promise
- Compressão automática
- Progress tracking
```

---

## 6. Admin Pages

### Dashboard (pages/admin/index.vue)
```
Layout simples com cards linkando para cada seção:
- [Home Page] → /admin/edit/homeEdit
- [Configurações] → /admin/settings (futuro)

Status: última atualização, quem editou
```

### Home Editor (pages/admin/edit/homeEdit.vue)

**Layout:** Accordion/Tabs com cada seção expandível

```
┌─────────────────────────────────┐
│  🏠 Editor - Página Home        │
│                                  │
│  ▼ Hero Section                  │
│    [badge] [title] [subtitle]    │
│    [btnDonate] [btnHistory]      │
│    Stats: [+] [edit] [delete]    │
│                                  │
│  ▶ Missão (click to expand)      │
│  ▶ Programas                     │
│  ▼ Depoimentos                   │
│    [+Novo] Lista com drag/drop   │
│    Card: [quote] [name] [role]   │
│                                  │
│  ▼ Apoiadores                    │
│    [+Novo] Lista com drag/drop   │
│    Card: [name] [icon] [image]   │
│                                  │
│  ▶ Contato                       │
│  ▶ CTA                           │
│  ▶ SEO                           │
│                                  │
│  [💾 Salvar Tudo]  [↩ Descartar] │
└─────────────────────────────────┘
```

**Cada seção usa CBInput, CBTextarea, CBSelect, CBCard do cbcomponents!**
Dogfooding: o admin usa os mesmos componentes da lib.

---

## 7. Fluxo de Dados no Site

### Antes (atual):
```
i18n/pt-BR.json → $t('key') → Template
hardcoded arrays → Template
```

### Depois (com admin):
```
Firebase Firestore → usePageData() → ref<IHomePageData> → Template
                                              ↓
                                     Fallback: adminDefaults.ts
```

### Transição suave:
1. Criar usePageData que retorna defaults (= dados atuais)
2. Conectar Firebase
3. Admin salva → Firebase atualiza → site atualiza
4. Remover i18n gradualmente (ou manter para labels fixos)

---

## 8. Sobre o i18n

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

## 9. Firebase Setup

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
    // Logs só admin
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

## 10. Checklist de Implementação

### Fase 0: Setup Firebase
- [ ] Criar projeto Firebase
- [ ] Configurar Firestore
- [ ] Configurar Storage
- [ ] Configurar Authentication (Email/Password)
- [ ] Criar usuário admin
- [ ] Adicionar variáveis no .env
- [ ] Instalar firebase SDK no projeto

### Fase 1: Infraestrutura do Admin
- [ ] types/admin.ts (interfaces)
- [ ] utils/adminDefaults.ts (dados padrão)
- [ ] composables/useFirebase.ts (init)
- [ ] composables/useAuth.ts (login/logout)
- [ ] composables/usePageData.ts (leitura)
- [ ] composables/usePageSave.ts (escrita)
- [ ] middleware/admin.ts (proteção)
- [ ] pages/admin/login.vue
- [ ] pages/admin/index.vue (dashboard)

### Fase 2: Editor da Home
- [ ] pages/admin/edit/homeEdit.vue
- [ ] Seção Hero (textos + stats CRUD)
- [ ] Seção Missão (textos + imagem)
- [ ] Seção Programas (CRUD de cards)
- [ ] Seção Depoimentos (CRUD + carousel preview)
- [ ] Seção Apoiadores (CRUD + marquee preview)
- [ ] Seção Contato (métodos + subjects)
- [ ] Seção CTA (textos)
- [ ] Seção SEO (meta tags)

### Fase 3: Conectar Site ao Firebase
- [ ] Substituir i18n por usePageData() no index.vue
- [ ] Substituir arrays hardcoded por dados do Firebase
- [ ] Fallback para defaults quando Firebase offline
- [ ] Loading states com CBSkeleton
- [ ] Testar fluxo completo: admin edita → site atualiza

### Fase 4: Upload de Imagens
- [ ] composables/useImageUpload.ts
- [ ] Upload de logo apoiadores
- [ ] Upload de imagem missão
- [ ] Upload de OG image (SEO)
- [ ] Compressão e otimização

---

## 11. Dependências Novas

```json
{
  "dependencies": {
    "firebase": "^11.x"
  }
}
```

Só isso! Firebase inclui Auth, Firestore, Storage tudo em 1 pacote.

---

## 12. Resumo: Just Prime vs Elas Podem

| Aspecto | Just Prime | Elas Podem |
|---------|-----------|------------|
| Páginas | 8+ pages editáveis | 1 page (home) |
| FormUtils | 1 arquivo por página (1600+ linhas) | 1 arquivo defaults (100 linhas) |
| Types | 1 arquivo por seção | 1 arquivo total |
| Camadas | editable + readonly + hidden | Dados diretos (sem split) |
| AdminConfig | 400+ linhas | Config inline simples |
| Composables | 5+ composables pesados | 4 composables enxutos |
| Complexidade | Alta (multi-página, multi-section) | Baixa (1 página, 8 seções) |
| Padrão | Mesmo | Mesmo (simplificado) |

**Resultado:** Mesma qualidade, 1/3 do código.

---

## 13. Escalabilidade Futura

Quando precisar crescer:
1. **Nova página** → novo documento no Firestore + novo editPage
2. **Nova seção** → nova interface no types + nova seção no editor
3. **Novo idioma** → duplicar documento com prefixo (`home_en`, `home_es`)
4. **Blog** → nova collection no Firestore + CRUD page
5. **Projetos** → mesma coisa, collection própria
6. **Multi-admin** → Firebase Auth com roles

O padrão aguenta porque cada seção é independente.
Adicionar seção nova = 1 interface + 1 accordion no editor + 1 saveFunction.

---

**Status:** Pronto para implementação
**Estimativa:** ~15 arquivos novos, ~2000 linhas total
**Primeiro passo:** Firebase setup + types + composables base
