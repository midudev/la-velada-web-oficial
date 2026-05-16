import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4333'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/header-nav-visual.spec.ts',
  workers: 1,
  retries: 0,
  reporter: 'list',
  outputDir: 'test-results/capture',
  use: {
    baseURL,
    trace: 'off',
    video: {
      mode: 'on',
      size: { width: 2560, height: 1440 },
    },
  },
  projects: [
    {
      name: 'visual-capture',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
