<script setup lang="ts">
import type { BreadcrumbLink, FormError, FormSubmitEvent } from '#ui/types';
import type { InternalApi } from 'nitropack';
import type { AsyncData } from 'nuxt/app';
import type { UserSchema } from '~/server/api/users/index.post';

definePageMeta({ layout: 'admin' });

const { params } = useRoute();

const isNew = params.id === 'create';

const links: BreadcrumbLink[] = [
  { label: 'Admin', icon: 'i-heroicons-table-cells', to: '/admin' },
  { label: 'Users', icon: 'i-heroicons-users', to: '/admin/users' },
  isNew
    ? { label: 'Create', icon: 'i-heroicons-user-plus' }
    : { label: 'Edit', icon: 'i-heroicons-user-pencil' },
];

interface FormData extends UserSchema {
  password: string;
  confirmPassword?: string;
}

const { data, error }: AsyncData<FormData, ApiError | null> = useFetch(
  `/api/users/${params.id}`,
  {
    lazy: true,
    key: `item-${params.id}`,
    immediate: !isNew,
    default() {
      const { id, ...item } =
        useNuxtData<InternalApi['/api/users']['get']>('users').data.value?.find(
          (item) => item.id == (params.id as any)
        ) ?? ({} as never);
      return item as FormData;
    },
  }
);

watchEffect(
  () => error.value?.statusCode === 404 && navigateTo('/admin/users')
);

const fetchError = ref('');

function validate(state: FormData) {
  fetchError.value = '';
  const errors: FormError[] = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });
  if (isNew && !state.password)
    errors.push({ path: 'password', message: 'Required' });
  if (
    (state.password || state.confirmPassword) &&
    state.password !== state.confirmPassword
  )
    errors.push({ path: 'confirmPassword', message: 'Must match' });
  return errors;
}

async function onSubmit({ data }: FormSubmitEvent<FormData>) {
  if (data.password !== data.confirmPassword) return;
  const body: UserSchema = { name: data.name, password: data.password };
  try {
    if (isNew) {
      await $fetch('/api/users', { method: 'POST', body });
    } else {
      await $fetch(`/api/users/${params.id}`, { method: 'PUT', body });
    }
    navigateTo('/admin/users');
  } catch (error) {
    fetchError.value = (error as ApiError).data?.message ?? '';
  }
}

async function onDelete() {
  try {
    await $fetch(`/api/users/${params.id}`, { method: 'DELETE' });
    navigateTo('/admin/users');
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

    <UFormGroup label="Password" name="password">
      <UInput v-model="data.password" type="password" />
    </UFormGroup>

    <UFormGroup label="Confirm password" name="confirmPassword">
      <UInput v-model="data.confirmPassword" type="password" />
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
