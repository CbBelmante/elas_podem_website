/**
 * Home Form Utils - Elas Podem
 *
 * Funcoes de conversao entre formato Firestore (flat) e formato Editor (editable/readonly).
 *
 * Usa SECTION_FIELDS como fonte de verdade para saber quais campos sao
 * editable vs readonly. As funcoes genericas separateByFields/combineFromFields
 * leem o config em runtime — nao precisa listar campos manualmente.
 *
 * Padrao por secao:
 *   separate*Data()  — Firestore -> { editable, readonly }  (abre pro formulario)
 *   combine*Data()   — { editable, readonly } -> Firestore   (junta pro save)
 *   createDefault*() — valores iniciais quando Firestore esta vazio
 *   createNew*()     — item em branco para CRUD [+Novo] (arrays only)
 *
 * Funcoes agregadoras:
 *   separateAllSections() — converte IHomePageData inteira em IHomeFormsData
 *   createDefaultHomeForms() — gera IHomeFormsData completo com defaults
 *
 * @module utils/HomeFormUtils
 *
 * @dependencias
 * - types/admin (interfaces de secao e editable/readonly)
 * - definitions/sectionFields (config de modos)
 */

import type {
  // Camada 1: Section Data
  IHeroStat,
  IProgram,
  IProgramsSection,
  ITestimonial,
  ISupporter,
  ISupportersSection,
  IContactSection,
  IContactMethod,
  // Camada 2: Editable/Readonly
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
  IContactEditable,
  IContactReadonly,
  IContactMethodEditable,
  IContactMethodReadonly,
  ICtaEditable,
  ISeoEditable,
  ISeoReadonly,
  // Camada 3: FormsData
  IHomeFormsData,
  IHomePageData,
} from '~/types/admin';

import { SECTION_FIELDS } from '~/definitions/sectionFields';
import {
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
} from '~/definitions/sectionDefaults';

// ============================================================
// HELPERS GENERICOS
// ============================================================

/**
 * Deep clone de um valor (arrays, objetos, primitivos).
 * Copia shallow de objetos e recursiva de arrays.
 */
function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => cloneValue(v));
  if (typeof value === 'object' && value !== null) return { ...value };
  return value;
}

/**
 * Separa um objeto flat em { editable, readonly } baseado no config de campos.
 *
 * Le SECTION_FIELDS em runtime: campos marcados 'editable' vao pro editable,
 * campos 'readonly' vao pro readonly. Valores sao clonados (nao referencia).
 *
 * @param data - Objeto flat do Firestore
 * @param fields - Config de campos (ex: SECTION_FIELDS.programs)
 * @returns { editable, readonly } com os campos separados
 */
function separateByFields<T extends Record<string, unknown>>(
  data: T,
  fields: Record<string, 'editable' | 'readonly'>
): { editable: Partial<T>; readonly: Partial<T> } {
  const editable: Record<string, unknown> = {};
  const readonly: Record<string, unknown> = {};

  for (const [key, mode] of Object.entries(fields)) {
    if (!(key in data)) continue;
    const target = mode === 'editable' ? editable : readonly;
    target[key] = cloneValue(data[key]);
  }

  return { editable: editable as Partial<T>, readonly: readonly as Partial<T> };
}

/**
 * Combina editable + readonly de volta em um objeto flat.
 *
 * @param editable - Campos editaveis
 * @param readonly - Campos readonly
 * @returns Objeto flat recombinado
 */
function combineFromFields<T>(editable: Partial<T>, readonly: Partial<T>): T {
  return { ...readonly, ...editable } as T;
}

/**
 * Separa um array de objetos em { editable[], readonly[] } pareados por indice.
 *
 * @param data - Array de objetos do Firestore
 * @param fields - Config de campos
 * @returns { editable[], readonly[] }
 */
