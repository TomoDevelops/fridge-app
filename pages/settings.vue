<template>
  <div>
    <h1>settings.vue "/settings"</h1>
    <h2>SLOW PAGE</h2>
    <NuxtLink to="/">Home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const waitFor = () => new Promise((resolve) => setTimeout(resolve, 5000));

await waitFor();
</script>
