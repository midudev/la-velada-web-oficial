import {
  EVENT_VENUE_LAT,
  EVENT_VENUE_LNG,
  EVENT_VENUE_MAP_URL,
  EVENT_VENUE_NAME,
} from '@/consts/event'

function isAppleDevice() {
  return /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(navigator.userAgent)
}

function isAndroidDevice() {
  return /Android/.test(navigator.userAgent)
}

/** Best-effort native maps URL for the current platform */
export function getVenueMapUrl(): string {
  const label = encodeURIComponent(EVENT_VENUE_NAME)
  const coords = `${EVENT_VENUE_LAT},${EVENT_VENUE_LNG}`

  if (isAppleDevice()) {
    return `https://maps.apple.com/?ll=${coords}&q=${label}`
  }

  if (isAndroidDevice()) {
    return `geo:${coords}?q=${coords}(${label})`
  }

  return `https://www.google.com/maps/search/?api=1&query=${coords}`
}

export function openVenueInMaps() {
  const url = getVenueMapUrl()

  try {
    window.open(url, '_blank', 'noopener,noreferrer')
  } catch {
    window.location.assign(EVENT_VENUE_MAP_URL)
  }
}
