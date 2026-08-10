import fs from 'node:fs'
import path from 'node:path'
import lodash from 'lodash'

import {
  generateScreenshotName,
} from '../../utils'

import {
  buildLogger,
} from '../../logger'

import {
  AppiumAppState,
  parseAppiumAppState,
  isSauceNativeMode,
} from '../../enums'

import {
  findStrategy,
} from './find-strategy'

import type { WdioElement } from '../../types'

const {
  zip,
} = lodash

/**
 * "Either hand me the element, or hand me a selector and I will look it up."
 *
 * This pair recurs across nearly every helper below, which is why it is one
 * named type rather than repeated inline: callers that already hold an element
 * skip the round trip, callers that do not pass a selector instead.
 *
 * `selector` is `string`, not the broader `Selector` used by the browser
 * helpers: everything in this module funnels through `buildSelector()`, which
 * does string surgery (`.replace()`, `.slice()`) to translate a React Native
 * `testID` into an Appium locator. A matcher object or function would throw.
 */
export interface ElementOrSelector {
  element?: WdioElement | null
  selector?: string
}

/** {@link ElementOrSelector} in its plural form. */
export interface ElementsOrSelectors {
  elements?: WdioElement[]
  selectors?: string[]
}

/** How long to keep retrying, and how often. */
export interface WaitOptions {
  timeout?: number
  /** poll interval in ms; WebdriverIO defaults to 500 when omitted */
  interval?: number
}

/** Read the text out of one element. */
export interface TextOfElementOptions {
  element?: WdioElement | null
  isXpath?: boolean
}

/** Read the text out of several elements. */
export interface TextOfElementsOptions {
  elements?: WdioElement[]
  isXpath?: boolean
}

export interface WaitForShownOptions extends ElementOrSelector, WaitOptions {}

export interface WaitForAnyShownOptions extends ElementsOrSelectors, WaitOptions {}

export interface WaitForConditionOptions extends WaitOptions {
  condition?: () => any
  timeoutMsg?: string
}

/** Tap an absolute point, optionally relative to an element. */
export interface TapAtPointOptions {
  element?: WdioElement | null
  x?: number
  y?: number
  duration?: number
}

/** Tap a point inside an element, given as a fraction of its box. */
export interface TapElementOptions extends ElementOrSelector {
  xPct?: number
  yPct?: number
}

/** Tap around an element until `check()` stops throwing. */
export interface TapAllAroundElementOptions extends ElementOrSelector, WaitOptions {
  timeoutMsg?: string
  check?: () => void
}

const log = buildLogger()

// When automating an iOS application, XCUITest can be used to find elements.
// You can use predicate strings and class strings.
//
// selector = `type == 'XCUIElementTypeSwitch' && name CONTAINS 'Allow'`
// switch = findXCUITestEle(`-ios predicate string:${selector}`)
//
// selector = '**/XCUIElementTypeCell[`name BEGINSWITH "D"`]/**/XCUIElementTypeButton'
// button = findXCUITestEle(`-ios class chain:${selector}`)
//
// The `class name` strategy is a `string` representing a UI element on the current view.
//
// - For iOS it is the full name of a UIAutomation class, and will begin with
//   `UIA-`, such as `UIATextField` for a text field.
//   e.g., `$('UIATextField').click()`
//
// - For Android it is the fully qualified name of a UI Automator, class, such
//   `android.widget.EditText` for a text field.
//   e.g., `$('android.widget.DatePicker').click()`
//
// - For Youi.tv it is the full name of a Youi.tv class, and will being with
//   `CYI-`, such as `CYIPushButtonView` for a push button element.
//   e.g., `$('CYIPushButtonView').click()`
export const buildSelector = (selector = '') => {
  // undefined testID are overwritten as non-breaking space with babel plugins, issue
  // should be fixed in code to not have undefined testIDs
  selector = selector.replace(/undefined/g, ' ')

  const { using, value } = findStrategy(selector)
  if (using === 'id') {
    if (driver.isAndroid) {
      const { appPackage: appiumAppPackage } = driver.capabilities
      return `id=${ appiumAppPackage }:id/${ value }`
    }
    return `id=${ value }`
  }

  return selector
}

// React Native
//
// On iOS, both of these strategies are identical: they first try to match the
// name attribute and fall back to matching the label attribute. If per chance
// you'd like to set both `accessibilityLabel` and the `testID` props you should
// know they correspond to the `label` and `name` element attributes respectively.
// This is easy to observe using Appium Desktop.
//
// The `label` is constructed by concatenating all `Text` node children
// separated by spaces. React Native doesn’t concatenate the <Text> children’s
// values because the a11yLabel of its parent isn't undefined.
//
// When accessible is true, it indicates that the view is an accessibility
// element. When a view is an accessibility element, it groups its children into
// a single selectable component. By default, all touchable elements are
// accessible.On Android, accessible={true} property for a react-native View
// will be translated into native focusable={true}.

// Could add `identifiable:id/` prefix for android like so

// import { getBundleId } from 'react-native-device-info';
// iOS: testID
// Android: `${ getBundleId() }:id/${ testID }`

