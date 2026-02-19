/**
 * 💾 LocalStorage - Safari-safe localStorage wrapper
 *
 * Wrapper seguro para localStorage com proteção contra Safari/cookies desabilitados.
 * Inclui fallback para memória e tratamento de QuotaExceeded.
 */

/**
 * @example
 * ```typescript
 * import { LocalStorage } from '@utils/LocalStorage';
 *
 * // String simples
 * LocalStorage.setItem('key', 'value');
 * const value = LocalStorage.getItem('key');
 *
 * // Objetos (JSON automático)
 * LocalStorage.setObj('user', { name: 'João' });
 * const user = LocalStorage.getObj<User>('user');
 * ```
 */

// ============== DEPENDÊNCIAS ==============

import { Logger } from '@utils/Logger';

// ============== LOGGER SETUP ==============

const logger = Logger.child({
  util: 'LocalStorage',
  layer: 'storage',
  minLevel: 'INFO',
});

// ============== DETECÇÃO DE SUPORTE ==============

// Flag global de disponibilidade
let _storageIsEnable = true;

// Verifica suporte ao localStorage (Safari pode bloquear)
try {
  // Tenta acessar localStorage
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    // Teste de escrita/leitura
    const testKey = '__cbls_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
  } else {
    _storageIsEnable = false;
  }
} catch (err) {
  _storageIsEnable = false;
  logger.error('Browser outdated or cookies disabled', err instanceof Error ? err : null, {
    reason: 'localStorage_detection_failed',
  });
}

// ============== CLASSE PRINCIPAL ==============

/**
 * Singleton para acesso seguro ao localStorage
 */
class LocalStorageClass {
  private fallbackStorage: Map<string, string> = new Map();
  private readonly enabled: boolean = _storageIsEnable;

  // ============== MÉTODOS BÁSICOS ==============

  /**
   * Retorna valor do localStorage
   *
   * @param key - Chave do item a ser recuperado
   * @returns Valor armazenado ou null se nao encontrado
   */
  getItem(key: string): string | null {
    if (!this.enabled) {
      return this.fallbackStorage.get(key) ?? null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      logger.error('Error reading key', err instanceof Error ? err : null, { key });
      return this.fallbackStorage.get(key) ?? null;
    }
  }

