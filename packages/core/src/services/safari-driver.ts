// WDIO v9 removed the need for `wdio-safaridriver-service`: safaridriver ships
// with macOS and is started automatically (see
// https://webdriver.io/docs/driverbinaries). What used to be service options is
// now the `wdio:safaridriverOptions` capability.
import {
  existy,
  parseBool,
  parseWhole,
} from '../utils'

import type { Capability, Envs } from '../types'

export const parseSafariDriverServiceSettings = (envs: Envs = {}) => {
  return {
    ...(parseWhole(envs, 'SAFARI_DRIVER_PORT', 0) &&
      {
        port: parseWhole(envs, 'SAFARI_DRIVER_PORT', 0),
      }),
    ...(existy(parseBool(envs, 'SAFARI_DRIVER_DIAGNOSE', false)) && {
      diagnose: parseBool(envs, 'SAFARI_DRIVER_DIAGNOSE', false),
    }),
    ...(existy(parseBool(envs, 'SAFARI_DRIVER_ENABLE', false)) && {
      enable: parseBool(envs, 'SAFARI_DRIVER_ENABLE', false),
    }),
  }
}

/** The safaridriver settings this module knows how to read from the env. */
export type SafariDriverSettings = ReturnType<typeof parseSafariDriverServiceSettings>

/**
 * Build the `wdio:safaridriverOptions` capability fragment.
 *
 * @param opts - parsed safaridriver settings
 * @returns object to spread into a safari capability
 */
export const buildSafariDriverSettings = ({
  ...opts
}: Partial<SafariDriverSettings> = {}): Capability => {
  const options = {
    // The port on which the driver should run on. `0` lets WebdriverIO pick.
    ...(opts.port && {
      port: opts.port,
    }),
    // Applies configuration changes so that subsequent WebDriver sessions will
    // run without further authentication.
    ...(opts.enable && {
      enable: opts.enable,
    }),
    // Causes safaridriver to log diagnostic information for all sessions.
    ...(opts.diagnose && {
      diagnose: opts.diagnose,
    }),
  }

  return Object.keys(options).length > 0 ?
    { 'wdio:safaridriverOptions': options } :
    {}
}

export const setupSafariDriverConfig = ({
  envs,
  ...opts
}: Partial<SafariDriverSettings> & { envs?: Envs } = {}): Capability => {
  const values = parseSafariDriverServiceSettings(envs)

  return buildSafariDriverSettings({
    ...values,
    ...opts,
  })
}