// ```
// const prefix = (selector) => {
//   if (driver.isAndroid) {
//     const { 'appium:appPackage': appiumAppPackage } = driver.capabilities;
//     return `${appPackage || appiumAppPackage}:id/${selector}`;
//   }
//   return selector;
// };

// Before: ~ uses accessibility-id strategy
// const loginBtn = $('~Login');

// After: # uses id strategy
// const loginBtn = $('id=landing-login');
// or
// const loginBtn = $(`id=${prefix('landing-login')}`);
// ```

// On iOS, both of these strategies are identical: they first try to match the
// name attribute and fall back to matching the label attribute. If per chance
// you'd like to set both `accessibilityLabel` and the `testID` props you should
// know they correspond to the `label` and `name` element attributes respectively.
// This is easy to observe using Appium Desktop.

// The `label` is constructed by concatenating all `Text` node children
// separated by spaces. React Native doesn’t concatenate the <Text> children’s
// values because the a11yLabel of its parent isn't undefined.

// accessible When true, indicates that the view is an accessibility element.
// When a view is an accessibility element, it groups its children into a single
// selectable component. By default, all touchable elements are accessible.On
// Android, accessible={true} property for a react-native View will be
// translated into native focusable={true}.

// 1. If any parent of the React Native Text component is a
//    Touchable(TouchableOpacity for example) then you need to make sure to
//    add`accessible={false}` to this parent component in order for you to be
//    able to see this component's children like the Text. This happens because
//    the default `accessible` value for `Touchable` components is `true`.

// 2. You might have a very detailed screen with lots of elements and Appium at
//    one point just gives up going down the tree and does not show every
//    element.To avoid this, use Appium's Settings API by adding the
//    capabilities `appium:settings[snapshotMaxDepth]` and `appium:settings[customSnapshotTimeout]` to
//    your tests. Increase their default values to have more elements appear
//    when finding strategies. Have a
//    look [here](https://github.com/appium/appium-xcuitest-driver#settings-api) for
//    the default values.

// That should indeed be the case yes, for whatever React Native version.
// If it's not working make sure of two things:
//
// 1. If any parent of the React Native Text component is a
//    Touchable(TouchableOpacity for example) then you need to make sure to
//    add `accessible={false}` to this parent component in order for you to be
//    able to see this component's children like the Text. This happens because
//    the default `accessible` value for `Touchable` components is `true`.
//
// 2. You might have a very detailed screen with lots of elements and Appium at
//    one point just gives up going down the tree and does not show every
//    element.To avoid this, use Appium's Settings API by adding the
//    capabilities `appium:settings[snapshotMaxDepth]` and `appium:settings[customSnapshotTimeout]` to
//    your tests. Increase their default values to have more elements appear
//    when finding strategies

export const findEle = async (selector = '') => {
  try {
    const builtSelector = buildSelector(selector)
    log.info('finding element', {
      selector,
      builtSelector,
    })

    const el = await $(builtSelector)
    if (!el) {
      log.trace('An element could not be located', {
        selector,
        builtSelector,
      })
      return false
    }
    if (el && el.error) {
      log.trace('An element could not be located, with error', {
        selector,
        builtSelector,
        error: el.error,
      })
      return false
    }

    return el
  } catch (err) {
    log.warn('findEle caught an exception', {
      selector,
      err,
    })

    // Dont break the tests
    return false
  }
}

// Exported because `./base.js` and `./gestures.js` both import it. Under the
// old babel CJS build the missing `export` silently resolved to `undefined`;
// bundling surfaces it as a hard error.
export const findEleAndSel = async ({
  element = null,
  selector,
}: ElementOrSelector = {}) => {
  const promise = element ?
    Promise.resolve(element) :
    findEle(selector)

  return promise
  .then((el) => {
    const sel = selector ?
      buildSelector(selector) :
      el && el.selector

    return {
      el,
      sel,
    }
  })
}

export const findEles = async (selector) => {
  try {
    const builtSelector = buildSelector(selector)
    log.info('finding elements', {
      selector,
      builtSelector,
    })

    const els = $$(selector)
    if (!els || els.length === 0) {
      log.trace('No elements could be located', {
        selector,
        builtSelector,
      })
      return false
    }
    if (els.error) {
      log.trace('No elements could be located', {
        selector,
        builtSelector,
      })
      return false
    }

    return els
  } catch (err) {
    log.warn('findEles caught an exception', {
      selector,
      err,
    })

    // Dont break the tests
    return false
  }
}

export const prettyPageSource = (beg, end) => {
  let lines = driver.execute('mobile: source', {
    format: 'xml',
    excludedAttributes: 'visible,label,x,y,width,height,type,index,enabled',
  }).split('\n')
  if (beg == null) {
    beg = 0
  }
  if (end == null) {
    end = lines.length
  }
  lines = lines.slice(beg, end)
  const min = Math.min(...lines.map((line) => {
    const matches = line.match(/(^[\s]+)/g)
    if (matches && matches.length) {
      return matches[0].length
    }
    return 0
  }))

  return lines.map((line) => line.substring(min)).join('\n')
}

/**
 * Helper that looks at global driver with the parsed env attached to it. First
 * priority is a passed in bundleId.
 *
 * @param {string} bundleId - App ID (package ID for Android, bundle ID for iOS)
 * @returns {string} Returns thea app id or bundle id
 */
