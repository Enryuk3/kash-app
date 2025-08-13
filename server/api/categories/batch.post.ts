import prisma from '~/lib/db'

const defaultCategories = [
  // Ingresos
  { name: 'Salario', type: 'income', icon: 'i-tabler-cash-banknote' },
  { name: 'Freelance', type: 'income', icon: 'i-tabler-device-laptop' },
  { name: 'Inversiones', type: 'income', icon: 'i-tabler-chart-line' },
  { name: 'Regalos', type: 'income', icon: 'i-tabler-gift' },
  { name: 'Otros ingresos', type: 'income', icon: 'i-tabler-wallet' },

  // Gastos
  { name: 'Comida', type: 'expense', icon: 'i-tabler-shopping-cart' },
  { name: 'Transporte', type: 'expense', icon: 'i-tabler-bus' },
  { name: 'Vivienda', type: 'expense', icon: 'i-tabler-home' },
  { name: 'Servicios', type: 'expense', icon: 'i-tabler-receipt' },
  { name: 'Entretenimiento', type: 'expense', icon: 'i-tabler-movie' },
  { name: 'Salud', type: 'expense', icon: 'i-tabler-heartbeat' },
  { name: 'Educación', type: 'expense', icon: 'i-tabler-school' },
  { name: 'Ropa', type: 'expense', icon: 'i-tabler-shirt' },
  { name: 'Viajes', type: 'expense', icon: 'i-tabler-plane' },
  { name: 'Otros gastos', type: 'expense', icon: 'i-tabler-tags' },
]

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id
  const existingCount = await prisma.category.count({
    where: { userId },
  })

  if (existingCount > 0) {
    return await prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
        icon: true,
        color: true,
      },
    })
  }

  try {
    const validatedCategories = defaultCategories.map(category =>
      categorySchema.parse(category),
    )

    await prisma.category.createMany({
      data: validatedCategories.map(category => ({
        ...category,
        userId,
      })),
      skipDuplicates: true,
    })

    // Devolver las categorías recién creadas
    return await prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
        icon: true,
        color: true,
      },
    })
  }
  catch (error) {
    console.error('Error al crear categorías predeterminadas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al crear las categorías predeterminadas',
    })
  }
})
