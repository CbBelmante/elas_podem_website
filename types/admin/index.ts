/**
 * Admin Types - Elas Podem
 *
 * Barrel export de todas as interfaces do admin, organizadas em 4 camadas:
 *
 * - sections.ts  → Camada 1: formato exato no Firestore (flat/completo)
 * - editable.ts  → Camada 2: separacao editable/readonly para o formulario
 * - formsData.ts → Camada 3: container unico do editor (ref reativo)
 * - editor.ts    → Camada 4: orquestrador, validacao, audit log
 *
 * O QUE VAI AQUI:
 * - Interfaces de dados do admin (shapes de secoes, formularios, editor)
 * - Types de validacao e resultado de operacoes
 *
 * O QUE NAO VAI AQUI:
 * - Constantes (THEME_COLOR_OPTIONS, ICON_OPTIONS) → vao em definitions/
 * - Configs de validacao (HERO_CONFIG, etc.) → vao em definitions/
 * - Funcoes utilitarias (separate/combine) → vao em utils/
 *
 * @module types/admin
 */

// ---- Camada 1: Section Data (formato Firestore) ----
export type {
  IHeroStat,
  IHeroSection,
  IMissionSection,
  IProgram,
  ITestimonial,
  ISupporter,
  IContactMethod,
  IContactSection,
  ICtaSection,
  ISeoOg,
  ISeo,
  IHomePageData,
} from './sections';

// ---- Camada 2: Editable/Readonly split ----
export type {
  IHeroEditable,
  IMissionEditable,
  IProgramEditable,
  IProgramReadonly,
  ITestimonialEditable,
  ISupporterEditable,
  ISupporterReadonly,
  IContactMethodEditable,
  IContactMethodReadonly,
  IContactEditable,
  IContactReadonly,
  ICtaEditable,
  ISeoEditable,
  ISeoReadonly,
} from './editable';

// ---- Camada 3: FormsData (container do editor) ----
export type { IHomeFormsData } from './formsData';

// ---- Camada 4: Editor/Orquestrador ----
export type {
  PageSectionConfig,
  PageEditorConfig,
  SaveResult,
  ValidationResult,
  IAdminLog,
} from './editor';