const findBundleIdHelper = (bundleId) => {
  if (bundleId) {
    return bundleId
  }

  if (driver.isAndroid) {
    return driver.env.APP_PACKAGE
  }

  return driver.env.IOS_BUNDLE_ID
  // responds with {pid (processId, bundleId, name (app.identifier))}
  // const appInfo = await driver.execute('mobile: activeAppInfo')
  // bid = appInfo.bundleId
}

/**
 * Helper that terminates an application with given bundleId.
 *
 * @param {string} bundleId - App ID (package ID for Android, bundle ID for iOS)
 */
const terminateAppHelper = async (bundleId) => {
  if (driver.isIOS) {
    log.info('terminate iOS app', {
      bundleId,
      exec: 'mobile: terminateApp',
    })

    return driver.execute('mobile: terminateApp', { bundleId })
  }

  log.info('terminate Android app', {
    bundleId,
    cmd: 'terminateApp',
  })

  return driver.terminateApp(bundleId)
}

const activateAppHelper = async (bundleId) => {
  if (driver.isIOS) {
    log.info('activate iOS app', {
      bundleId,
      exec: 'mobile: activateApp',
    })

    return driver.execute('mobile: activateApp', { bundleId })
  }

  log.info('terminate Android app', {
    bundleId,
    cmd: 'activateApp',
  })

  return driver.activateApp(bundleId)
  .then((result) => {
    // android on saucelabs starts in landscape after activation
    if (isSauceNativeMode(driver.WDIO_TEST_IT_MODE)) {
      return driver.setOrientation('PORTRAIT')
      .then(() => {
        return result
      })
    }

    return result
  })
}

/**
 * Get the app state
 *
 * @param {string} bundleId - App ID (package ID for Android, bundle ID for iOS)
 * @returns {AppiumAppState}
 */
export const getAppState = async (bundleId?: string) => {
  bundleId = findBundleIdHelper(bundleId)

  let promise
  if (driver.isIOS) {
    log.info('get ios app state with bundle id', {
      bundleId,
      exec: 'mobile: queryAppState',
    })

    promise = driver.execute('mobile: queryAppState', { bundleId })
  } else {
    log.info('get android app state with package id', {
      packageId: bundleId,
      cmd: 'queryAppState',
    })

    promise = driver.queryAppState(bundleId)
  }

  return promise.then((currentAppState) => {
    const appState = parseAppiumAppState(currentAppState)
    log.debug(appState.desc, {
      bundleId,
      rawAppState: currentAppState,
      code: appState.code,
      value: appState.value,
    })

    return appState.value
  }, (err) => {
    log.warn('error in looking up app state', {
      bundleId,
      name: err.name,
      message: err.message,
      stack: err.stack,
    })

    // Dont break the tests
    return AppiumAppState.NOT_INSTALLED
  })
}

/**
 * The app is opened by Appium by default, when we start a new test
 * the app needs to be reset
 * @param {string} bundleId - App ID (package ID for Android, bundle ID for iOS)
 */
export const restartApp = async (bundleId) => {
  bundleId = findBundleIdHelper(bundleId)
  const message = driver.firstAppStart ?
    'First run and no restart required' :
    'When starting a new test the app needs to be reset'

  log.info('restart app', {
    bundleId,
    message,
    firstAppStart: !!driver.firstAppStart,
  })

  if (!driver.firstAppStart) {
    await terminateAppHelper(bundleId)

    const pause = driver.isIOS ? 400 : 2000
    await driver.pause(pause)

    await activateAppHelper(bundleId)
  }

  // Set the firstAppstart to false to say that the following test can be reset
  driver.firstAppStart = false
}

/**
 * Start an app with the given bundle ID and app activity. Use this with the option `autoLaunch: false` to prevent the app from opening by default.
 *
 * @param {string} bundleId - The app ID (package ID for Android, bundle ID for iOS).
 * @param {string} appActivity - The Android activity (optional, required for Android).
 * @returns {Promise<void>} A Promise that resolves when the app is successfully started.
 */
export const startApp = async (bundleId, appActivity) => {
  bundleId = findBundleIdHelper(bundleId)

  if (driver.isIOS) {
    log.info('starting ios app', {
      bundleId,
      exec: 'mobile: launchApp',
    })

    await driver.execute('mobile: launchApp', { bundleId })
  } else {
    let activity = appActivity
    if (!activity) {
      activity = driver.env.APP_ACTIVITY
    }

    log.info('starting android app', {
      packageId: bundleId,
      cmd: 'startActivity',
      activity,
    })

    await driver.startActivity(bundleId, activity, bundleId, activity)
  }
}

/**
 * Activate an application
 *
 * @param {string} bundleId - App ID (package ID for Android, bundle ID for iOS)
 */
export const switchToApp = async (bundleId) => {
  const bid = findBundleIdHelper(bundleId)
  await activateAppHelper(bid)
}

const getAndroidTextOfElement = async ({ element }) => {
  const textViews = await element.$$('*//android.widget.TextView')

  return textViews.reduce((promise, el) => {
    return promise.then((reducer) => {
      return el.getText()
      .then((result) => {
        return `${ reducer } ${ result }`
      })
    })
  }, Promise.resolve(''))
  .then((result) => {
    // fallback
    if (result === '') {
      return element.getText()
    }

    return result
  })
}

