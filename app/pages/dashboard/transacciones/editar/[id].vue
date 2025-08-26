<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'

type Transaction = {
  id: string
  amount: number
  description: string
  date: string
  category: {
    id: string
    name: string
    type: 'income' | 'expense'
    icon?: string
  }
}

type Schema = z.output<typeof transactionSchema>

// Route and state
const route = useRoute()
const { id } = route.params
const { $csrfFetch } = useNuxtApp()
const toast = useToast()
const isSubmitting = ref(false)

// Form state
const form = reactive<Partial<Schema>>({
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0],
  categoryId: '',
  type: 'expense' as 'income' | 'expense',
})

// Fetch transaction and categories data
const { data: transaction, status, error } = await useFetch<Transaction>(`/api/transactions/${id}`, { lazy: true })
const categoriesStore = useCategoriesStore()

const transactionTypes = [
  {
    value: 'expense',
    label: 'Gasto',
    icon: 'i-tabler-trending-down',
    color: 'error',
  },
  {
    value: 'income',
    label: 'Ingreso',
    icon: 'i-tabler-trending-up',
    color: 'success',
  },
]
// Get filtered and formatted categories for the select component
const filteredCategories = computed(() =>
  categoriesStore.getCategoriesByType(form.type || 'expense'),
)

const categoryItems = computed(() =>
  filteredCategories.value.map(category => ({
    label: category.name,
    value: category.id,
    icon: category.icon || 'i-tabler-tag',
  })),
)

// Watch for transaction data to be loaded
watch(transaction, (newTransaction) => {
  if (newTransaction) {
    form.amount = newTransaction.amount
    form.description = newTransaction.description
    form.date = new Date(newTransaction.date).toISOString().split('T')[0]
    form.type = newTransaction.category.type
    form.categoryId = newTransaction.category.id
  }
}, { immediate: true })

// Clear category when type changes
watch(() => form.type, (newType, oldType) => {
  if (newType !== oldType) {
    form.categoryId = ''
  }
})

// Handle form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isSubmitting.value = true

    await $csrfFetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      body: event.data,
    })

    toast.add({
      title: 'Transacción actualizada',
      description: 'La transacción ha sido actualizada correctamente',
      icon: 'i-tabler-circle-check',
      color: 'success',
    })

    navigateTo('/dashboard/transacciones')
  }
  catch (error) {
    console.error('Error updating transaction:', error)
    toast.add({
      title: 'Error',
      description: 'No se pudo actualizar la transacción',
      icon: 'i-tabler-alert-circle',
      color: 'error',
    })
  }
  finally {
    isSubmitting.value = false
  }
}

// Cargar categorías al montar
onMounted(async () => {
  try {
    await categoriesStore.loadCategories()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'No se pudieron cargar las categorías',
      color: 'error',
      icon: 'i-tabler-alert-circle',
    })
  }
})
</script>

<template>
  <div class="max-w-lg mx-auto px-4 py-8">
    <div class="flex items-center gap-4 mb-8">
      <UButton
        icon="i-tabler-arrow-left"
        color="neutral"
        variant="ghost"
        to="/dashboard/transacciones"
        class="-ml-2"
      />
      <div>
        <h2 class="text-2xl font-bold">
          Editar Transacción
        </h2>
        <p class="text-sm text-muted">
          Actualiza los detalles de la transacción
        </p>
      </div>
    </div>

    <!-- Skeleton mientras se carga la transacción -->
    <div v-if="status === 'pending'" class="space-y-6">
      <div class="space-y-2">
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-12 w-full rounded-md" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-10 w-full rounded-md" />
        </div>
        <div class="space-y-2">
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-10 w-full rounded-md" />
        </div>
      </div>

      <div class="space-y-2">
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-10 w-full rounded-md" />
      </div>

      <div class="space-y-2">
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-20 w-full rounded-md" />
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <USkeleton class="h-10 w-24 rounded-md" />
        <USkeleton class="h-10 w-32 rounded-md" />
      </div>
    </div>

    <UForm
      v-if="transaction && status !== 'pending'"
      :state="form"
      :schema="transactionSchema"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField label="Monto" name="amount">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            S/
          </span>
          <UInput
            v-model.number="form.amount"
            size="xl"
            type="number"
            step="0.01"
            min="0"
            placeholder="150,30"
            required
            class="w-full pl-8 text-2xl font-semibold"
            inputmode="decimal"
          />
        </div>
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Tipo" name="type">
          <USelectMenu
            v-model="form.type"
            :items="transactionTypes"
            value-key="value"
            class="w-full"
            :ui-menu="{ select: 'flex items-center gap-2' }"
          >
            <template #leading>
              <UIcon
                :name="transactionTypes.find(t => t.value === form.type)?.icon ?? 'i-tabler-question-mark'"
                :class="{
                  'text-error': form.type === 'expense',
                  'text-success': form.type === 'income',
                  'text-gray-500': !form.type,
                }"
              />
            </template>
          </USelectMenu>
        </UFormField>
        <UFormField label="Fecha" name="date">
          <UInput
            v-model="form.date"
            class="w-full"
            type="date"
            required
          />
        </UFormField>
      </div>
      <UFormField
        label="Categoría"
        name="categoryId"
        required
        :help="`${filteredCategories.length} categorías disponibles`"
      >
        <USelectMenu
          v-model="form.categoryId"
          :items="categoryItems"
          placeholder="Selecciona una categoría"
          class="w-full"
          :searchable="false"
          :loading="!filteredCategories.length"
          :icon="categoryItems.find(c => c.value === form.categoryId)?.icon || 'i-tabler-tag'"
          value-key="value"
        />
      </UFormField>

      <UFormField label="Notas" name="description">
        <UTextarea
          v-model="form.description"
          icon="i-tabler-notes"
          placeholder="Añade una descripción o notas sobre esta transacción"
          :rows="2"
          class="w-full"
        />
      </UFormField>

      <div class="flex justify-end mt-8 gap-2">
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          :disabled="isSubmitting"
          to="/dashboard/transacciones"
        >
          Cancelar
        </UButton>
        <UButton
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          icon="i-tabler-device-floppy"
          label="Guardar cambios"
        />
      </div>
    </UForm>

    <UAlert
      v-if="error"
      color="neutral"
      icon="i-lucide-terminal"
      :title="error.statusMessage"
    />
  </div>
</template>
