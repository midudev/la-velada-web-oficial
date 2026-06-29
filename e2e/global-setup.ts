import { BASE_URL } from './base-url'

// Astro compila cada ruta la primera vez que se solicita en modo dev. Si los
// tests arrancan en paralelo contra un servidor "en frío", esa compilación
// simultánea puede servir DOM transitorios y provocar fallos intermitentes.
// Precalentamos las rutas cubiertas para que la compilación ya esté hecha
// cuando empiezan los tests, manteniendo así el paralelismo sin flakiness.
const ROUTES_TO_WARM = [
  '/',
  '/boxeadores',
  '/combates',
  '/artistas',
  '/combate/plex-vs-fernanfloo',
  '/boxeadores/plex',
  '/ruta-inexistente-para-404',
]

export default async function globalSetup() {
  await Promise.all(
    ROUTES_TO_WARM.map((route) =>
      fetch(`${BASE_URL}${route}`).catch(() => {
        // Una ruta que falle al precalentar no debe abortar la suite; el test
        // correspondiente reportará el problema real con su propio contexto.
      }),
    ),
  )
}
