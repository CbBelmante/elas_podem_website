import { resolve, dirname } from 'path';
import { existsSync, lstatSync, readlinkSync } from 'fs';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(() => {
  // Detectar se CBComponents está em desenvolvimento local (npm link)
  const cbSymlinkPath = resolve(__dirname, 'node_modules/@cb/components');
  const isSymlink = existsSync(cbSymlinkPath) && lstatSync(cbSymlinkPath).isSymbolicLink();
  const cbComponentsPath = isSymlink
    ? resolve(dirname(cbSymlinkPath), readlinkSync(cbSymlinkPath))
    : '';
  const hasLocalCBComponents = isSymlink;

  // Log do modo de desenvolvimento
  if (hasLocalCBComponents) {
    console.log('*** CBComponents: Modo DESENVOLVIMENTO (npm link detectado)');
    console.log(`    Caminho: ${cbComponentsPath}`);
  } else {
    console.log('*** CBComponents: Modo PRODUCAO');
  }

  return {
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint'],

    // Runtime config — Nuxt mapeia NUXT_PUBLIC_* do .env automaticamente
    // Ex: NUXT_PUBLIC_FIREBASE_API_KEY → runtimeConfig.public.firebaseApiKey
    runtimeConfig: {
      public: {
        // Ambiente
        environment: '', // NUXT_PUBLIC_ENVIRONMENT

        // Firebase
        firebaseApiKey: '', // NUXT_PUBLIC_FIREBASE_API_KEY
        firebaseAuthDomain: '', // NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        firebaseProjectId: '', // NUXT_PUBLIC_FIREBASE_PROJECT_ID
        firebaseStorageBucket: '', // NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        firebaseMessagingSenderId: '', // NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        firebaseAppId: '', // NUXT_PUBLIC_FIREBASE_APP_ID

        // Analytics (opcional)
        googleAnalyticsId: '', // NUXT_PUBLIC_GOOGLE_ANALYTICS_ID
        facebookPixelId: '', // NUXT_PUBLIC_FACEBOOK_PIXEL_ID
      },
    },

    vite: {
      optimizeDeps: {
        exclude: ['@cb/components'],
      },
      server: {
        fs: {
          allow: [resolve(__dirname), resolve(__dirname, '../cbcomponents')],
        },
      },
    },
  };
});
