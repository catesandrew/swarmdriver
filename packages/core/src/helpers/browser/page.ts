import {
  DEFAULT_PAGE_TIMEOUT,
} from '../../constants'

import type { Selector, WdioElement } from '../../types'

export interface PageOptions {
  /** selector, js function, or matcher object to fetch a certain element */
  selector?: Selector
  /** the exact location of the page, post, file, or other asset */
  urlPart?: string
}

/** Options shared by this page object's `waitFor*` methods. */
export interface PageWaitOptions {
  element?: WdioElement | null
  timeout?: number
}

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
  selector?: Selector

  urlPart?: string

  constructor({
    selector,
    urlPart,
  }: PageOptions = {}) {
    this.selector = selector
    this.urlPart = urlPart
  }

  /**
   * Wait for the element to be shown
   */
  async waitForIsShown({
    element = null,
    timeout = DEFAULT_PAGE_TIMEOUT
  }: PageWaitOptions = {}) {
    return Promise.resolve(element || $(this.selector))
    .then((ele) => {
      return browser.waitUntil(
        async () => (await this.isShown(ele)) === true,
        {
          timeout,
          timeoutMsg: `The element "${ ele.selector }", was still shown within the default timeout of ${ timeout }`,
        },
      )
    })
  }

  /**
   * Wait for the element NOT to be displayed
   */
  async waitForIsNotShown({
    element = null,
    timeout = DEFAULT_PAGE_TIMEOUT
  }: PageWaitOptions = {}) {
    return Promise.resolve(element || $(this.selector))
    .then((ele) => {
      return browser.waitUntil(
        async () => (await this.isShown(ele)) !== true,
        {
          timeout,
          timeoutMsg: `The element "${ ele.selector }", was still shown within the default timeout of ${ timeout }`,
        },
      )
    })
  }

  /**
   * Give back if the element is displayed
   */
  async isShown(element?: WdioElement | null): Promise<boolean> {
    return Promise.resolve(element || $(this.selector))
    .then((ele) => {
      return ele.isDisplayed()
    })
    .catch((err) => {
      // Dont break the tests
      return false
    })
  }
}
