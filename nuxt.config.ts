import { init } from './server/init';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  typescript: { strict: true },
  nitro: { rollupConfig: { external: ['cloudflare:sockets'] } },
  hooks: {
    ready() {
      init();
    },
  },
});
