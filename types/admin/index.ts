/**
 * Admin Types - Elas Podem
 *
 * Barrel export de todas as interfaces do admin:
 *
 * - common.ts         → Tipos genéricos reutilizados por todas as páginas
 * - homeSections.ts   → Camada 1: formato exato no Firestore (home)
 * - homeEditable.ts   → Camada 2: separação editable/readonly (home)
 * - homeFormsData.ts  → Camada 3: container do editor (home)
 * - aboutSections.ts  → Camada 1: formato Firestore (about)
 * - aboutEditable.ts  → Camada 2: editable/readonly (about)
 * - aboutFormsData.ts → Camada 3: container do editor (about)
 *
 * O QUE NAO VAI AQUI:
 * - Constantes (THEME_COLOR_OPTIONS, ICON_OPTIONS) → vao em definitions/
 * - Configs de validacao (HERO_CONFIG, etc.) → vao em definitions/
 * - Funcoes utilitarias (separate/combine) → vao em utils/
 *
 * @module types/admin
 */

// ---- Common: Tipos genéricos (UI, save, validação, audit) ----
export type {
  ISectionConfig,
  IPageSectionConfig,
  IPageEditorConfig,
  ISaveResult,
  IValidationResult,
  IAdminLog,
} from './common';

// ---- Home: Camada 1 (Section Data / Firestore) ----
export type {
  IHeroStat,
  IHeroSection,
  IMissionSection,
  IProgram,
  IProgramsSection,
  ITestimonial,
  ITestimonialsSection,
  ISupporter,
  ISupportersSection,
  IContactMethod,
  IContactSection,
  IValue,
  ICtaSection,
  ISeoOg,
  ISeo,
  IHomePageData,
} from './homeSections';

// ---- Home: Camada 2 (Editable/Readonly split) ----
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
  ITestimonialsEditable,
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
} from './homeEditable';

// ---- Home: Camada 3 (FormsData) ----
export type { IHomeFormsData } from './homeFormsData';

// ---- About: Camada 1 (Section Data) ----
export type {
  IAboutHeroSection,
  IAboutTimelineItem,
  IAboutTimelineSection,
  IAboutTeamMember,
  IAboutTeamSection,
  IAboutPillar,
  IAboutPillarsSection,
  IAboutCtaSection,
  IAboutPageData,
} from './aboutSections';

// ---- About: Camada 2 (Editable split) ----
export type {
  IAboutHeroEditable,
  IAboutTimelineItemEditable,
  IAboutTimelineEditable,
  IAboutTeamMemberEditable,
  IAboutTeamEditable,
  IAboutPillarEditable,
  IAboutPillarsEditable,
  IAboutCtaEditable,
} from './aboutEditable';

// ---- About: Camada 3 (FormsData) ----
export type { IAboutFormsData } from './aboutFormsData';
