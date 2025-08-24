import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const goalId = event.context.params?.id

  if (!goalId) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'ID de objetivo no proporcionado',
    }))
  }

  try {
    // Verificar que el objetivo pertenece al usuario
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: event.context.user.id,
      },
    })

    if (!existingGoal) {
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: 'Objetivo no encontrado o no autorizado',
      }))
    }

    await prisma.goal.delete({
      where: { id: goalId },
    })

    return { statusCode: 204 }
  }
  catch (error) {
    console.error('Error al eliminar el objetivo:', error)

    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Error al eliminar el objetivo',
    }))
  }
})
