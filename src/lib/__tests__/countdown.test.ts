import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import countdown from '../countdown'

describe('countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('validation', () => {
    it('should accept a Date object', () => {
      expect(() => countdown(new Date())).not.toThrow()
    })

    it('should accept a number (timestamp)', () => {
      expect(() => countdown(Date.now() + 10000)).not.toThrow()
    })

    it('should throw for a string value', () => {
      expect(() => countdown('invalid' as unknown as number)).toThrow()
    })

    it('should throw for null', () => {
      expect(() => countdown(null as unknown as number)).toThrow()
    })

    it('should validate endTime option if provided', () => {
      expect(() =>
        countdown(Date.now() + 10000, { endTime: 'invalid' as unknown as number }),
      ).toThrow()
    })
  })

  describe('tick behavior', () => {
    it('should call onTick with time parts when countdown is active', () => {
      const onTick = vi.fn()
      const futureDate = Date.now() + 90061000 // 1 day, 1 hour, 1 minute, 1 second

      const timer = countdown(futureDate, { onTick })
      timer.start()

      expect(onTick).toHaveBeenCalledTimes(1)
      expect(onTick).toHaveBeenCalledWith(
        expect.objectContaining({
          days: expect.any(String),
          hours: expect.any(String),
          minutes: expect.any(String),
          seconds: expect.any(String),
        }),
      )

      timer.stop()
    })

    it('should pad single digit values with leading zero', () => {
      const onTick = vi.fn()
      // 5 seconds in the future
      const futureDate = Date.now() + 5000

      const timer = countdown(futureDate, { onTick })
      timer.start()

      const timeParts = onTick.mock.calls[0][0]
      expect(timeParts.days).toBe('00')
      expect(timeParts.hours).toBe('00')
      expect(timeParts.minutes).toBe('00')
      expect(timeParts.seconds.length).toBe(2)

      timer.stop()
    })

    it('should call onTick on each interval tick', () => {
      const onTick = vi.fn()
      const futureDate = Date.now() + 60000

      const timer = countdown(futureDate, { onTick })
      timer.start()

      expect(onTick).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1000)
      expect(onTick).toHaveBeenCalledTimes(2)

      vi.advanceTimersByTime(1000)
      expect(onTick).toHaveBeenCalledTimes(3)

      timer.stop()
    })
  })

  describe('completion', () => {
    it('should call onComplete when countdown reaches zero', () => {
      const onComplete = vi.fn()
      const onTick = vi.fn()
      // 2 seconds in the future
      const futureDate = Date.now() + 2000

      const timer = countdown(futureDate, { onTick, onComplete })
      timer.start()

      // Advance past the end
      vi.advanceTimersByTime(3000)

      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('should stop the interval after completion', () => {
      const onTick = vi.fn()
      const futureDate = Date.now() + 1000

      const timer = countdown(futureDate, { onTick })
      timer.start()

      // Advance well past the end
      vi.advanceTimersByTime(5000)

      const callCount = onTick.mock.calls.length
      vi.advanceTimersByTime(3000)
      // No more calls after completion
      expect(onTick).toHaveBeenCalledTimes(callCount)
    })
  })

  describe('stop', () => {
    it('should stop the countdown and clear interval', () => {
      const onTick = vi.fn()
      const futureDate = Date.now() + 60000

      const timer = countdown(futureDate, { onTick })
      timer.start()
      timer.stop()

      const callCount = onTick.mock.calls.length
      vi.advanceTimersByTime(5000)
      expect(onTick).toHaveBeenCalledTimes(callCount)
    })
  })
})
