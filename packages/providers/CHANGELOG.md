# @caps/providers

## 0.1.0

Initial release.

`@caps/providers` holds the cloud-grid **provider implementations** for swarmdriver — currently Sauce Labs. Importing the package registers its providers into `@caps/core`'s registry as a side effect; it ships no config-building logic of its own beyond that.

### Highlights

- **Sauce Labs is the only implementation that ships**, and it is fully exercised by the test suite: `saucelabsProvider` implements `@caps/core`'s five-member `Provider` interface and calls `registerProvider('saucelabs', ...)` at module scope, so importing the package *is* the registration (`packages/providers/src/saucelabs/index.ts`, with capability builders split out into `capabilities.ts`).
- **Registration is an import side effect, and it is required.** `import '@caps/providers'` before calling `buildWdioConfig()` with `remote: 'saucelabs'` — without it, nothing has registered `'saucelabs'` and `buildWdioConfig()` silently returns `undefined`. It is a bare import (nothing to destructure), and the package declares `"sideEffects": true` so bundlers don't tree-shake it away.
- **Custom WebdriverIO commands** `browser.getJob()` / `browser.updateJob()` are added by the Sauce Labs service hooks (`services/remote.ts`) so a running test can read or mutate its own Sauce job (name, tags, visibility, pass/fail, build, custom data) without hand-rolling REST calls.
- **Dependency-inversion fix:** `@caps/providers` now depends only on `@caps/core` and `@caps/reporters` — it no longer depends on `@caps/cli`. Presentation/formatting concerns (JSON/YAML rendering, CLI output) stay in `@caps/cli`; this package is implementation-only.

### Behavior worth knowing about

`browser.getJob()` and `browser.updateJob()` now resolve to the **parsed job object**, not a pretty-printed JSON string. A test doing `const job = await browser.getJob()` gets the actual `SauceJobResponse`-shaped object back (fields like `status`, `passed`, `video_url`, etc.) and can read/compare properties directly, instead of having to `JSON.parse()` a string first. This lines up with `@caps/core`'s own Sauce Jobs client, which is deliberately a *data* function returning the parsed response untouched — string formatting is a presentation concern that belongs in `@caps/cli`, not in a live test session's hooks.

This package is pre-1.0 and unreleased, so it isn't a breaking-change note in the strict semver sense — just documenting the current, corrected behavior for anyone who was working around the old stringified output.
