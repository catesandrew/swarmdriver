// WDIO v9 removed the need for `wdio-geckodriver-service`: driver binaries are
// downloaded and started automatically (see
// https://webdriver.io/docs/driverbinaries). What used to be service options is
// now the `wdio:geckodriverOptions` capability.
import path from 'node:path'

import {
  existy,
  parseWhole,
} from '../utils'

import type { Capability, Envs } from '../types'

export const parseGeckoDriverServiceSettings = (envs: Envs = {}) => {
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

/** The geckodriver settings this module knows how to read from the env. */
export type GeckoDriverSettings = ReturnType<typeof parseGeckoDriverServiceSettings>

/**
 * Build the `wdio:geckodriverOptions` capability fragment.
 *
 * @param opts - parsed geckodriver settings
 * @returns object to spread into a firefox capability
 */
export const buildGeckoDriverSettings = ({
  ...opts
}: Partial<GeckoDriverSettings> = {}): Capability => {
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
}: Partial<GeckoDriverSettings> & { envs?: Envs } = {}): Capability => {
  const values = parseGeckoDriverServiceSettings(envs)

  return buildGeckoDriverSettings({
    ...values,
    ...opts,
  })
}
