import { defineConfig } from "cypress"

export default defineConfig({
	e2e: {
		supportFile: false,
		video: false,
		baseUrl: "http://localhost:4321",
	},
})