function separateArrayByFields<T extends Record<string, unknown>>(
  data: T[],
  fields: Record<string, 'editable' | 'readonly'>
): { editable: Partial<T>[]; readonly: Partial<T>[] } {
  const results = data.map((item) => separateByFields(item, fields));
  return {
    editable: results.map((r) => r.editable),
    readonly: results.map((r) => r.readonly),
  };
}

/**
 * Combina arrays pareados de editable + readonly de volta em um array flat.
 *
 * @param editable - Array de campos editaveis
 * @param readonly - Array de campos readonly (pareado por indice)
 * @param defaultReadonly - Fallback para readonly quando indice nao existe
 * @returns Array de objetos flat recombinados
 */
function combineArrayFromFields<T>(
  editable: Partial<T>[],
  readonly: Partial<T>[],
  defaultReadonly: Partial<T> = {}
): T[] {
  return editable.map((e, i) => ({ ...(readonly[i] || defaultReadonly), ...e }) as T);
}

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
  return separateByFields(data, SECTION_FIELDS.mission) as {
    editable: IMissionEditable;
    readonly: Record<string, never>;
  };
}

export function combineMissionData(editable: IMissionEditable) {
  return combineFromFields<IHomePageData['content']['mission']>(editable, {});
}

export function createDefaultMissionEditable(): IMissionEditable {
  return { ...MISSION_DEFAULTS };
}

// ============================================================
// PROGRAMS — estrutura aninhada (secao + items[])
// ============================================================

export function separateProgramsData(data: IProgramsSection): {
  editable: IProgramsEditable;
  readonly: IProgramsReadonly;
} {
  const { editable: itemsEditable, readonly: itemsReadonly } = separateArrayByFields(
    data.items,
    SECTION_FIELDS.programs
  );

  return {
    editable: {
      badge: data.badge,
      title: data.title,
      subtitle: data.subtitle,
      items: itemsEditable as IProgramEditable[],
    },
    readonly: {
      items: itemsReadonly as IProgramReadonly[],
    },
  };
}

export function combineProgramsData(
  editable: IProgramsEditable,
  readonly: IProgramsReadonly
): IProgramsSection {
  return {
    badge: editable.badge,
    title: editable.title,
    subtitle: editable.subtitle,
    items: combineArrayFromFields<IProgram>(editable.items, readonly.items, { color: 'magenta' }),
  };
}

export function createDefaultProgramsEditable(): IProgramsEditable {
  const { color: _, ...editableFields } = PROGRAM_ITEM_DEFAULTS;
  return { ...PROGRAMS_SECTION_DEFAULTS, items: [{ ...editableFields }] };
}

export function createNewProgram(): IProgram {
  return { ...PROGRAM_ITEM_DEFAULTS };
}

// ============================================================
// TESTIMONIALS
// ============================================================

export function separateTestimonialsData(data: ITestimonial[]) {
  return separateArrayByFields(data, SECTION_FIELDS.testimonials) as {
    editable: ITestimonialEditable[];
    readonly: Record<string, never>[];
  };
}

export function combineTestimonialsData(editable: ITestimonialEditable[]): ITestimonial[] {
  return combineArrayFromFields<ITestimonial>(editable, []);
}

export function createDefaultTestimonialEditable(): ITestimonialEditable {
  return { ...TESTIMONIAL_DEFAULTS };
}

export function createNewTestimonial(): ITestimonial {
  return { ...TESTIMONIAL_DEFAULTS };
}

// ============================================================
// SUPPORTERS — estrutura aninhada (secao + items[])
// ============================================================

export function separateSupportersData(data: ISupportersSection): {
  editable: ISupportersEditable;
  readonly: ISupportersReadonly;
} {
  const { editable: itemsEditable, readonly: itemsReadonly } = separateArrayByFields(
    data.items,
    SECTION_FIELDS.supporters
  );

  return {
    editable: {
      badge: data.badge,
      title: data.title,
      subtitle: data.subtitle,
      items: itemsEditable as ISupporterEditable[],
    },
    readonly: {
      items: itemsReadonly as ISupporterReadonly[],
    },
  };
}

