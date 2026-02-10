// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@primevue/nuxt-module'],

  // Pages directory'yi etkinleştir
  pages: true,

  // SSR için optimizasyonlar
  ssr: true,

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode'
        }
      }
    }
  },
  css: ['primeicons/primeicons.css', 'primeflex/primeflex.css', '@/assets/css/main.css'],

  app: {
    // Nuxt'ın varsayılan loading indicator'ünü devre dışı bırak
    pageTransition: false,
    layoutTransition: false,

    head: {
      link: [
        {
          rel: 'preload',
          href: '/_nuxt/primeicons/primeicons.css',
          as: 'style'
        }
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ]
    }
  },

  // Nuxt loading indicator'ü tamamen kaldır
  spaLoadingTemplate: false
})
