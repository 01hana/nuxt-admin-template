// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    '@sidebase/nuxt-auth',
    'nuxt-security',
    '@vee-validate/nuxt',
    '@nuxtjs/i18n',
  ],
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'blob:', 'https://img.freepik.com', 'https://vxeui.com'],
      },
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_URL,
    },
  },
  auth: {
    origin: process.env.ORIGIN || 'http://localhost:3000',
    enableGlobalAppMiddleware: true,
    baseURL: process.env.API_URL || 'http://localhost:3000/api',
    provider: {
      type: 'local',
      endpoints: {
        login: { path: '/auth/login', method: 'post' },
      },
    },
  },
  i18n: {
    defaultLocale: 'zh-TW',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [
      {
        code: 'zh-TW',
        files: ['zh-TW/common.json', 'zh-TW/plugin.json'],
      },
      {
        code: 'en',
        files: ['en/common.json', 'en/plugin.json'],
      },
    ],
  },
  veeValidate: {
    autoImports: true,
  },
  imports: {
    dirs: ['stores', 'composables', 'utils', 'libs/vxe-table'],
  },
  ssr: false,
});
