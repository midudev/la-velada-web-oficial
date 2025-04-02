type TimeInput = Date | number

export interface TimeParts {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface Options {
  onTick?: (time: TimeParts) => void
  onComplete?: () => void
  endTime?: TimeInput
}

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

function validateDate(value: unknown): boolean {
  if (value instanceof Date || typeof value === 'number') return true

  throw new Error(`The value ${JSON.stringify(value)} is not a valid time or date`)
}

export default function countdown(startTime: TimeInput, opts?: Options) {
  validateDate(startTime)

  if (opts?.endTime) validateDate(opts.endTime)

  let intervalId: globalThis.NodeJS.Timeout | null = null

  function start() {
    const offset = opts?.endTime
      ? new Date(startTime).getTime() - new Date(opts.endTime).getTime()
      : 0
    const timestamp = new Date(startTime).getTime() - offset

    tick(timestamp)

    intervalId = setInterval(() => tick(timestamp), SECOND)
  }

  function tick(timestamp: number) {
    const { diff, ...resolvedTime } = resolveTimeParts(timestamp)

    if (diff > 0) {
      typeof opts?.onTick === 'function' && opts.onTick(resolvedTime)

      return
    }

    stop()
  }

  function resolveTimeParts(timestamp: number) {
    const now = Date.now()
    const diff = timestamp - now
    const days = formatTime(diff / DAY)
    const hours = formatTime((diff % DAY) / HOUR)
    const minutes = formatTime((diff % HOUR) / MINUTE)
    const seconds = formatTime((diff % MINUTE) / SECOND)

    return {
      days,
      hours,
      minutes,
      seconds,
      diff,
    }
  }

  function stop() {
    typeof opts?.onComplete === 'function' && opts.onComplete()

    if (intervalId) clearInterval(intervalId)
  }

  function formatTime(time: number) {
    return Math.floor(time).toString().padStart(2, '0')
  }

  return {
    start,
    stop,
  }
}
