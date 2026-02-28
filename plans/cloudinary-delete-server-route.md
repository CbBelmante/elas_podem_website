# Cloudinary Delete — Server Route

## Contexto

O `deleteFile()` no adapter Cloudinary e um **no-op** — Cloudinary nao suporta delete client-side porque a Admin API exige `api_secret` (credencial privada). Imagens substituidas no admin ficam orfas no Cloudinary.

O objetivo e criar uma server route Nuxt (`/api/storage/delete`) que recebe o `public_id` do Cloudinary e deleta via Admin API no servidor, onde o `api_secret` pode ser usado com seguranca.

## Onde deleteFile e chamado hoje

- `composables/usePageEditor.ts` — 2 lugares:
  - `cleanupOldImage(oldUrl)` — quando o admin troca uma imagem por outra
  - `cleanupTempUploads()` — quando o admin faz upload mas cancela/sai sem salvar

Ambos chamam `useStorage().deleteFile(url)` que no adapter Cloudinary hoje so loga e ignora.

## Escopo

1. **Server route** — `server/api/storage/delete.post.ts`
2. **Env vars** — `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` (privadas, so servidor)
3. **nuxt.config.ts** — declarar as vars em `runtimeConfig` (privado, nao `public`)
4. **useCloudinaryStorage** — `deleteFile()` chama a server route ao inves de no-op
5. **config/index.ts** — nao precisa mudar (credenciais de delete sao privadas, so no servidor)

## Arquivos a criar/modificar

| Arquivo | O que muda |
|---------|-----------|
| `server/api/storage/delete.post.ts` | **CRIAR** — server route que chama Cloudinary Admin API |
| `composables/useCloudinaryStorage.ts` | `deleteFile()` — chamar `$fetch('/api/storage/delete')` |
| `nuxt.config.ts` | Adicionar `cloudinaryApiKey` e `cloudinaryApiSecret` ao `runtimeConfig` (privado) |

## 1. Server route — `server/api/storage/delete.post.ts`

Nuxt server routes vivem em `server/api/`. Um arquivo `delete.post.ts` cria endpoint `POST /api/storage/delete`.

```typescript
// server/api/storage/delete.post.ts
export default defineEventHandler(async (event) => {
  const { publicId } = await readBody(event);

  if (!publicId || typeof publicId !== 'string') {
    throw createError({ statusCode: 400, message: 'publicId obrigatorio' });
  }

  const config = useRuntimeConfig();
  const cloudName = config.public.cloudinaryCloudName;
  const apiKey = config.cloudinaryApiKey;       // privado — so servidor
  const apiSecret = config.cloudinaryApiSecret; // privado — so servidor

  if (!cloudName || !apiKey || !apiSecret) {
    throw createError({ statusCode: 500, message: 'Cloudinary nao configurado no servidor' });
  }

  // Cloudinary Admin API — destroy
  // https://cloudinary.com/documentation/image_upload_api_reference#destroy
  const timestamp = Math.floor(Date.now() / 1000);

  // Gerar signature: sha1("public_id={id}&timestamp={ts}{api_secret}")
  const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1(signaturePayload);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', apiKey);
  formData.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();

  if (data.result !== 'ok') {
    console.warn('[Cloudinary delete]', data);
  }

  return { success: data.result === 'ok' };
});
```

Para o SHA-1, usar `crypto` do Node (disponivel no servidor Nuxt):
```typescript
import { createHash } from 'node:crypto';

function sha1(input: string): string {
  return createHash('sha1').update(input).digest('hex');
}
```

## 2. nuxt.config.ts — runtimeConfig privado

```typescript
runtimeConfig: {
  // PRIVADO (so servidor) — NAO fica em runtimeConfig.public
  cloudinaryApiKey: '',      // NUXT_CLOUDINARY_API_KEY
  cloudinaryApiSecret: '',   // NUXT_CLOUDINARY_API_SECRET

  public: {
    // ... existente (cloudinaryCloudName, cloudinaryUploadPreset)
  },
},
```

Nuxt mapeia automaticamente:
- `NUXT_CLOUDINARY_API_KEY` do .env → `runtimeConfig.cloudinaryApiKey`
- `NUXT_CLOUDINARY_API_SECRET` do .env → `runtimeConfig.cloudinaryApiSecret`

## 3. useCloudinaryStorage — deleteFile real

```typescript
const deleteFile = async (url: string): Promise<void> => {
  // Extrair public_id da URL do Cloudinary
  // URL: https://res.cloudinary.com/{cloud}/image/upload/v1234567/images/mission/abc123.jpg
  // public_id: images/mission/abc123
  const publicId = extractPublicId(url);

  if (!publicId) {
    logger.warn('Nao foi possivel extrair public_id da URL', { url });
    return;
  }

  try {
    await $fetch('/api/storage/delete', {
      method: 'POST',
      body: { publicId },
    });
    logger.debug('Arquivo deletado (Cloudinary)', { publicId });
  } catch (error) {
    logger.warn('Falha ao deletar arquivo (Cloudinary)', {
      publicId,
      erro: (error as Error).message,
    });
  }
};
```

Helper para extrair public_id:
```typescript
function extractPublicId(url: string): string | null {
  // https://res.cloudinary.com/{cloud}/image/upload/v1234567/folder/file.jpg
  // → folder/file (sem extensao, sem v-timestamp)
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
```

## 4. .env — novas vars

```env
# Cloudinary — credenciais privadas (server-side only)
NUXT_CLOUDINARY_API_KEY=sua_api_key
NUXT_CLOUDINARY_API_SECRET=seu_api_secret
```

Pegar no Cloudinary Dashboard > Settings > API Keys.

## Verificacao

1. Adicionar `NUXT_CLOUDINARY_API_KEY` e `NUXT_CLOUDINARY_API_SECRET` no `.env`
2. `npm run dev` — servidor inicia sem erros
3. Admin: trocar imagem de uma secao → salvar → verificar nos logs que `deleteFile` chamou a server route
4. Cloudinary Dashboard > Media Library → imagem antiga deve ter sido deletada
5. Admin: fazer upload → sair sem salvar → verificar que cleanup deletou a imagem temporaria
