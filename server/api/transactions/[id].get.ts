import { findTransactionById } from '~/lib/queries/transaction'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  const transaction = await findTransactionById(id, event.context.user.id)

  if (!transaction) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: 'ID no encontrado',
    }))
  }

  return transaction
})
