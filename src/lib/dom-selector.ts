/**
 * Get element from dom by selector string
 * @example
 * 	const elementClass = $('.my-class')
 * 	const elementId = $('#my-id')
 * @param selector
 * @param context
 * @returns  HTMLElement
 */
export const $ = (selector: string, context: Document | HTMLElement = document) =>
	context.querySelector(selector) as HTMLElement

/**
 * Get elements from dom by selector string
 * @example
 * 	const elements = $$('.my-class')
 * @param selector
 * @param context
 * @returns  NodeList
 */
export const $$ = (selector: string, context: Document | HTMLElement = document) =>
	context.querySelectorAll(selector)
