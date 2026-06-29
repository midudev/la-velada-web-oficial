import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Tests de lógica pura y de integridad de datos. No necesitan el runtime de
// Astro: solo se cubren módulos sin dependencias de `astro:assets`, por lo que
// basta con resolver el alias `@` igual que en `tsconfig.json`.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
