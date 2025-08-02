<script setup lang="ts">
const features = [
  {
    icon: 'i-tabler-wallet',
    title: 'Control Total',
    description: 'Maneja todos tus ingresos y gastos en un solo lugar',
  },
  {
    icon: 'i-tabler-chart-bar',
    title: 'Estadísticas',
    description: 'Visualiza tus finanzas con gráficos claros',
  },
  {
    icon: 'i-tabler-shield-check',
    title: 'Seguro',
    description: 'Tus datos financieros siempre protegidos',
  },
]
</script>

<template>
  <section id="inicio" class="relative overflow-hidden py-32 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 mb-6">
          <UIcon name="i-tabler-sparkles" class="w-4 h-4 mr-2" />
          <span>Controla tu dinero, controla tu vida</span>
        </div>

        <!-- Título principal optimizado para SEO -->
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Gestión Financiera Personal
          <span class="text-primary-500 block mt-2">Simple y Efectiva</span>
        </h1>

        <!-- Subtítulo descriptivo -->
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          Kash te ayuda a tomar el control de tu dinero. Registra gastos, establece presupuestos y alcanza tus metas financieras con nuestra herramienta intuitiva y segura.
        </p>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            size="xl"
            color="primary"
            variant="solid"
            label="Comenzar Gratis"
            icon="i-tabler-arrow-right"
            class="px-5"
          />
          <UButton
            size="xl"
            color="neutral"
            variant="outline"
            label="Explorar"
            icon="i-tabler:compass"
            class="px-5"
          />
        </div>

        <!-- Características -->
        <div class="mt-16 grid gap-8 md:grid-cols-3">
          <div v-for="(feature, index) in features" :key="index" class="text-left">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <UIcon :name="feature.icon" class="w-6 h-6" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ feature.title }}
                </h2>
                <p class="mt-1 text-gray-600 dark:text-gray-400">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
