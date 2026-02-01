# 📐 Guia de Estilo de Código

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-GUIA-red?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Padrões de código do projeto Mnesis: nomenclatura, estrutura de arquivos, imports e convenções.**

> **Filosofia**: Consistência > Preferências pessoais. Código previsível é código fácil de manter.

💡 **80% dos casos de uso** são cobertos nas seções **(Essencial)** e **(Importante)**

---

## 📋 Índice

1. [**🏷️ Nomenclatura**](#️-nomenclatura) (Essencial)
2. [**📁 Imports e Aliases**](#-imports-e-aliases) (Essencial)
3. [**🧩 Vue SFC - Single File Component**](#-vue-sfc---single-file-component) (Essencial)
4. [**📚 JSDoc e Documentação**](#-jsdoc-e-documentação) (Importante)
5. [**🔧 Constantes e Types**](#-constantes-e-types) (Importante)
6. [**🎣 Composables**](#-composables) (Importante)
7. [**📘 Interfaces e Resultados**](#-interfaces-e-resultados) (Referência)
8. [**🎨 Estilos CSS**](#-estilos-css) (Referência)
9. [**✅ Checklist de Verificação**](#-checklist-de-verificação)

---

## 🏷️ Nomenclatura (Essencial)

### **Regras Gerais**

| Item | Padrão | Exemplo |
|------|--------|---------|
| **Constantes** | `SCREAMING_SNAKE_CASE` | `MNESIS_ROLES`, `COMPANY_TYPES` |
| **Interfaces** | `IPascalCase` (prefixo I obrigatório) | `ICompany`, `IMeta`, `IBaseEntity` |
| **Types** | `PascalCase` (derivados, sem prefixo) | `CompanyType`, `MnesisRole` |
| **Funções** | `camelCase` (iniciar com verbo) | `isValid()`, `getUser()`, `createOrder()` |
| **Composables** | `use*` pattern | `useAuth()`, `useDoctor()`, `usePatient()` |
| **Componentes Vue** | `PascalCase` (prefixo Cb para custom) | `CbButton`, `CbModal`, `MessageItem` |
| **Arquivos TS/JS** | `camelCase` | `useAuth.ts`, `apiService.ts`, `roles.ts` |
| **Pastas** | `camelCase` | `composables/`, `components/`, `services/` |
| **Classes CSS customizadas** | BEM-like com `camelCase` | `.cbButton`, `.cbButton__icon`, `.cbButton--solid` |

### **Exemplos Práticos**

```typescript
// ✅ CORRETO - Nomenclatura consistente

// Constantes
export const MNESIS_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
} as const satisfies Record<string, string>;

// Types derivados
export type MnesisRole = typeof MNESIS_ROLES[keyof typeof MNESIS_ROLES];

// Interfaces com prefixo I
export interface ICompany {
  id: string;
  name: string;
  type: CompanyType;
}

// Funções com verbo
export function isValidRole(role: string): role is MnesisRole { }
export function getRoleDisplayName(role: string): string { }
export function createUser(data: ICreateUserData): Promise<IUser> { }

// Composables com use*
export const useAuth = () => { }
export const useDoctor = () => { }
```

```typescript
// ❌ ERRADO - Nomenclatura inconsistente

// Sem padrão nas constantes
export const mnesisRoles = { patient: 'patient' }

// Interface sem prefixo I
export interface Company { }

// Funções sem verbo
export function valid(role: string) { }
export function roleDisplayName(role: string) { }

// Type com prefixo I (interfaces usam I, types não)
export type ICompanyType = string;
```

### **Prefixos de Constantes**

Use prefixos consistentes para agrupar constantes relacionadas:

```typescript
// ✅ CORRETO - Prefixos consistentes
export const MNESIS_ROLES = { ... }
export const MNESIS_ROLE_DISPLAY_NAMES = { ... }
export const MNESIS_ROLE_DESCRIPTIONS = { ... }

export const COMPANY_TYPES = { ... }
export const COMPANY_TYPE_DISPLAY_NAMES = { ... }

export const SERVICE_STATUS = { ... }
```

---

## 📁 Imports e Aliases (Essencial)

### **⚠️ REGRA DE OURO: SEMPRE Use Aliases**

**NUNCA** use caminhos relativos (`../`, `../../`). **SEMPRE** use aliases configurados.

### **Aliases Disponíveis**

Veja `nuxt.config.ts:32-48` para a lista completa:

| Alias | Caminho | Uso |
|-------|---------|-----|
| `@` | `.` (raiz do projeto) | Raramente usado |
| `@app` | `./app` | Raiz da aplicação |
| `@config` | `./config.ts` | Configurações |
| `@components` | `./app/components` | Componentes Vue |
| `@composables` | `./app/composables` | Composables |
| `@utils` | `./app/utils` | Utilitários |
| `@assets` | `./app/assets` | Assets (CSS, imagens) |
| `@definitions` | `./app/definitions` | Constantes e definições |
| `@data` | `./app/data` | Dados estáticos |
| `@types` | `./app/types` | Types e interfaces |
| `@services` | `./app/services` | Services (API, Supabase) |
| `@stores` | `./app/stores` | Pinia stores |
| `@plugins` | `./app/plugins` | Plugins |
| `@shadcn` | `./components/shadcn` | Componentes shadcn |
| `@chat` | `./app/chat` | Sistema de chat/fluxos |

### **Exemplos Corretos vs Incorretos**

```typescript
// ✅ CORRETO - Sempre usar aliases
import { useAuth } from '@composables/useAuth';
import { MNESIS_ROLES } from '@definitions/roles';
import { supabase } from '@services/supabase';
import { CbLogger } from '@utils/CbLogger';
import type { ICompany } from '@types/company';
import { useGlobalStore } from '@stores/global';
import CbButton from '@components/ui/CbButton.vue';
```

```typescript
// ❌ ERRADO - NUNCA usar caminhos relativos
import { useAuth } from '../../composables/useAuth';
import { MNESIS_ROLES } from '../../../definitions/roles';
import { supabase } from '../../../../services/supabase';
import CbButton from '../ui/CbButton.vue';
```

### **Por Que Sempre Usar Aliases?**

1. **Manutenção**: Mover arquivos não quebra imports
2. **Legibilidade**: Fica claro de onde vem cada import
3. **Refactoring**: IDEs suportam melhor rename/move com aliases
4. **Consistência**: Todo o projeto usa o mesmo padrão

### **Ordem de Imports**

Siga esta ordem (com linha em branco entre grupos):

```typescript
// ============== DEPENDÊNCIAS EXTERNAS ==============
import { computed } from 'vue';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// ============== DEPENDÊNCIAS INTERNAS ==============
import { useGlobalStore, type IAppUser } from '@stores/global';
import { supabase } from '@services/supabase';
import { CbLogger } from '@utils/CbLogger';
import { TABLES, MNESIS_ROLES, type IBaseResult } from '@definitions';
import { getFirstName } from '@utils/StringUtils';
```

---

## 🧩 Vue SFC - Single File Component (Essencial)

### **Ordem dos Blocos**

**SEMPRE** use esta ordem:

```vue
<script setup>
// Código TypeScript
</script>

<template>
<!-- HTML do componente -->
</template>

<style scoped>
/* CSS do componente */
</style>
```

### **Estrutura Interna do `<script setup>`**

Use seções comentadas para organizar o código:

```vue
<script setup>
// ============== CONSTANTS ==============
// Constantes locais do componente

// ============== HELPERS LOCAIS ==============
// Funções auxiliares do componente

// ============== PROPS & EMITS ==============
const props = defineProps({ ... })
const emit = defineEmits([...])

// ============== COMPOSABLES ==============
const { isAuthenticated, signIn } = useAuth()

// ============== REACTIVE STATE ==============
const isLoading = ref(false)
const data = reactive({ ... })

// ============== COMPUTED PROPERTIES ==============
const computedValue = computed(() => ...)

// ============== METHODS ==============
const handleSubmit = () => { ... }

// ============== LIFECYCLE ==============
onMounted(() => { ... })
</script>
```

### **Exemplo Real do Projeto**

Veja `MessageItem.vue:1-169` para um exemplo completo:

```vue
<script setup>
import { computed } from 'vue';
import { Avatar, AvatarFallback } from '@shadcn/avatar';
import CbBadge from '@components/ui/CbBadge.vue';
import MessageActions from './MessageActions.vue';
import { useMarkdownMemoized } from '@composables/useMarkdownMemoized';

// ============== CONSTANTS ==============
// (N/A - sem constantes neste componente)

// ============== HELPERS LOCAIS ==============
const getMessageContent = (message) => {
  if (message.parts && Array.isArray(message.parts)) {
    return message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('');
  }
  return message.content || '';
};

// ============== PROPS & EMITS ==============
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
});

const _emit = defineEmits(['retry', 'save', 'share']);

// ============== COMPOSABLES ==============
const { renderMarkdown } = useMarkdownMemoized();

// ============== REACTIVE STATE ==============
const groupHovered = ref(false);

// ============== COMPUTED PROPERTIES ==============
const computedAvatarIcon = computed(() => {
  return props.message.role === 'assistant' ? 'luc-stethoscope' : 'luc-user';
});
</script>

<template>
  <div class="message">{{ message.content }}</div>
</template>

<style scoped>
/* Estilos do componente */
</style>
```

### **Regras para Seções**

1. **Seções obrigatórias** mesmo vazias: CONSTANTS, PROPS & EMITS
2. **Seções opcionais** (só se tiver 3+ itens): COMPUTED, METHODS
3. **LIFECYCLE sempre por último** (se houver)

---

## 📚 JSDoc e Documentação (Importante)

### **Header de Arquivo (PADRÃO LIMPO)**

Todo arquivo `.ts` deve ter um cabeçalho JSDoc **conciso** com emoji:

```typescript
/**
 * 🎣 useAuth - Gerenciamento de autenticação
 *
 * Login, signup, logout, reset senha.
 * Modifica useGlobalStore e persiste sessão.
 */

import { computed } from 'vue';
import { useGlobalStore } from '@stores/global';
import { CbLogger } from '@utils/CbLogger';
```

**Regras:**
- **Máximo 2-4 linhas** - seja conciso
- **Sem seções de dependências no header** - imports diretos
- **Bullet points** apenas para informações técnicas relevantes

### **Emojis Padronizados por Tipo**

Veja `JSDOC_GUIDE.md:24-39` para a lista completa:

| Tipo | Emoji | Exemplo |
|------|-------|---------|
| **Componente Vue** | 🧩 | `🧩 CbButton - Botão customizado` |
| **Repository** | 👤 | `👤 UserRepository - Gerenciamento de usuários` |
| **Entity** | 👤 | `👤 User Entity` |
| **Database Types** | 📘 | `📘 User Types - Tipos da tabela de usuários` |
| **Composable** | 🎣 | `🎣 useAuth - Autenticação` |
| **Service/API** | 🌐 | `🌐 apiService - Cliente HTTP` |
| **Store** | 🗄️ | `🗄️ globalStore - Estado global` |
| **Utils** | 🎯 | `🎯 CbLogger - Utilitário de log` |
| **Config** | 🔧 | `🔧 config - Configurações` |

### **Documentação de Funções**

```typescript
/**
 * 🔐 Login com email e senha
 *
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Resultado da operação
 */
const signIn = async (email: string, password: string): Promise<IAuthResult> => {
  // ...
}
```

### **Seções Comentadas (Organização Interna)**

Use comentários de seção para organizar **código interno** (não no header):

```typescript
/**
 * 🎣 useAuth - Gerenciamento de autenticação
 *
 * Login, signup, logout, reset senha.
 * Modifica useGlobalStore e persiste sessão.
 */

import { computed } from 'vue';
import { useGlobalStore } from '@stores/global';
import { CbLogger } from '@utils/CbLogger';

// ============== TYPES ==============

export interface IAuthResult extends IBaseResult {
  data?: any;
}

// ============== CONSTANTS ==============

const logger = CbLogger.child({ composable: 'useAuth' });

// ============== COMPOSABLE ==============

export const useAuth = () => {
  // ...

const AUTH_MIN_LOG_LEVEL = 'DEBUG';

// ============== COMPOSABLE ==============

export const useAuth = () => {
  // ...
}
```

---

## 🔧 Constantes e Types (Importante)

### **Padrão com `as const satisfies`**

**SEMPRE** use este padrão para constantes com type safety:

```typescript
// ✅ CORRETO - Type safety garantido
export const MNESIS_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  SECRETARY: 'secretary',
  ADMIN: 'admin',
} as const satisfies Record<string, string>;
```

```typescript
// ❌ ERRADO - Sem type safety
export const MNESIS_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
};
```

### **Tipos Derivados**

Types derivam das constantes:

```typescript
// ✅ CORRETO - Type derivado da constante
export type MnesisRole = typeof MNESIS_ROLES[keyof typeof MNESIS_ROLES];
// Valores: 'patient' | 'doctor' | 'secretary' | 'admin'

export type CompanyType = typeof COMPANY_TYPES[keyof typeof COMPANY_TYPES];
// Valores: 'personal' | 'company'
```

### **Estrutura Completa de Definições**

Todo arquivo de definições (`@definitions`) segue esta estrutura:

```typescript
/**
 * 🎭 Roles - Papéis de usuários do Mnesis
 */

// ============== ROLES ==============

export const MNESIS_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
} as const satisfies Record<string, string>;

// ============== TYPES ==============

export type MnesisRole = typeof MNESIS_ROLES[keyof typeof MNESIS_ROLES];

// ============== DISPLAY NAMES ==============

export const MNESIS_ROLE_DISPLAY_NAMES: Record<MnesisRole, string> = {
  [MNESIS_ROLES.PATIENT]: 'Paciente',
  [MNESIS_ROLES.DOCTOR]: 'Médico',
};

// ============== DESCRIPTIONS ==============

export const MNESIS_ROLE_DESCRIPTIONS: Record<MnesisRole, string> = {
  [MNESIS_ROLES.PATIENT]: 'Pode agendar consultas e visualizar histórico médico',
  [MNESIS_ROLES.DOCTOR]: 'Pode atender pacientes e gerenciar prontuários',
};

// ============== OPTIONS FOR SELECTS ==============

export const MNESIS_ROLE_OPTIONS = [
  {
    value: MNESIS_ROLES.PATIENT,
    label: MNESIS_ROLE_DISPLAY_NAMES[MNESIS_ROLES.PATIENT],
    description: MNESIS_ROLE_DESCRIPTIONS[MNESIS_ROLES.PATIENT],
  },
  // ...
] as const;

// ============== UTILS ==============

export function isValidRole(role: string): role is MnesisRole {
  return Object.values(MNESIS_ROLES).includes(role as MnesisRole);
}

export function getRoleDisplayName(role: string): string {
  if (isValidRole(role)) {
    return MNESIS_ROLE_DISPLAY_NAMES[role];
  }
  return role;
}

export const ALL_ROLES = Object.values(MNESIS_ROLES) as MnesisRole[];
```

Veja exemplo completo em `app/definitions/roles.ts:1-135`.

---

## 🎣 Composables (Importante)

### **Estrutura Padrão**

```typescript
/**
 * 🎣 useNomeComposable - Descrição
 *
 * [Descrição expandida]
 *
 * 🔗 DEPENDÊNCIAS EXTERNAS:
 * - [libs externas]
 *
 * 🔗 DEPENDÊNCIAS INTERNAS:
 * - [imports do projeto]
 */

// ============== DEPENDÊNCIAS EXTERNAS ==============

import { computed } from 'vue';

// ============== DEPENDÊNCIAS INTERNAS ==============

import { useGlobalStore } from '@stores/global';
import { CbLogger } from '@utils/CbLogger';

// ============== INTERFACES ==============

export interface IAuthResult extends IBaseResult {
  data?: any;
}

// ============== CONSTANTS ==============

const logger = CbLogger.child({
  composable: 'useAuth',
  layer: 'auth',
  minLevel: 'DEBUG',
});

// ============== COMPOSABLE ==============

export const useAuth = () => {
  const store = useGlobalStore();

  // ===== COMPUTED (da store) =====

  const isAuthenticated = computed(() => store.isAuthenticated);

  // ===== HELPERS INTERNOS =====

  const fetchUserProfile = async (): Promise<void> => {
    // ...
  };

  // ===== ACTIONS PÚBLICAS =====

  const signIn = async (email: string, password: string): Promise<IAuthResult> => {
    // ...
  };

  // ===== RETURN =====

  return {
    isAuthenticated,
    signIn,
    signOut,
  };
};

// ============== EXPORTS ==============

export type UseAuth = ReturnType<typeof useAuth>;
```

### **Logging com CbLogger**

SEMPRE use CbLogger para logs em composables:

```typescript
const logger = CbLogger.child({
  composable: 'useAuth',
  layer: 'auth',
  minLevel: 'DEBUG',
});

logger.debug('Buscando perfil do usuário', { userId });
logger.info('Login realizado com sucesso');
logger.warn('Erro ao buscar roles', { error });
logger.error('Erro em fetchUserProfile', { error });
```

### **Export de Tipos**

SEMPRE exporte o tipo do retorno do composable:

```typescript
export const useAuth = () => {
  return {
    isAuthenticated,
    signIn,
  };
};

// ✅ CORRETO - Permite type inference
export type UseAuth = ReturnType<typeof useAuth>;
```

Veja exemplo completo em `app/composables/useAuth.ts:1-508`.

---

## 📘 Interfaces e Resultados (Referência)

### **Prefixo I Obrigatório**

**TODAS** as interfaces usam prefixo `I`:

```typescript
// ✅ CORRETO
export interface ICompany { }
export interface IMeta { }
export interface IBaseEntity { }
export interface IServiceResult { }

// ❌ ERRADO
export interface Company { }
export interface Meta { }
```

### **IBaseResult vs IServiceResult**

O projeto usa dois padrões de resultado:

#### **IBaseResult** (Sistema Antigo - Composables)

```typescript
/**
 * Interface base para resultados de operações (sistema antigo)
 *
 * Use para padronizar retornos de funções async em composables.
 */
export interface IBaseResult {
  /** Operação foi bem-sucedida */
  success: boolean;
  /** Mensagem de erro (apenas se success=false) */
  error?: string;
}

// Uso
const result: IBaseResult = { success: true };
if (!result.success) {
  console.error(result.error);
}
```

#### **IServiceResult** (Sistema de Fluxos - Novo)

```typescript
/**
 * Resultado padrão de operações do sistema de fluxos
 *
 * Convenção diferente de IBaseResult:
 * - Usa `status: 'SUCCESS' | 'ERROR'` ao invés de `success: boolean`
 * - `message` sempre presente (não apenas em erro)
 * - Mais adequado para submit de fluxos
 */
export interface IServiceResult<T = any> {
  status: ServiceStatus;
  message: string;
  data?: T;
  useNaturalFormatting?: boolean;
}

// Uso
return { status: 'SUCCESS', message: 'Login realizado!' };
return { status: 'ERROR', message: 'Credenciais inválidas' };
```

### **Extensão de Interfaces**

Composables estendem IBaseResult:

```typescript
// ✅ CORRETO - Cada composable estende IBaseResult
export interface IAuthResult extends IBaseResult {
  data?: any;
}

export interface IDoctorResult extends IBaseResult {
  doctor?: IDoctor;
}
```

Veja exemplos em:
- `app/definitions/baseTypes.ts:1-137` (IBaseResult, IServiceResult)
- `app/composables/useAuth.ts:42-44` (IAuthResult extends IBaseResult)

### **Helpers para IServiceResult**

```typescript
// Criar resultado de sucesso
export const createSuccessResult = <T>(message: string, data?: T): IServiceResult<T> => ({
  status: SERVICE_STATUS.SUCCESS,
  message,
  data,
});

// Criar resultado de erro
export const createErrorResult = (message: string): IServiceResult => ({
  status: SERVICE_STATUS.ERROR,
  message,
});

// Verificar se é sucesso
export const isSuccess = (result: IServiceResult): boolean =>
  result.status === SERVICE_STATUS.SUCCESS;
```

---

## 🎨 Estilos CSS (Referência)

### **Ordem no `<style scoped>`**

```vue
<style scoped>
/* 1. Reference (Tailwind v4) */
@reference '../../assets/css/main.css';

/* 2. Classes customizadas */
.messageContent {
  @apply space-y-2;
}

/* 3. Container/Layout */
.messageWrapper {
  display: flex;
  flex-direction: column;
}

/* 4. Elementos específicos */
.userBubble {
  background-color: var(--chat-bubble-user);
}

/* 5. Estados (hover, active, etc) */
.userBubble:hover {
  background-color: var(--chat-bubble-user-hover);
}

/* 6. Dark mode */
.dark .badgeMedical {
  background-color: var(--primary-soft);
}

/* 7. Seções específicas (com comentários) */
/* ===== TEXT WRAPPING & LINE BREAKS ===== */
.userBubble p {
  word-break: break-word;
  white-space: pre-wrap;
}

/* ===== ALINHAMENTO DAS AÇÕES ===== */
.actionsLeft {
  align-self: flex-start;
}
</style>
```

### **Nomenclatura de Classes CSS**

**Padrão: BEM-like com `camelCase` e prefixo `cb`**

Utilizamos uma variação da metodologia BEM (Block, Element, Modifier) para garantir que nossos estilos sejam previsíveis, isolados e fáceis de entender.

1.  **Bloco (O Componente):** `camelCase` com o prefixo `cb`.
    -   Exemplo: `cbCard`, `cbButton`

2.  **Elemento (Parte do Componente):** Nome do bloco, seguido por `__` (dois underlines) e o nome do elemento.
    -   Exemplo: `cbCard__header`, `cbButton__icon`

3.  **Modificador (Variação do Componente):** Nome do bloco (ou elemento), seguido por `--` (dois hífens) e o nome do modificador.
    -   Exemplo: `cbCard--elevated`, `cbButton--solid`

```css
/* ✅ CORRETO - Estrutura BEM com prefixo e camelCase */
.cbCard { /* Bloco */ }
.cbCard__header { /* Elemento */ }
.cbCard--elevated { /* Modificador */ }

.cbButton { /* Bloco */ }
.cbButton__icon { /* Elemento */ }
.cbButton--solid { /* Modificador */ }

/* ❌ ERRADO - kebab-case, sem estrutura ou sem prefixo */
.card-header { } /* Usa kebab-case e não tem escopo */
.cardHeader { }  /* Sem o prefixo 'cb', pode colidir com outras libs */
.card_header { } /* Usa snake_case */
```

**Exceções (NÃO use camelCase):**

- **Tailwind classes**: `flex`, `justify-end`, `bg-blue-100` (classes do framework)
- **Bibliotecas externas**: shadcn, outras libs (mantém nomenclatura original)
- **CSS global**: classes definidas fora do projeto

```vue
<template>
  <!-- ✅ CORRETO - Mix de customizado (camelCase BEM) + classes utilitárias (se necessário) -->
  <div class="cbCard cbCard--elevated">
    <div class="cbCard__header">
        ...
    </div>
  </div>
</template>

<style scoped>
/* Classes customizadas seguindo o padrão */
.cbCard {
  display: flex;
}

.cbCard__header {
  font-weight: bold;
}

.cbCard--elevated {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
</style>
```

Veja exemplo real em `app/components/chat/MessageItem.vue:176-415`.

### **CSS Variables do Tema**

SEMPRE use CSS variables ao invés de cores hardcoded:

```css
/* ✅ CORRETO - Usa variáveis do theme.css */
.userBubble {
  background-color: var(--chat-bubble-user);
  color: var(--chat-bubble-user-text);
}

.assistantBubble {
  background-color: var(--chat-bubble-assistant);
  color: var(--chat-bubble-assistant-text);
}

/* ❌ ERRADO - Cores hardcoded */
.userBubble {
  background-color: #3b82f6;
  color: white;
}
```

### **Comentários em Seções**

Use comentários para separar seções grandes:

```css
/* ============================================
 * BUG FIXES: TEXT WRAPPING & LINE BREAKS
 * ============================================ */

.userBubble p {
  word-break: break-word;
  white-space: pre-wrap;
}

/* ============================================
 * ALINHAMENTO DAS AÇÕES POR ROLE
 * ============================================ */

.actionsLeft {
  align-self: flex-start;
}
```

Veja exemplo completo em `app/components/chat/MessageItem.vue:272-415`.

---

## ✅ Checklist de Verificação

Use este checklist antes de commitar código:

### **Nomenclatura**

- [ ] Constantes em `SCREAMING_SNAKE_CASE`
- [ ] Interfaces com prefixo `I` (IPascalCase)
- [ ] Types em `PascalCase` (sem prefixo)
- [ ] Funções em `camelCase` iniciando com verbo
- [ ] Composables com padrão `use*`

### **Imports e Aliases**

- [ ] **TODOS os imports usam aliases** (zero caminhos relativos `../`)
- [ ] Ordem correta: Externos → Internos
- [ ] Seções comentadas (DEPENDÊNCIAS EXTERNAS/INTERNAS)

### **Vue SFC**

- [ ] Ordem: `<script>` → `<template>` → `<style>`
- [ ] Seções comentadas no script (PROPS, STATE, COMPUTED, METHODS)
- [ ] Classes CSS customizadas em `camelCase` (ex: `.userBubble`, `.messageWrapper`)
- [ ] CSS usa variáveis do tema (não hardcoded)

### **JSDoc**

- [ ] Header com emoji correto no topo do arquivo
- [ ] Descrição clara e concisa
- [ ] Seção de dependências (se houver libs especiais)
- [ ] Exemplo de uso (`@example`) se complexo

### **Constantes e Types**

- [ ] Constantes com `as const satisfies Record<string, string>`
- [ ] Types derivados das constantes
- [ ] Estrutura completa: Constants → Types → Display Names → Utils

### **Composables**

- [ ] Logger configurado com CbLogger.child()
- [ ] Export do tipo `export type UseAuth = ReturnType<typeof useAuth>`
- [ ] Interface de resultado estende IBaseResult
- [ ] Seções organizadas (COMPUTED, HELPERS, ACTIONS, RETURN)

### **Gerais**

- [ ] Código sem console.log() (usar logger)
- [ ] Sem TODOs ou FIXMEs sem issue relacionada
- [ ] Sem código comentado (deletar ou criar issue)
- [ ] Tipagem forte (evitar `any`)

---

## 🎯 Resumo (TL;DR)

### **4 Regras de Ouro**

1. **SEMPRE use aliases** (`@composables/useAuth` em vez de `../../composables/useAuth`)
2. **Interfaces têm prefixo I** (`ICompany`, `IBaseResult`)
3. **Constantes em SCREAMING_SNAKE_CASE** com `as const satisfies`
4. **Classes CSS customizadas em camelCase** (`.userBubble`, `.messageWrapper` - exceto Tailwind/libs)

### **Template Rápido - Composable**

```typescript
/**
 * 🎣 useNome - Descrição
 *
 * 🔗 DEPENDÊNCIAS INTERNAS:
 * - [lista]
 */

// ============== DEPENDÊNCIAS EXTERNAS ==============
import { computed } from 'vue';

// ============== DEPENDÊNCIAS INTERNAS ==============
import { useGlobalStore } from '@stores/global';
import { CbLogger } from '@utils/CbLogger';

// ============== INTERFACES ==============
export interface INomeResult extends IBaseResult { }

// ============== CONSTANTS ==============
const logger = CbLogger.child({ composable: 'useNome' });

// ============== COMPOSABLE ==============
export const useNome = () => {
  // COMPUTED
  // HELPERS
  // ACTIONS

  return { };
};

// ============== EXPORTS ==============
export type UseNome = ReturnType<typeof useNome>;
```

### **Template Rápido - Vue SFC**

```vue
<script setup>
// ============== CONSTANTS ==============
// ============== PROPS & EMITS ==============
// ============== COMPOSABLES ==============
// ============== REACTIVE STATE ==============
// ============== COMPUTED PROPERTIES ==============
// ============== METHODS ==============
</script>

<template>
  <!-- HTML -->
</template>

<style scoped>
@reference '../../assets/css/main.css';
/* Estilos usando var(--css-variables) */
</style>
```

### **Template Rápido - Definitions**

```typescript
/**
 * 🎭 NomePlural - Descrição
 */

// ============== CONSTANTS ==============
export const NOME_CONSTANTS = {
  VALUE: 'value',
} as const satisfies Record<string, string>;

// ============== TYPES ==============
export type NomeType = typeof NOME_CONSTANTS[keyof typeof NOME_CONSTANTS];

// ============== DISPLAY NAMES ==============
export const NOME_DISPLAY_NAMES: Record<NomeType, string> = { };

// ============== UTILS ==============
export function isValidNome(value: string): value is NomeType { }
```

---

*📅 Criado em*: 17 JAN 26
*📅 Última atualização*: 17 JAN 26
*📋 Versão*: 1.0
*👥 Responsável*: CbBelmante
*🏷️ Tags*: [código, padrões, estilo, typescript, vue, nomenclatura, imports, aliases]