const getIosTextOfElement = async ({
  element,
  isXpath = false
}: TextOfElementOptions) => {
  if (!isXpath) {
    return element.getText()
  }

  const staticTextEls = await element.$$('*//XCUIElementTypeStaticText')
  return staticTextEls.reduce((promise, el) => {
    return promise.then((reducer) => {
      return el.getText()
      .then((result) => {
        return `${ reducer } ${ result }`
      })
    })
  }, Promise.resolve(''))
  .then((result) => {
    // fallback
    if (result === '') {
      return element.getText()
    }

    return result
  })
}

/**
 * Get the text of an element (including all child elements)
 *
 * @param {element} element
 * @param {boolean} isXpath
 *
 * @returns {string}
 */
// export const getTextOfElement = async (element, isXpath = false) => {
export const getTextOfElement = async ({
  element,
  isXpath = false,
}: TextOfElementOptions) => {
  log.info('get text of element', {
    selector: element.selector,
    isXpath,
  })

  return Promise.resolve(
    driver.isAndroid ?
      getAndroidTextOfElement({ element }) :
      getIosTextOfElement({
        element,
        isXpath,
      }))
  .then((result) => {
    log.debug('text of element', {
      selector: element.selector,
      isXpath,
      result: result.trim()
    })

    return result.trim()
  }, (err) => {
    log.warn('error in getting text of element', {
      selector: element.selector,
      name: err.name,
      message: err.message,
      stack: err.stack,
    })

    // dont break the tests
    return ''
  })
}

export const getTextOfElements = async ({
  elements = [],
  isXpath = false,
}: TextOfElementsOptions) => {
  const selectors = elements.map((element) => element.selector).join(', ')
  log.info('get text of elements', {
    selectors,
    isXpath,
  })

  return Promise.all(elements.map((element) => getTextOfElement({
    element,
    isXpath,
  })))
  .then((results) => {
    log.debug('result of text of elements', {
      selectors,
      isXpath,
      results,
    })

    return results
  }, (err) => {
    log.warn('rejection in text of elements', {
      selectors,
      isXpath,
      name: err.name,
      message: err.message,
      stack: err.stack,
    })

    // dont break the tests
    return []
  })
}

export const saveScreenshotWithPath = async (screenshotPath) => {
  const route = path.join(screenshotPath, generateScreenshotName(), '.png')
  await driver.saveScreenshot(route)

  return route
}

/**
 * Open the webpage with a browser just once
 * @returns {void}
 */
export const androidOpenWebPageWithBrowserOnce = async () => {
  const justOnceButton = '*//android.widget.Button[@resource-id="android:id/button_once"]'

  try {
    await $('*//android.widget.ListView[@resource-id="android:id/resolver_list"]').waitForDisplayed({
      timeout: 15000,
    })

    if (await $(justOnceButton).isEnabled()) {
      return $(justOnceButton).click()
    }

    // Chrome is most of the time the first
    $$('*//android.widget.ListView[@resource-id="android:id/resolver_list"]/android.widget.LinearLayout')[0].click()

    await driver.pause(500)
    return $(justOnceButton).click()
  } catch (e) {
    // It could be that it already opens to the default browser and no check screen is asked
  }
}

/**
 * Verify that the browser is opened.
 * - iOS:     For iOS it not possible to check if the browser is opened, only if the app is
 *            put on the background
 * - Android: For Android we can check the current activity. If it holds a browser reference we know
 *            for sure that the app is put on the background and that for example chrome is opened.
 * @returns {void}
 */
export const browserIsOpened = async () => {
  // Wait 2 second to be sure the app is done going to the background / get the correct status
  await driver.pause(2000)

  if (driver.isIOS) {
    const appState = await getAppState()

    return appState === AppiumAppState.NOT_RUNNING ||
      appState === AppiumAppState.SUSPENDED ||
      appState === AppiumAppState.RUNNING_IN_BACKGROUND
  }

  // On Android we first need to select which browser we want to use
  await androidOpenWebPageWithBrowserOnce()

  const activity = await driver.getCurrentActivity()
  return activity.includes('chromium') || activity.includes('WebViewBrowserActivity')
}

/**
 * Hide the soft keyboard, but only if it is present
 *
 * @param {Element} element
 *
 * @returns {void}
 */
export const hideSoftKeyboard = async (element) => {
  // The hideKeyboard() is not working on ios devices, so take a different approach
  if (!(await driver.isKeyboardShown())) {
    return
  }

  if (driver.isIOS) {
    return driver.touchAction({
      action: 'tap',
      x: 0,
      y: -40,
      element,
    })
  }

  try {
    return driver.hideKeyboard('pressKey', 'Done')
  } catch (e) {
    // Fallback
    return driver.back()
  }
}

/**
 * Create a cross platform solution for opening a deep link
 *
 * @param {string} bundleId
 * @param {string} url
 * @param {string} prefix
 * @returns {void}
 */
