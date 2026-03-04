/**
 * 🎯 AboutFormUtils - Conversao Firestore ↔ Editor por secao da About Page
 *
 * Padrao por secao: separate*Data (abre), combine*Data (salva),
 * createDefault* (vazio), createNew* (CRUD [+Novo]).
 * Delega split/combine generico para sectionFieldsUtils.
 */

import type {
  // Camada 1: Section Data
  IAboutTimelineItem,
  IAboutTimelineSection,
  IAboutTeamMember,
  IAboutTeamSection,
  IAboutPillar,
  IAboutPillarsSection,
  // Camada 2: Editable
  IAboutHeroEditable,
  IAboutTimelineEditable,
  IAboutTeamEditable,
  IAboutPillarsEditable,
  IAboutCtaEditable,
  ISeoEditable,
  ISeoReadonly,
  // Camada 3: FormsData
  IAboutFormsData,
  IAboutPageData,
} from '@appTypes/admin';

import { SECTION_FIELDS } from '@definitions/sectionFields';
import {
  ABOUT_HERO_DEFAULTS,
  ABOUT_TIMELINE_SECTION_DEFAULTS,
  ABOUT_TIMELINE_ITEM_DEFAULTS,
  ABOUT_TEAM_SECTION_DEFAULTS,
  ABOUT_TEAM_MEMBER_DEFAULTS,
  ABOUT_PILLARS_SECTION_DEFAULTS,
  ABOUT_PILLAR_ITEM_DEFAULTS,
  ABOUT_CTA_DEFAULTS,
  SEO_DEFAULTS,
  SEO_OG_DEFAULTS,
} from '@definitions/sectionDefaults';

import {
  separateByFields,
  combineFromFields,
  separateWrapperByFields,
  combineWrapperFromFields,
} from '@utils/sectionFieldsUtils';

// ============================================================
// ABOUT HERO (flat)
// ============================================================

export function separateAboutHeroData(data: IAboutPageData['content']['hero']) {
  return separateByFields(data, SECTION_FIELDS.aboutHero) as {
    editable: IAboutHeroEditable;
    readonly: Record<string, never>;
  };
}

export function combineAboutHeroData(editable: IAboutHeroEditable) {
  return combineFromFields<IAboutPageData['content']['hero']>(editable, {});
}

export function createDefaultAboutHeroEditable(): IAboutHeroEditable {
  return { ...ABOUT_HERO_DEFAULTS };
}

// ============================================================
// ABOUT TIMELINE (wrapper)
// ============================================================

export function separateAboutTimelineData(data: IAboutTimelineSection): {
  editable: IAboutTimelineEditable;
} {
  return separateWrapperByFields({
    data: data as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.aboutTimeline,
    sectionDefaults: ABOUT_TIMELINE_SECTION_DEFAULTS,
  }) as { editable: IAboutTimelineEditable };
}

export function combineAboutTimelineData(editable: IAboutTimelineEditable): IAboutTimelineSection {
  return combineWrapperFromFields<IAboutTimelineSection>({
    editable: editable as unknown as Record<string, unknown>,
    readonly: {},
    fields: SECTION_FIELDS.aboutTimeline,
  });
}

export function createDefaultAboutTimelineEditable(): IAboutTimelineEditable {
  return { ...ABOUT_TIMELINE_SECTION_DEFAULTS, items: [{ ...ABOUT_TIMELINE_ITEM_DEFAULTS }] };
}

export function createNewAboutTimelineItem(): IAboutTimelineItem {
  return { ...ABOUT_TIMELINE_ITEM_DEFAULTS };
}

// ============================================================
// ABOUT TEAM (wrapper)
// ============================================================

export function separateAboutTeamData(data: IAboutTeamSection): {
  editable: IAboutTeamEditable;
} {
  return separateWrapperByFields({
    data: data as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.aboutTeam,
    sectionDefaults: ABOUT_TEAM_SECTION_DEFAULTS,
  }) as { editable: IAboutTeamEditable };
}

export function combineAboutTeamData(editable: IAboutTeamEditable): IAboutTeamSection {
  return combineWrapperFromFields<IAboutTeamSection>({
    editable: editable as unknown as Record<string, unknown>,
    readonly: {},
    fields: SECTION_FIELDS.aboutTeam,
  });
}

export function createDefaultAboutTeamEditable(): IAboutTeamEditable {
  return { ...ABOUT_TEAM_SECTION_DEFAULTS, items: [{ ...ABOUT_TEAM_MEMBER_DEFAULTS }] };
}

