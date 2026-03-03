/**
 * Section Data Types - Elas Podem Admin
 *
 * Camada 1: Interfaces que espelham o formato exato dos dados no Firestore.
 * Hierarquia: pages/home → { content: { hero, mission, programs, ... }, seo, lastUpdated, updatedBy }
 */

// ============================================================
// BUTTON (reutilizavel por qualquer secao)
// ============================================================

/** Variantes visuais do CBButton */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

/** Campos padrao de um botao editavel no admin */
export interface ISectionButton {
  label: string;
  color: string; // cor, gradiente preset ou custom (ver AdminColorPicker)
  variant: ButtonVariant;
}

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
  description: string;
  btnDonate: string;
  btnDonateColor: string;
  btnDonateVariant: ButtonVariant;
  btnHistory: string;
  btnHistoryColor: string;
  btnHistoryVariant: ButtonVariant;
  heroImage: string; // Firebase Storage URL — imagem de fundo do hero (opaca)
  heroImageOpacity: number; // 0-100 (%) — opacidade da imagem de fundo
  stats: IHeroStat[];
}

// ============================================================
// MISSION
// ============================================================

export interface IMissionSection {
  badge: string;
  title: string;
  paragraphs: string[];
  btnText: string;
  btnColor: string;
  btnVariant: ButtonVariant;
  image: string; // Firebase Storage URL
  imageOpacity: number; // 0-100 (%) — opacidade da imagem
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
  tags: string[]; // action-tags / palavras-chave do eixo
  tagColor: string; // cor dos badges de tag (THEME_COLOR_OPTIONS)
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
  image: string; // Firebase Storage URL (opcional)
  imageAlt: string; // alt text para acessibilidade
  url: string;
}

/** Metadados da secao + array de items */
export interface ISupportersSection {
  badge: string;
  title: string;
  subtitle: string;
  marqueeSpeed: number;
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
// VALUES
// ============================================================

export interface IValue {
  title: string;
  subtitle: string;
  color: string; // nome do tema (THEME_COLOR_OPTIONS)
}

// ============================================================
// CTA (Call to Action)
// ============================================================

export interface ICtaSection {
  title: string;
  subtitle: string;
  btnDonate: string;
  btnDonateColor: string;
  btnDonateVariant: ButtonVariant;
  btnProjects: string;
  btnProjectsColor: string;
  btnProjectsVariant: ButtonVariant;
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
    values: IValue[];
    cta: ICtaSection;
  };
  seo: ISeo;
  lastUpdated: string;
  updatedById: string;
  updatedByName: string;
}