export const openDeepLinkUrl = async (
  bundleId,
  url,
  prefix = 'hmma://'
) => {
  bundleId = findBundleIdHelper(bundleId)

  if (driver.isAndroid) {
    // Life is so much easier
    return driver.execute('mobile:deepLink', {
      url: `${ prefix }${ url }`,
      package: bundleId,
    })
  }

  // Launch Safari to open the deep link
  await driver.execute('mobile: launchApp', {
    bundleId: 'com.apple.mobilesafari',
  })

  // Add the deep link url in Safari in the `URL`-field
  // This can be 2 different elements, or the button, or the text field
  // Use the predicate string because  the accessibility label will return 2 different types
  // of elements making it flaky to use. With predicate string we can be more precise
  const urlButtonSelector = 'type == \'XCUIElementTypeButton\' && name CONTAINS \'URL\''
  const urlFieldSelector = 'type == \'XCUIElementTypeTextField\' && name CONTAINS \'URL\''
  const urlButton = $(`-ios predicate string:${ urlButtonSelector }`)
  const urlField = $(`-ios predicate string:${ urlFieldSelector }`)

  // Wait for the url button to appear and click on it so the text field will appear
  // iOS 13 now has the keyboard open by default because the URL field has focus when opening the Safari browser
  if (!(await driver.isKeyboardShown())) {
    await urlButton.waitForDisplayed()
    await urlButton.click()
  }

  // Submit the url and add a break
  await urlField.setValue(`${ prefix }${ url }\uE007`)

  /**
   * If you started the iOS device with `autoAcceptAlerts:true` in the
   * capabilities then Appium will auto accept the alert that should be shown
   * now.
   * We start with `autoAcceptAlerts:false`.
   * Best to avoid using autoAcceptAlerts for compatibility with Android.
   */

  // Wait for the notification and accept it
  try {
    const openSelector = 'type == \'XCUIElementTypeButton\' && name CONTAINS \'Open\''
    const openButton = await $(`-ios predicate string:${ openSelector }`)
    await openButton.waitForDisplayed()
    await openButton.click()
  } catch (e) {
    // ignore
  }
}

export const allowPermissions = async () => {
  // Allow or Deny specific permissions
  // You can also choose to accept or deny alerts and popups during your test.
  // Your test will need to find the element of the alert or popup and perform a click action on that element.

  if (driver.isAndroid) {
    const element = await driver.element('xpath', './/android.widget.Button[@text=\'Allow\']')
    return element.click()
  }

  const element = await driver.element('id', 'Allow')
  return element.click()
}

/**
 * Execute ADB commands on Android device
 *
 * @param {string} adbCommand
 */
export const androidExecAdbCommand = async (adbCommand) => {
  // exec(`am start -a android.settings.SECURITY_SETTINGS && locksettings set-pin 1234`)
  // exec(`input text 1234 && input keyevent 66`)
  // exec('am start -a android.settings.SECURITY_SETTINGS')
  // exec(`input text 1234 && input keyevent 66 && input text 1234 && input keyevent 66`)
  return driver.execute(
    'mobile: shell',
    {
      command: adbCommand,
    },
  )
}

/**
 * Find an Android element based on text
 *
 * @param {String} string
 *
 * @returns WebdriverIO.Element
 */
export const androidFindElementByText = async (string) => {
  return $(`android=new UiSelector().textContains("${ string }")`)
}

/**
 * Wait and click on an Android element
 *
 * @param {string} string
 */
export const androidWaitAndClick = async (string) => {
  await (await androidFindElementByText(string)).waitForDisplayed()
  await (await androidFindElementByText(string)).click()
}

/**
 * Give back if the element is displayed
 *
 * @param {Element} element
 *
 * @returns {boolean}
 */
export const isShown = async ({
  element = null,
  selector,
}: ElementOrSelector = {}) => {
  // For android an element that is not visible is also not in the UI tree,
  // so a different approach should be used
  try {
    const { el, sel } = await findEleAndSel({
      element,
      selector,
    })

    log.info('isShown', {
      selector: sel,
    })

    if (el && el.isDisplayed()) {
      log.debug('result of isShwon', {
        displayed: true,
        selector: sel,
      })

      return true
    }

    log.debug('result of isShwon', {
      displayed: false,
      selector: sel,
    })

    return false
  } catch (err) {
    log.warn('rejection in isShown', {
      selector,
      name: err.name,
      message: err.message,
      stack: err.stack,
    })

    // Dont break the tests
    return false
  }
}
/**
 * Give back if the element is enabled
 *
 * @param {Element} element
 *
 * @returns {boolean}
 */
export const isEnabled = async ({
  element = null,
  selector,
}: ElementOrSelector = {}) => {
  // For android an element that is not visible is also not in the UI tree,
  // so a different approach should be used
  try {
    const { el, sel } = await findEleAndSel({
      element,
      selector,
    })

    log.info('isEnabled', {
      selector: sel,
    })

    if (el && el.isEnabled()) {
      log.debug('result of isEnabled', {
        displayed: true,
        selector: sel,
      })

      return true
    }

    log.debug('result of isEnabled', {
      displayed: false,
      selector: sel,
    })

    return false
  } catch (err) {
    log.warn('rejection in isEnabled', {
      selector,
      name: err.name,
      message: err.message,
      stack: err.stack,
    })

    // Dont break the tests
    return false
  }
}

