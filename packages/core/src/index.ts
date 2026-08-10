export * as enums from './enums'
export * as helpers from './helpers'

export * from './helpers'

export * from './services'
export * from './providers'
export * from './constants'
export * from './utils'
export * from '@caps/reporters'
export * from './api'
export * from './logger'

// The vocabulary the rest of the workspace builds on. `@caps/core` owns these
// definitions so that a provider or reporter package describes a WebdriverIO
// config with the *same* type this package's `Provider` contract requires —
// two structurally-similar-but-incompatible copies is exactly the seam that
// breaks when a provider is assigned into the registry.
//
// Re-exported as `export type` rather than `export *` so the bundler can drop
// the module entirely: `./types` has no runtime content.
export type {
  AppiumConnection,
  Capability,
  Envs,
  MachineSetupOptions,
  Metal,
  PercentPoint,
  Point,
  ScreenRect,
  Scope,
  Selector,
  WdioConfig,
  WdioElement,
} from './types'
