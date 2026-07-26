import { createClient, type Client } from '@libsql/client/web'

let client: Client | null = null

function getTursoClient(): Client {
  if (client) return client

  const url = import.meta.env.TURSO_DATABASE_URL
  const authToken = import.meta.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error('TURSO_DATABASE_URL no está configurada')
  }

  client = createClient({ url, authToken })
  return client
}

// Proxy lazy: evita tumbar el import del módulo cuando faltan env vars en
// builds/dev locales. El fallo ocurre al primer uso y queda capturable.
export const turso: Client = new Proxy({} as Client, {
  get(_target, property, _receiver) {
    const value = Reflect.get(getTursoClient(), property, getTursoClient())
    return typeof value === 'function' ? value.bind(getTursoClient()) : value
  },
})
