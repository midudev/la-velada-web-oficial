import { auth } from '@/lib/auth'
import type { APIRoute } from 'astro'

export const ALL: APIRoute = async (ctx) => {
  return auth.handler(ctx.request)
}
