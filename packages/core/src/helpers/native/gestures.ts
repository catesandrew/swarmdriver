import { ScrollDirection } from '../../enums'
import {
  findEleAndSel,
} from './utils'

import {
  buildLogger,
} from '../../logger'

import type {
  PercentPoint,
  Point,
  ScreenRect,
  WdioElement,
} from '../../types'

const log = buildLogger()

/** A gesture between two absolute screen points. */
export interface SwipeOptions {
  from?: Point
  to?: Point
  duration?: number
}

/** A gesture between two points given as percentages of the screen. */
export interface SwipeOnPercentageOptions {
  from?: Point
  to?: Point
}

/**
 * A gesture between two fractional points.
 *
 * `size` is the cached result of `driver.getWindowRect()`. Passing it in lets a
 * caller doing many gestures in a row avoid a round trip to the device per
 * gesture; when omitted these helpers fetch it themselves.
 */
export interface SwipePercentageOptions {
  from?: PercentPoint
  to?: PercentPoint
  duration?: number
  size?: ScreenRect
}

/** Absolute-coordinate gesture, in the `start`/`end` spelling. */
export interface SwipeActionOptions {
  start?: Point
  end?: Point
  duration?: number
}

/** A whole-screen page-turn gesture. */
export interface SwipeScreenOptions {
  duration?: number
  landscape?: boolean
  size?: ScreenRect
}

/** A gesture along one of the {@link ScrollDirection} axes. */
export interface SwipeOnDirectionOptions {
  direction?: number
  distance?: number
  duration?: number
  size?: ScreenRect
}

/** {@link SwipeOnDirectionOptions} with the direction already fixed. */
export interface ScrollDirectionlessOptions {
  distance?: number
  duration?: number
  size?: ScreenRect
}

/**
 * Scroll until a single element comes into view.
 *
 * `selector` is a `string` rather than the broader `Selector`, matching
 * `findEleAndSel()` in `./utils.ts` — see the note on `ElementOrSelector`
 * there for why the native path is string-only.
 */
export interface ScrollToElementOptions {
  element?: WdioElement | null
  selector?: string
  maxScrolls?: number
  amount?: number
  scrollDirection?: number
  distance?: number
  size?: ScreenRect
}

/** Scroll until every element in `selectors` has come into view. */
export interface ScrollToElementsOptions {
  selectors?: string[]
  maxScrolls?: number
  amount?: number
  scrollDirection?: number
  distance?: number
  size?: ScreenRect
}

/** Scroll down looking for one element. */
export interface CheckIfDisplayedWithScrollDownOptions {
  element?: WdioElement | null
  selector?: string
  maxScrolls?: number
  amount?: number
}

/**
 * The values in the below object are percentages of the screen
 */
const SWIPE_DIRECTION = {
  down: {
    start: {
      x: 50,
      y: 35
    },

    end: {
      x: 50,
      y: 85
    }
  },
  left: {
    start: {
      x: 95,
      y: 50
    },
    end: {
      x: 5,
      y: 50
    }
  },
  right: {
    start: {
      x: 5,
      y: 50
    },
    end: {
      x: 95,
      y: 50
    }
  },
  up: {
    start: {
      x: 50,
      y: 85
    },
    end: {
      x: 50,
      y: 15
    }
  }
}

/**
 * An object representing the screen size in width and height.
 *
 * @typedef {Object} ScreenSize
 * @property {number} width - The width.
 * @property {number} height - The height.
 */

/**
 * An object representing coordinates with x and y values.
 *
 * @typedef {Object} Coordinates
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 */

/**
 * Get the screen coordinates based on a device his screensize
 *
 * @param {ScreenSize} screenSize - The size of the screen.
 * @param {Coordinates} coordinates - Coordinates object.
 * @returns {Coordinates} Returns an object with calculated screen coordinates.
 * @throws {TypeError} Throws a type error if screenSize is not a number or coordinates are not provided.
 * @throws {RangeError} Throws a range error if the coordinate values are outside the valid percentage range (0-100).
 * @private
 */
