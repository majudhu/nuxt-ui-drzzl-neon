<script setup lang="ts">
const { data } = useFetch('/api/items');
</script>

<template>
  <section class="grid gap-4 grid-cols-3 pb-8">
    <h1 class="col-span-full font-bold text-2xl py-4">Featured Items</h1>
    <UCard as="article" v-for="item in data">
      <img :src="item.image" class="w-full" />
      <h2 class="font-medium text-lg py-2">{{ item.name }}</h2>
      <p class="text-sm opacity-80 pb-2">
        {{ item.description }}
      </p>
      <UButton :to="`/item/${item.id}`">View Item</UButton>
    </UCard>
  </section>

  <section class="grid gap-4 grid-cols-5 pb-8">
    <h1 class="col-span-full font-bold text-2xl py-4">Trending Items</h1>
    <UCard as="article" v-for="item in data">
      <img :src="item.image" class="w-full" />
      <h2 class="font-medium text-lg py-2">{{ item.name }}</h2>
      <p class="text-sm opacity-80 pb-2">
        {{ item.description }}
      </p>
      <UButton :to="`/item/${item.id}`">View Item</UButton>
    </UCard>
  </section>

  <section class="grid gap-4 grid-cols-5 pb-8">
    <h1 class="col-span-full font-bold text-2xl py-4">Latest Items</h1>
    <UCard as="article" v-for="item in data">
      <img :src="item.image" class="w-full" />
      <h2 class="font-medium text-lg py-2">{{ item.name }}</h2>
      <p class="text-sm opacity-80 pb-2">
        {{ item.description }}
      </p>
      <UButton :to="`/item/${item.id}`">View Item</UButton>
    </UCard>
  </section>
</template>
