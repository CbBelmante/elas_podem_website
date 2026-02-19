/**
 * Elas Podem - Configuration System
 *
 * Composable que unifica constantes estaticas (constants.ts) com
 * variaveis de ambiente (runtimeConfig) em uma unica interface.
 *
 * Padrao: constants (estatico) + useRuntimeConfig() (runtime, SSR-safe)
 *
 * Uso:
 *   const config = useConfig()
 *   config.app.name           // constante
 *   config.firebase.projectId // vem do .env via runtimeConfig
 */

import { APP_CONSTANTS } from './constants';
import type { IConstants } from './constants';

// ============== TYPES ==============

export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface IAnalyticsConfig {
  googleAnalyticsId: string;
  facebookPixelId: string;
}

export interface IElasPODEMConfig extends IConstants {
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
  baseUrl: string;
  firebase: IFirebaseConfig;
  analytics: IAnalyticsConfig;
}

// ============== COMPOSABLE ==============

/**
 * Composable principal de configuracao.
 *
 * Deve ser chamado DENTRO de contexto Vue (setup, composables, plugins, middleware).
 * Para valores estaticos fora de contexto Vue, importe APP_CONSTANTS diretamente.
 */
export function useConfig(): IElasPODEMConfig {
  const runtime = useRuntimeConfig();
  const pub = runtime.public;

  const environment = (pub.environment as string) || 'development';
  const isDevelopment = environment !== 'production';

  return {
    // Constantes estaticas
    ...APP_CONSTANTS,

    // Ambiente (runtime)
    environment,
    isDevelopment,
    isProduction: !isDevelopment,
    baseUrl: isDevelopment ? 'http://localhost:3000' : 'https://elaspodem.org',

    // Firebase (runtime - vem do .env)
    firebase: {
      apiKey: pub.firebaseApiKey as string,
      authDomain: pub.firebaseAuthDomain as string,
      projectId: pub.firebaseProjectId as string,
      storageBucket: pub.firebaseStorageBucket as string,
      messagingSenderId: pub.firebaseMessagingSenderId as string,
      appId: pub.firebaseAppId as string,
    },

    // Analytics (runtime - vem do .env, opcional)
    analytics: {
      googleAnalyticsId: pub.googleAnalyticsId as string,
      facebookPixelId: pub.facebookPixelId as string,
    },
  };
}

// ============== CONFIG ESTATICO (para uso fora de contexto Vue) ==============

/**
 * Config estatico para imports diretos (Logger, utils puras).
 * Nao tem env vars — apenas constants + flags derivadas.
 *
 * Para config completo (com Firebase, analytics), use useConfig().
 */
export const config = {
  ...APP_CONSTANTS,
  isProduction: false,
  isDevelopment: true,
} as { isProduction: boolean; isDevelopment: boolean } & IConstants;

// Re-export constants para conveniencia
export { APP_CONSTANTS } from './constants';
export type { IConstants } from './constants';
