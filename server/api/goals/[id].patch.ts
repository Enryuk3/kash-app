import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string

  const result = await readValidatedBody(event, goalSchema.partial().safeParse)

  if (!result.success) {
    return sendZodError(event, result.error)
  }

  try {
    // Verificar que el objetivo pertenece al usuario
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: event.context.user.id,
      },
    })

    if (!existingGoal) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Objetivo no encontrado o no autorizado',
      })
    }

    const { targetDate, ...restData } = result.data

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        ...restData,
        targetDate: targetDate ? new Date(targetDate) : null,
      },
    })

    return { statusCode: 200, data: updatedGoal }
  }
  catch (error) {
    console.error('Error al actualizar el objetivo:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar el objetivo',
    })
  }
})
