/**
 * 🗄️ useCache - Cache em 2 niveis (RAM + localStorage)
 *
 * Cache automatico com fallback inteligente.
 * Sem Pinia, sem scope multi-empresa — simples e direto.
 *
 * Fluxo: RAM (~0ms) → localStorage (~2ms) → fonte (~150ms)
 *
 * @dependencias
 * - utils/LocalStorage (persistencia Safari-safe)
 * - utils/Logger (logs de debug)
 * - config/constants (prefix do localStorage)
 */

// ============== DEPENDENCIAS ==============

import { LocalStorage } from '@utils/LocalStorage';
import { Logger } from '@utils/Logger';
import { APP_CONSTANTS } from '@config/constants';

// ============== CONSTANTS ==============

const logger = Logger.child({ composable: 'useCache' });

/** Prefix para chaves no localStorage */
const CACHE_PREFIX = `${APP_CONSTANTS.app.localStoragePrefix}cache:`;

// ============== RAM CACHE (SINGLETON) ==============

/** Cache em memoria — persiste entre navegacoes, limpa no reload */
const _ram: Record<string, unknown> = {};

// ============== HELPERS ==============

/**
 * Gera chave do localStorage a partir da chave logica.
 *
 * @example
 * makeStorageKey('userData') → 'ep_cache:userData'
 */
function makeStorageKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

// ============== COMPOSABLE ==============

export function useCache() {

  /**
   * Busca dado do cache (RAM → localStorage).
   *
   * @returns Dado encontrado ou null
   */
  function get<T>(key: string): T | null {
    // 1. RAM (instantaneo)
    if (key in _ram) {
      logger.debug('Cache HIT (RAM)', { key });
      return _ram[key] as T;
    }

    // 2. localStorage (rapido)
    const stored = LocalStorage.getObj<T>(makeStorageKey(key));
    if (stored !== null) {
      _ram[key] = stored;
      logger.debug('Cache HIT (disco)', { key });
      return stored;
    }

    return null;
  }

  /**
   * Salva dado no cache (RAM + localStorage).
   */
  function set<T>(key: string, data: T): void {
    _ram[key] = data;
    LocalStorage.setObj(makeStorageKey(key), data);
    logger.debug('Cache SET', { key });
  }

  /**
   * Cache-first: busca cache OU executa fetchFn.
   *
   * Fluxo:
   * 1. RAM? → retorna (~0ms)
   * 2. localStorage? → hidrata RAM, retorna (~2ms)
   * 3. Executa fetchFn → salva ambos, retorna
   */
  async function getOrFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = get<T>(key);
    if (cached !== null) return cached;

    logger.debug('Cache MISS', { key });
    const fresh = await fetchFn();
    set(key, fresh);
    return fresh;
  }

  /**
   * Remove dado do cache (RAM + localStorage).
   */
  function remove(key: string): void {
    delete _ram[key];
    LocalStorage.removeItem(makeStorageKey(key));
    logger.debug('Cache REMOVE', { key });
  }

  /**
   * Limpa todo o cache (RAM + localStorage).
   */
  function clearAll(): void {
    Object.keys(_ram).forEach(key => delete _ram[key]);

    LocalStorage.keys().forEach(storageKey => {
      if (storageKey.startsWith(CACHE_PREFIX)) {
        LocalStorage.removeItem(storageKey);
      }
    });

    logger.debug('Cache CLEAR ALL');
  }

  /**
   * Verifica se dado existe no cache (RAM ou localStorage).
   */
  function has(key: string): boolean {
    return key in _ram || LocalStorage.hasItem(makeStorageKey(key));
  }

  // ===== RETURN =====

  return { get, set, getOrFetch, remove, clearAll, has };
}

// ============== EXPORTS ==============

export type UseCache = ReturnType<typeof useCache>;
