/**
 * 🎣 useImageCompression - Compressao de imagens via Canvas API
 *
 * Redimensiona e comprime imagens no browser antes do upload.
 * Funciona inteiramente client-side (sem servidor).
 * Fallback automatico: se compressao falhar, retorna o arquivo original.
 *
 * @dependencias
 * - utils/Logger
 */

// ============== DEPENDENCIAS INTERNAS ==============

import { Logger } from '@utils/Logger';

// ============== INTERFACES ==============

/** Opcoes de compressao (todas opcionais — tem defaults) */
export interface ICompressionOptions {
  /** Qualidade JPEG: 0.1 (minima) a 1.0 (maxima). Default: 0.8 */
  readonly quality: number;
  /** Largura maxima em pixels. Default: 1920 */
  readonly maxWidth: number;
  /** Altura maxima em pixels. Default: 1080 */
  readonly maxHeight: number;
}

// ============== CONSTANTS ==============

const logger = Logger.child({ composable: 'useImageCompression' });

const DEFAULT_OPTIONS: ICompressionOptions = {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
};

// ============== HELPERS INTERNOS ==============

/**
 * Carrega um File como HTMLImageElement.
 * Usa createObjectURL (mais eficiente que readAsDataURL).
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao carregar imagem'));
    };

    img.src = url;
  });
}

/**
 * Calcula dimensoes finais mantendo aspect ratio.
 * Reduz so se ultrapassar maxWidth ou maxHeight.
 */
function calculateDimensions(opts: {
  originalWidth: number;
  originalHeight: number;
  maxWidth: number;
  maxHeight: number;
}): { width: number; height: number } {
  let width = opts.originalWidth;
  let height = opts.originalHeight;

  if (width > opts.maxWidth) {
    height = Math.round(height * (opts.maxWidth / width));
    width = opts.maxWidth;
  }

  if (height > opts.maxHeight) {
    width = Math.round(width * (opts.maxHeight / height));
    height = opts.maxHeight;
  }

  return { width, height };
}

// Converte canvas para Blob. JPEG usa quality; PNG/WebP preservam transparência.
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Falha ao converter canvas para blob'));
      },
      mimeType,
      mimeType === 'image/jpeg' ? quality : undefined
    );
  });
}

// Formatos que suportam transparência (alpha channel)
function supportsAlpha(file: File): boolean {
  return file.type === 'image/png' || file.type === 'image/webp';
}

// Gera nome comprimido preservando extensão: foto.webp → foto_compressed.webp
function generateCompressedName(originalName: string, mimeType: string): string {
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex > 0 ? originalName.substring(0, dotIndex) : originalName;
  const extMap: Record<string, string> = { 'image/png': 'png', 'image/webp': 'webp' };
  return `${baseName}_compressed.${extMap[mimeType] ?? 'jpg'}`;
}

// ============== COMPOSABLE ==============

export function useImageCompression() {
  // ===== UTILS =====

  /**
   * Checa se o browser suporta Canvas API (necessaria pra compressao).
   */
  const isCompressionSupported = (): boolean => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch {
      return false;
    }
  };

  // ===== COMPRESSAO =====

  /**
   * Comprime uma imagem redimensionando e ajustando qualidade JPEG.
   *
   * Fluxo:
   * 1. Carrega imagem no browser (createObjectURL)
   * 2. Calcula dimensoes mantendo aspect ratio
   * 3. Desenha no canvas redimensionado
   * 4. Converte pra JPEG com qualidade especificada
   * 5. Retorna novo File
   *
   * Se falhar em qualquer etapa, retorna o arquivo original (fallback seguro).
   */
  const compressImage = async (
    file: File,
    options: Partial<ICompressionOptions> = {}
  ): Promise<File> => {
    const opts: ICompressionOptions = { ...DEFAULT_OPTIONS, ...options };

    if (!isCompressionSupported()) {
      logger.warn('Canvas API nao suportada, retornando original');
      return file;
    }

    try {
      const img = await loadImage(file);

      const { width, height } = calculateDimensions({
        originalWidth: img.width,
        originalHeight: img.height,
        maxWidth: opts.maxWidth,
        maxHeight: opts.maxHeight,
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d')!;
      const hasAlpha = supportsAlpha(file);

      // PNG/WebP: fundo transparente. JPEG: fundo branco (evita fundo preto).
      if (!hasAlpha) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = hasAlpha ? (file.type as 'image/png' | 'image/webp') : 'image/jpeg';
      const blob = await canvasToBlob(canvas, mimeType, opts.quality);
      const compressedName = generateCompressedName(file.name, mimeType);
      const compressed = new File([blob], compressedName, { type: mimeType });

      logger.debug('Imagem comprimida', {
        original: `${(file.size / 1024).toFixed(0)}KB (${img.width}x${img.height})`,
        comprimido: `${(compressed.size / 1024).toFixed(0)}KB (${width}x${height})`,
        reducao: `${Math.round((1 - compressed.size / file.size) * 100)}%`,
      });

      return compressed;
    } catch (error) {
      logger.warn('Falha na compressao, retornando original', {
        arquivo: file.name,
        erro: (error as Error).message,
      });
      return file;
    }
  };

  // ===== RETURN =====

  return {
    compressImage,
    isCompressionSupported,
  };
}

// ============== EXPORTS ==============

export type UseImageCompression = ReturnType<typeof useImageCompression>;
