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
  description: '',
  btnDonate: 'Doe Agora',
  btnDonateColor: 'gradient:primary',
  btnDonateVariant: 'solid',
  btnHistory: 'Nossa Historia',
  btnHistoryColor: 'wine-mid',
  btnHistoryVariant: 'outline',
  heroImage: '',
  heroImageOpacity: 100,
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
  paragraphs: [''],
  btnText: 'Conheca Nossa Historia',
  btnColor: 'gradient:primary',
  btnVariant: 'solid',
  image: '',
  imageOpacity: 100,
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
  tags: [] as readonly string[],
  tagColor: 'magenta',
} as const;

// ============================================================
// TESTIMONIALS
// ============================================================

export const TESTIMONIALS_SECTION_DEFAULTS = {
  autoplay: true,
  autoplayInterval: 6000,
} as const;

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
  marqueeSpeed: 18,
} as const;

export const SUPPORTER_ITEM_DEFAULTS = {
  name: '',
  icon: 'luc-building-2',
  image: '',
  imageAlt: '',
  url: '',
  logoSize: 48,
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
// VALUES
// ============================================================

export const VALUE_ITEM_DEFAULTS = {
  title: '',
  subtitle: '',
  color: 'wine',
} as const;

// ============================================================
// CTA
// ============================================================

export const CTA_DEFAULTS = {
  title: 'Juntas Somos Mais Fortes',
  subtitle: '',
  btnDonate: 'Doar Agora',
  btnDonateColor: 'gradient:primary',
  btnDonateVariant: 'solid',
  btnProjects: 'Conhecer Projetos',
  btnProjectsColor: '#FFFFFF',
  btnProjectsVariant: 'outline',
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

// ============================================================
// ABOUT — HERO
// ============================================================

export const ABOUT_HERO_DEFAULTS = {
  badge: 'CONHEÇA NOSSA HISTÓRIA',
  title: 'Quem Somos',
  description:
    'Desde 2020, o Coletivo Elas Podem atua em Campo Grande, MS — um movimento feminista de mulheres cis e trans unidas pela equidade de gênero e ampliação da participação feminina em espaços públicos e privados.',
} as const;

// ============================================================
// ABOUT — TIMELINE
// ============================================================

export const ABOUT_TIMELINE_SECTION_DEFAULTS = {
  badge: 'NOSSA TRAJETÓRIA',
  title: 'Uma História de Luta e Conquistas',
} as const;

export const ABOUT_TIMELINE_ITEM_DEFAULTS = {
  year: '',
  title: '',
  description: '',
  icon: 'luc-star',
  color: 'magenta',
} as const;

// ============================================================
// ABOUT — TEAM
// ============================================================

export const ABOUT_TEAM_SECTION_DEFAULTS = {
  badge: 'NOSSA EQUIPE',
  title: 'Mulheres que Fazem Acontecer',
  subtitle:
    'Conheça a diretoria eleita em julho de 2025, que lidera o coletivo com gestão democrática e compromisso com a equidade.',
} as const;

export const ABOUT_TEAM_MEMBER_DEFAULTS = {
  name: '',
  role: '',
  bio: '',
  image: '',
  imageAlt: '',
  initials: '',
} as const;

// ============================================================
// ABOUT — PILLARS
// ============================================================

export const ABOUT_PILLARS_SECTION_DEFAULTS = {
  badge: 'O QUE NOS MOVE',
  title: 'Missão, Visão e Valores',
} as const;

export const ABOUT_PILLAR_ITEM_DEFAULTS = {
  icon: 'luc-heart',
  title: '',
  description: '',
  color: 'magenta',
} as const;

// ============================================================
// ABOUT — CTA
// ============================================================

export const ABOUT_CTA_DEFAULTS = {
  title: 'Faça Parte Dessa História',
  subtitle: '',
  btnDonate: 'Doe Agora',
  btnDonateColor: 'gradient:primary',
  btnDonateVariant: 'solid',
  btnContact: 'Entre em Contato',
  btnContactColor: '#FFFFFF',
  btnContactVariant: 'outline',
} as const;
