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

const log = buildLogger()

export default class Base {
  constructor(selector) {
    this.selector = selector
  }

  /**
   * Wait for the element to be shown
   *
   * @param {Element} element
   *
   * @returns {boolean}
   */
  async waitForIsShown({
    element = null,
    timeout = DEFAULT_SCREEN_TIMEOUT
  } = {}) {
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
   *
   * @param {Element} element
   *
   * @returns {boolean}
   */
  async waitForIsNotShown({
    element = null,
    timeout = DEFAULT_SCREEN_TIMEOUT
  } = {}) {
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
   *
   * @param {Element} element
   *
   * @returns {boolean}
   */
  async isShown(element) {
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
