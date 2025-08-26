import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = event.context.params?.id
  
  if (!id) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'ID de transacción no proporcionado',
    }))
  }

  const result = await readValidatedBody(event, transactionSchema.safeParse)

  if (!result.success) {
    const statusMessage = result.error.issues
      .map(issue => `${issue.path.join('')}: ${issue.message}`)
      .join('; ')

    const data = result.error.issues
      .reduce((errors, issue) => {
        errors[issue.path.join('')] = issue.message
        return errors
      }, {} as Record<string, string>)

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }))
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
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: 'Transacción no encontrada',
      }))
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
        return sendError(event, createError({
          statusCode: 404,
          statusMessage: 'Categoría no encontrada o no autorizada',
          data: { field: 'categoryId' },
        }))
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
  } catch (error) {
    console.error('Error al actualizar transacción:', error)
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar la transacción',
    }))
  }
})
