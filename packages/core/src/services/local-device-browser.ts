import lodash from 'lodash'

import {
  androidSetupLocalBrowser,
  iosSetupLocalBrowser,
} from '../machines'

import {
  TestMode,
  Device,
} from '../enums'

import {
  parseEnvSettings,
} from './base'

import {
  parseAppiumServiceSettings,
  buildAppiumSettings,
} from './appium'

import {
  setupLocalBrowser,
} from './local'

import type { AppiumConnection, WdioConfig } from '../types'
import type { LocalSetupOptions } from './local'

const {
  omit,
} = lodash

interface DeviceBrowserOptions extends LocalSetupOptions {
  /** a side-effect-free copy of the base config */
  config?: WdioConfig
  appiumConfig?: AppiumConnection
  /** a single {@link Device} enum value */
  device?: number
}

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
const helperLocalDeviceBrowser = ({
  envs,
  config: copyBaseConfig,
  appiumConfig,
  device,
  ...params
}: DeviceBrowserOptions = {}): WdioConfig | undefined => {
  if (device === Device.IOS) {
    return iosSetupLocalBrowser({
      envs,
      appiumConfig,
      ...params,
      deviceName: 'iPhone Simulator',
      platformVersion: '15.5',
      browserName: 'Safari',
    })
  }

  if (device === Device.ANDROID) {
    // Note that on 4.4+ devices, you can also use the 'Browser' browserName cap
    // to automate the built-in browser. On all devices you can use the 'Chromium'
    // browserName cap to automate a build of Chromium which you have installed.
    return androidSetupLocalBrowser({
      envs,
      appiumConfig,
      ...params,
      deviceName: 'Pixel',
      platformVersion: '12.0',
      browserName: 'Chrome',
    })
  }
}

const helperLocalDeviceBrowserTestMode = (device: number): number | undefined => {
  if (device === Device.IOS) {
    return TestMode.LOCAL_BROWSER_IOS
  }

  if (device === Device.ANDROID) {
    return TestMode.LOCAL_BROWSER_ANDROID
  }
}

export const setupLocalDeviceBrowsers = ({
  envs,
  ...params
}: LocalSetupOptions = {}): WdioConfig => {
  const { reporters, devices = [] } = parseEnvSettings(envs, params)

  let baseConfig = setupLocalBrowser({
    envs,
    reporters,
    specRepporterShowPreface: devices.length > 1,
    junitReporterOutputFileFormat: (options: any) => {
      return `wdio-device-${ options.capabilities.platformName.toLowerCase() }-reporter.xml`
    },
    ...params,
  })

  const appiumValues = parseAppiumServiceSettings(envs)
  const appiumConfig = {
    ...appiumValues,
    ...omit(params, ['reporters', 'devices']),
    ...params,
    // automatically download the necessary chromedriver(s) into
    // `chromedriverExecutableDir` from the official Google storage
    allowInsecure: appiumValues.allowInsecure || 'chromedriver_autodownload',
  }
  const appiumServiceConfig = buildAppiumSettings(appiumConfig)

  // merge in appium
  baseConfig = {
    ...baseConfig,
    ...appiumServiceConfig,
    services: [
      ...baseConfig.services || [],
      ...appiumServiceConfig.services || [],
    ],
  }

  // Not a deep clone but point is `baseConfig` is a side-effect free object
  const copyBaseConfig = Object.assign({}, baseConfig)

  return devices.reduce((acc, device) => {
    const { capabilities = [], services = [], ...config } = helperLocalDeviceBrowser({
      envs,
      config: copyBaseConfig,
      appiumConfig,
      device,
      ...omit(params, ['reporters', 'devices']),
    })

    if (Array.isArray(capabilities) && capabilities.length > 0) {
      capabilities[0]['swarmdriver:testMode'] = helperLocalDeviceBrowserTestMode(device)
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
 */
export const setupLocalAndroidBrowser = ({
  envs,
  reporters,
  ...params
}: LocalSetupOptions = {}): WdioConfig => {
  return setupLocalDeviceBrowsers({
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
 */
export const setupLocaliOSBrowser = ({
  envs,
  reporters,
  ...params
}: LocalSetupOptions = {}): WdioConfig => {
  return setupLocalDeviceBrowsers({
    reporters,
    devices: [
      Device.IOS,
    ],
    envs,
    ...params,
  })
}
