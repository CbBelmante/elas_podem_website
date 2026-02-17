# Patterns do mnesis_frontend para Elas Podem

**Origem:** `/home/cbbelmante/workspaces/mnesis_frontend`
**Data:** 17 FEV 2026
**Status:** Planejado

Patterns e utilidades identificados no mnesis_frontend que fazem sentido
para o projeto Elas Podem (landing page / site institucional).

---

## Alta Prioridade

### 1. Dual Favicon (SVG + ICO fallback)

- **Origem:** `mnesis_frontend/nuxt.config.ts` (lines 118-134)
- **O que:** Favicon SVG para browsers modernos + .ico como fallback
- **Por que:** Favicon crisp em retina, fallback para legacy
- **Onde aplicar:** `nuxt.config.ts` → `app.head.link`
- **Status:** [ ] Pendente

```typescript
app: {
  head: {
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/logo-elas-podem.svg' },
      { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
},
```

---

### 2. Custom Scrollbar CSS

- **Origem:** `mnesis_frontend/app/app.vue` (lines 138-171)
- **O que:** Scrollbar fina e elegante (WebKit + Firefox)
- **Por que:** Melhora visual da landing page, polimento
- **Onde aplicar:** `assets/css/reset.css` ou `app.vue`
- **Status:** [ ] Pendente

```css
*::-webkit-scrollbar { width: 6px; height: 6px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); border-radius: 3px; }
*::-webkit-scrollbar-button { display: none; }
* { scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; }
```

---

### 3. Vite cacheDir

- **Origem:** `mnesis_frontend/nuxt.config.ts` (line 153)
- **O que:** `vite.cacheDir: '.vite'` — cache no root do projeto
- **Por que:** Rebuilds mais rapidos, cache visivel e git-ignoravel
- **Onde aplicar:** `nuxt.config.ts` → `vite.cacheDir`
- **Status:** [ ] Pendente

---

### 4. runtimeConfig + useConfig()

- **Origem:** `mnesis_frontend/nuxt.config.ts` (lines 176-191) + `config/index.ts`
- **O que:** Variaveis de ambiente via `runtimeConfig.public` + composable wrapper
- **Por que:** Firebase config, API keys do formulario de contato (EmailJS, Resend, etc.)
- **Onde aplicar:** `nuxt.config.ts` + `config/index.ts` (criar)
- **Status:** [ ] Pendente

```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    environment: '',
    contactFormApiKey: '',
    firebaseProjectId: '',
  },
},

// config/index.ts
export function useConfig() {
  const runtime = useRuntimeConfig();
  return {
    isDevelopment: runtime.public.environment === 'development',
    contactForm: { apiKey: runtime.public.contactFormApiKey as string },
  };
}
```

---

### 5. validateEmail (pura, sem deps)

- **Origem:** `mnesis_frontend/app/utils/ValidationUtils.ts`
- **O que:** Regex robusta para validacao de email
- **Por que:** Formulario de contato precisa validar email
- **Onde aplicar:** `utils/validation.ts` (criar)
- **Status:** [ ] Pendente

```typescript
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]...$/;

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 255) return false;
  return EMAIL_REGEX.test(email.trim());
}
```

---

### 6. useDisableBackdropScroll

- **Origem:** `mnesis_frontend/app/composables/useGlobalResponsive.ts`
- **O que:** Trava scroll do body quando modal/drawer esta aberto
- **Por que:** Fix do iOS Safari "bounce", essencial para menu mobile e modal de contato
- **Onde aplicar:** `composables/useDisableBackdropScroll.ts` (criar)
- **Status:** [ ] Pendente

```typescript
export function useDisableBackdropScroll() {
  let currentScrollPosition = 0;
  const preventScroll = () => { /* salva posicao, fixa body */ };
  const enableScroll = () => { /* restaura posicao */ };
  return { preventScroll, enableScroll };
}
```

---

## Media Prioridade