export const areAnyShown = async ({
  elements = [],
  selectors = [],
}: ElementsOrSelectors = {}) => {
  const zipped = zip(elements, selectors)

  return !!zipped.reduce((promise, [element, selector]) => {
    return promise.then((found) => {
      if (found) {
        return found
      }

      return isShown({
        element,
        selector,
      })
      .then((result) => {
        if (!result) {
          return false
        }

        return {
          element,
          selector,
        }
      })
    })
  }, Promise.resolve(false))
}

export const areAllShown = async ({
  elements = [],
  selectors = [],
}: ElementsOrSelectors = {}) => {
  const zipped = zip(elements, selectors)

  return !!zipped.reduce((promise, [element, selector]) => {
    return promise.then((found) => {
      if (!found) {
        return false
      }

      return isShown({
        element,
        selector,
      })
    })
  }, Promise.resolve(true))
}

/**
 * Waits until ANY of the specified elements or selectors are shown on the page, up to a specified timeout.
 * This function is useful for scenarios involving asynchronous UI elements that may not be immediately visible.
 *
 * @param {Object} params - Parameters to define the wait conditions.
 * @param {WebElement[]} [params.elements=[]] - An array of WebElements to check for visibility.
 * @param {string[]} [params.selectors=[]] - An array of selector strings to check for visibility.
 * @param {number} [params.timeout=20000] - The maximum amount of time (in milliseconds) to wait for an element to be shown. Defaults to 20 seconds.
 * @param {number} [params.interval] - The interval (in milliseconds) at which to poll for element visibility. If not specified, the driver's default polling interval is used.
 * @returns {Promise<void>} A promise that resolves when any of the specified elements or selectors are shown, or rejects if the timeout is reached without any becoming visible.
 *
 * @example
 * await waitForAnyShown({
 *   selectors: ['#loginButton', '#signupButton'],
 *   timeout: 10000,
 *   interval: 500,
 * });
 */
export const waitForAnyShown = async ({
  elements = [],
  selectors = [],
  timeout = 20000,
  interval,
}: WaitForAnyShownOptions = {}) => {
  return driver.waitUntil(() => {
    return areAnyShown({
      elements,
      selectors,
    })
  },
  {
    ...(Number.isInteger(interval) && {
      interval,
    }),
    ...(Number.isInteger(timeout) && {
      timeout,
    }),
    timeoutMsg: 'The element was not shown within the default timeout',
    ...(Number.isInteger(timeout) && {
      timeoutMsg: `The element was not shown within the default timeout of ${ timeout }`,
    }),
    ...(selectors.length && {
      timeoutMsg: `The elements '${ selectors.join(', ') }', were not shown within the default timeout`,
    }),
    ...(Number.isInteger(timeout) && selectors.length && {
      timeoutMsg: `The elements '${ selectors.join(', ') }', were not shown within the default timeout of ${ timeout }`,
    }),
  })
}

/**
 * Waits until all specified elements or selectors are visible on the page, up to a specified timeout. This function is
 * particularly useful in web automation tasks where multiple asynchronous UI elements must become visible before proceeding.
 *
 * @param {Object} params - The parameters defining the elements or selectors to wait for and the wait conditions.
 * @param {WebElement[]} [params.elements=[]] - An array of WebElements to check for visibility.
 * @param {string[]} [params.selectors=[]] - An array of CSS selector strings to check for the visibility of elements.
 * @param {number} [params.timeout=20000] - The maximum amount of time (in milliseconds) to wait for elements to be shown. Defaults to 20 seconds.
 * @param {number} [params.interval] - The interval (in milliseconds) at which to poll for the visibility of elements. If not specified, the driver's default polling interval is used.
 * @returns {Promise<void>} A promise that resolves when all of the specified elements or selectors are visible, or rejects if the timeout is reached without all becoming visible.
 *
 * @example
 * // Example usage:
 * await waitForAllShown({
 *   selectors: ['.data-loaded', '.animation-finished'],
 *   timeout: 15000,
 *   interval: 500,
 * });
 */
export const waitForAllShown = async ({
  elements = [],
  selectors = [],
  timeout = 20000,
  interval,
}: WaitForAnyShownOptions = {}) => {
  return driver.waitUntil(() => {
    return areAllShown({
      elements,
      selectors,
    })
  },
  {
    ...(Number.isInteger(interval) && {
      interval,
    }),
    ...(Number.isInteger(timeout) && {
      timeout,
    }),
    timeoutMsg: 'The elements were not shown within the default timeout',
    ...(Number.isInteger(timeout) && {
      timeoutMsg: `The elements were not shown within the default timeout of ${ timeout }`,
    }),
    ...(selectors.length && {
      timeoutMsg: `The elements '${ selectors.join(', ') }', were not shown within the default timeout`,
    }),
    ...(Number.isInteger(timeout) && selectors.length && {
      timeoutMsg: `The elements '${ selectors.join(', ') }', were not shown within the default timeout of ${ timeout }`,
    }),
  })
}