const getDeviceScreenCoordinates = (screenSize, coordinates) => {
  return {
    x: Math.round(screenSize.width * (coordinates.x / 100)),
    y: Math.round(screenSize.height * (coordinates.y / 100))
  }
}

/**
 * Calculate the x y coordinates based on a percentage
 *
 * @param {object} coordinates
 * @param {number} percentage
 *
 * @returns {{x: number, y: number}}
 *
 * @private
 */
const calculateXY = ({ x, y }, percentage) => {
  return {
    x: x * percentage,
    y: y * percentage
  }
}

const ANDROID_SCROLL_DIVISOR = 3
const SCROLL_DUR = 1000
const SCROLL_RATIO = 0.8

/**
 * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
 * This is the newer version of swipe that uses the actions API.
 *
 * @param {Coordinates} from `&#123;x: 50, y: 50}`
 * @param {Coordinates} to `&#123;x: 25, y: 25}`
 * @param {number} duration
 *
 * @example
 * ``` js
 * // This is a swipe to the left
 * const from = { x: 50, y:50 }
 * const to = { x: 25, y:50 }
 * ```
 */
export const swipe = async ({
  from = {
    x: 0,
    y: 0,
  },
  to = {
    x: 0,
    y: 0,
  },
  duration = SCROLL_DUR,
}: SwipeOptions = {}) => {
  // Everything we want to do (scrolling, swiping) can be conceived of at the
  //   root as an action with basically 4 steps:
  // 1. Move the finger to a location above the screen
  // 2. Touch the finger to the screen
  // 3. While touching the screen, move the finger to another location, taking a
  //    certain amount of time to do so
  // 4. Lift the finger off the screen

  // http://appium.io/docs/en/commands/interactions/actions/
  return driver.performActions([
    {
      // a. Create the event
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        // b. Move finger into start position
        {
          type: 'pointerMove',
          duration: 0,
          x: from.x,
          y: from.y,
        },
        // c. Finger comes down into contact with screen
        {
          type: 'pointerDown',
          button: 0,
        },
        // d. For iOS, the duration of the pointer move is not actually encoded on
        // the move action at all; it is encoded on a pause action which is
        // inserted before the move action, which is why we are adding that action
        // here if we're using iOS (before then setting the duration to zero for
        // the actual move).
        ...(driver.isIOS ?
          [
            {
              type: 'pause',
              duration: 200,
            },
          ] :
          []),
        // e. Finger moves to end position
        //    We move our finger from the center of the element to the
        //    starting position of the element.
        //    Play with the duration to make the swipe go slower / faster
        //
        // For Android, I've noticed that the actual time taken by the action is
        // always much greater than the amount of time we actually specify. This
        // may not be true across the board, but I defined a static variable
        // ANDROID_SCROLL_DIVISOR to represent this
        {
          type: 'pointerMove',
          duration: driver.isAndroid ? Math.floor(duration / ANDROID_SCROLL_DIVISOR) : duration,
          x: to.x,
          y: to.y,
        },
        // f. Finger gets up, off the screen
        {
          type: 'pointerUp',
          button: 0,
        },
        // g. Add a pause, just to make sure the swipe is done
        {
          type: 'pause',
          duration: 200,
        },
      ].filter(Boolean),
    }
  ])
}

/**
 * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
 * percentages of the screen.
 *
 * @param {Coordinates} from `&#123; x: 50, y: 50 }`
 * @param {Coordinates} to `&#123; x: 25, y: 25 }`
 *
 * @example
 * ``` js
 * // This is a swipe to the left
 * const from = { x: 50, y:50 }
 * const to = { x: 25, y:50 }
 * ```
 */
export const swipeOnPercentage = async ({
  from = {
    x: 0,
    y: 0,
  },
  to = {
    x: 0,
    y: 0,
  },
}: SwipeOnPercentageOptions = {}) => {
  log.warn('swipeOnPercentage is deprecated, use swipePercentage instead')

  const screenSize = await driver.getWindowRect()
  return swipe({
    from: getDeviceScreenCoordinates(screenSize, from),
    to: getDeviceScreenCoordinates(screenSize, to),
  })
}

