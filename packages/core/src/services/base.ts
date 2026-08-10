import yn from 'yn'
import resolve from '../resolve'

import {
  FIVE_MINS,
  TWENTY_FOUR_HOURS,
} from '../constants'

import {
  LogLevel,
  parseLogLevel,
  Reporter,
  parseReporter,
  Device,
  parseDevice,
  Browser,
  parseBrowser,
  // Service,
  // parseService,
} from '../enums'

import {
  existy,
  parseBool,
  parseWhole,
} from '../utils'

import type { Envs, WdioConfig } from '../types'

/**
 * Caller-supplied overrides for {@link parseEnvSettings}.
 *
 * Each list, when non-empty, wins over the corresponding `WDIO_*` variable.
 *
 * The element type is `string | number` rather than `string` because the
 * matching `parse*` helper accepts either — a human-readable name (`'chrome'`,
 * `'ios'`, `'junit'`) or the enum value it maps to. Both really do arrive here:
 * `setupLocalDesktopSafari()` passes `[Browser.SAFARI]` while a `WDIO_BROWSERS`
 * env var passes `['safari']`, and the reducers in `local-*.ts` feed their own
 * already-parsed output straight back in.
 */
export interface EnvSettingsOverrides {
  reporters?: Array<string | number>
  devices?: Array<string | number>
  browsers?: Array<string | number>
  services?: Array<string | number>
  headless?: boolean
}

export const parseEnvSettings = (envs: Envs, {
  reporters,
  devices,
  browsers,
  services,
  headless,
}: EnvSettingsOverrides = {}) => {
  // Names go in, enum *values* come out. In JavaScript both stages shared one
  // binding; under TypeScript they are separate consts, because `string[]` and
  // `number[]` are genuinely different types and conflating them is what let
  // the `headless` filter below compare a name against a numeric enum member
  // without anyone noticing.

  // A colon separated list of reporters, for example "spec:junit" would turn
  // into a list like [ 'spec', 'junit' ].
  const reporterNames = (Array.isArray(reporters) && reporters.length > 0) ?
    reporters :
    existy(envs.WDIO_REPORTERS) ?
      envs.WDIO_REPORTERS.split(':') :
      ['spec']

  const reporterValues = reporterNames.reduce<number[]>((acc, reporter) => {
    const parsed = parseReporter(reporter)
    if (parsed.value !== Reporter.UNKNOWN) {
      acc.push(parsed.value)
    }
    return acc
  }, [])

  // A colon separated list of devices, for example "ios:android" would turn
  // into a list like [ 'ios', 'android' ].
  const deviceNames = (Array.isArray(devices) && devices.length > 0) ?
    devices :
    existy(envs.WDIO_DEVICES) ?
      envs.WDIO_DEVICES.split(':') :
      []

  const deviceValues = deviceNames.reduce<number[]>((acc, device) => {
    const parsed = parseDevice(device)
    if (parsed.value !== Device.UNKNOWN) {
      acc.push(parsed.value)
    }

    return acc
  }, [])

  // A colon separated list of browsers, for example "chrome:safari" would turn
  // into a list like [ 'chrome', 'safari' ].
  const browserNames = (Array.isArray(browsers) && browsers.length > 0) ?
    browsers :
    existy(envs.WDIO_BROWSERS) ?
      envs.WDIO_BROWSERS.split(':') :
      []

  let browserValues = browserNames.reduce<number[]>((acc, browser) => {
    const parsed = parseBrowser(browser)
    if (parsed.value !== Browser.UNKNOWN) {
      acc.push(parsed.value)
    }

    return acc
  }, [])

  // A colon separated list of services, for example "shared-store:intercept:axe-core" would turn
  // into a list like [ 'shared-store', 'intercept', 'axe-core' ].
  // const serviceNames = (Array.isArray(services) && services.length > 0) ?
  //   services :
  //   existy(envs.WDIO_SERVICES) ?
  //     envs.WDIO_SERVICES.split(':') :
  //     []

  // const serviceValues = serviceNames.reduce<number[]>((acc, service) => {
  //   const parsed = parseService(service)
  //   if (parsed.value !== Service.UNKNOWN) {
  //     acc.push(parsed.value)
  //   }

  //   return acc
  // }, [])

  // headless only can work in chrome and firefox
  if (headless) {
    browserValues = browserValues.filter((browser) => {
      return browser === Browser.FIREFOX ||
        browser === Browser.CHROME
    })
  }

  return {
    ...(reporterValues.length > 0 &&
      {
        reporters: reporterValues,
      }),
    ...(deviceValues.length > 0 &&
      {
        devices: deviceValues,
      }),
    ...(browserValues.length > 0 &&
      {
        browsers: browserValues,
      }),
    // ...((serviceValues.length > 0) &&
    //   {
    //     services: serviceValues,
    //   }),
  }
}

