// import reportportal from 'wdio-reportportal-reporter'
// import RpService from 'wdio-reportportal-service'
// import path from 'path'
// import fs from 'fs'

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
  parseBaseSettings,
  buildBaseSettings,
} from './base'

import {
  addCommands,
} from './utils'

import {
  info as infoJob,
  edit as editJob,
} from '../sauce-cli/jobs'

import {
  setupJunitConfig,
  setupSpecConfig,
  setupReportPortalConfig,
  setupSauceCommentConfig,
} from '../reporters'

const init = ({
  envs,
  ...params
} = {}) => {
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
const helperReporter = ({
  envs,
  config: copyBaseConfig,
  reporter,
  junitReporterOutputFileFormat,
  specRepporterShowPreface = true,
  ...params
} = {}) => {
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
} = {}) => {
  const baseConfig = init({
    envs,
    hostname: 'ondemand.us-west-1.saucelabs.com',
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

      driver.addCommand('updateJob', function updateJob(opts = {}) {
        // for real devices
        const url = new URL(driver.capabilities?.testobject_test_report_url || '')
        const splits = url.pathname?.split('/')
        if (splits && splits.length > 2) {
          const jobId = splits[2]

          return editJob(jobId, {
            sauceUsername: envs.SAUCE_USERNAME,
            sauceAccessKey: envs.SAUCE_ACCESS_KEY,
            sauceRegion: envs.SAUCE_REGION || 'us-west-1',
            isRealDevice: true,
            ...opts,
          })
        }
      })

      driver.addCommand('getJob', function getJob(opts = {}) {
        // for real devices
        const url = new URL(driver.capabilities?.testobject_test_report_url || '')
        const splits = url.pathname?.split('/')
        if (splits && splits.length > 2) {
          const jobId = splits[2]

          return infoJob(jobId, {
            sauceUsername: envs.SAUCE_USERNAME,
            sauceAccessKey: envs.SAUCE_ACCESS_KEY,
            sauceRegion: envs.SAUCE_REGION || 'us-west-1',
            isRealDevice: true,
            ...opts,
          })
        }
      })
    },
    beforeTest: function beforeTest(test, context) {
      const fullTitle = (test.fullName || `${ test.parent } ${ test.title }`)
      const prefix = this._driver.isAndroid ? 'Android' : 'iOS'

      console.log(`${ prefix }:${ fullTitle }`)
      this._driver.execute(`sauce:job-name=${ fullTitle }`)
    },
    afterTest: function afterTest(test, context, { error, result, duration, passed, retries }) {
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
} = {}) => {
  const baseConfig = init({
    envs,
    hostname: 'ondemand.us-west-1.saucelabs.com',
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

      browser.addCommand('updateJob', function updateJob(opts = {}) {
        return editJob(this.sessionId, {
          sauceUsername: envs.SAUCE_USERNAME,
          sauceAccessKey: envs.SAUCE_ACCESS_KEY,
          sauceRegion: envs.SAUCE_REGION || 'us-west-1',
          isRealDevice: false,
          ...opts,
        })
      })

      driver.addCommand('getJob', function getJob(opts = {}) {
        return infoJob(this.sessionId, {
          sauceUsername: envs.SAUCE_USERNAME,
          sauceAccessKey: envs.SAUCE_ACCESS_KEY,
          sauceRegion: envs.SAUCE_REGION || 'us-west-1',
          isRealDevice: false,
          ...opts,
        })
      })
    },
    afterTest: async function afterTest(test, context, { error, result, duration, passed, retries }) {
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
