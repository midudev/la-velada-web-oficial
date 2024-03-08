import {
	META_CANONICAL,
	META_DESCRIPTION,
	META_OG_IMAGE,
	META_TITLE
} from "../consts"

describe("SEO", () => {
	beforeEach(() => {
		cy.visit("/")
	})

	it("should have the correct meta title and description", () => {
		cy.get("head title").should("have.text", META_TITLE)
		cy.get("head meta[name=description]").should("have.attr", "content", META_DESCRIPTION)
	})

	it("should have the correct charset", () => {
		cy.get("head meta[charset]").should("have.attr", "charset", "UTF-8")
	})

	it("should have the correct viewport", () => {
		cy.get("head meta[name=viewport]").should("have.attr", "content", "width=device-width")
	})

	it("should have the correct lang attribute", () => {
		cy.get("html").should("have.attr", "lang", "es")
	})

	it("should have correct meta links", () => {
		cy.get("head link[rel=icon]").should("have.attr", "href", "/favicon.svg")
		cy.get("head link[rel=canonical]").should("have.attr", "href", META_CANONICAL)
	})

	it("should have the meta og and twitter tags", () => {
		cy.get("head meta[name='twitter:card']").should("have.attr", "content", "summary_large_image")
		cy.get("head meta[name='twitter:site']").should("have.attr", "content", "@infoLaVelada")
		cy.get("head meta[name='twitter:creator']").should("have.attr", "content", "@IbaiLlanos")
		cy.get("head meta[name='twitter:title']").should("have.attr", "content", META_TITLE)
		cy.get("head meta[name='twitter:description']").should("have.attr", "content", META_DESCRIPTION)
		cy.get("head meta[name='twitter:image']").should("have.attr", "content", META_OG_IMAGE)
		cy.get("head meta[name='og:image']").should("have.attr", "content", META_OG_IMAGE)
		cy.get("head meta[name='og:title']").should("have.attr", "content", META_TITLE)
		cy.get("head meta[name='og:description']").should("have.attr", "content", META_DESCRIPTION)
		cy.get("head meta[name='og:url']").should("have.attr", "content", META_CANONICAL)
		cy.get("head meta[name='og:site_name']").should("have.attr", "content", "La Velada 4")
		cy.get("head meta[name='og:type']").should("have.attr", "content", "website")
		cy.get("head meta[name='og:locale']").should("have.attr", "content", "es_ES")
	})

	it("should have the meta robots index,follow value", () => {
		cy.get("head meta[name=robots]").should("have.attr", "content", "index, follow")
		cy.get("head meta[name=googlebot]").should("have.attr", "content", "index, follow")
	})
})
