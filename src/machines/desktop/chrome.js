import lodash from 'lodash'

import {
  existy,
  parseBool,
  parseWhole,
} from '../../utils'

const {
  omitBy,
  isNil,
} = lodash

// capabilities: [
//   browserName: 'chrome',
//   'goog:chromeOptions': {
//     args: [
//       '--no-sandbox',
//       '--disable-infobars',
//       '--headless',
//       // Use --disable-gpu to avoid an error from a missing Mesa library, as per
//       // https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
//       '--disable-gpu',
//     ],
//   },
// ]

/**
 * Generate an x86 config used to test web applications in chrome
 * @param {object} baseConfig -
 * @param {*} params -
 * @returns {{}} Returns a config
 */
export const desktopSetupLocalChrome = ({
  envs,
  // WDIO v9: driver connection details are no longer bare capability keys
  // (`hostname`/`port`/`path`/`protocol` were dropped when capabilities became
  // strict W3C). They live under the `wdio:chromedriverOptions` extension,
  // built by `services/chrome-driver.js`.
  chromeDriverOptions = {},
  ...params
} = {}) => {
  return {
    capabilities: [
      omitBy({
        browserName: 'chrome',
        ...chromeDriverOptions,
      }, isNil)
    ],
  }
}

// https://docs.saucelabs.com/dev/test-configuration-options
const parseChromeSauceCapabilities = (envs) => {
  return {
    ...(existy(envs.CHROME_SAUCE_CHROMEDRIVER_VERSION) && {
      chromedriverVersion: envs.CHROME_SAUCE_CHROMEDRIVER_VERSION,
    }),
    ...(existy(parseBool(envs, 'CHROME_SAUCE_EXTENDED_DEBUGGING', false)) && {
      extendedDebugging: parseBool(envs, 'CHROME_SAUCE_EXTENDED_DEBUGGING', false)
    }),
    ...(existy(parseBool(envs, 'CHROME_SAUCE_CAPTURE_PERFORMANCE', false)) && {
      capturePerformance: parseBool(envs, 'CHROME_SAUCE_CAPTURE_PERFORMANCE', false)
    }),
    ...(existy(parseWhole(envs, 'CHROME_SAUCE_COMMAND_TIMEOUT', 300)) && {
      commandTimeout: parseWhole(envs, 'CHROME_SAUCE_COMMAND_TIMEOUT', 300)
    }),
  }
}

const buildSauceChromeCapabilities = ({
  ...opts
} = {}) => {
  return {
    // Enables [Extended Debugging features](https://docs.saucelabs.com/insights/debug/).
    // This applies to Firefox and Chrome only. It records HAR files and console logs for both
    // of these browsers. In Chrome, it also enables network interception,
    // network and cpu throttling as well as access to network logs during the
    // session. It is required to be true for `capturePerformance`.
    ...(existy(opts.extendedDebugging) && {
      extendedDebugging: opts.extendedDebugging,
    }),
    // Enables Performance Capture feature. Sauce Performance Testing can be
    // enabled by setting both `extendedDebugging` and `capturePerformance` to
    // `true`.
    ...(existy(opts.capturePerformance) && {
      capturePerformance: opts.capturePerformance,
    }),
    // USE THIS FOR SPECIFYING A SPECIFIC POINT RELEASE
    //
    // If you find a bug that you determine is driver related, you can specify
    // the latest point release of the chrome driver that matches the browser
    // version.
    //
    // For example, Sauce Labs might default to `"88.0.4324.27"`, but there is a
    // bug fix in version `"88.0.4324.96"`, so you can specify that in your
    // test.
    ...(existy(opts.chromedriverVersion) && {
      chromedriverVersion: opts.chromedriverVersion,
    }),
    // Sets command timeout in seconds. As a safety measure to prevent Selenium
    // crashes from making your tests run indefinitely, we limit how long
    // Selenium can take to run a command in our browsers. This is set to 300
    // seconds by default. The maximum command timeout value allowed is 600
    // seconds.
    ...(existy(opts.commandTimeout) && {
      commandTimeout: opts.commandTimeout > 600 ? 600 : opts.commandTimeout,
    }),
  }
}

export const desktopSetupSauceChrome = ({
  envs,
  sauceOptions,
  ...params
} = {}) => {
  const sauceChromeOptions = buildSauceChromeCapabilities(parseChromeSauceCapabilities(envs))

  return {
    capabilities: [
      omitBy({
        ...(params.browserName ?
          {
            browserName: params.browserName,
          } :
          {
            browserName: 'chrome',
          }),
        ...(params.browserVersion ?
          {
            browserVersion: params.browserVersion,
          } :
          {
            browserVersion: 'latest',
          }),
        ...(params.platformName ?
          {
            platformName: params.platformName,
          } :
          {
            platformName: 'Windows 11',
          }),
        'sauce:options': {
          ...sauceOptions,
          ...sauceChromeOptions,
        }
      }, isNil),
    ],
  }
}
