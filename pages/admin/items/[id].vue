<script setup lang="ts">
import type { BreadcrumbLink, FormError, FormSubmitEvent } from '#ui/types';
import type { InternalApi } from 'nitropack';
import type { ItemSchema } from '~/server/api/items/index.post';

definePageMeta({ layout: 'admin' });

const { params } = useRoute();

const isNew = params.id === 'add';

const links: BreadcrumbLink[] = [
  { label: 'Admin', icon: 'i-heroicons-table-cells', to: '/admin' },
  { label: 'Items', icon: 'i-heroicons-cube', to: '/admin/items' },
  isNew
    ? { label: 'Add', icon: 'i-heroicons-plus' }
    : { label: 'Edit', icon: 'i-heroicons-pencil' },
];

const { data, error } = useFetch(`/api/items/${params.id}`, {
  lazy: true,
  immediate: !isNew,
  transform: (item) => ({ ...item, price: +item.price } as ItemSchema),
  default() {
    if (process.server || isNew) return {} as ItemSchema;
    const { id, ...item } =
      useNuxtData<InternalApi['/api/items']['get']>('items').data.value?.find(
        (item) => item.id == (params.id as any)
      ) ?? ({} as never);
    return { ...item, price: +item.price || '' } as ItemSchema;
  },
});

watchEffect(() => error.value && navigateTo('/admin/items'));

const fetchError = ref('');

function validate(state: ItemSchema) {
  fetchError.value = '';
  const errors: FormError[] = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });
  if (!state.description)
    errors.push({ path: 'description', message: 'Required' });
  if (!state.image) errors.push({ path: 'image', message: 'Required' });
  if (!state.price) errors.push({ path: 'price', message: 'Required' });
  else if (state.price <= 0)
    errors.push({ path: 'price', message: 'Must be positive' });
  return errors;
}

async function onSubmit({ data: body }: FormSubmitEvent<ItemSchema>) {
  try {
    if (isNew) {
      await $fetch('/api/items', { method: 'POST', body });
    } else {
      await $fetch(`/api/items/${params.id}`, { method: 'PUT', body });
    }
    navigateTo('/admin/items');
  } catch (error) {
    fetchError.value = (error as ApiError).data?.message ?? '';
  }
}

async function onDelete() {
  try {
    await $fetch(`/api/items/${params.id}`, { method: 'DELETE' });
    navigateTo('/admin/items');
  } catch (error) {
    fetchError.value = (error as ApiError).data?.message ?? '';
  }
}
</script>

<template>
  <UBreadcrumb class="py-4" :links="links" />

  <UForm
    :validate="validate"
    :state="data"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="Name" name="name" :error="fetchError">
      <UInput required v-model="data.name" />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UTextarea required v-model="data.description" />
    </UFormGroup>

    <UFormGroup label="Image" name="image">
      <UInput required v-model="data.image" />
    </UFormGroup>

    <UFormGroup label="Price" name="price">
      <UInput
        required
        v-model="data.price"
        type="number"
        min="0.001"
        step="0.001"
      />
    </UFormGroup>

    <div class="flex justify-between py-4">
      <UButton type="submit">Save</UButton>
      <UButton
        v-if="!isNew"
        type="button"
        color="red"
        icon="i-heroicons-trash"
        variant="soft"
        @click="onDelete"
      />
    </div>
  </UForm>
</template>
