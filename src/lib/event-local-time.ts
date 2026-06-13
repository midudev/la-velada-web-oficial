import { EVENT_DATE, EVENT_TIME_ZONE } from '@/consts/event'

const MINUTE_MS = 60_000

export interface EventLocalTimeView {
  sameLocalTime: boolean
  timeZoneId: string
  tooltipPrimary: string
  tooltipSecondary: string | null
}

function getUserTimeZoneId(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || EVENT_TIME_ZONE
  } catch {
    return EVENT_TIME_ZONE
  }
}

function formatRelativeOffset(diffMinutes: number): string {
  const abs = Math.abs(diffMinutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return `${diffMinutes > 0 ? '+' : '-'}${[h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' ')} de diferencia`
}

function getTimeZoneOffsetMinutes(date: Date, timeZoneId: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZoneId,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  )

  return Math.round((asUtc - date.getTime()) / MINUTE_MS)
}

function formatEventPart(timeZoneId: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: timeZoneId,
    ...options,
  }).format(EVENT_DATE)
}

export function resolveEventLocalTime(timeZoneId = getUserTimeZoneId()): EventLocalTimeView {
  const madridOffset = getTimeZoneOffsetMinutes(EVENT_DATE, EVENT_TIME_ZONE)
  const localOffset = getTimeZoneOffsetMinutes(EVENT_DATE, timeZoneId)
  const diffMinutes = localOffset - madridOffset
  const sameLocalTime = diffMinutes === 0
  const localDate = formatEventPart(timeZoneId, { day: 'numeric', month: 'short' })
  const eventDate = formatEventPart(EVENT_TIME_ZONE, { day: 'numeric', month: 'short' })
  const datePrefix = localDate === eventDate ? '' : `${localDate} · `
  const localTime = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZoneId,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(EVENT_DATE)

  return {
    sameLocalTime,
    timeZoneId,
    tooltipPrimary: sameLocalTime ? 'Misma hora local' : `Tu hora local: ${datePrefix}${localTime}`,
    tooltipSecondary: sameLocalTime ? null : formatRelativeOffset(diffMinutes),
  }
}
