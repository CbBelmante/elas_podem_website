/**
 * 🔑 Cache Keys - Chaves logicas do cache
 *
 * Identificadores para useCache. A chave no localStorage
 * e gerada automaticamente com prefix 'ep_cache:'.
 *
 * Cada key tem `hasCache` (igual ao hasCache dos repositories do mneis_frontend).
 * - hasCache: true  → cache normal (RAM + localStorage)
 * - hasCache: false → bypass total, sempre busca fresco
 *
 * O enableCache global (features.enableCache) desabilita TUDO.
 * O hasCache por key permite desabilitar individualmente mesmo com global true.
 *
 * Ex: CACHE_KEYS.USER_DATA.key → 'userData' → localStorage: 'ep_cache:userData'
 */

// ============== CACHE KEYS ==============

export const CACHE_KEYS = {
  /** Dados do usuario logado (role, displayName, active) */
  USER_DATA: { key: 'userData', hasCache: true },
  /** Dados da homepage (IHomePageData do Firestore) */
  HOME_PAGE: { key: 'homePage', hasCache: true },
} as const;

// ============== TYPES ==============

export type CacheKeyEntry = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
export type CacheKey = CacheKeyEntry['key'];