export function combineSupportersData(
  editable: ISupportersEditable,
  readonly: ISupportersReadonly
): ISupportersSection {
  return {
    badge: editable.badge,
    title: editable.title,
    subtitle: editable.subtitle,
    items: combineArrayFromFields<ISupporter>(editable.items, readonly.items, { color: 'magenta' }),
  };
}

export function createDefaultSupportersEditable(): ISupportersEditable {
  const { color: _, ...editableFields } = SUPPORTER_ITEM_DEFAULTS;
  return { ...SUPPORTERS_SECTION_DEFAULTS, items: [{ ...editableFields }] };
}

export function createNewSupporter(): ISupporter {
  return { ...SUPPORTER_ITEM_DEFAULTS };
}

// ============================================================
// CONTACT
// ============================================================

/**
 * Contact tem estrutura aninhada: campos top-level + methods[] com split proprio.
 * Usa separateArrayByFields para os methods e monta o resultado manualmente.
 */
export function separateContactData(data: IContactSection): {
  editable: IContactEditable;
  readonly: IContactReadonly;
} {
  const { editable: methodsEditable, readonly: methodsReadonly } = separateArrayByFields(
    data.methods,
    SECTION_FIELDS.contactMethod
  );

  return {
    editable: {
      badge: data.badge,
      title: data.title,
      description: data.description,
      methods: methodsEditable as IContactMethodEditable[],
      formSubjects: [...data.formSubjects],
    },
    readonly: {
      methods: methodsReadonly as IContactMethodReadonly[],
    },
  };
}

export function combineContactData(
  editable: IContactEditable,
  readonly: IContactReadonly
): IContactSection {
  return {
    badge: editable.badge,
    title: editable.title,
    description: editable.description,
    methods: combineArrayFromFields<IContactMethod>(editable.methods, readonly.methods, {
      color: 'magenta',
    }),
    formSubjects: [...editable.formSubjects],
  };
}

export function createDefaultContactEditable(): IContactEditable {
  return { ...CONTACT_DEFAULTS, formSubjects: [...CONTACT_DEFAULTS.formSubjects], methods: [] };
}

export function createNewContactMethod(): IContactMethod {
  return { ...CONTACT_METHOD_DEFAULTS };
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
// AGREGADORAS — Pagina completa
// ============================================================

/**
 * Converte o documento Firestore completo (IHomePageData) em
 * IHomeFormsData (formato do editor com editable/readonly split).
 *
 * Usado no homeEdit.vue ao carregar dados do Firebase.
 */
export function separateAllSections(pageData: IHomePageData): IHomeFormsData {
  const c = pageData.content;

  return {
    hero: separateHeroData(c.hero),
    mission: separateMissionData(c.mission),
    programs: separateProgramsData(c.programs),
    testimonials: separateTestimonialsData(c.testimonials),
    supporters: separateSupportersData(c.supporters),
    contact: separateContactData(c.contact),
    cta: separateCtaData(c.cta),
    seo: separateSeoData(pageData.seo),
  };
}

/**
 * Gera IHomeFormsData completo com valores default.
 *
 * Usado como fallback quando o Firebase esta vazio/offline,
 * e como estado inicial do formulario antes de carregar dados.
 */
export function createDefaultHomeForms(): IHomeFormsData {
  return {
    hero: { editable: createDefaultHeroEditable() },
    mission: { editable: createDefaultMissionEditable() },
    programs: {
      editable: createDefaultProgramsEditable(),
      readonly: { items: [{ color: 'magenta' }] },
    },
    testimonials: { editable: [createDefaultTestimonialEditable()] },
    supporters: {
      editable: createDefaultSupportersEditable(),
      readonly: { items: [{ color: 'magenta' }] },
    },
    contact: {
      editable: createDefaultContactEditable(),
      readonly: { methods: [] },
    },
    cta: { editable: createDefaultCtaEditable() },
    seo: {
      editable: createDefaultSeoEditable(),
      readonly: { og: { ...SEO_OG_DEFAULTS } },
    },
  };
}
