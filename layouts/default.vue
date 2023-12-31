<template>
  <UContainer>
    <nav class="container flex gap-4 py-4">
      <UButton
        to="/"
        icon="i-heroicons-building-storefront"
        size="xl"
        square
        variant="soft"
      />
    </nav>
    <slot />
  </UContainer>
</template>
