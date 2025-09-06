<script lang="ts" setup>
import type { Options as HighchartsOptions } from 'highcharts'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

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
// Utilidad para obtener el nombre del día de la semana
function getDayOfWeekIndex(dateString: string): number {
  const date = new Date(dateString)
  // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  // Queremos que 0 = Lunes, ..., 6 = Domingo
  // Así: Lunes = 1, Martes = 2, ..., Domingo = 0
  return (date.getDay() + 6) % 7
}

// Utilidad para transformar las transacciones en datos para el gráfico
function getChartOptionsByWeekday(transactions: Transaction[]): HighchartsOptions {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  const incomeByDay: number[] = Array.from({ length: daysOfWeek.length }, () => 0)
  const expenseByDay: number[] = Array.from({ length: daysOfWeek.length }, () => 0)

  for (const tx of transactions) {
    const dayIndex = getDayOfWeekIndex(tx.date)
    if (tx.category.type === 'income') {
      incomeByDay[dayIndex] = (incomeByDay[dayIndex] ?? 0) + tx.amount
    }
    else {
      expenseByDay[dayIndex] = (expenseByDay[dayIndex] ?? 0) - tx.amount
    }
  }
  const textColor = isDark.value ? '#fff' : '#18181b'
  const gridColor = isDark.value ? '#334155' : '#e5e7eb'

  return {
    chart: {
      type: 'column',
      backgroundColor: isDark.value ? '#020617' : '#fff',
      style: { color: isDark.value ? '#e2e8f1' : '#18181b' },
    },
    title: {
      text: 'Ingresos y gastos por día de la semana',
      style: { fontSize: '15px', fontWeight: '500', color: textColor },
    },
    xAxis: {
      categories: daysOfWeek,
      labels: { style: { color: textColor } },
      title: { style: { color: textColor } },
    },
    yAxis: {
      title: { text: 'Monto', style: { color: textColor } },
      labels: { style: { color: textColor } },
      gridLineColor: gridColor,
    },
    legend: {
      itemStyle: { color: textColor },
    },
    series: [
      { name: 'Ingresos', data: incomeByDay, color: '#4ade80', type: 'column' },
      { name: 'Gastos', data: expenseByDay, color: '#f87171', type: 'column' },
    ],
    credits: { enabled: false },
  }
}

// Calcula las opciones del gráfico usando tus transacciones
const chartOptions = computed<HighchartsOptions>(() =>
  transactions.value ? getChartOptionsByWeekday(transactions.value) : { series: [] },
)
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
          Resumen semanal
        </h3>
        <DashboardChartBar :options="chartOptions" />
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
