import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockWdioGlobals, createMockElement } from './__test-helpers__/wdio-mocks'

import { waitForPickerIsShown, selectPickerValue } from './picker'

let mocks: ReturnType<typeof mockWdioGlobals>

beforeEach(() => {
  mocks = mockWdioGlobals()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('waitForPickerIsShown', () => {
  it('waits for the iOS picker wheel when on iOS', async () => {
    mocks.driver.isIOS = true
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await waitForPickerIsShown(true)
    expect(el.waitForExist).toHaveBeenCalledWith({ timeout: 11000, reverse: false })
  })

  it('waits for the Android list view when not on iOS', async () => {
    mocks.driver.isIOS = false
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await waitForPickerIsShown(false)
    expect(el.waitForExist).toHaveBeenCalledWith({ timeout: 11000, reverse: true })
  })

  it('throws via assertEle when the picker cannot be found', async () => {
    mocks.$.mockReturnValue(null)
    await expect(waitForPickerIsShown()).rejects.toThrow('Element not found')
  })
})

describe('selectPickerValue', () => {
  it('selects a value on iOS via the picker wheel and done button', async () => {
    mocks.driver.isIOS = true
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await selectPickerValue('foo')
    expect(el.addValue).toHaveBeenCalledWith('foo')
    expect(el.click).toHaveBeenCalled()
  })

  it('selects a value on Android via the list view', async () => {
    mocks.driver.isIOS = false
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await selectPickerValue('foo')
    expect(el.click).toHaveBeenCalled()
  })

  it('throws via assertEle when the Android row cannot be found', async () => {
    mocks.driver.isIOS = false
    mocks.$.mockReturnValueOnce(createMockElement()).mockReturnValueOnce(null)
    await expect(selectPickerValue('foo')).rejects.toThrow('Element not found')
  })
})
