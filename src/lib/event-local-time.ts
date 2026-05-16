import { Temporal } from 'temporal-polyfill-lite'

import { EVENT_TIME_ZONE } from '@/consts/event'

export interface EventLocalTimeView {
  sameLocalTime: boolean
  timeZoneId: string
  /** Primary line, e.g. "8:00 PM" or "Misma hora (España)" */
  tooltipPrimary: string
  /** Secondary line; null when same local time as Spain */
  tooltipSecondary: string | null
}

function getUserTimeZoneId(): string {
  try {
    const id = Temporal.Now.timeZoneId()
    if (id) return id
  } catch {
    /* polyfill may not expose Now in all environments */
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone || EVENT_TIME_ZONE
}

/** Peninsular Spain, 25 Jul 2026 20:00 — object form for polyfill compatibility */
export function getEventZonedDateTime() {
  return Temporal.ZonedDateTime.from({
    year: 2026,
    month: 7,
    day: 25,
    hour: 20,
    minute: 0,
    second: 0,
    timeZone: EVENT_TIME_ZONE,
  })
}

function getWallClockDiffMinutes(
  event: Temporal.ZonedDateTime,
  local: Temporal.ZonedDateTime,
): number {
  const dayDiff = local.toPlainDate().since(event.toPlainDate(), { largestUnit: 'day' }).days

  return dayDiff * 24 * 60 + (local.hour - event.hour) * 60 + (local.minute - event.minute)
}

function formatLocalTime12h(local: Temporal.ZonedDateTime, timeZoneId: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timeZoneId,
  }).format(new Date(local.epochMilliseconds))
}

function formatLocalDateShort(
  local: Temporal.ZonedDateTime,
  event: Temporal.ZonedDateTime,
  timeZoneId: string,
): string {
  const sameDay =
    local.year === event.year && local.month === event.month && local.day === event.day

  if (sameDay) return ''

  return `${new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    timeZone: timeZoneId,
  }).format(new Date(local.epochMilliseconds))} · `
}

function formatOffsetShort(diffMinutes: number): string {
  const abs = Math.abs(diffMinutes)
  const hours = Math.floor(abs / 60)
  const minutes = abs % 60

  let amount = ''

  if (hours > 0 && minutes > 0) {
    amount = `${hours} h ${minutes} min`
  } else if (hours > 0) {
    amount = `${hours} h`
  } else {
    amount = `${minutes} min`
  }

  return diffMinutes > 0 ? `${amount} después` : `${amount} antes`
}

export function resolveEventLocalTime(
  timeZoneId = getUserTimeZoneId(),
): EventLocalTimeView {
  const event = getEventZonedDateTime()
  const local = event.withTimeZone(timeZoneId)
  const diffMinutes = getWallClockDiffMinutes(event, local)
  const sameLocalTime = diffMinutes === 0

  const datePrefix = formatLocalDateShort(local, event, timeZoneId)
  const localTime = formatLocalTime12h(local, timeZoneId)

  return {
    sameLocalTime,
    timeZoneId,
    tooltipPrimary: sameLocalTime ? 'Misma hora (España)' : `${datePrefix}${localTime}`,
    tooltipSecondary: sameLocalTime
      ? null
      : `En tu zona · ${formatOffsetShort(diffMinutes)}`,
  }
}
