/**
 * FormsData Types - Elas Podem Admin
 *
 * Camada 3: Container unico que agrupa editable + readonly de todas as secoes.
 * Este e o tipo do `ref()` reativo no editor — o estado central do formulario.
 *
 * Fluxo:
 *   Firestore (IHomePageData) → separateAllSections() → IHomeFormsData (ref reativo)
 *   IHomeFormsData → combine*Data() → Firestore (save)
 *
 * @module types/admin/formsData
 *
 * @dependencias
 * - types/admin/editable (todas as interfaces Editable/Readonly)
 */

import type {
  IHeroEditable,
  IMissionEditable,
  IProgramEditable,
  IProgramReadonly,
  ITestimonialEditable,
  ISupporterEditable,
  ISupporterReadonly,
  IContactEditable,
  IContactReadonly,
  ICtaEditable,
  ISeoEditable,
  ISeoReadonly,
} from './editable';

/**
 * Container completo do formulario de edicao da homepage.
 *
 * Cada secao tem `editable` (campos do formulario) e opcionalmente
 * `readonly` (campos preservados mas ocultos do admin).
 *
 * @exemplo
 * ```typescript
 * const forms = ref<IHomeFormsData>(createDefaultHomeForms())
 *
 * // Acessar dados editaveis do hero:
 * forms.value.hero.editable.title = 'Novo Titulo'
 *
 * // Readonly e preservado automaticamente no save:
 * forms.value.programs.readonly[0].color // 'magenta' (nao aparece no form)
 * ```
 */
export interface IHomeFormsData {
  /** Hero — apenas editable (tudo editavel) */
  hero: {
    editable: IHeroEditable;
  };
  /** Missao — apenas editable (tudo editavel) */
  mission: {
    editable: IMissionEditable;
  };
  /** Programas — editable + readonly (color e readonly) */
  programs: {
    editable: IProgramEditable[];
    readonly: IProgramReadonly[];
  };
  /** Depoimentos — apenas editable (tudo editavel) */
  testimonials: {
    editable: ITestimonialEditable[];
  };
  /** Apoiadores — editable + readonly (color e readonly) */
  supporters: {
    editable: ISupporterEditable[];
    readonly: ISupporterReadonly[];
  };
  /** Contato — editable + readonly (cores dos metodos) */
  contact: {
    editable: IContactEditable;
    readonly: IContactReadonly;
  };
  /** CTA — apenas editable (tudo editavel) */
  cta: {
    editable: ICtaEditable;
  };
  /** SEO — editable + readonly (config OG) */
  seo: {
    editable: ISeoEditable;
    readonly: ISeoReadonly;
  };
}
