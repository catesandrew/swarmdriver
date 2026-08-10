import lodash from 'lodash'
import crypto from 'crypto'

import {
  buildMobileAppiumCapabilities,
  buildMobileAppiumTimeoutCapabilities,
  buildMobileAppAppiumCapabilitiesSauceSpecificOptional,
  buildDesktopMobileCapabilitiesSauceSpecificOptional,
  buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional,
  parseSauceCapabilities,
  parseSauceAndroidRealDeviceCapabilities,
  buildSauceAndroidRealDeviceCapabilities,
} from '../../saucelabs/capabilities'

import type {
  SauceSetupOptions,
  WdioConfig,
} from '../../types'

const {
  omit,
} = lodash

/**
 * Generate an android config used to test native apps on saucelabs.
 *
 * @param params - overrides layered on top of the env-derived capabilities;
 *   `params.envs` is the environment to parse Sauce and Android real-device
 *   capabilities out of.
 * @returns a config carrying the configured `capabilities` for the session.
 */
export const androidSetupSauceNativeApp = ({
  envs,
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
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
