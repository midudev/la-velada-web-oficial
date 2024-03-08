describe("Homepage", () => {
	beforeEach(() => {
		cy.visit("/")
	})

	it("should display the main header with the event name", () => {
		cy.get("h1").should("have.text", "Presentación de la Velada del Año IV")
	})
})