/**
 * Swipe down based on a percentage
 *
 * @param percentage from 0 - 1
 */
export const swipeDown = async (percentage = 1) => {
  log.warn('swipeDown is deprecated, use swipeOnDirectionDown instead')

  return swipeOnPercentage({
    from: calculateXY(SWIPE_DIRECTION.down.start, percentage),
    to: calculateXY(SWIPE_DIRECTION.down.end, percentage),
  })
}

/**
 * Swipe Up based on a percentage
 *
 * @param {number} percentage from 0 - 1
 */
export const swipeUp = async (percentage = 1) => {
  log.warn('swipeUp is deprecated, use swipeOnDirectionUp instead')

  return swipeOnPercentage({
    from: calculateXY(SWIPE_DIRECTION.up.start, percentage),
    to: calculateXY(SWIPE_DIRECTION.up.end, percentage),
  })
}

/**
 * Swipe left based on a percentage
 *
 * @param {number} percentage from 0 - 1
 */
export const swipeLeft = async (percentage = 1) => {
  log.warn('swipeLeft is deprecated, use swipeOnDirectionLeft instead')

  return swipeOnPercentage({
    from: calculateXY(SWIPE_DIRECTION.left.start, percentage),
    to: calculateXY(SWIPE_DIRECTION.left.end, percentage),
  })
}

/**
 * Swipe right based on a percentage
 *
 * @param {number} percentage from 0 - 1
 */
export const swipeRight = async (percentage = 1) => {
  log.warn('swipeRight is deprecated, use swipeOnDirectionRight instead')

  return swipeOnPercentage({
    from: calculateXY(SWIPE_DIRECTION.right.start, percentage),
    to: calculateXY(SWIPE_DIRECTION.right.end, percentage),
  })
}

/**
 * Check if an element is visible and if not scroll down a portion of the screen to
 * check if it visible after a x amount of scrolls
 *
 * @param {element} element
 * @param {number} maxScrolls
 * @param {number} amount
 */
export const checkIfDisplayedWithScrollDown = async ({
  element,
  maxScrolls = 10,
  amount = 0,
  selector,
}: CheckIfDisplayedWithScrollDownOptions = {}) => {
  const { el, sel } = await findEleAndSel({
    element,
    selector,
  })

  log.info('check if displayed with swipe up', {
    selector: sel,
  })

  let exists = false
  let displayed = false
  if (el) {
    exists = await el.isExisting()
    displayed = await el.isDisplayed()
  }

  const elShown = exists && displayed
  if (!elShown && amount <= maxScrolls) {
    await swipeUp(0.50)
    await checkIfDisplayedWithScrollDown({
      element,
      maxScrolls,
      amount: amount + 1,
      selector,
    })
  } else if (amount > maxScrolls) {
    throw new Error(`The element '${ sel }' could not be found or is not visible.`)
  }
}

/**
 * Check if an element (from list of elements) is visible and if not scroll
 * up/down a portion of the screen to check if one of the elements from the
 * list is visible after a x amount of scrolls
 *
 * @param {string} selectors
 * @param {number} maxScrolls
 * @param {number} amount
 * @param {string} swipeDirection
 */
