/**
 * 🎣 useHomePageData - Dados da homepage
 *
 * Composable gerado pela factory usePageData, especifico para a homepage.
 * Carrega pages/home do Firestore, transforma com HomeFormUtils,
 * e expoe load/save/reset tipados para as 8 secoes da home.
 *
 * @dependencias
 * - composables/usePageData (factory base)
 * - utils/HomeFormUtils (separate/combine por secao)
 * - types/admin (IHomePageData, IHomeFormsData)
 */

// ============== DEPENDENCIAS INTERNAS ==============

import { createPageDataComposable } from '@composables/usePageData';
import { FIRESTORE_COLLECTIONS, PAGE_DOCUMENTS } from '@definitions/firestoreCollections';
import {
  separateAllSections,
  createDefaultHomeForms,
  combineHeroData,
  combineMissionData,
  combineProgramsData,
  combineTestimonialsData,
  combineSupportersData,
  combineContactData,
  combineCtaData,
  combineSeoData,
} from '~/utils/HomeFormUtils';

import type { IHomePageData, IHomeFormsData } from '~/types/admin';

// ============== COMPOSABLE ==============

export const useHomePageData = createPageDataComposable<IHomePageData, IHomeFormsData>({
  collection: FIRESTORE_COLLECTIONS.PAGES,
  document: PAGE_DOCUMENTS.HOME,
  pageName: 'home',
  separateAll: separateAllSections,
  createDefaults: createDefaultHomeForms,
  combineSections: {
    hero: (forms) => ({ 'content.hero': combineHeroData(forms.hero.editable) }),
    mission: (forms) => ({ 'content.mission': combineMissionData(forms.mission.editable) }),
    programs: (forms) => ({ 'content.programs': combineProgramsData(forms.programs.editable, forms.programs.readonly) }),
    testimonials: (forms) => ({ 'content.testimonials': combineTestimonialsData(forms.testimonials.editable) }),
    supporters: (forms) => ({ 'content.supporters': combineSupportersData(forms.supporters.editable, forms.supporters.readonly) }),
    contact: (forms) => ({ 'content.contact': combineContactData(forms.contact.editable, forms.contact.readonly) }),
    cta: (forms) => ({ 'content.cta': combineCtaData(forms.cta.editable) }),
    seo: (forms) => ({ seo: combineSeoData(forms.seo.editable, forms.seo.readonly) }),
  },
});

// ============== EXPORTS ==============

export type UseHomePageData = ReturnType<typeof useHomePageData>;
