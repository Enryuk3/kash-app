import { deleteGoalById } from '~/lib/queries/goal'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  const deleted = await deleteGoalById(id, event.context.user.id)

  if (deleted.count === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Objetivo no encontrado o no autorizado',
    })
  }

  setResponseStatus(event, 204)
})
