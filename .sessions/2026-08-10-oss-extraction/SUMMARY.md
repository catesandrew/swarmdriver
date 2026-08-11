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
- Update: real npm publish now verified for 7/8 repos (see "Update" section
  below) — the one item above that was unverified is resolved.
- Still not verified anywhere: none of the actionforge GitHub Actions have
  run inside a real GitHub Actions workflow yet — only local bundle-execution smoke tests against
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
| `d21ded6` | sauce-labs-cli | chore: scaffold TypeScript CLI foundation | yes |
| `7a47de0` | sauce-labs-cli | feat: repair and modernize the Sauce Labs CLI | yes |
| `62f169c` | cogs | feat(node-pkg): add @cogs/node-pkg | yes |
| `abf70e7` | cogs | feat(browserslist-config): add @cogs/browserslist-config | yes |
| `4957341`…`c3dbc75` | actionforge | 9 commits, scaffold through interface reconciliation | yes |
| `7acd998` | swarmdriver | refactor: move Sauce Jobs REST client into @caps/core | yes |
| `167a869` | swarmdriver | docs: add initial CHANGELOG.md for the four publishable packages | yes |
| `d2214cc` | monorepo-toolkit | chore: add Changesets for release management | yes |
| `e1133ea` | datadog-metrics-buffer | docs: expand fork section with concrete differences | yes |
| `a0e2c79` | babel-preset-forge | chore: set up changesets and hand-write initial CHANGELOG | yes |
| `63d1830` | forgepack | chore: set up changesets and initial CHANGELOG | yes |
| `3900305` | forgepack | fix: publish as @surf/forgepack, npm blocked the unscoped name | yes |
| `41f1b13` | sauce-labs-cli | chore: set up Changesets and add initial CHANGELOG | yes |
| `39c5c1f` | cogs | docs(changelog): add initial CHANGELOG.md for node-pkg and browserslist-config | yes |
| `5105d31` | actionforge | docs: add initial CHANGELOG.md for the 4 publishable packages | yes |
| `88fa5ac` | actionforge | fix(ci): bump checkout/setup-node/pnpm-action-setup to current majors | yes |

## Update — cleanup + first publish round (same day)

After the initial extraction pass, three more things happened:

1. **Fixed the `@caps/providers` → `@caps/cli` dependency inversion**
   flagged in `adr/0001-provider-registration-pattern.md`. Split
   `packages/cli/src/jobs/{edit,info,list}.ts` (each mixed a pure REST-call
   function with a Commander command registrar) — moved the pure REST
   client + its URL/auth-header helpers into `@caps/core/sauce`, kept the
   Commander registrars in `@caps/cli` importing from core.
   `@caps/providers` now depends only on `@caps/core` + `@caps/reporters`,
   no circular-ish dependency remains. Verified byte-identical HTTP request
   shapes before/after (stubbed `fetch`, compared URLs/headers/bodies). One
   real behavior change surfaced along the way: `browser.getJob()`/
   `updateJob()` (WebdriverIO custom commands) now resolve to the parsed
   job object instead of a pretty-printed JSON string — documented in
   `@caps/providers`' new CHANGELOG.md, not treated as breaking (pre-1.0,
   unreleased). `7acd998`.
2. **Fixed actionforge's `ci.yml` action-version inconsistency** —
   `actions/checkout`, `actions/setup-node`, `pnpm/action-setup` bumped from
   `@v4` to current majors (`@v7`/`@v7`/`@v6`, confirmed via
   `gh api repos/<owner>/<repo>/releases/latest`), matching what
   `actions/pnpm` and `actions/yarn` already verified and used. `88fa5ac`.
3. **Wired Changesets + a real initial CHANGELOG.md into every repo that
   lacked one** (monorepo-toolkit, babel-preset-forge, forgepack,
   sauce-labs-cli, cogs's 2 new packages, actionforge's 4 libraries,
   swarmdriver's 4 packages) — hand-written, not `changeset version`-
   generated, since none of these had ever been published (nothing to diff
   a version bump from). Versions left as-is everywhere.

Then the user did the **first public npm publish round manually**
(`npm login` + `npm publish`/`pnpm publish`, per their own choice to do this
step themselves before setting up OIDC). Results: swarmdriver, monorepo-toolkit,
babel-preset-forge, and sauce-labs-cli published cleanly on the first try.
`forgepack` failed with a 403 — npm's name-similarity anti-squatting check
blocked the unscoped name `forgepack` as "too similar to existing package
`forge-pack`" (an unrelated Solidity/blockchain tool). Fixed by rescoping to
`@surf/forgepack` (one of the user's own available npm scopes) — see
LESSONS.md, this can't be checked in advance via `npm view`, only discovered
at actual publish time. Retried and published clean. `actionforge` also
initially failed — the user didn't already own the `actionforge` npm org
scope — resolved by claiming it, then all 4 `@actionforge/*` libraries
published. `cogs`'s 2 new packages published without issue. `3900305`
(forgepack rescope fix).

**Final state: 7 of 8 repos published to npm.** `datadog-metrics-buffer`
remains deliberately unpublished pending the fork-of-existing-OSS decision.

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
