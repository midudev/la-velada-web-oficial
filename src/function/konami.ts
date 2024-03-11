interface KonamiProps {
	code: string[]
	keyPressed: string
	onFinishTime?: number
	onSuccess: () => void
	onFinish?: () => void
}

interface KonamiState {
	[key: string]: number
}

const konamiState: KonamiState = {}

/**
 * @description
 * This function is a simple implementation of the Konami code.
 *
 * @param code - The Konami code
 * @param keyPressed - The key pressed by the user
 * @param onFinishTime - The time to wait before calling onFinish
 * @param onSuccess - The function to call when the Konami code is successfully entered
 * @param onFinish - The function to call when the Konami code is not successfully entered
 * @returns  void
 */

export function Konami({ code, keyPressed, onFinishTime, onSuccess, onFinish }: KonamiProps) {
	const codeKey = code.join("-")
	const konamiCodePosition = konamiState[codeKey] || 0

	const actualKey = keyPressed.toLowerCase()
	const actualCode = code[konamiCodePosition].toLowerCase()

	if (actualKey !== actualCode) {
		if (onFinish) onFinish()
		konamiState[codeKey] = 0
		return
	}

	const nextPosition = konamiCodePosition + 1

	if (nextPosition === code.length) {
		onSuccess()
		konamiState[codeKey] = 0

		if (onFinishTime && onFinish) {
			setTimeout(() => {
				onFinish()
			}, onFinishTime || 1000)
		}
	} else {
		konamiState[codeKey] = nextPosition
	}
}
