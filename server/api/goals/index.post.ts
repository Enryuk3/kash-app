import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, goalSchema.safeParse)

  if (!result.success) {
    return sendZodError(event, result.error)
  }

  try {
    const { targetDate, ...restData } = result.data

    const goal = await prisma.goal.create({
      data: {
        ...restData,
        targetDate: targetDate ? new Date(targetDate) : null,
        userId: event.context.user.id,
        isCompleted: false,
      },
    })

    return { statusCode: 201, data: goal }
  }
  catch (error) {
    console.error('Error al crear el objetivo:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al procesar el objetivo',
    })
  }
})
