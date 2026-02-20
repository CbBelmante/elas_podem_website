/**
 * 🎣 useHomePublicData - Dados da home para o site publico
 *
 * Read-only. Usa useAsyncData (Nuxt 4) + useCache (RAM+localStorage).
 * Fallback lorem ipsum quando Firebase nao responde.
 */

// ============== DEPENDENCIAS EXTERNAS ==============

import { doc, getDoc } from 'firebase/firestore';

// ============== DEPENDENCIAS INTERNAS ==============

import { useFirebase } from '@composables/useFirebase';
import { useCache } from '@composables/useCache';
import { FIRESTORE_COLLECTIONS, PAGE_DOCUMENTS } from '@definitions/firestoreCollections';
import { CACHE_KEYS } from '@definitions/cacheKeys';
import { HOME_FALLBACK } from '@definitions/homeFallbacks';
import { Logger } from '@utils/Logger';

import type { IHomePageData } from '@appTypes/admin';

// ============== CONSTANTS ==============

const logger = Logger.child({ composable: 'useHomePublicData' });

// ============== COMPOSABLE ==============

export function useHomePublicData() {
  const { $db } = useFirebase();
  const cache = useCache();

  /**
   * Busca dados da home: cache (RAM → localStorage) → Firestore → fallback.
   * useAsyncData garante dedup e status tracking do Nuxt 4.
   */
  const { data, status, error, refresh } = useAsyncData<IHomePageData>(
    'home-page',
    () =>
      cache.getOrFetch(CACHE_KEYS.HOME_PAGE, async () => {
        const docRef = doc($db, FIRESTORE_COLLECTIONS.PAGES, PAGE_DOCUMENTS.HOME);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          logger.warn('Documento home nao encontrado, usando fallback');
          return HOME_FALLBACK;
        }

        logger.info('Dados da home carregados do Firestore');
        return snap.data() as IHomePageData;
      }),
    {
      server: false,
      lazy: true,
      default: () => HOME_FALLBACK,
    }
  );

  // ===== COMPUTED SHORTCUTS =====

  const hero = computed(() => data.value.content.hero);
  const mission = computed(() => data.value.content.mission);
  const programs = computed(() => data.value.content.programs);
  const testimonials = computed(() => data.value.content.testimonials);
  const supporters = computed(() => data.value.content.supporters);
  const contact = computed(() => data.value.content.contact);
  const cta = computed(() => data.value.content.cta);
  const seo = computed(() => data.value.seo);

  // ===== RETURN =====

  return {
    data,
    status,
    error,
    refresh,
    hero,
    mission,
    programs,
    testimonials,
    supporters,
    contact,
    cta,
    seo,
  };
}

// ============== EXPORTS ==============

export type UseHomePublicData = ReturnType<typeof useHomePublicData>;
