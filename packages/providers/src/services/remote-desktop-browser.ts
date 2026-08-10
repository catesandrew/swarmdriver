import lodash from 'lodash'

import {
  setupSauceBrowser,
} from './remote'

import {
  desktopSetupSauceChrome,
  desktopSetupSauceSafari,
  desktopSetupSauceFirefox,
} from '@caps/core/machines'

import {
  TestMode,
  Browser,
} from '@caps/core/enums'

import {
  buildSauceVars,
  parseSauceServiceSettings,
  buildSauceSettings,
  parseSauceCapabilities,
  parseSauceSafariCapabilities,
  buildSauceSafariCapabilities,
  parseSauceChromeCapabilities,
  buildSauceChromeCapabilities,
  parseSauceFirefoxCapabilities,
  buildSauceFirefoxCapabilities,
  buildW3CWebDriverCapabilitiesRequired,
  buildW3CWebDriverBrowserCapabilitiesOptional,
  buildDesktopBrowserCapabilitiesSauceSpecificOptional,
  buildDesktopMobileCapabilitiesSauceSpecificOptional,
  buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional,
} from '../saucelabs/capabilities'

import {
  parseEnvSettings,
} from '@caps/core/services/base'

import type {
  SauceCapabilityValues,
  SauceSetupOptions,
  WdioConfig,
} from '../types'

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
interface HelperCapabilityOptions extends SauceCapabilityValues {
  sauceCapabilityValues?: SauceCapabilityValues
  buildId?: string
  tunnelId?: string
  tunnelOwner?: string
}

const helperSauceDesktopBrowserCapability = ({
  sauceCapabilityValues = {},
  buildId,
  tunnelId,
  tunnelOwner,
  ...params
}: HelperCapabilityOptions = {}) => {
  const values = {
    ...sauceCapabilityValues,
    ...params,
  }

  return {
    ...buildW3CWebDriverCapabilitiesRequired(values),
    ...buildW3CWebDriverBrowserCapabilitiesOptional(values),
    sauceOptions: {
      ...buildDesktopBrowserCapabilitiesSauceSpecificOptional(values),
      ...buildDesktopMobileCapabilitiesSauceSpecificOptional({
        build: buildId,
        tunnelName: tunnelId,
        ...(tunnelOwner && {
          tunnelOwner,
        }),
        customData: {},
        ...values,
      }),
      ...buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional(values),
    }
  }
}

/**
 * Widened to {@link WdioConfig} because each `Browser` branch returns a
 * differently-shaped machine config, and because it returns `undefined` for an
 * unrecognised browser — behaviour the caller has always relied on.
 */
const helperSauceDesktopBrowser = ({
  envs,
  config: copyBaseConfig,
  sauceCapabilityValues,
  buildId,
  tunnelId,
  tunnelOwner,
  browser,
  ...params
}: SauceSetupOptions & {
  sauceCapabilityValues?: SauceCapabilityValues
  buildId?: string
  tunnelId?: string
  browser?: number
} = {}): WdioConfig => {
  if (browser === Browser.SAFARI) {
    const sauceSafariCapabilityValues = {
      ...sauceCapabilityValues,
      ...parseSauceSafariCapabilities(envs),
    }

    const sauceCapabilities = helperSauceDesktopBrowserCapability({
      sauceCapabilityValues: sauceSafariCapabilityValues,
      buildId,
      tunnelId,
      tunnelOwner,
    })

    const sauceSafariCapabilities = buildSauceSafariCapabilities(sauceSafariCapabilityValues)

    return desktopSetupSauceSafari({
      envs,
      ...sauceCapabilities,
      ...sauceSafariCapabilities,
      sauceOptions: {
        ...sauceCapabilities.sauceOptions,
        ...sauceSafariCapabilities.sauceOptions,
      },
      ...params,
    })
  }

  if (browser === Browser.CHROME) {
    const sauceChromeCapabilityValues = {
      ...sauceCapabilityValues,
      ...parseSauceChromeCapabilities(envs),
    }

    const sauceCapabilities = helperSauceDesktopBrowserCapability({
      sauceCapabilityValues: sauceChromeCapabilityValues,
      buildId,
      tunnelId,
      tunnelOwner,
    })

    const sauceChromeCapabilities = buildSauceChromeCapabilities(sauceChromeCapabilityValues)

    return desktopSetupSauceChrome({
      envs,
      ...sauceCapabilities,
      ...sauceChromeCapabilities,
      sauceOptions: {
        ...sauceCapabilities.sauceOptions,
        ...sauceChromeCapabilities.sauceOptions,
      },
      ...params,
    })
  }

  if (browser === Browser.FIREFOX) {
    const sauceFirefoxCapabilityValues = {
      ...sauceCapabilityValues,
      ...parseSauceFirefoxCapabilities(envs),
    }

    const sauceCapabilities = helperSauceDesktopBrowserCapability({
      sauceCapabilityValues: sauceFirefoxCapabilityValues,
      buildId,
      tunnelId,
      tunnelOwner,
    })

    const sauceFirefoxCapabilities = buildSauceFirefoxCapabilities(sauceFirefoxCapabilityValues)

    return desktopSetupSauceFirefox({
      envs,
      ...sauceCapabilities,
      ...sauceFirefoxCapabilities,
      sauceOptions: {
        ...sauceCapabilities.sauceOptions,
        ...sauceFirefoxCapabilities.sauceOptions,
      },
      ...params,
    })
  }
}

