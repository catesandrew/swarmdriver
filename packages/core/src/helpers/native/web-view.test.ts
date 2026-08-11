import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockWdioGlobals } from './__test-helpers__/wdio-mocks'
import { ContextRef } from '../../enums'

import {
  getCurrentContexts,
  waitForWebViewContextLoaded,
  switchToContext,
  findWebviewContext,
  waitForDocumentFullyLoaded,
  waitForWebsiteLoaded,
} from './web-view'

let mocks: ReturnType<typeof mockWdioGlobals>

beforeEach(() => {
  mocks = mockWdioGlobals({
    driver: {
      getContexts: vi.fn().mockResolvedValue(['NATIVE_APP']),
      switchContext: vi.fn().mockResolvedValue(undefined),
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getCurrentContexts', () => {
  it('returns the list of contexts from the driver', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP', 'WEBVIEW_1'])
    await expect(getCurrentContexts()).resolves.toEqual(['NATIVE_APP', 'WEBVIEW_1'])
  })
})

describe('waitForWebViewContextLoaded', () => {
  it('resolves once a webview context appears', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP', 'WEBVIEW_28158.2'])
    await expect(waitForWebViewContextLoaded()).resolves.toBeUndefined()
  })

  it('rejects with the configured timeout message while only native is present', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP'])
    await expect(waitForWebViewContextLoaded()).rejects.toThrow('Webview context not loaded')
  })
})

describe('switchToContext', () => {
  it('switches to the native context (numeric ContextRef.NATIVE)', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP', 'WEBVIEW_1'])
    await switchToContext(ContextRef.NATIVE)
    expect(mocks.driver.switchContext).toHaveBeenCalledWith('NATIVE_APP')
  })

  it('switches to the webview context (numeric ContextRef.WEBVIEW)', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP', 'WEBVIEW_1'])
    await switchToContext(ContextRef.WEBVIEW)
    expect(mocks.driver.switchContext).toHaveBeenCalledWith('WEBVIEW_1')
  })
})

describe('findWebviewContext', () => {
  it('returns NATIVE_APP for the string "native"', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP', 'WEBVIEW_1'])
    await expect(findWebviewContext('native')).resolves.toBe('NATIVE_APP')
  })

  it('returns NATIVE_APP when only one context is present', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP'])
    await expect(findWebviewContext('webview')).resolves.toBe('NATIVE_APP')
  })

  it('finds a matching webview context by substring, skipping WEBVIEW_chrome', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP', 'WEBVIEW_chrome', 'WEBVIEW_28158.2'])
    await expect(findWebviewContext('webview')).resolves.toBe('WEBVIEW_28158.2')
  })
})

describe('waitForDocumentFullyLoaded', () => {
  it('resolves once document.readyState reports complete', async () => {
    mocks.driver.execute = vi.fn().mockResolvedValue('complete')
    await expect(waitForDocumentFullyLoaded()).resolves.toBeUndefined()
  })

  it('rejects with the configured timeout message otherwise', async () => {
    mocks.driver.execute = vi.fn().mockResolvedValue('loading')
    await expect(waitForDocumentFullyLoaded()).rejects.toThrow('Website not loaded')
  })
})

describe('waitForWebsiteLoaded', () => {
  it('switches to webview, waits for the document, then switches back to native', async () => {
    mocks.driver.getContexts.mockResolvedValue(['NATIVE_APP', 'WEBVIEW_1'])
    mocks.driver.switchContext = vi.fn().mockResolvedValue(undefined)
    mocks.driver.execute = vi.fn().mockResolvedValue('complete')

    await waitForWebsiteLoaded()

    expect(mocks.driver.switchContext).toHaveBeenNthCalledWith(1, 'WEBVIEW_1')
    expect(mocks.driver.switchContext).toHaveBeenNthCalledWith(2, 'NATIVE_APP')
  })
})
