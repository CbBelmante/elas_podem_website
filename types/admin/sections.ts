/**
 * Section Data Types - Elas Podem Admin
 *
 * Camada 1: Interfaces que espelham o formato exato dos dados no Firestore.
 * Hierarquia: pages/home → { content: { hero, mission, programs, ... }, seo, lastUpdated, updatedBy }
 */

// ============================================================
// HERO
// ============================================================

export interface IHeroStat {
  icon: string;
  number: string; // texto curto, nao numerico (ex: '2025', '5a', 'MS')
  label: string;
}

export interface IHeroSection {
  badge: string;
  title: string;
  subtitle: string;
  btnDonate: string;
  btnHistory: string;
  stats: IHeroStat[];
}

// ============================================================
// MISSION
// ============================================================

export interface IMissionSection {
  badge: string;
  title: string;
  text1: string;
  text2: string;
  btnText: string;
  image: string; // Firebase Storage URL
  imageAlt: string; // alt text para acessibilidade
}

// ============================================================
// PROGRAMS
// ============================================================

export interface IProgram {
  title: string;
  description: string;
  icon: string;
  color: string; // nome do tema (THEME_COLOR_OPTIONS)
  link: string; // texto do link, nao URL (ex: 'Saiba Mais →')
}

/** Metadados da secao + array de items */
export interface IProgramsSection {
  badge: string;
  title: string;
  subtitle: string;
  items: IProgram[];
}

// ============================================================
// TESTIMONIALS
// ============================================================

export interface ITestimonial {
  quote: string;
  name: string;
  role: string;
  initials: string; // avatar fallback (ex: 'MG')
  image: string; // Firebase Storage URL (opcional)
  imageAlt: string; // alt text para acessibilidade
}

// ============================================================
// SUPPORTERS
// ============================================================

export interface ISupporter {
  name: string;
  icon: string; // fallback quando nao tem logo
  color: string; // nome do tema (THEME_COLOR_OPTIONS)
  image: string; // Firebase Storage URL (opcional)
  imageAlt: string; // alt text para acessibilidade
  url: string;
}

/** Metadados da secao + array de items */
export interface ISupportersSection {
  badge: string;
  title: string;
  subtitle: string;
  items: ISupporter[];
}

// ============================================================
// CONTACT
// ============================================================

export interface IContactMethod {
  label: string;
  value: string;
  icon: string;
  color: string; // nome do tema (THEME_COLOR_OPTIONS)
  url?: string; // clicavel (mailto:, tel:, https://)
}

/** Metadados da secao + metodos de contato + assuntos do formulario */
export interface IContactSection {
  badge: string;
  title: string;
  description: string;
  methods: IContactMethod[];
  formSubjects: string[]; // opcoes do select de assunto
}

// ============================================================
// CTA (Call to Action)
// ============================================================

export interface ICtaSection {
  title: string;
  subtitle: string;
  btnDonate: string;
  btnProjects: string;
}

// ============================================================
// SEO
// ============================================================

/** Open Graph config (readonly — nao editavel pelo admin) */
export interface ISeoOg {
  type: string;
  siteName: string;
  locale: string;
}

export interface ISeo {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string; // Firebase Storage URL
  og: ISeoOg; // readonly
}

// ============================================================
// PAGINA COMPLETA — Documento Firestore (pages/home)
// ============================================================

export interface IHomePageData {
  content: {
    hero: IHeroSection;
    mission: IMissionSection;
    programs: IProgramsSection;
    testimonials: ITestimonial[];
    supporters: ISupportersSection;
    contact: IContactSection;
    cta: ICtaSection;
  };
  seo: ISeo;
  lastUpdated: string;
  updatedById: string;
  updatedByName: string;
}
