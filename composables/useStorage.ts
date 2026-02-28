/**
 * 🔌 useStorage - Factory de Storage Adapter
 *
 * Retorna o adapter de storage ativo baseado na env var NUXT_PUBLIC_STORAGE_PROVIDER.
 * Os consumers usam APENAS este composable. Nunca importam adapters diretamente.
 *
 * Providers disponiveis:
 * - 'cloudinary' (default) → useCloudinaryStorage
 * - 'firebase' → useFirebaseStorage
 *
 * @dependencias
 * - composables/useCloudinaryStorage
 * - composables/useFirebaseStorage
 * - types/storage (IStorageAdapter)
 */

import { useCloudinaryStorage } from '@composables/useCloudinaryStorage';
import { useFirebaseStorage } from '@composables/useFirebaseStorage';
import type { IStorageAdapter } from '@/types/storage';

export function useStorage(): IStorageAdapter {
  const config = useRuntimeConfig();
  const provider = (config.public.storageProvider as string) || 'cloudinary';

  switch (provider) {
    case 'firebase':
      return useFirebaseStorage();
    case 'cloudinary':
      return useCloudinaryStorage();
    default:
      throw new Error(`Storage provider desconhecido: "${provider}". Use 'cloudinary' ou 'firebase'.`);
  }
}
