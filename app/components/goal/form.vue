<script setup lang="ts">
const props = defineProps<{
  initialData?: GoalFormData
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: GoalFormData): void
}>()

const form = reactive<GoalFormData>(
  props.initialData ?? {
    name: '',
    description: null,
    targetAmount: 0,
    currentAmount: 0,
    targetDate: null,
  },
)

function handleSubmit() {
  emit('submit', form)
}
</script>

<template>
  <UForm
    :state="form"
    :schema="goalSchema"
    class="space-y-10"
    @submit.prevent="handleSubmit"
  >
    <!-- Sección principal -->
    <div class="space-y-6">
      <UFormField name="name" label="Nombre" required>
        <UInput
          v-model="form.name"
          class="w-full text-lg font-medium"
          placeholder="(e.g: Ahorrar para viajar)"
        />
      </UFormField>

      <UFormField name="targetAmount" label="Meta" required>
        <UInput
          v-model="form.targetAmount"
          type="number"
          min="1"
          class="w-full"
          placeholder="1000"
        />
      </UFormField>
    </div>

    <!-- Secundario: progreso + fecha -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <UFormField name="currentAmount" label="Progreso actual">
        <UInput
          v-model="form.currentAmount"
          type="number"
          min="0"
          class="w-full"
          placeholder="Ahorro inicial"
        />
      </UFormField>

      <UFormField name="targetDate" label="Fecha objetivo">
        <UInput v-model="form.targetDate" type="date" class="w-full" />
      </UFormField>
    </div>

    <!-- Descripción -->
    <UFormField name="description" label="Descripción">
      <UTextarea
        v-model="form.description"
        class="w-full"
        placeholder="(e.g: Viajar a París)"
      />
    </UFormField>

    <!-- CTA -->
    <UButton
      type="submit"
      size="lg"
      block
      color="primary"
      :icon="isEditing ? 'i-tabler-pencil' : 'i-tabler-plus'"
      :label="isEditing ? 'Actualizar meta' : 'Guardar meta'"
    />
  </UForm>
</template>
