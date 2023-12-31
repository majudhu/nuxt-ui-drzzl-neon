<script setup lang="ts">
const { params } = useRoute();
const { data, error } = await useFetch(`/api/items/${params.id}`);

if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    message: 'Item not found',
  });
}
</script>

<template>
  <h1 class="col-span-full font-bold text-2xl py-4">{{ data?.name }}</h1>
  <img :src="data?.image" class="w-full" />
  <p class="opacity-80 py-2">
    {{ data?.description }}
  </p>
</template>
