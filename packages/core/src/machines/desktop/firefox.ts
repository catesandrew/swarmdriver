import lodash from 'lodash'

import {
  existy,
  parseBool,
  parseWhole,
} from '../../utils'

import type { Capability, Envs, MachineSetupOptions, WdioConfig } from '../../types'

const {
  omitBy,
  isNil,
} = lodash

/** Sauce Labs' Firefox-specific `sauce:options` keys, as parsed from the env. */
export type FirefoxSauceCapabilities = ReturnType<typeof parseFirefoxSauceCapabilities>

interface DesktopFirefoxOptions extends MachineSetupOptions {
  /** `wdio:geckodriverOptions`, built by `services/gecko-driver.ts`. */
  firefoxDriverOptions?: Capability
}

// capabilities: [
//   browserName: 'firefox',
//   'goog:chromeOptions': {
//     args: [
//       '--headless',
//     ],
//   },
// ]

export const desktopSetupLocalFirefox = ({
  envs,
  // WDIO v9: see `desktopSetupLocalChrome` — driver connection details moved
  // into the `wdio:geckodriverOptions` extension capability.
  firefoxDriverOptions = {},
  ...params
}: DesktopFirefoxOptions = {}): WdioConfig => {
  return {
    capabilities: [
      omitBy({
        browserName: 'firefox',
        ...firefoxDriverOptions,
      }, isNil)
    ],
  }
}

// https://docs.saucelabs.com/dev/test-configuration-options
export const parseFirefoxSauceCapabilities = (envs: Envs) => {
  return {
    ...(existy(parseBool(envs, 'FIREFOX_SAUCE_EXTENDED_DEBUGGING', false)) && {
      extendedDebugging: parseBool(envs, 'FIREFOX_SAUCE_EXTENDED_DEBUGGING', false)
    }),
    ...(existy(parseBool(envs, 'FIREFOX_SAUCE_CAPTURE_PERFORMANCE', false)) && {
      capturePerformance: parseBool(envs, 'FIREFOX_SAUCE_CAPTURE_PERFORMANCE', false)
    }),
    ...(existy(envs.FIREFOX_SAUCE_GECKODRIVER_VERSION) && {
      geckodriverVersion: envs.FIREFOX_SAUCE_GECKODRIVER_VERSION,
    }),
    ...(existy(parseWhole(envs, 'FIREFOX_SAUCE_COMMAND_TIMEOUT', 300)) && {
      commandTimeout: parseWhole(envs, 'FIREFOX_SAUCE_COMMAND_TIMEOUT', 300)
    }),
  }
}

const buildSauceFirefoxCapabilities = ({
  ...opts
}: Partial<FirefoxSauceCapabilities> = {}) => {
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
    // Specifies the Firefox GeckoDriver version. The default geckodriver
    // version varies based on the version of Firefox specified. For a list of
    // geckodriver versions and the Firefox versions they support, see
    // [geckodriver Supported Platforms](https://firefox-source-docs.mozilla.org/testing/geckodriver/Support.html).
    ...(existy(opts.geckodriverVersion) && {
      geckodriverVersion: opts.geckodriverVersion,
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

export const desktopSetupSauceFirefox = ({
  envs,
  sauceOptions,
  ...params
}: MachineSetupOptions = {}): WdioConfig => {
  const sauceFirefoxOptions = buildSauceFirefoxCapabilities(parseFirefoxSauceCapabilities(envs))

  return {
    capabilities: [
      omitBy({
        ...(params.browserName ?
          {
            browserName: params.browserName,
          } :
          {
            browserName: 'firefox',
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
          ...sauceFirefoxOptions,
        }
      }, isNil),
    ],
  }
}
