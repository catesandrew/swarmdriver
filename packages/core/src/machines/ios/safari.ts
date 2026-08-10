import lodash from 'lodash'

import {
  buildGeneral,
} from './appium'

import {
  parseAppiumSettings,
  parseIosAppiumSettings,
} from '../../services/appium'

import type { MachineSetupOptions, WdioConfig } from '../../types'

const {
  omitBy,
  isNil,
} = lodash

/**
 * Generate an ios config used to test web applications in safari on device
 */
export const iosSetupLocalBrowser = ({
  envs,
  appiumConfig: {
    address = '127.0.0.1',
    basePath,
    protocol,
    port,
  } = {},
  ...params
}: MachineSetupOptions = {}): WdioConfig => {
  const values = {
    ...parseAppiumSettings(envs),
    ...parseIosAppiumSettings(envs),
    ...params,
  }

  const localCapability = buildGeneral({
    ...values,
    ...params,
  })

  return {
    // WDIO v9 capabilities are strict W3C: connection details are config-level
    // keys, not capability keys. These merge into the generated config by the
    // reducer in `services/local-device-browser.js`.
    ...omitBy({
      hostname: address,
      path: basePath,
      protocol,
      port,
    }, isNil),
    capabilities: [
      omitBy({
        ...localCapability,
      }, isNil),
    ],
  }
}

export const iosSetupSauceBrowser = ({
  envs,
  sauceOptions,
  // Not a capability — plumbed through by `services/remote-device-browser.js`
  // and would otherwise land in the capability object and fail W3C validation.
  framework,
  ...params
}: MachineSetupOptions = {}): WdioConfig => {
  return {
    capabilities: [
      omitBy({
        ...params,
        'sauce:options': {
          ...sauceOptions,
        }
      }, isNil),
    ],
  }
}
