/**
 * Theme Options - Elas Podem Admin
 *
 * Opcoes de cores, gradientes e icones disponiveis no admin.
 * Usadas em selects/dropdowns/pickers dos formularios de edicao.
 *
 * Cores: paleta do site Elas Podem (magenta, coral, wine-rose, olive, orange).
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
  { value: 'wine-rose', label: 'admin.theme.colors.wineRose' },
  { value: 'olive', label: 'admin.theme.colors.olive' },
  { value: 'orange', label: 'admin.theme.colors.orange' },
  { value: 'wine', label: 'admin.theme.colors.wine' },
  { value: 'wine-mid', label: 'admin.theme.colors.wineMid' },
  { value: 'purple-night', label: 'admin.theme.colors.purpleNight' },
  { value: 'purple-accent', label: 'admin.theme.colors.purpleAccent' },
] as const;

// ============================================================
// GRADIENTES DO TEMA
// ============================================================

/** Gradientes disponiveis — value mapeia para var(--gradient-{value}) (labels sao chaves i18n) */
export const THEME_GRADIENT_OPTIONS = [
  { value: 'primary', label: 'admin.theme.gradients.primary' },
  { value: 'wine-rose', label: 'admin.theme.gradients.wineRose' },
  { value: 'wine', label: 'admin.theme.gradients.wine' },
  { value: 'magenta', label: 'admin.theme.gradients.magenta' },
  { value: 'coral', label: 'admin.theme.gradients.coral' },
  { value: 'orange', label: 'admin.theme.gradients.orange' },
  { value: 'olive', label: 'admin.theme.gradients.olive' },
  { value: 'purple', label: 'admin.theme.gradients.purple' },
  { value: 'accent', label: 'admin.theme.gradients.accent' },
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
