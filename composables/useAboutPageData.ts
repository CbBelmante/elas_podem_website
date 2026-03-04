/**
 * 🎣 useAboutPageData - Dados da pagina About para o admin editor
 *
 * Instancia de createPageDataComposable para a pagina About.
 * Singleton: load/save/reset tipados por secao.
 */

// ============== DEPENDENCIAS INTERNAS ==============

import { createPageDataComposable } from '@composables/usePageData';
import { FIRESTORE_COLLECTIONS, PAGE_DOCUMENTS } from '@definitions/firestoreCollections';
import {
  separateAllAboutSections,
  createDefaultAboutForms,
  combineAboutHeroData,
  combineAboutTimelineData,
  combineAboutTeamData,
  combineAboutPillarsData,
  combineAboutCtaData,
  combineAboutSeoData,
} from '@utils/AboutFormUtils';

import type { IAboutPageData, IAboutFormsData } from '@appTypes/admin';

// ============== INSTANCIA (gerada pela factory) ==============

export const useAboutPageData = createPageDataComposable<IAboutPageData, IAboutFormsData>({
  collection: FIRESTORE_COLLECTIONS.PAGES,
  document: PAGE_DOCUMENTS.ABOUT,
  pageName: 'about',
  separateAll: separateAllAboutSections,
  createDefaults: createDefaultAboutForms,
  combineSections: {
    hero: (forms) => ({ 'content.hero': combineAboutHeroData(forms.hero.editable) }),
    timeline: (forms) => ({
      'content.timeline': combineAboutTimelineData(forms.timeline.editable),
    }),
    team: (forms) => ({ 'content.team': combineAboutTeamData(forms.team.editable) }),
    pillars: (forms) => ({ 'content.pillars': combineAboutPillarsData(forms.pillars.editable) }),
    cta: (forms) => ({ 'content.cta': combineAboutCtaData(forms.cta.editable) }),
    seo: (forms) => ({ seo: combineAboutSeoData(forms.seo.editable, forms.seo.readonly) }),
  },
});

// ============== EXPORTS ==============

export type UseAboutPageData = ReturnType<typeof useAboutPageData>;
