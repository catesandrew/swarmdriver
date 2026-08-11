import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs'

import { mockWdioGlobals, createMockElement } from './__test-helpers__/wdio-mocks'

import {
  buildSelector,
  assertEle,
  findEle,
  findEleAndSel,
  findEles,
  prettyPageSource,
  getAppState,
  restartApp,
  startApp,
  switchToApp,
  getTextOfElement,
  getTextOfElements,
  saveScreenshotWithPath,
  androidOpenWebPageWithBrowserOnce,
  browserIsOpened,
  hideSoftKeyboard,
  openDeepLinkUrl,
  allowPermissions,
  androidExecAdbCommand,
  androidFindElementByText,
  androidWaitAndClick,
  isShown,
  isEnabled,
  areAnyShown,
  areAllShown,
  waitForAnyShown,
  waitForAllShown,
  waitForIsShown,
  waitForIsNotShown,
  waitForCondition,
  PRESSED_STATE_DURATION,
  DEFAULT_LONG_PRESS_TIMEOUT,
  tapAtPoint,
  tapElement,
  tapAllAroundElement,
  captureDebug,
  enterStringOnKeyboard,
  enterCharOnKeyboard,
  returnOnKeyboard,
} from './utils'

let mocks: ReturnType<typeof mockWdioGlobals>

beforeEach(() => {
  mocks = mockWdioGlobals()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('buildSelector', () => {
  it('prefixes an id selector for Android', () => {
    mocks.driver.isAndroid = true
    mocks.driver.capabilities = { appPackage: 'com.example.app' }
    expect(buildSelector('foo')).toBe('id=com.example.app:id/foo')
  })

  it('prefixes an id selector for iOS without the package', () => {
    mocks.driver.isAndroid = false
    expect(buildSelector('foo')).toBe('id=foo')
  })

  it('passes an xpath selector through unchanged', () => {
    expect(buildSelector('//div')).toBe('//div')
  })
})

describe('assertEle', () => {
  it('returns the element when it is not false', () => {
    const el = createMockElement()
    expect(assertEle(el, 'sel')).toBe(el)
  })

  it('throws a named error when the element is false', () => {
    expect(() => assertEle(false, 'my-selector')).toThrow('Element not found: my-selector')
  })

  it('throws with a fallback message when no selector is given', () => {
    expect(() => assertEle(false)).toThrow('Element not found: unknown selector')
  })
})

describe('findEle', () => {
  it('returns the element when found', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(findEle('foo')).resolves.toBe(el)
  })

  it('returns false when $ resolves falsy', async () => {
    mocks.$.mockReturnValue(null)
    await expect(findEle('foo')).resolves.toBe(false)
  })

  it('returns false when the element carries an error', async () => {
    mocks.$.mockReturnValue(createMockElement({ error: 'not found' }))
    await expect(findEle('foo')).resolves.toBe(false)
  })

  it('returns false when $ throws', async () => {
    mocks.$.mockImplementation(() => {
      throw new Error('boom')
    })
    await expect(findEle('foo')).resolves.toBe(false)
  })
})

describe('findEleAndSel', () => {
  it('resolves the element and selector when given a selector', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    const result = await findEleAndSel({ selector: 'foo' })
    expect(result.el).toBe(el)
    expect(typeof result.sel).toBe('string')
  })

  it('resolves using an already-held element', async () => {
    const el = createMockElement({ selector: 'held-selector' })
    const result = await findEleAndSel({ element: el })
    expect(result.el).toBe(el)
    expect(result.sel).toBe('held-selector')
  })

  it('propagates false when the element cannot be found', async () => {
    mocks.$.mockReturnValue(null)
    const result = await findEleAndSel({ selector: 'foo' })
    expect(result.el).toBe(false)
  })
})

describe('findEles', () => {
  it('returns the elements array when found', async () => {
    const els = [createMockElement()]
    mocks.$$.mockReturnValue(els)
    await expect(findEles('foo')).resolves.toBe(els)
  })

  it('returns false when no elements are found', async () => {
    mocks.$$.mockReturnValue([])
    await expect(findEles('foo')).resolves.toBe(false)
  })

  it('returns false when $$ throws', async () => {
    mocks.$$.mockImplementation(() => {
      throw new Error('boom')
    })
    await expect(findEles('foo')).resolves.toBe(false)
  })
})

describe('prettyPageSource', () => {
  it('slices and de-indents the page source', () => {
    mocks.driver.execute.mockReturnValue('  <a/>\n  <b/>\n  <c/>')
    expect(prettyPageSource(1, 3)).toBe('<b/>\n<c/>')
  })
})

describe('getAppState', () => {
  it('resolves the parsed app state value on iOS', async () => {
    mocks.driver.isIOS = true
    mocks.driver.execute.mockResolvedValue(4)
    await expect(getAppState('com.example.app')).resolves.toBe(4)
  })

  it('resolves via queryAppState on Android', async () => {
    mocks.driver.isAndroid = true
    mocks.driver.isIOS = false
    mocks.driver.queryAppState.mockResolvedValue(4)
    await expect(getAppState('com.example.app')).resolves.toBe(4)
  })

  it('falls back to NOT_INSTALLED on rejection', async () => {
    mocks.driver.isIOS = true
    mocks.driver.execute.mockRejectedValue(new Error('boom'))
    await expect(getAppState('com.example.app')).resolves.toBe(0)
  })
})

