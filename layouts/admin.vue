<script setup lang="ts">
const { data } = useFetch('/api/auth', { lazy: true });

async function onLogout() {
  await $fetch('/api/auth', { method: 'DELETE' });
  navigateTo('/admin/login');
}
</script>

<template>
  <UContainer>
    <div class="flex py-8 items-center justify-end gap-4">
      <p class="text-sm text-gray-400">Welcome, {{ data?.name }}</p>
      <UButton @click="onLogout">Logout</UButton>
    </div>
    <slot />
  </UContainer>
</template>
