# 🎬 Page Editor - Change Tracking, Cleanup e Navigation Guard

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Orquestrador de experiencia do editor: detecta mudancas, limpa imagens e previne saida com dados nao salvos.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Usar no Editor](#-como-usar-no-editor-essencial) (Essencial)
3. [Fluxo Completo](#-fluxo-completo-importante) (Importante)
4. [Arquitetura](#-arquitetura-opcional) (Opcional)
5. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
6. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

O editor precisa de 3 coisas que nao sao sobre dados:
- **Saber se o formulario foi editado** (pra habilitar "Salvar" e avisar antes de sair)
- **Limpar imagens** antigas quando troca por nova, e temporarias quando cancela
- **Prevenir saida** acidental com mudancas nao salvas

### A Solucao

```
usePageEditor()
  ├── Change tracking    →  hasChanges, markAsChanged(), resetChanges()
  ├── Image cleanup      →  cleanupOldImage(), cleanupTempUploads()
  └── Navigation guard   →  canExit()
```

**Nao faz save** — save esta no `usePageData` factory (`saveSection`, `saveAll`).
**Nao faz validacao** — validacao esta no `useValidation`.
**Nao faz upload** — upload esta no `useFirebaseStorage`.

### Quando Usar

✅ **Consulte este guia quando:**
- Precisar detectar mudancas no formulario
- Precisar limpar imagens ao trocar ou cancelar
- Precisar impedir saida sem salvar
- Quiser entender como os 3 mecanismos funcionam juntos

❌ **Nao precisa deste guia para:**
- Salvar dados (va em `PageData_GUIDE.md`)
- Fazer upload de imagens (va em `Storage_GUIDE.md`)
- Validar formularios (va em `Validation_GUIDE.md`)

---

## 🔧 Como Usar no Editor (Essencial)

### 1. Change tracking

```typescript
const { hasChanges, markAsChanged, resetChanges } = usePageEditor();
const { forms, saveSection } = useHomePageData();

// Detecta mudancas no formulario
watch(forms, () => markAsChanged(), { deep: true });

// Botao de salvar (habilitado so com mudancas)
// <CBButton :disabled="!hasChanges" @click="handleSave">Salvar</CBButton>

// Apos salvar com sucesso
const handleSave = async () => {
  const result = await saveSection('hero');
  if (result.success) {
    resetChanges();  // hasChanges volta pra false
  }
};
```

### 2. Image cleanup — imagem antiga

```typescript
const { cleanupOldImage } = usePageEditor();

// Quando o usuario troca a imagem da missao:
// A URL antiga precisa ser deletada do Firebase Storage

const handleSave = async () => {
  const oldUrl = originalData.value?.content.mission.image;
  const newUrl = forms.value.mission.editable.image;

  const result = await saveSection('mission');

  if (result.success) {
    await cleanupOldImage(oldUrl, newUrl);
    // So deleta se: oldUrl existe, mudou, e e do Firebase
    resetChanges();
  }
};
```

### 3. Image cleanup — uploads temporarios

```typescript
const { cleanupTempUploads } = usePageEditor();
const tempUploadedImages = ref<string[]>([]);

// Quando o usuario faz upload mas ainda nao salvou:
const handleUpload = async (file: File) => {
  const url = await uploadImage(file, 'mission');
  tempUploadedImages.value.push(url);  // tracking
  forms.value.mission.editable.image = url;
};

// Se salvar: remove da lista (imagem agora e permanente)
// Se cancelar: cleanupTempUploads deleta todas
```

### 4. Navigation guard

```typescript
const { canExit } = usePageEditor();
const tempUploadedImages = ref<string[]>([]);

// Antes de sair da pagina
const handleBack = async () => {
  if (await canExit(tempUploadedImages)) {
    navigateTo('/admin');
  }
  // Se hasChanges, mostra confirm()
  // Se confirmar ou nao tem mudancas, limpa temp uploads
  // Se negar, fica na pagina
};
```

---

## 🔄 Fluxo Completo (Importante)

### Cenario 1: Usuario edita e salva

```
1. Pagina carrega
   hasChanges = false

2. Usuario edita titulo
   watch(forms) dispara → markAsChanged()
   hasChanges = true
   Botao "Salvar" habilitado

3. Usuario clica "Salvar"
   validateHero(data) → { isValid: true }
   saveSection('hero') → success
   resetChanges()
   hasChanges = false
   Botao "Salvar" desabilitado

4. Usuario sai da pagina
   canExit() → hasChanges = false → true (pode sair)
```

### Cenario 2: Usuario edita e sai sem salvar

```
1. Usuario edita titulo
   hasChanges = true

2. Usuario clica "Voltar"
   canExit(tempImages) chamado
   hasChanges = true
   → window.confirm("Alteracoes nao salvas. Sair?")

3a. Usuario confirma
    cleanupTempUploads() → deleta uploads nao salvos
    return true → navigateTo('/admin')

3b. Usuario cancela
    return false → fica na pagina
```

### Cenario 3: Usuario troca imagem e salva

```
1. Usuario faz upload de nova imagem
   uploadImage(file, 'mission') → nova URL
   tempUploadedImages.push(novaUrl)  // tracking
   forms.mission.editable.image = novaUrl
   markAsChanged()

2. Usuario salva
   saveSection('mission') → success
   cleanupOldImage(urlAntiga, urlNova)
     urlAntiga existe? SIM
     urlAntiga !== urlNova? SIM
     urlAntiga.includes('firebase')? SIM
     → deleteFile(urlAntiga)  // remove do Storage
   tempUploadedImages = []  // limpa tracking
   resetChanges()

3. Resultado:
   - Firestore: nova URL salva
   - Storage: imagem antiga deletada, nova permanece
   - Estado: limpo (sem mudancas, sem temp)
```

### Cenario 4: Usuario faz upload e cancela

```
1. Usuario faz upload (imagem vai pro Firebase Storage)
   tempUploadedImages = ['https://firebase.../nova.jpg']

2. Usuario clica "Voltar"
   canExit(tempImages)
   hasChanges = true → confirm()
   Usuario confirma saida

3. cleanupTempUploads()
   → deleteFile('https://firebase.../nova.jpg')
   → tempUploadedImages = []

4. Resultado:
   - Firestore: nenhuma mudanca
   - Storage: upload temporario deletado (sem lixo)
```

---

## 🎨 Arquitetura (Opcional)

### Arquivos envolvidos

```
composables/
├── usePageEditor.ts         ← change tracking + cleanup + guard
├── useFirebaseStorage.ts    ← deleteFile() (usado pelo cleanup)
├── usePageData.ts           ← saveSection/saveAll (dados)
├── useValidation.ts         ← validacao (pre-save)
```

### Diagrama: quem faz o que

```
usePageEditor           usePageData           useFirebaseStorage    useValidation
─────────────           ───────────           ──────────────────    ─────────────
hasChanges              loadPageData()        uploadImage()         validateHero()
markAsChanged()         saveSection()         uploadFile()          validateSeo()
resetChanges()          saveAll()             deleteFile()          ...
cleanupOldImage()       resetSection()        validateImageFile()
cleanupTempUploads()    resetAll()
canExit()

  UX do editor          Dados Firestore       Arquivos Storage      Regras
```

### cleanupOldImage — 3 condicoes

```typescript
const cleanupOldImage = async (oldUrl?, newUrl?) => {
  if (!oldUrl) return;                    // nao tinha imagem antes
  if (oldUrl === newUrl) return;          // nao mudou
  if (!oldUrl.includes('firebase')) return; // nao e do Firebase (ex: URL externa)

  await deleteFile(oldUrl);               // silent fail
};
```

---

## 📊 Referencia de Arquivos (Referencia)

### `composables/usePageEditor.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `usePageEditor()` | composable | Retorna state + actions do editor |
| `UsePageEditor` | type | ReturnType do composable |

#### Retorno do usePageEditor()

| Retorno | Tipo | Descricao |
|---------|------|-----------|
| `hasChanges` | `Readonly<Ref<boolean>>` | Flag de mudancas nao salvas |
| `markAsChanged()` | `function` | Seta hasChanges = true |
| `resetChanges()` | `function` | Seta hasChanges = false |
| `cleanupOldImage(oldUrl, newUrl)` | `async` | Deleta imagem antiga se mudou |
| `cleanupTempUploads(tempImages)` | `async` | Deleta uploads nao salvos |
| `canExit(tempImages)` | `async` | Guard: confirm + cleanup |

---

## 💡 FAQ (Suporte)

### Por que o usePageEditor nao faz save?

No Just Prime, o usePageEditor centraliza tudo (save, validacao, cleanup, tracking). No nosso projeto, save esta embutido na factory `usePageData` (`saveSection`, `saveAll`). Duplicar seria redundante. O usePageEditor foca nas 3 responsabilidades de UX que a factory nao cobre.

### hasChanges e readonly — como muda?

`hasChanges` e exposto como `readonly(ref)`. Isso significa que so o usePageEditor pode mudar o valor internamente (via `markAsChanged` e `resetChanges`). O editor nao pode fazer `hasChanges.value = true` diretamente — precisa chamar as funcoes.

### Preciso chamar resetChanges() manualmente?

Sim. Apos cada save bem-sucedido, chame `resetChanges()`. A factory `usePageData` nao sabe sobre change tracking — sao composables separados.

### E se eu esquecer de chamar cleanupTempUploads?

As imagens temporarias ficam "penduradas" no Firebase Storage — lixo. O `canExit()` limpa automaticamente se o usuario confirmar saida. Mas se o browser fechar abruptamente, nao da pra limpar. Uma estrategia futura seria TTL no Storage Rules.

### canExit e async — por que?

Porque `cleanupTempUploads` faz chamadas de rede (deletar arquivos do Firebase). O `window.confirm()` e sincrono, mas o cleanup depois e async.

---

*📅 Criado em*: 19 FEV 2026
*📋 Versao*: 1.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [arquitetura, admin, editor, change-tracking, cleanup, navigation-guard, imagens]
