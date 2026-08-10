# Swarmdriver

[![GitHub](https://img.shields.io/badge/github-catesandrew%2Fswarmdriver-blue?style=flat-square&logo=github)](https://github.com/catesandrew/swarmdriver)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

**One `wdio.conf.js` for every target.** Three environment variables select
local-or-cloud, browser-or-native-app, desktop-or-device, and Swarmdriver emits a
valid WebdriverIO 9 + Appium config for that cell.

```bash
wdio run wdio.conf.js                                          # local Chrome
WDIO_METAL=device wdio run wdio.conf.js                        # local Android + iOS browsers
WDIO_SCOPE=app wdio run wdio.conf.js                           # local native apps
WDIO_REMOTE=saucelabs wdio run wdio.conf.js                    # Sauce desktop browsers
WDIO_REMOTE=saucelabs WDIO_METAL=device wdio run wdio.conf.js  # Sauce mobile browsers
WDIO_REMOTE=saucelabs WDIO_SCOPE=app wdio run wdio.conf.js     # Sauce real devices
```

The alternative most teams end up with is six setup scripts — local-chrome,
local-android, local-ios, sauce-chrome, sauce-android, sauce-ios — that drift
apart, plus a `capabilities` block copy-pasted so many times nobody knows which
keys still matter. This is that, collapsed into one file and a matrix.

## Quick start

```bash
pnpm add -D @caps/core @caps/providers webdriverio
```

```javascript
// wdio.conf.js
import '@caps/providers'                    // registers cloud grids — see the warning below
import { buildWdioConfig } from '@caps/core'

export const config = {
  ...buildWdioConfig({
    envs: process.env,
    remote: process.env.WDIO_REMOTE || 'local',
    scope: process.env.WDIO_SCOPE || 'browser',
    metal: process.env.WDIO_METAL || 'desktop',
    framework: 'jasmine',
    pkgName: 'my-e2e-suite',                // seeds Sauce build + tunnel names
  }),
  specs: ['./test/specs/**/*.spec.js'],
}
```

```bash
wdio run wdio.conf.js
```

`buildWdioConfig()` returns `specs: []` — it builds capabilities, services,
reporters and connection details, not a spec glob. Spread the result and add
your own; options it does not recognise are ignored, so `baseUrl`,
`maxInstances` and hooks also go on the outer object.

## ⚠️ Providers must be imported

If you use `remote: 'saucelabs'`, the bare `import '@caps/providers'` is
**required**. Without it `buildWdioConfig()` returns `undefined` — no error, no
warning, just an empty config.

`@caps/core` owns the provider *registry* but ships **no** implementations.
`@caps/providers` registers itself into that registry as an import side effect.
That one-way dependency is what keeps core from depending on its own providers
(a cycle).

```javascript
import '@caps/providers'                    // ← side effect: registers 'saucelabs'
import { buildWdioConfig } from '@caps/core'
```

Two things that will bite you:

- **It is a bare import, not a named one.** There is nothing to destructure.
- **Do not let a bundler tree-shake it away.** The import has no bindings, so
  some setups drop it. `@caps/providers` sets `"sideEffects": true` to prevent
  that; preserve the flag if you re-export it through your own package.

An unregistered provider is not an error — `buildWdioConfig()` returns
`undefined` for any unknown remote, exactly as it does for a typo'd one. Confirm
registration with `Object.keys(providers)`; an empty array means the import did
not execute.

## The matrix

| Axis | Values | Selects |
|------|--------|---------|
| `WDIO_REMOTE` | `local` \| `saucelabs` | Where the session runs |
| `WDIO_SCOPE` | `browser` \| `app` | Web app or native app |
| `WDIO_METAL` | `desktop` \| `device` | Desktop machine or mobile device/simulator |

`scope=app` forces `metal=device`, so the matrix has **six** reachable cells:

| `WDIO_REMOTE` | `WDIO_SCOPE` | `WDIO_METAL` | Runs | Endpoint |
|---------------|--------------|--------------|------|----------|
| `local` | `browser` | `desktop` | `setupLocalDesktopBrowsers()` | `127.0.0.1:4444` |
| `local` | `browser` | `device` | `setupLocalDeviceBrowsers()` | `127.0.0.1:4723` |
| `local` | `app` | `device` | `setupLocalNativeApp()` | `127.0.0.1:4723` |
| `saucelabs` | `browser` | `desktop` | `provider.setupDesktopBrowsers()` | `ondemand.us-west-1.saucelabs.com:443` |
| `saucelabs` | `browser` | `device` | `provider.setupDeviceBrowsers()` | `ondemand.us-west-1.saucelabs.com:443` |
| `saucelabs` | `app` | `device` | `provider.setupNativeApp()` | `ondemand.us-west-1.saucelabs.com:443` |

All six run through WebdriverIO 9's real `ConfigParser` on every CI run
(`pnpm smoke`), which asserts no non-W3C key survives inside `capabilities`.

`WDIO_BROWSERS` (`chrome`, `safari`, `firefox`) and `WDIO_DEVICES` (`android`,
`ios`) are **colon-separated**; each entry becomes one capability. Unrecognised
entries are dropped silently.

## Packages

A [pnpm workspace](https://pnpm.io/workspaces) monorepo. The single
`swarmdriver` package of v1 is now four publishable packages under the `@caps`
scope, so you install only what you use.

| Package | Install | What it is |
|---------|---------|------------|
| [`@caps/core`](./packages/core) | `pnpm add -D @caps/core` | `buildWdioConfig()`, the config matrix, helpers, machines, services, and the provider **registry**. |
| [`@caps/providers`](./packages/providers) | `pnpm add -D @caps/providers` | Cloud-grid provider **implementations** (Sauce Labs). Registers itself into `@caps/core` on import. |
| [`@caps/reporters`](./packages/reporters) | `pnpm add -D @caps/reporters` | WebdriverIO reporters: spec, junit, ReportPortal, Sauce job comments. |
| [`@caps/cli`](./packages/cli) | `pnpm add -D @caps/cli` | `swarm-*` binaries: Sauce REST CLI plus pinned `wdio`/`appium`/`allure` proxies. |

`packages/integration-tests` is private and unpublished — the cross-package
regression suite, including the WDIO 9 config smoke gate.

## Environment reference

Matrix and targets:

| Variable | Values | Default |
|----------|--------|---------|
| `WDIO_REMOTE` | `local` \| `saucelabs` | `local` |
| `WDIO_SCOPE` | `browser` \| `app` | `browser` |
| `WDIO_METAL` | `desktop` \| `device` | `desktop` |
| `WDIO_PROVIDER` | `saucelabs` | value of `WDIO_REMOTE` |
| `WDIO_BROWSERS` | colon-separated: `chrome`, `safari`, `firefox` | `chrome:safari` local, `chrome:safari:firefox` on Sauce |
| `WDIO_DEVICES` | colon-separated: `android`, `ios` | `android:ios` |

Runner and logging:

| Variable | Config key | Default |
|----------|-----------|---------|
| `WDIO_LOG_LEVEL` | `logLevel` | `silent` |
| `WDIO_MAX_INSTANCES` | `maxInstances` | `100` (`1` when `DEBUG` is set) |
| `WDIO_OUTPUT_DIR` | `outputDir` | unset |
| `WDIO_REPORTERS` | colon-separated: `spec`, `junit`, `reportportal`, `saucecomment` | `spec` local, `spec:junit:saucecomment` on Sauce |
| `SWARMDRIVER_LOG_LEVEL` | swarmdriver's own logger | `warn` |

Sauce Labs credentials:

| Variable | Required |
|----------|----------|
| `SAUCE_USERNAME` | Yes |
| `SAUCE_ACCESS_KEY` | Yes |
| `SAUCE_REGION` | No — passed to `@wdio/sauce-service`; the session endpoint itself is fixed at `us-west-1` |

Native apps read a large Appium surface (`ANDROID_APP`, `IOS_APP`, `APP_PACKAGE`,
`APP_ACTIVITY`, `BUNDLE_ID`, `AVD`, ~120 more). See
[Usage](./docs/usage.mdx) for the reference and [Examples](./docs/examples.mdx)
for working setups.

## CLI

```bash
swarm-wdio run wdio.conf.js       # pinned @wdio/cli
swarm-appium                      # pinned appium
swarm-allure generate             # pinned allure-commandline

swarm-sauce jobs list             # Sauce REST: job ids
swarm-sauce jobs info <id>
swarm-sauce storage upload ./build/MyApp.ipa    # prints the new file id
swarm-sauce storage files ls --kind ios
```

Full surface in [CLI](./docs/cli.mdx).

## Documentation

- **[Intro](./docs/intro.mdx)** — what this is, in 60 seconds
- **[Installation](./docs/installation.mdx)** — packages and peer dependencies
- **[Quick Start](./docs/quick-start.mdx)** — first passing test
- **[Usage](./docs/usage.mdx)** — full environment-variable reference
- **[Examples](./docs/examples.mdx)** — a runnable setup for each of the six cells
- **[CLI](./docs/cli.mdx)** — `swarm-*` binaries and the Sauce REST client
- **[Architecture](./docs/architecture.mdx)** — the matrix, the package split, the provider registry
- **[Providers](./docs/providers.mdx)** — the `Provider` interface and how to add a grid
- **[API Reference](./docs/api/)** — TypeDoc output

## Developing this repo

Uses **pnpm** (see `packageManager` in the root `package.json`) and
[Changesets](https://github.com/changesets/changesets) for versioning.

```bash
pnpm install              # install the whole workspace

pnpm build                # build every package (must run before tests)
pnpm test                 # every package's unit suite
pnpm lint                 # eslint across all TypeScript sources
pnpm smoke                # WDIO 9 config smoke gate
pnpm build-docs           # regenerate docs/api via TypeDoc

pnpm changeset            # record a change for the next release
```

Build before test: packages consume each other through their published `exports`
(`dist/`), so an unbuilt dependency makes cross-package tests fail to resolve. CI
enforces the same order.

## Contributing

Issues and pull requests welcome on
[GitHub](https://github.com/catesandrew/swarmdriver). New cloud providers are
especially welcome — the interface is five members and documented in
[Providers](./docs/providers.mdx). We deliberately do not ship stubs for grids
nobody runs.

## License

MIT © [Andrew Cates](https://github.com/catesandrew)

## Provenance

Swarmdriver is derived from an internal HappyMoney test harness (`wdio-happy`),
released as MIT-licensed open source software with permission. The core
architectural patterns and configuration matrix approach have been preserved and
extended for general-purpose use.
