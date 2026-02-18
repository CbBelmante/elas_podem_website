/**
 * Home Form Utils - Elas Podem
 *
 * Funcoes de conversao entre formato Firestore (flat) e formato Editor (editable/readonly).
 *
 * Padrao por secao:
 *   separate*Data()  — Firestore → { editable, readonly }  (abre pro formulario)
 *   combine*Data()   — { editable, readonly } → Firestore   (junta pro save)
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
 */

import type {
  // Camada 1: Section Data
  IHeroSection,
  IHeroStat,
  IMissionSection,
  IProgram,
  ITestimonial,
  ISupporter,
  IContactSection,
  IContactMethod,
  ICtaSection,
  ISeo,
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

// ============================================================
// HERO
// ============================================================

/**
 * Separa dados Firebase do Hero em formato editable.
 *
 * @param data - Dados flat do Firestore (IHeroSection)
 * @returns Objeto com `editable` contendo todos os campos do Hero
 */
export function separateHeroData(data: IHeroSection): { editable: IHeroEditable } {
  return {
    editable: {
      badge: data.badge,
      title: data.title,
      subtitle: data.subtitle,
      btnDonate: data.btnDonate,
      btnHistory: data.btnHistory,
      stats: data.stats.map((s) => ({ ...s })),
    },
  };
}

/**
 * Combina dados editable do Hero de volta para formato Firestore.
 *
 * @param editable - Dados editaveis do formulario
 * @returns IHeroSection pronto para salvar no Firestore
 */
export function combineHeroData(editable: IHeroEditable): IHeroSection {
  return {
    badge: editable.badge,
    title: editable.title,
    subtitle: editable.subtitle,
    btnDonate: editable.btnDonate,
    btnHistory: editable.btnHistory,
    stats: editable.stats.map((s) => ({ ...s })),
  };
}

/**
 * Cria valores default para o Hero (estado inicial do formulario).
 *
 * @returns IHeroEditable com valores padrao
 */
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

/**
 * Cria um stat em branco para adicionar ao Hero via CRUD [+Novo].
 *
 * @returns IHeroStat com valores vazios
 */
export function createNewHeroStat(): IHeroStat {
  return { icon: 'luc-star', number: '', label: '' };
}

// ============================================================
// MISSION
// ============================================================

/**
 * Separa dados Firebase da Missao em formato editable.
 *
 * @param data - Dados flat do Firestore (IMissionSection)
 * @returns Objeto com `editable` contendo todos os campos
 */
export function separateMissionData(data: IMissionSection): { editable: IMissionEditable } {
  return {
    editable: {
      badge: data.badge,
      title: data.title,
      text1: data.text1,
      text2: data.text2,
      btnText: data.btnText,
      image: data.image,
    },
  };
}

/**
 * Combina dados editable da Missao de volta para formato Firestore.
 *
 * @param editable - Dados editaveis do formulario
 * @returns IMissionSection pronto para salvar
 */
export function combineMissionData(editable: IMissionEditable): IMissionSection {
  return {
    badge: editable.badge,
    title: editable.title,
    text1: editable.text1,
    text2: editable.text2,
    btnText: editable.btnText,
    image: editable.image,
  };
}

/**
 * Cria valores default para a Missao.
 *
 * @returns IMissionEditable com valores padrao
 */
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

/**
 * Separa dados Firebase dos Programas em editable + readonly.
 *
 * O campo `color` vai para readonly (nao editavel pelo admin).
 *
 * @param data - Array de programas do Firestore
 * @returns Objeto com `editable[]` e `readonly[]` pareados por indice
 */
export function separateProgramsData(
  data: IProgram[],
): { editable: IProgramEditable[]; readonly: IProgramReadonly[] } {
  return {
    editable: data.map((p) => ({
      title: p.title,
      description: p.description,
      icon: p.icon,
      link: p.link,
    })),
    readonly: data.map((p) => ({
      color: p.color,
    })),
  };
}

/**
 * Combina editable + readonly dos Programas de volta para formato Firestore.
 *
 * @param editable - Campos editaveis de cada programa
 * @param readonly - Campos readonly (color) de cada programa
 * @returns IProgram[] pronto para salvar
 */
export function combineProgramsData(
  editable: IProgramEditable[],
  readonly: IProgramReadonly[],
): IProgram[] {
  return editable.map((e, i) => ({
    ...e,
    color: readonly[i]?.color || 'magenta',
  }));
}

/**
 * Cria valores default para um Programa (estado inicial do formulario).
 *
 * @returns IProgramEditable com valores padrao
 */
export function createDefaultProgramEditable(): IProgramEditable {
  return { title: '', description: '', icon: 'luc-star', link: 'Saiba Mais' };
}

/**
 * Cria um programa em branco para adicionar via CRUD [+Novo].
 *
 * @returns IProgram com valores vazios (inclui color default)
 */
export function createNewProgram(): IProgram {
  return {
    title: '',
    description: '',
    icon: 'luc-star',
    color: 'magenta',
    link: 'Saiba Mais',
  };
}

// ============================================================
// TESTIMONIALS
// ============================================================

/**
 * Separa dados Firebase dos Depoimentos em formato editable.
 *
 * @param data - Array de depoimentos do Firestore
 * @returns Objeto com `editable[]`
 */
export function separateTestimonialsData(
  data: ITestimonial[],
): { editable: ITestimonialEditable[] } {
  return {
    editable: data.map((t) => ({
      quote: t.quote,
      name: t.name,
      role: t.role,
      initials: t.initials,
      image: t.image,
    })),
  };
}

/**
 * Combina editable dos Depoimentos de volta para formato Firestore.
 *
 * @param editable - Campos editaveis de cada depoimento
 * @returns ITestimonial[] pronto para salvar
 */
export function combineTestimonialsData(editable: ITestimonialEditable[]): ITestimonial[] {
  return editable.map((e) => ({ ...e }));
}

/**
 * Cria valores default para um Depoimento.
 *
 * @returns ITestimonialEditable com valores vazios
 */
export function createDefaultTestimonialEditable(): ITestimonialEditable {
  return { quote: '', name: '', role: '', initials: '', image: '' };
}

/**
 * Cria um depoimento em branco para CRUD [+Novo].
 *
 * @returns ITestimonial com valores vazios
 */
export function createNewTestimonial(): ITestimonial {
  return { quote: '', name: '', role: '', initials: '', image: '' };
}

// ============================================================
// SUPPORTERS
// ============================================================

/**
 * Separa dados Firebase dos Apoiadores em editable + readonly.
 *
 * O campo `color` vai para readonly.
 *
 * @param data - Array de apoiadores do Firestore
 * @returns Objeto com `editable[]` e `readonly[]` pareados por indice
 */
export function separateSupportersData(
  data: ISupporter[],
): { editable: ISupporterEditable[]; readonly: ISupporterReadonly[] } {
  return {
    editable: data.map((s) => ({
      name: s.name,
      icon: s.icon,
      image: s.image,
      url: s.url,
    })),
    readonly: data.map((s) => ({
      color: s.color,
    })),
  };
}

/**
 * Combina editable + readonly dos Apoiadores de volta para formato Firestore.
 *
 * @param editable - Campos editaveis de cada apoiador
 * @param readonly - Campos readonly (color) de cada apoiador
 * @returns ISupporter[] pronto para salvar
 */
export function combineSupportersData(
  editable: ISupporterEditable[],
  readonly: ISupporterReadonly[],
): ISupporter[] {
  return editable.map((e, i) => ({
    ...e,
    color: readonly[i]?.color || 'magenta',
  }));
}

/**
 * Cria valores default para um Apoiador.
 *
 * @returns ISupporterEditable com valores padrao
 */
export function createDefaultSupporterEditable(): ISupporterEditable {
  return { name: '', icon: 'luc-building-2', image: '', url: '' };
}

/**
 * Cria um apoiador em branco para CRUD [+Novo].
 *
 * @returns ISupporter com valores vazios (inclui color default)
 */
export function createNewSupporter(): ISupporter {
  return { name: '', icon: 'luc-building-2', color: 'magenta', image: '', url: '' };
}

// ============================================================
// CONTACT
// ============================================================

/**
 * Separa dados Firebase do Contato em editable + readonly.
 *
 * As cores dos metodos de contato vao para readonly.
 *
 * @param data - Dados flat do Firestore (IContactSection)
 * @returns Objeto com `editable` e `readonly`
 */
export function separateContactData(
  data: IContactSection,
): { editable: IContactEditable; readonly: IContactReadonly } {
  return {
    editable: {
      badge: data.badge,
      title: data.title,
      description: data.description,
      methods: data.methods.map((m) => ({
        label: m.label,
        value: m.value,
        icon: m.icon,
        url: m.url,
      })),
      formSubjects: [...data.formSubjects],
    },
    readonly: {
      methods: data.methods.map((m) => ({
        color: m.color,
      })),
    },
  };
}

/**
 * Combina editable + readonly do Contato de volta para formato Firestore.
 *
 * @param editable - Campos editaveis do contato
 * @param readonly - Campos readonly (cores dos metodos)
 * @returns IContactSection pronto para salvar
 */
export function combineContactData(
  editable: IContactEditable,
  readonly: IContactReadonly,
): IContactSection {
  return {
    badge: editable.badge,
    title: editable.title,
    description: editable.description,
    methods: editable.methods.map(
      (e: IContactMethodEditable, i: number): IContactMethod => ({
        ...e,
        color: readonly.methods[i]?.color || 'magenta',
      }),
    ),
    formSubjects: [...editable.formSubjects],
  };
}

/**
 * Cria valores default para o Contato.
 *
 * @returns IContactEditable com valores padrao
 */
export function createDefaultContactEditable(): IContactEditable {
  return {
    badge: 'CONTATO',
    title: 'Vamos Conversar?',
    description: '',
    methods: [],
    formSubjects: ['Quero ser voluntaria', 'Quero doar', 'Parcerias', 'Duvidas gerais'],
  };
}

/**
 * Cria um metodo de contato em branco para CRUD [+Novo].
 *
 * @returns IContactMethod com valores vazios (inclui color default)
 */
export function createNewContactMethod(): IContactMethod {
  return { label: '', value: '', icon: 'luc-star', color: 'magenta' };
}

// ============================================================
// CTA
// ============================================================

/**
 * Separa dados Firebase do CTA em formato editable.
 *
 * @param data - Dados flat do Firestore (ICtaSection)
 * @returns Objeto com `editable`
 */
export function separateCtaData(data: ICtaSection): { editable: ICtaEditable } {
  return {
    editable: {
      title: data.title,
      subtitle: data.subtitle,
      btnDonate: data.btnDonate,
      btnProjects: data.btnProjects,
    },
  };
}

/**
 * Combina editable do CTA de volta para formato Firestore.
 *
 * @param editable - Dados editaveis do CTA
 * @returns ICtaSection pronto para salvar
 */
export function combineCtaData(editable: ICtaEditable): ICtaSection {
  return {
    title: editable.title,
    subtitle: editable.subtitle,
    btnDonate: editable.btnDonate,
    btnProjects: editable.btnProjects,
  };
}

/**
 * Cria valores default para o CTA.
 *
 * @returns ICtaEditable com valores padrao
 */
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

/**
 * Separa dados Firebase do SEO em editable + readonly.
 *
 * A config Open Graph (og) vai para readonly.
 *
 * @param data - Dados flat do Firestore (ISeo)
 * @returns Objeto com `editable` e `readonly`
 */
export function separateSeoData(data: ISeo): { editable: ISeoEditable; readonly: ISeoReadonly } {
  return {
    editable: {
      title: data.title,
      description: data.description,
      keywords: [...data.keywords],
      ogImage: data.ogImage,
    },
    readonly: {
      og: { ...data.og },
    },
  };
}

/**
 * Combina editable + readonly do SEO de volta para formato Firestore.
 *
 * @param editable - Campos editaveis do SEO
 * @param readonly - Config OG (readonly)
 * @returns ISeo pronto para salvar
 */
export function combineSeoData(editable: ISeoEditable, readonly: ISeoReadonly): ISeo {
  return {
    title: editable.title,
    description: editable.description,
    keywords: [...editable.keywords],
    ogImage: editable.ogImage,
    og: { ...readonly.og },
  };
}

/**
 * Cria valores default para o SEO.
 *
 * @returns ISeoEditable com valores padrao
 */
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
 *
 * @param pageData - Documento completo do Firestore
 * @returns IHomeFormsData pronto para o editor
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
 *
 * @returns IHomeFormsData com todos os defaults
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
