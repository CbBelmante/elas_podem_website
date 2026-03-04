/**
 * 🎯 colorResolver - Resolucao de valores de cor/gradiente do tema
 *
 * Converte valores semanticos armazenados no Firestore para CSS valido.
 * Suporta cores solidas, gradientes preset, gradientes custom e passthrough (hex/rgb/hsl).
 */

// ============== TYPES ==============

export type ColorValueType = 'color' | 'gradient' | 'custom' | 'raw';

export interface IParsedColorValue {
  type: ColorValueType;
  raw: string;
}

// ============== LEGACY NAME MAP ==============

/** Maps old Portuguese color names (stored in Firestore) to new English CSS variable names */
const LEGACY_NAMES: Record<string, string> = {
  rosa: 'wine-rose',
  oliva: 'olive',
  laranja: 'orange',
  vinho: 'wine',
  'vinho-medio': 'wine-mid',
  'roxo-noite': 'purple-night',
  'roxo-acento': 'purple-accent',
};

// ============== PARSING ==============

/** Detecta o tipo do valor armazenado e extrai conteudo util */
export function parseColorValue(value: string): IParsedColorValue {
  if (!value) return { type: 'color', raw: '' };

  // Passthrough: hex, rgb, hsl, var() — ja sao CSS validos
  if (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl') ||
    value.startsWith('var(')
  ) {
    return { type: 'raw', raw: value };
  }

  if (value.startsWith('custom:')) return { type: 'custom', raw: value.replace('custom:', '') };
  if (value.startsWith('gradient:'))
    return { type: 'gradient', raw: value.replace('gradient:', '') };

  return { type: 'color', raw: value };
}

// ============== RESOLUTION ==============

/** Converte valor armazenado para CSS background valido */
export function resolveColorValue(value: string, fallback = ''): string {
  if (!value && !fallback) return 'transparent';
  const parsed = parseColorValue(value || fallback);

  if (parsed.type === 'raw') return parsed.raw;

  if (parsed.type === 'custom') {
    const parts = parsed.raw.split(',');
    const css = parts.map((c) => `var(--color-${LEGACY_NAMES[c] ?? c})`);
    if (css.length === 3)
      return `linear-gradient(135deg, ${css[0]} 0%, ${css[1]} 50%, ${css[2]} 100%)`;
    if (css.length === 2) return `linear-gradient(135deg, ${css[0]} 0%, ${css[1]} 100%)`;
    return 'transparent';
  }

  const name = LEGACY_NAMES[parsed.raw] ?? parsed.raw;
  if (parsed.type === 'gradient') return `var(--gradient-${name})`;

  return `var(--color-${name})`;
}

// ============== HELPERS ==============

/** Verifica se o valor resolve para gradiente (afeta variant do botao) */
export function isGradientValue(value: string): boolean {
  if (!value) return false;
  return value.startsWith('gradient:') || value.startsWith('custom:');
}
