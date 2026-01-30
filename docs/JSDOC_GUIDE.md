# 📚 JSDoc Guide

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-GUIA-orange?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-5.0_Híbrido-blue?style=for-the-badge)
![Filosofia](https://img.shields.io/badge/Filosofia-Menos_é_Mais-green?style=for-the-badge)

</div>

## 🎯 Filosofia Core

> **"Documente apenas o que NÃO É ÓBVIO. Se o código fala por si, deixe-o falar."**

### **Regra de Ouro Expandida**

```
📖 DOCUMENTE: Propósito, regras de negócio, side-effects, comportamentos especiais
❌ NÃO DOCUMENTE: Sintaxe óbvia, padrões do projeto, implementações triviais
```

---

## 🎨 Emojis Padronizados por Tipo de Arquivo

### 📋 Referência Rápida

| Tipo de Arquivo | Emoji | Quando Usar | Exemplos |
|-----------------|-------|-------------|----------|
| **Componente Vue** | 🧩 | TODOS componentes .vue | CbButton.vue, CbModal.vue |
| **Repository** | 👤 | Classes de acesso a dados | UserRepository.ts, DoctorRepository.ts |
| **Entity** | 👤 | Classes de entidade/modelo | User.entity.ts, Doctor.entity.ts |
| **Database Types** | 📘 | Tipos de tabelas do banco | user.ts, doctor.ts (em types/database/) |
| **Utils/Helpers** | 🎯 | Funções utilitárias | CbFileUtils.ts, CbStringUtils.ts |
| **Composables** | 🎣 | Vue composables (use*) | useAuth.ts, useModal.ts |
| **Services/API** | 🌐 | Serviços de rede/API | apiService.ts, authService.ts |
| **Stores (Pinia)** | 🗄️ | Gerenciamento de estado | userStore.ts, globalStore.ts |
| **Config/Constants** | 🔧 | Arquivos de configuração | config.ts, constants.ts |
| **Middlewares** | 🛡️ | Middlewares e guards | authMiddleware.ts, routeGuard.ts |
| **Plugins** | ⚡ | Plugins Vue/Nuxt | plugin.client.ts, sentry.ts |

### 🏷️ Emojis Auxiliares (Uso Interno)

Use estes emojis **dentro** do cabeçalho para marcar seções específicas:

| Emoji | Significado | Quando Usar |
|-------|-------------|-------------|
| ⚠️ | Side-effects | Função modifica estado externo |
| 🌐 | SSR-safe | Comportamento diferente servidor/cliente |
| 🔗 | Dependências | Seção de dependências especiais |
| 📌 | Importante | Regra crítica de negócio |

---

## 📐 Estrutura Padrão de Arquivos

### **Template Universal (LIMPO)**

```typescript
/**
 * [EMOJI] NomeDoArquivo - Descrição concisa (1 linha)
 *
 * [Contexto adicional em 1-3 linhas - APENAS se necessário]
 * [Bullet points para informações específicas]
 */

import { ... } from 'vue';
import { ... } from '@composables/...';

// ============== TYPES ============== (se houver tipos locais)

// ============== CONSTANTS ============== (se houver constantes)

// ============== COMPOSABLE/CLASS/FUNÇÃO ============== (código principal)
```

### **Regras para Headers**

1. **Máximo 2-4 linhas** - seja conciso
2. **Sem seções de dependências no header** - imports diretos após header
3. **Bullet points** apenas para informações técnicas relevantes
4. **Sem emojis auxiliares (⚠️🔗🌐) no header** - reserve para casos extremos

### **Regras para Seções Internas**

1. **Seções comentadas** para organizar código (TYPES, CONSTANTS, etc.)
2. **Seções opcionais** (COMPUTED, MÉTODOS) só se tiver 3+ itens
3. **Não crie seção** para 1-2 linhas - agrupe naturalmente

---

## 🧩 Templates por Tipo de Arquivo

### **Componente Vue (.vue)**

```vue
<script setup lang="ts">
/**
 * 🧩 CbNomeComponente - Descrição concisa
 *
 * [Contexto adicional APENAS se componente complexo]
 */

import { ref, computed } from 'vue';
import { Button } from '@/components/shadcn/button';
import { useAuth } from '@/composables/useAuth';

// ============== PROPS/EMITS ==============

defineProps<{
  title?: string;
  disabled?: boolean;
  /** Máximo 50 chars - validado no backend */
  placeholder?: string;  // Comente inline APENAS o não-óbvio
}>();

defineEmits<{
  submit: [data: FormData];
}>();

// ============== STATE ==============

const isLoading = ref(false);

// ============== METHODS ==============

const handleSubmit = () => {
  // ...
};
</script>
```

### **Composable (use*.ts)**

```typescript
/**
 * 🎣 useNomeComposable - Descrição concisa
 *
 * [Contexto adicional APENAS se complexo]
 * [Informações relevantes em bullet points]
 */

import { ref, computed } from 'vue';
import { useGlobalStore } from '@stores/global';
import { CbLogger } from '@utils/CbLogger';

// ============== TYPES ==============

interface UseAuthOptions {
  redirectOnLogout?: boolean;
}

// ============== CONSTANTS ==============

const logger = CbLogger.child({ composable: 'useAuth' });

// ============== COMPOSABLE ==============

export function useAuth(options?: UseAuthOptions) {
  const store = useGlobalStore();

  // Estado
  const isAuthenticated = ref(false);

  // Métodos
  const login = async () => { /* ... */ };
  const logout = async () => { /* ... */ };

  return {
    isAuthenticated,
    login,
    logout,
  };
}
```

### **Utils/Helpers (*.utils.ts)**

```typescript
/**
 * 🎯 CbNomeUtils - Descrição Concisa
 * 
 * [Descrição APENAS se biblioteca complexa]
 * 
 * 🔗 DEPENDÊNCIAS:
 * - ✅ ZERO dependências externas (se aplicável)
 * - OU: NomeLib (motivo)
 */

// ============== DEPENDÊNCIAS EXTERNAS ==============
// ✅ Nenhuma - funções puras usando apenas APIs nativas

// ============== DEPENDÊNCIAS INTERNAS ==============
// Nenhuma

// ============== FUNÇÕES ==============

// Formata segundos para MM:SS
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Formata bytes para tamanho legível
export const formatFileSize = (bytes: number): string => {
  // ...
}

/**
 * Valida CNPJ com regra especial: matriz /0001, filial /0002+
 */
export const validateCNPJ = (cnpj: string, isMatriz: boolean): boolean => {
  // Regra de negócio não-óbvia = documenta
}
```

### **Store Pinia (*.store.ts)**

```typescript
/**
 * 🗄️ useNomeStore - Descrição Concisa
 * 
 * RESPONSABILIDADES:
 * - Gerencia estado X
 * - Fonte da verdade para Y
 * 
 * ⚠️ SIDE-EFFECTS:
 * - Persiste no localStorage
 */

// ============== DEPENDÊNCIAS EXTERNAS ==============
// Nenhuma

// ============== DEPENDÊNCIAS INTERNAS ==============
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ============== TYPES ==============
interface User {
  id: string
  name: string
}

// ============== STORE ==============
export const useUserStore = defineStore('user', () => {
  // Estado
  const user = ref<User | null>(null)
  
  // Getters
  const isLoggedIn = computed(() => !!user.value)
  
  // Actions
  const setUser = (newUser: User) => {
    user.value = newUser
  }
  
  return { user, isLoggedIn, setUser }
})
```

### **Repository (*.Repository.ts)**

```typescript
/**
 * 👤 UserRepository - Gerenciamento de usuários
 *
 * Retorna User Entity com dados relacionados.
 * Delega conversão para DatabaseEntity.
 */

import { CrudRepository } from './base/CrudRepository';
import { User } from '@entities/User.entity';
import { CbLogger } from '@utils/CbLogger';
import { TABLES } from '@definitions';

const logger = CbLogger.child({
  service: 'UserRepository',
  entity: 'users',
});

export class UserRepository extends CrudRepository<User> {
  constructor() {
    super(TABLES.USERS, User);
  }

  async findById(id: string): Promise<User | null> {
    // ...
  }
}
```

### **Entity (*.entity.ts)**

```typescript
/**
 * 👤 User Entity
 *
 * Extends DatabaseEntity<UserTable>
 * Repository popula: _roles, companyPatient fields (flat merge)
 */

import { DatabaseEntity } from './base/DatabaseEntity';
import type { UserTable } from '@app/types/database';
import type { IMeta } from '@types';

export class User extends DatabaseEntity<UserTable> {
  id!: string;
  email!: string;
  name!: string;
  roleIds: number[] = [];
  meta!: IMeta;

  // Campos computed/relacionamentos (não existem no banco)
  _roles: string[] = [];

  get displayName(): string {
    return this.nickname || this.name;
  }

  // ====== Métodos de negócio ======

  hasRole(roleId: number): boolean {
    return this.roleIds.includes(roleId);
  }
}
```

### **Database Types (types/database/*.ts)**

```typescript
/**
 * 📘 User Types - Tipos da tabela de usuários
 *
 * Dados globais compartilhados entre empresas.
 * roleIds referencia roles table.
 */

import type { UUID, Timestamp } from './common';

export interface UserTable {
  Row: {
    id: UUID;
    email: string;
    name: string;
    role_ids: number[];
    active: boolean;
    meta_created_at: Timestamp;
    // ... outros campos meta
  };

  Insert: {
    id: UUID;
    email: string;
    name: string;
    role_ids: number[];
    active?: boolean;
  };

  Update: {
    id: UUID;
    email?: string;
    name?: string;
    role_ids?: number[];
    active?: boolean;
  };
}

export type UserRow = UserTable['Row'];
export type UserInsert = UserTable['Insert'];
export type UserUpdate = UserTable['Update'];
```

### **Service/API (*.service.ts)**

```typescript
/**
 * 🌐 NomeService - Descrição concisa do serviço
 *
 * [Contexto sobre endpoints ou integrações]
 */

import axios from 'axios';
import { API_BASE_URL } from '@config/constants';

// ============== TYPES ==============

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

// ============== SERVICE ==============

export const userService = {
  getAll: () => axios.get<ApiResponse<User[]>>(`${API_BASE_URL}/users`),
  getById: (id: string) => axios.get<ApiResponse<User>>(`${API_BASE_URL}/users/${id}`),
};
```

---

## 🚫 O Que NUNCA Documentar

### **1. Informações Globais do Projeto**

❌ **NUNCA repita em cada arquivo:**

```typescript
// ❌ ERRADO
/**
 * @framework Vue 3
 * @language TypeScript
 * @architecture Composition API
 */
```

✅ **Isso vai no README do projeto, UMA VEZ**

### **2. Props/Emits Triviais**

❌ **NUNCA:**

```typescript
/**
 * @prop {string} title - O título do componente
 * @prop {boolean} disabled - Se está desabilitado
 */
```

✅ **TypeScript já documenta. Comente inline APENAS o especial:**

```typescript
defineProps<{
  title?: string
  disabled?: boolean
  /** Máximo 50 chars - validado no backend */
  placeholder?: string
}>()
```

### **3. Funções Auto-Explicativas**

❌ **NUNCA:**

```typescript
/**
 * Retorna o nome completo do usuário
 * @param firstName - Primeiro nome
 * @param lastName - Último nome
 * @returns Nome completo concatenado
 */
export const getFullName = (firstName: string, lastName: string) => 
  `${firstName} ${lastName}`
```

✅ **CORRETO - Nada ou comentário mínimo:**

```typescript
export const getFullName = (firstName: string, lastName: string) => 
  `${firstName} ${lastName}`
```

### **4. Imports Padrão**

❌ **NUNCA comente imports óbvios:**

```typescript
// ============== DEPENDÊNCIAS EXTERNAS ==============
import { ref } from 'vue' // Vue 3 Composition API  ← DESNECESSÁRIO
import { Button } from '@/components/shadcn/button' // Shadcn  ← DESNECESSÁRIO
```

✅ **Comente APENAS libs especiais:**

```typescript
// ============== DEPENDÊNCIAS EXTERNAS ==============
import Leaflet from 'leaflet' // Mapas interativos
import { createClient } from '@supabase/supabase-js' // Auth backend

// ============== DEPENDÊNCIAS INTERNAS ==============
import { ref, computed } from 'vue'
import { Button } from '@/components/shadcn/button'
```

---

## ✅ O Que SIM Documentar

### **1. Regras de Negócio**

```typescript
/**
 * Calcula desconto progressivo:
 * - 0-10 itens: 0%
 * - 11-50 itens: 5%
 * - 51+ itens: 10%
 */
export const calculateDiscount = (quantity: number, unitPrice: number): number => {
  // ...
}
```

### **2. Side-Effects**

```typescript
/**
 * ⚠️ SIDE-EFFECT: Atualiza globalStore.currentCompany e recarrega página
 */
export const switchCompany = (companyId: string) => {
  const store = useGlobalStore()
  store.setCurrentCompany(companyId)
  window.location.reload()
}
```

### **3. Comportamento SSR**

```typescript
/**
 * 🌐 SSR-SAFE: Retorna false no servidor, verifica no cliente
 */
export const hasLocalStorage = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.localStorage !== undefined
}
```

### **4. Funções Complexas com Múltiplas Regras**

```typescript
/**
 * 🛡️ Verifica permissão com isolamento MultiCompany
 * 
 * REGRAS:
 * - SUPERADMIN: sempre true
 * - ADMIN: true se permission in user.permissions && company in user.companies
 * - USER: false (sem permissões administrativas)
 * 
 * ⚠️ SIDE-EFFECTS:
 * - Consulta globalStore (não é função pura)
 * 
 * 🌐 SSR: Retorna false no servidor
 */
export const checkPermission = (permission: string, companyId: string): boolean => {
  // ...
}
```

---

## 📊 Níveis de Documentação

### **Nível 0: Zero Documentação**
Para código 100% auto-explicativo.

```typescript
export const sum = (a: number, b: number) => a + b
export const isEven = (n: number) => n % 2 === 0
```

### **Nível 1: Comentário Inline**
Para contexto mínimo.

```typescript
// Formata CPF: 12345678900 → 123.456.789-00
export const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
```

### **Nível 2: JSDoc Mínimo**
Para regras de negócio simples.

```typescript
/**
 * Calcula desconto progressivo:
 * - 0-10: 0% | 11-50: 5% | 51+: 10%
 */
export const calculateDiscount = (qty: number, price: number): number => {
  // ...
}
```

### **Nível 3: JSDoc Completo**
Para funções complexas com múltiplas responsabilidades.

```typescript
/**
 * 🛡️ Verifica permissão com isolamento MultiCompany
 * 
 * REGRAS:
 * - SUPERADMIN: sempre true
 * - ADMIN: true se permission in user.permissions
 * - USER: false
 * 
 * ⚠️ SIDE-EFFECTS: Consulta globalStore
 * 🌐 SSR: Retorna false no servidor
 * 
 * @param permission - Nome da permissão (ex: 'users.delete')
 * @param companyId - ID da empresa para verificar isolamento
 * @returns True se usuário tem permissão na empresa
 * 
 * @example
 * if (checkPermission('users.delete', currentCompanyId)) {
 *   await deleteUser(userId)
 * }
 */
export const checkPermission = (permission: string, companyId: string): boolean => {
  // ...
}
```

---

## 📊 Antes e Depois

### **Exemplo: Componente**

#### ❌ ANTES (Poluído)

```vue
<script setup lang="ts">
/**
 * 🧩 CbButton - Componente de Botão
 * 
 * @description Componente wrapper do Shadcn Button
 * @framework Vue 3 Composition API
 * @language TypeScript
 * 
 * 🔗 DEPENDÊNCIAS:
 * - Vue 3 Composition API
 * - Shadcn Button
 * - TailwindCSS
 * 
 * @prop {string} label - O texto do botão
 * @prop {boolean} disabled - Se está desabilitado
 * @prop {boolean} loading - Se está carregando
 */

import { ref } from 'vue'
import { Button } from '@/components/shadcn/button'

defineProps<{
  label?: string
  disabled?: boolean
  loading?: boolean
}>()
</script>
```

#### ✅ DEPOIS (Limpo)

```vue
<script setup lang="ts">
/**
 * 🧩 CbButton - Botão com estados de loading
 */

// ============== DEPENDÊNCIAS EXTERNAS ==============
// Nenhuma

// ============== DEPENDÊNCIAS INTERNAS ==============
import { ref } from 'vue'
import { Button } from '@/components/shadcn/button'

// ============== PROPS/EMITS ==============
defineProps<{
  label?: string
  disabled?: boolean
  loading?: boolean
}>()
</script>
```

---

### **Exemplo: Função**

#### ❌ ANTES (Poluído)

```typescript
/**
 * Formata duração em segundos para formato MM:SS
 * 
 * @description Esta função recebe um número de segundos e retorna
 * uma string formatada no padrão de minutos e segundos.
 * 
 * @param {number} seconds - O número de segundos para formatar
 * @returns {string} A duração formatada
 * @since 1.0.0
 * @author John Doe
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
```

#### ✅ DEPOIS (Limpo)

```typescript
// Formata segundos para MM:SS
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
```

---

## 🎯 Checklist Final

### **Antes de Commitar:**

```
[ ] Cabeçalho com emoji correto da tabela
[ ] Seções de dependências presentes (mesmo se vazias)
[ ] Removi JSDoc de funções óbvias
[ ] Removi menções a "Vue 3", "TypeScript" (info global)
[ ] Documentei side-effects e regras de negócio
[ ] Comentários inline apenas para props/emits especiais
[ ] Zero @since, @author desnecessários
[ ] Seções opcionais só se 3+ itens
```

### **Perguntas Guia:**

1. **Este JSDoc adiciona info não-óbvia?** → Não? DELETE
2. **Função é auto-explicativa?** → Sim? NÃO DOCUMENTE
3. **Há side-effects ou SSR?** → DOCUMENTE OBRIGATORIAMENTE
4. **Estou repetindo info global?** → DELETE

---

## 🎯 Mantra

> **"Se TypeScript + Nome já explicam, não documente. Se há regra de negócio ou side-effect, documente MUITO BEM. Sempre mantenha a estrutura de seções."**

---

## 🔗 Referências

- [JSDoc Official](https://jsdoc.app/)
- [TypeScript JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Vue 3 Style Guide](https://vuejs.org/style-guide/)

---

*📅 Criado em*: 18 JAN 2025  
*📅 Última atualização*: 10 JAN 2026  
*📋 Versão*: 3.0
*👥 Responsável*: CbBelmante  
*🏷️ Tags*: [documentação, jsdoc, vue3, typescript, pragmático, estruturado]