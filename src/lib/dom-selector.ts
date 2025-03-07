/**
 * Get element from dom by selector string
 * @example
 * 	const elementClass = $('.my-class')
 * 	const elementId = $('#my-id')
 * @param selector
 * @param context
 * @returns  HTMLElement
 */
export const $ = <T extends HTMLElement>(
	selector: string,
	context: Document | HTMLElement = document
) => {
	console.log("Selecting element with:", { selector, context })
	const element = context.querySelector<T>(selector)
	console.log("Found element:", element)
	return element
}

/**
 * Get elements from dom by selector string
 * @example
 * 	const elements = $$('.my-class')
 * @param selector
 * @param context
 * @returns  NodeList
 */
export const $$ = <T extends HTMLElement>(
	selector: string,
	context: Document | HTMLElement = document
) => {
	console.log("Selecting elements with:", { selector, context })
	const elements = context.querySelectorAll<T>(selector)
	console.log("Found elements:", elements)
	return elements
}