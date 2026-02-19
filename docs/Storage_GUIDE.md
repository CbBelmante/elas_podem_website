# 📦 Storage - Upload e Compressao de Imagens

<div align="center">

![Tipo](https://img.shields.io/badge/Tipo-ARQUITETURA-lightblue?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-COMPLETO-green?style=for-the-badge)

</div>

**Pipeline de upload de imagens com compressao automatica, validacao e cleanup. Dois composables com responsabilidades separadas: comprimir e armazenar.**

> **80% dos casos de uso** sao cobertos nas secoes **(Essencial)** e **(Importante)**

---

## 📋 Indice

1. [Visao Geral](#-visao-geral)
2. [Como Fazer Upload](#-como-fazer-upload-essencial) (Essencial)
3. [Como Validar e Deletar](#-como-validar-e-deletar-essencial) (Essencial)
4. [Configs de Upload e Compressao](#-configs-de-upload-e-compressao-importante) (Importante)
5. [Arquitetura](#-arquitetura-opcional) (Opcional)
6. [Como Funciona Por Dentro](#-como-funciona-por-dentro-tecnico) (Tecnico)
7. [Referencia de Arquivos](#-referencia-de-arquivos-referencia) (Referencia)
8. [FAQ](#-faq-suporte) (Suporte)

---

## 🎯 Visao Geral

### O Problema

O admin precisa fazer upload de imagens (missao, depoimentos, apoiadores, SEO). Cada categoria tem requisitos diferentes:
- Missao: foto grande, comprimir pra 800x600
- Apoiadores: logo pequeno, comprimir pra 200x200
- SEO: og:image, alta qualidade, 1200x630

Alem disso:
- Validar tipo e tamanho antes do upload
- Deletar imagens antigas quando trocar por nova
- Limpar uploads temporarios se o usuario cancelar

### A Solucao

2 composables com responsabilidades separadas:

```
useImageCompression    →  comprimir (Canvas API, client-side)
useFirebaseStorage     →  armazenar (Firebase Storage, upload/delete/validate)
```

O storage usa o compression internamente — o caller so diz a categoria:

```typescript
const url = await uploadImage(file, 'mission');
// Comprime automaticamente com COMPRESSION_SETTINGS.mission
// Faz upload pro Firebase Storage
// Retorna a download URL
```

### Quando Usar

✅ **Consulte este guia quando:**
- Precisar fazer upload de imagem no editor
- Quiser mudar limites de tamanho ou compressao
- Precisar entender o pipeline compress → upload → cleanup
- Precisar adicionar nova categoria de imagem

❌ **Nao precisa deste guia para:**
- Cleanup de imagens no cancel/exit (va em `PageEditor_GUIDE.md`)
- Validacao de campos de texto (va em `Validation_GUIDE.md`)
- Fluxo de dados load/save (va em `PageData_GUIDE.md`)

---

## 🔧 Como Fazer Upload (Essencial)

### Upload com compressao automatica (mais comum)

```typescript
const { uploadImage, validateImageFile } = useFirebaseStorage();

const handleUpload = async (file: File) => {
  // 1. Valida
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    console.error(validation.error);  // "Imagem excede 5MB"
    return;
  }

  // 2. Upload (comprime automaticamente)
  const url = await uploadImage(file, 'mission');
  // → Comprimiu: 800x600, quality 0.8
  // → Fez upload: images/mission/mission-1708345678901_compressed.jpg
  // → Retornou: https://firebasestorage.googleapis.com/...

  // 3. Usa a URL
  forms.value.mission.editable.image = url;
};
```

### Categorias disponiveis

| Categoria | Quality | Max Dimensao | Uso |
|-----------|---------|-------------|-----|
| `'mission'` | 0.8 | 800x600 | Foto da secao missao |
| `'supporters'` | 0.8 | 200x200 | Logo de apoiador |
| `'seo'` | 0.9 | 1200x630 | Imagem og:image |
| `'testimonials'` | 0.8 | 200x200 | Foto de depoimento |

### Upload generico (sem compressao)

```typescript
const { uploadFile } = useFirebaseStorage();

// Qualquer arquivo, qualquer path
const url = await uploadFile(file, 'documents/relatorio.pdf');
```

### Compressao isolada (sem upload)

```typescript
const { compressImage } = useImageCompression();

// Comprimir sem fazer upload (ex: preview)
const compressed = await compressImage(file, {
  quality: 0.7,
  maxWidth: 400,
  maxHeight: 300,
});
// compressed e um File — pode usar pra preview ou upload manual
```

---

## 🔧 Como Validar e Deletar (Essencial)

### Validar antes do upload

```typescript
const { validateImageFile } = useFirebaseStorage();

const validation = validateImageFile(file);
// Checa: tipo MIME (image/*), tamanho (5MB), extensao (jpg/jpeg/png/webp)

if (!validation.isValid) {
  alert(validation.error);
  // → "Arquivo precisa ser uma imagem"
  // → "Imagem excede 5MB"
  // → "Extensao .gif nao suportada. Use: jpg, jpeg, png, webp"
}
```

### Validar com limite customizado

```typescript
// Logos de apoiadores — max 2MB
const validation = validateImageFile(file, 2);
```

### Deletar arquivo

```typescript
const { deleteFile } = useFirebaseStorage();

// Deleta pela URL do Firebase
await deleteFile('https://firebasestorage.googleapis.com/v0/b/.../o/images%2Fmission%2Fimg.jpg?alt=media');
// Silent fail — se falhar, loga warning mas nao lanca erro
```

---

## 📐 Configs de Upload e Compressao (Importante)

Todos os limites vem de `definitions/validationConfigs.ts` — **zero hardcoded nos composables**.

### IMAGE_UPLOAD_CONFIG

```typescript
export const IMAGE_UPLOAD_CONFIG = {
  maxSizeMB: 5,                                    // tamanho maximo
  validExtensions: ['jpg', 'jpeg', 'png', 'webp'], // extensoes aceitas
} as const;
```

Quer mudar o limite pra 10MB? Muda aqui — 1 lugar.

### COMPRESSION_SETTINGS

```typescript
export const COMPRESSION_SETTINGS = {
  mission:      { enabled: true, quality: 0.8, maxWidth: 800, maxHeight: 600 },
  supporters:   { enabled: true, quality: 0.8, maxWidth: 200, maxHeight: 200 },
  seo:          { enabled: true, quality: 0.9, maxWidth: 1200, maxHeight: 630 },
  testimonials: { enabled: true, quality: 0.8, maxWidth: 200, maxHeight: 200 },
} as const;
```

### Como adicionar nova categoria

**Passo 1** — Adicione em `COMPRESSION_SETTINGS`:

```typescript
export const COMPRESSION_SETTINGS = {
  // ... existentes
  gallery: { enabled: true, quality: 0.85, maxWidth: 1600, maxHeight: 900 },  // ← NOVA
} as const;
```

**Passo 2** — Use no composable:

```typescript
const url = await uploadImage(file, 'gallery');
// TypeScript ja aceita 'gallery' como categoria valida (tipo derivado)
```

**Pronto.** O tipo `CompressionCategory` e derivado das keys de `COMPRESSION_SETTINGS` — novas keys sao aceitas automaticamente.

---

## 🎨 Arquitetura (Opcional)

### Arquivos envolvidos

```
composables/
├── useImageCompression.ts    ← Canvas API (comprime)
├── useFirebaseStorage.ts     ← Firebase Storage (upload/delete/validate)

definitions/
├── validationConfigs.ts      ← IMAGE_UPLOAD_CONFIG + COMPRESSION_SETTINGS
```

### Diagrama de dependencias

```
definitions/validationConfigs.ts
    │  IMAGE_UPLOAD_CONFIG, COMPRESSION_SETTINGS
    │
    ▼
useFirebaseStorage()
    │  uploadImage() → usa settings por categoria
    │  validateImageFile() → usa limites do config
    │
    ├── useFirebase().$storage     ← Firebase Storage instance
    │
    └── useImageCompression()
         │  compressImage()        ← Canvas API pura
         └── Logger                ← logs estruturados
```

### Pipeline completo de upload

```
File original (2MB, 3000x2000, PNG)
  │
  ├─ validateImageFile(file)
  │   ✅ tipo: image/png
  │   ✅ tamanho: 2MB < 5MB
  │   ✅ extensao: png
  │
  ├─ uploadImage(file, 'mission')
  │   │
  │   ├─ COMPRESSION_SETTINGS.mission
  │   │   → enabled: true, quality: 0.8, max: 800x600
  │   │
  │   ├─ compressImage(file, { quality: 0.8, maxWidth: 800, maxHeight: 600 })
  │   │   ├─ loadImage → HTMLImageElement (3000x2000)
  │   │   ├─ calculateDimensions → 800x533 (aspect ratio mantido)
  │   │   ├─ Canvas → desenha redimensionado
  │   │   ├─ canvasToBlob(0.8) → JPEG ~150KB
  │   │   └─ new File → "foto_compressed.jpg" (150KB)
  │   │
  │   ├─ gera path: "images/mission/mission-1708345678901_compressed.jpg"
  │   │
  │   ├─ uploadFile(compressed, path)
  │   │   ├─ uploadBytes → Firebase Storage
  │   │   └─ getDownloadURL → URL publica
  │   │
  │   └─ return URL
  │
  └─ forms.mission.editable.image = URL
```

---

## 🔬 Como Funciona Por Dentro (Tecnico)

### Separacao de responsabilidades

```
useImageCompression     useFirebaseStorage
─────────────────       ──────────────────
Compressao              Armazenamento
Canvas API              Firebase SDK
Puro (sem deps)         Usa compression
Client-side only        Client-side only
Fallback seguro         Silent fail no delete
```

O user pediu essa separacao porque "comprimir e uma coisa, subir pro Firebase e outra — sao responsabilidades diferentes".

### Canvas API — como a compressao funciona

```typescript
// 1. File → Image (via createObjectURL, mais eficiente que readAsDataURL)
const img = new Image();
img.src = URL.createObjectURL(file);

// 2. Calcula dimensoes mantendo aspect ratio
// 3000x2000 com max 800x600:
//   width > maxWidth → height = 2000 * (800/3000) = 533, width = 800
//   height < maxHeight → ok
//   resultado: 800x533

// 3. Desenha no canvas redimensionado
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 533;
canvas.getContext('2d').drawImage(img, 0, 0, 800, 533);

// 4. Converte pra JPEG com qualidade
canvas.toBlob(callback, 'image/jpeg', 0.8);
// PNG de 2MB → JPEG de ~150KB
```

### Fallback na compressao

Se qualquer etapa falhar (Canvas nao suportado, imagem corrompida, etc.), `compressImage` retorna o arquivo **original**:

```typescript
try {
  // ... compress ...
  return compressed;
} catch (error) {
  logger.warn('Falha na compressao, retornando original');
  return file;  // ← fallback seguro
}
```

O `uploadImage` detecta isso comparando referencia (`compressed !== file`):

```typescript
isCompressed = compressed !== file;
// Se nao comprimiu, usa extensao original e nao adiciona "_compressed" no nome
```

### extractPathFromUrl — como deleta por URL

```typescript
// URL Firebase:
// https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/images%2Fmission%2Fimg.jpg?alt=media

// Regex extrai: images%2Fmission%2Fimg.jpg
// decodeURIComponent: images/mission/img.jpg
// deleteObject(ref($storage, 'images/mission/img.jpg'))
```

### Tipo CompressionCategory — derivado do config

```typescript
export type CompressionCategory = keyof typeof COMPRESSION_SETTINGS;
// = 'mission' | 'supporters' | 'seo' | 'testimonials'
```

Adicionar key no `COMPRESSION_SETTINGS` = automaticamente aceita como categoria.

---

## 📊 Referencia de Arquivos (Referencia)

### `composables/useImageCompression.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `useImageCompression()` | composable | Retorna funcoes de compressao |
| `ICompressionOptions` | interface | `{ quality, maxWidth, maxHeight }` |
| `UseImageCompression` | type | ReturnType do composable |

#### Retorno do useImageCompression()

| Retorno | Tipo | Descricao |
|---------|------|-----------|
| `compressImage(file, options?)` | `async` | Comprime imagem, retorna File (ou original se falhar) |
| `isCompressionSupported()` | `function` | Checa se Canvas API esta disponivel |

### `composables/useFirebaseStorage.ts`

| Export | Tipo | Descricao |
|--------|------|-----------|
| `useFirebaseStorage()` | composable | Retorna funcoes de storage |
| `IFileValidation` | interface | `{ isValid, error? }` |
| `CompressionCategory` | type | Keys do COMPRESSION_SETTINGS |
| `UseFirebaseStorage` | type | ReturnType do composable |

#### Retorno do useFirebaseStorage()

| Retorno | Tipo | Descricao |
|---------|------|-----------|
| `validateImageFile(file, maxSizeMB?)` | `function` | Valida tipo + tamanho + extensao |
| `uploadFile(file, path)` | `async` | Upload generico, retorna URL |
| `uploadImage(file, category, customPath?)` | `async` | Comprime + upload por categoria |
| `deleteFile(url)` | `async` | Deleta por URL (silent fail) |

### `definitions/validationConfigs.ts` (storage-related)

| Export | Tipo | Descricao |
|--------|------|-----------|
| `IMAGE_UPLOAD_CONFIG` | const | `{ maxSizeMB: 5, validExtensions: [...] }` |
| `COMPRESSION_SETTINGS` | const | Settings por categoria (mission, supporters, seo, testimonials) |

---

## 💡 FAQ (Suporte)

### Por que dois composables ao inves de um?

Responsabilidades separadas: comprimir e armazenar sao coisas diferentes. `useImageCompression` funciona sem Firebase (pode usar pra preview local). `useFirebaseStorage` funciona sem compressao (pode subir PDF, por exemplo).

### O que acontece se a compressao falhar?

Retorna o arquivo original e loga warning. O upload continua normalmente — so nao vai estar comprimido. Isso e intencional (fallback seguro).

### O deleteFile pode falhar silenciosamente?

Sim. Se a URL for invalida, o arquivo nao existir, ou o Firebase retornar erro, o `deleteFile` loga warning mas nao lanca excecao. Isso evita que cleanup de imagens quebre o fluxo de save.

### Posso mudar o tamanho maximo sem mexer no composable?

Sim. Mude `IMAGE_UPLOAD_CONFIG.maxSizeMB` em `definitions/validationConfigs.ts`. O composable le deste config automaticamente. O parametro `maxSizeMB` do `validateImageFile` tambem aceita override pontual.

### Como o path do upload e gerado?

```
images/{category}/{category}-{timestamp}{_compressed}.{ext}
```

Exemplos:
- `images/mission/mission-1708345678901_compressed.jpg`
- `images/seo/seo-1708345678902_compressed.jpg`
- `images/supporters/supporters-1708345678903.png` (se compressao desabilitada)

### Posso fazer upload de nao-imagem?

Sim, com `uploadFile(file, path)` diretamente. Ele nao valida tipo — aceita qualquer arquivo. So o `uploadImage` e `validateImageFile` sao especificos pra imagens.

---

*📅 Criado em*: 19 FEV 2026
*📋 Versao*: 1.0
*👥 Responsavel*: CbBelmante
*🏷️ Tags*: [arquitetura, admin, storage, upload, compressao, firebase, imagens, canvas]
