/**
 * Editable/Readonly Types - Elas Podem Admin
 *
 * Camada 2: Tipos DERIVADOS automaticamente de sections.ts + sectionFields.ts.
 *
 * NAO edite tipos manualmente aqui. Para mudar um campo de editable para readonly:
 *   -> Mude em definitions/sectionFields.ts
 *   Os tipos aqui se recalculam automaticamente via FieldsByMode.
 *
 * Excecao: IContactEditable e IContactReadonly sao compostos manualmente
 * porque Contact tem estrutura aninhada (methods[] com split proprio).
 *
 * @module types/admin/editable
 *
 * @dependencias
 * - types/admin/sections (interfaces base)
 * - definitions/sectionFields (config de modos)
 */

import type {
  IHeroSection,
  IMissionSection,
  IProgram,
  ITestimonial,
  ISupporter,
  IContactMethod,
  ICtaSection,
  ISeo,
} from './sections';
import type { SECTION_FIELDS } from '~/definitions/sectionFields';

// ============================================================
// UTILITY TYPE
// ============================================================

/**
 * Extrai de T apenas os campos cujo mode no Config e igual a Mode.
 *
 * @example
 * ```typescript
 * type Editable = FieldsByMode<IProgram, typeof SECTION_FIELDS.programs, 'editable'>
 * // = { title: string, description: string, icon: string, link: string }
 * ```
 */
export type FieldsByMode<
  T,
  Config extends Record<string, string>,
  Mode extends string,
> = Pick<
  T,
  { [K in keyof Config]: Config[K] extends Mode ? K : never }[keyof Config] & keyof T
>;

/**
 * Extrai de T todos os campos que NAO sao 'editable' (readonly + hidden).
 *
 * Usado para gerar os tipos *Readonly — que na verdade contem tanto
 * campos 'readonly' (visiveis no admin mas nao editaveis) quanto
 * 'hidden' (invisiveis no admin, preservados silenciosamente no save).
 *
 * @example
 * ```typescript
 * type Preserved = PreservedFields<IProgram, typeof SECTION_FIELDS.programs>
 * // = { color: string }  (color e 'hidden' — preservado no save)
 * ```
 */
export type PreservedFields<
  T,
  Config extends Record<string, string>,
> = Pick<
  T,
  {
    [K in keyof Config]: Config[K] extends 'readonly' | 'hidden' ? K : never;
  }[keyof Config] &
    keyof T
>;

// ============================================================
// HERO — tudo editavel
// ============================================================

export type IHeroEditable = FieldsByMode<
  IHeroSection,
  typeof SECTION_FIELDS.hero,
  'editable'
>;

// ============================================================
// MISSION — tudo editavel
// ============================================================

export type IMissionEditable = FieldsByMode<
  IMissionSection,
  typeof SECTION_FIELDS.mission,
  'editable'
>;

// ============================================================
// PROGRAMS — color e readonly
// ============================================================

export type IProgramEditable = FieldsByMode<
  IProgram,
  typeof SECTION_FIELDS.programs,
  'editable'
>;

export type IProgramReadonly = PreservedFields<IProgram, typeof SECTION_FIELDS.programs>;

// ============================================================
// TESTIMONIALS — tudo editavel
// ============================================================

export type ITestimonialEditable = FieldsByMode<
  ITestimonial,
  typeof SECTION_FIELDS.testimonials,
  'editable'
>;

// ============================================================
// SUPPORTERS — color e readonly
// ============================================================

export type ISupporterEditable = FieldsByMode<
  ISupporter,
  typeof SECTION_FIELDS.supporters,
  'editable'
>;

export type ISupporterReadonly = PreservedFields<ISupporter, typeof SECTION_FIELDS.supporters>;

// ============================================================
// CONTACT — color dos metodos e readonly
// ============================================================

/** Campos editaveis de um metodo de contato (derivado via FieldsByMode) */
export type IContactMethodEditable = FieldsByMode<
  IContactMethod,
  typeof SECTION_FIELDS.contactMethod,
  'editable'
>;

/** Campos preservados de um metodo de contato (readonly + hidden) */
export type IContactMethodReadonly = PreservedFields<
  IContactMethod,
  typeof SECTION_FIELDS.contactMethod
>;

/**
 * Campos editaveis da secao Contato.
 *
 * Composta manualmente porque Contact tem estrutura aninhada:
 * os campos top-level sao todos editaveis, e methods[] usa o split
 * derivado de contactMethod.
 */
export interface IContactEditable {
  badge: string;
  title: string;
  description: string;
  methods: IContactMethodEditable[];
  formSubjects: string[];
}

/** Campos readonly da secao Contato (cores dos metodos) */
export interface IContactReadonly {
  methods: IContactMethodReadonly[];
}

// ============================================================
// CTA — tudo editavel
// ============================================================

export type ICtaEditable = FieldsByMode<
  ICtaSection,
  typeof SECTION_FIELDS.cta,
  'editable'
>;

// ============================================================
// SEO — og config e readonly
// ============================================================

export type ISeoEditable = FieldsByMode<ISeo, typeof SECTION_FIELDS.seo, 'editable'>;

export type ISeoReadonly = PreservedFields<ISeo, typeof SECTION_FIELDS.seo>;
