import { findGoals } from '~/lib/queries/goal'

export default defineAuthenticatedEventHandler(async (event) => {
  return findGoals(event.context.user.id)
})
