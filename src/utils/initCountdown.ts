import { updateCountdown } from "./updatetCountdown"
import { SECOND } from "@/consts/countdown"

export const initCountdown = () => {
	const intervalId = setInterval(updateCountdown, SECOND)
	updateCountdown(intervalId)
}