### 7. ClientUtils (isClientSide, clientOnly)

- **Origem:** `mnesis_frontend/app/utils/ClientUtils.ts`
- **O que:** Helpers SSR-safe para detectar ambiente client
- **Por que:** Evitar `window is not defined` em animacoes on-scroll, analytics, IntersectionObserver
- **Onde aplicar:** `utils/client.ts` (criar)
- **Status:** [ ] Pendente

---

### 8. LocalStorage wrapper (Safari-safe)

- **Origem:** `mnesis_frontend/app/utils/LocalStorage.ts`
- **O que:** Wrapper com fallback in-memory para Safari Private Mode
- **Por que:** Persistir idioma escolhido, cookie consent sem crashes
- **Onde aplicar:** `utils/localStorage.ts` (criar)
- **Status:** [ ] Pendente

---

### 9. Logger (silencia em prod)

- **Origem:** `mnesis_frontend/app/utils/Logger.ts`
- **O que:** Classe de logging que silencia automaticamente em producao
- **Por que:** Eliminar console.log em prod, manter em dev com cores e groups
- **Onde aplicar:** `utils/logger.ts` (criar)
- **Status:** [ ] Pendente

---

### 10. Husky + lint-staged

- **Origem:** `mnesis_frontend/.husky/pre-commit` + `package.json`
- **O que:** Pre-commit hook que roda lint apenas nos arquivos staged
- **Por que:** Evitar push de codigo quebrado, rapido (so arquivos alterados)
- **Onde aplicar:** `.husky/` + `package.json`
- **Status:** [ ] Pendente

```json
"lint-staged": {
  "*.{vue,js,jsx,ts,tsx}": ["eslint"]
},
"prepare": "husky"
```

---

### 11. ESLint rules (max-attributes-per-line)

- **Origem:** `mnesis_frontend/eslint.config.mjs`
- **O que:** Regra para limitar atributos por linha em templates Vue
- **Por que:** Templates mais legiveis e consistentes
- **Onde aplicar:** `eslint.config.mjs`
- **Status:** [ ] Pendente

```javascript
'vue/max-attributes-per-line': ['error', {
  singleline: { max: 4 },
  multiline: { max: 2 }
}],
```

---

## Baixa Prioridade (Futuro)

### 12. useModal (singleton pattern)

- **Origem:** `mnesis_frontend/app/composables/useModal.ts`
- **O que:** Estado global de modal sem Pinia, pattern singleton
- **Por que:** Modal de contato, video demo, CTA popup
- **Quando:** Quando implementar modais no site

---

### 13. generateSlug / deburr

- **Origem:** `mnesis_frontend/app/utils/StringUtils.ts`
- **O que:** Gerar slugs e remover acentos
- **Por que:** Anchor IDs para secoes (`#nossa-missao`), SEO
- **Quando:** Quando implementar navegacao por ancora ou blog

---

### 14. useResponsiveValue

- **Origem:** `mnesis_frontend/app/composables/useGlobalResponsive.ts`
- **O que:** Valores dinamicos baseados em breakpoints (SSR-safe)
- **Por que:** `itemsPerView` do carousel, paddings responsivos em JS
- **Quando:** Quando precisar de breakpoints em JS alem de CSS

---

### 15. syncAliases.ts

- **Origem:** `mnesis_frontend/scripts/syncAliases.ts`
- **O que:** Script que sincroniza tsconfig paths a partir de uma unica fonte
- **Por que:** Evitar tsconfig.json desatualizado vs nuxt.config.ts
- **Quando:** Quando o projeto crescer e tiver muitos aliases

---

## Notas

- Todos os patterns sao do mnesis_frontend e foram adaptados para o contexto de landing page
- Itens de auth, CRUD, database, permissoes foram excluidos (nao aplicaveis)
- Prioridade baseada em impacto imediato no projeto atual
- Cada item deve ser adaptado ao CODE_STYLE_GUIDE e JSDOC_GUIDE do projeto
