/**
 * Types for the Sauce Labs provider.
 *
 * Scope note: these describe the shapes *this package* actually produces and
 * consumes. They are deliberately not an attempt to re-implement the W3C
 * WebDriver / Appium capability specs — this is test tooling, and a full spec
 * model would be far larger than the code it describes. Where a value is
 * genuinely opaque to us (a WebdriverIO service tuple, a user-supplied
 * `customData` blob) it stays `unknown` rather than being invented.
 */

import type { WdioConfig as CoreWdioConfig } from '@caps/core/providers'

/**
 * A raw environment bag — `process.env`, or a fixture object in tests.
 *
 * Everything arrives as a string (or is absent); the `parse*` helpers in
 * `@caps/core/utils` are what turn these into booleans/numbers/lists.
 */
export type Envs = Record<string, string | undefined>

/**
 * The flat, un-prefixed settings bag that flows between the `parse*` and
 * `build*` capability functions.
 *
 * This is the package's central type. A `parse*` function reads env vars and
 * emits a subset of it; a `build*` function consumes it and emits the
 * correspondingly-shaped slice of a real capability object (adding the
 * `appium:` prefix, or nesting under `sauce:options`, as required). Every field
 * is optional because every field is independently opt-in via its env var, and
 * the builders spread nothing at all when a value is absent.
 */
export interface SauceCapabilityValues {
  // ── W3C WebDriver, required trio ──────────────────────────────────────────
  browserName?: string
  browserVersion?: string
  platformName?: string

  // ── W3C WebDriver, optional ───────────────────────────────────────────────
  acceptInsecureCerts?: boolean
  /** `none`, `eager` or `normal`. */
  pageLoadStrategy?: string
  proxy?: Record<string, unknown>
  timeouts?: { implicit?: number, pageLoad?: number, script?: number }
  strictFileInteractability?: boolean
  unhandledPromptBehavior?: string

  // ── Appium (emitted `appium:`-prefixed) ───────────────────────────────────
  deviceName?: string
  platformVersion?: string
  automationName?: string
  app?: string
  appPackage?: string
  appActivity?: string
  /** Emitted as `appium:orientation`; `PORTRAIT` or `LANDSCAPE`. */
  deviceOrientation?: string
  noReset?: boolean
  newCommandTimeout?: number
  autoAcceptAlerts?: boolean

  // ── `sauce:options`, desktop-browser specific ─────────────────────────────
  chromedriverVersion?: string
  geckodriverVersion?: string
  avoidProxy?: boolean
  extendedDebugging?: boolean
  capturePerformance?: boolean
  screenResolution?: string
  commandTimeout?: number
  idleTimeout?: number

  // ── `sauce:options`, mobile-app specific ──────────────────────────────────
  appiumVersion?: string
  /** `tablet` or `phone`. Not narrowed: it arrives verbatim from an env var. */
  deviceType?: string
  otherApps?: string
  tabletOnly?: boolean
  phoneOnly?: boolean
  privateDevicesOnly?: boolean
  publicDevicesOnly?: boolean
  carrierConnectivityOnly?: boolean
  cacheId?: string
  resigningEnabled?: boolean
  sauceLabsImageInjectionEnabled?: boolean
  sauceLabsBypassScreenshotRestriction?: boolean
  allowTouchIdEnroll?: boolean
  audioCapture?: boolean
  networkCapture?: boolean
  groupFolderRedirectEnabled?: boolean
  enableAnimations?: boolean
  systemAlertsDelayEnabled?: boolean
  customLogFiles?: string[]
  setupDeviceLock?: boolean

  // ── `sauce:options`, desktop + mobile ─────────────────────────────────────
  name?: string
  build?: string
  tags?: string[]
  username?: string
  accessKey?: string
  /** Emitted as `custom-data`. */
  customData?: Record<string, unknown>
  /** Emitted as `public`. */
  visibility?: string
  tunnelName?: string
  tunnelOwner?: string
  recordVideo?: boolean
  videoUploadOnPass?: boolean
  recordScreenshots?: boolean
  recordLogs?: boolean