describe('restartApp', () => {
  it('terminates and reactivates the app when not the first start', async () => {
    mocks.driver.firstAppStart = false
    mocks.driver.isIOS = true
    await restartApp('com.example.app')
    expect(mocks.driver.execute).toHaveBeenCalled()
  })

  it('skips reset on the first app start', async () => {
    mocks.driver.firstAppStart = true
    await restartApp('com.example.app')
    expect(mocks.driver.firstAppStart).toBe(false)
  })
})

describe('startApp', () => {
  it('launches via mobile: launchApp on iOS', async () => {
    mocks.driver.isIOS = true
    await startApp('com.example.app')
    expect(mocks.driver.execute).toHaveBeenCalledWith('mobile: launchApp', { bundleId: 'com.example.app' })
  })

  it('starts the activity on Android', async () => {
    mocks.driver.isIOS = false
    mocks.driver.env = { APP_ACTIVITY: '.MainActivity' }
    await startApp('com.example.app')
    expect(mocks.driver.startActivity).toHaveBeenCalled()
  })
})

describe('switchToApp', () => {
  it('activates the resolved bundle id', async () => {
    mocks.driver.isIOS = true
    await switchToApp('com.example.app')
    expect(mocks.driver.execute).toHaveBeenCalledWith('mobile: activateApp', { bundleId: 'com.example.app' })
  })
})

describe('getTextOfElement', () => {
  it('trims and returns the android concatenated text', async () => {
    mocks.driver.isAndroid = true
    const textView = createMockElement()
    textView.getText.mockResolvedValue('hello')
    const element = createMockElement({
      $$: vi.fn().mockResolvedValue([textView]),
    })
    await expect(getTextOfElement({ element })).resolves.toBe('hello')
  })

  it('returns the ios element text directly', async () => {
    mocks.driver.isAndroid = false
    const element = createMockElement()
    element.getText.mockResolvedValue('  ios text  ')
    await expect(getTextOfElement({ element })).resolves.toBe('ios text')
  })

  it('falls back to empty string on rejection', async () => {
    mocks.driver.isAndroid = false
    const element = createMockElement()
    element.getText.mockRejectedValue(new Error('boom'))
    await expect(getTextOfElement({ element })).resolves.toBe('')
  })
})

describe('getTextOfElements', () => {
  it('resolves the text of every element', async () => {
    mocks.driver.isAndroid = false
    const elements = [createMockElement(), createMockElement()]
    elements[0].getText.mockResolvedValue('one')
    elements[1].getText.mockResolvedValue('two')
    await expect(getTextOfElements({ elements })).resolves.toEqual(['one', 'two'])
  })
})

describe('saveScreenshotWithPath', () => {
  it('saves a screenshot and returns the route', async () => {
    const route = await saveScreenshotWithPath('/tmp')
    expect(mocks.driver.saveScreenshot).toHaveBeenCalledWith(route)
  })
})

describe('androidOpenWebPageWithBrowserOnce', () => {
  it('clicks the just-once button when enabled', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await androidOpenWebPageWithBrowserOnce()
    expect(el.isEnabled).toHaveBeenCalled()
  })
})

describe('browserIsOpened', () => {
  it('checks app state on iOS', async () => {
    mocks.driver.isIOS = true
    mocks.driver.execute.mockResolvedValue(3)
    await expect(browserIsOpened()).resolves.toBe(true)
  })

  it('checks the current activity on Android', async () => {
    mocks.driver.isIOS = false
    mocks.driver.isAndroid = true
    mocks.driver.getCurrentActivity.mockResolvedValue('com.android.chrome/.WebViewBrowserActivity')
    await expect(browserIsOpened()).resolves.toBe(true)
  })
})

describe('hideSoftKeyboard', () => {
  it('does nothing when the keyboard is not shown', async () => {
    mocks.driver.isKeyboardShown.mockResolvedValue(false)
    await hideSoftKeyboard(createMockElement())
    expect(mocks.driver.hideKeyboard).not.toHaveBeenCalled()
  })

  it('hides the keyboard on Android', async () => {
    mocks.driver.isKeyboardShown.mockResolvedValue(true)
    mocks.driver.isIOS = false
    await hideSoftKeyboard(createMockElement())
    expect(mocks.driver.hideKeyboard).toHaveBeenCalled()
  })
})

describe('openDeepLinkUrl', () => {
  it('uses mobile:deepLink on Android', async () => {
    mocks.driver.isAndroid = true
    await openDeepLinkUrl('com.example.app', 'path/to/screen')
    expect(mocks.driver.execute).toHaveBeenCalledWith('mobile:deepLink', {
      url: 'hmma://path/to/screen',
      package: 'com.example.app',
    })
  })
})

describe('allowPermissions', () => {
  it('clicks the allow button on Android', async () => {
    mocks.driver.isAndroid = true
    const el = createMockElement()
    mocks.driver.element.mockResolvedValue(el)
    await allowPermissions()
    expect(el.click).toHaveBeenCalled()
  })
})

