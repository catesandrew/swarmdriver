import lodash from 'lodash'

import {
  buildGeneralStrategy,
  buildAppSettings,
} from './appium'

import {
  parseAppiumSettings,
  parseAndroidAppiumSettings,
} from '../../services/appium'

const {
  omitBy,
  isNil,
} = lodash

/**
 * Generate an android config used to test web applications in chrome on device
 * @param {object} baseConfig -
 * @param {*} params -
 * @returns {{}} Returns a config
 */
export const androidSetupLocalBrowser = ({
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
    ...parseAndroidAppiumSettings(envs),
    ...params,
  }

  const appSettings = buildAppSettings(values)
  const generalStrategy = buildGeneralStrategy(values)

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
        ...appSettings,
        ...generalStrategy,
      }, isNil),
    ],
  }
}

export const androidSetupSauceBrowser = ({
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
