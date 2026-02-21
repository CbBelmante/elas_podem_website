/**
 * FormsData & Editor Types - Elas Podem Admin
 *
 * Container do editor (editable/readonly) + types do orquestrador (save, validacao, audit).
 */

import type { Ref } from 'vue';

import type {
  IHeroEditable,
  IMissionEditable,
  IProgramsEditable,
  IProgramsReadonly,
  ITestimonialEditable,
  ISupportersEditable,
  ISupportersReadonly,
  IContactEditable,
  IContactReadonly,
  IValueEditable,
  ICtaEditable,
  ISeoEditable,
  ISeoReadonly,
} from './editable';

// ============================================================
// FORMS DATA
// ============================================================

export interface IHomeFormsData {
  hero: { editable: IHeroEditable };
  mission: { editable: IMissionEditable };
  programs: { editable: IProgramsEditable; readonly: IProgramsReadonly };
  testimonials: { editable: ITestimonialEditable[] };
  supporters: { editable: ISupportersEditable; readonly: ISupportersReadonly };
  contact: { editable: IContactEditable; readonly: IContactReadonly };
  values: { editable: IValueEditable[] };
  cta: { editable: ICtaEditable };
  seo: { editable: ISeoEditable; readonly: ISeoReadonly };
}

// ============================================================
// PAGE EDITOR
// ============================================================

export interface IPageSectionConfig {
  name: string;
  form: Ref<any>;
  originalData: () => any;
  validator: (data: any) => IValidationResult;
  saveFunction: (data: any) => Promise<void>;
  getImageUrls: () => { old?: string; new?: string }; // compara old vs new pra deletar orfas
  updateLocalData: (data: any) => void;
}

export interface IPageEditorConfig {
  pageName: string;
  sections: IPageSectionConfig[];
  pageData: Ref<any>;
  tempUploadedImages: Ref<string[]>; // cleanup no cancel
}

// ============================================================
// SAVE / VALIDATION
// ============================================================

export interface ISaveResult {
  success: boolean;
  message: string;
  savedSections: string[];
  error?: Error; // presente apenas se success === false
}

export interface IValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================================
// ADMIN LOG
// ============================================================

export interface IAdminLog {
  action: string;
  details: Record<string, any>;
  timestamp: string; // ISO
  user: string;
}
