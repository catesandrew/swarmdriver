import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockWdioGlobals, createMockElement } from './__test-helpers__/wdio-mocks'

import {
  getNativeAlert,
  waitForNativeAlertIsShown,
  pressNativeAlertButton,
  getNativeAlertText,
} from './alert'

let mocks: ReturnType<typeof mockWdioGlobals>

beforeEach(() => {
  mocks = mockWdioGlobals()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getNativeAlert', () => {
  it('looks up the iOS alert selector', async () => {
    mocks.driver.isAndroid = false
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(getNativeAlert()).resolves.toBe(el)
    expect(mocks.$).toHaveBeenCalledWith("-ios predicate string:type == 'XCUIElementTypeAlert'")
  })

  it('looks up the Android alert title selector', async () => {
    mocks.driver.isAndroid = true
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await getNativeAlert()
    expect(mocks.$).toHaveBeenCalledWith('*//android.widget.TextView[@resource-id="android:id/alertTitle"]')
  })
})

describe('waitForNativeAlertIsShown', () => {
  it('waits for the alert element to exist', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await waitForNativeAlertIsShown()
    expect(el.waitForExist).toHaveBeenCalledWith({ timeout: 11000, reverse: false })
  })

  it('waits in reverse when requested', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await waitForNativeAlertIsShown(true)
    expect(el.waitForExist).toHaveBeenCalledWith({ timeout: 11000, reverse: true })
  })
})

describe('pressNativeAlertButton', () => {
  it('clicks the accessibility-id button on iOS', async () => {
    mocks.driver.isAndroid = false
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await pressNativeAlertButton('OK')
    expect(mocks.$).toHaveBeenCalledWith('~OK')
    expect(el.click).toHaveBeenCalled()
  })

  it('clicks the uppercased text button on Android', async () => {
    mocks.driver.isAndroid = true
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await pressNativeAlertButton('ok')
    expect(mocks.$).toHaveBeenCalledWith('*//android.widget.Button[@text="OK"]')
    expect(el.click).toHaveBeenCalled()
  })
})

describe('getNativeAlertText', () => {
  it('reads the alert text directly on iOS', async () => {
    mocks.driver.isIOS = true
    mocks.driver.getAlertText = vi.fn().mockResolvedValue('Are you sure?')
    await expect(getNativeAlertText()).resolves.toBe('Are you sure?')
  })

  it('concatenates title and message on Android', async () => {
    mocks.driver.isIOS = false
    const titleEl = createMockElement()
    titleEl.getText.mockResolvedValue('Warning')
    const messageEl = createMockElement()
    messageEl.getText.mockResolvedValue('Are you sure?')
    mocks.$.mockReturnValueOnce(titleEl).mockReturnValueOnce(messageEl)
    await expect(getNativeAlertText()).resolves.toBe('Warning\nAre you sure?')
  })
})
