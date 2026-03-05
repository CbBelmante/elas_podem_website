/**
 * Home FormsData - Elas Podem Admin
 *
 * Container do editor (editable/readonly) da home page.
 */

import type {
  IHeroEditable,
  IMissionEditable,
  IProgramsEditable,
  IProgramsReadonly,
  ITestimonialsEditable,
  ISupportersEditable,
  ISupportersReadonly,
  IContactEditable,
  IContactReadonly,
  IValueEditable,
  ICtaEditable,
  ISeoEditable,
  ISeoReadonly,
} from './homeEditable';

// ============================================================
// FORMS DATA
// ============================================================

export interface IHomeFormsData {
  hero: { editable: IHeroEditable };
  mission: { editable: IMissionEditable };
  programs: { editable: IProgramsEditable; readonly: IProgramsReadonly };
  testimonials: { editable: ITestimonialsEditable };
  supporters: { editable: ISupportersEditable; readonly: ISupportersReadonly };
  contact: { editable: IContactEditable; readonly: IContactReadonly };
  values: { editable: IValueEditable[] };
  cta: { editable: ICtaEditable };
  seo: { editable: ISeoEditable; readonly: ISeoReadonly };
}
