<script setup lang="ts">
import type { Options as HighchartsOptions } from 'highcharts'

defineProps<{
  options: HighchartsOptions
}>()
</script>

<template>
  <ClientOnly>
    <highcharts :options="options" />
  </ClientOnly>
</template>
