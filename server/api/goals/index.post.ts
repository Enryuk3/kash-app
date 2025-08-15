import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, goalSchema.safeParse)

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
    const goal = await prisma.goal.create({
      data: {
        ...result.data,
        userId: event.context.user.id,
        isCompleted: false,
      },
    })

    return { statusCode: 201, data: goal }
  }
  catch (error) {
    console.error('Error al crear el objetivo:', error)

    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Error al procesar el objetivo',
    }))
  }
})