export function createNewAboutTeamMember(): IAboutTeamMember {
  return { ...ABOUT_TEAM_MEMBER_DEFAULTS };
}

// ============================================================
// ABOUT PILLARS (wrapper)
// ============================================================

export function separateAboutPillarsData(data: IAboutPillarsSection): {
  editable: IAboutPillarsEditable;
} {
  return separateWrapperByFields({
    data: data as unknown as Record<string, unknown>,
    fields: SECTION_FIELDS.aboutPillars,
    sectionDefaults: ABOUT_PILLARS_SECTION_DEFAULTS,
  }) as { editable: IAboutPillarsEditable };
}

export function combineAboutPillarsData(editable: IAboutPillarsEditable): IAboutPillarsSection {
  return combineWrapperFromFields<IAboutPillarsSection>({
    editable: editable as unknown as Record<string, unknown>,
    readonly: {},
    fields: SECTION_FIELDS.aboutPillars,
  });
}

export function createDefaultAboutPillarsEditable(): IAboutPillarsEditable {
  return { ...ABOUT_PILLARS_SECTION_DEFAULTS, items: [{ ...ABOUT_PILLAR_ITEM_DEFAULTS }] };
}

export function createNewAboutPillar(): IAboutPillar {
  return { ...ABOUT_PILLAR_ITEM_DEFAULTS };
}

// ============================================================
// ABOUT CTA (flat)
// ============================================================

export function separateAboutCtaData(data: IAboutPageData['content']['cta']) {
  return separateByFields(data, SECTION_FIELDS.aboutCta) as {
    editable: IAboutCtaEditable;
    readonly: Record<string, never>;
  };
}

export function combineAboutCtaData(editable: IAboutCtaEditable) {
  return combineFromFields<IAboutPageData['content']['cta']>(editable, {});
}

export function createDefaultAboutCtaEditable(): IAboutCtaEditable {
  return { ...ABOUT_CTA_DEFAULTS };
}

// ============================================================
// SEO (reutiliza tipos da home)
// ============================================================

export function separateAboutSeoData(data: IAboutPageData['seo']) {
  return separateByFields(data, SECTION_FIELDS.seo) as {
    editable: ISeoEditable;
    readonly: ISeoReadonly;
  };
}

export function combineAboutSeoData(editable: ISeoEditable, readonly: ISeoReadonly) {
  return combineFromFields<IAboutPageData['seo']>(editable, readonly);
}

export function createDefaultAboutSeoEditable(): ISeoEditable {
  return { ...SEO_DEFAULTS, keywords: [...SEO_DEFAULTS.keywords] };
}

// ============================================================
// AGREGADORAS — Pagina completa
// ============================================================

/**
 * Converte o documento Firestore completo (IAboutPageData) em
 * IAboutFormsData (formato do editor com editable split).
 *
 * Fallback por secao: se o Firestore so tem hero salvo, as outras
 * secoes usam defaults (nao crasha).
 */
export function separateAllAboutSections(pageData: IAboutPageData): IAboutFormsData {
  const c = (pageData.content ?? {}) as Partial<IAboutPageData['content']>;
  const defaults = createDefaultAboutForms();

  return {
    hero: c.hero ? separateAboutHeroData(c.hero) : defaults.hero,
    timeline: c.timeline ? separateAboutTimelineData(c.timeline) : defaults.timeline,
    team: c.team ? separateAboutTeamData(c.team) : defaults.team,
    pillars: c.pillars ? separateAboutPillarsData(c.pillars) : defaults.pillars,
    cta: c.cta ? separateAboutCtaData(c.cta) : defaults.cta,
    seo: pageData.seo ? separateAboutSeoData(pageData.seo) : defaults.seo,
  };
}

/**
 * Gera IAboutFormsData completo com valores default.
 *
 * Usado como fallback quando o Firebase esta vazio/offline,
 * e como estado inicial do formulario antes de carregar dados.
 */
export function createDefaultAboutForms(): IAboutFormsData {
  return {
    hero: { editable: createDefaultAboutHeroEditable() },
    timeline: { editable: createDefaultAboutTimelineEditable() },
    team: { editable: createDefaultAboutTeamEditable() },
    pillars: { editable: createDefaultAboutPillarsEditable() },
    cta: { editable: createDefaultAboutCtaEditable() },
    seo: {
      editable: createDefaultAboutSeoEditable(),
      readonly: { og: { ...SEO_OG_DEFAULTS } },
    },
  };
}
