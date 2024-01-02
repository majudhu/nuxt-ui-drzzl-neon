import { init } from './server/init';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  typescript: { strict: true },
  hooks: {
    ready() {
      init();
    },
  },
});
