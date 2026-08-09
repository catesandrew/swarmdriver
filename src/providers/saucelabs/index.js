import {
  setupSauceDesktopBrowsers,
  setupSauceDeviceBrowsers,
  setupSauceNativeApp,
} from '../../services'

/**
 * Sauce Labs provider — the reference implementation of the {@link Provider}
 * contract.
 *
 * The capability-building blocks it is composed from live next door in
 * `./capabilities`; the three `setup*` functions are the existing
 * `src/services/remote-*.js` reducers, which already return Sauce's connection
 * details (`hostname`, `port`) at the top level of the config, as WebdriverIO
 * v9 requires.
 *
 * @type {import('../provider').Provider}
 */
export const saucelabsProvider = {
  name: 'saucelabs',

  /**
   * Sauce-specific environment defaults.
   *
   * `saucecomment` is a Sauce-only reporter (it writes test results back onto
   * the Sauce job), which is why these defaults belong to the provider rather
   * than to `buildWdioConfig()`.
   *
   * @param {Object} envs - environment, mutated in place
   * @param {import('../provider').ProviderEnvContext} [context] - scope/metal
   * @returns {void}
   */
  applyEnvDefaults(envs = {}, { scope, metal } = {}) {
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
