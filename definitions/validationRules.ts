/**
 * Validation Rules - Elas Podem Admin
 *
 * Funcoes utilitarias de validacao usadas nos formularios do admin.
 *
 * - createValidationRules() → gera array de validators para CBInput :rules
 * - isValidUrl() → valida se uma string e uma URL valida
 *
 * @module definitions/validationRules
 *
 * @dependencias
 * - ZERO (funcoes puras)
 *
 * @exemplo
 * ```typescript
 * import { createValidationRules } from '~/definitions'
 * import { HERO_CONFIG } from '~/definitions'
 *
 * // No template:
 * // <CBInput :rules="createValidationRules(HERO_CONFIG.validationRules.title)" />
 * ```
 */

// ============================================================
// VALIDATION RULES FACTORY
// ============================================================

/**
 * Gera array de funcoes de validacao para usar em :rules do CBInput.
 *
 * Cada regra recebe o valor do input e retorna `true` (valido)
 * ou uma string com a mensagem de erro.
 *
 * @param rules - Objeto com as regras desejadas
 * @returns Array de funcoes validadoras compativel com CBInput :rules
 *
 * @exemplo
 * ```typescript
 * const rules = createValidationRules({ required: true, minLength: 3, maxLength: 30 })
 * // Retorna: [(v) => !!v || 'Campo obrigatorio', (v) => v.length >= 3 || 'Minimo 3 caracteres', ...]
 * ```
 */
export function createValidationRules(rules: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}): Array<(value: string) => string | true> {
  const validators: Array<(value: string) => string | true> = [];

  if (rules.required) {
    validators.push((v: string) => !!v || 'Campo obrigatorio');
  }

  if (rules.minLength) {
    const min = rules.minLength;
    validators.push((v: string) =>
      !v || v.length >= min ? true : `Minimo ${min} caracteres`,
    );
  }

  if (rules.maxLength) {
    const max = rules.maxLength;
    validators.push((v: string) =>
      !v || v.length <= max ? true : `Maximo ${max} caracteres`,
    );
  }

  return validators;
}

// ============================================================
// URL VALIDATOR
// ============================================================

/**
 * Valida se uma string e uma URL valida.
 *
 * Usa o construtor nativo `URL()` — se nao lanca excecao, e valida.
 * String vazia retorna `true` (campo opcional por padrao).
 *
 * @param url - String a ser validada
 * @returns `true` se valida ou vazia, `false` se invalida
 */
export function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
