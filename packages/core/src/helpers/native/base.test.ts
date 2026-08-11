import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockWdioGlobals, createMockElement } from './__test-helpers__/wdio-mocks'

import Base from './base'

let mocks: ReturnType<typeof mockWdioGlobals>

beforeEach(() => {
  mocks = mockWdioGlobals()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Base', () => {
  it('stores the selector passed to the constructor', () => {
    const base = new Base('~my-selector')
    expect(base.selector).toBe('~my-selector')
  })

  describe('isShown', () => {
    it('resolves true when the element is displayed', async () => {
      const el = createMockElement()
      mocks.$.mockReturnValue(el)
      const base = new Base('~my-selector')
      await expect(base.isShown()).resolves.toBe(true)
    })

    it('resolves false when the element is not displayed', async () => {
      const el = createMockElement()
      el.isDisplayed.mockResolvedValue(false)
      mocks.$.mockReturnValue(el)
      const base = new Base('~my-selector')
      await expect(base.isShown()).resolves.toBe(false)
    })

    it('resolves false (not throw) when the element cannot be found', async () => {
      mocks.$.mockReturnValue(null)
      const base = new Base('~my-selector')
      await expect(base.isShown()).resolves.toBe(false)
    })

    it('accepts an already-held element instead of looking one up', async () => {
      const el = createMockElement()
      const base = new Base('~my-selector')
      await expect(base.isShown(el)).resolves.toBe(true)
      expect(mocks.$).not.toHaveBeenCalled()
    })
  })

  describe('waitForIsShown', () => {
    it('resolves once the element becomes shown', async () => {
      const el = createMockElement()
      mocks.$.mockReturnValue(el)
      const base = new Base('~my-selector')
      await expect(base.waitForIsShown()).resolves.toBeUndefined()
      expect(mocks.driver.waitUntil).toHaveBeenCalled()
    })

    it('rejects with the configured timeout message when never shown', async () => {
      mocks.$.mockReturnValue(null)
      const base = new Base('~my-selector')
      await expect(base.waitForIsShown()).rejects.toThrow(/was not shown within the default timeout/)
    })
  })

  describe('waitForIsNotShown', () => {
    it('resolves once the element is no longer shown', async () => {
      mocks.$.mockReturnValue(null)
      const base = new Base('~my-selector')
      await expect(base.waitForIsNotShown()).resolves.toBeUndefined()
    })

    it('rejects with the configured timeout message when still shown', async () => {
      const el = createMockElement()
      mocks.$.mockReturnValue(el)
      const base = new Base('~my-selector')
      await expect(base.waitForIsNotShown()).rejects.toThrow(/was still shown within the default timeout/)
    })
  })
})
