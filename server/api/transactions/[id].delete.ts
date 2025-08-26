import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string

  if (!id) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'ID de transacción no proporcionado',
    }))
  }

  try {
    // Verificar que la transacción pertenece al usuario actual
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        category: {
          userId: event.context.user.id,
        },
      },
    })

    if (!transaction) {
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: 'Transacción no encontrada',
      }))
    }

    // Eliminar la transacción
    await prisma.transaction.delete({
      where: { id },
    })

    return { success: true }
  }
  catch (error) {
    console.error('Error al eliminar transacción:', error)
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Error al eliminar la transacción',
    }))
  }
})
