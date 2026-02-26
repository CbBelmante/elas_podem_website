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

/** Cores disponiveis no site Elas Podem */
export const THEME_COLOR_OPTIONS = [
  { value: 'magenta', label: 'Magenta' },
  { value: 'coral', label: 'Coral' },
  { value: 'rosa', label: 'Rosa' },
  { value: 'oliva', label: 'Oliva' },
  { value: 'laranja', label: 'Laranja' },
  { value: 'vinho', label: 'Vinho' },
  { value: 'vinho-medio', label: 'Vinho Medio' },
  { value: 'roxo-noite', label: 'Roxo Noite' },
  { value: 'roxo-acento', label: 'Roxo Acento' },
] as const;

// ============================================================
// GRADIENTES DO TEMA
// ============================================================

/** Gradientes disponiveis — value mapeia para var(--gradient-{value}) */
export const THEME_GRADIENT_OPTIONS = [
  { value: 'primary', label: 'Primario' },
  { value: 'rosa', label: 'Rosa' },
  { value: 'vinho', label: 'Vinho' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'coral', label: 'Coral' },
  { value: 'laranja', label: 'Laranja' },
  { value: 'oliva', label: 'Oliva' },
  { value: 'roxo', label: 'Roxo' },
  { value: 'accent', label: 'Acento' },
] as const;

// ============================================================
// ICONES DISPONIVEIS
// ============================================================

/** Subset de icones Lucide usados no site */
export const ICON_OPTIONS = [
  { value: 'luc-award', label: 'Premio' },
  { value: 'luc-megaphone', label: 'Megafone' },
  { value: 'luc-users', label: 'Pessoas' },
  { value: 'luc-heart-handshake', label: 'Apoio' },
  { value: 'luc-graduation-cap', label: 'Educacao' },
  { value: 'luc-scale', label: 'Justica' },
  { value: 'luc-globe', label: 'Globo' },
  { value: 'luc-star', label: 'Estrela' },
  { value: 'luc-building-2', label: 'Predio' },
  { value: 'luc-instagram', label: 'Instagram' },
  { value: 'luc-user-check', label: 'Usuario' },
  { value: 'luc-map-pin', label: 'Localizacao' },
] as const;
