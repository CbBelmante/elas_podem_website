/**
 * 🔑 Cache Keys - Chaves logicas do cache
 *
 * Identificadores para useCache. A chave no localStorage
 * e gerada automaticamente com prefix 'ep_cache:'.
 *
 * Hierarquia de controle:
 * - enableCache global (features.enableCache) → pai. Se false, TUDO off (filho nao manda ligar).
 * - hasCache por key → filho. So funciona se global for true. Pode desligar a si mesmo.
 *
 * Resumo:
 *   global=false → tudo off (independente do filho)
 *   global=true  → cada key decide por si (hasCache true/false)
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
