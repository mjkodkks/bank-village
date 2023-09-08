export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
      ],
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
    },
  },

  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],

  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
    ],
  },

  build: {
		transpile: ["primevue"]
	},

  colorMode: {
    classSuffix: '',
    preference: 'light',
  },

  css: [ "primevue/resources/themes/lara-light-blue/theme.css", 'primevue/resources/primevue.min.css', '~/assets/css/main.css', 'primeicons/primeicons.css'],

  plugins: ['./plugins/primevue.ts', './plugins/scroll.client.ts'],

  imports: {
    dirs: [
      'services'
    ]
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  typescript: {
    tsConfig: {
      include: ['./types/**/*.d.ts', './utils/**/*.ts'],
    },
    shim: false
  },

  devtools: {
    enabled: true
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || ''
    }
  }
})