export const scrollToElements = async ({
  selectors = [],
  maxScrolls = 10,
  amount = 0,
  // swipeDirection = 'up',
  scrollDirection = ScrollDirection.DOWN,
  // selector,
  distance = 0.5,
  size,
}: ScrollToElementsOptions = {}) => {
  // PRE-EXISTING DEFECT, PRESERVED VERBATIM. This `reduce()` has no seed value,
  // so on the first iteration `promise` is `selectors[0]` — a plain string, not
  // a promise — and `.then()` on it throws. A `Promise.resolve(false)` seed is
  // what is missing. Repairing it would change runtime behaviour, which is out
  // of scope for the TypeScript conversion; the cast keeps the emitted
  // JavaScript byte-identical while leaving the defect visible.
  const found = await selectors.reduce((promise: any, selector) => {
    return promise.then((foundSelector: any) => {
      if (foundSelector) {
        return foundSelector
      }

      return findEleAndSel({
        selector,
      })
      .then(({ el, sel }) => {
        if (!el) {
          return false
        }

        return Promise.all([
          el.isExisting(),
          el.isDisplayed(),
        ])
        .then(([exists, displayed]) => {
          return exists && displayed ? sel : false
        })
      })
    })
  }, Promise.resolve(false))

  if (found) {
    return Promise.resolve(true)
  }

  if (amount > maxScrolls) {
    throw new Error(`None of the elements '${ selectors.join(',') }' could be found or are not visible.`)
  }

  // eslint-disable-next-line no-use-before-define
  return swipeOnDirection({
    direction: scrollDirection,
    distance,
    size,
  })
  .then(() => {
    return scrollToElements({
      selectors,
      maxScrolls,
      amount: amount + 1,
      scrollDirection,
      distance,
      size,
    })
  })
}

/**
 * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
 * This is the newer version of swipe that uses the actions API.
 *
 * @param {Coordinates} start `&#123; x: 50, y: 50 }`
 * @param {Coordinates} end `&#123; x: 25, y: 25 }`
 * @param {number} duration
 *
 * @example
 * ``` js
 * // This is a swipe to the left
 * const from = { x: 50, y:50 }
 * const to = { x: 25, y:50 }
 * ```
 */
export const swipeAction = async ({
  start = {
    x: 0,
    y: 0,
  },
  end = {
    x: 0,
    y: 0,
  },
  duration = SCROLL_DUR,
}: SwipeActionOptions = {}) => {
  log.info('swipeAction is deprecated, use swipe instead')
}

/**
 * Specify our swipe in terms relative to the height and width of the screen.
 * Here we have defined a new version of swipe, that takes start and end
 * values in percentages, not absolute terms. To make this work, we need
 * another helper function which retrieves (and caches) the window size. Using
 * the window size (height and width), we are able to calculate absolute
 * coordinates for the swipe.
 *
 * @param {object} from `&#123; xPct: 0.5, yPct: 0.5 }`
 * @param {object} to `&#123; xPct: 0.25, yPct: 0.25 }`
 * @param {number} duration
 * @param {object} size - pass in cached value of device window size to prevent having to call getWindowRect over and over again
 */
export const swipeActionPercentage = async ({
  from = {
    xPct: 0,
    yPct: 0,
  },
  to = {
    xPct: 0,
    yPct: 0,
  },
  duration = SCROLL_DUR,
  size,
}: SwipePercentageOptions = {}) => {
  log.warn('swipeActionPercentage is deprecated, use swipePercentage instead')
}

/**
 * Specify our swipe in terms relative to the height and width of the screen.
 * Here we have defined a new version of swipe, that takes start and end
 * values in percentages, not absolute terms. To make this work, we need
 * another helper function which retrieves (and caches) the window size. Using
 * the window size (height and width), we are able to calculate absolute
 * coordinates for the swipe.
 *
 * @param {object} from `&#123; xPct: 0.5, yPct: 0.5 }`
 * @param {object} to `&#123; xPct: 0.25, yPct: 0.25 }`
 * @param {number} duration
 * @param {object} size - pass in cached value of device window size to prevent having to call getWindowRect over and over again
 */
export const swipePercentage = async ({
  from = {
    xPct: 0,
    yPct: 0,
  },
  to = {
    xPct: 0,
    yPct: 0,
  },
  duration = SCROLL_DUR,
  size,
}: SwipePercentageOptions = {}) => {
  if (!size) {
    size = await driver.getWindowRect()
  }

  return swipe({
    from: {
      x: Math.round(size.width * from.xPct),
      y: Math.round(size.height * from.yPct),
    },
    to: {
      x: Math.round(size.width * to.xPct),
      y: Math.round(size.height * to.yPct),
    },
    duration,
  })
}

