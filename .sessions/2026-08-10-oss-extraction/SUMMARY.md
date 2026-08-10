# Summary — OSS extraction marathon (2026-08-10)

## Goal

Extract personal open-source projects from two proprietary employer
monorepos (frontend/build tooling, and GitHub-Actions/CI tooling), turning
internal packages into standalone, MIT-licensed, modernized repos — with
real bug fixes, real tests, and honest documentation of what was and wasn't
carried over.

## What was done

### swarmdriver (env-var-driven WebdriverIO + Appium test harness)

Extracted from a proprietary `wdio-happy` package.

- Extraction + rebrand — `0210c46`
- Restructured into a TypeScript pnpm monorepo, `@caps/*` scope
  (`@caps/core`, `@caps/providers`, `@caps/reporters`, `@caps/cli`) — `c726d89`.
  Provider-registration pattern to avoid a core↔providers circular
  dependency — see `adr/0001-provider-registration-pattern.md`.
- Docusaurus docs site + landing page, deployed to GitHub Pages via Actions
  — `551b8e5`. Site is live at catesandrew.github.io/swarmdriver.
- Fixed a GitHub Actions permissions bug blocking the Pages deploy
  (job-level `permissions:` replaces, not merges with, the workflow-level
  block) — `42a311f`.
- Wired Changesets + OIDC trusted-publisher release flow (no `NPM_TOKEN`)
  for the first public npm release — `aaaed39`.
- **189 tests** across the 4 packages + an integration-tests package that
  loads `buildWdioConfig()` through WDIO 9's real config validator.

### monorepo-toolkit (yarn/npm/pnpm workspace tooling)

Extracted from `monorepo-utils`. Clean extraction — zero runtime coupling to
the source monorepo. Added pnpm-workspace support (source was yarn-only).
**116 tests**, 13 real bugs found and fixed (see LESSONS — the worst one
silently returned wrong paths from `resolvePackageDirs`). `1db5fd5`.

### datadog-metrics-buffer (buffered Datadog metrics client)

Extracted from an internal `datadog` package. **90 tests.** Turned out to be
a fork of the existing MIT-licensed open-source `node-datadog-metrics`
(Daniel Bader) — attribution added to LICENSE + README. See FOLLOWUPS: this
needs a publish/don't-publish decision, not just a technical green light.
`fd1ccd2`.

### babel-preset-forge (curated Babel preset system)

Extracted from `babel-preset-happy`. **143 tests.** Real end-to-end
verification: packed the tarball, installed it into a throwaway project, ran
the documented workflow — caught a missing `api.cache()` call in every README
example that would have broken for every first-time user. `4c65f3d`.

### forgepack (webpack config factory: browser/SSR/library builds)

Extracted from `webpack-happy`, the largest/most-coupled source package (7
internal dependencies). Every dependency resolved (real npm dep, vendored
slice, or reimplemented) — **nothing shipped as a stub.** **75 tests**
including real `webpack()` compiles against fixture projects. `cab4919`.

### sauce-labs-cli (Sauce Labs App Storage + Jobs CLI)

Extracted from a package literally named `jira` that turned out to contain
**zero Jira code** — see LESSONS. Shipped honestly renamed. **206 tests**
from zero, 20+ real bugs fixed (the worst: a naming mismatch meant the
`jobs` subcommand tree silently registered nothing at runtime). Verified
live against the real Sauce Labs API (401 with bad credentials, proving the
transport/auth layer works end to end). `d21ded6`, `7a47de0`.

### cogs (pre-existing personal monorepo)

Added two packages ported from the source monorepo:

- `@cogs/node-pkg` — monorepo-aware binary resolution, **24 tests** — `62f169c`
- `@cogs/browserslist-config` — shared browserslist config + version-floor
  utility, **17 tests** — `abf70e7`

Whole-repo build/test/lint verified green after each addition (16 → 18
packages).

### actionforge (new monorepo: GitHub Actions + supporting libraries)

New repo, scaffolded to match cogs' conventions (pnpm + turbo, TS, biome,
vitest). Extracted from a second proprietary "actions" monorepo (14 custom
GitHub Actions + 14 shared libraries surveyed; 5 libraries + 6 actions
selected as worth extracting, the rest either duplicated well-established
public actions or were dead/broken code).

