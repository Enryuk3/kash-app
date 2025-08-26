import { deleteTransactionById } from '~/lib/queries/transaction'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string

  const deleted = await deleteTransactionById(id, event.context.user.id)

  if (deleted.count === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Transacción no encontrada',
    })
  }

  setResponseStatus(event, 204)
})
