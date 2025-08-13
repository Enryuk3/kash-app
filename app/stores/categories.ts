export type Category = {
  id: string
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
}

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function loadCategories() {
    isLoading.value = true
    error.value = null
    try {
      const userCategories = await $fetch<Category[]>('/api/categories')

      if (!userCategories?.length) {
        await $fetch('/api/categories/batch', { method: 'POST' })
        const updatedCategories = await $fetch<Category[]>('/api/categories')
        categories.value = updatedCategories
        return
      }

      categories.value = userCategories
    }
    catch (err) {
      console.error('Error loading categories:', err)
      error.value = err instanceof Error ? err : new Error('Error al cargar categorías')
      throw error.value
    }
    finally {
      isLoading.value = false
    }
  }

  async function createCategory(name: string, type: 'income' | 'expense') {
    try {
      const { data: createdCategory } = await $fetch<{ statusCode: number, data: Category }>('/api/categories', {
        method: 'POST',
        body: { name: name.trim(), type },
      })
      categories.value.push(createdCategory)
      return createdCategory
    }
    catch (err: any) {
      console.error('Error creating category:', err)
      if (err.statusCode === 409) {
        throw new Error('Ya existe una categoría con este nombre')
      }
      throw err
    }
  }

  const getCategoriesByType = (type: 'income' | 'expense') =>
    categories.value.filter(cat => cat.type === type)

  return {
    categories,
    isLoading,
    error,
    loadCategories,
    createCategory,
    getCategoriesByType,
  }
})
