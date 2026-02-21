/**
 * 🎣 useHomePublicData - Dados da home para o site publico
 *
 * Read-only. Usa useAsyncData (Nuxt 4) + useCache (RAM+localStorage).
 * Fallback por secao: se Firestore tem hero mas nao tem mission,
 * hero vem real e mission vem lorem ipsum.
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

// ============== HELPERS ==============

/**
 * Merge por secao: Firestore sobrescreve fallback apenas onde existir dados.
 * Secoes ausentes no Firestore caem pro lorem ipsum automaticamente.
 */
function mergeWithFallback(firestore: Record<string, unknown>): IHomePageData {
  const fb = HOME_FALLBACK;
  const content = (firestore.content ?? {}) as Record<string, unknown>;

  return {
    content: {
      hero: (content.hero as IHomePageData['content']['hero']) ?? fb.content.hero,
      mission: (content.mission as IHomePageData['content']['mission']) ?? fb.content.mission,
      programs: (content.programs as IHomePageData['content']['programs']) ?? fb.content.programs,
      testimonials:
        (content.testimonials as IHomePageData['content']['testimonials']) ??
        fb.content.testimonials,
      supporters:
        (content.supporters as IHomePageData['content']['supporters']) ?? fb.content.supporters,
      contact: (content.contact as IHomePageData['content']['contact']) ?? fb.content.contact,
      values: (content.values as IHomePageData['content']['values']) ?? fb.content.values,
      cta: (content.cta as IHomePageData['content']['cta']) ?? fb.content.cta,
    },
    seo: (firestore.seo as IHomePageData['seo']) ?? fb.seo,
    lastUpdated: (firestore.lastUpdated as string) ?? fb.lastUpdated,
    updatedById: (firestore.updatedById as string) ?? fb.updatedById,
    updatedByName: (firestore.updatedByName as string) ?? fb.updatedByName,
  };
}

// ============== COMPOSABLE ==============

export function useHomePublicData() {
  const { $db } = useFirebase();
  const cache = useCache();

  /**
   * Busca dados da home: cache (RAM → localStorage) → Firestore → fallback por secao.
   * useAsyncData garante dedup e status tracking do Nuxt 4.
   */
  const { data, status, error, refresh } = useAsyncData<IHomePageData>(
    'home-page',
    () =>
      cache.getOrFetch(CACHE_KEYS.HOME_PAGE, async () => {
        const docRef = doc($db, FIRESTORE_COLLECTIONS.PAGES, PAGE_DOCUMENTS.HOME);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          logger.warn('Documento home nao encontrado, usando fallback completo');
          return HOME_FALLBACK;
        }

        logger.info('Dados da home carregados do Firestore (merge por secao)');
        return mergeWithFallback(snap.data());
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
  const values = computed(() => data.value.content.values);
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
    values,
    cta,
    seo,
  };
}

// ============== EXPORTS ==============

export type UseHomePublicData = ReturnType<typeof useHomePublicData>;
