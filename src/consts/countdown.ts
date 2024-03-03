export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export const $countdown = document.querySelector("[data-date]")

export const $days = {
	firstDigit: $countdown?.querySelector("[data-days] [data-first-group]"),
	secondDigit: $countdown?.querySelector("[data-days] [data-second-group]"),
}

export const $hours = {
	firstDigit: $countdown?.querySelector("[data-hours] [data-first-group]"),
	secondDigit: $countdown?.querySelector("[data-hours] [data-second-group]"),
}

export const $minutes = {
	firstDigit: $countdown?.querySelector("[data-minutes] [data-first-group]"),
	secondDigit: $countdown?.querySelector("[data-minutes] [data-second-group]"),
}

export const $seconds = {
	firstDigit: $countdown?.querySelector("[data-seconds] [data-first-group]"),
	secondDigit: $countdown?.querySelector("[data-seconds] [data-second-group]"),
}

export const timestamp = $countdown?.getAttribute("data-date")

if (!timestamp) throw new Error("No timestamp found in Countdown.astro")

export const date = new Date(+timestamp).getTime()
