export function generateBubbles(): void {
	document.addEventListener("mousemove", (event: MouseEvent) => {
		const i = document.createElement("i")
		i.ariaHidden = "hidden"
		i.classList.add("bubble-soap")
		i.style.left = `${event.pageX}px`
		i.style.top = `${event.pageY}px`
		i.style.scale = `${Math.random() * 1.5 + 0.5}`
		i.style.setProperty("--x", getRandomPosition())
		i.style.setProperty("--y", getRandomPosition())
		document.body.appendChild(i)

		setTimeout(() => i.remove(), 2000)
	})
}

function getRandomPosition(): string {
	return `${Math.random() * 400 - 200}px`
}
