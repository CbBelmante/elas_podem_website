/**
 * Home Editable/Readonly Types - Elas Podem Admin
 *
 * Camada 2: Tipos derivados de homeSections.ts + sectionFields.ts.
 * Para mudar campo de editable para readonly → mude em definitions/sectionFields.ts.
 *
 * Seções wrapper (Programs, Supporters, Testimonials, Contact) usam
 * ExtractItemConfig para derivar item-level e FieldsByMode no root para section-level.
 */

import type {
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
  ISeo,
} from './homeSections';
import type { SECTION_FIELDS } from '@definitions/sectionFields';

// ============================================================
// UTILITY TYPES
// ============================================================

/**
 * Extrai de T apenas os campos cujo mode no Config é igual a Mode.
 *
 * @template T - Interface fonte dos tipos (ex: ISupportersSection)
 * @template Config - Config de modos (ex: typeof SECTION_FIELDS.supporters)
 * @template Mode - Modo alvo (ex: 'editable')
 * @returns Pick<T> com apenas os campos cujo mode === Mode
 */
export type FieldsByMode<T, Config extends Record<string, unknown>, Mode extends string> = Pick<
  T,
  { [K in keyof Config]: Config[K] extends Mode ? K : never }[keyof Config] & keyof T
>;

/**
 * Extrai de T campos não-editáveis (readonly + hidden), preservados no save.
 *
 * @template T - Interface fonte dos tipos (ex: ISupporter)
 * @template Config - Config de modos (ex: SECTION_FIELDS.supporters.items)
 * @returns Pick<T> com apenas os campos readonly/hidden
 */
export type PreservedFields<T, Config extends Record<string, unknown>> = Pick<
  T,
  {
    [K in keyof Config]: Config[K] extends 'readonly' | 'hidden' ? K : never;
  }[keyof Config] &
    keyof T
>;

/**
 * Extrai o sub-config item-level (items ou methods) de um config wrapper.
 *
 * @template Config - Config completo da seção (ex: typeof SECTION_FIELDS.supporters)
 * @template Key - Nome da chave nested (ex: 'items' ou 'methods')
 * @returns O sub-objeto com os FieldModes do array, ou never se não existir
 */
type ExtractItemConfig<Config, Key extends string> =
  Config extends Record<Key, infer S extends Record<string, unknown>> ? S : never;

// ============================================================
// HERO
// ============================================================

export type IHeroEditable = FieldsByMode<IHeroSection, typeof SECTION_FIELDS.hero, 'editable'>;

// ============================================================
// MISSION
// ============================================================

export type IMissionEditable = FieldsByMode<
  IMissionSection,
  typeof SECTION_FIELDS.mission,
  'editable'
>;

// ============================================================
// PROGRAMS — wrapper (section-level root + item-level em items)
// ============================================================

// Item-level (derivado do sub-config items)
export type IProgramEditable = FieldsByMode<
  IProgram,
  ExtractItemConfig<typeof SECTION_FIELDS.programs, 'items'>,
  'editable'
>;

export type IProgramReadonly = PreservedFields<
  IProgram,
  ExtractItemConfig<typeof SECTION_FIELDS.programs, 'items'>
>;

// Section-level (derivado do root — FieldsByMode ignora 'items' pq não é string)
type IProgramsSectionEditable = FieldsByMode<
  IProgramsSection,
  typeof SECTION_FIELDS.programs,
  'editable'
>;
export type IProgramsEditable = IProgramsSectionEditable & { items: IProgramEditable[] };

export type IProgramsReadonly = { items: IProgramReadonly[] };

// ============================================================
// TESTIMONIALS — wrapper (section-level root + item-level em items)
// ============================================================

// Item-level
export type ITestimonialEditable = FieldsByMode<
  ITestimonial,
  ExtractItemConfig<typeof SECTION_FIELDS.testimonials, 'items'>,
  'editable'
>;

// Section-level
type ITestimonialsSectionEditable = FieldsByMode<
  ITestimonialsSection,
  typeof SECTION_FIELDS.testimonials,
  'editable'
>;
export type ITestimonialsEditable = ITestimonialsSectionEditable & {
  items: ITestimonialEditable[];
};

// ============================================================
// SUPPORTERS — wrapper (section-level root + item-level em items)
// ============================================================

// Item-level
export type ISupporterEditable = FieldsByMode<
  ISupporter,
  ExtractItemConfig<typeof SECTION_FIELDS.supporters, 'items'>,
  'editable'
>;

export type ISupporterReadonly = PreservedFields<
  ISupporter,
  ExtractItemConfig<typeof SECTION_FIELDS.supporters, 'items'>
>;

// Section-level
type ISupportersSectionEditable = FieldsByMode<
  ISupportersSection,
  typeof SECTION_FIELDS.supporters,
  'editable'
>;
export type ISupportersEditable = ISupportersSectionEditable & { items: ISupporterEditable[] };

export type ISupportersReadonly = { items: ISupporterReadonly[] };

// ============================================================
// CONTACT — wrapper (section-level root + item-level em methods)
// ============================================================

// Item-level
export type IContactMethodEditable = FieldsByMode<
  IContactMethod,
  ExtractItemConfig<typeof SECTION_FIELDS.contact, 'methods'>,
  'editable'
>;

export type IContactMethodReadonly = PreservedFields<
  IContactMethod,
  ExtractItemConfig<typeof SECTION_FIELDS.contact, 'methods'>
>;

// Section-level
type IContactSectionEditable = FieldsByMode<
  IContactSection,
  typeof SECTION_FIELDS.contact,
  'editable'
>;
export type IContactEditable = IContactSectionEditable & { methods: IContactMethodEditable[] };

export type IContactReadonly = { methods: IContactMethodReadonly[] };

// ============================================================
// VALUES
// ============================================================

export type IValueEditable = FieldsByMode<IValue, typeof SECTION_FIELDS.values, 'editable'>;

// ============================================================
// CTA
// ============================================================

export type ICtaEditable = FieldsByMode<ICtaSection, typeof SECTION_FIELDS.cta, 'editable'>;

// ============================================================
// SEO
// ============================================================

export type ISeoEditable = FieldsByMode<ISeo, typeof SECTION_FIELDS.seo, 'editable'>;

export type ISeoReadonly = PreservedFields<ISeo, typeof SECTION_FIELDS.seo>;
