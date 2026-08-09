import lodash from 'lodash'

import {
  setupSauceBrowser,
} from './remote'

import {
  androidSetupSauceBrowser,
  iosSetupSauceBrowser,
} from '../machines'

import {
  TestMode,
  Device,
} from '../enums'

import {
  buildSauceVars,
  parseSauceServiceSettings,
  buildSauceSettings,

  parseSauceCapabilities,
  parseSauceAndroidCapabilities,
  buildSauceAndroidCapabilities,
  parseSauceIosCapabilities,
  buildSauceIosCapabilities,
  buildMobileAppiumCapabilities,
  buildMobileAppiumTimeoutCapabilities,
  buildDesktopMobileCapabilitiesSauceSpecificOptional,
  buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional,
} from '../providers/saucelabs/capabilities'

import {
  parseEnvSettings,
} from './base'

const {
  omit,
} = lodash

//  ___          _
// |   \ _____ _(_)__ ___
// | |) / -_) V / / _/ -_)
// |___/\___|\_/|_\__\___|
//  ___
// | _ )_ _ _____ __ _____ ___ _ _ ___
// | _ \ '_/ _ \ V  V (_-</ -_) '_(_-<
// |___/_| \___/\_/\_//__/\___|_| /__/
//
// Web Application in Device Browsers
const helperSauceDeviceBrowserCapability = ({
  sauceCapabilityValues = {},
  buildId,
  tunnelId,
  tunnelOwner,
  ...params
} = {}) => {
  const values = {
    ...sauceCapabilityValues,
    ...params,
  }

  return {
    ...buildMobileAppiumCapabilities(values),
    ...buildMobileAppiumTimeoutCapabilities(values),
    sauceOptions: {
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

const helperSauceDeviceBrowser = ({
  envs,
  config: copyBaseConfig,
  sauceCapabilityValues,
  buildId,
  tunnelId,
  tunnelOwner,
  device,
  ...params
} = {}) => {
  if (device === Device.IOS) {
    const sauceIosCapabilityValues = {
      ...sauceCapabilityValues,
      ...parseSauceIosCapabilities(envs),
      platformName: 'iOS',
      deviceName: 'iPhone 11 Simulator',
      platformVersion: '15.4',
      browserName: 'Safari',
    }

    const sauceCapabilities = helperSauceDeviceBrowserCapability({
      sauceCapabilityValues: sauceIosCapabilityValues,
      buildId,
      tunnelId,
      tunnelOwner,
    })

    const sauceIosCapabilities = buildSauceIosCapabilities(sauceIosCapabilityValues)

    return iosSetupSauceBrowser({
      envs,
      ...sauceCapabilities,
      ...sauceIosCapabilities,
      sauceOptions: {
        ...sauceCapabilities.sauceOptions,
        ...sauceIosCapabilities.sauceOptions,
      },
      ...params,
    })
  }

  if (device === Device.ANDROID) {
    // Note that on 4.4+ devices, you can also use the 'Browser' browserName cap
    // to automate the built-in browser. On all devices you can use the 'Chromium'
    // browserName cap to automate a build of Chromium which you have installed.
    const sauceAndroidCapabilityValues = {
      ...sauceCapabilityValues,
      ...parseSauceAndroidCapabilities(envs),
      platformName: 'Android',
      deviceName: 'Google Pixel 4a (5G) GoogleAPI Emulator',
      platformVersion: '12.0',
      browserName: 'Chrome',
    }

    const sauceCapabilities = helperSauceDeviceBrowserCapability({
      sauceCapabilityValues: sauceAndroidCapabilityValues,
      buildId,
      tunnelId,
      tunnelOwner,
    })

    const sauceAndroidCapabilities = buildSauceAndroidCapabilities(sauceAndroidCapabilityValues)

    return androidSetupSauceBrowser({
      envs,
      ...sauceCapabilities,
      ...sauceAndroidCapabilities,
      sauceOptions: {
        ...sauceCapabilities.sauceOptions,
        ...sauceAndroidCapabilities.sauceOptions,
      },
      ...params,
    })
  }
}

const helperSauceDeviceBrowserTestMode = (device) => {
  if (device === Device.IOS) {
    return TestMode.SAUCE_BROWSER_IOS
  }

  if (device === Device.ANDROID) {
    return TestMode.SAUCE_BROWSER_ANDROID
  }
}

export const setupSauceDeviceBrowsers = ({
  envs,
  tunnelPrefix,
  buildSuffix,
  ...params
} = {}) => {
  const { reporters, devices = [] } = parseEnvSettings(envs, params)

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
    specRepporterShowPreface: devices.length > 1,
    junitReporterOutputFileFormat: (options) => {
      return `wdio-device-${ options.capabilities.platformName.toLowerCase() }-reporter.xml`
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

  return devices.reduce((acc, device) => {
    const { capabilities = [], services = [], ...config } = helperSauceDeviceBrowser({
      envs,
      config: copyBaseConfig,
      device,
      sauceCapabilityValues,
      buildId,
      tunnelId,
      ...omit(params, ['reporters', 'devices']),
    })

    if (Array.isArray(capabilities) && capabilities.length > 0) {
      capabilities[0]['swarmdriver:testMode'] = helperSauceDeviceBrowserTestMode(device)
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
 * Generate a config to test web applications, on android devices, locally.
 * @returns {{}} Returns a config
 */
export const setupSauceAndroidBrowser = ({
  envs,
  reporters,
  ...params
} = {}) => {
  return setupSauceDeviceBrowsers({
    reporters,
    devices: [
      Device.ANDROID,
    ],
    envs,
    ...params,
  })
}

/**
 * Generate a config to test web applications, on ios devices, locally.
 * @returns {{}} Returns a config
 */
export const setupSauceiOSBrowser = ({
  envs,
  reporters,
  ...params
} = {}) => {
  return setupSauceDeviceBrowsers({
    reporters,
    devices: [
      Device.IOS,
    ],
    envs,
    ...params,
  })
}
