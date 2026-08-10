import {
  registerProvider,
} from '@caps/core/providers'

import type {
  Provider,
  ProviderEnvContext,
} from '@caps/core/providers'

import {
  setupSauceDesktopBrowsers,
  setupSauceDeviceBrowsers,
  setupSauceNativeApp,
} from '../services'

import type {
  Envs,
} from '../types'

export * from './capabilities'

/**
 * Sauce Labs provider — the reference implementation of the {@link Provider}
 * contract.
 *
 * The capability-building blocks it is composed from live next door in
 * `./capabilities`; the three `setup*` functions are the former
 * `src/services/remote-*.js` reducers (now `../services/`), which already
 * return Sauce's connection details (`hostname`, `port`) at the top level of
 * the config, as WebdriverIO v9 requires.
 */
export const saucelabsProvider: Provider = {
  name: 'saucelabs',

  /**
   * Sauce-specific environment defaults.
   *
   * `saucecomment` is a Sauce-only reporter (it writes test results back onto
   * the Sauce job), which is why these defaults belong to the provider rather
   * than to `buildWdioConfig()`.
   *
   * @param envs - environment, mutated in place
   * @param context - scope/metal
   */
  applyEnvDefaults(envs: Envs = {}, { scope, metal }: Partial<ProviderEnvContext> = {}): void {
    envs.WDIO_REPORTERS || (envs.WDIO_REPORTERS = 'spec:junit:saucecomment')
    envs.SAUCECOMMENT_REPORTER_OUTPUT_DIR || (envs.SAUCECOMMENT_REPORTER_OUTPUT_DIR = 'build')
    envs.SAUCECOMMENT_REPORTER_SAVE_OUTPUT_TO_FILE || (envs.SAUCECOMMENT_REPORTER_SAVE_OUTPUT_TO_FILE = 'true')

    if (scope === 'browser') {
      if (metal === 'device') {
        envs.WDIO_DEVICES || (envs.WDIO_DEVICES = 'android:ios')
      }

      if (metal === 'desktop') {
        envs.WDIO_BROWSERS || (envs.WDIO_BROWSERS = 'chrome:safari:firefox')
      }
    }

    if (scope === 'app') {
      envs.WDIO_DEVICES || (envs.WDIO_DEVICES = 'android:ios')
      envs.WDIO_METAL || (envs.WDIO_METAL = 'device')
    }
  },

  setupDesktopBrowsers: setupSauceDesktopBrowsers,
  setupDeviceBrowsers: setupSauceDeviceBrowsers,
  setupNativeApp: setupSauceNativeApp,
}

// Side-effect registration. Importing this module (or the package root) is what
// makes `remote: 'saucelabs'` resolvable from `@caps/core`'s `buildWdioConfig()`.
registerProvider(saucelabsProvider.name, saucelabsProvider)
