<script setup lang="ts">
import type { BreadcrumbLink } from '#ui/types';

definePageMeta({ layout: 'admin' });

const links: BreadcrumbLink[] = [
  { label: 'Admin', icon: 'i-heroicons-table-cells', to: '/admin' },
  { label: 'Users', icon: 'i-heroicons-users', to: '/admin/users' },
];

const { data, pending, error, refresh } = useFetch('/api/users', {
  key: 'users',
  lazy: true,
});

type Row = Exclude<typeof data.value, null>[number];
</script>

<template>
  <UBreadcrumb class="py-4" :links="links" />

  <div class="flex pb-8 justify-between">
    <UButton to="/admin/users/create">Create User</UButton>
    <UButton
      icon="i-heroicons-arrow-path-20-solid"
      :loading="pending"
      @click="refresh"
    />
  </div>
  <UTable
    v-if="pending || data"
    :rows="data ?? []"
    :loading="pending"
    @select="(row:Row) => navigateTo(`/admin/users/${row.id}`)"
  />
  <UAlert
    v-else
    icon="i-heroicons-exclamation-triangle"
    color="red"
    variant="outline"
    :title="error?.statusMessage ?? ''"
  />
</template>
