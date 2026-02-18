/**
 * Editor Types - Elas Podem Admin
 *
 * Camada 4: Types do orquestrador (usePageEditor), validacao e audit log.
 *
 * Estes tipos definem a infraestrutura do editor:
 * - PageSectionConfig: como cada secao se comporta (validate, save, cleanup)
 * - PageEditorConfig: configuracao geral do editor de pagina
 * - SaveResult: resultado de operacoes de save
 * - ValidationResult: resultado de validacoes
 * - IAdminLog: registro de acoes do admin (audit trail)
 *
 * @module types/admin/editor
 *
 * @dependencias
 * - vue (Ref)
 */

import type { Ref } from 'vue';

// ============================================================
// PAGE EDITOR — Orquestrador de secoes
// ============================================================

/**
 * Configuracao de uma secao individual no editor.
 *
 * O usePageEditor itera sobre um array de PageSectionConfig
 * para detectar mudancas, validar e salvar cada secao independentemente.
 */
export interface PageSectionConfig {
  /** Nome da secao para exibicao e logging (ex: 'Hero', 'Missao') */
  name: string;
  /** Vue ref ao estado do formulario da secao */
  form: Ref<any>;
  /** Getter dos dados originais do Firebase (para detectar mudancas via deep compare) */
  originalData: () => any;
  /** Funcao de validacao que retorna { isValid, errors[] } */
  validator: (data: any) => ValidationResult;
  /** Funcao de save que persiste no Firestore */
  saveFunction: (data: any) => Promise<void>;
  /** Getter das URLs de imagem para cleanup (compara old vs new para deletar orfas) */
  getImageUrls: () => { old?: string; new?: string };
  /** Callback para atualizar o estado local apos save bem-sucedido */
  updateLocalData: (data: any) => void;
}

/**
 * Configuracao geral do editor de pagina.
 *
 * Agrupa todas as secoes e controla o fluxo de save/cancel.
 */
export interface PageEditorConfig {
  /** Nome da pagina (ex: 'home') */
  pageName: string;
  /** Array de configuracoes de cada secao */
  sections: PageSectionConfig[];
  /** Ref aos dados completos da pagina (para reload apos save) */
  pageData: Ref<any>;
  /** Tracking de uploads temporarios para cleanup no cancel */
  tempUploadedImages: Ref<string[]>;
}

// ============================================================
// SAVE RESULT
// ============================================================

/** Resultado de uma operacao de save (uma ou mais secoes) */
export interface SaveResult {
  /** Se todas as secoes salvaram com sucesso */
  success: boolean;
  /** Mensagem descritiva do resultado */
  message: string;
  /** Nomes das secoes que foram salvas */
  savedSections: string[];
  /** Erro capturado (presente apenas se success === false) */
  error?: Error;
}

// ============================================================
// VALIDATION
// ============================================================

/** Resultado de validacao de uma secao */
export interface ValidationResult {
  /** Se todos os campos passaram na validacao */
  isValid: boolean;
  /** Lista de mensagens de erro (vazia se isValid === true) */
  errors: string[];
}

// ============================================================
// ADMIN LOG (Audit Trail)
// ============================================================

/** Registro de acao do admin para auditoria */
export interface IAdminLog {
  /** Tipo de acao (ex: 'save', 'delete', 'upload') */
  action: string;
  /** Detalhes da acao (secoes afetadas, campos alterados, etc.) */
  details: Record<string, any>;
  /** ISO timestamp da acao */
  timestamp: string;
  /** Email do admin que executou a acao */
  user: string;
}
