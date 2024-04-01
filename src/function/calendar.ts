import type { CalendarProviders, VeladaDate, VeladaEvent } from "@/types/Calendar"

function addToCalendar(providerUrl: string, provider: CalendarProviders, event: VeladaEvent) {
	switch (provider) {
		case "google":
			addToGoogleCalendar(providerUrl, event)
			break
		default:
			throw new Error("NOT YET IMPLEMENTED")
	}
}

function encodeURL(url: string, urlParams: Record<string, string>, action = true) {
	if (action) url += "&"
	const newUrl = Object.keys(urlParams)
		.map((key: string) => {
			return `${encodeURIComponent(key)}=${encodeURIComponent(urlParams[key])}`
		})
		.join("&")
	return url + newUrl
}

function addToGoogleCalendar(url: string, event: VeladaEvent): void {
	const { startTime, endTime } = formatDate(generateDate(event))

	event.details = sanitizeHtml(event.details)
	const urlParams = {
		dates: `${startTime}/${endTime}`,
		text: event.name,
		location: event.location,
		details: event.details,
	}

	const encodedUrl = encodeURL(url, urlParams)
	window.open(encodedUrl, "_blank")
}

function formatDate({ start, end, c, event }: VeladaDate) {
	const newDate = new window.Date(
		start.toLocaleString("en-US", {
			timeZone: "UTC",
		})
	)
	const newLocalDate = new window.Date(
		new window.Date(newDate.toLocaleString("en-US", { timeZone: event.timeZone }))
	)
	const offset = newLocalDate.getTime() - newDate.getTime()
	start.setTime(start.getTime() + offset)
	end.setTime(end.getTime() + offset)
	const cleanStart = start.toISOString().replace(".000", "").replace(/-/g, "").replace(/:/g, "")
	const cleanEnd = end.toISOString().replace(".000", "").replace(/-/g, "").replace(/:/g, "")
	return {
		startTime: cleanStart,
		endTime: cleanEnd,
		recurrence: c,
	}
}

function generateDate(event: VeladaEvent): VeladaDate {
	const start = event.startDate.split("-")
	const [sYear, sMonth, sDay] = start
	const end = event.endDate.split("-")
	const [eYear, eMonth, eDay] = end
	const startDate = new Date(`${sYear}-${sMonth}-${sDay}T${event.startTime}:00.000+00:00`)
	const endDate = new Date(`${eYear}-${eMonth}-${eDay}T${event.endTime}:00.000+00:00`)

	return {
		start: startDate,
		end: endDate,
		c: true,
		event,
	}
}

function sanitizeHtml(details: string, tag = false): string {
	const regex = {
		newLines: /<br\s*\/?>/gi,
		elementsWithLink: /\[(|\/)(url|br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]|((\|.*)\[\/url\])/gi,
		elements: /\[(\/|)(br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]/gi,
		links: /\[url\]([\w&$+.,:;=~!*'?@^%#|\s\-()/]*)\[\/url\]/gi,
	} as const
	details = details.replace(regex.newLines, "\n")
	if (tag) {
		details = details.replace(regex.elementsWithLink, "")
	} else {
		details = details.replace(regex.elements, "<$1$2>").replace(regex.links, (_, url: string) => {
			const matchedUrl: readonly string[] = url.split("|")
			let a = `<a href="${matchedUrl[0]}" target="_blank" rel="noopener">`
			if (matchedUrl.length > 1 && matchedUrl[1] !== "") {
				a += matchedUrl[1]
			} else {
				a += matchedUrl[0]
			}
			return `${a}</a>`
		})
	}
	return details
}

export { addToCalendar }
