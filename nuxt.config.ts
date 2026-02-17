import { resolve } from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
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
});
