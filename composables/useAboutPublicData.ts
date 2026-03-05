/**
 * 🎣 useAboutPublicData - Dados da pagina About para o site publico
 *
 * Read-only. Usa useAsyncData (Nuxt 4) + useCache (RAM+localStorage).
 * Fallback por secao: se Firestore tem hero mas nao tem team,
 * hero vem real e team vem placeholder.
 */

// ============== DEPENDENCIAS EXTERNAS ==============

import { doc, getDoc } from 'firebase/firestore';

// ============== DEPENDENCIAS INTERNAS ==============

import { useFirebase } from '@composables/useFirebase';
import { useCache } from '@composables/useCache';
import { FIRESTORE_COLLECTIONS, PAGE_DOCUMENTS } from '@definitions/firestoreCollections';
import { CACHE_KEYS } from '@definitions/cacheKeys';
import { ABOUT_FALLBACK } from '@definitions/aboutFallbacks';
import {
  ABOUT_HERO_DEFAULTS,
  ABOUT_TIMELINE_SECTION_DEFAULTS,
  ABOUT_TEAM_SECTION_DEFAULTS,
  ABOUT_PILLARS_SECTION_DEFAULTS,
  ABOUT_CTA_DEFAULTS,
} from '@definitions/sectionDefaults';
import { Logger } from '@cb/components';

import type { IAboutPageData } from '@appTypes/admin';

// ============== CONSTANTS ==============

const logger = Logger.child({ composable: 'useAboutPublicData' });

// ============== HELPERS ==============

/**
 * Merge por secao: Firestore sobrescreve fallback apenas onde existir dados.
 * Secoes ausentes no Firestore caem pro placeholder automaticamente.
 */
function mergeWithFallback(firestore: Record<string, unknown>): IAboutPageData {
  const fb = ABOUT_FALLBACK;
  const content = (firestore.content ?? {}) as Record<string, unknown>;

  return {
    content: {
      hero: {
        ...ABOUT_HERO_DEFAULTS,
        ...((content.hero as IAboutPageData['content']['hero']) ?? fb.content.hero),
      },
      timeline: {
        ...ABOUT_TIMELINE_SECTION_DEFAULTS,
        items: [],
        ...((content.timeline as IAboutPageData['content']['timeline']) ?? fb.content.timeline),
      },
      team: {
        ...ABOUT_TEAM_SECTION_DEFAULTS,
        items: [],
        ...((content.team as IAboutPageData['content']['team']) ?? fb.content.team),
      },
      pillars: {
        ...ABOUT_PILLARS_SECTION_DEFAULTS,
        items: [],
        ...((content.pillars as IAboutPageData['content']['pillars']) ?? fb.content.pillars),
      },
      cta: {
        ...ABOUT_CTA_DEFAULTS,
        ...((content.cta as IAboutPageData['content']['cta']) ?? fb.content.cta),
      },
    },
    seo: (firestore.seo as IAboutPageData['seo']) ?? fb.seo,
    lastUpdated: (firestore.lastUpdated as string) ?? fb.lastUpdated,
    updatedById: (firestore.updatedById as string) ?? fb.updatedById,
    updatedByName: (firestore.updatedByName as string) ?? fb.updatedByName,
  };
}

// ============== COMPOSABLE ==============

export function useAboutPublicData() {
  const { $db } = useFirebase();
  const cache = useCache();

  /**
   * Busca dados do about: cache (RAM → localStorage) → Firestore → fallback por secao.
   * useAsyncData garante dedup e status tracking do Nuxt 4.
   */
  const { data, status, error, refresh } = useAsyncData<IAboutPageData>(
    'about-page',
    () =>
      cache.getOrFetch(CACHE_KEYS.ABOUT_PAGE, async () => {
        const docRef = doc($db, FIRESTORE_COLLECTIONS.PAGES, PAGE_DOCUMENTS.ABOUT);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          logger.warn('Documento about nao encontrado, usando fallback completo');
          return ABOUT_FALLBACK;
        }

        logger.info('Dados do about carregados do Firestore (merge por secao)');
        return mergeWithFallback(snap.data());
      }),
    {
      server: false,
      lazy: true,
      default: () => ABOUT_FALLBACK,
    }
  );

  // ===== COMPUTED SHORTCUTS =====

  const hero = computed(() => data.value.content.hero);
  const timeline = computed(() => data.value.content.timeline);
  const team = computed(() => data.value.content.team);
  const pillars = computed(() => data.value.content.pillars);
  const cta = computed(() => data.value.content.cta);
  const seo = computed(() => data.value.seo);

  // ===== RETURN =====

  return {
    data,
    status,
    error,
    refresh,
    hero,
    timeline,
    team,
    pillars,
    cta,
    seo,
  };
}

// ============== EXPORTS ==============

export type UseAboutPublicData = ReturnType<typeof useAboutPublicData>;
