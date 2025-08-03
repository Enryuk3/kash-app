import { auth } from '~/lib/auth'

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})
// https://youtu.be/DK93dqmJJYg?si=NfFv3Dw2lrCaB9dJ&t=6140
