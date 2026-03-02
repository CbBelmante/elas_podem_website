/**
 * Theme Options - Elas Podem Admin
 *
 * Opcoes de cores, gradientes e icones disponiveis no admin.
 * Usadas em selects/dropdowns/pickers dos formularios de edicao.
 *
 * Cores: paleta do site Elas Podem (magenta, coral, rosa, oliva, laranja).
 * Gradientes: mapeia para --gradient-{value} do theme.css.
 * Icones: subset de Lucide icons usados no site.
 *
 * Extensivel — para adicionar novas opcoes, basta inserir aqui
 * e elas aparecem automaticamente em todos os selects do admin.
 *
 * @module definitions/themeOptions
 *
 * @dependencias
 * - ZERO (apenas constantes)
 */

// ============================================================
// CORES DO TEMA
// ============================================================

/** Cores disponiveis no site Elas Podem (labels sao chaves i18n) */
export const THEME_COLOR_OPTIONS = [
  { value: 'magenta', label: 'admin.theme.colors.magenta' },
  { value: 'coral', label: 'admin.theme.colors.coral' },
  { value: 'rosa', label: 'admin.theme.colors.rosa' },
  { value: 'oliva', label: 'admin.theme.colors.oliva' },
  { value: 'laranja', label: 'admin.theme.colors.laranja' },
  { value: 'vinho', label: 'admin.theme.colors.vinho' },
  { value: 'vinho-medio', label: 'admin.theme.colors.vinhoMedio' },
  { value: 'roxo-noite', label: 'admin.theme.colors.roxoNoite' },
  { value: 'roxo-acento', label: 'admin.theme.colors.roxoAcento' },
] as const;

// ============================================================
// GRADIENTES DO TEMA
// ============================================================

/** Gradientes disponiveis — value mapeia para var(--gradient-{value}) (labels sao chaves i18n) */
export const THEME_GRADIENT_OPTIONS = [
  { value: 'primary', label: 'admin.theme.gradients.primary' },
  { value: 'rosa', label: 'admin.theme.gradients.rosa' },
  { value: 'vinho', label: 'admin.theme.gradients.vinho' },
  { value: 'magenta', label: 'admin.theme.gradients.magenta' },
  { value: 'coral', label: 'admin.theme.gradients.coral' },
  { value: 'laranja', label: 'admin.theme.gradients.laranja' },
  { value: 'oliva', label: 'admin.theme.gradients.oliva' },
  { value: 'roxo', label: 'admin.theme.gradients.roxo' },
  { value: 'accent', label: 'admin.theme.gradients.acento' },
] as const;

// ============================================================
// VARIANTES DE BOTAO
// ============================================================

/** Variantes visuais do CBButton para selects do admin (labels sao chaves i18n) */
export const BUTTON_VARIANT_OPTIONS = [
  { value: 'solid', label: 'admin.theme.variants.solid' },
  { value: 'outline', label: 'admin.theme.variants.outline' },
  { value: 'ghost', label: 'admin.theme.variants.ghost' },
  { value: 'link', label: 'admin.theme.variants.link' },
] as const;

// ============================================================
// ICONES DISPONIVEIS
// ============================================================

/** Subset de icones Lucide usados no site (labels sao chaves i18n) */
export const ICON_OPTIONS = [
  { value: 'luc-award', label: 'admin.theme.icons.award' },
  { value: 'luc-megaphone', label: 'admin.theme.icons.megaphone' },
  { value: 'luc-users', label: 'admin.theme.icons.users' },
  { value: 'luc-heart-handshake', label: 'admin.theme.icons.heartHandshake' },
  { value: 'luc-graduation-cap', label: 'admin.theme.icons.graduationCap' },
  { value: 'luc-scale', label: 'admin.theme.icons.scale' },
  { value: 'luc-globe', label: 'admin.theme.icons.globe' },
  { value: 'luc-star', label: 'admin.theme.icons.star' },
  { value: 'luc-building-2', label: 'admin.theme.icons.building' },
  { value: 'luc-instagram', label: 'admin.theme.icons.instagram' },
  { value: 'luc-user-check', label: 'admin.theme.icons.userCheck' },
  { value: 'luc-map-pin', label: 'admin.theme.icons.mapPin' },
] as const;
