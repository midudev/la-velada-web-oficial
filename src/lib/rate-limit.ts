/**
 * Rate limiter en memoria con ventana deslizante, pensado para frenar el abuso
 * de un usuario autenticado que envíe peticiones en bucle (p. ej. votos en
 * /api/predictions).
 *
 * Guarda, por clave (normalmente el userId), las marcas de tiempo de las
 * peticiones recientes y solo cuenta las que caen dentro de la ventana. Es
 * deliberadamente sencillo y sin dependencias.
 *
 * Limitación conocida: en un despliegue serverless el estado vive en cada
 * instancia, así que el límite es por instancia, no global. Aun así mitiga muy
 * bien el caso real (las ráfagas de un mismo cliente suelen reutilizar la misma
 * instancia caliente). Si en el futuro hace falta un límite global y exacto,
 * el sitio natural para migrar es a un store compartido (Redis/Upstash) detrás
 * de esta misma interfaz.
 */

export interface RateLimitOptions {
  /** Peticiones permitidas dentro de la ventana. */
  limit: number
  /** Tamaño de la ventana en milisegundos. */
  windowMs: number
}

export interface RateLimitResult {
  /** `true` si la petición está dentro del límite. */
  allowed: boolean
  /** Peticiones que aún se pueden hacer en la ventana actual. */
  remaining: number
  /** Segundos hasta que se libere un hueco (0 cuando `allowed` es `true`). */
  retryAfter: number
}

const hitsByKey = new Map<string, number[]>()

// Evita que el Map crezca sin control con claves que ya no tienen peticiones
// vivas: cada cierto tiempo barremos las entradas caducadas.
let lastSweep = Date.now()

function sweepExpired(now: number, windowMs: number): void {
  if (now - lastSweep < windowMs) return
  lastSweep = now

  for (const [key, timestamps] of hitsByKey) {
    const fresh = timestamps.filter((timestamp) => timestamp > now - windowMs)
    if (fresh.length === 0) {
      hitsByKey.delete(key)
    } else {
      hitsByKey.set(key, fresh)
    }
  }
}

/**
 * Registra una petición para `key` y dice si está dentro del límite.
 *
 * Cada llamada consume un hueco cuando se permite; las peticiones bloqueadas no
 * cuentan para no extender la ventana de forma indefinida ante un bucle.
 */
export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  sweepExpired(now, windowMs)

  const windowStart = now - windowMs
  const recentHits = (hitsByKey.get(key) ?? []).filter((timestamp) => timestamp > windowStart)

  if (recentHits.length >= limit) {
    hitsByKey.set(key, recentHits)
    const oldestHit = recentHits[0]
    const retryAfter = Math.max(1, Math.ceil((oldestHit + windowMs - now) / 1000))

    return { allowed: false, remaining: 0, retryAfter }
  }

  recentHits.push(now)
  hitsByKey.set(key, recentHits)

  return { allowed: true, remaining: limit - recentHits.length, retryAfter: 0 }
}
