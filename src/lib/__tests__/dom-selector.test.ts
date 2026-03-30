import { describe, it, expect, beforeEach } from 'vitest'
import { $, $$ } from '../dom-selector'

describe('$ (single element selector)', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <p class="text">Hello</p>
        <p class="text">World</p>
        <span data-testid="unique">Test</span>
      </div>
    `
  })

  it('should select element by id', () => {
    const el = $('#app')
    expect(el).not.toBeNull()
    expect(el?.tagName).toBe('DIV')
  })

  it('should select first matching element by class', () => {
    const el = $('.text')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('Hello')
  })

  it('should return null for non-existent selector', () => {
    const el = $('.nonexistent')
    expect(el).toBeNull()
  })

  it('should search within a custom context element', () => {
    const app = document.getElementById('app')!
    const el = $('span', app)
    expect(el?.getAttribute('data-testid')).toBe('unique')
  })
})

describe('$$ (multiple element selector)', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <ul><li class="item">A</li><li class="item">B</li><li class="item">C</li></ul>
    `
  })

  it('should select all matching elements', () => {
    const els = $$('.item')
    expect(els).toHaveLength(3)
  })

  it('should return empty NodeList for non-existent selector', () => {
    const els = $$('.nonexistent')
    expect(els).toHaveLength(0)
  })
})
