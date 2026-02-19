/**
 * 🎣 usePageData - Factory base para composables de dados de pagina
 *
 * Gera composables singleton por pagina (home, sobre, contato...).
 * Cada composable carrega do Firestore, transforma via separate/combine,
 * e expoe load/save/reset com audit trail.
 *
 * @dependencias
 * - firebase/firestore (getDoc, updateDoc)
 * - composables/useFirebase ($db)
 * - composables/useAuth (userData para audit trail)
 * - utils/Logger
 */

// ============== DEPENDENCIAS EXTERNAS ==============

import { doc, getDoc, updateDoc } from 'firebase/firestore';

// ============== DEPENDENCIAS INTERNAS ==============

import { useFirebase } from '@composables/useFirebase';
import { useAuth } from '@composables/useAuth';
import { Logger } from '@utils/Logger';

import type { SaveResult } from '~/types/admin';

// ============== INTERFACES ==============

/**
 * Config que cada pagina fornece pra factory.
 *
 * TPageData = formato Firestore (ex: IHomePageData)
 * TFormsData = formato editor (ex: IHomeFormsData)
 */
export interface IPageDataConfig<TPageData, TFormsData extends Record<string, any>> {
  /** Nome da collection no Firestore (ex: 'pages') */
  collection: string;
  /** ID do documento no Firestore (ex: 'home', 'about') */
  document: string;
  /** Nome legivel pra logs (ex: 'home', 'sobre') */
  pageName: string;
  /** Transforma Firestore → editor (ex: separateAllSections) */
  separateAll: (data: TPageData) => TFormsData;
  /** Gera estado inicial vazio (ex: createDefaultHomeForms) */
  createDefaults: () => TFormsData;
  /** Map de secao → funcao que combina editable+readonly de volta pro Firestore */
  combineSections: { [K in keyof TFormsData]: (forms: TFormsData) => Record<string, unknown> };
}

/** Estado reativo compartilhado por todas as paginas */
export interface IPageDataState<TPageData, TFormsData> {
  /** Dados transformados para o editor (editable/readonly) */
  forms: TFormsData;
  /** Snapshot original do Firestore (para reset) */
  originalData: TPageData | null;
  /** Carregando dados do Firestore */
  isLoading: boolean;
  /** Salvando dados no Firestore */
  isSaving: boolean;
  /** Mensagem de erro (null = sem erro) */
  error: string | null;
}

// ============== FACTORY ==============

/**
 * Cria um composable singleton para gerenciar dados de uma pagina.
 *
 * Cada chamada cria um singleton SEPARADO (via closure).
 * Ou seja: useHomePageData tem seu estado, useAboutPageData tem outro.
 */
export function createPageDataComposable<
  TPageData,
  TFormsData extends Record<string, any>,
>(config: IPageDataConfig<TPageData, TFormsData>) {
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
    const saveSection = async (section: SectionName): Promise<SaveResult> => {
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
    const saveAll = async (): Promise<SaveResult> => {
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

        logger.info('Todas as secoes salvas', { page: config.pageName, updatedBy: userData.value?.displayName });

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
