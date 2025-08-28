<script lang="ts" setup>
// Types
type Transaction = {
  id: string
  amount: number
  description: string
  date: string
  category: {
    id: string
    name: string
    type: 'income' | 'expense'
  }
}

type Category = {
  id: string
  name: string
  type: 'income' | 'expense'
}

// State
const { data: transactions, status, refresh } = await useFetch<Transaction[]>('/api/transactions', { lazy: true })
const { data: _categories } = await useFetch<Category[]>('/api/categories', { lazy: true })
const categories = computed(() => _categories.value || [])

// Delete confirmation state
const isDeleteDialogOpen = ref(false)
const transactionToDelete = ref<{ id: string, description: string } | null>(null)
const isDeleting = ref(false)

// Filters
const searchQuery = ref('')
const selectedType = ref<'income' | 'expense' | null>(null)
const selectedCategory = ref<string | null>(null)

// Open delete confirmation dialog
function confirmDelete(transaction: { id: string, description: string }) {
  transactionToDelete.value = transaction
  isDeleteDialogOpen.value = true
}

// Delete transaction
async function deleteTransaction() {
  if (!transactionToDelete.value)
    return

  isDeleting.value = true

  try {
    await $fetch(`/api/transactions/${transactionToDelete.value.id}`, {
      method: 'DELETE',
    })

    useToast().add({
      title: 'Transacción eliminada',
      description: 'La transacción ha sido eliminada correctamente',
      icon: 'i-tabler-circle-check',
      color: 'success',
    })

    // Refresh the transactions list
    await refresh()
  }
  catch (error) {
    console.error('Error al eliminar la transacción:', error)
    useToast().add({
      title: 'Error',
      description: 'No se pudo eliminar la transacción',
      icon: 'i-tabler-alert-circle',
      color: 'error',
    })
  }
  finally {
    isDeleting.value = false
    isDeleteDialogOpen.value = false
    transactionToDelete.value = null
  }
}

// Formatear fecha
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getTypeColor(type: string) {
  return type === 'income' ? 'primary' : 'error'
}

// Calcular totales
const totalIncome = computed(() =>
  transactions.value?.filter(t => t.category.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || 0,
)

const totalExpense = computed(() =>
  transactions.value?.filter(t => t.category.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) || 0,
)

// Filtrar transacciones
const filteredTransactions = computed(() => {
  if (!transactions.value)
    return []

  return transactions.value.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !selectedType.value || transaction.category.type === selectedType.value
    const matchesCategory = !selectedCategory.value || transaction.category.id === selectedCategory.value

    return matchesSearch && matchesType && matchesCategory
  })
})
</script>

