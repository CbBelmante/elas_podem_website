/**
 * Section Data Types - Elas Podem Admin
 *
 * Camada 1: Interfaces que espelham o formato exato dos dados no Firestore.
 * Cada interface aqui corresponde a um campo do documento `pages/home`.
 *
 * Hierarquia no Firestore:
 *   pages/home → { content: { hero, mission, programs, ... }, seo, lastUpdated, updatedBy }
 *
 * @module types/admin/sections
 *
 * @dependencias
 * - ZERO (apenas tipos TypeScript)
 *
 * @exemplo
 * ```typescript
 * import type { IHeroSection, IProgram } from '~/types/admin'
 *
 * const hero: IHeroSection = await getDoc(doc(db, 'pages', 'home'))
 * ```
 */

// ============================================================
// HERO
// ============================================================

/** Estatistica exibida no banner principal (ex: "2025 Sede Propria") */
export interface IHeroStat {
  /** Icone Lucide (ex: 'luc-award') */
  icon: string;
  /** Valor numerico ou texto curto (ex: '2025', '5a', 'MS') */
  number: string;
  /** Descricao do stat (ex: 'Sede Propria') */
  label: string;
}

/** Secao Hero — banner principal da landing page */
export interface IHeroSection {
  /** Badge de destaque acima do titulo (ex: 'MOVIMENTO NACIONAL DESDE 2020') */
  badge: string;
  /** Titulo principal do hero */
  title: string;
  /** Subtitulo/descricao do hero */
  subtitle: string;
  /** Texto do botao de doacao */
  btnDonate: string;
  /** Texto do botao de historia */
  btnHistory: string;
  /** Array de estatisticas exibidas no hero */
  stats: IHeroStat[];
}

// ============================================================
// MISSION
// ============================================================

/** Secao Missao — apresenta o proposito da ONG */
export interface IMissionSection {
  /** Badge de destaque (ex: 'NOSSA MISSAO') */
  badge: string;
  /** Titulo da secao */
  title: string;
  /** Primeiro paragrafo de texto */
  text1: string;
  /** Segundo paragrafo de texto */
  text2: string;
  /** Texto do botao CTA */
  btnText: string;
  /** URL da imagem da secao (Firebase Storage) */
  image: string;
}

// ============================================================
// PROGRAMS
// ============================================================

/** Programa/projeto da ONG exibido em card */
export interface IProgram {
  /** Nome do programa */
  title: string;
  /** Descricao curta do programa */
  description: string;
  /** Icone Lucide (ex: 'luc-graduation-cap') */
  icon: string;
  /** Cor do tema (ex: 'magenta', 'coral') — definida em THEME_COLOR_OPTIONS */
  color: string;
  /** Texto do link/botao do card (ex: 'Saiba Mais') */
  link: string;
}

// ============================================================
// TESTIMONIALS
// ============================================================

/** Depoimento de uma participante/apoiadora */
export interface ITestimonial {
  /** Texto do depoimento */
  quote: string;
  /** Nome da pessoa */
  name: string;
  /** Cargo/funcao da pessoa */
  role: string;
  /** Iniciais para avatar fallback (ex: 'MG') */
  initials: string;
  /** URL da foto (Firebase Storage, opcional) */
  image: string;
}

// ============================================================
// SUPPORTERS
// ============================================================

/** Apoiador/parceiro da ONG */
export interface ISupporter {
  /** Nome do apoiador/empresa */
  name: string;
  /** Icone Lucide fallback (ex: 'luc-building-2') */
  icon: string;
  /** Cor do tema — definida em THEME_COLOR_OPTIONS */
  color: string;
  /** URL do logo (Firebase Storage, opcional) */
  image: string;
  /** URL do site do apoiador (opcional) */
  url: string;
}

// ============================================================
// CONTACT
// ============================================================

/** Metodo de contato (telefone, email, endereco, etc.) */
export interface IContactMethod {
  /** Label descritivo (ex: 'Telefone', 'Email') */
  label: string;
  /** Valor do contato (ex: '(11) 99999-9999') */
  value: string;
  /** Icone Lucide */
  icon: string;
  /** Cor do tema */
  color: string;
  /** URL clicavel (opcional — ex: 'mailto:', 'tel:', 'https://') */
  url?: string;
}

/** Secao Contato — formulario + metodos de contato */
export interface IContactSection {
  /** Badge de destaque (ex: 'CONTATO') */
  badge: string;
  /** Titulo da secao */
  title: string;
  /** Texto descritivo */
  description: string;
  /** Array de metodos de contato */
  methods: IContactMethod[];
  /** Opcoes do select de assunto no formulario de contato */
  formSubjects: string[];
}

// ============================================================
// CTA (Call to Action)
// ============================================================

/** Secao CTA — call to action final da pagina */
export interface ICtaSection {
  /** Titulo do CTA */
  title: string;
  /** Subtitulo/descricao */
  subtitle: string;
  /** Texto do botao de doacao */
  btnDonate: string;
  /** Texto do botao de projetos */
  btnProjects: string;
}

// ============================================================
// SEO
// ============================================================

/** Configuracao Open Graph (readonly — nao editavel pelo admin) */
export interface ISeoOg {
  /** Tipo OG (ex: 'website') */
  type: string;
  /** Nome do site OG */
  siteName: string;
  /** Locale OG (ex: 'pt_BR') */
  locale: string;
}

/** Configuracao SEO da pagina */
export interface ISeo {
  /** Titulo da pagina (tag <title>) */
  title: string;
  /** Meta description */
  description: string;
  /** Keywords para SEO */
  keywords: string[];
  /** URL da imagem OG (Firebase Storage) */
  ogImage: string;
  /** Configuracao Open Graph (readonly) */
  og: ISeoOg;
}

// ============================================================
// PAGINA COMPLETA — Documento Firestore
// ============================================================

/**
 * Documento completo da homepage no Firestore.
 *
 * Caminho: `pages/home`
 *
 * @exemplo
 * ```typescript
 * const snap = await getDoc(doc(db, 'pages', 'home'))
 * const data = snap.data() as IHomePageData
 * ```
 */
export interface IHomePageData {
  /** Conteudo de todas as secoes da homepage */
  content: {
    hero: IHeroSection;
    mission: IMissionSection;
    programs: IProgram[];
    testimonials: ITestimonial[];
    supporters: ISupporter[];
    contact: IContactSection;
    cta: ICtaSection;
  };
  /** Configuracao SEO */
  seo: ISeo;
  /** ISO timestamp do ultimo update */
  lastUpdated: string;
  /** ID do admin que fez o ultimo update */
  updatedById: string;
  /** Nome do admin que fez o ultimo update */
  updatedByName: string;
}
