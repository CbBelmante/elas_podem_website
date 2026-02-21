/**
 * Admin Types - Elas Podem
 *
 * Barrel export de todas as interfaces do admin, organizadas em 4 camadas:
 *
 * - sections.ts  → Camada 1: formato exato no Firestore (flat/completo)
 * - editable.ts  → Camada 2: separacao editable/readonly para o formulario
 * - formsData.ts → Camada 3-4: container do editor + orquestrador, validacao, audit log
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
  IProgramsSection,
  ITestimonial,
  ISupporter,
  ISupportersSection,
  IContactMethod,
  IContactSection,
  IValue,
  ICtaSection,
  ISeoOg,
  ISeo,
  IHomePageData,
} from './sections';

// ---- Camada 2: Editable/Readonly split (derivados de sectionFields.ts) ----
export type {
  FieldsByMode,
  PreservedFields,
  IHeroEditable,
  IMissionEditable,
  IProgramEditable,
  IProgramReadonly,
  IProgramsEditable,
  IProgramsReadonly,
  ITestimonialEditable,
  ISupporterEditable,
  ISupporterReadonly,
  ISupportersEditable,
  ISupportersReadonly,
  IContactMethodEditable,
  IContactMethodReadonly,
  IContactEditable,
  IContactReadonly,
  IValueEditable,
  ICtaEditable,
  ISeoEditable,
  ISeoReadonly,
} from './editable';

// ---- Camada 3-4: FormsData + Editor/Orquestrador ----
export type {
  IHomeFormsData,
  IPageSectionConfig,
  IPageEditorConfig,
  ISaveResult,
  IValidationResult,
  IAdminLog,
} from './formsData';
