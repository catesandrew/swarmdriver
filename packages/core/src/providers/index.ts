// The provider *contract* and the provider *registry*. Implementations live in
// separate packages (e.g. `@caps/providers` for Sauce Labs) and self-register
// on import — see `./registry.ts` for the rationale.
export * from './provider'
export * from './registry'

// Re-exported here as well as from the package root: a provider package imports
// the contract from `@caps/core/providers`, and it needs these to describe the
// config its `setup*` functions return. Making it reach into a second entry
// point for them is what tempts it into declaring its own near-copy instead.
export type { Capability, Envs, Metal, Scope, WdioConfig } from '../types'
