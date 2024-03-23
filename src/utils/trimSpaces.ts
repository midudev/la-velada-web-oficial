export default function trimSpaces(elements: HTMLElement[]): void {
	elements.forEach((el: HTMLElement) => {
		if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
			if (el.firstChild.textContent) {
				el.firstChild.textContent = el.firstChild.textContent.trim()
			}
		}
	})
}