- 4 libraries: `@actionforge/file-utils`, `@actionforge/git`,
  `@actionforge/nx`, `@actionforge/graph-ns` — **238 tests**, 10 real bugs
  found (worst: nx-affected-detection silently swallowed failures into a
  false-green CI gate) — `4957341`
- `actions/syncpack` — ported composite action, generalized for pnpm — `82e1c4e`
- `actions/yarn` (ported) + `actions/pnpm` (new — genuinely different
  caching design, pnpm's store model isn't yarn's cache model) — `71833a9`
- `actions/eslint` — ported + **new biome engine support**, **87 tests** — `770a709`, `a50d57f`
- `actions/jest` — ported + **new vitest runner support**, **95 tests** — `c8c6af6`, `02944bd`
- `actions/affected` — **entirely new**: turbo/pnpm-based affected-package
  detection replacing the old Nx-specific finder actions, empirically
  verified turbo/pnpm filter-syntax equivalence rather than assuming — `ec0ca54`
- Interface reconciliation: `affected`'s package-name output resolved to the
  `working-folders`/`packages` inputs both `eslint`/`jest` actions expect,
  via a shared resolver added to `@actionforge/file-utils` — `c3dbc75`

## Verification

- Every repo: fresh `build`/`lint`/`typecheck`/`test` run green immediately
  before considering the repo done (not just "tests pass once, ship it").
- Every repo: `grep -ri <source-company-name>` returns zero hits (excluding
  one deliberate provenance sentence in swarmdriver's README).
- swarmdriver specifically: cold Docusaurus site rebuild verified clean, and
  the live GitHub Pages deploy verified green end to end after a permissions
  fix.
- sauce-labs-cli specifically: one live smoke test against the real Sauce
  Labs API (bad-credentials 401) to prove the transport/auth layer, since no
  real credentials were available to verify 2xx payload shapes.
- Not verified anywhere: real npm publish (no package has been published),
  and none of the actionforge GitHub Actions have run inside a real GitHub
  Actions workflow yet — only local bundle-execution smoke tests against
  stubbed GitHub API responses.

## Commits

| SHA | Repo | Message | Pushed? |
|-----|------|---------|---------|
| `0210c46` | swarmdriver | Initial commit: extract wdio-happy into standalone swarmdriver | yes |
| `c726d89` | swarmdriver | Restructure into a TypeScript pnpm monorepo (@caps scope) | yes |
| `551b8e5` | swarmdriver | Add Docusaurus docs site, rewrite docs content, fix 3 real bugs | yes |
| `42a311f` | swarmdriver | fix(ci): grant pages/id-token permissions to the docs build job | yes |
| `aaaed39` | swarmdriver | Wire up Changesets for the first public npm release | yes |
| `1db5fd5` | monorepo-toolkit | feat: initial release of monorepo-toolkit | yes |
| `fd1ccd2` | datadog-metrics-buffer | feat: initial release of datadog-metrics-buffer | yes |
| `4c65f3d` | babel-preset-forge | feat: initial release of babel-preset-forge | yes |
| `cab4919` | forgepack | feat: initial extraction of forgepack | yes |
| `d21ded6` | sauce-labs-cli | chore: scaffold TypeScript CLI foundation | **no** |
| `7a47de0` | sauce-labs-cli | feat: repair and modernize the Sauce Labs CLI | **no** |
| `62f169c` | cogs | feat(node-pkg): add @cogs/node-pkg | yes |
| `abf70e7` | cogs | feat(browserslist-config): add @cogs/browserslist-config | yes |
| `4957341`…`c3dbc75` | actionforge | 9 commits, scaffold through interface reconciliation | yes |

## Out of scope / deferred

- **`atlassian-jira-cli`** — a real Jira REST v3 CLI (issues/JQL/sprints/
  comments). Explicitly deferred as a separate future project once the
  `jira` package turned out to contain no Jira code at all.
- Several surveyed packages/actions were explicitly not extracted per user
  direction: `code-review`, `jest-preset-happy`, `sc-action`,
  `version-action`, `stylelint-action`, `storybook-action`, and everything
  else not named above (~20 packages/actions total were surveyed and
  passed over — see FOLLOWUPS for the reasoning per item if it resurfaces).
- No npm publish anywhere. No real-world GitHub Actions workflow run for any
  of the actionforge actions.
