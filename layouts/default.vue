<template>
  <UContainer>
    <nav class="container flex items-center gap-4 py-4">
      <UButton
        to="/"
        icon="i-heroicons-building-storefront"
        size="xl"
        square
        variant="soft"
      />
      <a href="https://github.com/majudhu/nuxt-ui-drzzl-neon" class="ml-auto">
        <img src="/github.svg" class="w-8 h-8" />
      </a>
    </nav>
    <slot />
  </UContainer>
</template>
