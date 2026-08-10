import type { Envs, Metal, Scope, WdioConfig } from '../types'

/**
 * Extra context handed to {@link Provider.applyEnvDefaults}, so a provider can
 * pick different defaults per cell of the config matrix.
 */
export interface ProviderEnvContext {
  /** `browser` or `app` */
  scope: Scope
  /** `desktop` or `device` */
  metal: Metal
}

/**
 * Everything a provider needs to turn an environment into a WebdriverIO config.
 *
 * The four named keys are what `buildWdioConfig()` guarantees to pass. The
 * index signature is what makes the contract *implementable*: a provider's
 * `setup*` function is a reducer that forwards its unrecognised keys down to
 * its own capability builders, so it declares a parameter type wider than this
 * one. Without an index signature here, that wider parameter type is not
 * assignable in either direction and no real provider can satisfy `Provider` —
 * which is exactly how `@caps/providers` failed to compile against the first
 * cut of this interface.
 */
export interface ProviderSetupOptions {
  /** the environment to read settings from */
  envs: Envs
  /** `jasmine`, `mocha`, ... */
  framework: string
  /** seed for a provider tunnel identifier */
  tunnelPrefix?: string
  /** seed for a provider build identifier */
  buildSuffix?: string
  [key: string]: any
}

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
 */
export interface Provider {
  /** Registry key. Also the value users put in `WDIO_PROVIDER`. */
  name: string

  /**
   * Mutates `envs` in place, filling in the provider's defaults for any
   * variable the caller left unset. Must never overwrite an existing value.
   */
  applyEnvDefaults(envs: Envs, context: ProviderEnvContext): void

  /** Web application, desktop browsers (`scope=browser`, `metal=desktop`). */
  setupDesktopBrowsers(options: ProviderSetupOptions): WdioConfig

  /** Web application, mobile browsers (`scope=browser`, `metal=device`). */
  setupDeviceBrowsers(options: ProviderSetupOptions): WdioConfig

  /** Native application on a device (`scope=app`). */
  setupNativeApp(options: ProviderSetupOptions): WdioConfig
}

/**
 * Provider used when `WDIO_PROVIDER` is not set.
 */
export const DEFAULT_PROVIDER_NAME = 'saucelabs'
