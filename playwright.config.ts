import { defineConfig } from '@playwright/test'

const isCI = !!process.env.CI
const baseURL = isCI ? 'http://localhost:4321' : 'https://localhost:4321'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 30000,
    ignoreHTTPSErrors: true,
    env: {
      TURSO_DATABASE_URL: 'file:local.db',
      TURSO_AUTH_TOKEN: '',
      TWITCH_CLIENT_ID: 'placeholder',
      TWITCH_CLIENT_SECRET: 'placeholder',
      AUTH_SECRET: 'e2e-test-secret',
      AUTH_TRUST_HOST: 'true',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
