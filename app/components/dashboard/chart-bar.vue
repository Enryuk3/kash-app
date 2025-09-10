<script setup lang="ts">
import type { Options as HighchartsOptions } from 'highcharts'

defineProps<{
  options: HighchartsOptions
}>()
</script>

<template>
  <ClientOnly>
    <highcharts :options="options" />
    <template #fallback>
      <div class="flex h-96 w-full items-center justify-center">
        <span class="text-sm text-muted">Cargando gráfico...</span>
      </div>
    </template>
  </ClientOnly>
</template>
