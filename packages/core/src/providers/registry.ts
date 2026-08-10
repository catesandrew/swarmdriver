import {
  DEFAULT_PROVIDER_NAME,
} from './provider'

import type { Provider } from './provider'

/**
 * Process-wide key for the registry store.
 *
 * The registry is mutable module state, and mutable module state is only a
 * singleton if the module is only ever instantiated once. That is not
 * guaranteed here: this package ships both ESM and CJS builds, exposes the
 * registry through more than one entry point, and can legitimately be
 * installed twice in a consumer's tree. Any of those produces a second copy of
 * this module — and then `@caps/providers` would register into one copy while
 * `buildWdioConfig()` reads the other, silently resolving no provider.
 *
 * Anchoring the store on a `Symbol.for()` key makes every copy share one
 * object, which is the same trick React and similar libraries use for exactly
 * this hazard.
 *
 * TypeScript infers `unique symbol` for a `const` bound to `Symbol.for()`,
 * which is what lets it be used as a computed key in {@link RegistryHost}.
 */
const REGISTRY_KEY = Symbol.for('@caps/core.providers.registry')

/**
 * The registry store itself: provider implementations keyed by registry name.
 */
export type ProviderRegistry = Record<string, Provider>

/**
 * `globalThis` widened with the single well-known key this package owns.
 *
 * Declared locally rather than via `declare global` so the augmentation does
 * not leak into consumers' global scope — nothing outside this module has any
 * business reaching for the key directly.
 */
type RegistryHost = typeof globalThis & {
  [REGISTRY_KEY]?: ProviderRegistry
}

/**
 * Registry of cloud providers, keyed by `WDIO_PROVIDER`.
 *
 * `@caps/core` deliberately owns the *registry* but none of the
 * *implementations*. A provider package (e.g. `@caps/providers`) depends on
 * core one-way and calls {@link registerProvider} as an import side-effect, so
 * there is no circular dependency between the two packages.
 */
export const providers: ProviderRegistry = ((globalThis as RegistryHost)[REGISTRY_KEY] ??= Object.create(null))

/**
 * Register a provider implementation under `name`.
 *
 * Called for its side effect by provider packages at import time:
 *
 * ```ts
 * import { registerProvider } from '@caps/core/providers'
 * registerProvider('saucelabs', saucelabsProvider)
 * ```
 *
 * Re-registering the same name replaces the previous implementation, which is
 * what makes a test double possible without reaching into module internals.
 *
 * The runtime guards stay even though the signature is typed: plain-JavaScript
 * consumers and dynamically-assembled provider objects still reach this
 * function with the types unchecked.
 *
 * @param name - registry key, also the value users put in `WDIO_PROVIDER`
 * @param provider - the implementation
 * @returns the provider that was registered
 */
export const registerProvider = (name: string, provider: Provider): Provider => {
  if (!name || typeof name !== 'string') {
    throw new TypeError('registerProvider(name, provider): `name` must be a non-empty string')
  }

  if (!provider || typeof provider !== 'object') {
    throw new TypeError(`registerProvider('${ name }', provider): \`provider\` must be an object`)
  }

  providers[name] = provider

  return provider
}

/**
 * Remove a provider from the registry.
 *
 * @param name - registry key
 * @returns `true` when something was actually removed
 */
export const unregisterProvider = (name: string): boolean => {
  if (!Object.hasOwn(providers, name)) {
    return false
  }

  delete providers[name]

  return true
}

/**
 * Look up a provider by name.
 *
 * Returns `undefined` when nothing is registered under that name — including
 * the case where the caller simply forgot to import the package that would
 * have registered it. `buildWdioConfig()` turns that into a no-op return
 * rather than throwing, preserving the v1 behaviour for unknown remotes.
 *
 * @param name - provider key, defaults to {@link DEFAULT_PROVIDER_NAME}
 * @returns the provider, or `undefined`
 */
export const getProvider = (name: string = DEFAULT_PROVIDER_NAME): Provider | undefined => {
  if (!Object.hasOwn(providers, name)) {
    return undefined
  }

  return providers[name]
}

/**
 * Names of every currently-registered provider.
 *
 * @returns registry keys, in registration order
 */
export const listProviders = (): string[] => Object.keys(providers)
