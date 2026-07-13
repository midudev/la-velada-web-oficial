// Fuente única de la base URL de los tests E2E, compartida entre
// `playwright.config.ts` (webServer + baseURL) y `global-setup.ts`, para que el
// puerto no pueda quedar desincronizado entre ambos.
export const PORT = 4321
export const BASE_URL = `http://localhost:${PORT}`
