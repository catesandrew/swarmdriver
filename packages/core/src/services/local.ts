import {
  Reporter,
} from '../enums'

import {
  browserUtils,
  browserOverwrites,
  nativeUtils,
  nativeGestures,
  nativeAlert,
  nativePicker,
  nativeWebView,
} from '../helpers'

import {
  setupBaseConfig,
} from './base'

import {
  addCommands,
} from './utils'

import {
  setupJunitConfig,
  setupSpecConfig,
  setupReportPortalConfig,
} from '@caps/reporters'

import type { Envs, WdioConfig } from '../types'
import type { BuildBaseSettingsOptions } from './base'

/**
 * Options every local reducer in this module accepts.
 *
 * `reporters` is a list of {@link Reporter} enum *values* (not names) — it is
 * the already-parsed output of `parseEnvSettings()`, which is why it is
 * `number[]` and not `string[]`.
 */
export interface LocalSetupOptions extends BuildBaseSettingsOptions {
  envs?: Envs
  reporters?: number[]
  [key: string]: any
}

const init = ({
  envs,
  ...params
}: LocalSetupOptions = {}): WdioConfig => {
  const baseConfig = setupBaseConfig({
    envs,
    ...params
  })

  // process local settings here vs saucelabs
  return {
    ...baseConfig,
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g.
    // locally or on a remote machine).
    runner: 'local',
  }
}

//  ___                   _
// | _ \___ _ __  ___ _ _| |_ ___ _ _ ___
// |   / -_) '_ \/ _ \ '_|  _/ -_) '_(_-<
// |_|_\___| .__/\___/_|  \__\___|_| /__/
//         |_|
// Reporters
interface HelperReporterOptions extends LocalSetupOptions {
  /** a side-effect-free copy of the base config, for reporters that need it */
  config?: WdioConfig
  /** a single {@link Reporter} enum value */
  reporter?: number
  junitReporterOutputFileFormat?: (options: any) => string
  specRepporterShowPreface?: boolean
}

const helperReporter = ({
  envs,
  config: copyBaseConfig,
  reporter,
  junitReporterOutputFileFormat,
  specRepporterShowPreface = true,
  ...params
}: HelperReporterOptions = {}): WdioConfig | undefined => {
  if (reporter === Reporter.SPEC) {
    return setupSpecConfig({
      envs,
      sauceLabsSharableLinks: false,
      showPreface: specRepporterShowPreface,
      ...params,
    })
  }

  if (reporter === Reporter.JUNIT) {
    return setupJunitConfig({
      envs,
      outputFileFormat: junitReporterOutputFileFormat,
      ...params,
    })
  }

  if (reporter === Reporter.REPORTPORTAL) {
    return setupReportPortalConfig({
      envs,
      ...params,
    })
  }

  if (reporter === Reporter.SAUCECOMMENT) {
    // do nothing
  }
}

//   _  _      _   _             _
//  | \| |__ _| |_(_)_ _____    /_\  _ __ _ __
//  | .` / _` |  _| \ V / -_)  / _ \| '_ \ '_ \
//  |_|\_\__,_|\__|_|\_/\___| /_/ \_\ .__/ .__/
//                                  |_|  |_|
// Native Application
export const setupLocalNative = ({
  envs,
  reporters = [],
  ...params
}: LocalSetupOptions = {}): WdioConfig => {
  const baseConfig = init({
    envs,
    ...params,
  })

  // Not a deep clone but point is `baseConfig` is a side-effect free object
  const copyBaseConfig = Object.assign({}, baseConfig)

  return reporters.reduce((acc, reporter) => {
    const { reporters = [], services = [], ...config } = helperReporter({
      envs,
      config: copyBaseConfig,
      reporter,
      ...params,
    })

    return {
      ...acc,
      ...config,
      reporters: [
        ...acc.reporters || [],
        ...reporters,
      ],
      services: [
        ...acc.services || [],
        ...services,
      ],
    }
  }, {
    ...baseConfig,
    services: [
      ...baseConfig.services,
    ],
    before: function before(capabilities, specs, driver) {
      this._driver = driver
      this._capabilities = capabilities

      // Custom property that is used to determine if the app is already
      // launched for the first time This property is needed because the first
      // time the app is automatically started, so a double restart is not
      // needed.
      driver.firstAppStart = true

      addCommands({
        libs: [
          nativeUtils,
          nativeGestures,
          nativeAlert,
          nativePicker,
          nativeWebView,
        ],
        device: driver,
        native: true,
      })
    },
  })
}

//  ___
// | _ )_ _ _____ __ _____ ___ _ _ ___
// | _ \ '_/ _ \ V  V (_-</ -_) '_(_-<
// |___/_| \___/\_/\_//__/\___|_| /__/
//
// Browsers
export const setupLocalBrowser = ({
  envs,
  reporters = [],
  ...params
}: LocalSetupOptions = {}): WdioConfig => {
  const baseConfig = init({
    envs,
    ...params,
  })

  // Not a deep clone but point is `baseConfig` is a side-effect free object
  const copyBaseConfig = Object.assign({}, baseConfig)

  return reporters.reduce((acc, reporter) => {
    const { reporters = [], services = [], ...config } = helperReporter({
      envs,
      config: copyBaseConfig,
      reporter,
      ...params,
    })

    return {
      ...acc,
      ...config,
      reporters: [
        ...acc.reporters || [],
        ...reporters,
      ],
      services: [
        ...acc.services || [],
        ...services,
      ],
    }
  }, {
    ...baseConfig,
    services: [
      'shared-store',
      ...baseConfig.services || [],
    ],
    before: function before(capabilities, specs, browser) {
      this._browser = browser
      this._capabilities = capabilities

      addCommands({
        libs: [browserUtils],
        device: browser,
      })

      addCommands({
        libs: [browserOverwrites],
        device: browser,
        overwrite: true,
      })
    },
  })
}
