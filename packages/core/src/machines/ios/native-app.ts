import lodash from 'lodash'

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

import type { MachineSetupOptions, WdioConfig } from '../../types'

const {
  omitBy,
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
 */
export const iosSetupLocalNativeApp = ({
  envs,
  appiumConfig: {
    address = '127.0.0.1',
    basePath,
    ...appiumConfig
  } = {},
  ...params
}: MachineSetupOptions = {}): WdioConfig => {
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
