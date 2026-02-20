/**
 * 🎣 useFirebaseStorage - Upload e gerenciamento de arquivos no Firebase Storage
 *
 * Upload generico, upload com compressao por categoria,
 * delete com silent fail, e validacao de imagens.
 *
 * Compressao e delegada ao useImageCompression (responsabilidades separadas).
 *
 * @dependencias
 * - firebase/storage (ref, uploadBytes, getDownloadURL, deleteObject)
 * - composables/useFirebase ($storage)
 * - composables/useImageCompression (compressImage)
 * - definitions/validationConfigs (COMPRESSION_SETTINGS, IMAGE_UPLOAD_CONFIG)
 * - utils/Logger
 */

// ============== DEPENDENCIAS EXTERNAS ==============

import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// ============== DEPENDENCIAS INTERNAS ==============

import { useFirebase } from '@composables/useFirebase';
import { useImageCompression } from '@composables/useImageCompression';
import { COMPRESSION_SETTINGS, IMAGE_UPLOAD_CONFIG } from '@definitions/validationConfigs';
import { Logger } from '@utils/Logger';

// ============== INTERFACES ==============

/** Resultado de validacao de arquivo */
export interface IFileValidation {
  readonly isValid: boolean;
  readonly error?: string;
}

// ============== TYPES ==============

/** Categorias de compressao disponiveis (keys de COMPRESSION_SETTINGS) */
export type CompressionCategory = keyof typeof COMPRESSION_SETTINGS;

// ============== CONSTANTS ==============

const logger = Logger.child({ composable: 'useFirebaseStorage' });

// ============== HELPERS INTERNOS ==============

/**
 * Extrai a extensao do nome do arquivo.
 * hero-bg.png → 'png'
 */
function getExtension(fileName: string): string {
  return (fileName.split('.').pop() || 'jpg').toLowerCase();
}

/**
 * Extrai o path do Storage a partir de uma URL do Firebase.
 *
 * URL Firebase: https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/images%2Fmission%2Fimg.jpg?alt=media
 * Path extraido: images/mission/img.jpg
 */
function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/o\/([^?]+)/);

    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }

    return null;
  } catch {
    return null;
  }
}

// ============== COMPOSABLE ==============

export function useFirebaseStorage() {
  const { $storage } = useFirebase();
  const { compressImage } = useImageCompression();

  // ===== VALIDACAO =====

  /**
   * Valida se um arquivo e uma imagem aceitavel.
   *
   * Checa: tipo MIME (image/*), tamanho, extensao.
   * Limites vem de IMAGE_UPLOAD_CONFIG (definitions/validationConfigs.ts).
   * O parametro maxSizeMB sobrescreve o config se necessario.
   */
  const validateImageFile = (
    file: File,
    maxSizeMB: number = IMAGE_UPLOAD_CONFIG.maxSizeMB
  ): IFileValidation => {
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Arquivo precisa ser uma imagem' };
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return { isValid: false, error: `Imagem excede ${maxSizeMB}MB` };
    }

    const ext = getExtension(file.name);
    if (!(IMAGE_UPLOAD_CONFIG.validExtensions as readonly string[]).includes(ext)) {
      return {
        isValid: false,
        error: `Extensao ".${ext}" nao suportada. Use: ${IMAGE_UPLOAD_CONFIG.validExtensions.join(', ')}`,
      };
    }

    return { isValid: true };
  };

  // ===== UPLOAD =====

  /**
   * Upload generico — qualquer arquivo, qualquer path.
   * Retorna a download URL do Firebase Storage.
   */
  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileRef = storageRef($storage, path);

    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    logger.info('Arquivo enviado', {
      path,
      tamanho: `${(file.size / 1024).toFixed(0)}KB`,
    });

    return url;
  };

  /**
   * Upload de imagem com compressao automatica por categoria.
   *
   * Fluxo:
   * 1. Le settings de COMPRESSION_SETTINGS[category]
   * 2. Comprime via useImageCompression (se enabled)
   * 3. Gera filename unico com timestamp
   * 4. Faz upload pro path: images/{category}/{fileName}
   *
   * @param file - Arquivo de imagem
   * @param category - Categoria de compressao ('mission', 'supporters', 'seo', 'testimonials')
   * @param customPath - Path customizado (sobrescreve o path gerado automaticamente)
   */
  const uploadImage = async (
    file: File,
    category: CompressionCategory,
    customPath?: string
  ): Promise<string> => {
    const settings = COMPRESSION_SETTINGS[category];
    let fileToUpload = file;
    let isCompressed = false;

    if (settings.enabled) {
      const compressed = await compressImage(file, {
        quality: settings.quality,
        maxWidth: settings.maxWidth,
        maxHeight: settings.maxHeight,
      });

      // compressImage retorna o original se falhar — checa se mudou
      isCompressed = compressed !== file;
      fileToUpload = compressed;
    }

    const timestamp = Date.now();
    const ext = isCompressed ? 'jpg' : getExtension(file.name);
    const suffix = isCompressed ? '_compressed' : '';
    const fileName = `${category}-${timestamp}${suffix}.${ext}`;
    const path = customPath ?? `images/${category}/${fileName}`;

    return uploadFile(fileToUpload, path);
  };

  // ===== DELETE =====

  /**
   * Deleta um arquivo do Firebase Storage pela URL.
   *
   * Silent fail — loga warning se falhar mas nao lanca erro.
   * Isso evita que falha de cleanup quebre o fluxo de save.
   */
  const deleteFile = async (url: string): Promise<void> => {
    const path = extractPathFromUrl(url);

    if (!path) {
      logger.warn('Nao foi possivel extrair path da URL', { url });
      return;
    }

    try {
      const fileRef = storageRef($storage, path);
      await deleteObject(fileRef);
      logger.debug('Arquivo deletado', { path });
    } catch (error) {
      logger.warn('Falha ao deletar arquivo', {
        path,
        erro: (error as Error).message,
      });
    }
  };

  // ===== RETURN =====

  return {
    validateImageFile,
    uploadFile,
    uploadImage,
    deleteFile,
  };
}

// ============== EXPORTS ==============

export type UseFirebaseStorage = ReturnType<typeof useFirebaseStorage>;
