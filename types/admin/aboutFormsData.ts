/**
 * About FormsData - Elas Podem Admin
 *
 * Container do editor (editable split) para a pagina About.
 */

import type {
  IAboutHeroEditable,
  IAboutTimelineEditable,
  IAboutTeamEditable,
  IAboutPillarsEditable,
  IAboutCtaEditable,
} from './aboutEditable';

import type { ISeoEditable, ISeoReadonly } from './editable';

// ============================================================
// FORMS DATA
// ============================================================

export interface IAboutFormsData {
  hero: { editable: IAboutHeroEditable };
  timeline: { editable: IAboutTimelineEditable };
  team: { editable: IAboutTeamEditable };
  pillars: { editable: IAboutPillarsEditable };
  cta: { editable: IAboutCtaEditable };
  seo: { editable: ISeoEditable; readonly: ISeoReadonly };
}