/**
 * Just performs a swipe from an area near the right edge of the screen over to the left
 *
 * @param {object} [param] - an optional params object
 * @param {number} [param.duration=750] -duration of the swipe
 * @param {boolean} [param.landscape=false] - in horizontal landscape vs vertical portrait mode.
 * @param {object} [param.size] - value of device window size
 * @returns Returns a Promise
 */
export const swipeToNextScreen = async ({
  duration = 750,
  landscape = false,
  size,
}: SwipeScreenOptions = {}) => {
  if (!size) {
    size = await driver.getWindowRect()
  }

  if (landscape) {
    return swipePercentage({
      from: {
        xPct: 0.5,
        yPct: 0.9,
      },
      to: {
        xPct: 0.5,
        yPct: 0.1,
      },
      duration,
      size,
    })
  }

  return swipePercentage({
    from: {
      xPct: 0.9,
      yPct: 0.5,
    },
    to: {
      xPct: 0.1,
      yPct: 0.5,
    },
    duration,
    size,
  })
}

/**
 * Swipe to previous screen
 *
 * @param {object} [param] - an optional params object
 * @param {number} [param.duration=750] - duration of the swipe
 * @param {boolean} [param.landscape=false] - in horizontal landscape vs vertical portrait mode.
 * @param {object} [param.size] - value of device window size
 * @returns Returns a Promise
 */
export const swipeToPrevScreen = ({
  duration = 750,
  landscape = false,
  size
}: SwipeScreenOptions) => {
  if (landscape) {
    return swipePercentage({
      from: {
        xPct: 0.1,
        yPct: 0.5,
      },
      to: {
        xPct: 0.9,
        yPct: 0.5,
      },
      duration,
      size,
    })
  }

  return swipePercentage({
    from: {
      xPct: 0.1,
      yPct: 0.5,
    },
    to: {
      xPct: 0.9,
      yPct: 0.5,
    },
    duration,
    size,
  })
}

/**
 * Swipe up/right/down/left based on a percentage.
 *
 * @param {object} [param] - an optional params object
 * @param {number} [param.direction] - The ScrollDirection enum
 * @param {number} [param.distance=0.8] - percentage from 0 - 1. the default
 * distance is 0.8, to make sure we don't accidentally scroll even a pixel past
 * content we might care about
 * @param {number} [param.duration=1000] - ms on duration of swipe, default 1 sec.
 * @param {object} [param.size] - value of device window size
 * @returns Returns a Promise
 */
export const swipeOnDirection = async ({
  direction = ScrollDirection.UNKNOWN,
  distance = SCROLL_RATIO,
  duration = SCROLL_DUR,
  size,
}: SwipeOnDirectionOptions = {}) => {
  // we're using the distance parameter to define where the possible start and
  // end points of the swipe we're constructing should be. Conceptually, the
  // start point of a scroll-swipe is going to be half the distance from the
  // mid-point of the screen, along the appropriate axis. With all of these
  // points defined, we can then simply start and end at the appropriate point
  // corresponding to the direction we want to scroll!
  if (distance < 0 || distance > 1) {
    throw new Error('Scroll distance must be between 0 and 1')
  }

  if (!size) {
    size = await driver.getWindowRect()
  }

  const midPoint = {
    x: Math.round(size.width * 0.5),
    y: Math.round(size.height * 0.5),
  }

  const top = midPoint.y - Math.floor(size.height * distance * 0.5)
  const bottom = midPoint.y + Math.floor(size.height * distance * 0.5)
  const left = midPoint.x - Math.floor(size.width * distance * 0.5)
  const right = midPoint.x + Math.floor(size.width * distance * 0.5)

  if (direction === ScrollDirection.UP) {
    return swipe({
      from: {
        x: midPoint.x,
        y: top,
      },
      to: {
        x: midPoint.x,
        y: bottom,
      },
      duration,
    })
  }

  if (direction === ScrollDirection.DOWN) {
    return swipe({
      from: {
        x: midPoint.x,
        y: bottom,
      },
      to: {
        x: midPoint.x,
        y: top,
      },
      duration,
    })
  }

  if (direction === ScrollDirection.LEFT) {
    return swipe({
      from: {
        x: left,
        y: midPoint.y,
      },
      to: {
        x: right,
        y: midPoint.y,
      },
      duration,
    })
  }

  return swipe({
    from: {
      x: right,
      y: midPoint.y,
    },
    to: {
      x: left,
      y: midPoint.y,
    },
    duration,
  })
}

