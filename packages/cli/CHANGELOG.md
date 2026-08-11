# @caps/cli

## 0.1.1

### Patch Changes

- Updated dependencies [459b49b]
  - @caps/core@0.1.1

## 0.1.0

Initial release.

`@caps/cli` ships the `swarm-*` command-line binaries: pinned proxies for tools swarmdriver already depends on, plus a Sauce Labs REST client for the job and storage APIs you'd otherwise be hitting with `curl`.

### Highlights

- **Proxies pin their target tool's version.** `swarm-wdio`, `swarm-appium`, `swarm-allure`, and `swarm-jasmine` each resolve the target package's own `bin` entry and re-execute it with node, forwarding argv, stdio, and exit status verbatim — `swarm-wdio` _is_ `wdio`, just guaranteed to be the version `@caps/cli` was built against (`@wdio/cli@^9`, `appium@^2.11`, `allure-commandline@^2.29`). That saves a project four extra direct dependencies while keeping them in lockstep with what swarmdriver's generated configs expect.
- **`swarm-sauce`** is a Sauce Labs REST CLI covering `jobs` (list, info) and `storage` (upload, list files by kind) — `swarm-sauce-storage` mounts the storage subtree as its own top-level command for convenience.
- **`swarm-sauce-connect`** is a bash wrapper that starts a Sauce Connect tunnel and waits for readiness before returning.
- **Known caveat: `swarm-jasmine` requires `jasmine` as a direct dependency.** `jasmine` is only a transitive dependency of `@wdio/jasmine-framework`, which is not resolvable under pnpm's strict `node_modules` layout — `swarm-jasmine` exits with `Cannot find module 'jasmine'` unless the consuming project also declares `jasmine` directly. The other three proxies work out of the box.
- Depends only on `@caps/core` among the `@caps` packages.
