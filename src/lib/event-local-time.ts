import { Temporal } from 'temporal-polyfill-lite'

import { EVENT_TIME_ZONE } from '@/consts/event'

const EVENT_ZONED_DATE_TIME = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 7,
  day: 25,
  hour: 20,
  minute: 0,
  second: 0,
  timeZone: EVENT_TIME_ZONE,
})

const LOCAL_TIME_FORMAT = {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
} satisfies Intl.DateTimeFormatOptions

const LOCAL_DATE_FORMAT = {
  day: 'numeric',
  month: 'short',
} satisfies Intl.DateTimeFormatOptions

export interface EventLocalTimeView {
  sameLocalTime: boolean
  timeZoneId: string
  /** Primary line, e.g. "Tu hora local: 1:00 AM" or "Misma hora local" */
  tooltipPrimary: string
  /** Secondary line; null when same local time as the event */
  tooltipSecondary: string | null
}

function getUserTimeZoneId(): string {
  try {
    return Temporal.Now.timeZoneId()
  } catch {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || EVENT_TIME_ZONE
  }
}

function getWallClockDiffMinutes(
  event: Temporal.ZonedDateTime,
  local: Temporal.ZonedDateTime,
): number {
  return local
    .toPlainDateTime()
    .since(event.toPlainDateTime(), { largestUnit: 'hour' })
    .total('minutes')
}

function formatLocalTime12h(local: Temporal.ZonedDateTime): string {
  return local.toLocaleString('en-US', LOCAL_TIME_FORMAT)
}

function formatLocalDateShort(local: Temporal.ZonedDateTime, event: Temporal.ZonedDateTime): string {
  if (local.toPlainDate().equals(event.toPlainDate())) return ''

  return `${local.toLocaleString('es-ES', LOCAL_DATE_FORMAT)} · `
}

function formatRelativeOffset(diffMinutes: number): string {
  const abs = Math.abs(diffMinutes)
  const hours = Math.floor(abs / 60)
  const minutes = abs % 60
  const sign = diffMinutes > 0 ? '+' : '-'

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours} h`)
  if (minutes > 0) parts.push(`${minutes} min`)

  return `${sign}${parts.join(' ')} de diferencia`
}

export function resolveEventLocalTime(
  timeZoneId = getUserTimeZoneId(),
): EventLocalTimeView {
  const local = EVENT_ZONED_DATE_TIME.withTimeZone(timeZoneId)
  const diffMinutes = getWallClockDiffMinutes(EVENT_ZONED_DATE_TIME, local)
  const sameLocalTime = diffMinutes === 0

  const datePrefix = formatLocalDateShort(local, EVENT_ZONED_DATE_TIME)
  const localTime = formatLocalTime12h(local)

  return {
    sameLocalTime,
    timeZoneId,
    tooltipPrimary: sameLocalTime ? 'Misma hora local' : `Tu hora local: ${datePrefix}${localTime}`,
    tooltipSecondary: sameLocalTime ? null : formatRelativeOffset(diffMinutes),
  }
}
