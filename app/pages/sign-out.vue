<script lang="ts" setup>
const authStore = useAuthStore()

onMounted(() => {
  authStore.signOut()
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="text-center">
        <UIcon name="i-tabler-brand-github" class="w-12 h-12 text-primary-500 mx-auto mb-4" />

        <UButton color="neutral" loading-auto label="Cerrando sesión..." />
      </div>
    </div>
  </div>
</template>
