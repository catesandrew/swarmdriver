import {
  DocumentReadyState,
  parseDocReadyState,
} from '../../enums'

import {
  FIFTEEN_SECONDS,
} from '../../constants'

export async function isPartMatch(urlPart) {
  const url = await browser.getUrl()
  return new RegExp(this.urlPart, 'i').test(url)
}

/**
 * Wait for the page to be fully loaded
 */
export async function waitForPageFullyLoaded() {
  return browser.waitUntil(
    async () => {
      const state = await browser.execute(() => {
        return document.readyState
      })

      return parseDocReadyState(state).value === DocumentReadyState.COMPLETE
    }, {
      timeout: FIFTEEN_SECONDS,
      timeoutMsg: `Expected to have page loaded within ${ FIFTEEN_SECONDS }ms`,
      interval: 100,
    })
}

export async function waitForUrl({
  part = '',
  timeout = FIFTEEN_SECONDS,
} = {}) {
  const re = new RegExp(part, 'i')
  return browser.waitUntil(async () => {
    const url = await browser.getUrl()

    return re.test(url)
  }, {
    timeout,
    timeoutMsg: `Expected to have page loaded with part ${ part } within ${ timeout }ms`,
    interval: 100,
  })
}

export async function openAndWaitForUrl({
  path = '',
  href = '',
  part = '',
} = {}) {
  // new URL('foo/bar', 'http://localhost:3000/baz') → http://localhost:3000/foo/bar
  // new URL('foo/bar', 'http://localhost:3000/baz/') → http://localhost:3000/baz/foo/bar
  // new URL('/foo/bar', 'http://localhost:3000/baz') → http://localhost:3000/foo/bar
  // new URL('/foo/bar', 'http://localhost:3000/baz/') → http://localhost:3000/foo/bar
  let url
  if (path) {
    url = new URL(path, browser.config.baseUrl)
  } else if (href) {
    url = new URL(href)
  }

  return browser.navigateTo(url.href)
  .then(() => {
    return part ?
      waitForUrl({
        part,
      }) :
      Promise.resolve()
  })
}

/**
 * Opens a sub page of the page
 * @param {string} path - path of the sub page (e.g. /path/to/page.html)
 * @returns {*}
 */
export async function open(path) {
  const url = new URL(path, browser.config.baseUrl)
  return browser.url(url.href)
}

/**
 * Get center coordinates for element
 * @param {string} elementId - the id of an element returned in a previous call to Find Element(s)
 * @returns {{x,y}} Returns an object representing the position and bounding rect of the element.
 */
export async function getCenterCoordsForElement(elementId) {
  const sourceRect = await browser.getElementRect(elementId)
  const x = parseInt(sourceRect.x + (sourceRect.width / 2), 10)
  const y = parseInt(sourceRect.y + (sourceRect.height / 2), 10)
  return {
    x,
    y,
  }
}

/**
 * Waits for an element to stop moving.
 * (can be used to wait for an animation to finish)
 * @param {Number} timeout
 * @param {String} timeoutMsg
 * @param {Number} interval
 */
export async function waitForAnimation(timeout, timeoutMsg, interval) {
  await this.waitForDisplayed()

  let lastCoords
  const stoppedMoving = async () => {
    if (!lastCoords) {
      lastCoords = await getCenterCoordsForElement(this.elementId)
      return false
    }

    const coords = await getCenterCoordsForElement(this.elementId)
    const notChanged = coords.x === lastCoords.x && coords.y === lastCoords.y
    lastCoords = coords
    return notChanged
  }

  return browser.waitUntil(stoppedMoving, {
    timeout,
    timeoutMsg,
    interval
  })
}

/**
 * Waits for an element to be clickable.
 * @param {Object} options - Options
 * @param {Number} options.timeout
 * @param {String} options.timeoutMsg
 * @param {Number} option.interval
 * @param {Boolean} options.reverse
 * @returns {*} Returns this
 */
export async function waitAnd(options) {
  await this.waitForClickable(options)
  return this
}

export async function waitAndClick() {
  await (await this.waitAnd()).click()
}

/**
 * Waits for an element and then add value.
 * @param {String} value
 */
export async function waitAndSetValue(value) {
  await (await this.waitAnd()).setValue(value)
}
