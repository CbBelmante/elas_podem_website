/**
 * 🎣 usePageData - Factory de composables de dados de pagina
 *
 * Factory generica (createPageDataComposable) + instancia da home (useHomePageData).
 * Gera singletons por pagina com load/save/reset tipados.
 */

// ============== DEPENDENCIAS EXTERNAS ==============

import { doc, getDoc, updateDoc } from 'firebase/firestore';

// ============== DEPENDENCIAS INTERNAS ==============

import { useFirebase } from '@composables/useFirebase';
import { useAuth } from '@composables/useAuth';
import { Logger } from '@utils/Logger';
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
} from '@utils/HomeFormUtils';

import type { ISaveResult, IHomePageData, IHomeFormsData } from '@appTypes/admin';

// ============== INTERFACES ==============

// TPageData = formato Firestore, TFormsData = formato editor
export interface IPageDataConfig<TPageData, TFormsData extends Record<string, any>> {
  collection: string;
  document: string;
  pageName: string;
  separateAll: (data: TPageData) => TFormsData;
  createDefaults: () => TFormsData;
  combineSections: { [_K in keyof TFormsData]: (forms: TFormsData) => Record<string, unknown> };
}

export interface IPageDataState<TPageData, TFormsData> {
  forms: TFormsData;
  originalData: TPageData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

// ============== FACTORY ==============

/**
 * Cria um composable singleton para gerenciar dados de uma pagina.
 *
 * Cada chamada cria um singleton SEPARADO (via closure).
 * Ou seja: useHomePageData tem seu estado, useAboutPageData tem outro.
 */
export function createPageDataComposable<TPageData, TFormsData extends Record<string, any>>(
  config: IPageDataConfig<TPageData, TFormsData>
) {
  type SectionName = keyof TFormsData & string;

  const logger = Logger.child({ composable: `usePageData:${config.pageName}` });

  // ===== SINGLETON (um por pagina) =====

  let _state: IPageDataState<TPageData, TFormsData> | null = null;

  function getState() {
    if (_state) return _state;
    _state = reactive({
      forms: config.createDefaults(),
      originalData: null,
      isLoading: false,
      isSaving: false,
      error: null,
    }) as IPageDataState<TPageData, TFormsData>;
    return _state;
  }

  // ===== COMPOSABLE =====

  return function () {
    const { $db } = useFirebase();
    const { userData } = useAuth();
    const state = getState();

    // ===== COMPUTED =====

    const isLoaded = computed(() => state.originalData !== null);

    // ===== ACTIONS =====

    /**
     * Carrega dados do Firestore e transforma pro formato editor.
     * Se documento nao existir, usa defaults.
     */
    const loadPageData = async (): Promise<void> => {
      state.isLoading = true;
      state.error = null;

      try {
        const docRef = doc($db, config.collection, config.document);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data() as TPageData;
          state.originalData = data;
          state.forms = config.separateAll(data);
          logger.info('Dados carregados', { page: config.pageName });
        } else {
          state.originalData = null;
          state.forms = config.createDefaults();
          logger.warn('Documento nao encontrado, usando defaults', {
            path: `${config.collection}/${config.document}`,
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar dados';
        state.error = message;
        logger.error('Falha ao carregar', error instanceof Error ? error : null);
      } finally {
        state.isLoading = false;
      }
    };

    /**
     * Salva UMA secao no Firestore via dot notation.
     * Exemplo: saveSection('hero') → updateDoc({ 'content.hero': {...} })
     */
    const saveSection = async (section: SectionName): Promise<ISaveResult> => {
      state.isSaving = true;

      try {
        const docRef = doc($db, config.collection, config.document);
        const combineFn = config.combineSections[section];
        const sectionData = combineFn(state.forms);

        await updateDoc(docRef, {
          ...sectionData,
          lastUpdated: new Date().toISOString(),
          updatedById: userData.value?.id ?? 'unknown',
          updatedByName: userData.value?.displayName ?? 'unknown',
        });

        logger.info('Secao salva', { section, updatedBy: userData.value?.displayName });

        await loadPageData();

        return {
          success: true,
          message: `Secao "${section}" salva com sucesso`,
          savedSections: [section],
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar';
        state.error = message;
        logger.error('Falha ao salvar secao', error instanceof Error ? error : null, { section });

        return {
          success: false,
          message,
          savedSections: [],
          error: error instanceof Error ? error : new Error(message),
        };
      } finally {
        state.isSaving = false;
      }
    };

    /**
     * Salva TODAS as secoes em um unico updateDoc (atomico).
     */
    const saveAll = async (): Promise<ISaveResult> => {
      state.isSaving = true;
      const allSections = Object.keys(config.combineSections) as SectionName[];

      try {
        const docRef = doc($db, config.collection, config.document);
        const allData: Record<string, unknown> = {};

        for (const section of allSections) {
          const combineFn = config.combineSections[section];
          Object.assign(allData, combineFn(state.forms));
        }

        await updateDoc(docRef, {
          ...allData,
          lastUpdated: new Date().toISOString(),
          updatedById: userData.value?.id ?? 'unknown',
          updatedByName: userData.value?.displayName ?? 'unknown',
        });

        logger.info('Todas as secoes salvas', {
          page: config.pageName,
          updatedBy: userData.value?.displayName,
        });

        await loadPageData();

        return {
          success: true,
          message: 'Todas as secoes salvas com sucesso',
          savedSections: [...allSections],
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar';
        state.error = message;
        logger.error('Falha ao salvar todas as secoes', error instanceof Error ? error : null);

        return {
          success: false,
          message,
          savedSections: [],
          error: error instanceof Error ? error : new Error(message),
        };
      } finally {
        state.isSaving = false;
      }
    };

    /**
     * Reseta UMA secao pro estado original (ultimo load).
     * Se nunca carregou, volta pros defaults.
     */
    const resetSection = (section: SectionName): void => {
      if (!state.originalData) {
        const defaults = config.createDefaults();
        (state.forms as any)[section] = (defaults as any)[section];
        logger.debug('Secao resetada para defaults', { section });
        return;
      }

      const freshForms = config.separateAll(state.originalData);
      (state.forms as any)[section] = (freshForms as any)[section];
      logger.debug('Secao resetada para original', { section });
    };

    /**
     * Reseta TODAS as secoes pro estado original.
     */
    const resetAll = (): void => {
      if (!state.originalData) {
        state.forms = config.createDefaults();
        logger.debug('Formulario resetado para defaults');
        return;
      }

      state.forms = config.separateAll(state.originalData);
      logger.debug('Formulario resetado para original');
    };

    // ===== RETURN =====

    return {
      ...toRefs(state),
      isLoaded,
      loadPageData,
      saveSection,
      saveAll,
      resetSection,
      resetAll,
    };
  };
}

// ============== HOME (instancia gerada pela factory) ==============

export const useHomePageData = createPageDataComposable<IHomePageData, IHomeFormsData>({
  collection: FIRESTORE_COLLECTIONS.PAGES,
  document: PAGE_DOCUMENTS.HOME,
  pageName: 'home',
  separateAll: separateAllSections,
  createDefaults: createDefaultHomeForms,
  combineSections: {
    hero: (forms) => ({ 'content.hero': combineHeroData(forms.hero.editable) }),
    mission: (forms) => ({ 'content.mission': combineMissionData(forms.mission.editable) }),
    programs: (forms) => ({
      'content.programs': combineProgramsData(forms.programs.editable, forms.programs.readonly),
    }),
    testimonials: (forms) => ({
      'content.testimonials': combineTestimonialsData(forms.testimonials.editable),
    }),
    supporters: (forms) => ({
      'content.supporters': combineSupportersData(
        forms.supporters.editable,
        forms.supporters.readonly
      ),
    }),
    contact: (forms) => ({
      'content.contact': combineContactData(forms.contact.editable, forms.contact.readonly),
    }),
    cta: (forms) => ({ 'content.cta': combineCtaData(forms.cta.editable) }),
    seo: (forms) => ({ seo: combineSeoData(forms.seo.editable, forms.seo.readonly) }),
  },
});

export type UseHomePageData = ReturnType<typeof useHomePageData>;
