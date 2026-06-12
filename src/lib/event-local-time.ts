import { Temporal } from 'temporal-polyfill-lite'

const EVENT = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 7,
  day: 25,
  hour: 20,
  minute: 0,
  second: 0,
  timeZone: 'Europe/Madrid',
})

export interface EventLocalTimeView {
  sameLocalTime: boolean
  timeZoneId: string
  tooltipPrimary: string
  tooltipSecondary: string | null
}

function getUserTimeZoneId(): string {
  try {
    return Temporal.Now.timeZoneId()
  } catch {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid'
  }
}

function formatRelativeOffset(diffMinutes: number): string {
  const abs = Math.abs(diffMinutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return `${diffMinutes > 0 ? '+' : '-'}${[h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' ')} de diferencia`
}

export function resolveEventLocalTime(timeZoneId = getUserTimeZoneId()): EventLocalTimeView {
  const local = EVENT.withTimeZone(timeZoneId)
  const diffMinutes = local.toPlainDateTime().since(EVENT.toPlainDateTime(), { largestUnit: 'hour' }).total('minutes')
  const sameLocalTime = diffMinutes === 0
  const datePrefix = local.toPlainDate().equals(EVENT.toPlainDate())
    ? ''
    : `${local.toLocaleString('es-ES', { day: 'numeric', month: 'short' })} · `
  const localTime = local.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return {
    sameLocalTime,
    timeZoneId,
    tooltipPrimary: sameLocalTime ? 'Misma hora local' : `Tu hora local: ${datePrefix}${localTime}`,
    tooltipSecondary: sameLocalTime ? null : formatRelativeOffset(diffMinutes),
  }
}
