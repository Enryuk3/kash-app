import { findTransactions } from '~/lib/queries/transaction'

export default defineAuthenticatedEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return findTransactions(event.context.user.id)
})
