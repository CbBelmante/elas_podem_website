/**
 * Section Fields Config - Elas Podem Admin
 *
 * UNICA FONTE DE VERDADE para quais campos sao editaveis, readonly ou hidden.
 *
 * Para mudar o mode de um campo:
 *   1. Mude o mode aqui (ex: icon: 'editable' -> icon: 'hidden')
 *   2. Ajuste a UI do formulario (remova/adicione o input)
 *   Pronto. Os tipos e funcoes de separate/combine se adaptam automaticamente.
 *
 * Modos:
 *   - 'editable' = aparece como input no formulario do admin
 *   - 'readonly' = aparece no admin mas nao editavel (exibido como texto/badge)
 *   - 'hidden'   = nao aparece no admin, preservado silenciosamente no save
 *
 * @module definitions/sectionFields
 */

export type FieldMode = 'editable' | 'readonly' | 'hidden';

/**
 * Mapa de campos por secao com seus modos.
 *
 * Cada chave e o nome de uma secao (ou sub-entidade como contactMethod).
 * Cada valor e um objeto { campo: FieldMode }.
 *
 * Os tipos em types/admin/editable.ts sao DERIVADOS deste objeto via FieldsByMode.
 * As funcoes em utils/HomeFormUtils.ts usam este objeto em runtime para separar/combinar.
 */
export const SECTION_FIELDS = {
  hero: {
    badge: 'editable',
    title: 'editable',
    subtitle: 'editable',
    btnDonate: 'editable',
    btnHistory: 'editable',
    stats: 'editable',
  },

  mission: {
    badge: 'editable',
    title: 'editable',
    text1: 'editable',
    text2: 'editable',
    btnText: 'editable',
    image: 'editable',
  },

  programs: {
    title: 'editable',
    description: 'editable',
    icon: 'editable',
    color: 'hidden',
    link: 'editable',
  },

  testimonials: {
    quote: 'editable',
    name: 'editable',
    role: 'editable',
    initials: 'editable',
    image: 'editable',
  },

  supporters: {
    name: 'editable',
    icon: 'editable',
    color: 'hidden',
    image: 'editable',
    url: 'editable',
  },

  /** Campos de cada metodo de contato (sub-entidade de Contact) */
  contactMethod: {
    label: 'editable',
    value: 'editable',
    icon: 'editable',
    color: 'hidden',
    url: 'editable',
  },

  cta: {
    title: 'editable',
    subtitle: 'editable',
    btnDonate: 'editable',
    btnProjects: 'editable',
  },

  seo: {
    title: 'editable',
    description: 'editable',
    keywords: 'editable',
    ogImage: 'editable',
    og: 'hidden',
  },
} as const;
