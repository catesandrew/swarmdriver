import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockWdioGlobals, createMockElement } from './__test-helpers__/wdio-mocks'

import {
  swipe,
  swipeOnPercentage,
  swipeDown,
  swipeUp,
  swipeLeft,
  swipeRight,
  checkIfDisplayedWithScrollDown,
  scrollToElements,
  swipeAction,
  swipeActionPercentage,
  swipePercentage,
  swipeToNextScreen,
  swipeToPrevScreen,
  swipeOnDirection,
  scrollToElement,
  swipeOnDirectionDown,
  scrollAction,
  scrollActionDown,
  dragAndDrop,
  pinchAndZoom,
  swipeItemLeft,
} from './gestures'

let mocks: ReturnType<typeof mockWdioGlobals>

beforeEach(() => {
  mocks = mockWdioGlobals()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('swipe', () => {
  it('performs a pointer action between two absolute points', async () => {
    await swipe({ from: { x: 0, y: 0 }, to: { x: 10, y: 10 } })
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('swipeOnPercentage', () => {
  it('converts percentage points to device coordinates and swipes', async () => {
    await swipeOnPercentage({ from: { x: 0, y: 0 }, to: { x: 10, y: 10 } })
    expect(mocks.driver.getWindowRect).toHaveBeenCalled()
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('swipeDown/swipeUp/swipeLeft/swipeRight', () => {
  it('swipeDown performs a downward swipe', async () => {
    await swipeDown(1)
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('swipeUp performs an upward swipe', async () => {
    await swipeUp(1)
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('swipeLeft performs a leftward swipe', async () => {
    await swipeLeft(1)
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('swipeRight performs a rightward swipe', async () => {
    await swipeRight(1)
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('checkIfDisplayedWithScrollDown', () => {
  it('resolves without scrolling when the element is already displayed', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await checkIfDisplayedWithScrollDown({ selector: 'foo' })
    expect(mocks.driver.performActions).not.toHaveBeenCalled()
  })

  it('scrolls once then throws once maxScrolls is exceeded', async () => {
    mocks.$.mockReturnValue(null)
    await expect(checkIfDisplayedWithScrollDown({ selector: 'foo', maxScrolls: 0, amount: 1 }))
    .rejects.toThrow(/could not be found or is not visible/)
  })
})

describe('scrollToElements', () => {
  it('resolves true immediately when one of the elements is found', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(scrollToElements({ selectors: ['foo', 'bar'] })).resolves.toBe(true)
  })

  it('throws once maxScrolls is exceeded without finding any element', async () => {
    mocks.$.mockReturnValue(null)
    await expect(scrollToElements({ selectors: ['foo'], maxScrolls: 0, amount: 1 }))
    .rejects.toThrow(/could be found or are not visible/)
  })
})

describe('swipeAction', () => {
  it('is a deprecated no-op that does not throw', async () => {
    await expect(swipeAction({})).resolves.toBeUndefined()
  })
})

describe('swipeActionPercentage', () => {
  it('is a deprecated no-op that does not throw', async () => {
    await expect(swipeActionPercentage({})).resolves.toBeUndefined()
  })
})

describe('swipePercentage', () => {
  it('swipes using cached size when provided', async () => {
    await swipePercentage({
      from: { xPct: 0, yPct: 0 },
      to: { xPct: 1, yPct: 1 },
      size: { width: 100, height: 200 },
    })
    expect(mocks.driver.getWindowRect).not.toHaveBeenCalled()
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('fetches the window size when not provided', async () => {
    await swipePercentage({ from: { xPct: 0, yPct: 0 }, to: { xPct: 1, yPct: 1 } })
    expect(mocks.driver.getWindowRect).toHaveBeenCalled()
  })
})

describe('swipeToNextScreen', () => {
  it('swipes right-to-left in portrait mode', async () => {
    await swipeToNextScreen({})
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('swipes bottom-to-top in landscape mode', async () => {
    await swipeToNextScreen({ landscape: true })
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('swipeToPrevScreen', () => {
  it('swipes left-to-right in portrait mode', async () => {
    await swipeToPrevScreen({ size: { width: 100, height: 200 } })
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('swipes top-to-bottom in landscape mode', async () => {
    await swipeToPrevScreen({ landscape: true, size: { width: 100, height: 200 } })
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('swipeOnDirection', () => {
  it('throws when distance is out of range', async () => {
    await expect(swipeOnDirection({ distance: 2 })).rejects.toThrow(/must be between 0 and 1/)
  })

  it('swipes up/down/left/right based on the direction enum', async () => {
    await swipeOnDirection({ direction: 1, size: { width: 100, height: 200 } })
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('scrollToElement', () => {
  it('resolves true immediately when the element is found and displayed', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(scrollToElement({ selector: 'foo' })).resolves.toBe(true)
  })

  it('resolves false when the element cannot be found at all', async () => {
    mocks.$.mockReturnValue(null)
    await expect(scrollToElement({ selector: 'foo' })).resolves.toBe(false)
  })

  it('throws once maxScrolls is exceeded while the element exists but is not displayed', async () => {
    const el = createMockElement()
    el.isDisplayed.mockResolvedValue(false)
    mocks.$.mockReturnValue(el)
    await expect(scrollToElement({ selector: 'foo', maxScrolls: 0, amount: 1 }))
    .rejects.toThrow(/could not be found or is not visible/)
  })
})

describe('swipeOnDirectionDown', () => {
  it('swipes down using the direction helper', async () => {
    await swipeOnDirectionDown({ size: { width: 100, height: 200 } })
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('scrollAction/scrollActionDown', () => {
  it('scrollAction is a deprecated no-op', async () => {
    await expect(scrollAction({})).resolves.toBeUndefined()
  })

  it('scrollActionDown is a deprecated no-op', async () => {
    await expect(scrollActionDown({})).resolves.toBeUndefined()
  })
})

describe('dragAndDrop', () => {
  it('performs a pointer action from the draggable element to the drop zone', async () => {
    await dragAndDrop(createMockElement(), createMockElement())
    expect(mocks.driver.getElementRect).toHaveBeenCalledTimes(2)
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('pinchAndZoom', () => {
  it('performs a two-finger zoom gesture by default', async () => {
    await pinchAndZoom(createMockElement())
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('performs a two-finger pinch gesture when requested', async () => {
    await pinchAndZoom(createMockElement(), 'pinch')
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('swipeItemLeft', () => {
  it('performs a single-finger leftward swipe on the element', async () => {
    await swipeItemLeft(createMockElement())
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})
