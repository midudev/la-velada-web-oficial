import { getSessionFromHeaders } from "@/lib/auth"
import { defineMiddleware } from "astro:middleware"

// Expira en el navegador las cookies de better-auth que viajaban en la petición.
// Se usa cuando la sesión no se pudo leer (cookie corrupta/incompatible de un
// despliegue anterior): como better-auth no reescribe esas cookies, las dejamos
// caducadas para que el siguiente inicio de sesión parta de cero. Recorremos los
// nombres reales enviados por el navegador para cubrir prefijos (`__Secure-`) y
// los posibles fragmentos (`.0`, `.1`) de cookies troceadas.
function expireBetterAuthCookies(request: Request, response: Response) {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return

  for (const part of cookieHeader.split(";")) {
    const name = part.split("=")[0]?.trim()
    if (!name || !name.includes("better-auth")) continue

    response.headers.append(
      "Set-Cookie",
      `${name}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    )
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Prerendered routes (e.g. combates, 404) are built statically and have no
  // real request, so reading `context.request.headers` there is meaningless
  // and makes Astro emit a warning. Skip the session lookup for them.
  if (context.isPrerendered) {
    context.locals.user = null
    context.locals.session = null
    return next()
  }

  const { session, failed } = await getSessionFromHeaders(context.request.headers)

  context.locals.user = session?.user ?? null
  context.locals.session = session?.session ?? null

  const response = await next()

  // Si la cookie de sesión era ilegible, la caducamos para que el navegador se
  // recupere. No tocamos las rutas de auth: ahí better-auth gestiona sus propias
  // cookies y no queremos pisar sus `Set-Cookie`.
  if (failed && !context.url.pathname.startsWith("/api/auth")) {
    try {
      expireBetterAuthCookies(context.request, response)
    } catch (error) {
      console.error("No se pudieron limpiar las cookies de better-auth:", error)
    }
  }

  return response
})
