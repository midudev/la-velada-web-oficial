import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
	await page.goto("/")
})

test.describe("Load home page", () => {
	test("has title home page", async ({ page }) => {
		await expect(page).toHaveTitle("La Velada del Año 4 - Evento de Boxeo de Ibai Llanos")
	})

	test("has the text of the ibai channel", async ({ page }) => {
		const role = "link"
		await expect(page.getByRole(role, { name: "Enlace al canal de Twitch de" })).toBeVisible()

		await expect(page.getByText("en directo twitch.tv/ibai")).toBeVisible()
	})

	test("has the text of the event date", async ({ page }) => {
		const role = "time"
		await expect(page.getByRole(role)).toBeVisible()
		await expect(page.getByRole(role)).toHaveText("13 de julio", { timeout: 1000 })
	})

	test("has the text of the event location", async ({ page }) => {
		const label = "ubicación del campo Santiago"
		await expect(page.getByLabel(label)).toBeVisible()
		await expect(page.getByLabel(label)).toHaveText(" Estadio Santiago Bernabéu ")
	})

	test("load section vídeo", async ({ page }) => {
		const text = "Presentación Vuelve a ver la"
		await expect(page.getByText(text)).toBeVisible()
	})

	test("load the sponsors section and their logos", async ({ page }) => {
		const text = "Patrocinadores La Velada"
		const label = "Link con el logo de Vicio que"
		await expect(page.getByText(text)).toBeVisible()

		await expect(page.locator(".sponsors")).toBeVisible()
		await expect(page.locator(".sponsors > div a")).toHaveCount(10)
		await expect(page.getByLabel(label)).toBeVisible()
	})
})
