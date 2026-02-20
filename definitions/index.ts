/**
 * Definitions - Elas Podem
 *
 * Barrel export de todas as constantes, configs e funcoes de validacao.
 *
 * O QUE VAI AQUI:
 * - Constantes (THEME_COLOR_OPTIONS, ICON_OPTIONS)
 * - Configs de validacao (*_CONFIG, COMPRESSION_SETTINGS)
 * - Funcoes de validacao (createValidationRules, isValidUrl)
 *
 * O QUE NAO VAI AQUI:
 * - Interfaces de entidades (IHeroSection, IProgram) → vao em types/admin
 * - Funcoes de conversao de dados (separate/combine) → vao em utils/
 * - Composables (useAuth, usePageData) → vao em composables/
 *
 * @module definitions
 */

// ---- Opcoes de tema (cores, icones) ----
export { THEME_COLOR_OPTIONS, ICON_OPTIONS } from './themeOptions';

// ---- Configs de validacao por secao ----
export {
  HERO_CONFIG,
  MISSION_CONFIG,
  PROGRAMS_CONFIG,
  TESTIMONIALS_CONFIG,
  SUPPORTERS_CONFIG,
  CONTACT_CONFIG,
  CTA_CONFIG,
  SEO_CONFIG,
  IMAGE_UPLOAD_CONFIG,
  COMPRESSION_SETTINGS,
} from './validationConfigs';

// ---- Config de campos editable/readonly (unica fonte de verdade) ----
export { SECTION_FIELDS } from './sectionFields';
export type { FieldMode } from './sectionFields';

// ---- Firestore collections e documentos ----
export { FIRESTORE_COLLECTIONS, PAGE_DOCUMENTS } from './firestoreCollections';
export type { FirestoreCollection, PageDocument } from './firestoreCollections';

// ---- Defaults por secao (valores iniciais quando Firestore vazio) ----
export {
  HERO_DEFAULTS,
  HERO_STAT_DEFAULTS,
  MISSION_DEFAULTS,
  PROGRAMS_SECTION_DEFAULTS,
  PROGRAM_ITEM_DEFAULTS,
  TESTIMONIAL_DEFAULTS,
  SUPPORTERS_SECTION_DEFAULTS,
  SUPPORTER_ITEM_DEFAULTS,
  CONTACT_DEFAULTS,
  CONTACT_METHOD_DEFAULTS,
  CTA_DEFAULTS,
  SEO_DEFAULTS,
  SEO_OG_DEFAULTS,
} from './sectionDefaults';

// ---- Admin roles ----
export {
  ADMIN_ROLES,
  ADMIN_ROLE_DISPLAY_NAMES,
  ADMIN_ROLE_DESCRIPTIONS,
  ADMIN_ROLE_PERMISSIONS,
  isValidRole,
  getRoleDisplayName,
  getRolePermissions,
  ALL_ROLES,
} from './adminRoles';
export type { AdminRole } from './adminRoles';
