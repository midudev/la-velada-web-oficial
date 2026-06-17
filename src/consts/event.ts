export const EVENT_TIME_ZONE = 'Europe/Madrid'
export const EVENT_DATE_DAY = '2026-07-25'
export const EVENT_DATE_TIME = '2026-07-25T20:00:00+02:00'
export const EVENT_DATE = new Date(EVENT_DATE_TIME)
export const EVENT_ISO = EVENT_DATE.toISOString()
export const EVENT_DURATION_HOURS = 5
export const EVENT_END_ISO = new Date(
  EVENT_DATE.getTime() + EVENT_DURATION_HOURS * 60 * 60 * 1000,
).toISOString()
export const EVENT_DISPLAY_TIME = '20:00H (españa peninsular)'
export const EVENT_DISPLAY_TIME_SHORT = '20:00H CEST'
