<script lang="ts" setup>
const authStore = useAuthStore()
</script>

<template>
  <UButton
    label="Iniciar Sesión"
    trailing-icon="i-tabler-brand-github"
    class="hidden sm:inline-flex"
    :loading="authStore.loading"
    @click="authStore.signIn"
  />
</template>

<style>

</style>