/**
 * Wait for the element to be shown. One of element or selector must be used.
 *
 * @param {Object} [args={}] - Optional set of arguments.
 * @param {Element} [args.element] - The webdriver element.
 * @param {string} [args.selector] - The selector used to find the element with.
 * @param {number} [args.timeout=20000] - The timeout in ms (default: 20 secs)
 * @param {number} [args.interval=500] - The interval between condition checks (default: half second)
 *
 * @returns {boolean}
 */
export const waitForIsShown = async ({
  element = null,
  timeout = 20000,
  interval, // default is 500 or half second
  selector,
}: WaitForShownOptions = {}) => {
  return driver.waitUntil(
    async () => {
      return (await isShown({
        element,
        selector,
      })) === true
    },
    {
      ...(Number.isInteger(timeout) && {
        timeout,
      }),
      timeoutMsg: 'The element was not shown within the default timeout',
      ...(Number.isInteger(timeout) && {
        timeoutMsg: `The element was not shown within the default timeout of ${ timeout }`,
      }),
      ...(selector && {
        timeoutMsg: `The element '${ selector }', was not shown within the default timeout`,
      }),
      ...(Number.isInteger(timeout) && selector && {
        timeoutMsg: `The element '${ selector }', was not shown within the default timeout of ${ timeout }`,
      }),
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
export const waitForIsNotShown = async ({
  element = null,
  timeout = 20000,
  interval, // default is 500 or half second
  selector,
}: WaitForShownOptions = {}) => {
  return driver.waitUntil(
    async () => {
      return (await isShown({
        element,
        selector,
      })) !== true
    },
    {
      ...(Number.isInteger(timeout) && {
        timeout,
      }),
      timeoutMsg: 'The element was not shown within the default timeout',
      ...(Number.isInteger(timeout) && {
        timeoutMsg: `The element was still shown within the default timeout of ${ timeout }`,
      }),
      ...(selector && {
        timeoutMsg: `The element '${ selector }', was still shown within the default timeout`,
      }),
      ...(Number.isInteger(timeout) && selector && {
        timeoutMsg: `The element "${ selector }", was still shown within the default timeout of ${ timeout }`,
      }),
    },
  )
}

/**
 * This wait command is your universal weapon if you want to wait on something.
 * It expects a condition and waits until that condition is fulfilled with a truthy value.
 *
 * @param {Object} [args={}] - Optional set of arguments.
 * @param {Function} args.condition - The condition to wait on.
 * @param {number} [args.timeout=20000] - The timeout in ms (default: 20 secs)
 * @param {number} [args.timeoutMsg] - The error message to throw when times out.
 * @param {string} [args.interval=500] - The interval between condition checks (default: half second)
 *
 * @returns {boolean}
 */
export const waitForCondition = async ({
  condition,
  timeout = 20000,
  timeoutMsg,
  interval,
}: WaitForConditionOptions = {}) => {
  return driver.waitUntil(() => {
    return condition()
  },
  {
    ...(Number.isInteger(interval) && {
      interval,
    }),
    ...(Number.isInteger(timeout) && {
      timeout,
    }),
    timeoutMsg: timeoutMsg || `The condition was not met within the timeout of ${ timeout }`,
  })
}

// Android source uses 125ms for a single tap and 500ms as the long press time:
export const PRESSED_STATE_DURATION = 125
export const DEFAULT_LONG_PRESS_TIMEOUT = 500

export const tapAtPoint = async ({
  element = null,
  x,
  y,
  duration = 200,
}: TapAtPointOptions = {}) => {
  // expressing a 1/10th second tap with a 200ms wait after the finger first touch
  // http://appium.io/docs/en/commands/interactions/actions/
  return driver.performActions([{
    type: 'pointer',
    id: 'finger1',
    parameters: {
      pointerType: 'touch',
    },
    actions: [
      {
        type: 'pointerMove',
        duration: 0,
        x,
        y,
      },
      {
        type: 'pointerDown',
        button: 0,
      },
      {
        type: 'pause',
        duration,
      },
      {
        type: 'pointerUp',
        button: 0,
      },
    ]
  }])
}

/**
 * Sends tap action vs click. Default is to send tap to middle.
 *
 * @param {WebElement} element - the WebElement from appium
 * @param {string} selector - if element is not provided then findElement
 * @param {Number} xPct - horizontal percentage adjustment. 0.9 would put tap 10% from RHS
 * @param {Number} yPct - vertical percentage.
 * @example
 * ``` js
 * // This is a tap 10% from right hand side
 * tapElement({element: el, x: 0.9, y: 0.5})
 * ```
 */
export const tapElement = async ({
  element = null,
  xPct = 0.5,
  yPct = 0.5,
  selector,
}: TapElementOptions = {}) => {
  const { el, sel } = await findEleAndSel({
    element,
    selector,
  })

  log.info('tapElement', {
    selector: sel,
  })

  const elRect = await driver.getElementRect(el.elementId)
  // console.log(`convert ${ route } -strokewidth 0 -fill "rgba( 255, 215, 0 , 0.5 )" -draw "rectangle ${ elRect.x },${ elRect.y } ${ elRect.x + elRect.width },${ elRect.y + elRect.height}" ./build/output.jpg`)
  const point = {
    x: elRect.x + Math.round(elRect.width * xPct),
    y: elRect.y + Math.round(elRect.height * yPct),
  }

  return tapAtPoint({
    element: el,
    ...point
  })
}

export const tapAllAroundElement = async ({
  element,
  timeout = 2000,
  interval = 400,
  selector,
  timeoutMsg = '',
  check = () => {}
}: TapAllAroundElementOptions = {}) => {
  const xyPcts = [
    // [ 0.6, 0.5 ], [ 0.5, 0.4 ], [ 0.4, 0.5 ], [ 0.5, 0.6 ],
    // [ 0.7, 0.5 ], [ 0.5, 0.3 ], [ 0.3, 0.5 ], [ 0.5, 0.7 ],
    // [ 0.8, 0.5 ], [ 0.5, 0.2 ], [ 0.3, 0.5 ], [ 0.5, 0.8 ],
    // [ 0.9, 0.5 ], [ 0.5, 0.1 ], [ 0.2, 0.5 ], [ 0.5, 0.9 ],
  ]
  for (let i = 1; i < 5; i++) {
    xyPcts.push({
      x: (5 + i) / 10,
      y: 0.5,
    })
    xyPcts.push({
      x: 0.5,
      y: (5 - i) / 10,
    })
    xyPcts.push({
      x: (5 - i) / 10,
      y: 0.5,
    })
    xyPcts.push({
      x: 0.5,
      y: (5 + i) / 10,
    })
  }

  driver.waitUntil(
    async () => {
      const pair = xyPcts.shift()

      await tapElement({
        element,
        selector,
        xPct: pair.x,
        yPct: pair.y,
      })

      const checked = await check()
      return checked
    },
    {
      timeout,
      interval,
      timeoutMsg,
    },
  )
}

/**
 * Capture some debug info in a failed test. The server logs, source and screenshot
 *
 * @param {string} desc - the test description
 */
export const captureDebug = async ({
  desc = '',
}: { desc?: string } = {}) => {
  // print appium logs
  log.info('======== APPIUM SERVER LOGS ========')
  if (isSauceNativeMode(driver.WDIO_TEST_IT_MODE)) {
    log.info('Unable to capture appium server logs on saucelabs')
  } else {
    // const logTypes = driver.getLogTypes()
    // syslog: System Logs - Device logs for iOS applications on real devices and simulators
    // crashlog: Crash Logs - Crash reports for iOS applications on real devices and simulators
    // performance: Performance Logs - Debug Timelines on real devices and simulators
    // server: Appium server logs
    // safariConsole: Safari Console Logs - data written to the JS console in Safari
    // safariNetwork: Safari Network Logs - information about network operations undertaken by Safari
    const entries = await driver.getLogs('server')
    entries.forEach((entry) => {
      log.info(`${ new Date(entry.timestamp) } ${ entry.message }`)
    })
  }
  log.info('================')

  // print source
  log.info('======== APP SOURCE ========')
  // https://appium.io/docs/en/commands/session/source/
  log.info(await driver.getPageSource())
  log.info('================')

  // save screenshot
  log.info('======== SCREENSHOT ========')
  let ssRoute
  if (desc) {
    ssRoute = desc.replace(/[^a-zA-Z0-9-_\\.]/ig, '_')
  } else {
    ssRoute = generateScreenshotName()
  }

  if (ssRoute.length < 6) {
    ssRoute = generateScreenshotName()
  }

  if (driver.isAndroid) {
    ssRoute = `android-${ ssRoute }.png`
  } else {
    ssRoute = `ios-${ ssRoute }.png`
  }
  log.info('File=', ssRoute)

  const data = await driver.takeScreenshot()
  fs.writeFile(ssRoute, data.replace(/^data:image\/png;base64,/, ''), 'base64', function writeScreenshot(err) {
    if (err) {
      throw err
    }
  })
  log.info('================')
}

export const enterStringOnKeyboard = async (string = '') => {
  // http://appium.io/docs/en/commands/interactions/actions/
  const chars = string.split('')
  return driver.performActions([{
    type: 'key',
    id: 'keyboard',
    actions: chars.reduce((reducer, char) => {
      reducer.push({
        type: 'keyDown',
        value: char,
      })

      reducer.push({
        type: 'keyUp',
        value: char,
      })

      return reducer
    }, []),
  }])
}

export const enterCharOnKeyboard = async (char) => {
  // http://appium.io/docs/en/commands/interactions/actions/
  return driver.performActions([{
    type: 'key',
    id: 'keyboard',
    actions: [
      {
        type: 'keyDown',
        value: char,
      },
      {
        type: 'keyUp',
        value: char,
      }
    ]
  }])
}

export const returnOnKeyboard = async () => {
  // https://w3c.github.io/webdriver/webdriver-spec.html#keyboard-actions
  if (driver.isAndroid) {
    return enterCharOnKeyboard('\uE007')
    // driver.performActions([{type: 'key', id: 'finger1', actions: [{type: 'keyDown', value: '\uE007'}, {type: 'keyUp', value: '\uE007'},]}])
  }

  const el = await $('//XCUIElementTypeButton[@name="Done" or @name="return" or @name="Next:" or @name="Go"]')
  return el.click()
}
