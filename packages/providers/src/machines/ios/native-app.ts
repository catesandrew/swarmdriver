import lodash from 'lodash'
import crypto from 'crypto'

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
} from '../../saucelabs/capabilities'

import type {
  SauceSetupOptions,
  WdioConfig,
} from '../../types'

const {
  omit,
} = lodash

/**
 * Configures and returns capabilities for initializing an iOS mobile test session on Sauce Labs,
 * tailored for running native app tests on real devices or simulators. This function combines
 * capabilities from environment variables, specific iOS device settings, Appium timeout settings,
 * and Sauce Labs specific optional settings into a single capabilities object.
 *
 * @param params - overrides layered on top of the env-derived capabilities;
 *   `params.envs` is the environment to parse Sauce and iOS real-device
 *   capabilities out of.
 * @returns a config carrying the configured `capabilities` for the session.
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
}: SauceSetupOptions = {}): WdioConfig => {
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
