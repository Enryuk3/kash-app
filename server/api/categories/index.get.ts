import { findCategories } from '~/lib/queries/category'

export default defineAuthenticatedEventHandler(async (event) => {
  return findCategories(event.context.user.id)
})
