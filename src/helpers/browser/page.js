import {
  DEFAULT_PAGE_TIMEOUT,
} from '../../constants'

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 *
 * @param {string} selector - selector, js function, or matcher object to fetch a certain element
 * @param {string} urlPath - refers to the exact location of the page, post, file, or other asset
 */
export default class Page {
  constructor({
    selector,
    urlPart,
  } = {}) {
    this.selector = selector
    this.urlPart = urlPart
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
    timeout = DEFAULT_PAGE_TIMEOUT
  } = {}) {
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
   *
   * @param {Element} element
   *
   * @returns {boolean}
   */
  async waitForIsNotShown({
    element = null,
    timeout = DEFAULT_PAGE_TIMEOUT
  } = {}) {
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
   *
   * @param {Element} element
   *
   * @returns {boolean}
   */
  async isShown(element) {
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