/**
 * Check if an element is visible and if not scroll up/down a portion of the screen to
 * check if it visible after a x amount of scrolls
 *
 * @param {element} element
 * @param {number} maxScrolls
 * @param {number} amount
 * @param {string} swipeDirection
 */
export const scrollToElement = async ({
  element,
  maxScrolls = 10,
  amount = 0,
  // swipeDirection = 'up',
  scrollDirection = ScrollDirection.DOWN,
  selector,
  distance = 0.5,
  size,
}: ScrollToElementOptions = {}) => {
  const { el, sel } = await findEleAndSel({
    element,
    selector,
  })

  if (!el) {
    return Promise.resolve(false)
  }

  return Promise.all([
    el.isExisting(),
    el.isDisplayed(),
  ])
  .then(([exists, displayed]) => {
    return exists && displayed ? selector : false
  })
  .then((shown) => {
    if (shown) {
      return true
    }

    if (amount > maxScrolls) {
      throw new Error(`The element '${ sel }' could not be found or is not visible.`)
    }

    return swipeOnDirection({
      direction: scrollDirection,
      distance,
      size,
    })
    .then(() => {
      return scrollToElement({
        element: el,
        maxScrolls,
        amount: amount + 1,
        scrollDirection,
        selector,
        distance,
        size,
      })
    })
  })
}

/**
 * Swipe down based on a distance percentage.
 *
 * @param {object} [param] - an optional params object
 * @param {number} [param.distance=0.8] - percentage from 0 - 1. the default
 * distance is 0.8, to make sure we don't accidentally scroll even a pixel past
 * content we might care about
 * @param {number} [param.duration=1000] - ms on duration of swipe, default 1 sec.
 * @param {object} [param.size] - value of device window size
 * @returns Returns a Promise
 */
export const swipeOnDirectionDown = ({
  distance = SCROLL_RATIO,
  duration = SCROLL_DUR,
  size,
}: ScrollDirectionlessOptions = {}) => {
  return swipeOnDirection({
    direction: ScrollDirection.DOWN,
    distance,
    duration,
    size,
  })
}

export const scrollAction = async ({
  direction = ScrollDirection.UNKNOWN,
  distance = SCROLL_RATIO,
  duration = SCROLL_DUR,
  size,
}: SwipeOnDirectionOptions = {}) => {
  log.info('scrollAction is deprecated, use swipeOnDirection instead')
}

export const scrollActionDown = async ({
  distance = SCROLL_RATIO,
  duration = SCROLL_DUR,
  size,
}: ScrollDirectionlessOptions = {}) => {
  log.info('scrollActionDown is deprecated, use swipeOnDirectionDown instead')
}

/**
 * Drag an element from position A to B
 *
 * @param {Element} draggableElement
 * @param {Element} dropZoneElement
 */
