import type { AuthUser } from '~/lib/auth'

declare module 'h3' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user: AuthUser
  }
}
