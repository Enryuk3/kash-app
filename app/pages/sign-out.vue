<script lang="ts" setup>
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.signOut()
})
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
    <div class="flex flex-col items-center space-y-4">
      <UIcon name="i-tabler-brand-github" class="size-11" />
      <UBadge color="neutral" size="xl">
        Cerrando sesión...
      </UBadge>
    </div>
  </main>
</template>
