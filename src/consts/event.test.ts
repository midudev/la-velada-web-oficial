import { describe, expect, it } from 'vitest'

import {
  EVENT_DATE,
  EVENT_DATE_DAY,
  EVENT_DATE_TIME,
  EVENT_DURATION_HOURS,
  EVENT_END_ISO,
  EVENT_HOUR,
  EVENT_ISO,
} from '@/consts/event'

describe('Constantes del evento', () => {
  it('EVENT_DATE es una fecha válida', () => {
    expect(EVENT_DATE).toBeInstanceOf(Date)
    expect(Number.isNaN(EVENT_DATE.getTime())).toBe(false)
  })

  it('EVENT_DATE_TIME comienza por EVENT_DATE_DAY', () => {
    expect(EVENT_DATE_TIME.startsWith(EVENT_DATE_DAY)).toBe(true)
  })

  it('EVENT_ISO se corresponde con EVENT_DATE', () => {
    expect(EVENT_ISO).toBe(EVENT_DATE.toISOString())
    expect(new Date(EVENT_ISO).getTime()).toBe(EVENT_DATE.getTime())
  })

  it('EVENT_END_ISO es posterior al inicio en EVENT_DURATION_HOURS horas', () => {
    const startMs = new Date(EVENT_ISO).getTime()
    const endMs = new Date(EVENT_END_ISO).getTime()
    expect(endMs).toBeGreaterThan(startMs)
    expect(endMs - startMs).toBe(EVENT_DURATION_HOURS * 60 * 60 * 1000)
  })

  it('EVENT_HOUR tiene formato HH:MM', () => {
    expect(EVENT_HOUR).toMatch(/^\d{2}:\d{2}$/)
  })
})
