/**
 * About Editable/Readonly Types - Elas Podem Admin
 *
 * Camada 2: Tipos derivados de aboutSections.ts + sectionFields.ts.
 * Para mudar campo de editable para readonly → mude em definitions/sectionFields.ts.
 */

import type {
  IAboutHeroSection,
  IAboutTimelineItem,
  IAboutTimelineSection,
  IAboutTeamMember,
  IAboutTeamSection,
  IAboutPillar,
  IAboutPillarsSection,
  IAboutCtaSection,
} from './aboutSections';
import type { SECTION_FIELDS } from '@definitions/sectionFields';
import type { FieldsByMode } from './editable';

// ============================================================
// Utility — extrai sub-config de items
// ============================================================

type ExtractItemConfig<Config, Key extends string> =
  Config extends Record<Key, infer S extends Record<string, unknown>> ? S : never;

// ============================================================
// ABOUT HERO (flat)
// ============================================================

export type IAboutHeroEditable = FieldsByMode<
  IAboutHeroSection,
  typeof SECTION_FIELDS.aboutHero,
  'editable'
>;

// ============================================================
// ABOUT TIMELINE (wrapper)
// ============================================================

export type IAboutTimelineItemEditable = FieldsByMode<
  IAboutTimelineItem,
  ExtractItemConfig<typeof SECTION_FIELDS.aboutTimeline, 'items'>,
  'editable'
>;

type IAboutTimelineSectionEditable = FieldsByMode<
  IAboutTimelineSection,
  typeof SECTION_FIELDS.aboutTimeline,
  'editable'
>;

export type IAboutTimelineEditable = IAboutTimelineSectionEditable & {
  items: IAboutTimelineItemEditable[];
};

// ============================================================
// ABOUT TEAM (wrapper)
// ============================================================

export type IAboutTeamMemberEditable = FieldsByMode<
  IAboutTeamMember,
  ExtractItemConfig<typeof SECTION_FIELDS.aboutTeam, 'items'>,
  'editable'
>;

type IAboutTeamSectionEditable = FieldsByMode<
  IAboutTeamSection,
  typeof SECTION_FIELDS.aboutTeam,
  'editable'
>;

export type IAboutTeamEditable = IAboutTeamSectionEditable & {
  items: IAboutTeamMemberEditable[];
};

// ============================================================
// ABOUT PILLARS (wrapper)
// ============================================================

export type IAboutPillarEditable = FieldsByMode<
  IAboutPillar,
  ExtractItemConfig<typeof SECTION_FIELDS.aboutPillars, 'items'>,
  'editable'
>;

type IAboutPillarsSectionEditable = FieldsByMode<
  IAboutPillarsSection,
  typeof SECTION_FIELDS.aboutPillars,
  'editable'
>;

export type IAboutPillarsEditable = IAboutPillarsSectionEditable & {
  items: IAboutPillarEditable[];
};

// ============================================================
// ABOUT CTA (flat)
// ============================================================

export type IAboutCtaEditable = FieldsByMode<
  IAboutCtaSection,
  typeof SECTION_FIELDS.aboutCta,
  'editable'
>;
