// WDIO v9 removed the need for `wdio-geckodriver-service`: driver binaries are
// downloaded and started automatically (see
// https://webdriver.io/docs/driverbinaries). What used to be service options is
// now the `wdio:geckodriverOptions` capability.
import path from 'node:path'

import {
  existy,
  parseWhole,
} from '../utils'

export const parseGeckoDriverServiceSettings = (envs = {}) => {
  return {
    ...(envs.GECKO_DRIVER_HOSTNAME && {
      host: envs.GECKO_DRIVER_HOSTNAME,
    }),
    ...(parseWhole(envs, 'GECKO_DRIVER_PORT', 0) && {
      port: parseWhole(envs, 'GECKO_DRIVER_PORT', 0),
    }),
    ...(envs.GECKO_DRIVER_BINARY && {
      binary: envs.GECKO_DRIVER_BINARY,
    }),
    ...(envs.GECKO_DRIVER_PROFILE_ROOT && {
      profileRoot: envs.GECKO_DRIVER_PROFILE_ROOT,
    }),
    ...(envs.GECKO_DRIVER_OUTPUT_DIR && {
      outputDir: envs.GECKO_DRIVER_OUTPUT_DIR,
    }),
    ...(envs.GECKO_DRIVER_LOG_FILE_NAME && {
      logFileName: envs.GECKO_DRIVER_LOG_FILE_NAME,
    }),
    ...(envs.GECKO_DRIVER_LOG_LEVEL && {
      log: envs.GECKO_DRIVER_LOG_LEVEL,
    }),
  }
}

/**
 * Build the `wdio:geckodriverOptions` capability fragment.
 *
 * @param {object} [opts] - parsed geckodriver settings.
 * @returns {object} Object to spread into a firefox capability.
 */
export const buildGeckoDriverSettings = ({
  ...opts
} = {}) => {
  const logPath = opts.outputDir && opts.logFileName ?
    path.join(opts.outputDir, opts.logFileName) :
    opts.outputDir

  const options = {
    // Custom geckodriver binary; omit to let WebdriverIO manage it.
    ...(existy(opts.binary) && {
      binary: opts.binary,
    }),
    // The host the driver should bind to.
    ...(existy(opts.host) && {
      host: opts.host,
    }),
    // The port on which the driver should run on. `0` lets WebdriverIO pick.
    ...(opts.port && {
      port: opts.port,
    }),
    // Directory that temporary firefox profiles are created under.
    ...(existy(opts.profileRoot) && {
      profileRoot: opts.profileRoot,
    }),
    // Set driver log level: fatal, error, warn, info, config, debug, trace
    ...(existy(opts.log) && {
      log: opts.log,
    }),
    ...(existy(logPath) && {
      outputDir: logPath,
    }),
  }

  return Object.keys(options).length > 0 ?
    { 'wdio:geckodriverOptions': options } :
    {}
}

export const setupGeckoDriverConfig = ({
  envs,
  ...opts
} = {}) => {
  const values = parseGeckoDriverServiceSettings(envs)

  return buildGeckoDriverSettings({
    ...values,
    ...opts,
  })
}
