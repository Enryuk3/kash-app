import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string

  const result = await readValidatedBody(event, transactionSchema.safeParse)

  if (!result.success) {
    return sendZodError(event, result.error)
  }

  const { categoryId, ...transactionData } = result.data

  try {
    // Verificar que la transacción existe y pertenece al usuario
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        category: {
          userId: event.context.user.id,
        },
      },
    })

    if (!existingTransaction) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Transacción no encontrada',
      })
    }

    // Verificar que la categoría existe y pertenece al usuario
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: event.context.user.id,
        },
      })

      if (!category) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Categoría no encontrada o no autorizada',
          data: { field: 'categoryId' },
        })
      }
    }

    // Actualizar la transacción
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...transactionData,
        date: new Date(transactionData.date),
        ...(categoryId && { categoryId }),
      },
      include: { category: true },
    })

    return updatedTransaction
  }
  catch (error) {
    console.error('Error al actualizar transacción:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar la transacción',
    })
  }
})
