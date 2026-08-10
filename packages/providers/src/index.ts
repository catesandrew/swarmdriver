/**
 * `@caps/providers` — cloud-grid provider implementations for swarmdriver.
 *
 * **Importing this package has a side effect**: every provider it ships is
 * registered into `@caps/core`'s provider registry at import time. That is the
 * whole point — it is what lets `@caps/core` resolve `remote: 'saucelabs'`
 * without statically depending on this package (which would be a cycle).
 *
 * ```js
 * import '@caps/providers'                       // side-effect: registers 'saucelabs'
 * import { buildWdioConfig } from '@caps/core'
 *
 * export const config = buildWdioConfig({ remote: 'saucelabs', envs: process.env })
 * ```
 *
 * Omitting the `@caps/providers` import makes `buildWdioConfig()` return
 * `undefined` for `remote: 'saucelabs'`, the same as any other unknown remote.
 */
import './saucelabs'

export * from './saucelabs'
export * from './machines'
export * from './services'

// Type-only, so this erases at build time and cannot defeat the side-effect
// import above.
export type * from './types'
