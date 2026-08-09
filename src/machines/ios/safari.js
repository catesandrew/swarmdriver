import lodash from 'lodash'

import {
  buildGeneral,
} from './appium'

import {
  parseAppiumSettings,
  parseIosAppiumSettings,
} from '../../services/appium'

const {
  omitBy,
  isNil,
} = lodash

/**
 * Generate an ios config used to test web applications in safari on device
 * @param {object} baseConfig -
 * @param {*} params -
 * @returns {{}} Returns a config
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
} = {}) => {
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
} = {}) => {
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
