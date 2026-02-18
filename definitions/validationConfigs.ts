/**
 * Validation Configs - Elas Podem Admin
 *
 * Configuracoes de validacao e compressao por secao da homepage.
 *
 * Cada *_CONFIG define:
 * - validationRules: required, minLength, maxLength por campo
 * - items: min/max de itens em arrays (quando aplicavel)
 *
 * COMPRESSION_SETTINGS define regras de compressao por categoria de imagem.
 *
 * Esses valores sao consumidos por:
 * - useValidation.ts → validacao de formularios
 * - createValidationRules() em validationRules.ts → regras inline para CBInput :rules
 * - useFirebaseStorage.ts → compressao de imagens no upload
 *
 * @module definitions/validationConfigs
 *
 * @dependencias
 * - ZERO (apenas constantes)
 */

// ============================================================
// HERO
// ============================================================

/** Regras de validacao e limites da secao Hero */
export const HERO_CONFIG = {
  validationRules: {
    badge: { required: true, minLength: 3, maxLength: 60 },
    title: { required: true, minLength: 3, maxLength: 30 },
    subtitle: { required: true, minLength: 10, maxLength: 300 },
    btnDonate: { required: true, minLength: 2, maxLength: 30 },
    btnHistory: { required: true, minLength: 2, maxLength: 30 },
  },
  /** Min/max de stats no hero */
  stats: { min: 1, max: 6 },
} as const;

// ============================================================
// MISSION
// ============================================================

/** Regras de validacao da secao Missao */
export const MISSION_CONFIG = {
  validationRules: {
    badge: { required: true, minLength: 3, maxLength: 60 },
    title: { required: true, minLength: 5, maxLength: 100 },
    text1: { required: true, minLength: 20, maxLength: 500 },
    text2: { required: true, minLength: 20, maxLength: 500 },
    btnText: { required: true, minLength: 2, maxLength: 40 },
  },
} as const;

// ============================================================
// PROGRAMS
// ============================================================

/** Regras de validacao e limites da secao Programas */
export const PROGRAMS_CONFIG = {
  validationRules: {
    title: { required: true, minLength: 3, maxLength: 40 },
    description: { required: true, minLength: 10, maxLength: 200 },
    link: { required: true, minLength: 2, maxLength: 30 },
  },
  /** Min/max de programas */
  items: { min: 1, max: 8 },
} as const;

// ============================================================
// TESTIMONIALS
// ============================================================

/** Regras de validacao e limites da secao Depoimentos */
export const TESTIMONIALS_CONFIG = {
  validationRules: {
    quote: { required: true, minLength: 20, maxLength: 500 },
    name: { required: true, minLength: 2, maxLength: 60 },
    role: { required: true, minLength: 2, maxLength: 60 },
  },
  /** Min/max de depoimentos */
  items: { min: 1, max: 12 },
} as const;

// ============================================================
// SUPPORTERS
// ============================================================

/** Regras de validacao e limites da secao Apoiadores */
export const SUPPORTERS_CONFIG = {
  validationRules: {
    name: { required: true, minLength: 2, maxLength: 60 },
  },
  /** Min/max de apoiadores */
  items: { min: 1, max: 20 },
} as const;

// ============================================================
// CONTACT
// ============================================================

/** Regras de validacao e limites da secao Contato */
export const CONTACT_CONFIG = {
  validationRules: {
    badge: { required: true, minLength: 3, maxLength: 60 },
    title: { required: true, minLength: 3, maxLength: 60 },
    description: { required: true, minLength: 10, maxLength: 300 },
  },
  /** Min/max de metodos de contato */
  methods: { min: 1, max: 8 },
  /** Min/max de assuntos no formulario */
  formSubjects: { min: 1, max: 10 },
} as const;

// ============================================================
// CTA
// ============================================================

/** Regras de validacao da secao CTA */
export const CTA_CONFIG = {
  validationRules: {
    title: { required: true, minLength: 5, maxLength: 80 },
    subtitle: { required: true, minLength: 10, maxLength: 300 },
    btnDonate: { required: true, minLength: 2, maxLength: 30 },
    btnProjects: { required: true, minLength: 2, maxLength: 30 },
  },
} as const;

// ============================================================
// SEO
// ============================================================

/** Regras de validacao e limites da secao SEO */
export const SEO_CONFIG = {
  validationRules: {
    title: { required: true, minLength: 5, maxLength: 60 },
    description: { required: true, minLength: 10, maxLength: 160 },
  },
  /** Min/max de keywords */
  keywords: { min: 1, max: 20 },
} as const;

// ============================================================
// COMPRESSION SETTINGS
// ============================================================

/**
 * Configuracoes de compressao por categoria de imagem.
 *
 * Consumido pelo useFirebaseStorage.ts no upload de imagens.
 *
 * @property quality - 0 a 1 (1 = sem compressao)
 * @property maxWidth/maxHeight - redimensiona se maior que esses valores
 */
export const COMPRESSION_SETTINGS = {
  /** Imagem da secao Missao */
  mission: { enabled: true, quality: 0.8, maxWidth: 800, maxHeight: 600 },
  /** Logos de apoiadores */
  supporters: { enabled: true, quality: 0.8, maxWidth: 200, maxHeight: 200 },
  /** Imagem OG para SEO */
  seo: { enabled: true, quality: 0.9, maxWidth: 1200, maxHeight: 630 },
  /** Fotos de depoimentos */
  testimonials: { enabled: true, quality: 0.8, maxWidth: 200, maxHeight: 200 },
} as const;
