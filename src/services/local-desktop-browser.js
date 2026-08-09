import lodash from 'lodash'

import {
  desktopSetupLocalChrome,
  desktopSetupLocalSafari,
  desktopSetupLocalFirefox,
} from '../machines'

import {
  TestMode,
  Browser,
} from '../enums'

import {
  parseEnvSettings,
} from './base'

import {
  onlyUnique,
} from './utils'

import {
  parseChromeDriverServiceSettings,
  buildChromeDriverSettings,
} from './chrome-driver'

import {
  parseSafariDriverServiceSettings,
  buildSafariDriverSettings,
} from './safari-driver'

import {
  parseGeckoDriverServiceSettings,
  buildGeckoDriverSettings,
} from './gecko-driver'

import {
  setupLocalBrowser,
} from './local'

const {
  omit,
} = lodash

//  ___         _   _
// |   \ ___ __| |_| |_ ___ _ __
// | |) / -_|_-< / /  _/ _ \ '_ \
// |___/\___/__/_\_\\__\___/ .__/
//                          |_|
//  ___
// | _ )_ _ _____ __ _____ ___ _ _ ___
// | _ \ '_/ _ \ V  V (_-</ -_) '_(_-<
// |___/_| \___/\_/\_//__/\___|_| /__/
//
// Web Application in Desktop Browsers
const helperDesktopBrowser = ({
  envs,
  config: copyBaseConfig,
  chromeDriverOptions,
  firefoxDriverOptions,
  safariDriverOptions,
  browser,
  ...params
} = {}) => {
  if (browser === Browser.SAFARI) {
    return desktopSetupLocalSafari({
      envs,
      safariDriverOptions,
      ...params,
    })
  }

  if (browser === Browser.CHROME) {
    return desktopSetupLocalChrome({
      envs,
      chromeDriverOptions,
      ...params,
    })
  }

  if (browser === Browser.FIREFOX) {
    return desktopSetupLocalFirefox({
      envs,
      firefoxDriverOptions,
      ...params,
    })
  }
}

const helperLocalDesktopBrowserTestMode = (browser) => {
  if (browser === Browser.SAFARI) {
    return TestMode.LOCAL_BROWSER_X86
  }

  if (browser === Browser.CHROME) {
    return TestMode.LOCAL_BROWSER_X86
  }

  if (browser === Browser.FIREFOX) {
    return TestMode.LOCAL_BROWSER_X86
  }
}

export const setupLocalDesktopBrowsers = ({
  envs,
  ...params
} = {}) => {
  const { reporters, browsers = [] } = parseEnvSettings(envs, params)

  let baseConfig = setupLocalBrowser({
    envs,
    reporters,
    specRepporterShowPreface: browsers.length > 1,
    junitReporterOutputFileFormat: (options) => {
      return `wdio-desktop-${ options.capabilities.browserName.toLowerCase() }-reporter.xml`
    },
    ...params,
  })

  // WDIO v9 starts driver binaries itself, so there are no chromedriver /
  // geckodriver / safaridriver *services* to register any more. Driver tuning
  // is a per-capability concern (`wdio:chromedriverOptions` and friends), so
  // these fragments get merged into each browser's capability below rather
  // than into `config.services`.
  let chromeDriverOptions,
      firefoxDriverOptions,
      safariDriverOptions

  browsers.filter(onlyUnique).forEach((browser) => {
    if (browser === Browser.SAFARI) {
      safariDriverOptions = buildSafariDriverSettings({
        ...parseSafariDriverServiceSettings(envs),
        ...params,
      })
    }

    if (browser === Browser.CHROME) {
      chromeDriverOptions = buildChromeDriverSettings({
        ...parseChromeDriverServiceSettings(envs),
        ...params,
      })
    }

    if (browser === Browser.FIREFOX) {
      firefoxDriverOptions = buildGeckoDriverSettings({
        ...parseGeckoDriverServiceSettings(envs),
        ...params,
      })
    }
  })

  // Not a deep clone but point is `baseConfig` is a side-effect free object
  const copyBaseConfig = Object.assign({}, baseConfig)

  return browsers.reduce((acc, browser) => {
    const { capabilities = [], services = [], ...config } = helperDesktopBrowser({
      envs,
      config: copyBaseConfig,
      chromeDriverOptions,
      firefoxDriverOptions,
      safariDriverOptions,
      browser,
      ...omit(params, ['reporters', 'browsers']),
    })
    capabilities[0]['swarmdriver:testMode'] = helperLocalDesktopBrowserTestMode(browser)

    return {
      ...acc,
      ...config,
      capabilities: [
        ...acc.capabilities || [],
        ...capabilities,
      ],
      services: [
        ...acc.services || [],
        ...services,
      ],
    }
  }, baseConfig)
}

/**
 * Generate a config to test web applications in safari, on x86 boxes, locally.
 * @returns {{}} Returns a config
 */
export const setupLocalDesktopSafari = ({
  envs,
  reporters,
  ...params
} = {}) => {
  return setupLocalDesktopBrowsers({
    reporters,
    browsers: [
      Browser.SAFARI,
    ],
    envs,
    ...params,
  })
}

/**
 * Generate a config to test web applications in chrome, on x86 boxes, locally.
 * @returns {{}} Returns a config
 */
export const setupLocalDesktopChrome = ({
  envs,
  reporters,
  ...params
} = {}) => {
  return setupLocalDesktopBrowsers({
    reporters,
    browsers: [
      Browser.CHROME,
    ],
    envs,
    ...params,
  })
}