  /**
   * Salva valor no localStorage
   *
   * @param key - Chave do item
   * @param value - Valor a ser armazenado
   */
  setItem(key: string, value: string): void {
    if (!this.enabled) {
      this.fallbackStorage.set(key, value);
      return;
    }

    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      logger.error('Error setting key', err instanceof Error ? err : null, { key });
      // Fallback para memória
      this.fallbackStorage.set(key, value);

      // Possivel quota excedida
      if (err instanceof Error && err.name === 'QuotaExceededError') {
        logger.warn('Storage quota exceeded, trying to clear old data', { key });
        this.tryCleanupOldData();

        // Tenta novamente
        try {
          window.localStorage.setItem(key, value);
        } catch {
          // Falhou definitivamente, usa fallback
          this.fallbackStorage.set(key, value);
        }
      }
    }
  }

  /**
   * Remove item do localStorage
   *
   * @param key - Chave do item a ser removido
   */
  removeItem(key: string): void {
    if (!this.enabled) {
      this.fallbackStorage.delete(key);
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      logger.error('Error removing key', err instanceof Error ? err : null, { key });
      this.fallbackStorage.delete(key);
    }
  }

  /**
   * Limpa todo o localStorage
   */
  clear(): void {
    if (!this.enabled) {
      this.fallbackStorage.clear();
      return;
    }

    try {
      window.localStorage.clear();
      this.fallbackStorage.clear();
    } catch (err) {
      logger.error('Error clearing storage', err instanceof Error ? err : null);
      this.fallbackStorage.clear();
    }
  }

  /**
   * Retorna chave pelo índice
   *
   * @param index - Indice da chave
   * @returns Chave no índice especificado ou null
   */
  key(index: number): string | null {
    if (!this.enabled) {
      const keys = Array.from(this.fallbackStorage.keys());
      return keys[index] ?? null;
    }

    try {
      return window.localStorage.key(index);
    } catch (err) {
      logger.error('Error getting key at index', err instanceof Error ? err : null, { index });
      const keys = Array.from(this.fallbackStorage.keys());
      return keys[index] ?? null;
    }
  }

  /**
   * Retorna quantidade de items armazenados
   */
  get length(): number {
    if (!this.enabled) {
      return this.fallbackStorage.size;
    }

    try {
      return window.localStorage.length;
    } catch (err) {
      logger.error('Error getting length', err instanceof Error ? err : null);
      return this.fallbackStorage.size;
    }
  }

  // ============== HELPERS ==============

  /**
   * Retorna objeto parseado do localStorage
   *
   * @template T - Tipo do objeto esperado
   * @param key - Chave do item
   * @returns Objeto parseado ou null se nao encontrado/invalido
   */
  getObj<T = unknown>(key: string): T | null {
    const value = this.getItem(key);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch (err) {
      logger.error('Error parsing JSON for key', err instanceof Error ? err : null, { key });
      return null;
    }
  }

  /**
   * Salva objeto stringificado no localStorage
   *
   * @template T - Tipo do objeto
   * @param key - Chave do item
   * @param obj - Objeto a ser armazenado
   */
  setObj<T = unknown>(key: string, obj: T): void {
    try {
      const value = JSON.stringify(obj);
      this.setItem(key, value);
    } catch (err) {
      logger.error('Error stringifying object for key', err instanceof Error ? err : null, { key });
    }
  }

  /**
   * Verifica se localStorage esta disponivel
   *
   * @returns true se localStorage esta habilitado
   */
  storageIsEnable(): boolean {
    return this.enabled;
  }

  /**
   * Verifica se uma chave existe no storage
   *
   * @param key - Chave a verificar
   * @returns true se a chave existe
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Retorna todas as chaves armazenadas
   *
   * @returns Array com todas as chaves
   */
  keys(): string[] {
    if (!this.enabled) {
      return Array.from(this.fallbackStorage.keys());
    }

    try {
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key !== null) {
          keys.push(key);
        }
      }
      return keys;
    } catch (err) {
      logger.error('Error getting keys', err instanceof Error ? err : null);
      return Array.from(this.fallbackStorage.keys());
    }
  }

  /**
   * Retorna todos os valores armazenados
   *
   * @returns Array com todos os valores
   */
  values(): string[] {
    if (!this.enabled) {
      return Array.from(this.fallbackStorage.values());
    }

    try {
      const values: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key !== null) {
          const value = window.localStorage.getItem(key);
          if (value !== null) {
            values.push(value);
          }
        }
      }
      return values;
    } catch (err) {
      logger.error('Error getting values', err instanceof Error ? err : null);
      return Array.from(this.fallbackStorage.values());
    }
  }

  /**
   * Retorna todas as entradas [key, value]
   *
   * @returns Array de tuplas [chave, valor]
   */
  entries(): Array<[string, string]> {
    if (!this.enabled) {
      return Array.from(this.fallbackStorage.entries());
    }

    try {
      const entries: Array<[string, string]> = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key !== null) {
          const value = window.localStorage.getItem(key);
          if (value !== null) {
            entries.push([key, value]);
          }
        }
      }
      return entries;
    } catch (err) {
      logger.error('Error getting entries', err instanceof Error ? err : null);
      return Array.from(this.fallbackStorage.entries());
    }
  }

  // ============== UTILITÁRIOS INTERNOS ==============

  /**
   * Tenta limpar dados antigos quando quota excedida
   *
   * @private
   */
  private tryCleanupOldData(): void {
    if (!this.enabled) {
      return;
    }

    try {
      const keys = this.keys();
      const now = Date.now();

      // Remove items com timestamp antigo (> 30 dias)
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

      for (const key of keys) {
        // Ignora chaves do sistema
        if (key.startsWith('ep_') || key.startsWith('__')) {
          continue;
        }

        const value = this.getItem(key);
        if (!value) continue;

        // Tenta detectar timestamp
        try {
          const obj = JSON.parse(value) as Record<string, unknown>;
          if (obj && typeof obj === 'object') {
            const timestamp = obj.timestamp ?? obj.created_at ?? obj.updatedAt ?? obj.date;
            if (timestamp) {
              const date = new Date(timestamp as string | number).getTime();
              if (!isNaN(date) && now - date > thirtyDaysMs) {
                this.removeItem(key);
                logger.debug('Removed old item during cleanup', { key, age: 'over_30_days' });
              }
            }
          }
        } catch {
          // Nao e JSON ou nao tem timestamp, ignora
        }
      }

      // Remove items grandes (> 100KB)
      for (const key of keys) {
        const value = this.getItem(key);
        if (value && value.length > 100000) {
          // So remove se nao for critico
          if (!key.includes('auth') && !key.includes('user') && !key.includes('session')) {
            this.removeItem(key);
            logger.debug('Removed large item during cleanup', { key, size: value.length });
          }
        }
      }
    } catch (err) {
      logger.error('Error during cleanup', err instanceof Error ? err : null);
    }
  }

  /**
   * Retorna tamanho estimado do storage em bytes
   *
   * @returns Tamanho estimado em bytes
   */
  getEstimatedSize(): number {
    let size = 0;

    if (!this.enabled) {
      for (const [key, value] of this.fallbackStorage.entries()) {
        size += key.length + value.length;
      }
      return size;
    }

    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key !== null) {
          const value = window.localStorage.getItem(key);
          if (value !== null) {
            size += key.length + value.length;
          }
        }
      }
    } catch (err) {
      logger.error('Error calculating size', err instanceof Error ? err : null);
    }

    return size;
  }

  /**
   * Retorna tamanho formatado (KB, MB)
   *
   * @returns String formatada com tamanho (ex: "1.5 KB")
   */
  getFormattedSize(): string {
    const bytes = this.getEstimatedSize();

    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  }
}

// ============== SINGLETON EXPORT ==============

// Instancia única
const LocalStorage = new LocalStorageClass();

// Export default para uso direto
export default LocalStorage;

// Export nomeado para compatibilidade
export { LocalStorage };

// ============== HELPERS GLOBAIS (OPCIONAL) ==============

/**
 * Atalhos globais para uso rapido
 */
export const storageIsEnable = (): boolean => LocalStorage.storageIsEnable();
export const getItem = (key: string): string | null => LocalStorage.getItem(key);
export const setItem = (key: string, value: string): void => LocalStorage.setItem(key, value);
export const removeItem = (key: string): void => LocalStorage.removeItem(key);
export const getObj = <T = unknown>(key: string): T | null => LocalStorage.getObj<T>(key);
export const setObj = <T = unknown>(key: string, obj: T): void => LocalStorage.setObj<T>(key, obj);
export const clearStorage = (): void => LocalStorage.clear();
