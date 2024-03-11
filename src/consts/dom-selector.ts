/**
 * Get element from dom by selector string
 * @example
 * 	const elementClass = $('.my-class')
 * 	const elementId = $('#my-id')
 * @param selector
 * @returns  HTMLElement
 */
export const $ = (selector: string) => document.querySelector(selector) as HTMLElement

/**
 * Get elements from dom by selector string
 * @example
 * 	const elements = $$('.my-class')
 * @param selector
 * @returns  NodeList
 */
export const $$ = (selector: string) => document.querySelectorAll(selector)
