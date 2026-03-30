import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
    env: {
      TURSO_DATABASE_URL: 'libsql://placeholder.turso.io',
      TURSO_AUTH_TOKEN: 'placeholder',
      TWITCH_CLIENT_ID: 'placeholder',
      TWITCH_CLIENT_SECRET: 'placeholder',
      AUTH_SECRET: 'placeholder',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
