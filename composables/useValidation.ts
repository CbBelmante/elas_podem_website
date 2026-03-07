/**
 * 🎣 useValidation - Validacao de secoes antes do save
 *
 * Valida campos lendo as configs de validationConfigs.ts (fonte de verdade).
 * validateFields() e generico — funciona pra qualquer secao/pagina.
 * Funcoes por secao sao wrappers finos que passam a config certa.
 *
 * @dependencias
 * - definitions/validationConfigs (*_CONFIG)
 * - types/admin (IValidationResult)
 */

// ============== DEPENDENCIAS INTERNAS ==============

import {
  HERO_CONFIG,
  MISSION_CONFIG,
  PROGRAMS_CONFIG,
  TESTIMONIALS_CONFIG,
  SUPPORTERS_CONFIG,
  CONTACT_CONFIG,
  VALUES_CONFIG,
  CTA_CONFIG,
  SEO_CONFIG,
  ABOUT_HERO_CONFIG,
  ABOUT_TIMELINE_CONFIG,
  ABOUT_TEAM_CONFIG,
  ABOUT_PILLARS_CONFIG,
  ABOUT_CTA_CONFIG,
} from '@definitions/validationConfigs';
import { isValidUrl } from '@utils/validationRules';

import type { IValidationResult } from '@appTypes/admin';

// ============== TYPES ==============

/** Regra de um campo individual (vem dos *_CONFIG.validationRules) */
interface IFieldRule {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
}

/** Regra de quantidade de itens em arrays */
interface IItemsRule {
  readonly min: number;
  readonly max: number;
}

// ============== HELPERS GENERICOS ==============

/**
 * Valida um campo string contra suas regras.
 * Retorna array de erros (vazio = valido).
 */
function validateField(fieldName: string, value: unknown, rules: IFieldRule): string[] {
  const errors: string[] = [];
  const text = typeof value === 'string' ? value.trim() : '';

  if (rules.required && !text) {
    errors.push(`"${fieldName}" é obrigatório`);
    return errors;
  }

  if (!text) return errors;

  if (rules.minLength && text.length < rules.minLength) {
    errors.push(`"${fieldName}" precisa ter no mínimo ${rules.minLength} caracteres`);
  }

  if (rules.maxLength && text.length > rules.maxLength) {
    errors.push(`"${fieldName}" pode ter no máximo ${rules.maxLength} caracteres`);
  }

  return errors;
}

/**
 * Valida todos os campos de um objeto contra um config de validationRules.
 * Le as regras do config em runtime — nao precisa listar campos manualmente.
 */
