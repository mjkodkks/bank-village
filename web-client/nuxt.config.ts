export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
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

  build: {
		transpile: ["primevue"]
	},

  colorMode: {
    classSuffix: '',
    preference: 'light',
  },

  css: [ "primevue/resources/themes/lara-light-blue/theme.css", '~/assets/css/main.css'],

  plugins: ['./plugins/primevue.js'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  typescript: {
    tsConfig: {
      include: ['./types/**/*.d.ts'],
    },
    shim: false
  },

  devtools: {
    enabled: true
  }
})
