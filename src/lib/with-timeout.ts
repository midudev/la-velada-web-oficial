/**
 * Envuelve una promesa con un tiempo máximo. Si la operación no termina a
 * tiempo (p. ej. Turso saturado), rechaza con un error tipado para que el
 * caller pueda degradar (caché stale / 503) en lugar de colgar la función
 * serverless hasta el timeout de Vercel.
 */
export class TimeoutError extends Error {
  constructor(message = 'Operación agotó el tiempo de espera') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number, message?: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(message))
    }, ms)
  })

  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer)
  })
}
