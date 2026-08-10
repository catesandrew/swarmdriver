import {
  // findEle,
  findEleAndSel,
} from './utils'

import {
  buildLogger,
} from '../../logger'

import {
  DEFAULT_SCREEN_TIMEOUT,
} from '../../constants'

import type { WdioElement } from '../../types'

const log = buildLogger()

/** Options shared by this screen object's `waitFor*` methods. */
export interface BaseWaitOptions {
  element?: WdioElement | null
  timeout?: number
}

export default class Base {
  /**
   * A native locator string. Not the broader browser-side `Selector` — it is
   * handed to `findEleAndSel()`, which requires a string. See the note on
   * `ElementOrSelector` in `./utils.ts`.
   */
  selector: string

  constructor(selector: string) {
    this.selector = selector
  }

  /**
   * Wait for the element to be shown
   */
  async waitForIsShown({
    element = null,
    timeout = DEFAULT_SCREEN_TIMEOUT
  }: BaseWaitOptions = {}) {
    await driver.waitUntil(
      async () => (await this.isShown(element)) === true,
      {
        timeout,
        timeoutMsg: `The element "${ this.selector }", was not shown within the default timeout of ${ timeout }`,
      },
    )
  }

  /**
   * Wait for the element NOT to be displayed
   */
  async waitForIsNotShown({
    element = null,
    timeout = DEFAULT_SCREEN_TIMEOUT
  }: BaseWaitOptions = {}) {
    await driver.waitUntil(
      async () => (await this.isShown(element)) !== true,
      {
        timeout,
        timeoutMsg: `The element "${ this.selector }", was still shown within the default timeout of ${ timeout }`,
      },
    )
  }

  /**
   * Give back if the element is displayed
   */
  async isShown(element?: WdioElement | null): Promise<boolean> {
    // For android an element that is not visible is also not in the UI tree,
    // so a different approach should be used
    try {
      const { el, sel } = await findEleAndSel({
        element,
        selector: this.selector,
      })

      log.info('screen is shown', {
        selector: sel,
      })

      return el.isDisplayed()
    } catch (err) {
      log.warn('error in screen is shown', {
        selector: this.selector,
        name: err.name,
        message: err.message,
        stack: err.stack,
      })

      // Dont break the tests
      return false
    }
  }
}
