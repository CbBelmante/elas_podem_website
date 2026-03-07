/**
 * 🎯 HomeFormUtils - Conversão Firestore ↔ Editor por seção da Home Page
 *
 * Padrão por seção: separate*Data (abre), combine*Data (salva),
 * createDefault* (vazio), createNew* (CRUD [+Novo]).
 * Delega split/combine genérico para sectionFieldsUtils.
 */

import type {
  // Camada 1: Section Data
  IHeroStat,
  IProgram,
  IProgramsSection,
  ITestimonial,
  ITestimonialsSection,
  ISupporter,
  ISupportersSection,
  IContactSection,
  IContactMethod,
  IValue,
  // Camada 2: Editable/Readonly
  IHeroEditable,
  IMissionEditable,
  IProgramsEditable,
  IProgramsReadonly,
  ITestimonialEditable,
  ITestimonialsEditable,
  ISupportersEditable,
  ISupportersReadonly,
  IContactEditable,
  IContactReadonly,
  IValueEditable,
  ICtaEditable,
  ISeoEditable,
  ISeoReadonly,
  // Camada 3: FormsData
  IHomeFormsData,
  IHomePageData,
} from '@appTypes/admin';

import { SECTION_FIELDS } from '@definitions/sectionFields';
import {
  HERO_DEFAULTS,
  HERO_STAT_DEFAULTS,
  MISSION_DEFAULTS,
  PROGRAMS_SECTION_DEFAULTS,
  PROGRAM_ITEM_DEFAULTS,
  TESTIMONIALS_SECTION_DEFAULTS,
  TESTIMONIAL_DEFAULTS,
  SUPPORTERS_SECTION_DEFAULTS,
  SUPPORTER_ITEM_DEFAULTS,
  CONTACT_DEFAULTS,
  CONTACT_METHOD_DEFAULTS,
  VALUE_ITEM_DEFAULTS,
  CTA_DEFAULTS,
  SEO_DEFAULTS,
  SEO_OG_DEFAULTS,
} from '@definitions/sectionDefaults';

import {
  separateByFields,
  combineFromFields,
  separateArrayByFields,
  combineArrayFromFields,
  separateWrapperByFields,
  combineWrapperFromFields,
} from '@utils/sectionFieldsUtils';

// ============================================================
// HERO
// ============================================================

export function separateHeroData(data: IHomePageData['content']['hero']) {
  return separateByFields(data, SECTION_FIELDS.hero) as {
    editable: IHeroEditable;
    readonly: Record<string, never>;
  };
}

export function combineHeroData(editable: IHeroEditable) {
  return combineFromFields<IHomePageData['content']['hero']>(editable, {});
}

export function createDefaultHeroEditable(): IHeroEditable {
  return { ...HERO_DEFAULTS, stats: [...HERO_DEFAULTS.stats.map((s) => ({ ...s }))] };
}

export function createNewHeroStat(): IHeroStat {
  return { ...HERO_STAT_DEFAULTS };
}

// ============================================================
// MISSION
// ============================================================

export function separateMissionData(data: IHomePageData['content']['mission']) {
  // Normaliza dados antigos do Firestore (text1/text2 → paragraphs)
  const raw = data as unknown as Record<string, unknown>;
  if (!raw.paragraphs && (raw.text1 || raw.text2)) {
    raw.paragraphs = [raw.text1, raw.text2].filter(Boolean);
  }

  return separateByFields(data, SECTION_FIELDS.mission) as {
    editable: IMissionEditable;
    readonly: Record<string, never>;
  };
}

export function combineMissionData(editable: IMissionEditable) {
  return combineFromFields<IHomePageData['content']['mission']>(editable, {});
}

export function createDefaultMissionEditable(): IMissionEditable {
  return { ...MISSION_DEFAULTS, paragraphs: [...MISSION_DEFAULTS.paragraphs] };
}

// ============================================================
// PROGRAMS — estrutura aninhada (seção + items[])
// ============================================================

export function separateProgramsData(data: IProgramsSection): {
  editable: IProgramsEditable;
  readonly: IProgramsReadonly;
} {
  return separateWrapperByFields({
    data: data as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.programs,
    sectionDefaults: PROGRAMS_SECTION_DEFAULTS,
  }) as unknown as { editable: IProgramsEditable; readonly: IProgramsReadonly };
}

