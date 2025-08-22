<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()

const items = ref<DropdownMenuItem[]>([
  {
    label: 'Cerrar Sesión',
    icon: 'i-tabler-logout-2',
    to: '/sign-out',
  },
])
</script>

<template>
  <UDropdownMenu
    v-if="!authStore.loading && authStore.user"
    :items="items"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8,
    }"
    :ui="{ content: 'w-44' }"
  >
    <UButton
      v-if="authStore.user.image"
      :label="authStore.user.name"
      :avatar="{ src: authStore.user.image }"
      color="neutral"
      variant="outline"
      class="hidden sm:inline-flex"
    />
  </UDropdownMenu>
  <UButton
    v-else
    label="Iniciar Sesión"
    trailing-icon="i-tabler-brand-github"
    class="hidden sm:inline-flex"
    :loading="authStore.loading"
    :disabled="authStore.loading"
    @click="authStore.signIn"
  />
</template>
