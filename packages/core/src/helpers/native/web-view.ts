import {
  DocumentReadyState,
  ContextRef,
} from '../../enums'

/**
 * Returns an object with the list of all available contexts
 *
 * @returns {object} An object containing the list of all available contexts
 */
export const getCurrentContexts = async () => {
  return driver.getContexts()
}

/**
 * Wait for the webview context to be loaded
 *
 * By default you have `NATIVE_APP` as the current context. If a webview is loaded it will be
 * added to the current contexts and will looks something like this
 * `["NATIVE_APP","WEBVIEW_28158.2"]`
 * The number behind `WEBVIEW` can be any string
 */
export const waitForWebViewContextLoaded = async () => {
  await driver.waitUntil(
    async () => {
      const currentContexts = await getCurrentContexts()

      return (
        currentContexts.length > 1 &&
        currentContexts.find((context: string) =>
          context.toLowerCase().includes(ContextRef.props[ContextRef.WEBVIEW].code)
        )
      )
    }, {
      // Wait a max of 45 seconds. Reason for this high amount is that loading
      // a webview for iOS might take longer
      timeout: 45000,
      timeoutMsg: 'Webview context not loaded',
      interval: 100,
    }
  )
}

/**
 * Switch to native or webview context. `context` is `ContextRef.NATIVE` or
 * `ContextRef.WEBVIEW`'s numeric value.
 */
export const switchToContext = async (context: number) => {
  // The first context will always be the NATIVE_APP,
  // the second one will always be the WebdriverIO web page
  const currentContexts = await getCurrentContexts()
  return driver.switchContext(currentContexts[context === ContextRef.NATIVE ? 0 : 1])
}

/**
 * Finds the WebView Context. `context` is the enum's string `code`
 * (`'native'` or `'webview'`) — a different type from {@link switchToContext}'s
 * numeric `context`.
 */
export const findWebviewContext = async (context: string) => {
  const currentContexts = await getCurrentContexts()
  if (context === 'native' || currentContexts.length === 1) {
    return 'NATIVE_APP'
  }

  return currentContexts.find(
    (ctx: string) => ctx !== 'WEBVIEW_chrome' && ctx.toLowerCase().includes(context),
  )
}
/**
 * Wait for the document to be full loaded
 */
export const waitForDocumentFullyLoaded = async () => {
  await driver.waitUntil(
    // A webpage can have multiple states, the ready state is the one we need to have.
    // This looks like the same implementation as for the w3c implementation for `browser.url('https://webdriver.io')`
    // That command also waits for the readiness of the page, see also the w3c specs
    // https://www.w3.org/TR/webdriver/#dfn-waiting-for-the-navigation-to-complete
    async () => {
      return (await driver.execute(() => document.readyState)) ===
        DocumentReadyState.props[DocumentReadyState.COMPLETE].code
    },
    {
      timeout: 15000,
      timeoutMsg: 'Website not loaded',
      interval: 100,
    },
  )
}

/**
 * Wait for the website in the webview to be loaded
 */
export const waitForWebsiteLoaded = async () => {
  await waitForWebViewContextLoaded()
  await switchToContext(ContextRef.WEBVIEW)
  await waitForDocumentFullyLoaded()
  await switchToContext(ContextRef.NATIVE)
}