export function combineProgramsData(
  editable: IProgramsEditable,
  readonly: IProgramsReadonly
): IProgramsSection {
  return combineWrapperFromFields<IProgramsSection>({
    editable: editable as unknown as Record<string, unknown>,
    readonly: readonly as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.programs,
  });
}

export function createDefaultProgramsEditable(): IProgramsEditable {
  return { ...PROGRAMS_SECTION_DEFAULTS, items: [{ ...PROGRAM_ITEM_DEFAULTS }] };
}

export function createNewProgram(): IProgram {
  return { ...PROGRAM_ITEM_DEFAULTS };
}

// ============================================================
// TESTIMONIALS — estrutura aninhada (seção + items[])
// ============================================================

export function separateTestimonialsData(data: ITestimonialsSection): {
  editable: ITestimonialsEditable;
} {
  // Normaliza dados antigos do Firestore (array plano → wrapper)
  const normalized = Array.isArray(data)
    ? { ...TESTIMONIALS_SECTION_DEFAULTS, items: data as unknown as ITestimonial[] }
    : data;

  return separateWrapperByFields({
    data: normalized as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.testimonials,
    sectionDefaults: TESTIMONIALS_SECTION_DEFAULTS,
  }) as unknown as { editable: ITestimonialsEditable };
}

export function combineTestimonialsData(editable: ITestimonialsEditable): ITestimonialsSection {
  return combineWrapperFromFields<ITestimonialsSection>({
    editable: editable as unknown as Record<string, unknown>,
    readonly: {},
    fields: SECTION_FIELDS.testimonials,
  });
}

export function createDefaultTestimonialsEditable(): ITestimonialsEditable {
  return { ...TESTIMONIALS_SECTION_DEFAULTS, items: [createDefaultTestimonialEditable()] };
}

export function createDefaultTestimonialEditable(): ITestimonialEditable {
  return { ...TESTIMONIAL_DEFAULTS };
}

export function createNewTestimonial(): ITestimonial {
  return { ...TESTIMONIAL_DEFAULTS };
}

// ============================================================
// SUPPORTERS — estrutura aninhada (seção + items[])
// ============================================================

export function separateSupportersData(data: ISupportersSection): {
  editable: ISupportersEditable;
  readonly: ISupportersReadonly;
} {
  // Backward compat: logoSize migrou de section-level pra item-level
  const raw = data as unknown as Record<string, unknown>;
  const sectionLogoSize = raw.logoSize as number | undefined;
  if (sectionLogoSize && Array.isArray(raw.items)) {
    for (const item of raw.items as Record<string, unknown>[]) {
      item.logoSize ??= sectionLogoSize;
    }
  }

  return separateWrapperByFields({
    data: raw,
    fields: SECTION_FIELDS.supporters,
    sectionDefaults: SUPPORTERS_SECTION_DEFAULTS,
  }) as unknown as { editable: ISupportersEditable; readonly: ISupportersReadonly };
}

export function combineSupportersData(
  editable: ISupportersEditable,
  readonly: ISupportersReadonly
): ISupportersSection {
  return combineWrapperFromFields<ISupportersSection>({
    editable: editable as unknown as Record<string, unknown>,
    readonly: readonly as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.supporters,
  });
}

export function createDefaultSupportersEditable(): ISupportersEditable {
  return { ...SUPPORTERS_SECTION_DEFAULTS, items: [{ ...SUPPORTER_ITEM_DEFAULTS }] };
}

export function createNewSupporter(): ISupporter {
  return { ...SUPPORTER_ITEM_DEFAULTS };
}

// ============================================================
// CONTACT — estrutura aninhada (seção + methods[])
// ============================================================

export function separateContactData(data: IContactSection): {
  editable: IContactEditable;
  readonly: IContactReadonly;
} {
  return separateWrapperByFields({
    data: data as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.contact,
    sectionDefaults: CONTACT_DEFAULTS,
  }) as unknown as { editable: IContactEditable; readonly: IContactReadonly };
}

export function combineContactData(
  editable: IContactEditable,
  readonly: IContactReadonly
): IContactSection {
  return combineWrapperFromFields<IContactSection>({
    editable: editable as unknown as Record<string, unknown>,
    readonly: readonly as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.contact,
  });
}

export function createDefaultContactEditable(): IContactEditable {
  return { ...CONTACT_DEFAULTS, formSubjects: [...CONTACT_DEFAULTS.formSubjects], methods: [] };
}

export function createNewContactMethod(): IContactMethod {
  return { ...CONTACT_METHOD_DEFAULTS };
}

