<script setup lang="ts">
import type { Goal } from '@prisma/client'
import type { GoalFormData } from '#shared/utils/goal'

const { data: goals, status, refresh } = await useFetch<Goal[]>('/api/goals', {
  lazy: true,
})

const { $csrfFetch } = useNuxtApp()
const toast = useToast()
const isOpen = ref(false)
const isEditing = ref(false)

/** Estado del modal/form */
type GoalFormState = {
  id: string | null
  name: string
  description: string | null
  targetAmount: number
  currentAmount: number
  targetDate: string | null
  isCompleted: boolean
}

const formState = reactive<GoalFormState>({
  id: null,
  name: '',
  description: null,
  targetAmount: 0,
  currentAmount: 0,
  targetDate: null,
  isCompleted: false,
})

function resetForm() {
  formState.id = null
  formState.name = ''
  formState.description = null
  formState.targetAmount = 0
  formState.currentAmount = 0
  formState.targetDate = null
  formState.isCompleted = false
}

async function handleFormSubmit(payload: GoalFormData) {
  try {
    const hasId = !!formState.id
    const url = hasId ? `/api/goals/${formState.id}` : '/api/goals'
    const method = hasId ? 'PATCH' : 'POST'
    await $csrfFetch(url, {
      method,
      body: payload,
    })

    toast.add({
      title: hasId ? 'Objetivo actualizado' : 'Objetivo creado',
      description: hasId
        ? 'El objetivo se ha actualizado correctamente'
        : 'El objetivo se ha creado correctamente',
      icon: 'i-tabler-circle-check',
      color: 'success',
    })

    await refresh()
    isOpen.value = false
    resetForm()
  }
  catch (error) {
    console.error('Error al guardar el objetivo:', error)
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error al guardar el objetivo',
      description: err?.data?.message ?? 'Intente nuevamente',
      color: 'error',
    })
  }
}

function confirmAction(message: string): Promise<boolean> {
  // eslint-disable-next-line no-alert
  return Promise.resolve(window.confirm(message))
}

async function handleDelete(id: string) {
  const confirmed = await confirmAction('¿Estás seguro de que quieres eliminar este objetivo?')
  if (!confirmed)
    return

  try {
    await $fetch(`/api/goals/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Objetivo eliminado correctamente', color: 'success' })

    await refresh()
  }
  catch (error) {
    console.error('Error al eliminar el objetivo:', error)
    toast.add({ title: 'Error al eliminar el objetivo', color: 'error' })
  }
}

function handleEdit(goal: Goal) {
  const formGoal: GoalFormData = {
    name: goal.name ?? '',
    description: goal.description ?? null,
    targetAmount: goal.targetAmount ?? 0,
    currentAmount: goal.currentAmount ?? 0,
    targetDate: goal.targetDate
      ? new Date(goal.targetDate).toISOString().split('T')[0]
      : null,
  }

  formState.id = goal.id
  Object.assign(formState, formGoal)

  isEditing.value = true
  isOpen.value = true
}

function handleCreate() {
  resetForm()
  isEditing.value = false
  isOpen.value = true
}
</script>

<template>
  <div class="max-w-[var(--ui-container)] mx-auto px-4 py-8 space-y-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Mis objetivos de ahorro
      </h1>
      <UButton
        icon="i-tabler-plus"
        label="Nuevo objetivo"
        color="primary"
        class="mb-4"
        @click="handleCreate"
      />
    </div>

    <GoalList
      :goals="goals || []"
      :loading="status === 'pending'"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <UModal
      v-model:open="isOpen"
      :title="isEditing ? 'Editar objetivo' : 'Nuevo objetivo'"
      :dismissible="status !== 'pending'"
      description="Objetivo que se puede alcanzar en un plazo determinado"
    >
      <template #body>
        <GoalForm
          :initial-data="{
            name: formState.name,
            description: formState.description,
            targetAmount: formState.targetAmount,
            currentAmount: formState.currentAmount,
            targetDate: formState.targetDate,
          }"
          :is-editing="isEditing"
          @submit="handleFormSubmit"
        />
      </template>
    </UModal>
  </div>
</template>
