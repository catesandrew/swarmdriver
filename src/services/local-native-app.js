import lodash from 'lodash'

import {
  androidSetupLocalNativeApp,
  iosSetupLocalNativeApp,
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
  setupLocalNative,
} from './local'

const {
  omit,
} = lodash

//   _  _      _   _             _
//  | \| |__ _| |_(_)_ _____    /_\  _ __ _ __
//  | .` / _` |  _| \ V / -_)  / _ \| '_ \ '_ \
//  |_|\_\__,_|\__|_|\_/\___| /_/ \_\ .__/ .__/
//                                  |_|  |_|
// Native Application
const helperNativeApp = ({
  envs,
  config: copyBaseConfig,
  appiumConfig,
  device,
  ...params
} = {}) => {
  if (device === Device.IOS) {
    return iosSetupLocalNativeApp({
      envs,
      appiumConfig,
      ...params,
    })
  }

  if (device === Device.ANDROID) {
    return androidSetupLocalNativeApp({
      envs,
      appiumConfig,
      ...params,
    })
  }
}

const helperLocalNativeAppTestMode = (device) => {
  if (device === Device.ANDROID) {
    return TestMode.LOCAL_NATIVE_APP_ANDROID
  }

  if (device === Device.IOS) {
    return TestMode.LOCAL_NATIVE_APP_IOS
  }
}

export const setupLocalNativeApp = ({
  envs,
  ...params
} = {}) => {
  const { reporters, devices = [] } = parseEnvSettings(envs, params)
  envs.WDIO_PORT || (envs.WDIO_PORT = '4723')
  envs.APPIUM_LOG_NO_COLORS || (envs.APPIUM_LOG_NO_COLORS = 'true')
  envs.APPIUM_RELAXED_SECURITY || (envs.APPIUM_RELAXED_SECURITY = 'true')

  let baseConfig = setupLocalNative({
    envs,
    reporters,
    specRepporterShowPreface: devices.length > 1,
    junitReporterOutputFileFormat: (options) => {
      return `wdio-${ options.capabilities.platformName.toLowerCase() }-app-reporter.xml`
    },
    ...params,
  })

  const appiumValues = parseAppiumServiceSettings(envs)
  const appiumConfig = {
    ...appiumValues,
    ...params,
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
    const { capabilities = [], services = [], ...config } = helperNativeApp({
      envs,
      config: copyBaseConfig,
      appiumConfig,
      device,
      ...omit(params, ['reporters', 'devices']),
    })
    capabilities[0]['swarmdriver:testMode'] = helperLocalNativeAppTestMode(device)

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
 * Generate a config to test native android applications, locally.
 * @returns {{}} Returns a config
 */
export const setupLocalNativeAndroid = ({
  envs,
  reporters,
  ...params
} = {}) => {
  return setupLocalNativeApp({
    reporters,
    devices: [
      Device.ANDROID,
    ],
    envs,
    ...params,
  })
}

/**
 * Generate a config to test native ios applications, locally.
 * @returns {{}} Returns a config
 */
export const setupLocalNativeIos = ({
  envs,
  reporters,
  ...params
} = {}) => {
  return setupLocalNativeApp({
    reporters,
    devices: [
      Device.IOS,
    ],
    envs,
    ...params,
  })
}
