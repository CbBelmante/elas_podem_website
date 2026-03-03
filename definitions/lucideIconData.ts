/**
 * 🎨 Lucide Icon Data — Catalogo curado de icones Lucide
 *
 * Icones organizados por categoria, relevantes para ONG/projeto social.
 * Segue padrao do JustPrime MDIIconsDataUtils.ts.
 *
 * Cada icone tem: value (luc-*), label (chave i18n), category.
 * Busca hibrida por label traduzido + value + category.
 *
 * @module definitions/lucideIconData
 *
 * @dependencias
 * - ZERO (apenas constantes e funcoes puras)
 */

// ============================================================
// TIPOS
// ============================================================

export interface ILucideIcon {
  value: string;
  label: string;
  category: LucideIconCategory;
}

export type LucideIconCategory =
  | 'social'
  | 'education'
  | 'communication'
  | 'people'
  | 'legal'
  | 'general'
  | 'business'
  | 'contact';

// ============================================================
// CATEGORIAS
// ============================================================

/** Lista ordenada de categorias (para exibir no filtro) */
export const LUCIDE_CATEGORIES: LucideIconCategory[] = [
  'social',
  'education',
  'communication',
  'people',
  'legal',
  'general',
  'business',
  'contact',
];

// ============================================================
// CATALOGO POR CATEGORIA
// ============================================================

/** Acao social, comunidade, voluntariado */
const SOCIAL_ICONS: ILucideIcon[] = [
  { value: 'luc-heart', label: 'admin.theme.icons.heart', category: 'social' },
  { value: 'luc-heart-handshake', label: 'admin.theme.icons.heartHandshake', category: 'social' },
  { value: 'luc-hand-helping', label: 'admin.theme.icons.handHelping', category: 'social' },
  { value: 'luc-gift', label: 'admin.theme.icons.gift', category: 'social' },
  { value: 'luc-ribbon', label: 'admin.theme.icons.ribbon', category: 'social' },
  { value: 'luc-shield', label: 'admin.theme.icons.shield', category: 'social' },
  { value: 'luc-shield-check', label: 'admin.theme.icons.shieldCheck', category: 'social' },
  { value: 'luc-sparkles', label: 'admin.theme.icons.sparkles', category: 'social' },
  { value: 'luc-handshake', label: 'admin.theme.icons.handshake', category: 'social' },
  { value: 'luc-badge-check', label: 'admin.theme.icons.badgeCheck', category: 'social' },
];

/** Educacao, aprendizado, conhecimento */
const EDUCATION_ICONS: ILucideIcon[] = [
  { value: 'luc-graduation-cap', label: 'admin.theme.icons.graduationCap', category: 'education' },
  { value: 'luc-book-open', label: 'admin.theme.icons.bookOpen', category: 'education' },
  { value: 'luc-notebook-pen', label: 'admin.theme.icons.notebookPen', category: 'education' },
  { value: 'luc-library', label: 'admin.theme.icons.library', category: 'education' },
  { value: 'luc-school', label: 'admin.theme.icons.school', category: 'education' },
  { value: 'luc-pencil', label: 'admin.theme.icons.pencil', category: 'education' },
  { value: 'luc-brain', label: 'admin.theme.icons.brain', category: 'education' },
  { value: 'luc-lightbulb', label: 'admin.theme.icons.lightbulb', category: 'education' },
  { value: 'luc-bookmark', label: 'admin.theme.icons.bookmark', category: 'education' },
  { value: 'luc-clipboard', label: 'admin.theme.icons.clipboard', category: 'education' },
];

/** Comunicacao, midia, divulgacao */
const COMMUNICATION_ICONS: ILucideIcon[] = [
  { value: 'luc-megaphone', label: 'admin.theme.icons.megaphone', category: 'communication' },
  { value: 'luc-radio', label: 'admin.theme.icons.radio', category: 'communication' },
  { value: 'luc-mic', label: 'admin.theme.icons.mic', category: 'communication' },
  { value: 'luc-tv', label: 'admin.theme.icons.tv', category: 'communication' },
  { value: 'luc-newspaper', label: 'admin.theme.icons.newspaper', category: 'communication' },
  { value: 'luc-rss', label: 'admin.theme.icons.rss', category: 'communication' },
  { value: 'luc-podcast', label: 'admin.theme.icons.podcast', category: 'communication' },
  { value: 'luc-volume-2', label: 'admin.theme.icons.volume', category: 'communication' },
  { value: 'luc-message-circle', label: 'admin.theme.icons.messageCircle', category: 'communication' },
];

/** Pessoas, grupos, comunidade */
const PEOPLE_ICONS: ILucideIcon[] = [
  { value: 'luc-users', label: 'admin.theme.icons.users', category: 'people' },
  { value: 'luc-user-check', label: 'admin.theme.icons.userCheck', category: 'people' },
  { value: 'luc-user-plus', label: 'admin.theme.icons.userPlus', category: 'people' },
  { value: 'luc-baby', label: 'admin.theme.icons.baby', category: 'people' },
  { value: 'luc-accessibility', label: 'admin.theme.icons.accessibility', category: 'people' },
  { value: 'luc-person-standing', label: 'admin.theme.icons.personStanding', category: 'people' },
  { value: 'luc-user-round', label: 'admin.theme.icons.userRound', category: 'people' },
  { value: 'luc-users-round', label: 'admin.theme.icons.usersRound', category: 'people' },
  { value: 'luc-circle-user', label: 'admin.theme.icons.circleUser', category: 'people' },
  { value: 'luc-contact', label: 'admin.theme.icons.contact', category: 'people' },
];

