import { vi } from 'vitest'

/**
 * Shared vitest mock for the WDIO testrunner globals (`driver`, `$`, `$$`).
 *
 * These are declared ambient `any` in `../../globals.d.ts` because every
 * native helper is itself registered onto the session as a custom command
 * (see `services/utils.ts#addCommands`) — see that file's own doc comment
 * for the full rationale. Tests stub them via `vi.stubGlobal` rather than
 * importing them, matching how the testrunner injects them at runtime.
 */

export interface MockElement {
  elementId: string
  selector?: string
  error?: unknown
  isDisplayed: ReturnType<typeof vi.fn>
  isEnabled: ReturnType<typeof vi.fn>
  isExisting: ReturnType<typeof vi.fn>
  click: ReturnType<typeof vi.fn>
  addValue: ReturnType<typeof vi.fn>
  getText: ReturnType<typeof vi.fn>
  waitForExist: ReturnType<typeof vi.fn>
  waitForDisplayed: ReturnType<typeof vi.fn>
  $$: ReturnType<typeof vi.fn>
  [key: string]: any
}

export const createMockElement = (overrides: Partial<MockElement> = {}): MockElement => ({
  elementId: 'mock-element-id',
  selector: 'mock-selector',
  isDisplayed: vi.fn().mockResolvedValue(true),
  isEnabled: vi.fn().mockResolvedValue(true),
  isExisting: vi.fn().mockResolvedValue(true),
  click: vi.fn().mockResolvedValue(undefined),
  addValue: vi.fn().mockResolvedValue(undefined),
  getText: vi.fn().mockResolvedValue('mock text'),
  waitForExist: vi.fn().mockResolvedValue(true),
  waitForDisplayed: vi.fn().mockResolvedValue(true),
  $$: vi.fn().mockResolvedValue([]),
  ...overrides,
})

export const createMockDriver = (overrides: Record<string, any> = {}): Record<string, any> => ({
  isAndroid: false,
  isIOS: true,
  firstAppStart: true,
  capabilities: {},
  env: {},
  WDIO_TEST_IT_MODE: undefined,
  execute: vi.fn().mockResolvedValue(undefined),
  waitUntil: vi.fn(async (condition: () => any, options: { timeoutMsg?: string } = {}) => {
    const result = await condition()
    if (!result) {
      throw new Error(options.timeoutMsg || 'mock waitUntil timeout')
    }

    return result
  }),
  pause: vi.fn().mockResolvedValue(undefined),
  terminateApp: vi.fn().mockResolvedValue(undefined),
  activateApp: vi.fn().mockResolvedValue(undefined),
  queryAppState: vi.fn().mockResolvedValue(1),
  startActivity: vi.fn().mockResolvedValue(undefined),
  getElementRect: vi.fn().mockResolvedValue({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  }),
  performActions: vi.fn().mockResolvedValue(undefined),
  getWindowRect: vi.fn().mockResolvedValue({
    width: 1000,
    height: 2000,
  }),
  setOrientation: vi.fn().mockResolvedValue(undefined),
  saveScreenshot: vi.fn().mockResolvedValue(undefined),
  takeScreenshot: vi.fn().mockResolvedValue('base64data'),
  getCurrentActivity: vi.fn().mockResolvedValue(''),
  isKeyboardShown: vi.fn().mockResolvedValue(false),
  hideKeyboard: vi.fn().mockResolvedValue(undefined),
  back: vi.fn().mockResolvedValue(undefined),
  getLogs: vi.fn().mockResolvedValue([]),
  getPageSource: vi.fn().mockResolvedValue(''),
  element: vi.fn().mockResolvedValue(createMockElement()),
  ...overrides,
})

export interface MockWdioGlobalsOverrides {
  driver?: Record<string, any>
  $?: ReturnType<typeof vi.fn>
  $$?: ReturnType<typeof vi.fn>
}

/**
 * Stub `driver`/`$`/`$$` for the duration of a test. Call `vi.unstubAllGlobals()`
 * in an `afterEach` to reset them (this repo's tests do not use `restoreMocks`
 * for globals, so cleanup is the caller's responsibility).
 */
export const mockWdioGlobals = (overrides: MockWdioGlobalsOverrides = {}) => {
  const driver = createMockDriver(overrides.driver)
  const dollar = overrides.$ ?? vi.fn().mockReturnValue(createMockElement())
  const dollarDollar = overrides.$$ ?? vi.fn().mockReturnValue([createMockElement()])

  vi.stubGlobal('driver', driver)
  vi.stubGlobal('$', dollar)
  vi.stubGlobal('$$', dollarDollar)

  return {
    driver,
    $: dollar,
    $$: dollarDollar,
  }
}
