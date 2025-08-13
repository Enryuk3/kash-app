import { findTransactions } from '~/lib/queries/transaction'

export default defineAuthenticatedEventHandler(async (event) => {
  return findTransactions(event.context.user.id)
})
