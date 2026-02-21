/**
 * Editable/Readonly Types - Elas Podem Admin
 *
 * Camada 2: Tipos derivados de sections.ts + sectionFields.ts.
 * Para mudar campo de editable para readonly → mude em definitions/sectionFields.ts.
 *
 * Excecao: secoes com estrutura aninhada (Programs, Supporters, Contact) sao compostas
 * manualmente porque items[] tem split proprio.
 */

import type {
  IHeroSection,
  IMissionSection,
  IProgram,
  ITestimonial,
  ISupporter,
  IContactMethod,
  IValue,
  ICtaSection,
  ISeo,
} from './sections';
import type { SECTION_FIELDS } from '~/definitions/sectionFields';

// ============================================================
// UTILITY TYPES
// ============================================================

/** Extrai de T apenas os campos cujo mode no Config e igual a Mode */
export type FieldsByMode<T, Config extends Record<string, string>, Mode extends string> = Pick<
  T,
  { [K in keyof Config]: Config[K] extends Mode ? K : never }[keyof Config] & keyof T
>;

/** Extrai de T campos nao-editaveis (readonly + hidden), preservados no save */
export type PreservedFields<T, Config extends Record<string, string>> = Pick<
  T,
  {
    [K in keyof Config]: Config[K] extends 'readonly' | 'hidden' ? K : never;
  }[keyof Config] &
    keyof T
>;

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
// PROGRAMS — estrutura aninhada (secao + items[])
// ============================================================

// Item-level (derivados automaticamente)
export type IProgramEditable = FieldsByMode<IProgram, typeof SECTION_FIELDS.programs, 'editable'>;

export type IProgramReadonly = PreservedFields<IProgram, typeof SECTION_FIELDS.programs>;

// Section-level (compostos manualmente — badge/title/subtitle + items com split)
export interface IProgramsEditable {
  badge: string;
  title: string;
  subtitle: string;
  items: IProgramEditable[];
}

export interface IProgramsReadonly {
  items: IProgramReadonly[];
}

// ============================================================
// TESTIMONIALS
// ============================================================

export type ITestimonialEditable = FieldsByMode<
  ITestimonial,
  typeof SECTION_FIELDS.testimonials,
  'editable'
>;

// ============================================================
// SUPPORTERS — estrutura aninhada (secao + items[])
// ============================================================

// Item-level (derivados automaticamente)
export type ISupporterEditable = FieldsByMode<
  ISupporter,
  typeof SECTION_FIELDS.supporters,
  'editable'
>;

export type ISupporterReadonly = PreservedFields<ISupporter, typeof SECTION_FIELDS.supporters>;

// Section-level (compostos manualmente — badge/title/subtitle + items com split)
export interface ISupportersEditable {
  badge: string;
  title: string;
  subtitle: string;
  items: ISupporterEditable[];
}

export interface ISupportersReadonly {
  items: ISupporterReadonly[];
}

// ============================================================
// CONTACT — estrutura aninhada (secao + methods[])
// ============================================================

export type IContactMethodEditable = FieldsByMode<
  IContactMethod,
  typeof SECTION_FIELDS.contactMethod,
  'editable'
>;

export type IContactMethodReadonly = PreservedFields<
  IContactMethod,
  typeof SECTION_FIELDS.contactMethod
>;

// Section-level (compostos manualmente — top-level editaveis + methods com split)
export interface IContactEditable {
  badge: string;
  title: string;
  description: string;
  methods: IContactMethodEditable[];
  formSubjects: string[];
}

export interface IContactReadonly {
  methods: IContactMethodReadonly[];
}

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
