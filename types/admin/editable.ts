/**
 * Editable/Readonly Types - Elas Podem Admin
 *
 * Camada 2: Separacao do que o admin pode editar vs o que e somente leitura.
 *
 * Padrao:
 * - I*Editable → campos que aparecem no formulario do admin
 * - I*Readonly → campos preservados mas ocultos do formulario (ex: cores)
 *
 * Por que separar? O admin nao deve alterar valores que afetam o design
 * (cores, configs OG). Esses campos sao preservados no save mas nao
 * aparecem nos inputs. Isso protege a integridade visual do site.
 *
 * @module types/admin/editable
 *
 * @dependencias
 * - types/admin/sections (IHeroStat, ISeoOg)
 */

import type { IHeroStat, ISeoOg } from './sections';

// ============================================================
// HERO — Tudo editavel
// ============================================================

/** Campos editaveis da secao Hero */
export interface IHeroEditable {
  /** Badge de destaque */
  badge: string;
  /** Titulo principal */
  title: string;
  /** Subtitulo */
  subtitle: string;
  /** Texto do botao de doacao */
  btnDonate: string;
  /** Texto do botao de historia */
  btnHistory: string;
  /** Stats editaveis (icon, number, label) */
  stats: IHeroStat[];
}

// ============================================================
// MISSION — Tudo editavel
// ============================================================

/** Campos editaveis da secao Missao */
export interface IMissionEditable {
  /** Badge de destaque */
  badge: string;
  /** Titulo */
  title: string;
  /** Primeiro paragrafo */
  text1: string;
  /** Segundo paragrafo */
  text2: string;
  /** Texto do botao CTA */
  btnText: string;
  /** URL da imagem (Firebase Storage) */
  image: string;
}

// ============================================================
// PROGRAMS — color e readonly
// ============================================================

/** Campos editaveis de um programa */
export interface IProgramEditable {
  /** Nome do programa */
  title: string;
  /** Descricao */
  description: string;
  /** Icone Lucide */
  icon: string;
  /** Texto do link/botao */
  link: string;
}

/** Campos readonly de um programa (preservados no save) */
export interface IProgramReadonly {
  /** Cor do tema — nao editavel pelo admin */
  color: string;
}

// ============================================================
// TESTIMONIALS — Tudo editavel
// ============================================================

/** Campos editaveis de um depoimento */
export interface ITestimonialEditable {
  /** Texto do depoimento */
  quote: string;
  /** Nome da pessoa */
  name: string;
  /** Cargo/funcao */
  role: string;
  /** Iniciais para avatar fallback */
  initials: string;
  /** URL da foto */
  image: string;
}

// ============================================================
// SUPPORTERS — color e readonly
// ============================================================

/** Campos editaveis de um apoiador */
export interface ISupporterEditable {
  /** Nome do apoiador */
  name: string;
  /** Icone Lucide fallback */
  icon: string;
  /** URL do logo */
  image: string;
  /** URL do site */
  url: string;
}

/** Campos readonly de um apoiador */
export interface ISupporterReadonly {
  /** Cor do tema — nao editavel pelo admin */
  color: string;
}

// ============================================================
// CONTACT — color dos metodos e readonly
// ============================================================

/** Campos editaveis de um metodo de contato */
export interface IContactMethodEditable {
  /** Label descritivo */
  label: string;
  /** Valor do contato */
  value: string;
  /** Icone Lucide */
  icon: string;
  /** URL clicavel (opcional) */
  url?: string;
}

/** Campos readonly de um metodo de contato */
export interface IContactMethodReadonly {
  /** Cor do tema — nao editavel pelo admin */
  color: string;
}

/** Campos editaveis da secao Contato (inclui sub-arrays) */
export interface IContactEditable {
  /** Badge de destaque */
  badge: string;
  /** Titulo */
  title: string;
  /** Descricao */
  description: string;
  /** Metodos de contato editaveis */
  methods: IContactMethodEditable[];
  /** Opcoes do select de assunto */
  formSubjects: string[];
}

/** Campos readonly da secao Contato */
export interface IContactReadonly {
  /** Cores dos metodos de contato */
  methods: IContactMethodReadonly[];
}

// ============================================================
// CTA — Tudo editavel
// ============================================================

/** Campos editaveis da secao CTA */
export interface ICtaEditable {
  /** Titulo */
  title: string;
  /** Subtitulo */
  subtitle: string;
  /** Texto do botao de doacao */
  btnDonate: string;
  /** Texto do botao de projetos */
  btnProjects: string;
}

// ============================================================
// SEO — og config e readonly
// ============================================================

/** Campos editaveis do SEO */
export interface ISeoEditable {
  /** Titulo da pagina */
  title: string;
  /** Meta description */
  description: string;
  /** Keywords */
  keywords: string[];
  /** URL da imagem OG */
  ogImage: string;
}

/** Campos readonly do SEO (config Open Graph) */
export interface ISeoReadonly {
  /** Configuracao OG — nao editavel pelo admin */
  og: ISeoOg;
}
