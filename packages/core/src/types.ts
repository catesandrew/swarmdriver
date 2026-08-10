/**
 * Types shared across the whole package.
 *
 * These live in their own module (rather than next to their first consumer) so
 * that `utils.ts`, `services/*` and `providers/*` can all refer to the same
 * `Envs` shape without importing each other for a type alone.
 */

/**
 * An environment-variable bag.
 *
 * Every `parseBool` / `parseWhole` / `parseString` / `parseList` call in this
 * package reads through this shape, and provider packages mutate it in
 * `applyEnvDefaults()`. It is deliberately *not* `NodeJS.ProcessEnv`: callers
 * routinely pass a synthesised object (tests, `buildWdioConfig({ envs })`)
 * rather than `process.env`, and the config matrix must stay testable without
 * touching real process state.
 *
 * Values are `string | undefined` because that is what `process.env` actually
 * hands back — an unset variable reads as `undefined`, never `''`.
 */
export type Envs = Record<string, string | undefined>

/**
 * A single W3C capability object.
 *
 * Left open-ended on purpose: vendor prefixes (`appium:`, `goog:chromeOptions`,
 * `sauce:options`, `moz:*`) are dynamic keys that no closed type can enumerate,
 * and this package's job is to *assemble* them rather than validate them.
 */
export interface Capability {
  browserName?: string
  browserVersion?: string
  platformName?: string
  [key: string]: any
}

/**
 * A WebdriverIO testrunner config object (or a fragment of one).
 *
 * Kept structural and open: `buildWdioConfig()` composes fragments from several
 * reducers, and WebdriverIO itself accepts a superset that varies by installed
 * service. The keys named here are the ones this package reads back after
 * composing, so they are worth pinning.
 */
export interface WdioConfig {
  capabilities?: Capability[]
  services?: any[]
  reporters?: any[]
  framework?: string
  hostname?: string
  port?: number
  path?: string
  protocol?: string
  [key: string]: any
}

/**
 * Where an Appium server can be reached.
 *
 * Assembled by `services/appium.ts` and threaded into the machine builders,
 * which lift these onto the *config* (not the capability) because WebdriverIO
 * v9 capabilities are strict W3C and silently drop connection keys.
 */
export interface AppiumConnection {
  address?: string
  basePath?: string
  protocol?: string
  port?: number
  [key: string]: any
}

/**
 * Options accepted by every `*Setup*` machine builder.
 *
 * The index signature is load-bearing rather than lazy: each builder collects
 * its unrecognised keys into `...params` and merges them straight into the
 * generated capability object. That is the documented escape hatch for
 * per-capability overrides (`browserName`, `appium:udid`, a vendor key a driver
 * added last week), so the type has to stay open to keep it usable.
 */
export interface MachineSetupOptions {
  envs?: Envs
  appiumConfig?: AppiumConnection
  sauceOptions?: Record<string, any>
  framework?: string
  browserName?: string
  browserVersion?: string
  platformName?: string
  [key: string]: any
}

/**
 * `desktop` (a machine-hosted browser) or `device` (a phone/tablet/simulator).
 */
export type Metal = 'desktop' | 'device'

/**
 * `browser` (a web application) or `app` (a native application).
 */
export type Scope = 'browser' | 'app'

/**
 * A WebdriverIO selector: a selector string, a matcher object, or a function.
 */
export type Selector = string | ((...args: any[]) => any) | Record<string, any>

/**
 * A WebdriverIO element handle.
 *
 * Open by design. Every helper in `helpers/*` is registered onto the session as
 * a *custom command* (`services/utils.ts#addCommands`), so the element objects
 * these functions receive carry both the stock WebdriverIO command surface and
 * whatever the consuming project has added. Only the two properties this
 * package reads directly are pinned.
 */
export interface WdioElement {
  elementId?: string
  selector?: any
  [key: string]: any
}

/** An absolute screen coordinate, in pixels. */
export interface Point {
  x: number
  y: number
}

/** A screen coordinate expressed as a fraction (`0`–`1`) of the screen. */
export interface PercentPoint {
  xPct: number
  yPct: number
}

/** The result of `driver.getWindowRect()`. */
export interface ScreenRect {
  x?: number
  y?: number
  width: number
  height: number
}
