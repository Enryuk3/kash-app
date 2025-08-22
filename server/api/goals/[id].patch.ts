import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const goalId = event.context.params?.id

  if (!goalId) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'ID de objetivo no proporcionado',
    }))
  }

  const result = await readValidatedBody(event, goalSchema.partial().safeParse)

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

    const { targetDate, ...restData } = result.data

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        ...restData,
        targetDate: targetDate ? new Date(targetDate) : null,
      },
    })

    return { statusCode: 200, data: updatedGoal }
  }
  catch (error) {
    console.error('Error al actualizar el objetivo:', error)

    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar el objetivo',
    }))
  }
})
