export const animateDigit = (group: HTMLElement, value: string) => {
	const wrapper = group.querySelector("[data-wrapper]")
	const num = group.querySelector(`[data-num-${value}]`)

	if (wrapper instanceof HTMLElement && num instanceof HTMLElement) {
		wrapper.style.transform = `translateY(-${num.offsetTop}px)`
	}
}
