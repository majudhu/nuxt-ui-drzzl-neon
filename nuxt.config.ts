// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: { strict: true },

  nitro: {
    preset: 'cloudflare-pages',
    experimental: { wasm: true },
    rollupConfig: { external: ['cloudflare:sockets'] },
  },

  modules: ['nitro-cloudflare-dev', '@nuxt/ui'],
});