export const parseBaseSettings = (envs: Envs = {}) => {
  return {
    ...((existy(parseWhole(envs, 'WDIO_MAX_INSTANCES', 100)) || existy(envs.DEBUG)) && {
      maxInstances: envs.DEBUG ?
        1 :
        parseWhole(envs, 'WDIO_MAX_INSTANCES', 100)
    }),
    ...(existy(envs.WDIO_LOG_LEVEL) ?
      {
        logLevel: parseLogLevel(envs.WDIO_LOG_LEVEL, LogLevel.SILENT).code,
      } :
      {
        logLevel: LogLevel.props[LogLevel.SILENT].code,
      }),
    ...(envs.WDIO_HOSTNAME ?
      {
        hostname: envs.WDIO_HOSTNAME,
      } :
      {
        hostname: '127.0.0.1',
      }),
    ...(existy(parseWhole(envs, 'WDIO_PORT', 4444)) ?
      {
        port: parseWhole(envs, 'WDIO_PORT', 4444),
      } :
      {
        port: 4444,
      }),
    ...(existy(parseWhole(envs, 'WDIO_BAIL', 0)) && {
      bail: parseWhole(envs, 'WDIO_BAIL', 0),
    }),
    ...(existy(parseBool(envs, 'WDIO_MOCHA_BAIL', false)) && {
      mochaBail: parseBool(envs, 'WDIO_MOCHA_BAIL', false)
    }),
    ...(existy(parseWhole(envs, 'WDIO_MOCHA_TIMEOUT', 2000)) && {
      mochaTimeout: parseWhole(envs, 'WDIO_MOCHA_TIMEOUT', 2000),
    }),
    ...(existy(parseWhole(envs, 'WDIO_WAIT_FOR_TIMEOUT', 3000)) && {
      waitforTimeout: parseWhole(envs, 'WDIO_WAIT_FOR_TIMEOUT', 3000),
    }),
    ...(existy(parseWhole(envs, 'WDIO_WAIT_FOR_INTERVAL', 500)) && {
      waitforInterval: parseWhole(envs, 'WDIO_WAIT_FOR_INTERVAL', 500),
    }),
    ...(existy(parseWhole(envs, 'WDIO_CONNECTION_RETRY_COUNT', 3)) && {
      connectionRetryCount: parseWhole(envs, 'WDIO_CONNECTION_RETRY_COUNT', 3),
    }),
    ...(existy(parseWhole(envs, 'WDIO_CONNECTION_RETRY_TIMEOUT', 120000)) && {
      connectionRetryTimeout: parseWhole(envs, 'WDIO_CONNECTION_RETRY_TIMEOUT', 120000),
    }),
    ...(existy(parseWhole(envs, 'WDIO_SPEC_FILE_RETRIES', 0)) && {
      specFileRetries: parseWhole(envs, 'WDIO_SPEC_FILE_RETRIES', 0),
    }),
    ...(existy(envs.WDIO_OUTPUT_DIR) && {
      outputDir: envs.WDIO_OUTPUT_DIR,
    }),
    ...(existy(envs.DEBUG) && {
      debug: yn(process.env.DEBUG),
    }),
    ...(parseWhole(envs, 'WDIO_JASMINE_TIMEOUT', 0) ?
      {
        jasmineTimeout: parseWhole(envs, 'WDIO_JASMINE_TIMEOUT', 0),
      } :
      {
        jasmineTimeout: FIVE_MINS,
      }),
    ...(parseWhole(envs, 'WDIO_MOCHA_TIMEOUT', 0) ?
      {
        mochaTimeout: parseWhole(envs, 'WDIO_MOCHA_TIMEOUT', 0),
      } :
      {
        mochaTimeout: FIVE_MINS,
      }),
  }
}

/** Everything `parseBaseSettings()` can produce from the environment. */
export type BaseSettings = ReturnType<typeof parseBaseSettings>