// ============================================================
// VALUES
// ============================================================

export function separateValuesData(data: IValue[]) {
  return separateArrayByFields(data, SECTION_FIELDS.values) as {
    editable: IValueEditable[];
    readonly: Record<string, never>[];
  };
}

export function combineValuesData(editable: IValueEditable[]): IValue[] {
  return combineArrayFromFields<IValue>({ editable, readonly: [] });
}

export function createDefaultValueEditable(): IValueEditable {
  return { ...VALUE_ITEM_DEFAULTS };
}

export function createNewValue(): IValue {
  return { ...VALUE_ITEM_DEFAULTS };
}

// ============================================================
// CTA
// ============================================================

export function separateCtaData(data: IHomePageData['content']['cta']) {
  return separateByFields(data, SECTION_FIELDS.cta) as {
    editable: ICtaEditable;
    readonly: Record<string, never>;
  };
}

export function combineCtaData(editable: ICtaEditable) {
  return combineFromFields<IHomePageData['content']['cta']>(editable, {});
}

export function createDefaultCtaEditable(): ICtaEditable {
  return { ...CTA_DEFAULTS };
}

// ============================================================
// SEO
// ============================================================

export function separateSeoData(data: IHomePageData['seo']) {
  return separateByFields(data, SECTION_FIELDS.seo) as {
    editable: ISeoEditable;
    readonly: ISeoReadonly;
  };
}

export function combineSeoData(editable: ISeoEditable, readonly: ISeoReadonly) {
  return combineFromFields<IHomePageData['seo']>(editable, readonly);
}

export function createDefaultSeoEditable(): ISeoEditable {
  return { ...SEO_DEFAULTS, keywords: [...SEO_DEFAULTS.keywords] };
}

// ============================================================
// AGREGADORAS — Página completa
// ============================================================

/**
 * Converte o documento Firestore completo (IHomePageData) em
 * IHomeFormsData (formato do editor com editable/readonly split).
 *
 * Fallback por seção: se o Firestore só tem hero salvo, as outras
 * seções usam defaults (não crasha). Mesma lógica do público.
 *
 * Usado no homeEdit.vue ao carregar dados do Firebase.
 *
 * @param pageData - Documento completo do Firestore
 * @returns IHomeFormsData com todas as seções separadas em editable/readonly
 */
export function separateAllSections(pageData: IHomePageData): IHomeFormsData {
  const c = (pageData.content ?? {}) as Partial<IHomePageData['content']>;
  const defaults = createDefaultHomeForms();

  return {
    hero: c.hero ? separateHeroData(c.hero) : defaults.hero,
    mission: c.mission ? separateMissionData(c.mission) : defaults.mission,
    programs: c.programs ? separateProgramsData(c.programs) : defaults.programs,
    testimonials: c.testimonials ? separateTestimonialsData(c.testimonials) : defaults.testimonials,
    supporters: c.supporters ? separateSupportersData(c.supporters) : defaults.supporters,
    contact: c.contact ? separateContactData(c.contact) : defaults.contact,
    values: c.values ? separateValuesData(c.values) : defaults.values,
    cta: c.cta ? separateCtaData(c.cta) : defaults.cta,
    seo: pageData.seo ? separateSeoData(pageData.seo) : defaults.seo,
  };
}

/**
 * Gera IHomeFormsData completo com valores default.
 *
 * Usado como fallback quando o Firebase está vazio/offline,
 * e como estado inicial do formulário antes de carregar dados.
 *
 * @returns IHomeFormsData com todas as seções preenchidas com defaults
 */
export function createDefaultHomeForms(): IHomeFormsData {
  return {
    hero: { editable: createDefaultHeroEditable() },
    mission: { editable: createDefaultMissionEditable() },
    programs: {
      editable: createDefaultProgramsEditable(),
      readonly: { items: [{ color: 'magenta' }] },
    },
    testimonials: { editable: createDefaultTestimonialsEditable() },
    supporters: {
      editable: createDefaultSupportersEditable(),
      readonly: { items: [{ color: 'magenta' }] },
    },
    contact: {
      editable: createDefaultContactEditable(),
      readonly: { methods: [] },
    },
    values: { editable: [createDefaultValueEditable()] },
    cta: { editable: createDefaultCtaEditable() },
    seo: {
      editable: createDefaultSeoEditable(),
      readonly: { og: { ...SEO_OG_DEFAULTS } },
    },
  };
}
