# ADR 0001: provider registration side-effect pattern for swarmdriver's package split

- **Status:** accepted
- **Date:** 2026-08-10
- **Deciders:** session user + agent (implemented by worker-scaffold, Wave A of the monorepo restructure)

## Context

swarmdriver's `buildWdioConfig()` needs to dispatch to a cloud-provider
implementation (Sauce Labs) when the `remote` option is `'saucelabs'`. When
splitting the single package into `@caps/core` (owns `buildWdioConfig`) and
`@caps/providers` (owns the Sauce Labs implementation), a naive split creates
a circular dependency: `core` needs to reach the provider implementation to
dispatch to it, but the provider implementation needs `core`'s shared helpers
(env-var parsing, capability builders) to do its job. Neither package can
depend on the other in both directions.

## Options considered

1. **Merge core and providers into one package** — avoids the cycle
   entirely. Pros: simplest. Cons: defeats the entire point of extracting
   providers separately (the stated goal was to make cloud providers
   pluggable without bloating core), and every future provider (BrowserStack,
   LambdaTest) would have to live inside `core` too.
2. **Provider registration side-effect pattern** — `core` owns a registry
   (`registerProvider`/`getProvider`), not the implementations. `providers`
   depends one-way on `core` and calls `registerProvider('saucelabs', impl)`
   as an import side-effect. Consumers do `import '@caps/providers'` before
   calling `buildWdioConfig()`. Pros: no cycle, matches an established
   pattern (webpack loaders, database driver registration). Cons: consumer-
   facing breaking API change from the single-package version — a missing
   side-effect import silently returns `undefined` instead of throwing.
3. **Dependency injection** — `buildWdioConfig()` takes an explicit provider
   registry/map as a parameter instead of a module-level registry. Pros: no
   hidden side-effect import, more explicit. Cons: pushes the wiring burden
   onto every caller, a bigger API change than option 2, and doesn't match
   how most Node ecosystem plugin systems actually work in practice (which
   made option 2 easier to document with a familiar mental model).

## Decision

**Provider registration side-effect pattern** (option 2). `@caps/core`
exports a registry; `@caps/providers`'s entry point self-registers on
import. Anchored on `Symbol.for('@caps/core.providers.registry')` rather
than a plain module-level variable, specifically to survive being loaded as
separate module instances across the dual ESM+CJS build (verified: a
provider registered via the ESM entry point is visible via the CJS entry
point and vice versa).

## Consequences

- **Positive:** No circular dependency. `core` has zero build-time
  dependency on `providers`. A second provider (BrowserStack, etc.) can be
  added as an entirely separate package with no changes to `core`.
- **Negative / cost:** Breaking API change from the single-package version —
  `import '@caps/providers'` is now required before `buildWdioConfig({remote:
  'saucelabs'})` works. Silent-failure mode: omitting the import produces
  `undefined`, identical to passing an unrecognized `remote` value, rather
  than a clear error. Documented prominently in README and
  `docs/providers.mdx`, but this is a real footgun for anyone not reading
  the docs.
- **Follow-on:** `@caps/providers` ended up depending on `@caps/cli` (for
  Sauce REST job API calls used inside a `driver.addCommand` hook) — a real,
  known architectural wart flagged during the Sauce Labs provider refactor
  but not yet cleaned up. See FOLLOWUPS.md.

## Notes

- Implemented in swarmdriver commit `c726d89`.
- The registry-anchoring-via-`Symbol.for` detail is documented inline in
  `packages/core/src/providers/registry.ts` (or equivalent) with the dual-
  module-instance rationale, since it looks like unnecessary complexity
  without that context.
