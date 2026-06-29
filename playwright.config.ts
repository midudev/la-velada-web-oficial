import { defineConfig, devices } from '@playwright/test'

const PORT = 4321
const BASE_URL = `http://localhost:${PORT}`

// Variables mínimas para que el dev server arranque sin servicios externos.
// Los tests E2E solo cubren rutas que NO consultan Turso ni OAuth (home,
// boxeadores, combates, artistas, 404). `/pronosticos` se excluye a propósito
// porque renderiza en el servidor con datos de Turso. El esquema `file:` basta
// para construir el cliente libSQL sin que se conecte a ninguna base real.
const E2E_ENV = {
  TURSO_DATABASE_URL: 'file:./e2e-local.db',
  TURSO_AUTH_TOKEN: '',
  BETTER_AUTH_SECRET: 'e2e-secret-0123456789abcdef0123456789',
  BETTER_AUTH_URL: BASE_URL,
}

export default defineConfig({
  testDir: './e2e',
  // Precalienta las rutas (compilación on-demand de Astro dev) antes de lanzar
  // los tests, evitando fallos intermitentes al arrancar en paralelo en frío.
  globalSetup: './e2e/global-setup.ts',
  // En serie a propósito: el servidor de `astro dev` compila rutas y módulos de
  // cliente bajo demanda, y al martillearlo en paralelo en frío genera overlays
  // de error de Vite transitorios que vuelven los tests intermitentes. Un único
  // worker es determinista y la suite sigue corriendo en ~30s.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm dev --port 4321',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: E2E_ENV,
  },
})
