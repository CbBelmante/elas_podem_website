/**
 * Elas Podem - Configuration System
 *
 * Centraliza todas as configurações do site institucional por ambiente.
 */

// ============== TYPES & INTERFACES ==============

export type Environment = 'development' | 'production';

/**
 * Configuração da aplicação
 */
export interface IAppConfig {
  name: string;
  version: string;
  title: string;
  description: string;
  defaultLocale: 'pt-BR' | 'en';
  baseUrl: string;
}

/**
 * Informações de contato
 */
export interface IContactConfig {
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

/**
 * Estatísticas do projeto
 */
export interface IStatsConfig {
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

/**
 * Features toggles da aplicação
 */
export interface IFeaturesConfig {
  enableAnalytics: boolean;
  enableContactForm: boolean;
  enableDonations: boolean;
  enableNewsletter: boolean;
  enableBlog: boolean;
}

/**
 * Configuração de Analytics (Google Analytics, etc)
 */
export interface IAnalyticsConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

/**
 * Interface principal de configuração
 */
export interface IElasPODEMConfig {
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  app: IAppConfig;
  contact: IContactConfig;
  stats: IStatsConfig;
  features: IFeaturesConfig;
  analytics: IAnalyticsConfig;
}

// ============== CONSTANTES COMPARTILHADAS ==============

/**
 * Versão da aplicação
 */
const APP_VERSION = '1.0.0';

// ============== CONFIGURAÇÕES POR AMBIENTE ==============

/**
 * Configuração para ambiente de desenvolvimento
 */
const developmentConfig: IElasPODEMConfig = {
  environment: 'development',
  isDevelopment: true,
  isProduction: false,

  app: {
    name: 'Elas Podem',
    version: APP_VERSION,
    title: 'Elas Podem - Atibaia - DEV',
    description: 'ONG dedicada ao empoderamento feminino em Atibaia',
    defaultLocale: 'pt-BR',
    baseUrl: 'http://localhost:3000',
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
    enableAnalytics: false,
    enableContactForm: true,
    enableDonations: true,
    enableNewsletter: false,
    enableBlog: false,
  },

  analytics: {
    googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    facebookPixelId: process.env.NUXT_PUBLIC_FACEBOOK_PIXEL_ID,
  },
};

/**
 * Configuração para ambiente de produção
 */
const productionConfig: IElasPODEMConfig = {
  environment: 'production',
  isDevelopment: false,
  isProduction: true,

  app: {
    name: 'Elas Podem',
    version: APP_VERSION,
    title: 'Elas Podem - Atibaia',
    description: 'ONG dedicada ao empoderamento feminino em Atibaia',
    defaultLocale: 'pt-BR',
    baseUrl: 'https://elasPODEM.org',
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
    enableAnalytics: true,
    enableContactForm: true,
    enableDonations: true,
    enableNewsletter: true,
    enableBlog: true,
  },

  analytics: {
    googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    facebookPixelId: process.env.NUXT_PUBLIC_FACEBOOK_PIXEL_ID,
  },
};

// ============== MAPA DE AMBIENTES ==============

const environments: Record<Environment, IElasPODEMConfig> = {
  development: developmentConfig,
  production: productionConfig,
};

// ============== SELEÇÃO DE AMBIENTE ==============

/**
 * Detecta o ambiente atual baseado em variáveis de ambiente
 */
function getCurrentEnvironment(): Environment {
  const env = process.env.NUXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
    case 'prod':
      return 'production';
    default:
      return 'development';
  }
}

const currentEnvironment = getCurrentEnvironment();
export const config: Readonly<IElasPODEMConfig> =
  environments[currentEnvironment] || environments.development;

// ============== LOGS DE STARTUP (DEV ONLY) ==============

if (typeof window === 'undefined' && config.isDevelopment) {
  console.log('🎨 Elas Podem - Configuration Loaded:');
  console.log(`   Environment: ${config.environment}`);
  console.log(`   Version: ${config.app.version}`);
  console.log(`   Base URL: ${config.app.baseUrl}`);
  console.log(`   Analytics: ${config.features.enableAnalytics ? '✅' : '❌'}`);
  console.log(`   Contact Form: ${config.features.enableContactForm ? '✅' : '❌'}`);
  console.log(`   Donations: ${config.features.enableDonations ? '✅' : '❌'}`);
}

// ============== EXPORTS ==============

// Export principal
export default config;

// Exports auxiliares para conveniência
export const appConfig = config.app;
export const contactConfig = config.contact;
export const statsConfig = config.stats;
export const features = config.features;
export const isDevelopment = config.isDevelopment;
export const isProduction = config.isProduction;
export { currentEnvironment, environments };

// ============== COMPOSABLES ==============

/**
 * Composable para acessar configuração da aplicação
 *
 * Usar DENTRO de: setup, composables, plugins, middleware, etc.
 *
 * Exemplo de uso:
 * ```ts
 * const config = useConfig()
 * console.log(config.contact.instagram.url)
 * ```
 *
 * @returns Configuração tipada IElasPODEMConfig
 */
export function useConfig(): IElasPODEMConfig {
  return config;
}
