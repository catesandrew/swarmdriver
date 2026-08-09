import {
  DEFAULT_PROVIDER_NAME,
} from './provider'

import {
  saucelabsProvider,
} from './saucelabs'

// Re-exported wholesale so the `Provider` typedef travels with the registry.
export * from './provider'
export * from './saucelabs'

/**
 * Registry of cloud providers, keyed by `WDIO_PROVIDER`.
 *
 * Sauce Labs is the only implementation that ships with swarmdriver. Adding
 * another one means adding a module under `src/providers/` that satisfies the
 * {@link Provider} contract and registering it here — see `docs/providers.mdx`.
 *
 * @type {Object<string, import('./provider').Provider>}
 */
export const providers = {
  [saucelabsProvider.name]: saucelabsProvider,
}

/**
 * Look up a provider by name.
 *
 * @param {string} [name] - provider key, defaults to {@link DEFAULT_PROVIDER_NAME}
 * @returns {import('./provider').Provider|undefined} Returns the provider, or
 *   `undefined` when nothing is registered under that name.
 */
export const getProvider = (name = DEFAULT_PROVIDER_NAME) => {
  if (!Object.hasOwn(providers, name)) {
    return undefined
  }

  return providers[name]
}
