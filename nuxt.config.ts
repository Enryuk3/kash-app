import './app/lib/env'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
})
