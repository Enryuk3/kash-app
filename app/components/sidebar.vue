<script setup lang="ts">
const route = useRoute()

const isSidebarOpen = ref(true)
onMounted(() => {
  isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true'
})

const items = [
  {
    label: 'Resumen',
    icon: 'i-tabler-home',
    to: '/dashboard',
  },
  {
    label: 'Transacciones',
    icon: 'i-tabler-currency-dollar',
    to: '/dashboard/transacciones',
  },
  {
    label: 'Agregar Transacción',
    icon: 'i-tabler-circle-plus-filled',
    to: '/dashboard/add-transaction',
  },
]

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
  localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString())
}
</script>

<template>
  <aside class="sticky top-0 min-h-[calc(100vh-4rem)] border-r border-default transition-all duration-300" :class="{ 'w-16': !isSidebarOpen, 'w-64': isSidebarOpen }">
    <div class="p-2.5">
      <div class="flex" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }">
        <UButton
          :icon="isSidebarOpen ? 'i-tabler-chevron-left' : 'i-tabler-chevron-right'"
          variant="ghost"
          color="neutral"
          @click="toggleSidebar"
        />
      </div>
      <div class="space-y-1">
        <UTooltip
          v-for="item in items"
          :key="item.to"
          :text="!isSidebarOpen ? item.label : undefined"
          :disabled="isSidebarOpen"
          :content="{
            align: 'center',
            side: 'right',
            sideOffset: 8,
          }"
          arrow
        >
          <UButton
            :to="item.to"
            :icon="item.icon"
            :variant="route.path === item.to ? 'soft' : 'ghost'"
            :color="route.path === item.to ? 'primary' : 'neutral'"
            class="w-full"
          >
            <span
              class="transition-all duration-100 overflow-hidden whitespace-nowrap"
              :class="[isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0']"
            >
              {{ item.label }}
            </span>
          </UButton>
        </UTooltip>
        <hr class="my-3 border-default">
        <UTooltip
          :text="!isSidebarOpen ? 'Cerrar Sesión' : undefined"
          :disabled="isSidebarOpen"
          :content="{
            align: 'center',
            side: 'right',
            sideOffset: 8,
          }"
        >
          <UButton
            label="Cerrar Sesión"
            icon="i-tabler-logout-2"
            to="/sign-out"
            variant="ghost"
            color="neutral"
            class="w-full"
          />
        </UTooltip>
      </div>
    </div>
  </aside>
</template>