  // ── `sauce:options`, virtual devices + desktop only ───────────────────────
  maxDuration?: number
  priority?: number
  timeZone?: string
  /** The four `pre*` fields are collapsed into a single `prerun` object. */
  preExecutable?: string
  preArgs?: string
  preBackground?: string
  preTimeout?: string
}

/**
 * Settings for the `@wdio/sauce-service` block (not capabilities).
 *
 * These configure the *client* — credentials, region, whether to spin up a
 * Sauce Connect tunnel — rather than the remote session.
 */
export interface SauceServiceSettings {
  user?: string
  key?: string
  region?: string
  headless?: boolean
  sauceConnect?: boolean
  uploadLogs?: boolean
  maxErrorStackLength?: number
  tunnelName?: string
  tunnelOwner?: string
}

/** Per-run identifiers derived from the environment (or generated). */
export interface SauceVars {
  tunnelId: string
  tunnelOwner: string | undefined
  buildId: string
}

/** Options for {@link buildSauceVars}. */
export interface SauceVarsOptions {
  envs?: Envs
  tunnelPrefix?: string
  buildSuffix?: string
}

/**
 * A single entry of a WebdriverIO `capabilities` array.
 *
 * The index signature is load-bearing rather than lazy: capability objects are
 * an open map by design (`appium:*`, `sauce:options`, `goog:chromeOptions`,
 * and our own `swarmdriver:testMode`), and the vendor-prefixed keys cannot be
 * enumerated ahead of time.
 */
export interface SauceCapability {
  browserName?: string
  browserVersion?: string
  platformName?: string
  'sauce:options'?: Record<string, unknown>
  /** Pre-`sauce:options` staging key; merged by the `machines/*` builders. */
  sauceOptions?: Record<string, unknown>
  /** A numeric member of `TestMode` from `@caps/core/enums`. */
  'swarmdriver:testMode'?: number
  [capability: string]: unknown
}

/**
 * A WebdriverIO config, or the partial slice of one that a reducer contributes.
 *
 * Open for the same reason as {@link SauceCapability}: `setup*` builds a config
 * up by spreading provider defaults, reporter config and service config
 * together, and the reporter packages own keys we do not.
 *
 * It *extends* `@caps/core`'s definition rather than restating it. That is not
 * tidiness: `Provider.setup*` in `@caps/core/providers` is declared to return
 * core's `WdioConfig`, so an independent declaration here — however similar —
 * makes `saucelabsProvider` unassignable to `Provider` the moment the two drift
 * (an `unknown`-valued index signature, for instance, is not assignable to
 * core's `path?: string`). Narrowing `capabilities` to {@link SauceCapability}
 * keeps the extra precision this package wants.
 */
export interface WdioConfig extends CoreWdioConfig {
  capabilities?: SauceCapability[]
}

/**
 * Options accepted by the three top-level `setupSauce*` reducers.
 *
 * The index signature mirrors the runtime contract: every reducer forwards its
 * unrecognised `...params` down to the capability builders and to the reporter
 * setup functions, so callers legitimately pass keys this package never names.
 */
export interface SauceSetupOptions extends SauceCapabilityValues, SauceServiceSettings {
  envs?: Envs
  framework?: string
  tunnelPrefix?: string
  buildSuffix?: string
  /**
   * `Reporter`/`Browser`/`Device` in `@caps/core/enums` are plain numeric
   * maps, not string unions — these arrays hold their numeric members.
   */
  reporters?: number[]
  browsers?: number[]
  devices?: number[]
  config?: WdioConfig
  specRepporterShowPreface?: boolean
  /**
   * Forwarded verbatim to `@caps/reporters`' junit setup. Left as `any`
   * because the runner hands the callback its own options object (`cid`,
   * `capabilities`, ...) whose full shape is owned by `@wdio/junit-reporter`,
   * not by us.
   */
  junitReporterOutputFileFormat?: (options: any) => string
  [option: string]: unknown
}
