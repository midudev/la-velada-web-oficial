import { describe, it, expect } from 'vitest'
import { getBoxerById, getBoxerVersusById } from '../boxers'
import { FIGHTERS } from '@/consts/fighters'

describe('getBoxerById', () => {
  it('should return the correct fighter for a valid id', () => {
    const fighter = getBoxerById('peereira')
    expect(fighter).toBeDefined()
    expect(fighter.id).toBe('peereira')
    expect(fighter.name).toBe('Peereira')
  })

  it('should return FIGHTERS[0] for an invalid id', () => {
    const fighter = getBoxerById('nonexistent-id')
    expect(fighter).toBe(FIGHTERS[0])
  })

  it('should return a fighter with the expected properties', () => {
    const fighter = getBoxerById('grefg')
    expect(fighter).toHaveProperty('id')
    expect(fighter).toHaveProperty('name')
    expect(fighter).toHaveProperty('realName')
    expect(fighter).toHaveProperty('gender')
    expect(fighter).toHaveProperty('country')
    expect(fighter).toHaveProperty('versus')
  })
})

describe('getBoxerVersusById', () => {
  it('should return the correct fighter for a valid id', () => {
    const fighter = getBoxerVersusById('viruzz')
    expect(fighter).toBeDefined()
    expect(fighter.id).toBe('viruzz')
  })

  it('should return FIGHTERS[0] for an invalid id', () => {
    const fighter = getBoxerVersusById('nonexistent-id')
    expect(fighter).toBe(FIGHTERS[0])
  })
})
