import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockWdioGlobals, createMockElement } from './__test-helpers__/wdio-mocks'

import Carousel from './carousel'

let mocks: ReturnType<typeof mockWdioGlobals>

beforeEach(() => {
  mocks = mockWdioGlobals()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const buildCarousel = () => new Carousel({
  carouselSelector: '~carousel',
  cardSelector: '~card',
})

describe('waitForIsDisplayed', () => {
  it('waits for the carousel selector to be displayed', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await buildCarousel().waitForIsDisplayed()
    expect(el.waitForDisplayed).toHaveBeenCalledWith({ reverse: false })
  })

  it('waits in reverse when requested', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await buildCarousel().waitForIsDisplayed(true)
    expect(el.waitForDisplayed).toHaveBeenCalledWith({ reverse: true })
  })
})

describe('getCardText', () => {
  it('concatenates child text views on Android', async () => {
    mocks.driver.isAndroid = true
    const displayEl = createMockElement()
    mocks.$.mockReturnValue(displayEl)

    const textView = createMockElement()
    textView.getText.mockResolvedValue('hello')
    const card = createMockElement({
      $$: vi.fn().mockResolvedValue([textView]),
    })
    mocks.$$.mockReturnValue([card])

    const text = await buildCarousel().getCardText('first')
    expect(text.trim()).toBe('hello')
  })

  it('reads the trimmed text directly on iOS', async () => {
    mocks.driver.isAndroid = false
    const displayEl = createMockElement()
    mocks.$.mockReturnValue(displayEl)

    const card = createMockElement()
    card.getText.mockResolvedValue('  active card  ')
    mocks.$$.mockReturnValue([card])

    const text = await buildCarousel().getCardText('active')
    expect(text).toBe('active card')
  })
})

describe('swipeLeft/swipeRight', () => {
  it('swipes left across the carousel rectangle', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    mocks.driver.getElementRect.mockResolvedValue({ x: 0, y: 0, width: 100, height: 50 })
    await buildCarousel().swipeLeft()
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('swipes right across the carousel rectangle', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    mocks.driver.getElementRect.mockResolvedValue({ x: 0, y: 0, width: 100, height: 50 })
    await buildCarousel().swipeRight()
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('getCarouselRectangles', () => {
  it('fetches and caches the carousel rectangle', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    mocks.driver.getElementRect.mockResolvedValue({ x: 1, y: 2, width: 3, height: 4 })

    const carousel = buildCarousel()
    const first = await carousel.getCarouselRectangles()
    expect(first).toEqual({ x: 1, y: 2, width: 3, height: 4 })
    expect(mocks.driver.getElementRect).toHaveBeenCalledTimes(1)

    const second = await carousel.getCarouselRectangles()
    expect(second).toBe(first)
    expect(mocks.driver.getElementRect).toHaveBeenCalledTimes(1)
  })
})
