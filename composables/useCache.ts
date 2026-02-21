/**
 * useCache - Cache em 2 niveis (RAM + localStorage)
 *
 * Cache automatico com fallback inteligente.
 * Sem Pinia, sem scope multi-empresa — simples e direto.
 *
 * Controle de cache em 2 niveis (igual hasCache dos repositories do mneis_frontend):
 * - Global: features.enableCache (desabilita TUDO)
 * - Por key: CACHE_KEYS.*.hasCache (desabilita individualmente)
 *
 * Fluxo: RAM (~0ms) → localStorage (~2ms) → fonte (~150ms)
 *
 * @dependencias
 * - utils/LocalStorage (persistencia Safari-safe)
 * - utils/Logger (logs de debug)
 * - config/constants (prefix do localStorage + enableCache global)
 * - definitions/cacheKeys (hasCache por key)
 */

// ============== DEPENDENCIAS ==============

import { LocalStorage } from '@utils/LocalStorage';
import { Logger } from '@utils/Logger';
import { APP_CONSTANTS } from '@config/constants';
import type { CacheKeyEntry } from '@definitions/cacheKeys';

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

/**
 * Verifica se cache esta habilitado para uma key.
 * Checa global (enableCache) E per-key (hasCache).
 */
function isCacheEnabled(entry: CacheKeyEntry): boolean {
  // Global desabilitado → tudo off
  if (!APP_CONSTANTS.features.enableCache) return false;
  // Per-key override (igual hasCache do repository)
  return entry.hasCache;
}

// ============== COMPOSABLE ==============

export function useCache() {
  /**
   * Busca dado do cache (RAM → localStorage).
   * Retorna null quando cache esta desabilitado (global ou per-key).
   *
   * @returns Dado encontrado ou null
   */
  function get<T>(entry: CacheKeyEntry): T | null {
    if (!isCacheEnabled(entry)) return null;

    const key = entry.key;

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
   * Nao salva quando cache esta desabilitado (global ou per-key).
   */
  function set<T>(entry: CacheKeyEntry, data: T): void {
    if (!isCacheEnabled(entry)) return;

    const key = entry.key;
    _ram[key] = data;
    LocalStorage.setObj(makeStorageKey(key), data);
    logger.debug('Cache SET', { key });
  }

  /**
   * Cache-first: busca cache OU executa fetchFn.
   *
   * Fluxo (igual getOrFetch do ApiCrudRepository do mneis):
   * 1. Se cache desabilitado → executa fetchFn direto
   * 2. RAM? → retorna (~0ms)
   * 3. localStorage? → hidrata RAM, retorna (~2ms)
   * 4. Executa fetchFn → salva ambos, retorna
   */
  async function getOrFetch<T>(entry: CacheKeyEntry, fetchFn: () => Promise<T>): Promise<T> {
    const cached = get<T>(entry);
    if (cached !== null) return cached;

    logger.debug('Cache MISS', { key: entry.key });
    const fresh = await fetchFn();
    set(entry, fresh);
    return fresh;
  }

  /**
   * Remove dado do cache (RAM + localStorage).
   */
  function remove(entry: CacheKeyEntry): void {
    const key = entry.key;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete _ram[key];
    LocalStorage.removeItem(makeStorageKey(key));
    logger.debug('Cache REMOVE', { key });
  }

  /**
   * Limpa todo o cache (RAM + localStorage).
   */
  function clearAll(): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.keys(_ram).forEach((key) => delete _ram[key]);

    LocalStorage.keys().forEach((storageKey) => {
      if (storageKey.startsWith(CACHE_PREFIX)) {
        LocalStorage.removeItem(storageKey);
      }
    });

    logger.debug('Cache CLEAR ALL');
  }

  /**
   * Verifica se dado existe no cache (RAM ou localStorage).
   */
  function has(entry: CacheKeyEntry): boolean {
    if (!isCacheEnabled(entry)) return false;
    const key = entry.key;
    return key in _ram || LocalStorage.hasItem(makeStorageKey(key));
  }

  // ===== RETURN =====

  return { get, set, getOrFetch, remove, clearAll, has };
}

// ============== EXPORTS ==============

export type UseCache = ReturnType<typeof useCache>;
