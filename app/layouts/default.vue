<script lang="ts" setup>
const authStore = useAuthStore()
await authStore.init()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppNavBar />
    <main>
      <slot />
    </main>
  </div>
</template>