export const dragAndDrop = async (draggableElement, dropZoneElement) => {
  // Get the dropzone and the draggable element rectangles
  const dropZoneRec = await driver.getElementRect(dropZoneElement.elementId)
  const dragElementRec = await driver.getElementRect(draggableElement.elementId)

  // See http://appium.io/docs/en/commands/interactions/actions/#actions
  return driver.performActions([{
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      // Pick the center of the draggable element
      {
        type: 'pointerMove',
        duration: 0,
        x: dragElementRec.x + (dragElementRec.width / 2),
        y: dragElementRec.y + (dragElementRec.height / 2),
      },
      {
        type: 'pointerDown',
        button: 0
      },
      {
        type: 'pause',
        duration: 250
      },
      // Finger moves a small amount very quickly to trigger the event
      {
        type: 'pointerMove',
        duration: 1,
        x: dragElementRec.x + (dragElementRec.width / 2),
        y: dragElementRec.y + (dragElementRec.height / 2) - 10,
      },
      {
        type: 'pause',
        duration: 100
      },
      // Move it to the center of the drop zone
      {
        type: 'pointerMove',
        duration: 250,
        x: dropZoneRec.x + (dropZoneRec.width / 2),
        y: dropZoneRec.y + (dropZoneRec.height / 2),
      },
      {
        type: 'pointerUp',
        button: 0
      },
    ],
  }])
}

/**
 * Pinch or zoom an element (pinch doesn't work on Android with this method yet)
 *
 * @param {Element} element
 * @param {string} gesture Possible values are 'zoom' or 'pinch'.
 */
export const pinchAndZoom = async (element, gesture = 'zoom') => {
  const isZoom = gesture.toLowerCase() === 'zoom'
  const { x, y, width, height } = await driver.getElementRect(element.elementId)
  const centerX = x + (width / 2)
  const centerY = y + (height / 2)
  // iOS seems to respond 'heavier' on a position change, so make it way smaller
  const xPosition = driver.isIOS ? 10 : width / 2
  const finger1 = {
    start: {
      type: 'pointerMove',
      duration: 0,
      x: centerX,
      y: centerY
    },
    end: {
      type: 'pointerMove',
      duration: 250,
      x: centerX - xPosition,
      y: centerY
    },
  }
  const finger2 = {
    start: {
      type: 'pointerMove',
      duration: 0,
      x: centerX,
      y: centerY
    },
    end: {
      type: 'pointerMove',
      duration: 250,
      x: centerX + xPosition,
      y: centerY
    },
  }

  return driver.performActions([
    // First finger
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        // move finger into start position
        isZoom ? finger1.start : finger1.end,
        // finger comes down into contact with screen
        {
          type: 'pointerDown',
          button: 0
        },
        // pause for a little bit
        {
          type: 'pause',
          duration: 100
        },
        // finger moves to end position
        isZoom ? finger1.end : finger1.start,
        // finger lets up, off the screen
        {
          type: 'pointerUp',
          button: 0
        },
      ],
    },
    // Second finger
    {
      type: 'pointer',
      id: 'finger2',
      parameters: { pointerType: 'touch' },
      actions: [
        // move finger into start position
        isZoom ? finger2.start : finger2.end,
        // finger comes down into contact with screen
        {
          type: 'pointerDown',
          button: 0
        },
        // pause for a little bit
        {
          type: 'pause',
          duration: 100
        },
        // finger moves to end position
        isZoom ? finger2.end : finger2.start,
        // finger lets up, off the screen
        {
          type: 'pointerUp',
          button: 0
        },
      ],
    },
  ])
}

/**
 * Pinch or zoom an element (pinch doesn't work on Android with this method yet)
 *
 * @param {Element} element
 */
export const swipeItemLeft = async (element) => {
  const { x, y, width, height } = await driver.getElementRect(element.elementId)
  const centerX = x + (width / 2)
  const centerY = y + (height / 2)

  return driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        // move finger into start position
        {
          type: 'pointerMove',
          duration: 0,
          x: centerX,
          y: centerY
        },
        // finger comes down into contact with screen
        {
          type: 'pointerDown',
          button: 0
        },
        // pause for a little bit
        {
          type: 'pause',
          duration: 100
        },
        // finger moves to end position
        {
          type: 'pointerMove',
          duration: 250,
          x: centerX - (width / 4),
          y: centerY
        },
        // finger lets up, off the screen
        {
          type: 'pointerUp',
          button: 0
        },
      ],
    },
  ])
}
