/**
 * The cloud-provider contract.
 *
 * A provider owns everything that is specific to one remote grid vendor: the
 * environment-variable defaults it wants applied, and the three entry points
 * that turn an environment into a WebdriverIO config.
 *
 * Everything a provider returns is a complete WebdriverIO config object. In
 * particular, connection details (`hostname`, `port`, `path`, `protocol`) MUST
 * be returned at the **top level** of that object, never inside `capabilities`.
 * WebdriverIO v9 treats capabilities as strict W3C, so a per-capability
 * `hostname` is silently dropped and the session quietly falls back to
 * `127.0.0.1:4444`.
 *
 * @typedef {Object} Provider
 * @property {string} name
 *   Registry key. Also the value users put in `WDIO_PROVIDER`.
 * @property {(envs: Object, context: ProviderEnvContext) => void} applyEnvDefaults
 *   Mutates `envs` in place, filling in the provider's defaults for any
 *   variable the caller left unset. Must never overwrite an existing value.
 * @property {(options: ProviderSetupOptions) => Object} setupDesktopBrowsers
 *   Web application, desktop browsers (`scope=browser`, `metal=desktop`).
 * @property {(options: ProviderSetupOptions) => Object} setupDeviceBrowsers
 *   Web application, mobile browsers (`scope=browser`, `metal=device`).
 * @property {(options: ProviderSetupOptions) => Object} setupNativeApp
 *   Native application on a device (`scope=app`).
 */

/**
 * @typedef {Object} ProviderEnvContext
 * @property {string} scope - `browser` or `app`
 * @property {string} metal - `desktop` or `device`
 */

/**
 * @typedef {Object} ProviderSetupOptions
 * @property {Object} envs - the environment to read settings from
 * @property {string} framework - `jasmine`, `mocha`, ...
 * @property {string} [tunnelPrefix] - seed for a provider tunnel identifier
 * @property {string} [buildSuffix] - seed for a provider build identifier
 */

/**
 * Provider used when `WDIO_PROVIDER` is not set.
 *
 * @type {string}
 */
export const DEFAULT_PROVIDER_NAME = 'saucelabs'
