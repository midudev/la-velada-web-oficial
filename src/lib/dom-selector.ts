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
) => context.querySelector<T>(selector)

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
) => context.querySelectorAll<T>(selector)
