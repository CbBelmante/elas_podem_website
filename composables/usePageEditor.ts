/**
 * 🎣 usePageEditor - Orquestrador de experiencia do editor
 *
 * Change tracking, image cleanup e navigation guard.
 * NAO faz save (save esta no usePageData factory).
 *
 * Responsabilidades:
 * - Detectar mudancas no formulario (hasChanges)
 * - Limpar imagens antigas quando URL muda (cleanupOldImage)
 * - Limpar uploads temporarios no cancel/exit (cleanupTempUploads)
 * - Prevenir saida com mudancas nao salvas (canExit)
 *
 * @dependencias
 * - composables/useFirebaseStorage (deleteFile)
 * - utils/Logger
 */

// ============== DEPENDENCIAS INTERNAS ==============

import { useFirebaseStorage } from '@composables/useFirebaseStorage';
import { Logger } from '@utils/Logger';

// ============== CONSTANTS ==============

const logger = Logger.child({ composable: 'usePageEditor' });

// ============== COMPOSABLE ==============

export function usePageEditor() {
  const { deleteFile } = useFirebaseStorage();

  // ===== STATE =====

  const hasChanges = ref(false);

  // ===== CHANGE TRACKING =====

  /** Marca que o formulario tem mudancas nao salvas */
  const markAsChanged = (): void => {
    hasChanges.value = true;
  };

  /** Reseta flag de mudancas (chamar apos save bem-sucedido) */
  const resetChanges = (): void => {
    hasChanges.value = false;
  };

  // ===== IMAGE CLEANUP =====

  /**
   * Deleta imagem antiga do Storage quando a URL muda.
   *
   * So deleta se:
   * 1. oldUrl existe
   * 2. oldUrl e diferente de newUrl (realmente mudou)
   * 3. oldUrl e do Firebase Storage (contem 'firebase')
   *
   * Silent fail — loga warning se falhar mas nao lanca erro.
   */
  const cleanupOldImage = async (oldUrl?: string, newUrl?: string): Promise<void> => {
    if (!oldUrl) return;
    if (oldUrl === newUrl) return;
    if (!oldUrl.includes('firebase')) return;

    await deleteFile(oldUrl);
    logger.debug('Imagem antiga removida', { oldUrl });
  };

  /**
   * Deleta todos os uploads temporarios do Storage.
   *
   * Chamado quando o usuario sai sem salvar — evita lixo no Storage.
   * Limpa o array apos deletar.
   */
  const cleanupTempUploads = async (tempUploadedImages: Ref<string[]>): Promise<void> => {
    if (tempUploadedImages.value.length === 0) return;

    logger.debug('Limpando uploads temporarios', {
      quantidade: tempUploadedImages.value.length,
    });

    for (const url of tempUploadedImages.value) {
      await deleteFile(url);
    }

    tempUploadedImages.value = [];
  };

  // ===== NAVIGATION GUARD =====

  /**
   * Verifica se o usuario pode sair da pagina.
   *
   * Se tem mudancas nao salvas, mostra confirm do browser.
   * Se confirmar saida (ou nao tem mudancas), limpa uploads temporarios.
   *
   * Uso: chamar antes de navigateTo() ou no onBeforeRouteLeave.
   */
  const canExit = async (tempUploadedImages: Ref<string[]>): Promise<boolean> => {
    if (hasChanges.value) {
      const confirmed = window.confirm('Voce tem alteracoes nao salvas. Deseja sair mesmo assim?');

      if (!confirmed) return false;
    }

    await cleanupTempUploads(tempUploadedImages);
    return true;
  };

  // ===== RETURN =====

  return {
    // State
    hasChanges: readonly(hasChanges),

    // Change tracking
    markAsChanged,
    resetChanges,

    // Image cleanup
    cleanupOldImage,
    cleanupTempUploads,

    // Navigation guard
    canExit,
  };
}

// ============== EXPORTS ==============

export type UsePageEditor = ReturnType<typeof usePageEditor>;