function validateFields(
  data: Record<string, unknown>,
  validationRules: Record<string, IFieldRule>,
  sectionLabel: string
): IValidationResult {
  const errors: string[] = [];

  for (const [field, rules] of Object.entries(validationRules)) {
    const fieldErrors = validateField(field, data[field], rules);
    errors.push(...fieldErrors);
  }

  if (errors.length > 0) {
    errors.unshift(`Erros em ${sectionLabel}:`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Valida quantidade de itens em um array.
 */
function validateItemCount(items: unknown[], rules: IItemsRule, label: string): string[] {
  const errors: string[] = [];

  if (items.length < rules.min) {
    errors.push(`${label}: mínimo ${rules.min} item(ns)`);
  }

  if (items.length > rules.max) {
    errors.push(`${label}: máximo ${rules.max} itens`);
  }

  return errors;
}

/**
 * Valida todos os itens de um array — aplica validateFields em cada item.
 */
function validateArrayItems(
  items: Record<string, unknown>[],
  validationRules: Record<string, IFieldRule>,
  sectionLabel: string
): string[] {
  const errors: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const itemResult = validateFields(items[i]!, validationRules, `${sectionLabel} #${i + 1}`);
    if (!itemResult.isValid) {
      errors.push(...itemResult.errors);
    }
  }

  return errors;
}

// ============== COMPOSABLE ==============

export function useValidation() {
  // ===== VALIDATORS POR SECAO =====

  const validateHero = (data: Record<string, unknown>): IValidationResult => {
    const result = validateFields(data, HERO_CONFIG.validationRules, 'Hero');
    const errors = [...result.errors];

    if (Array.isArray(data.stats)) {
      errors.push(...validateItemCount(data.stats, HERO_CONFIG.stats, 'Stats'));
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateMission = (data: Record<string, unknown>): IValidationResult => {
    const result = validateFields(data, MISSION_CONFIG.validationRules, 'Missao');
    const errors = [...result.errors];

    if (Array.isArray(data.paragraphs)) {
      errors.push(...validateItemCount(data.paragraphs, MISSION_CONFIG.paragraphs, 'Paragrafos'));
      for (let i = 0; i < data.paragraphs.length; i++) {
        const paraErrors = validateField(
          `Paragrafo ${i + 1}`,
          data.paragraphs[i],
          MISSION_CONFIG.paragraphRule
        );
        errors.push(...paraErrors);
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const validatePrograms = (data: Record<string, unknown>): IValidationResult => {
    const errors: string[] = [];
    // Campos da secao (badge, title)
    errors.push(...validateFields(data, PROGRAMS_CONFIG.sectionRules, 'Programas').errors);
    // Items
    const items = (data.items ?? []) as Record<string, unknown>[];
    errors.push(...validateItemCount(items, PROGRAMS_CONFIG.items, 'Programas'));
    errors.push(...validateArrayItems(items, PROGRAMS_CONFIG.validationRules, 'Programa'));
    return { isValid: errors.length === 0, errors };
  };

  const validateTestimonials = (data: Record<string, unknown>): IValidationResult => {
    const errors: string[] = [];
    const items = (data.items ?? []) as Record<string, unknown>[];
    errors.push(...validateItemCount(items, TESTIMONIALS_CONFIG.items, 'Depoimentos'));
    errors.push(...validateArrayItems(items, TESTIMONIALS_CONFIG.validationRules, 'Depoimento'));
    return { isValid: errors.length === 0, errors };
  };

  const validateSupporters = (data: Record<string, unknown>): IValidationResult => {
    const errors: string[] = [];
    // Campos da secao (badge, title)
    errors.push(...validateFields(data, SUPPORTERS_CONFIG.sectionRules, 'Apoiadores').errors);
    // Items
    const items = (data.items ?? []) as Record<string, unknown>[];
    errors.push(...validateItemCount(items, SUPPORTERS_CONFIG.items, 'Apoiadores'));
    errors.push(...validateArrayItems(items, SUPPORTERS_CONFIG.validationRules, 'Apoiador'));
    return { isValid: errors.length === 0, errors };
  };

  const validateContact = (data: Record<string, unknown>): IValidationResult => {
    const result = validateFields(data, CONTACT_CONFIG.validationRules, 'Contato');
    const errors = [...result.errors];

    if (Array.isArray(data.methods)) {
      errors.push(...validateItemCount(data.methods, CONTACT_CONFIG.methods, 'Metodos de contato'));
    }

    if (Array.isArray(data.formSubjects)) {
      errors.push(
        ...validateItemCount(
          data.formSubjects,
          CONTACT_CONFIG.formSubjects,
          'Assuntos do formulario'
        )
      );
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateValues = (items: Record<string, unknown>[]): IValidationResult => {
    const errors: string[] = [];
    errors.push(...validateItemCount(items, VALUES_CONFIG.items, 'Valores'));
    errors.push(...validateArrayItems(items, VALUES_CONFIG.validationRules, 'Valor'));
    return { isValid: errors.length === 0, errors };
  };

  const validateCta = (data: Record<string, unknown>): IValidationResult => {
    return validateFields(data, CTA_CONFIG.validationRules, 'CTA');
  };

  const validateSeo = (data: Record<string, unknown>): IValidationResult => {
    const result = validateFields(data, SEO_CONFIG.validationRules, 'SEO');
    const errors = [...result.errors];

    if (Array.isArray(data.keywords)) {
      errors.push(...validateItemCount(data.keywords, SEO_CONFIG.keywords, 'Keywords'));
    }

    if (data.ogImage && typeof data.ogImage === 'string' && !isValidUrl(data.ogImage)) {
      errors.push('SEO: URL da imagem OG invalida');
    }

    return { isValid: errors.length === 0, errors };
  };

  // ===== VALIDATORS ABOUT =====

  const validateAboutHero = (data: Record<string, unknown>): IValidationResult => {
    return validateFields(data, ABOUT_HERO_CONFIG.validationRules, 'About Hero');
  };

  const validateAboutTimeline = (data: Record<string, unknown>): IValidationResult => {
    const errors: string[] = [];
    // Campos da seção (badge, title)
    errors.push(...validateFields(data, ABOUT_TIMELINE_CONFIG.sectionRules, 'About Trajetória').errors);
    // Items
    const items = (data.items ?? []) as Record<string, unknown>[];
    errors.push(...validateItemCount(items, ABOUT_TIMELINE_CONFIG.items, 'Trajetória'));
    errors.push(...validateArrayItems(items, ABOUT_TIMELINE_CONFIG.validationRules, 'Evento'));
    return { isValid: errors.length === 0, errors };
  };

  const validateAboutTeam = (data: Record<string, unknown>): IValidationResult => {
    const errors: string[] = [];
    // Campos da seção (badge, title, subtitle)
    errors.push(...validateFields(data, ABOUT_TEAM_CONFIG.sectionRules, 'About Equipe').errors);
    // Items
    const items = (data.items ?? []) as Record<string, unknown>[];
    errors.push(...validateItemCount(items, ABOUT_TEAM_CONFIG.items, 'Equipe'));
    errors.push(...validateArrayItems(items, ABOUT_TEAM_CONFIG.validationRules, 'Membro'));
    return { isValid: errors.length === 0, errors };
  };

  const validateAboutPillars = (data: Record<string, unknown>): IValidationResult => {
    const errors: string[] = [];
    // Campos da seção (badge, title)
    errors.push(...validateFields(data, ABOUT_PILLARS_CONFIG.sectionRules, 'About Pilares').errors);
    // Items
    const items = (data.items ?? []) as Record<string, unknown>[];
    errors.push(...validateItemCount(items, ABOUT_PILLARS_CONFIG.items, 'Pilares'));
    errors.push(...validateArrayItems(items, ABOUT_PILLARS_CONFIG.validationRules, 'Pilar'));
    return { isValid: errors.length === 0, errors };
  };

  const validateAboutCta = (data: Record<string, unknown>): IValidationResult => {
    return validateFields(data, ABOUT_CTA_CONFIG.validationRules, 'About CTA');
  };

  // ===== RETURN =====

  return {
    // Genéricos (pra reuso em qualquer pagina)
    validateFields,
    validateItemCount,
    validateArrayItems,

    // Específicos da home
    validateHero,
    validateMission,
    validatePrograms,
    validateTestimonials,
    validateSupporters,
    validateContact,
    validateValues,
    validateCta,
    validateSeo,

    // Específicos do about
    validateAboutHero,
    validateAboutTimeline,
    validateAboutTeam,
    validateAboutPillars,
    validateAboutCta,
  };
}

// ============== EXPORTS ==============

export type UseValidation = ReturnType<typeof useValidation>;
