import lodash from 'lodash'
import crypto from 'crypto'

import {
  buildGeneral,
  buildApp,
  buildWebDriverAgent,
  buildSimulator,
  buildWebSettings,
  buildOther,
  buildSettings,
  buildResetStrategy,
} from './appium'

import {
  parseAppiumSettings,
  parseIosAppiumSettings,
} from '../../services/appium'

import {
  buildMobileAppiumCapabilities,
  buildMobileAppiumTimeoutCapabilities,
  buildMobileAppiumIosWebDriverAgentTimeoutCapabilities,
  buildMobileAppAppiumCapabilitiesSauceSpecificOptional,
  buildDesktopMobileCapabilitiesSauceSpecificOptional,
  buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional,
  parseSauceCapabilities,
  parseSauceIosRealDeviceCapabilities,
  buildSauceIosRealDeviceCapabilities,
} from '../../providers/saucelabs/capabilities'

const {
  omitBy,
  omit,
  isNil,
} = lodash

/**
 * Generate an ios config used to test native apps on device.
 *
 * export HM_ACTIVE_ENV=dev
 * export ENVFILE=$PWD/.env.dev
 * react-native run-ios --device --scheme "hmmaDevelopment" --configuration Debug
 * WDIO_REMOTE=local wdio --suite welcome
 *
 * Automate a preinstalled app with following scenario.
 *
 * 1. This will only work for applications that are signed with a *DEVELOPMENT* cert.
 * 2. This will NOT work for applications that are signed with a *DISTRIBUTION* cert
 * 3. If you have created the app with a developer provisioning profile, and
 *    built yourself. Or downloaded it using testFlight, and is signed with a
 *    development provisioning profile
 * 4. This is because Apples Instruments will not allow you to interact with
 *    those applications which is live. (Even if you knew the `bundleId`)
 * If your app is in development mode please follow these things:
 * 1. The `bundleId` of the app that was installed on the device. Use that as
 *    the app capability.
 * 2. Follow the Appium [Real
 *    Devices](https://github.com/appium/appium/blob/master/docs/en/appium-setup/real-devices.md)
 *    guide (substitute any `.ipa`/`.app` reference with the `bundleId`)
 *
 * In addition to your regular `desiredCapabilities` (ex. `platformName`,
 * `platformVersion`, `deviceName`).. these should be your
 * `desiredCapabilities`:
 *
 * For preinstalled apps
 *
 *     desiredCaps['app'] = 'yourbindleID'
 *
 * Device's unique identifier
 *
 *     desiredCaps['udid'] = '1824y983h2849gh2498'
 *
 * @param {object} baseConfig
 * @param {object} envs
 * @param {object} opts
 * @returns {{}} Returns a config
 */
export const iosSetupLocalNativeApp = ({
  envs,
  appiumConfig: {
    address = '127.0.0.1',
    basePath,
    ...appiumConfig
  } = {},
  ...params
} = {}) => {
  const values = {
    ...parseAppiumSettings(envs),
    ...parseIosAppiumSettings(envs),
    ...params,
  }

  const general = buildGeneral(values)
  const app = buildApp(values)
  const wda = buildWebDriverAgent(values)
  const sim = buildSimulator(values)
  const web = buildWebSettings(values)
  const other = buildOther(values)
  const settings = buildSettings(values)
  const resetStrategy = buildResetStrategy(values)

  return {
    // WDIO v9 capabilities are strict W3C: connection details are config-level
    // keys, not capability keys. These merge into the generated config by the
    // reducer in `services/local-native-app.js`.
    ...omitBy({
      hostname: address,
      path: basePath,
    }, isNil),
    capabilities: [
      omitBy({
        ...general,
        ...app,
        ...wda,
        ...sim,
        ...web,
        ...other,
        ...settings,
        ...resetStrategy,
      }, isNil),
    ],
  }
}

/**
 * Configures and returns capabilities for initializing an iOS mobile test session on Sauce Labs,
 * tailored for running native app tests on real devices or simulators. This function combines
 * capabilities from environment variables, specific iOS device settings, Appium timeout settings,
 * and Sauce Labs specific optional settings into a single capabilities object.
 *
 * @param {Object} [params={}] - Additional parameters to override or extend the capabilities derived from environment variables.
 * @param {Object} [params.envs] - Environment variables to parse for Sauce-specific and iOS real device capabilities.
 * @returns {Object} An object containing the configured capabilities for the test session.
 *
 * @example
 * const testCapabilities = iosSetupSauceNativeApp({
 *   envs: process.env,
 *   platformName: 'iOS',
 *   platformVersion: '14.0',
 *   deviceName: 'iPhone 11',
 *   app: 'sauce-storage:myapp.zip'
 * });
 *
 * // Use `testCapabilities` with your Appium client to start a test session on Sauce Labs
 */
export const iosSetupSauceNativeApp = ({
  envs,
  ...params
} = {}) => {
  const values = {
    ...parseSauceCapabilities(envs),
    ...parseSauceIosRealDeviceCapabilities(envs),
    ...params,
  }

  const wdSettings = {
    ...buildMobileAppiumCapabilities(values),
    ...buildSauceIosRealDeviceCapabilities(values),
    ...buildMobileAppiumTimeoutCapabilities(values),
    ...buildMobileAppiumIosWebDriverAgentTimeoutCapabilities(values),
  }

  const sauceApp = omit(buildMobileAppAppiumCapabilitiesSauceSpecificOptional({
    cacheId: Array.from(crypto.randomBytes(10), (byte) =>
      (`0${ byte.toString(16) }`).slice(-2)).join(''),
    ...values,
  }), [
    'deviceOrientation',
    'customLogFiles',
    'sauceLabsImageInjectionEnabled',
    'sauceLabsBypassScreenshotRestriction',
    'enableAnimations',
  ])

  const sauceMobile = omit(buildDesktopMobileCapabilitiesSauceSpecificOptional({
    build: params.build || `iOS build-${ (Date.now() / 1000).toFixed() }`,
    ...values,
  }), [
    'custom-data',
    'public',
  ])

  const sauceVirtual = omit(buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional(values), [
    'maxDuration',
    'priority',
    'timeZone',
  ])

  return {
    capabilities: [
      {
        ...wdSettings,
        'sauce:options': {
          ...sauceApp,
          // ...appiumOverride,
          ...sauceMobile,
          ...sauceVirtual,
        },
      },
    ],
  }
}
