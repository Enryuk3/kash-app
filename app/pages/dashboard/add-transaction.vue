<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'

type Schema = z.output<typeof transactionSchema>

const { $csrfFetch } = useNuxtApp()
const toast = useToast()
const categoriesStore = useCategoriesStore()

const state = reactive<Partial<Schema>>({
  type: 'expense',
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0],
  categoryId: '',
})

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

const isCategoryFormOpen = ref(false)
const isSavingCategory = ref(false)

const newCategoryName = ref('')
const isSubmitting = ref(false)

// Limpiar categoryId cuando cambie el tipo de transacción
watch(() => state.type, (newType, oldType) => {
  if (newType !== oldType) {
    state.categoryId = ''
  }
})

// Categorías filtradas por tipo (asegurando que type no sea undefined)
const filteredCategories = computed(() =>
  categoriesStore.getCategoriesByType(state.type || 'expense'),
)

// Items para el select con categorías filtradas
const categoryItems = computed(() =>
  filteredCategories.value.map(category => ({
    label: category.name,
    value: category.id,
    icon: category.icon || 'i-tabler-tag',
  })),
)

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

// Crear categoría
async function createCategory() {
  if (!newCategoryName.value || !state.type)
    return

  isSavingCategory.value = true
  try {
    const newCategory = await categoriesStore.createCategory(
      newCategoryName.value,
      state.type,
    )
    state.categoryId = newCategory.id
    newCategoryName.value = ''
    isCategoryFormOpen.value = false

    toast.add({
      title: 'Categoría creada',
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'No se pudo crear la categoría',
      color: 'error',
    })
  }
  finally {
    isSavingCategory.value = false
  }
}

// Enviar formulario
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true

  try {
    await $csrfFetch('/api/transactions', {
      method: 'POST',
      body: event.data,
    })

    toast.add({
      title: '¡Éxito!',
      description: 'La transacción se ha guardado correctamente.',
      color: 'success',
      icon: 'i-tabler-circle-check',
    })

    // Reset formulario
    state.description = ''
    state.amount = 0
    state.date = new Date().toISOString().split('T')[0]

    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1000)
  }
  catch (error) {
    console.error('Error al guardar transacción:', error)

    const errorMessage = error instanceof Error
      ? error.message
      : 'Error al guardar la transacción'

    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'error',
      icon: 'i-tabler-alert-circle',
    })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto px-4 py-8">
    <!-- Encabezado con botón de volver -->
    <div class="flex items-center gap-4 mb-8">
      <UButton
        icon="i-tabler-arrow-left"
        color="neutral"
        variant="ghost"
        to="/dashboard"
        class="-ml-2"
      />
      <div>
        <h2 class="text-2xl font-bold">
          {{ state.type === 'expense' ? 'Nuevo Gasto' : 'Nuevo Ingreso' }}
        </h2>
        <p class="text-sm text-muted">
          Completa los detalles de la transacción
        </p>
      </div>
    </div>

    <UForm
      :schema="transactionSchema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <!-- Monto -->
      <UFormField label="Monto" name="amount">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            S/
          </span>
          <UInput
            v-model="state.amount"
            size="xl"
            type="number"
            step="0.01"
            min="0"
            placeholder="150,30"
            class="w-full pl-8 text-2xl font-semibold"
            inputmode="decimal"
          />
        </div>
      </UFormField>

      <!-- Tipo de Transacción -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <UFormField label="Tipo" name="type">
            <USelectMenu
              v-model="state.type"
              :items="transactionTypes"
              value-key="value"
              class="w-full"
              :ui-menu="{ select: 'flex items-center gap-2' }"
            >
              <template #leading>
                <UIcon
                  :name="transactionTypes.find(t => t.value === state.type)?.icon ?? 'i-tabler-question-mark'"
                  :class="{
                    'text-error': state.type === 'expense',
                    'text-success': state.type === 'income',
                    'text-gray-500': !state.type,
                  }"
                />
              </template>
            </USelectMenu>
          </UFormField>
        </div>

        <!-- Fecha -->
        <div>
          <UFormField label="Fecha" name="date">
            <UInput
              v-model="state.date"
              type="date"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <!-- Categoría -->
      <UFormField
        label="Categoría"
        name="categoryId"
        :help="`${filteredCategories.length} categorías disponibles`"
      >
        <div class="space-y-2">
          <div class="flex gap-2">
            <USelectMenu
              v-model="state.categoryId"
              :items="categoryItems"
              placeholder="Selecciona una categoría"
              value-key="value"
              class="w-full"
              :icon="categoryItems.find(c => c.value === state.categoryId)?.icon || 'i-tabler-tag'"
              :ui-menu="{ select: 'flex items-center gap-2' }"
            />

            <UButton
              :icon="isCategoryFormOpen ? 'i-tabler-x' : 'i-tabler-plus'"
              color="neutral"
              variant="outline"
              :disabled="categoriesStore.isLoading"
              @click="isCategoryFormOpen = !isCategoryFormOpen"
            />
          </div>

          <!-- Formulario para nueva categoría -->
          <div v-if="isCategoryFormOpen" class="mt-2 inline-flex gap-2">
            <UInput
              v-model="newCategoryName"
              placeholder="Nombre de la categoría"
              class="flex-1"
              icon="i-tabler-tag"
              autofocus
              @keyup.enter="createCategory"
            />
            <UButton
              icon="i-tabler-check"
              color="primary"
              label="Crear"
              :loading="isSavingCategory"
              @click="createCategory"
            />
          </div>
        </div>
      </UFormField>

      <!-- Descripción -->
      <UFormField label="Notas" name="description">
        <UTextarea
          v-model="state.description"
          icon="i-tabler-notes"
          placeholder="Añade una descripción o notas sobre esta transacción"
          :rows="2"
          class="w-full"
        />
      </UFormField>

      <!-- Botón de envío -->
      <UButton
        type="submit"
        :loading="isSubmitting"
        size="lg"
        class="w-full justify-center mt-8"
        :label="state.type === 'expense' ? 'Registrar Gasto' : 'Registrar Ingreso'"
        :icon="state.type === 'expense' ? 'i-tabler-arrow-down' : 'i-tabler-arrow-up'"
        :color="state.type === 'expense' ? 'error' : 'success'"
      />
    </UForm>
  </div>
</template>

<!-- <style scoped>
/* Animación para el formulario de nueva categoría */
.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> -->