/** {@link buildBaseSettings} input: parsed base settings plus the framework. */
export interface BuildBaseSettingsOptions extends Partial<BaseSettings> {
  framework?: string
}

export const buildBaseSettings = ({
  framework = 'jasmine',
  ...opts
}: BuildBaseSettingsOptions = {}): WdioConfig => {
  return {
    specs: [],
    reporters: [],
    capabilities: [],
    exclude: [
      'build/**',
    ],
    services: [],
    // It is extremely helpful to limit parallelism by setting maxInstances to
    // 1, and targeting only those specs and browsers that need to be debugged.
    ...(existy(opts.maxInstances) && {
      maxInstances: opts.maxInstances,
    }),
    ...(opts.debug && {
      execArgv: ['--inspect'],
    }),
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    ...(existy(opts.logLevel) && {
      logLevel: opts.logLevel,
    }),
    // Removed for WDIO v9: `sync` (dropped in v6 with the sync mode removal),
    // `coloredLogs`, `screenshotPath` and `deprecationWarnings` are no longer
    // recognised config keys.
    //
    // If you only want to run your tests until a specific amount of tests
    // have failed use bail (default is 0 - don't bail, run all tests).
    //
    // If you want your test run to stop after a specific number of test
    // failures, use bail. (It defaults to 0, which runs all tests no matter
    // what.) Note: Please be aware that when using a third party test runner
    // (such as Mocha), additional configuration might be required. (default: 0)
    ...(existy(opts.bail) && {
      bail: opts.bail,
    }),
    // WebdriverIO provides multiple commands to wait on elements to reach a
    // certain state (e.g. enabled, visible, existing). These commands take a
    // selector argument and a timeout number, which determines how long the
    // instance should wait for that element to reach the state. The
    // `waitforTimeout` option allows you to set the global timeout for all
    // `waitFor*` commands, so you don't need to set the same timeout over and
    // over again. (Note the lowercase `f`!) (default: 3000)
    ...(existy(opts.waitforTimeout) && {
      waitforTimeout: opts.waitforTimeout,
    }),
    // Host of your WebDriver server
    ...(existy(opts.hostname) && {
      hostname: opts.hostname,
    }),
    // Port your WebDriver server is on.
    ...(existy(opts.port) && {
      port: opts.port,
    }),
    // Default interval for all waitFor* commands to check if an expected
    // state (e.g., visibility) has been changed. (default: 500)
    ...(existy(opts.waitforInterval) && {
      waitforInterval: opts.waitforInterval,
    }),
    ...(existy(opts.connectionRetryTimeout) && {
      connectionRetryTimeout: opts.connectionRetryTimeout,
    }),
    ...(existy(opts.connectionRetryCount) && {
      connectionRetryCount: opts.connectionRetryCount,
    }),
    // spec that runs max 4 times (1 actual run + 3 reruns)
    ...(existy(opts.specFileRetries) && {
      specFileRetries: opts.specFileRetries,
    }),
    // Directory to store all testrunner log files (including reporter logs
    // and `wdio` logs). If not set, all logs are streamed to `stdout`. Since
    // most reporters are made to log to `stdout`, it is recommended to only
    // use this option for specific reporters where it makes more sense to
    // push report into a file (like the `junit` reporter, for example).
    ...(existy(opts.outputDir) && {
      outputDir: opts.outputDir,
    }),
    ...(framework === 'jasmine' && {
      framework: 'jasmine',
      jasmineOpts: {
        helpers: [],
        defaultTimeoutInterval: opts.debug ?
          TWENTY_FOUR_HOURS :
          opts.jasmineTimeout
      },
    }),
    ...(framework === 'mocha' && {
      framework: 'mocha',
      mochaOpts: {
        compilers: [],
        require: [
          resolve('mocha-steps'),
        ],
        ui: 'bdd',
        ...(existy(opts.mochaBail) && {
          bail: opts.mochaBail,
        }),
        timeout: opts.debug ?
          TWENTY_FOUR_HOURS :
          opts.mochaTimeout
      },
    }),
  }
}

export const setupBaseConfig = ({
  envs,
  ...opts
}: BuildBaseSettingsOptions & { envs?: Envs } = {}): WdioConfig => {
  const values = parseBaseSettings(envs)
  const settings = buildBaseSettings({
    ...values,
    ...opts,
  })

  return {
    ...settings,
  }
}
