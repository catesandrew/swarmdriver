import lodash from 'lodash'

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

import type { MachineSetupOptions, WdioConfig } from '../../types'

const {
  omitBy,
  isNil,
} = lodash

/**
 * Generate an android config used to test native apps on device
 */
export const androidSetupLocalNativeApp = ({
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
