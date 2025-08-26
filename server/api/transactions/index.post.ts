import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, transactionSchema.safeParse)

  if (!result.success) {
    return sendZodError(event, result.error)
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
      throw createError({
        statusCode: 404,
        statusMessage: 'Categoría no encontrada o no autorizada',
        data: { field: 'categoryId' },
      })
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
  catch (e) {
    console.error('Error al crear la transacción:', e)

    if (e && typeof e === 'object' && 'code' in e) {
      if (e.code === 'P2003') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Categoría no válida',
          data: { field: 'categoryId' },
        })
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al procesar la transacción',
    })
  }
})