const helperSauceDesktopBrowserTestMode = (browser: number): number | undefined => {
  if (browser === Browser.SAFARI) {
    return TestMode.SAUCE_BROWSER_X86
  }

  if (browser === Browser.CHROME) {
    return TestMode.SAUCE_BROWSER_X86
  }

  if (browser === Browser.FIREFOX) {
    return TestMode.SAUCE_BROWSER_X86
  }
}

export const setupSauceDesktopBrowsers = ({
  envs,
  tunnelPrefix,
  buildSuffix,
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
  const { reporters, browsers = [] } = parseEnvSettings(envs, params)

  const {
    tunnelId,
    tunnelOwner,
    buildId,
  } = buildSauceVars({
    envs,
    tunnelPrefix,
    buildSuffix,
  })

  let baseConfig = setupSauceBrowser({
    envs,
    reporters,
    specRepporterShowPreface: browsers.length > 1,
    junitReporterOutputFileFormat: (options) => {
      return `wdio-desktop-${ options.capabilities.browserName.toLowerCase() }-reporter.xml`
    },
    ...params,
  })

  // sauce services
  const sauceValues = parseSauceServiceSettings(envs)
  const sauceConfig = {
    tunnelName: tunnelId,
    tunnelOwner,
    ...sauceValues,
    ...params,
  }
  const sauceServiceConfig = buildSauceSettings(sauceConfig)

  // sauce capabilities
  const sauceCapabilityValues = {
    ...parseSauceCapabilities(envs),
    ...params,
  }

  baseConfig = {
    ...baseConfig,
    ...sauceServiceConfig,
    services: [
      ...baseConfig.services || [],
      ...sauceServiceConfig.services || [],
    ],
  }

  // Not a deep clone but point is `baseConfig` is a side-effect free object
  const copyBaseConfig = Object.assign({}, baseConfig)

  return browsers.reduce((acc, browser) => {
    const { capabilities = [], services = [], ...config } = helperSauceDesktopBrowser({
      envs,
      config: copyBaseConfig,
      browser,
      sauceCapabilityValues,
      buildId,
      tunnelId,
      tunnelOwner,
      ...omit(params, ['reporters', 'browsers']),
    })

    if (Array.isArray(capabilities) && capabilities.length > 0) {
      capabilities[0]['swarmdriver:testMode'] = helperSauceDesktopBrowserTestMode(browser)
    }

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
 */
export const setupSauceDesktopSafari = ({
  envs,
  reporters,
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
  return setupSauceDesktopBrowsers({
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
 */
export const setupSauceDesktopChrome = ({
  envs,
  reporters,
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
  return setupSauceDesktopBrowsers({
    reporters,
    browsers: [
      Browser.CHROME,
    ],
    envs,
    ...params,
  })
}
