/**
 * 📦 Storage Types - Contrato para Storage Adapters
 *
 * Interface que todo adapter de storage (Firebase, Cloudinary, S3, etc) deve implementar.
 * Os consumers importam tipos DAQUI, nunca direto de um adapter especifico.
 *
 * @module types/storage
 */

import type { COMPRESSION_SETTINGS } from '@definitions/validationConfigs';

// ============== INTERFACES ==============

/** Resultado de validacao de arquivo */
export interface IFileValidation {
  readonly isValid: boolean;
  readonly error?: string;
}

/** Contrato que todo storage adapter implementa */
export interface IStorageAdapter {
  /** Valida se arquivo e imagem aceitavel (tipo, tamanho, extensao) */
  validateImageFile(file: File, maxSizeMB?: number): IFileValidation;

  /** Upload generico de qualquer arquivo para um path */
  uploadFile(file: File, path: string): Promise<string>;

  /** Upload de imagem com compressao automatica por categoria */
  uploadImage(file: File, category: CompressionCategory, customPath?: string): Promise<string>;

  /** Deleta arquivo pela URL. Silent fail se nao suportado pelo provider. */
  deleteFile(url: string): Promise<void>;
}

// ============== TYPES ==============

/** Categorias de compressao disponiveis (keys de COMPRESSION_SETTINGS) */
export type CompressionCategory = keyof typeof COMPRESSION_SETTINGS;
