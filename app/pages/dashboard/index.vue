<script lang="ts" setup>

</script>

<template>
  <div class="max-w-[var(--ui-container)] mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">
      Resumen Financiero
    </h1>

    <div class="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Tarjetas de resumen -->
      <UCard>
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Balance Total
        </h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          $5,430.00
        </p>
        <p class="text-sm text-primary-500">
          +2.5% desde el mes pasado
        </p>
      </UCard>

      <!-- Más tarjetas de resumen -->
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Gráfico principal -->
      <UCard class="lg:col-span-2">
        <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Resumen Mensual
        </h3>
        <DashboardBarGraphic />
      </UCard>

      <!-- Últimas transacciones -->
      <UCard>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Últimas Transacciones
          </h3>
          <UButton
            variant="soft"
            color="neutral"
            to="/dashboard/transacciones"
            label="Ver todas"
          />
        </div>
        <DashboardLastTransactions />
      </UCard>
    </div>
  </div>
</template>
