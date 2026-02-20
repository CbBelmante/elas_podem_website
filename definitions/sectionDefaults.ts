/**
 * Section Defaults - Elas Podem Admin
 *
 * Valores iniciais de cada secao quando Firestore esta vazio.
 * Usados pelo HomeFormUtils.createDefault*() e createDefaultHomeForms().
 */

// ============================================================
// HERO
// ============================================================

export const HERO_DEFAULTS = {
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
} as const;

export const HERO_STAT_DEFAULTS = {
  icon: 'luc-star',
  number: '',
  label: '',
} as const;

// ============================================================
// MISSION
// ============================================================

export const MISSION_DEFAULTS = {
  badge: 'NOSSA MISSAO',
  title: 'Elas Podem Amar, Elas Podem Ser, Elas Podem TUDO!',
  text1: '',
  text2: '',
  btnText: 'Conheca Nossa Historia',
  image: '',
  imageAlt: '',
} as const;

// ============================================================
// PROGRAMS
// ============================================================

export const PROGRAMS_SECTION_DEFAULTS = {
  badge: 'NOSSOS PROGRAMAS',
  title: 'Nossos Eixos de Atuacao',
  subtitle: '',
} as const;

export const PROGRAM_ITEM_DEFAULTS = {
  title: '',
  description: '',
  icon: 'luc-star',
  color: 'magenta',
  link: 'Saiba Mais',
} as const;

// ============================================================
// TESTIMONIALS
// ============================================================

export const TESTIMONIAL_DEFAULTS = {
  quote: '',
  name: '',
  role: '',
  initials: '',
  image: '',
  imageAlt: '',
} as const;

// ============================================================
// SUPPORTERS
// ============================================================

export const SUPPORTERS_SECTION_DEFAULTS = {
  badge: 'PARCEIROS',
  title: 'Quem Apoia Nossa Causa',
  subtitle: '',
} as const;

export const SUPPORTER_ITEM_DEFAULTS = {
  name: '',
  icon: 'luc-building-2',
  color: 'magenta',
  image: '',
  imageAlt: '',
  url: '',
} as const;

// ============================================================
// CONTACT
// ============================================================

export const CONTACT_DEFAULTS = {
  badge: 'CONTATO',
  title: 'Vamos Conversar?',
  description: '',
  formSubjects: ['Quero ser voluntaria', 'Quero doar', 'Parcerias', 'Duvidas gerais'],
} as const;

export const CONTACT_METHOD_DEFAULTS = {
  label: '',
  value: '',
  icon: 'luc-star',
  color: 'magenta',
} as const;

// ============================================================
// CTA
// ============================================================

export const CTA_DEFAULTS = {
  title: 'Juntas Somos Mais Fortes',
  subtitle: '',
  btnDonate: 'Doar Agora',
  btnProjects: 'Conhecer Projetos',
} as const;

// ============================================================
// SEO
// ============================================================

export const SEO_DEFAULTS = {
  title: 'Elas Podem - Coletivo de Mulheres',
  description: '',
  keywords: ['elas podem', 'mulheres', 'empoderamento'],
  ogImage: '',
} as const;

export const SEO_OG_DEFAULTS = {
  type: 'website',
  siteName: 'Elas Podem',
  locale: 'pt_BR',
} as const;