<template>
  <div class="max-w-[var(--ui-container)] mx-auto px-4 py-8 space-y-6">
    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">
          Transacciones
        </h1>
        <p class="text-sm text-muted">
          Gestiona tus ingresos y gastos
        </p>
      </div>
      <UButton
        color="primary"
        icon="i-tabler-plus"
        to="/dashboard/add-transaction"
      >
        Nueva Transacción
      </UButton>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">
              Total Ingresos
            </p>
            <p class="text-2xl font-bold text-primary">
              +${{ totalIncome.toFixed(2) }}
            </p>
          </div>
          <UIcon name="i-tabler-trending-up" class="w-8 h-8 text-primary" />
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">
              Total Gastos
            </p>
            <p class="text-2xl font-bold text-error">
              -${{ totalExpense.toFixed(2) }}
            </p>
          </div>
          <UIcon name="i-tabler-trending-down" class="w-8 h-8 text-error" />
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">
              Balance Total
            </p>
            <p class="text-2xl font-bold">
              ${{ (totalIncome - totalExpense).toFixed(2) }}
            </p>
          </div>
          <UIcon name="i-tabler-wallet" class="w-8 h-8" />
        </div>
      </UCard>
    </div>

    <!-- Filtros -->
    <UCard>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Buscar transacciones..."
          icon="i-tabler-search"
        />
        <USelect
          v-model="selectedType"
          :items="[
            { value: null, label: 'Todos los tipos' },
            { value: 'income', label: 'Ingresos' },
            { value: 'expense', label: 'Gastos' },
          ]"
          placeholder="Filtrar por tipo"
        />
        <USelect
          v-model="selectedCategory"
          :items="[
            { value: null, label: 'Todas las categorías' },
            ...categories.map(c => ({ value: c.id, label: c.name })),
          ]"
          placeholder="Filtrar por categoría"
        />
        <UButton
          color="neutral"
          variant="link"
          icon="i-tabler-filter"
          @click="() => {
            searchQuery = ''
            selectedType = null
            selectedCategory = null
          }"
        >
          Limpiar filtros
        </UButton>
      </div>
    </UCard>

    <!-- Estado de carga -->
    <template v-if="status === 'pending'">
      <div class="space-y-4">
        <USkeleton v-for="i in 3" :key="i" class="h-24 rounded-xl" />
      </div>
    </template>

    <!-- Lista de transacciones -->
    <template v-else-if="filteredTransactions.length">
      <div class="space-y-4">
        <TransitionGroup name="list">
          <UCard
            v-for="transaction in filteredTransactions"
            :key="transaction.id"
            class="group transition-all duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4">
                <div
                  class="p-3 rounded-full inline-flex"
                  :class="{
                    'bg-primary-100 dark:bg-primary-900/30': transaction.category.type === 'income',
                    'bg-red-100 dark:bg-red-900/30': transaction.category.type === 'expense',
                  }"
                >
                  <UIcon
                    name="i-tabler-credit-card"
                    class="w-5 h-5"
                    :class="{
                      'text-primary': transaction.category.type === 'income',
                      'text-error': transaction.category.type === 'expense',
                    }"
                  />
                </div>
                <div>
                  <h3 class="font-medium">
                    {{ transaction.description }}
                  </h3>
                  <p class="text-sm text-muted mt-1">
                    {{ formatDate(transaction.date) }}
                  </p>
                  <UBadge
                    :label="transaction.category.name"
                    :color="getTypeColor(transaction.category.type)"
                    variant="subtle"
                    class="mt-2"
                  />
                </div>
              </div>
              <div class="text-right">
                <p
                  class="text-lg font-semibold"
                  :class="{
                    'text-primary': transaction.category.type === 'income',
                    'text-error': transaction.category.type === 'expense',
                  }"
                >
                  {{ transaction.category.type === 'income' ? '+' : '-' }}${{
                    transaction.amount.toFixed(2)
                  }}
                </p>
                <div class="mt-2 flex justify-end space-x-2">
                  <UButton
                    icon="i-tabler-pencil"
                    color="neutral"
                    variant="ghost"
                    class="rounded-full"
                    size="xs"
                    :to="`/dashboard/transacciones/editar/${transaction.id}`"
                  />

                  <UButton
                    icon="i-tabler-trash"
                    color="error"
                    variant="ghost"
                    class="rounded-full"
                    size="xs"
                    @click="confirmDelete(transaction)"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </TransitionGroup>
      </div>
    </template>

    <!-- Sin transacciones -->
    <template v-else>
      <UCard>
        <div class="text-center py-12">
          <UIcon name="i-tabler-file-text" class="w-12 h-12 mx-auto text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No se encontraron transacciones
          </h3>
          <p class="mt-1 text-sm">
            {{ searchQuery || selectedType || selectedCategory
              ? 'Intenta con otros filtros de búsqueda.'
              : 'Comienza registrando tu primera transacción.' }}
          </p>
          <UButton
            v-if="!searchQuery && !selectedType && !selectedCategory"
            color="primary"
            variant="soft"
            class="mt-6"
            to="/dashboard/add-transaction"
          >
            <UIcon name="i-tabler-plus" class="w-5 h-5" />
            <span>Nueva Transacción</span>
          </UButton>
          <UButton
            v-else
            color="neutral"
            variant="ghost"
            class="mt-6"
            @click="() => {
              searchQuery = ''
              selectedType = null
              selectedCategory = null
            }"
          >
            <UIcon name="i-tabler-x" class="w-5 h-5" />
            <span>Limpiar filtros</span>
          </UButton>
        </div>
      </UCard>
    </template>
    <!-- Diálogo de confirmación -->
    <UModal
      v-model:open="isDeleteDialogOpen"
      title="¿Estás seguro?"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <p class="text-sm mt-2">
          Se borrará
          <strong>{{ transactionToDelete?.description }}</strong>.
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar la transacción?
        </p>
      </template>

      <template #footer>
        <UButton
          variant="ghost"
          color="neutral"
          label="Cancelar"
          @click="isDeleteDialogOpen = false"
        />
        <UButton
          color="error"
          variant="soft"
          label="Sí, borrar transacción"
          :loading="isDeleting"
          @click="deleteTransaction"
        />
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
