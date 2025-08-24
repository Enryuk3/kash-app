<script setup lang="ts">
// const route = useRoute()
const isMenuOpen = ref(false)

// const navItems = [
//   { label: 'Inicio', to: '/#inicio' },
//   { label: 'Características', to: '/#caracteristicas' },
//   { label: 'Cómo funciona', to: '/#como-funciona' },
//   { label: 'Contacto', to: '/#contacto' },
// ]

// function isActive(path: string) {
//   return route.hash === path
// }
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-default bg-default/75 backdrop-blur-sm">
    <div class="max-w-[var(--ui-container)] mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <UButton to="/" class="flex items-center space-x-2" variant="link">
          <UIcon name="i-tabler-coins" class="w-8 h-8 text-primary" />
          <span class="text-2xl font-bold text-default">Kash</span>
        </UButton>

        <!-- Desktop Navigation -->
        <!-- <nav class="hidden md:flex items-center space-x-4">
          <a
            v-for="item in navItems"
            :key="item.to"
            :href="item.to"
            class="px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md"
            :class="isActive(item.to)
              ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/30'
              : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'"
          >
            {{ item.label }}
          </a>
        </nav> -->

        <!-- Right side actions -->
        <div class="flex items-center gap-3">
          <AppThemeToggle />
          <AuthButton />
          <!-- Mobile menu button -->
          <UButton
            color="neutral"
            variant="ghost"
            :icon="isMenuOpen ? 'i-tabler-x' : 'i-tabler-menu-deep'"
            class="md:hidden"
            @click="isMenuOpen = !isMenuOpen"
          />
        </div>
      </div>

      <!-- Mobile menu -->
      <!-- <div v-if="isMenuOpen" class="md:hidden py-2">
        <div class="space-y-1">
          <a
            v-for="item in navItems"
            :key="`mobile-${item.to}`"
            :href="item.to"
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="isActive(item.to)
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
            @click="isMenuOpen = false"
          >
            {{ item.label }}
          </a>
          <div class="pt-2 border-t border-gray-200 dark:border-gray-800 mt-2 space-y-2">
            <AuthButton block />
          </div>
        </div>
      </div> -->
    </div>
  </header>
</template>