/** Justica, direitos, legislacao */
const LEGAL_ICONS: ILucideIcon[] = [
  { value: 'luc-scale', label: 'admin.theme.icons.scale', category: 'legal' },
  { value: 'luc-gavel', label: 'admin.theme.icons.gavel', category: 'legal' },
  { value: 'luc-file-text', label: 'admin.theme.icons.fileText', category: 'legal' },
  { value: 'luc-landmark', label: 'admin.theme.icons.landmark', category: 'legal' },
  { value: 'luc-shield-alert', label: 'admin.theme.icons.shieldAlert', category: 'legal' },
  { value: 'luc-vote', label: 'admin.theme.icons.vote', category: 'legal' },
  { value: 'luc-flag', label: 'admin.theme.icons.flag', category: 'legal' },
  { value: 'luc-scroll-text', label: 'admin.theme.icons.scrollText', category: 'legal' },
];

/** Uso geral, decorativos, destaque */
const GENERAL_ICONS: ILucideIcon[] = [
  { value: 'luc-star', label: 'admin.theme.icons.star', category: 'general' },
  { value: 'luc-award', label: 'admin.theme.icons.award', category: 'general' },
  { value: 'luc-trophy', label: 'admin.theme.icons.trophy', category: 'general' },
  { value: 'luc-target', label: 'admin.theme.icons.target', category: 'general' },
  { value: 'luc-zap', label: 'admin.theme.icons.zap', category: 'general' },
  { value: 'luc-flame', label: 'admin.theme.icons.flame', category: 'general' },
  { value: 'luc-rocket', label: 'admin.theme.icons.rocket', category: 'general' },
  { value: 'luc-calendar', label: 'admin.theme.icons.calendar', category: 'general' },
  { value: 'luc-clock', label: 'admin.theme.icons.clock', category: 'general' },
  { value: 'luc-check-circle', label: 'admin.theme.icons.checkCircle', category: 'general' },
  { value: 'luc-circle-dot', label: 'admin.theme.icons.circleDot', category: 'general' },
  { value: 'luc-trending-up', label: 'admin.theme.icons.trendingUp', category: 'general' },
];

/** Organizacoes, negocios, economia */
const BUSINESS_ICONS: ILucideIcon[] = [
  { value: 'luc-building-2', label: 'admin.theme.icons.building', category: 'business' },
  { value: 'luc-briefcase', label: 'admin.theme.icons.briefcase', category: 'business' },
  { value: 'luc-chart-bar', label: 'admin.theme.icons.chartBar', category: 'business' },
  { value: 'luc-coins', label: 'admin.theme.icons.coins', category: 'business' },
  { value: 'luc-wallet', label: 'admin.theme.icons.wallet', category: 'business' },
  { value: 'luc-receipt', label: 'admin.theme.icons.receipt', category: 'business' },
  { value: 'luc-store', label: 'admin.theme.icons.store', category: 'business' },
  { value: 'luc-globe', label: 'admin.theme.icons.globe', category: 'business' },
];

/** Contato, localizacao, redes sociais */
const CONTACT_ICONS: ILucideIcon[] = [
  { value: 'luc-map-pin', label: 'admin.theme.icons.mapPin', category: 'contact' },
  { value: 'luc-phone', label: 'admin.theme.icons.phone', category: 'contact' },
  { value: 'luc-mail', label: 'admin.theme.icons.mail', category: 'contact' },
  { value: 'luc-instagram', label: 'admin.theme.icons.instagram', category: 'contact' },
  { value: 'luc-link', label: 'admin.theme.icons.link', category: 'contact' },
  { value: 'luc-at-sign', label: 'admin.theme.icons.atSign', category: 'contact' },
  { value: 'luc-send', label: 'admin.theme.icons.send', category: 'contact' },
  { value: 'luc-share-2', label: 'admin.theme.icons.share', category: 'contact' },
  { value: 'luc-external-link', label: 'admin.theme.icons.externalLink', category: 'contact' },
];

// ============================================================
// CATALOGO COMPLETO
// ============================================================

/** Lista completa de todos os icones Lucide curados */
export const ALL_LUCIDE_ICONS: ILucideIcon[] = [
  ...SOCIAL_ICONS,
  ...EDUCATION_ICONS,
  ...COMMUNICATION_ICONS,
  ...PEOPLE_ICONS,
  ...LEGAL_ICONS,
  ...GENERAL_ICONS,
  ...BUSINESS_ICONS,
  ...CONTACT_ICONS,
];

// ============================================================
// FUNCOES UTILITARIAS
// ============================================================

/** Agrupa icones por categoria */
export function getIconsByCategory(): Record<LucideIconCategory, ILucideIcon[]> {
  const grouped = {} as Record<LucideIconCategory, ILucideIcon[]>;

  for (const icon of ALL_LUCIDE_ICONS) {
    if (!grouped[icon.category]) grouped[icon.category] = [];
    grouped[icon.category].push(icon);
  }

  return grouped;
}

/** Busca icones por texto (label traduzido, value ou category) */
export function searchIcons(term: string, translatedLabels?: Map<string, string>): ILucideIcon[] {
  const t = term.toLowerCase();

  return ALL_LUCIDE_ICONS.filter((icon) => {
    const translatedLabel = translatedLabels?.get(icon.label)?.toLowerCase() ?? '';
    return (
      translatedLabel.includes(t) ||
      icon.value.toLowerCase().includes(t) ||
      icon.category.toLowerCase().includes(t)
    );
  });
}

/** Busca um icone pelo value */
export function findIconByValue(value: string): ILucideIcon | undefined {
  return ALL_LUCIDE_ICONS.find((icon) => icon.value === value);
}

/** Retorna icones de uma categoria especifica */
export function getIconsOfCategory(category: LucideIconCategory): ILucideIcon[] {
  return ALL_LUCIDE_ICONS.filter((icon) => icon.category === category);
}
