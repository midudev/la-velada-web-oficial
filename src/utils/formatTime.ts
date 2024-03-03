export const formatTime = (time: number) => {
	return Math.floor(time).toString().padStart(2, "0")
}
