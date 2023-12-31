<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import type { LoginSchema } from '~/server/api/auth.post';

const state: LoginSchema = reactive({ name: '', password: '' });

function validate(state: LoginSchema) {
  const errors: FormError[] = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });
  if (!state.password) errors.push({ path: 'password', message: 'Required' });
  return errors;
}

const loginError = ref('');

async function onSubmit({ data }: FormSubmitEvent<LoginSchema>) {
  loginError.value = '';
  try {
    await $fetch('/api/auth', { method: 'POST', body: data });
    navigateTo('/admin');
  } catch (error) {
    if ((error as ApiError).statusCode === 401) {
      loginError.value = 'Invalid credentials';
    }
  }
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup label="Password" name="password" :error="loginError">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">Login</UButton>
  </UForm>
</template>
