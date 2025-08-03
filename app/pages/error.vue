<script lang="ts" setup>
const route = useRoute()
const error = (route.query.error as string) || 'Lo sentimos, ha ocurrido un error inesperado.'
const errorCode = (route.query.statusCode as string) || 'Error'

function handleGoHome() {
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-yellow-500 mx-auto mb-4" />

        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {{ errorCode }}
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ error }}
        </p>

        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-6">
          <p class="text-yellow-700 dark:text-yellow-300 text-sm">
            Si el problema persiste, por favor contacta al soporte.
          </p>
        </div>

        <UButton
          color="primary"
          @click="handleGoHome"
        >
          Volver al inicio
        </UButton>
      </div>
    </div>
  </div>
</template>
