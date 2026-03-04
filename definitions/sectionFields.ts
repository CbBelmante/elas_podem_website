/**
 * Section Fields Config - Elas Podem Admin
 *
 * ÚNICA FONTE DE VERDADE para quais campos são editáveis, readonly ou hidden.
 *
 * Estrutura:
 *   - Seções flat (hero, mission, cta, seo, values): campos no root
 *   - Seções wrapper (programs, testimonials, supporters, contact):
 *     campos section-level no root + campos item-level em items/methods
 *
 * Para mudar o mode de um campo:
 *   1. Mude o mode aqui (ex: icon: 'editable' -> icon: 'hidden')
 *   2. Ajuste a UI do formulário (remova/adicione o input)
 *   Pronto. Os tipos e funções de separate/combine se adaptam automaticamente.
 *
 * Modos:
 *   - 'editable' = aparece como input no formulário do admin
 *   - 'readonly' = aparece no admin mas não editável (exibido como texto/badge)
 *   - 'hidden'   = não aparece no admin, preservado silenciosamente no save
 *
 * @module definitions/sectionFields
 */

export type FieldMode = 'editable' | 'readonly' | 'hidden';

/**
 * Mapa de campos por seção com seus modos.
 *
 * Cada chave é o nome de uma seção.
 * Seções flat: { campo: FieldMode }
 * Seções wrapper: { campo: FieldMode, items/methods: { campo: FieldMode } }
 *
 * Os tipos em types/admin/editable.ts são DERIVADOS deste objeto via FieldsByMode.
 * As funções em utils/HomeFormUtils.ts usam este objeto em runtime para separar/combinar.
 */
export const SECTION_FIELDS = {
  hero: {
    badge: 'editable',
    title: 'editable',
    description: 'editable',
    btnDonate: 'editable',
    btnDonateColor: 'editable',
    btnDonateVariant: 'editable',
    btnHistory: 'editable',
    btnHistoryColor: 'editable',
    btnHistoryVariant: 'editable',
    heroImage: 'editable',
    heroImageOpacity: 'editable',
    stats: 'editable',
  },

  mission: {
    badge: 'editable',
    title: 'editable',
    paragraphs: 'editable',
    btnText: 'editable',
    btnColor: 'editable',
    btnVariant: 'editable',
    image: 'editable',
    imageOpacity: 'editable',
    imageAlt: 'editable',
  },

  programs: {
    /** Campos section-level (IProgramsSection) */
    badge: 'editable',
    title: 'editable',
    subtitle: 'editable',
    /** Campos item-level (IProgram) */
    items: {
      title: 'editable',
      description: 'editable',
      icon: 'editable',
      color: 'editable',
      link: 'editable',
      tags: 'editable',
      tagColor: 'editable',
    },
  },

  testimonials: {
    /** Campos section-level (ITestimonialsSection) */
    autoplay: 'editable',
    autoplayInterval: 'editable',
    /** Campos item-level (ITestimonial) */
    items: {
      quote: 'editable',
      name: 'editable',
      role: 'editable',
      initials: 'editable',
      image: 'editable',
      imageAlt: 'editable',
    },
  },

  supporters: {
    /** Campos section-level (ISupportersSection) */
    badge: 'editable',
    title: 'editable',
    subtitle: 'editable',
    marqueeSpeed: 'editable',
    /** Campos item-level (ISupporter) */
    items: {
      name: 'editable',
      icon: 'editable',
      image: 'editable',
      imageAlt: 'editable',
      url: 'editable',
      logoSize: 'editable',
    },
  },

  contact: {
    /** Campos section-level (IContactSection) */
    badge: 'editable',
    title: 'editable',
    description: 'editable',
    formSubjects: 'editable',
    /** Campos item-level (IContactMethod) */
    methods: {
      label: 'editable',
      value: 'editable',
      icon: 'editable',
      color: 'editable',
      url: 'editable',
    },
  },

  values: {
    title: 'editable',
    subtitle: 'editable',
    color: 'editable',
  },

  cta: {
    title: 'editable',
    subtitle: 'editable',
    btnDonate: 'editable',
    btnDonateColor: 'editable',
    btnDonateVariant: 'editable',
    btnProjects: 'editable',
    btnProjectsColor: 'editable',
    btnProjectsVariant: 'editable',
  },

  seo: {
    title: 'editable',
    description: 'editable',
    keywords: 'editable',
    ogImage: 'editable',
    og: 'hidden',
  },

  // ============================================================
  // ABOUT PAGE
  // ============================================================

  aboutHero: {
    badge: 'editable',
    title: 'editable',
    description: 'editable',
  },

  aboutTimeline: {
    /** Campos section-level (IAboutTimelineSection) */
    badge: 'editable',
    title: 'editable',
    /** Campos item-level (IAboutTimelineItem) */
    items: {
      year: 'editable',
      title: 'editable',
      description: 'editable',
      icon: 'editable',
      color: 'editable',
    },
  },

  aboutTeam: {
    /** Campos section-level (IAboutTeamSection) */
    badge: 'editable',
    title: 'editable',
    subtitle: 'editable',
    /** Campos item-level (IAboutTeamMember) */
    items: {
      name: 'editable',
      role: 'editable',
      bio: 'editable',
      image: 'editable',
      imageAlt: 'editable',
      initials: 'editable',
    },
  },

  aboutPillars: {
    /** Campos section-level (IAboutPillarsSection) */
    badge: 'editable',
    title: 'editable',
    /** Campos item-level (IAboutPillar) */
    items: {
      icon: 'editable',
      title: 'editable',
      description: 'editable',
      color: 'editable',
    },
  },

  aboutCta: {
    title: 'editable',
    subtitle: 'editable',
    btnDonate: 'editable',
    btnDonateColor: 'editable',
    btnDonateVariant: 'editable',
    btnContact: 'editable',
    btnContactColor: 'editable',
    btnContactVariant: 'editable',
  },
} as const;
