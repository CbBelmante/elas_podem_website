# 📚 Guia de Documentação

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-GUIA-orange?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-3.0-blue?style=for-the-badge)
![Filosofia](https://img.shields.io/badge/Filosofia-Direto_ao_Ponto-green?style=for-the-badge)

</div>

**Guia prático de como documentar o projeto.**

> **Filosofia**: Documentação útil, não decorativa. Se não agrega valor, não documente.

---

## 📋 Índice

1. [**📂 Estrutura de Pastas**](#-estrutura-de-pastas)
2. [**📝 Nomenclatura**](#-nomenclatura)
3. [**🎨 Badges e Ícones**](#-badges-e-ícones)
4. [**🎯 Sistema de Prioridade**](#-sistema-de-prioridade)
5. [**📄 Template de Documento**](#-template-de-documento)
6. [**✅ Checklist Rápido**](#-checklist-rápido)

---

## 📂 Estrutura de Pastas

### **Princípio: Organize por TIPO, não por Feature**

```text
docs/
├── components/          # Componentes Vue
├── composables/         # Composables/Hooks
├── services/            # Services e Classes
├── utils/               # Utilitários puros
├── architecture/        # Decisões arquiteturais
├── guides/              # Guias de uso/desenvolvimento
├── AGENT_RULES.md       # Regras para IA
├── JSDOC_GUIDE.md       # Padrões JSDoc
└── DOCUMENTATION_GUIDE.md  # Este arquivo
```

### **Quando Criar Subpastas**

✅ **Crie subpasta quando:**
- Tem 5+ documentos do mesmo tipo
- Há agrupamento lógico claro
- Facilita navegação

❌ **Não crie quando:**
- Tem apenas 1-2 documentos
- Agrupamento é forçado
- Complica mais que ajuda

### **Exemplos Práticos**

```text
# ✅ BOM - Agrupamento natural
docs/
├── components/
│   ├── crud/
│   │   ├── DataTable_GUIDE.md
│   │   ├── CrudModal_GUIDE.md
│   │   └── FilterPanel_GUIDE.md
│   └── layout/
│       ├── Sidebar_GUIDE.md
│       └── Header_GUIDE.md

# ❌ RUIM - Forçado/Vazio
docs/
├── components/
│   ├── buttons/              # Apenas 1 arquivo
│   │   └── CbButton_GUIDE.md
│   └── inputs/               # Apenas 1 arquivo
│       └── CbInput_GUIDE.md
```

---

## 📝 Nomenclatura

### **Regras Simples**

| Item | Formato | Exemplo |
|------|---------|---------|
| **Pastas** | `camelCase` (inglês) | `components`, `composables`, `utils` |
| **Arquivos** | `PascalCase_GUIDE.md` | `DataTable_GUIDE.md`, `UseAuth_GUIDE.md` |
| **Com subpasta** | Prefixo da pasta pai | `Components_Crud_DataTable_GUIDE.md` |

### **Exemplos Rápidos**

```text
# ✅ CORRETO
docs/components/crud/DataTable_GUIDE.md
docs/composables/UseAuth_GUIDE.md
docs/architecture/MultiCompany_GUIDE.md

# ❌ ERRADO
docs/Components/CRUD/data-table-guide.md
docs/composables/use_auth_guide.md
docs/arquitetura/multi_company.md
```

---

## 🎨 Badges e Ícones

### **Badges Obrigatórios (Todo Documento)**

```markdown
<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-[CATEGORIA]-[COR]?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-[X.X]-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-[ESTADO]-[COR]?style=for-the-badge)

</div>
```

### **Cores por Categoria**

| Categoria | Cor | Exemplo |
|-----------|-----|---------|
| **COMPONENTE** | `green` | ![Tipo](https://img.shields.io/badge/Tipo-COMPONENTE-green?style=for-the-badge) |
| **COMPOSABLE** | `purple` | ![Tipo](https://img.shields.io/badge/Tipo-COMPOSABLE-purple?style=for-the-badge) |
| **SERVICE** | `blue` | ![Tipo](https://img.shields.io/badge/Tipo-SERVICE-blue?style=for-the-badge) |
| **UTIL** | `orange` | ![Tipo](https://img.shields.io/badge/Tipo-UTIL-orange?style=for-the-badge) |
| **ARQUITETURA** | `lightblue` | ![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge) |
| **GUIA** | `red` | ![Tipo](https://img.shields.io/badge/Tipo-GUIA-red?style=for-the-badge) |
| **CONFIG** | `gray` | ![Tipo](https://img.shields.io/badge/Tipo-CONFIG-gray?style=for-the-badge) |
| **PERFORMANCE** | `brightgreen` | ![Tipo](https://img.shields.io/badge/Tipo-PERFORMANCE-brightgreen?style=for-the-badge) |

### **Status do Documento**

| Status | Cor | Quando Usar |
|--------|-----|-------------|
| **PLANEJADO** | `gray` | Documento ainda não criado |
| **EM_PROGRESSO** | `yellow` | Sendo escrito |
| **COMPLETO** | `green` | Finalizado e revisado |
| **DESATUALIZADO** | `red` | Precisa atualização |

### **Ícones Padrão**

| Ícone | Uso |
|-------|-----|
| 🧩 | Componente |
| 🎣 | Composable/Hook |
| 🌐 | Service/API |
| 🎯 | Util/Helper |
| 🏗️ | Arquitetura |
| 📚 | Guia/Tutorial |
| ⚠️ | Aviso/Warning |
| 💡 | Dica/Tip |
| ⚡ | Performance |
| 🔐 | Segurança/Auth |
| 🗄️ | Store/State |
| 🔧 | Config |

---

## 🎯 Sistema de Prioridade

Para melhorar a usabilidade, use indicadores de prioridade nos títulos:

| Prioridade | Indicador | Uso | Exemplo |
|------------|-----------|-----|---------|
| **ESSENCIAL** | `(Essencial)` | Setup, instalação, uso básico | `## 🔧 Instalação (Essencial)` |
| **IMPORTANTE** | `(Importante)` | Uso diário, casos comuns | `## 📊 Uso Básico (Importante)` |
| **OPCIONAL** | `(Opcional)` | Casos avançados, extras | `## 🚀 Avançado (Opcional)` |
| **REFERÊNCIA** | `(Referência)` | API, props, tipos | `## 📊 API Reference (Referência)` |
| **SUPORTE** | `(Suporte)` | Troubleshooting, FAQ | `## 💡 FAQ (Suporte)` |

### **Benefícios**

- Orientação clara para desenvolvedores
- Foco no essencial primeiro
- Separação entre básico e avançado
- Melhora experiência de aprendizado

### **Nota de Orientação (Recomendado)**

No início de documentações longas, inclua:

```markdown
💡 **80% dos casos de uso** são cobertos nas seções **(Essencial)** e **(Importante)**
```

### **Exemplo de Aplicação**

```markdown
## 🔧 Instalação (Essencial)
## 📊 Uso Básico (Importante)
## 🎨 Customização (Opcional)
## 📊 API Reference (Referência)
## 💡 Troubleshooting (Suporte)
```

---

## 📄 Template de Documento

### **Template Universal (Copy-Paste)**

```markdown
# 📚 [Título do Documento]

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-[CATEGORIA]-[COR]?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**[Descrição em 1-2 linhas do que este documento cobre]**

💡 **80% dos casos de uso** são cobertos nas seções **(Essencial)** e **(Importante)**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Instalação](#instalação) (Essencial)
3. [Uso Básico](#uso-básico) (Importante)
4. [Recursos Avançados](#recursos-avançados) (Opcional)
5. [API/Props](#apiprops) (Referência)
6. [FAQ](#faq) (Suporte)

---

## 🎯 Visão Geral

[Propósito do componente/composable/service em 2-3 parágrafos máximo]

### **Quando Usar**

✅ **Use quando:**
- [Cenário 1]
- [Cenário 2]

❌ **Não use quando:**
- [Cenário 1]
- [Cenário 2]

---

## 🔧 Instalação (Essencial)

[Passos de instalação/configuração inicial]

---

## 🚀 Uso Básico (Importante)

### **Exemplo Mínimo**

```typescript
// Código de exemplo simples
```

### **Exemplo Completo**

```typescript
// Código de exemplo com todas as features
```

---

## 🎨 Recursos Avançados (Opcional)

[Features avançadas, customizações, casos especiais]

---

## 📊 API/Props (Referência)

[Tabela com props/métodos/tipos]

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `prop1` | `string` | `''` | Descrição |
| `prop2` | `boolean` | `false` | Descrição |

---

## 💡 FAQ (Suporte)

### **Pergunta comum 1?**

Resposta.

### **Pergunta comum 2?**

Resposta.

---

## ⚠️ Avisos Importantes

- [Aviso 1]
- [Aviso 2]

---

*📅 Criado em*: [DATA]  
*📅 Última atualização*: [DATA]  
*📋 Versão*: [X.X]  
*👥 Responsável*: [NOME]  
*🏷️ Tags*: [tag1, tag2, tag3]
```

---

## ✅ Checklist Rápido

Antes de publicar documentação:

### **Essencial (OBRIGATÓRIO)**

- [ ] Badges no topo (Tipo, Versão, Status)
- [ ] Descrição clara em 1-2 linhas
- [ ] Exemplo de uso básico funcional
- [ ] Metadados no rodapé

### **Qualidade (RECOMENDADO)**

- [ ] Indicadores de prioridade nos títulos
- [ ] Nota de orientação (80% dos casos...)
- [ ] Seção "Quando Usar/Não Usar"
- [ ] Exemplo completo funcional
- [ ] Links para documentos relacionados

### **Evite (NÃO FAÇA)**

- [ ] ❌ Documentar o óbvio
- [ ] ❌ Repetir informações do README
- [ ] ❌ Criar docs sem exemplos práticos
- [ ] ❌ Seções vazias ou com "TODO"

---

## 📅 Formato de Data

Use o padrão brasileiro simplificado:

```
DIA MÊS ANO

Exemplos:
- 1º JAN 25
- 15 MAR 25
- 31 MAIO 25
```

**Regras:**
- Dia 1: use `1º`
- Outros: apenas número
- Mês: maiúsculo e abreviado (exceto MAIO)
- Ano: 2 dígitos

---

## 🎯 Resumo (TL;DR)

### **3 Regras de Ouro**

1. **Badges sempre** (Tipo, Versão, Status)
2. **Descrição curta** (1-2 linhas)
3. **Exemplo prático** (código que funciona)

### **Template Mínimo**

```markdown
# 📚 [Título]

![Tipo](https://img.shields.io/badge/Tipo-[CAT]-[COR]?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

[Descrição em 1 linha]

## Uso Básico (Essencial)
```code```

---
*Metadados*
```

---

## 📊 Exemplos Reais

### **Componente Vue**

```markdown
# 🧩 DataTable - Tabela de Dados CRUD

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-COMPONENTE-green?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Tabela genérica para listagem CRUD com ordenação, filtros e ações.**

💡 **80% dos casos** são cobertos nas seções **(Essencial)** e **(Importante)**

---

## 🎯 Visão Geral

Componente principal para exibir dados tabulares com suporte a:
- Ordenação por coluna
- Filtros customizados
- Ações em lote
- Paginação

### Quando Usar

✅ **Use para:** listagens CRUD, relatórios, dashboards
❌ **Não use para:** formulários, cards, dados não-tabulares

---

## 🚀 Uso Básico (Importante)

```vue
<template>
  <DataTable 
    :data="companies" 
    :columns="columns"
    @row-click="handleEdit"
  />
</template>
```

---

*📅 Criado em*: 10 JAN 26  
*📋 Versão*: 1.0  
*👥 Responsável*: CbBelmante  
*🏷️ Tags*: [componente, tabela, crud]
```

### **Composable**

```markdown
# 🎣 useAuth - Autenticação

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-COMPOSABLE-purple?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Composable para gerenciar autenticação via Supabase.**

---

## 🎯 Visão Geral

Gerencia login, logout e estado de autenticação.
NÃO verifica permissões (use usePermissions para isso).

---

## 🚀 Uso Básico (Importante)

```typescript
const { isAuthenticated, login, logout } = useAuth()

// Login
await login(email, password)

// Verificar auth
if (isAuthenticated.value) {
  // usuário logado
}
```

---

*📅 Criado em*: 10 JAN 26  
*📋 Versão*: 1.0  
*👥 Responsável*: CbBelmante  
*🏷️ Tags*: [composable, auth, supabase]
```

---

*📅 Criado em*: 20 SET 2025  
*📅 Última atualização*: 10 JAN 2026  
*📋 Versão*: 3.0  
*👥 Responsável*: CbBelmante  
*🏷️ Tags*: [documentação, guia, padrões, markdown, pragmático]