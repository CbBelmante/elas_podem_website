/**
 * 🔑 Cache Keys - Chaves logicas do cache
 *
 * Identificadores para useCache. A chave no localStorage
 * e gerada automaticamente com prefix 'ep_cache:'.
 *
 * Ex: CACHE_KEYS.USER_DATA → localStorage key: 'ep_cache:userData'
 */

// ============== CACHE KEYS ==============

export const CACHE_KEYS = {
  /** Dados do usuario logado (role, displayName, active) */
  USER_DATA: 'userData',
} as const;

// ============== TYPES ==============

export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
