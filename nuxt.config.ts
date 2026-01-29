// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    server: {
      fs: {
        allow: [
          '/home/cbbelmante/workspaces/elas_podem_website',
          '/home/cbbelmante/workspaces/cbcomponents'
        ]
      }
    }
  }
})
