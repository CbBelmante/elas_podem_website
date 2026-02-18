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
  ITestimonial,
  ISupporter,
  IContactSection,
  IContactMethod,
  // Camada 2: Editable/Readonly
  IHeroEditable,
  IMissionEditable,
  IProgramEditable,
  IProgramReadonly,
  ITestimonialEditable,
  ISupporterEditable,
  ISupporterReadonly,
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
  fields: Record<string, 'editable' | 'readonly'>,
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
  fields: Record<string, 'editable' | 'readonly'>,
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
  defaultReadonly: Partial<T> = {},
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
  return {
    badge: 'MOVIMENTO NACIONAL DESDE 2020',
    title: 'ELAS PO+DEM',
    subtitle: '',
    btnDonate: 'Doe Agora',
    btnHistory: 'Nossa Historia',
    stats: [
      { icon: 'luc-award', number: '2025', label: 'Sede Propria' },
      { icon: 'luc-megaphone', number: '5a', label: 'Conferencia Nacional' },
      { icon: 'luc-users', number: 'MS', label: 'Campo Grande' },
    ],
  };
}

export function createNewHeroStat(): IHeroStat {
  return { icon: 'luc-star', number: '', label: '' };
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
  return {
    badge: 'NOSSA MISSAO',
    title: 'Elas Podem Amar, Elas Podem Ser, Elas Podem TUDO!',
    text1: '',
    text2: '',
    btnText: 'Conheca Nossa Historia',
    image: '',
  };
}

// ============================================================
// PROGRAMS
// ============================================================

export function separateProgramsData(data: IProgram[]) {
  return separateArrayByFields(data, SECTION_FIELDS.programs) as {
    editable: IProgramEditable[];
    readonly: IProgramReadonly[];
  };
}

export function combineProgramsData(
  editable: IProgramEditable[],
  readonly: IProgramReadonly[],
): IProgram[] {
  return combineArrayFromFields<IProgram>(editable, readonly, { color: 'magenta' });
}

export function createDefaultProgramEditable(): IProgramEditable {
  return { title: '', description: '', icon: 'luc-star', link: 'Saiba Mais' };
}

export function createNewProgram(): IProgram {
  return { title: '', description: '', icon: 'luc-star', color: 'magenta', link: 'Saiba Mais' };
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
  return { quote: '', name: '', role: '', initials: '', image: '' };
}

export function createNewTestimonial(): ITestimonial {
  return { quote: '', name: '', role: '', initials: '', image: '' };
}

// ============================================================
// SUPPORTERS
// ============================================================

export function separateSupportersData(data: ISupporter[]) {
  return separateArrayByFields(data, SECTION_FIELDS.supporters) as {
    editable: ISupporterEditable[];
    readonly: ISupporterReadonly[];
  };
}

export function combineSupportersData(
  editable: ISupporterEditable[],
  readonly: ISupporterReadonly[],
): ISupporter[] {
  return combineArrayFromFields<ISupporter>(editable, readonly, { color: 'magenta' });
}

export function createDefaultSupporterEditable(): ISupporterEditable {
  return { name: '', icon: 'luc-building-2', image: '', url: '' };
}

export function createNewSupporter(): ISupporter {
  return { name: '', icon: 'luc-building-2', color: 'magenta', image: '', url: '' };
}

// ============================================================
// CONTACT
// ============================================================

/**
 * Contact tem estrutura aninhada: campos top-level + methods[] com split proprio.
 * Usa separateArrayByFields para os methods e monta o resultado manualmente.
 */
export function separateContactData(
  data: IContactSection,
): { editable: IContactEditable; readonly: IContactReadonly } {
  const { editable: methodsEditable, readonly: methodsReadonly } = separateArrayByFields(
    data.methods,
    SECTION_FIELDS.contactMethod,
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
  readonly: IContactReadonly,
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
  return {
    badge: 'CONTATO',
    title: 'Vamos Conversar?',
    description: '',
    methods: [],
    formSubjects: ['Quero ser voluntaria', 'Quero doar', 'Parcerias', 'Duvidas gerais'],
  };
}

export function createNewContactMethod(): IContactMethod {
  return { label: '', value: '', icon: 'luc-star', color: 'magenta' };
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
  return {
    title: 'Juntas Somos Mais Fortes',
    subtitle: '',
    btnDonate: 'Doar Agora',
    btnProjects: 'Conhecer Projetos',
  };
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
  return {
    title: 'Elas Podem - Coletivo de Mulheres',
    description: '',
    keywords: ['elas podem', 'mulheres', 'empoderamento'],
    ogImage: '',
  };
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
      editable: [createDefaultProgramEditable()],
      readonly: [{ color: 'magenta' }],
    },
    testimonials: { editable: [createDefaultTestimonialEditable()] },
    supporters: {
      editable: [createDefaultSupporterEditable()],
      readonly: [{ color: 'magenta' }],
    },
    contact: {
      editable: createDefaultContactEditable(),
      readonly: { methods: [] },
    },
    cta: { editable: createDefaultCtaEditable() },
    seo: {
      editable: createDefaultSeoEditable(),
      readonly: { og: { type: 'website', siteName: 'Elas Podem', locale: 'pt_BR' } },
    },
  };
}
