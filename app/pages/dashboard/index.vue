<script lang="ts" setup>
const { data: transactions, pending } = await useFetch<Transaction[]>('/api/transactions', { lazy: true })

// Calculate totals
const balance = computed(() => {
  if (!transactions.value)
    return 0
  return transactions.value.reduce((sum, t) => {
    return t.category.type === 'income' ? sum + t.amount : sum - t.amount
  }, 0)
})

const totalIncome = computed(() => {
  return transactions.value?.filter(t => t.category.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || 0
})

const totalExpense = computed(() => {
  return transactions.value?.filter(t => t.category.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) || 0
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(amount)
}
</script>

<template>
  <div class="max-w-[var(--ui-container)] mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">
      Resumen Financiero
    </h1>

    <div class="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Balance Total -->
      <UCard>
        <h3 class="text-sm font-medium text-muted flex items-center gap-2">
          <UIcon name="i-tabler-wallet" class="w-4 h-4" />
          Balance Total
        </h3>
        <template v-if="pending">
          <USkeleton class="h-7 w-32 mt-2" />
          <USkeleton class="h-4 w-24 mt-2" />
        </template>
        <template v-else>
          <p class="text-2xl font-bold mt-1">
            {{ formatCurrency(balance) }}
          </p>
          <p class="text-sm text-muted-foreground mt-1">
            Balance actual
          </p>
        </template>
      </UCard>

      <!-- Ingresos -->
      <UCard>
        <h3 class="text-sm font-medium text-muted flex items-center gap-2">
          <UIcon name="i-tabler-trending-up" class="w-4 h-4 text-primary" />
          Ingresos
        </h3>
        <template v-if="pending">
          <USkeleton class="h-7 w-32 mt-2" />
          <USkeleton class="h-4 w-24 mt-2" />
        </template>
        <template v-else>
          <p class="text-2xl font-bold text-primary mt-1">
            {{ formatCurrency(totalIncome) }}
          </p>
          <p class="text-sm text-primary/80 mt-1">
            {{ transactions?.filter(t => t.category.type === 'income').length || 0 }} transacciones
          </p>
        </template>
      </UCard>

      <!-- Gastos -->
      <UCard>
        <h3 class="text-sm font-medium text-muted flex items-center gap-2">
          <UIcon name="i-tabler-trending-down" class="w-4 h-4 text-error" />
          Gastos
        </h3>
        <template v-if="pending">
          <USkeleton class="h-7 w-32 mt-2" />
          <USkeleton class="h-4 w-24 mt-2" />
        </template>
        <template v-else>
          <p class="text-2xl font-bold text-error mt-1">
            {{ formatCurrency(totalExpense) }}
          </p>
          <p class="text-sm text-error/80 mt-1">
            {{ transactions?.filter(t => t.category.type === 'expense').length || 0 }} transacciones
          </p>
        </template>
      </UCard>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Gráfico principal -->
      <UCard class="lg:col-span-2">
        <h3 class="mb-4 font-medium">
          Resumen Mensual
        </h3>
        <DashboardBarGraphic />
      </UCard>

      <!-- Últimas transacciones -->
      <UCard>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium">
            Últimas transacciones
          </h3>
          <UButton
            variant="link"
            color="neutral"
            size="xs"
            to="/dashboard/transacciones"
            icon="i-tabler-eye"
            label="Ver todas"
          />
        </div>
        <DashboardLastTransactions />
      </UCard>
    </div>
  </div>
</template>
