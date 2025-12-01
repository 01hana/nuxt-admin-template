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
    // '@sidebase/nuxt-auth',
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
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SETUP_TOKEN_SECRET: process.env.SETUP_TOKEN_SECRET,
    public: {
      API_URL: process.env.NUXT_API_URL,
    },
  },
  // auth: {
  //   origin: process.env.ORIGIN || 'http://localhost:3000',
  //   enableGlobalAppMiddleware: true,
  //   baseURL: process.env.API_URL || 'http://localhost:3000/api',
  //   provider: {
  //     type: 'local',
  //     endpoints: {
  //       login: { path: '/auth/login', method: 'post' },
  //     },
  //   },
  // },
  app: {
    baseURL: '/',
  },
  i18n: {
    defaultLocale: 'zh-TW',
    strategy: 'no_prefix',
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
