/**
 * ☁️ useCloudinaryStorage - Adapter de Storage para Cloudinary
 *
 * Upload via fetch puro (unsigned upload, sem SDK). Requer:
 * - NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME no .env
 * - NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET no .env (criar em Settings → Upload → Unsigned)
 *
 * Delete: no-op com log (Cloudinary nao suporta delete client-side sem api_secret).
 *
 * @dependencias
 * - composables/useImageCompression (compressImage)
 * - definitions/validationConfigs (COMPRESSION_SETTINGS, IMAGE_UPLOAD_CONFIG)
 * - utils/Logger
 */

// ============== DEPENDENCIAS INTERNAS ==============

import { useI18n } from 'vue-i18n';
import { useConfig } from '@config/index';
import { useImageCompression } from '@composables/useImageCompression';
import { COMPRESSION_SETTINGS, IMAGE_UPLOAD_CONFIG } from '@definitions/validationConfigs';
import { Logger } from '@cb/components';
import type { IStorageAdapter, IFileValidation, CompressionCategory } from '@/types/storage';

// ============== CONSTANTS ==============

const logger = Logger.child({ composable: 'useCloudinaryStorage' });

// ============== HELPERS INTERNOS ==============

/** Extrai a extensao do nome do arquivo. hero-bg.png → 'png' */
function getExtension(fileName: string): string {
  return (fileName.split('.').pop() || 'jpg').toLowerCase();
}

// ============== COMPOSABLE ==============

export function useCloudinaryStorage(): IStorageAdapter {
  const { t } = useI18n();
  const { storage } = useConfig();
  const cloudName = storage.cloudinaryCloudName;
  const uploadPreset = storage.cloudinaryUploadPreset;
  const { compressImage } = useImageCompression();

  // ===== VALIDACAO =====

  /**
   * Valida se um arquivo e uma imagem aceitavel.
   *
   * Checa: tipo MIME (image/*), tamanho, extensao.
   * Limites vem de IMAGE_UPLOAD_CONFIG (definitions/validationConfigs.ts).
   */
  const validateImageFile = (
    file: File,
    maxSizeMB: number = IMAGE_UPLOAD_CONFIG.maxSizeMB
  ): IFileValidation => {
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: t('admin.storage.notAnImage') };
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return { isValid: false, error: t('admin.storage.tooLarge', { max: maxSizeMB }) };
    }

    const ext = getExtension(file.name);
    if (!(IMAGE_UPLOAD_CONFIG.validExtensions as readonly string[]).includes(ext)) {
      return {
        isValid: false,
        error: t('admin.storage.unsupportedExt', {
          ext,
          formats: IMAGE_UPLOAD_CONFIG.validExtensions.join(', '),
        }),
      };
    }

    return { isValid: true };
  };

  // ===== UPLOAD =====

  /**
   * Upload generico para o Cloudinary.
   * Retorna a secure_url (HTTPS) do arquivo enviado.
   *
   * @param file - Arquivo para upload
   * @param path - Usado como folder no Cloudinary
   */
  const uploadFile = async (file: File, path: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', path);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Cloudinary upload falhou: ${(errorData as { error?: { message?: string } })?.error?.message || response.statusText}`
      );
    }

    const data = (await response.json()) as { secure_url: string; public_id: string };

    logger.info('Arquivo enviado (Cloudinary)', {
      folder: path,
      tamanho: `${(file.size / 1024).toFixed(0)}KB`,
      publicId: data.public_id,
    });

    return data.secure_url;
  };

  /**
   * Upload de imagem com compressao automatica por categoria.
   *
   * Fluxo:
   * 1. Le settings de COMPRESSION_SETTINGS[category]
   * 2. Comprime via useImageCompression (se enabled)
   * 3. Faz upload pro folder: images/{category}
   */
  const uploadImage = async (
    file: File,
    category: CompressionCategory,
    customPath?: string
  ): Promise<string> => {
    const settings = COMPRESSION_SETTINGS[category];
    let fileToUpload = file;

    if (settings.enabled) {
      const compressed = await compressImage(file, {
        quality: settings.quality,
        maxWidth: settings.maxWidth,
        maxHeight: settings.maxHeight,
      });

      // compressImage retorna o original se falhar — checa se mudou
      fileToUpload = compressed !== file ? compressed : file;
    }

    const folder = customPath ?? `images/${category}`;
    return uploadFile(fileToUpload, folder);
  };

  // ===== DELETE =====

  /**
   * Delete no-op — Cloudinary nao suporta delete client-side (precisa api_secret).
   *
   * Se no futuro precisar deletar, criar server route /api/storage/delete
   * que usa a Admin API do Cloudinary com api_secret no servidor.
   */
  const deleteFile = async (url: string): Promise<void> => {
    logger.info('Delete ignorado (Cloudinary nao suporta client-side)', { url });
  };

  // ===== RETURN =====

  return {
    validateImageFile,
    uploadFile,
    uploadImage,
    deleteFile,
  };
}
