<script setup lang="ts">
const { data: transactions, pending } = await useLazyFetch<Transaction[]>('/api/transactions', {
  params: {
    limit: 5,
    sort: 'date:desc', // Sort by most recent first
  },
  default: () => [],
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString())
    return 'hoy'
  if (date.toDateString() === yesterday.toDateString())
    return 'ayer'

  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(amount)
}
</script>

<template>
  <div class="space-y-1 max-h-[420px] overflow-y-auto">
    <template v-if="pending">
      <div v-for="i in 3" :key="`loading-${i}`" class="flex items-center justify-between p-3 rounded-lg">
        <div class="flex items-center w-full">
          <USkeleton class="h-8 w-8 rounded-full" />
          <div class="ml-3 space-y-2">
            <USkeleton class="h-4 w-32" />
            <USkeleton class="h-3 w-24" />
          </div>
        </div>
        <USkeleton class="h-5 w-24" />
      </div>
    </template>
    <template v-else-if="transactions && transactions.length > 0">
      <div
        v-for="(transaction, index) in transactions"
        :key="transaction.id"
        class="flex items-center justify-between p-3 rounded-lg"
        :class="{ 'border-t-0': index > 0 }"
      >
        <div class="flex items-center">
          <div class="p-2 rounded-full inline-flex" :class="transaction.category?.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
            <UIcon
              :name="transaction.category?.type === 'income' ? 'i-tabler-arrow-up-right' : 'i-tabler-arrow-down-right'"
              :class="transaction.category?.type === 'income' ? 'text-primary' : 'text-error'"
            />
          </div>
          <div class="ml-3.5">
            <p class="text-sm font-medium leading-tight">
              {{ transaction.description }}
            </p>
            <div class="flex items-center space-x-2.5 mt-1">
              <span class="text-xs text-muted font-medium">
                {{ transaction.category?.name || 'Sin categoría' }}
              </span>
              <span class="text-xs text-muted">•</span>
              <span class="text-xs text-muted">
                {{ formatDate(transaction.date) }}
              </span>
            </div>
          </div>
        </div>
        <span class="text-sm font-medium" :class="transaction.category?.type === 'income' ? 'text-primary' : 'text-error'">
          {{ transaction.category?.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
        </span>
      </div>
    </template>
    <div v-else class="py-4 text-center text-muted text-sm">
      <p>No se encontraron transacciones recientes.</p>
    </div>
  </div>
</template>
