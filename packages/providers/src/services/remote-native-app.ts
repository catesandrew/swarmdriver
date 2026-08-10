import lodash from 'lodash'

import {
  setupSauceNative,
} from './remote'

import {
  androidSetupSauceNativeApp,
  iosSetupSauceNativeApp,
} from '../machines'

import {
  TestMode,
  Device,
} from '@caps/core/enums'

import {
  buildSauceVars,
  parseSauceServiceSettings,
  buildSauceSettings,
} from '../saucelabs/capabilities'

import {
  parseEnvSettings,
} from '@caps/core/services/base'

import {
  existy,
} from '@caps/core/utils'

import type {
  SauceSetupOptions,
  WdioConfig,
} from '../types'

const {
  omit,
} = lodash

//   _  _      _   _             _
//  | \| |__ _| |_(_)_ _____    /_\  _ __ _ __
//  | .` / _` |  _| \ V / -_)  / _ \| '_ \ '_ \
//  |_|\_\__,_|\__|_|\_/\___| /_/ \_\ .__/ .__/
//                                  |_|  |_|
// Native Application
/**
 * Widened to {@link WdioConfig}: returns `undefined` for an unrecognised
 * device, which is behaviour the caller has always relied on.
 */
const helperNativeApp = ({
  envs,
  config: copyBaseConfig,
  buildId,
  device,
  ...params
}: SauceSetupOptions & { buildId?: string, device?: number } = {}): WdioConfig => {
  if (device === Device.IOS) {
    return iosSetupSauceNativeApp({
      envs,
      build: buildId,
      ...params,
    })
  }

  if (device === Device.ANDROID) {
    return androidSetupSauceNativeApp({
      envs,
      build: buildId,
      ...params,
    })
  }
}

const helperSauceNativeAppTestMode = (device: number): number | undefined => {
  if (device === Device.ANDROID) {
    return TestMode.SAUCE_NATIVE_APP_ANDROID
  }

  if (device === Device.IOS) {
    return TestMode.SAUCE_NATIVE_APP_IOS
  }
}

export const setupSauceNativeApp = ({
  envs,
  tunnelPrefix,
  buildSuffix,
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
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

  let baseConfig = setupSauceNative({
    envs,
    reporters,
    specRepporterShowPreface: devices.length > 1,
    junitReporterOutputFileFormat: (options) => {
      return `wdio-${ options.capabilities.platformName.toLowerCase() }-app-reporter.xml`
    },
    ...params,
  })

  const sauceValues = parseSauceServiceSettings(envs)
  const sauceConfig = {
    tunnelName: tunnelId,
    tunnelOwner,
    ...sauceValues,
    ...params,
  }
  const sauceServiceConfig = buildSauceSettings(sauceConfig)

  // merge in sauce
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
  const sauceSpecificOptional = {
    // Sets your Sauce Labs username for a test.
    //
    // You can either set `"username"` in capabilities or specify it in the
    // Sauce URL as Basic Authentication. For [Visual
    // Tests](https://docs.saucelabs.com/dev/test-configuration-options/#visual-testing)),
    // this must be set in capabilities.
    ...(existy(sauceConfig.user) && {
      username: sauceConfig.user,
    }),
    // Sets your Sauce Labs access key for the test.
    //
    // You can either set `"accessKey"` in capabilities or specify it in the
    // Sauce URL as Basic Authentication. For [Visual
    // Tests](https://docs.saucelabs.com/dev/test-configuration-options/#visual-testing),
    // this must be set in capabilities.
    ...(existy(sauceConfig.key) && {
      accessKey: sauceConfig.key,
    }),
    ...(sauceConfig.sauceConnect && {
      ...(existy(sauceConfig.tunnelName) && {
        tunnelName: sauceConfig.tunnelName,
      }),
      ...(existy(sauceConfig.tunnelOwner) && {
        tunnelOwner: sauceConfig.tunnelOwner,
      }),
    }),
  }

  return devices.reduce((acc, device) => {
    const { capabilities = [], services = [], ...config } = helperNativeApp({
      envs,
      config: copyBaseConfig,
      buildId,
      device,
      ...omit(params, ['reporters', 'devices']),
      ...sauceSpecificOptional,
    })

    if (Array.isArray(capabilities) && capabilities.length > 0) {
      capabilities[0]['swarmdriver:testMode'] = helperSauceNativeAppTestMode(device)
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
 * Generate a config to test native android applications, locally.
 */
export const setupSauceNativeAndroid = ({
  envs,
  reporters,
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
  return setupSauceNativeApp({
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
 */
export const setupSauceNativeIos = ({
  envs,
  reporters,
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
  return setupSauceNativeApp({
    reporters,
    devices: [
      Device.IOS,
    ],
    envs,
    ...params,
  })
}