describe('androidExecAdbCommand', () => {
  it('shells the given command', async () => {
    await androidExecAdbCommand('input text 1234')
    expect(mocks.driver.execute).toHaveBeenCalledWith('mobile: shell', { command: 'input text 1234' })
  })
})

describe('androidFindElementByText', () => {
  it('finds an element via UiSelector textContains', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(androidFindElementByText('Login')).resolves.toBe(el)
  })
})

describe('androidWaitAndClick', () => {
  it('waits for and clicks the found element', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await androidWaitAndClick('Login')
    expect(el.waitForDisplayed).toHaveBeenCalled()
    expect(el.click).toHaveBeenCalled()
  })
})

describe('isShown', () => {
  it('returns true when the element is displayed', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(isShown({ selector: 'foo' })).resolves.toBe(true)
  })

  it('returns false when the element cannot be found', async () => {
    mocks.$.mockReturnValue(null)
    await expect(isShown({ selector: 'foo' })).resolves.toBe(false)
  })

  it('returns false on rejection', async () => {
    mocks.$.mockImplementation(() => {
      throw new Error('boom')
    })
    await expect(isShown({ selector: 'foo' })).resolves.toBe(false)
  })
})

describe('isEnabled', () => {
  it('returns true when the element is enabled', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(isEnabled({ selector: 'foo' })).resolves.toBe(true)
  })
})

describe('areAnyShown', () => {
  it('returns truthy when at least one element is shown', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(areAnyShown({ selectors: ['foo', 'bar'] })).resolves.toBeTruthy()
  })
})

describe('areAllShown', () => {
  it('returns true when every element is shown', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(areAllShown({ selectors: ['foo', 'bar'] })).resolves.toBe(true)
  })
})

describe('waitForAnyShown', () => {
  it('resolves once any selector is shown', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(waitForAnyShown({ selectors: ['foo'] })).resolves.toBeTruthy()
  })
})

describe('waitForAllShown', () => {
  it('resolves once every selector is shown', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(waitForAllShown({ selectors: ['foo'] })).resolves.toBe(true)
  })
})

describe('waitForIsShown', () => {
  it('resolves once the element is shown', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await expect(waitForIsShown({ selector: 'foo' })).resolves.toBe(true)
  })
})

describe('waitForIsNotShown', () => {
  it('resolves once the element is not shown', async () => {
    mocks.$.mockReturnValue(null)
    await expect(waitForIsNotShown({ selector: 'foo' })).resolves.toBe(true)
  })
})

describe('waitForCondition', () => {
  it('resolves once the condition is met', async () => {
    await expect(waitForCondition({ condition: () => true })).resolves.toBe(true)
  })
})

describe('constants', () => {
  it('exports the pressed-state timing constants', () => {
    expect(PRESSED_STATE_DURATION).toBe(125)
    expect(DEFAULT_LONG_PRESS_TIMEOUT).toBe(500)
  })
})

describe('tapAtPoint', () => {
  it('performs a tap action at the given coordinates', async () => {
    await tapAtPoint({ x: 10, y: 20 })
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('tapElement', () => {
  it('taps the resolved element at the percentage offset', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await tapElement({ selector: 'foo' })
    expect(mocks.driver.getElementRect).toHaveBeenCalledWith(el.elementId)
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('throws via assertEle when the element cannot be found', async () => {
    mocks.$.mockReturnValue(null)
    await expect(tapElement({ selector: 'foo' })).rejects.toThrow('Element not found')
  })
})

describe('tapAllAroundElement', () => {
  it('taps around the element until check() is satisfied', async () => {
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await tapAllAroundElement({
      selector: 'foo',
      check: () => true,
    })
    expect(mocks.driver.waitUntil).toHaveBeenCalled()
  })
})

describe('captureDebug', () => {
  it('captures logs, source, and a screenshot', async () => {
    const writeFileSpy = vi.spyOn(fs, 'writeFile').mockImplementation(((...args: any[]) => {
      const cb = args[args.length - 1]
      cb(null)
    }) as any)

    await captureDebug({ desc: 'my test' })
    expect(mocks.driver.takeScreenshot).toHaveBeenCalled()
    expect(writeFileSpy).toHaveBeenCalled()

    writeFileSpy.mockRestore()
  })
})

describe('enterStringOnKeyboard', () => {
  it('performs a key action per character', async () => {
    await enterStringOnKeyboard('hi')
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('enterCharOnKeyboard', () => {
  it('performs a single key action', async () => {
    await enterCharOnKeyboard('a')
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })
})

describe('returnOnKeyboard', () => {
  it('sends the return key action on Android', async () => {
    mocks.driver.isAndroid = true
    await returnOnKeyboard()
    expect(mocks.driver.performActions).toHaveBeenCalled()
  })

  it('clicks the return-like button on iOS', async () => {
    mocks.driver.isAndroid = false
    const el = createMockElement()
    mocks.$.mockReturnValue(el)
    await returnOnKeyboard()
    expect(el.click).toHaveBeenCalled()
  })
})
