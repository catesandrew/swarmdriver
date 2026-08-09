import lodash from 'lodash'
import crypto from 'crypto'

import {
  buildGeneralStrategy,
  buildAppSettings,
  buildActivitiesStartup,
  buildResetStrategy,
  buildDriverSettings,
  buildUIAutomatorDriverSettings,
  buildLocalization,
  buildAdb,
  buildEmulatorAndroidVirtualDevice,
  buildAppSigning,
  buildDeviceLocking,
  buildMJpeg,
  buildWebContext,
  buildOther,
} from './appium'

import {
  parseAppiumSettings,
  parseAndroidAppiumSettings,
} from '../../services/appium'

import {
  buildMobileAppiumCapabilities,
  buildMobileAppiumTimeoutCapabilities,
  buildMobileAppAppiumCapabilitiesSauceSpecificOptional,
  buildDesktopMobileCapabilitiesSauceSpecificOptional,
  buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional,
  parseSauceCapabilities,
  parseSauceAndroidRealDeviceCapabilities,
  buildSauceAndroidRealDeviceCapabilities,
} from '../../providers/saucelabs/capabilities'

const {
  omitBy,
  omit,
  isNil,
} = lodash

/**
 * Generate an android config used to test native apps on device
 *
 * @param {object} baseConfig - base config to add capabilities to
 * @param {object} envs - env variables
 * @param {object} opts - optional opts
 * @returns {{}} Returns a config
 */
export const androidSetupLocalNativeApp = ({
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
    ...parseAndroidAppiumSettings(envs),
    ...params,
  }

  const activities = buildActivitiesStartup(values)
  const resetStrategy = buildResetStrategy(values)
  const generalStrategy = buildGeneralStrategy(values)
  const appSettings = buildAppSettings(values)
  const driverSettings = buildDriverSettings(values)
  const uiautomatorSettings = buildUIAutomatorDriverSettings(values)
  const localization = buildLocalization(values)
  const adb = buildAdb(values)
  const emulatorAndroidVirtualDevice = buildEmulatorAndroidVirtualDevice(values)
  const appSigning = buildAppSigning(values)
  const deviceLocking = buildDeviceLocking(values)
  const mjpeg = buildMJpeg(values)
  const webContext = buildWebContext(values)
  const other = buildOther(values)

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
        ...activities,
        ...resetStrategy,
        ...generalStrategy,
        ...appSettings,
        ...driverSettings,
        ...uiautomatorSettings,
        ...localization,
        ...adb,
        ...emulatorAndroidVirtualDevice,
        ...appSigning,
        ...deviceLocking,
        ...mjpeg,
        ...webContext,
        ...other,
      }, isNil),
    ],
  }
}

/**
 * Generate an android config used to test native apps on saucelabs
 *
 * @param {object} baseConfig - base config to add capabilities to
 * @param {object} envs - env variables
 * @param {object} opts - optional opts
 * @returns {{}} Returns a config
 */
export const androidSetupSauceNativeApp = ({
  envs,
  ...params
} = {}) => {
  const values = {
    ...parseSauceCapabilities(envs),
    ...parseSauceAndroidRealDeviceCapabilities(envs),
    ...params,
  }

  const wdSettings = {
    ...buildMobileAppiumCapabilities(values),
    ...buildSauceAndroidRealDeviceCapabilities(values),
    ...buildMobileAppiumTimeoutCapabilities(values),
  }

  const sauceApp = omit(buildMobileAppAppiumCapabilitiesSauceSpecificOptional({
    cacheId: Array.from(crypto.randomBytes(10), (byte) =>
      (`0${ byte.toString(16) }`).slice(-2)).join(''),
    ...values,
  }), [
    'deviceOrientation',
    'customLogFiles',
    'groupFolderRedirectEnabled',
    'systemAlertsDelayEnabled',
  ])

  const sauceMobile = omit(buildDesktopMobileCapabilitiesSauceSpecificOptional({
    build: params.build || `Android build-${ (Date.now() / 1000).toFixed() }`,
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
