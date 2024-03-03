import {
	$days,
	$hours,
	$minutes,
	$seconds,
	DAY,
	HOUR,
	MINUTE,
	SECOND,
	date,
} from "@/consts/countdown"
import { animateDigit } from "./animateDigit"
import { formatTime } from "./formatTime"

export const updateCountdown = (intervalId: number | undefined) => {
	const now = Date.now()
	const diff = date - now
	const $countdown = document.querySelector("[data-date]")
	if (!$countdown) return

	const days = formatTime(diff / DAY)
	const hours = formatTime((diff % DAY) / HOUR)
	const minutes = formatTime((diff % HOUR) / MINUTE)
	const seconds = formatTime((diff % MINUTE) / SECOND)

	if ($days.firstDigit instanceof HTMLElement && $days.secondDigit instanceof HTMLElement) {
		animateDigit($days.firstDigit, days[0])
		animateDigit($days.secondDigit, days[1])
	}

	if ($hours.firstDigit instanceof HTMLElement && $hours.secondDigit instanceof HTMLElement) {
		animateDigit($hours.firstDigit, hours[0])
		animateDigit($hours.secondDigit, hours[1])
	}

	if ($minutes.firstDigit instanceof HTMLElement && $minutes.secondDigit instanceof HTMLElement) {
		animateDigit($minutes.firstDigit, minutes[0])
		animateDigit($minutes.secondDigit, minutes[1])
	}

	if ($seconds.firstDigit instanceof HTMLElement && $seconds.secondDigit instanceof HTMLElement) {
		animateDigit($seconds.firstDigit, seconds[0])
		animateDigit($seconds.secondDigit, seconds[1])
	}

	if (diff < 1000) {
		clearInterval(intervalId)
		document.querySelector(".countdown-text")?.remove()

		$countdown.innerHTML = "¡El evento de presentación ha empezado! 🎉"
		$countdown.className = "text-primary uppercase font-semibold animate-fade-in text-3xl"

		import("canvas-confetti")
			.then(({ default: confetti }) => {
				void confetti()
			})
			.catch((error) => {
				console.error("Error loading canvas-confetti:", error)
			})
	}
}
