export const EVENT_TIME_ZONE = 'Europe/Madrid'
export const EVENT_DATE_DAY = '2026-07-25'
export const EVENT_DATE_TIME = '2026-07-25T19:00:00+02:00'
export const EVENT_DATE = new Date(EVENT_DATE_TIME)
export const EVENT_ISO = EVENT_DATE.toISOString()
export const EVENT_DURATION_HOURS = 5
export const EVENT_END_ISO = new Date(
  EVENT_DATE.getTime() + EVENT_DURATION_HOURS * 60 * 60 * 1000,
).toISOString()
export const EVENT_HOUR = '19:00'
export const EVENT_DISPLAY_TIME = `${EVENT_HOUR}H (españa peninsular)`
export const EVENT_DISPLAY_TIME_SHORT = `${EVENT_HOUR}H CEST`

// Canal de YouTube de Ibai Llanos, desde donde se retransmite el evento en
// directo. El embed `live_stream` carga automáticamente lo que esté en
// directo en el canal en cada momento, sin necesitar el ID del vídeo.
export const EVENT_LIVE_YOUTUBE_CHANNEL_ID = 'UCaY_-ksFSQtTGk0y1HA_3YQ'
