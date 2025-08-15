import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        userId: event.context.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { statusCode: 200, data: goals }
  } catch (error) {
    console.error('Error al obtener los objetivos:', error)
    
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los objetivos',
    }))
  }
})
