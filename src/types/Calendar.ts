export interface VeladaEvent {
	name: string
	details: string
	startDate: string
	endDate: string
	startTime: string
	endTime: string
	timeZone: string
	location: string
	iCalFileName: string
}

export interface VeladaDate {
	start: Date
	end: Date
	c: boolean
	event: VeladaEvent
}

export type CalendarProviders = "google" | "apple" | "outlook" | "msteams"
