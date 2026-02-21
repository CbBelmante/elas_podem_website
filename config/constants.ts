/**
 * Elas Podem - Constantes da Aplicacao
 *
 * Valores estaticos que NAO dependem de variaveis de ambiente.
 * Podem ser importados diretamente em qualquer lugar (SSR-safe).
 *
 * Para valores que vem do .env, use useConfig() de config/index.ts
 */

// ============== ALIASES ==============

/**
 * Definicao centralizada de path aliases (FONTE UNICA)
 *
 * Usado em nuxt.config.ts (alias + vite.resolve.alias)
 * e nos imports do projeto (@config, @composables, etc).
 */
export const ALIAS_DEFINITIONS = {
  '@': '.',
  '@config': './config',
  '@components': './components',
  '@composables': './composables',
  '@utils': './utils',
  '@assets': './assets',
  '@definitions': './definitions',
  '@data': './data',
  '@appTypes': './types',
  '@plugins': './plugins',
} as const;

/**
 * Converte definicoes de aliases para formato Nuxt/Vite (paths absolutos).
 *
 * @param baseUrl - URL base do projeto (import.meta.url)
 */
export function getAliases(baseUrl: string | URL): Record<string, string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { fileURLToPath } = require('node:url');

  const aliases: Record<string, string> = {};

  for (const [alias, path] of Object.entries(ALIAS_DEFINITIONS)) {
    aliases[alias] = fileURLToPath(new URL(path, baseUrl));
  }

  return aliases;
}

// ============== TYPES ==============

export interface IAppConstants {
  name: string;
  version: string;
  defaultLocale: 'pt-BR' | 'en' | 'es';
  localStoragePrefix: string;
}

export interface IContactConstants {
  instagram: {
    handle: string;
    url: string;
  };
  president: {
    name: string;
    contact: string;
  };
  location: {
    city: string;
    state: string;
    fullAddress: string;
  };
  email?: string;
}

export interface IStatsConstants {
  headquarter: {
    number: string;
    label: string;
  };
  conference: {
    number: string;
    label: string;
  };
  location: {
    number: string;
    label: string;
  };
}

export interface IFeaturesConstants {
  enableContactForm: boolean;
  enableDonations: boolean;
  enableNewsletter: boolean;
  enableBlog: boolean;
  enableDebugLogs: boolean;
  enableCache: boolean;
}

export interface IConstants {
  app: IAppConstants;
  contact: IContactConstants;
  stats: IStatsConstants;
  features: IFeaturesConstants;
}

// ============== CONSTANTES ==============

export const APP_CONSTANTS: Readonly<IConstants> = {
  app: {
    name: 'Elas Podem',
    version: '1.0.0',
    defaultLocale: 'pt-BR',
    localStoragePrefix: 'ep_',
  },

  contact: {
    instagram: {
      handle: '@elasPODEMatibaia',
      url: 'https://instagram.com/elasPODEMatibaia',
    },
    president: {
      name: 'Margareth',
      contact: 'Margareth - Presidente',
    },
    location: {
      city: 'Atibaia',
      state: 'SP',
      fullAddress: 'Atibaia - SP',
    },
  },

  stats: {
    headquarter: {
      number: '1',
      label: 'Sede',
    },
    conference: {
      number: '10+',
      label: 'Palestras',
    },
    location: {
      number: '5+',
      label: 'Localidades',
    },
  },

  features: {
    enableContactForm: true,
    enableDonations: true,
    enableNewsletter: false,
    enableBlog: false,
    enableDebugLogs: true,
    enableCache: false,
  },
};
