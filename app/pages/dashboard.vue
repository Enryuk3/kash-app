<script setup lang="ts">
useSeoMeta({
  title: 'Dashboard',
  description: 'Visualiza un resumen de tus finanzas personales y accede a tus objetivos y transacciones en Kash app.',
  ogTitle: 'Dashboard',
  ogDescription: 'Visualiza un resumen de tus finanzas personales y accede a tus objetivos y transacciones en Kash app.',
})
</script>

<template>
  <div class="flex-1 flex">
    <Sidebar />
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
