import { findTransactions } from '~/lib/queries/transaction'

export default defineAuthenticatedEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 320))
  return findTransactions(event.context.user.id)
})
