// import reportportal from 'wdio-reportportal-reporter'
// import RpService from 'wdio-reportportal-service'
// import path from 'path'
// import fs from 'fs'

import {
  Reporter,
} from '@caps/core/enums'

import {
  browserUtils,
  browserOverwrites,
  nativeUtils,
  nativeGestures,
  nativeAlert,
  nativePicker,
  nativeWebView,
} from '@caps/core/helpers'

import {
  parseBaseSettings,
  buildBaseSettings,
} from '@caps/core/services/base'

import {
  addCommands,
} from '@caps/core/services/utils'

import {
  getSauceJob,
  updateSauceJob,
  type SauceJobCredentials,
  type SauceJobUpdate,
} from '@caps/core/sauce'

import {
  setupJunitConfig,
  setupSpecConfig,
  setupReportPortalConfig,
  setupSauceCommentConfig,
} from '@caps/reporters'

import type {
  SauceSetupOptions,
  WdioConfig,
} from '../types'

/**
 * Per-call overrides a test may pass to `updateJob()` / `getJob()`.
 *
 * The session already knows the credentials (they come from `envs`), so every
 * field is optional here: a test calls `browser.updateJob({ passed: false })`
 * and the hook fills in the rest.
 */
type UpdateJobOverrides = Partial<SauceJobCredentials> & SauceJobUpdate
type GetJobOverrides = Partial<SauceJobCredentials>

/**
 * A test as the framework reports it to the `beforeTest`/`afterTest` hooks.
 *
 * Jasmine supplies `fullName`; Mocha supplies `parent` + `title`. Both shapes
 * are handled, which is why all three are optional.
 */
interface TestInfo {
  fullName?: string
  parent?: string
  title?: string
  [key: string]: unknown
}

/** The result payload the runner passes as `afterTest`'s third argument. */
interface TestOutcome {
  error?: unknown
  result?: unknown
  duration?: number
  passed?: boolean
  retries?: unknown
}

/**
 * Sauce Labs' three public data center endpoints. `envs.SAUCE_REGION` is also
 * forwarded to `sauce:options.region`/`@wdio/sauce-service`'s own `region`
 * option elsewhere, but neither of those affects which server the WebDriver
 * session itself connects to — that's this `hostname`. Previously hardcoded
 * to `us-west-1` regardless of `SAUCE_REGION`, so setting e.g.
 * `SAUCE_REGION=eu-central-1` silently kept connecting to the US endpoint.
 */
const SAUCE_HOSTNAMES: Record<string, string> = {
  'us-west-1': 'ondemand.us-west-1.saucelabs.com',
  'eu-central-1': 'ondemand.eu-central-1.saucelabs.com',
  'apac-southeast-1': 'ondemand.apac-southeast-1.saucelabs.com',
}

const DEFAULT_SAUCE_REGION = 'us-west-1'

const buildSauceHostname = (envs: SauceSetupOptions['envs'] = {}): string => {
  const region = envs?.SAUCE_REGION || DEFAULT_SAUCE_REGION
  return SAUCE_HOSTNAMES[region] || SAUCE_HOSTNAMES[DEFAULT_SAUCE_REGION]
}

