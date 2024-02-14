import type { Config } from 'tailwindcss'

export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
      },
    },
  },
  plugins: [],
} satisfies Config
