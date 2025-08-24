import './app/lib/env'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', 'nuxt-csurf'],
  eslint: {
    config: {
      standalone: false,
    },
  },
})
