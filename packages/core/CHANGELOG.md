# @caps/core

## 0.1.0

Initial release.

`@caps/core` is the package every swarmdriver consumer installs: `buildWdioConfig()`, the config matrix, the local setup functions, machines, services, helpers, enums, and the cloud-provider **registry**.

### Highlights

- **`buildWdioConfig()`** dispatches on a six-cell matrix — `remote` (`local` | `saucelabs`) × `scope` (`browser` | `app`) × `metal` (`desktop` | `device`) — and returns a ready-to-use WDIO 9 config object.
- **Defaults are injected, never overwritten.** Every branch fills in unset `envs` fields with the `x || (x = default)` idiom, so a caller-supplied value always wins over the branch default (e.g. `WDIO_BROWSERS=chrome:safari` locally, `chrome:safari:firefox` on Sauce; `WDIO_REPORTERS=spec` locally, `spec:junit:saucecomment` on Sauce).
- **Owns the provider registry, ships zero provider implementations.** `registerProvider()`, `getProvider()`, `providers`, and `DEFAULT_PROVIDER_NAME` live here (also re-exported from `@caps/core/providers`), but resolving `remote: 'saucelabs'` requires a separate `@caps/providers` import — see the note below.
- **Sauce Labs Jobs REST client** (`sauce/jobs.ts`, `sauce/api.ts`) lives in this package as deliberately thin *data* functions: they perform the HTTP call and return the parsed response untouched. Projecting that response down to a human-readable subset and rendering it as JSON/YAML is a presentation concern left to `@caps/cli`.
- Requires **Node >= 20** — the Sauce Jobs client uses the runtime's global `fetch` rather than pulling in an HTTP dependency of its own.
- Depends only on `@caps/reporters`; the dependency graph is one-directional (`@caps/providers` and `@caps/cli` depend on `@caps/core`, never the reverse), which is what keeps the provider registry cycle-free.

### ⚠️ Worth knowing before you start

`@caps/core` ships **no** cloud-provider implementations. If you pass `remote: 'saucelabs'` without also importing `@caps/providers` as a bare side-effect import, `buildWdioConfig()` returns `undefined` — no error, no warning. See the `@caps/providers` changelog and [Providers](../../docs/providers.mdx) for the full contract.
