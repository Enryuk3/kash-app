import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
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
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: event.context.user.id,
      },
      select: { id: true },
    })

    if (!category) {
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: 'Categoría no encontrada o no autorizada',
        data: { field: 'categoryId' },
      }))
    }

    const transaction = await prisma.transaction.create({
      data: {
        ...transactionData,
        date: new Date(transactionData.date),
        userId: event.context.user.id,
        categoryId,
      },
      include: { category: true },
    })

    return { statusCode: 201, data: transaction }
  }
  catch (error) {
    console.error('Error al crear la transacción:', error)

    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2003') {
        return sendError(event, createError({
          statusCode: 400,
          statusMessage: 'Categoría no válida',
          data: { field: 'categoryId' },
        }))
      }
    }

    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Error al procesar la transacción',
    }))
  }
})
