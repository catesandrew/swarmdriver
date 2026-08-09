// WDIO v9 removed the need for `wdio-chromedriver-service`: driver binaries are
// downloaded and started automatically (see
// https://webdriver.io/docs/driverbinaries). What used to be service options is
// now the `wdio:chromedriverOptions` capability.
import path from 'node:path'

import {
  existy,
  parseWhole,
  parseString,
} from '../utils'

export const parseChromeDriverServiceSettings = (envs = {}) => {
  return {
    ...(parseString(envs, 'CHROME_DRIVER_PATH', '/') &&
      {
        urlBase: String(envs.CHROME_DRIVER_PATH),
      }),
    ...(parseWhole(envs, 'CHROME_DRIVER_PORT', 0) &&
      {
        port: parseWhole(envs, 'CHROME_DRIVER_PORT', 0),
      }),
    ...(envs.CHROME_DRIVER_BINARY && {
      binary: envs.CHROME_DRIVER_BINARY,
    }),
    ...(envs.CHROME_DRIVER_OUTPUT_DIR && {
      outputDir: envs.CHROME_DRIVER_OUTPUT_DIR,
    }),
    ...(envs.CHROME_DRIVER_LOG_FILE_NAME && {
      logFileName: envs.CHROME_DRIVER_LOG_FILE_NAME,
    }),
    ...(envs.CHROME_DRIVER_LOG_LEVEL && {
      logLevel: envs.CHROME_DRIVER_LOG_LEVEL,
    }),
    ...(envs.CHROME_DRIVER_ALLOWED_IPS && {
      allowedIps: envs.CHROME_DRIVER_ALLOWED_IPS.split(':'),
    }),
  }
}

/**
 * Build the `wdio:chromedriverOptions` capability fragment.
 *
 * @param {object} [opts] - parsed chromedriver settings.
 * @returns {object} Object to spread into a chrome capability.
 */
export const buildChromeDriverSettings = ({
  ...opts
} = {}) => {
  const logPath = opts.outputDir && opts.logFileName ?
    path.join(opts.outputDir, opts.logFileName) :
    opts.outputDir

  const options = {
    // Custom chromedriver binary; omit to let WebdriverIO manage it.
    ...(existy(opts.binary) && {
      binary: opts.binary,
    }),
    // The port on which the driver should run on. `0` lets WebdriverIO pick.
    ...(opts.port && {
      port: opts.port,
    }),
    // Base URL path prefix for commands, e.g. `wd/url`.
    ...(existy(opts.urlBase) && opts.urlBase !== '/' && {
      urlBase: opts.urlBase,
    }),
    // Write server log to file instead of stderr.
    ...(existy(logPath) && {
      logPath,
    }),
    // Set driver log level: ALL, DEBUG, INFO, WARNING, SEVERE, OFF
    ...(existy(opts.logLevel) && {
      logLevel: opts.logLevel,
    }),
    // Allowlist of remote IP addresses allowed to connect to chromedriver.
    ...(existy(opts.allowedIps) && {
      allowedIps: opts.allowedIps,
    }),
  }

  return Object.keys(options).length > 0 ?
    { 'wdio:chromedriverOptions': options } :
    {}
}

export const setupChromeDriverConfig = ({
  envs,
  ...opts
} = {}) => {
  const values = parseChromeDriverServiceSettings(envs)

  return buildChromeDriverSettings({
    ...values,
    ...opts,
  })
}