const init = ({
  envs,
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
  const values = parseBaseSettings(envs)
  const baseConfig = buildBaseSettings({
    ...values,
    ...params,
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
/**
 * The slice of a WebdriverIO config a reporter package contributes.
 *
 * Deliberately narrow and index-signature-free: each `@caps/reporters` setup
 * function returns its own concrete config interface, and only these two keys
 * are common to all of them (and they are the only two the caller pulls back
 * off). A wider type with an index signature would reject those interfaces
 * outright, since TypeScript grants implicit index signatures to type aliases
 * but not to interfaces.
 */
interface ReporterSlice {
  reporters?: unknown[]
  services?: unknown[]
}

/**
 * Dispatch to whichever `@caps/reporters` setup matches `reporter`.
 *
 * Returns `undefined` for an unrecognised reporter — long-standing behaviour
 * the caller relies on.
 */
const helperReporter = ({
  envs,
  config: copyBaseConfig,
  reporter,
  junitReporterOutputFileFormat,
  specRepporterShowPreface = true,
  ...params
}: SauceSetupOptions & { reporter?: number } = {}): ReporterSlice => {
  if (reporter === Reporter.SPEC) {
    return setupSpecConfig({
      envs,
      sauceLabsSharableLinks: true,
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
    return setupSauceCommentConfig({
      envs,
      ...params,
    })
  }
}

//   _  _      _   _             _
//  | \| |__ _| |_(_)_ _____    /_\  _ __ _ __
//  | .` / _` |  _| \ V / -_)  / _ \| '_ \ '_ \
//  |_|\_\__,_|\__|_|\_/\___| /_/ \_\ .__/ .__/
//                                  |_|  |_|
// Native Application
export const setupSauceNative = ({
  envs,
  reporters = [],
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
  const baseConfig = init({
    envs,
    hostname: buildSauceHostname(envs),
    port: 443,
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
    before: function before(capabilities: unknown, specs: string[], driver: any) {
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

      driver.addCommand('updateJob', function updateJob(opts: UpdateJobOverrides = {}) {
        // for real devices
        const url = new URL(driver.capabilities?.testobject_test_report_url || '')
        const splits = url.pathname?.split('/')
        if (splits && splits.length > 2) {
          const jobId = splits[2]

          return updateSauceJob(jobId, {
            sauceUsername: envs.SAUCE_USERNAME,
            sauceAccessKey: envs.SAUCE_ACCESS_KEY,
            sauceRegion: envs.SAUCE_REGION || 'us-west-1',
            isRealDevice: true,
            ...opts,
          })
        }
      })

      driver.addCommand('getJob', function getJob(opts: GetJobOverrides = {}) {
        // for real devices
        const url = new URL(driver.capabilities?.testobject_test_report_url || '')
        const splits = url.pathname?.split('/')
        if (splits && splits.length > 2) {
          const jobId = splits[2]

          return getSauceJob(jobId, {
            sauceUsername: envs.SAUCE_USERNAME,
            sauceAccessKey: envs.SAUCE_ACCESS_KEY,
            sauceRegion: envs.SAUCE_REGION || 'us-west-1',
            isRealDevice: true,
            ...opts,
          })
        }
      })
    },
    beforeTest: function beforeTest(test: TestInfo, context: unknown) {
      const fullTitle = (test.fullName || `${ test.parent } ${ test.title }`)
      const prefix = this._driver.isAndroid ? 'Android' : 'iOS'

      console.log(`${ prefix }:${ fullTitle }`)
      this._driver.execute(`sauce:job-name=${ fullTitle }`)
    },
    afterTest: function afterTest(test: TestInfo, context: unknown, { error, result, duration, passed, retries }: TestOutcome) {
      if (passed) {
        this._driver.execute('sauce:job-result=passed')
      } else {
        this._driver.execute('sauce:job-result=failed')

        // TODO: something to do when we can verify upload of screenshot and
        // retrieve appium server logs from saucelabs
        // const fullTitle = (test.fullName || `${ test.parent } - ${ test.title }`)
        // this._driver.captureDebug({
        //   desc: fullTitle,
        // })
      }
    },
  })
}

//  ___
// | _ )_ _ _____ __ _____ ___ _ _ ___
// | _ \ '_/ _ \ V  V (_-</ -_) '_(_-<
// |___/_| \___/\_/\_//__/\___|_| /__/
//
// Browsers
export const setupSauceBrowser = ({
  envs,
  reporters = [],
  ...params
}: SauceSetupOptions = {}): WdioConfig => {
  const baseConfig = init({
    envs,
    hostname: buildSauceHostname(envs),
    port: 443,
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
    before: function before(capabilities: unknown, specs: string[], browser: any) {
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

      browser.addCommand('updateJob', function updateJob(this: any, opts: UpdateJobOverrides = {}) {
        return updateSauceJob(this.sessionId, {
          sauceUsername: envs.SAUCE_USERNAME,
          sauceAccessKey: envs.SAUCE_ACCESS_KEY,
          sauceRegion: envs.SAUCE_REGION || 'us-west-1',
          isRealDevice: false,
          ...opts,
        })
      })

      // `browser`, not `driver`. This is the browser setup and `driver` is not
      // a binding in this scope — it silently resolved to the wdio testrunner's
      // ambient global, so `getJob` was registered on whatever that happened to
      // be rather than on the session this hook was handed. Every sibling
      // command here uses the hook's own `browser` argument; this one didn't.
      browser.addCommand('getJob', function getJob(this: any, opts: GetJobOverrides = {}) {
        return getSauceJob(this.sessionId, {
          sauceUsername: envs.SAUCE_USERNAME,
          sauceAccessKey: envs.SAUCE_ACCESS_KEY,
          sauceRegion: envs.SAUCE_REGION || 'us-west-1',
          isRealDevice: false,
          ...opts,
        })
      })
    },
    afterTest: async function afterTest(test: TestInfo, context: unknown, { error, result, duration, passed, retries }: TestOutcome) {
      if (passed) {
        await this._browser.execute('sauce:job-result=passed')
      } else {
        await this._browser.execute('sauce:job-result=failed')
      }
    },
    // afterTest: async function afterTest(test, context, { error, result, duration, passed, retries }) {
    //   if (passed) {
    //     await this._browser.execute('sauce:job-result=passed')

    //     const filename = 'screnshot.png'
    //     const outputFile = path.join(process.cwd(), filename)
    //     await this._browser.saveScreenshot(outputFile)
    //     Object.assign(test, { title: test.description })
    //     await reportportal.sendFileToTest(test, 'info', filename, fs.readFileSync(outputFile), 'image/png')
    //     await reportportal.sendFile('info', filename, fs.readFileSync(outputFile), 'image/png')
    //   } else {
    //     this._browser.execute('sauce:job-result=failed')
    //   }
    // },
  })
}
