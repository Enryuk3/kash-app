<script setup lang="ts">
import type { Goal } from '@prisma/client'

defineProps<{
  goals: Goal[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', goal: Goal): void
  (e: 'delete', id: string): void
}>()

function formatDate(date?: string | Date | null) {
  if (!date)
    return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-4 @container">
    <div v-if="loading" class="space-y-4">
      <USkeleton v-for="i in 3" :key="`skeleton-${i}`" class="h-24 w-full" />
    </div>

    <div v-else-if="goals.length > 0" class="grid gap-4 grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3">
      <UCard
        v-for="goal in goals"
        :key="goal.id"
        @click="emit('edit', goal)"
      >
        <!-- Header -->
        <div>
          <h3 class="text-base font-semibold">
            {{ goal.name }}
          </h3>
          <p v-if="goal.description" class="text-sm text-muted mt-1">
            {{ goal.description }}
          </p>
        </div>

        <!-- Progress -->
        <div class="mt-4">
          <UProgress
            :model-value="goal.currentAmount"
            :max="goal.targetAmount"
            :color="goal.isCompleted ? 'success' : 'primary'"
            size="md"
          />
          <div class="flex justify-between text-sm text-muted">
            <span>S/. {{ goal.currentAmount.toFixed(2) }}</span>
            <span>Meta: S/. {{ goal.targetAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Secondary info -->
        <div class="flex items-center justify-between mt-3">
          <div>
            <UBadge
              v-if="goal.targetDate"
              color="neutral"
              variant="soft"
              class="inline-flex items-center"
            >
              <UIcon name="i-tabler-calendar" class="h-3 w-3 mr-1" />
              {{ formatDate(goal.targetDate) }}
            </UBadge>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <UButton
              icon="i-tabler-edit"
              size="xs"
              color="primary"
              variant="soft"
              @click="emit('edit', goal)"
            >
              Editar
            </UButton>
            <UButton
              icon="i-tabler-trash"
              size="xs"
              color="error"
              variant="soft"
              @click.stop="emit('delete', goal.id)"
            >
              Eliminar
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <div
      v-else
      class="text-center py-12 border border-dashed border-muted rounded-lg"
    >
      <UIcon name="i-tabler-cash" class="w-10 h-10 mx-auto mb-4" />
      <h3 class="text-lg font-medium mb-1">
        No tienes objetivos aún
      </h3>
      <p class="text-muted mb-4">
        Comienza creando tu primer objetivo de ahorro
      </p>
      <UButton icon="i-tabler-plus" label="Crear Objetivo" @click="emit('create')" />
    </div>
  </div>
</template>
