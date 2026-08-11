# Session: OSS extraction marathon — 2026-08-10

> Resume pointer + index for this session's dossier. Read this first.
>
> **This session spans 8 separate git repos, not just this one.** swarmdriver
> hosts the dossier because it was the first and most-iterated-on deliverable,
> but `SUMMARY.md` covers all 8.

## State in one paragraph

Eight personal open-source repos were extracted/built from two proprietary
employer monorepos (a frontend-tooling monorepo and a GitHub-Actions-tooling
monorepo), using parallel AI agent teams per repo. All 8 repos are pushed to
GitHub, fully verified (build/lint/test green, zero references to the source
company). A follow-up cleanup pass fixed a real architecture wart
(`@caps/providers` no longer depends on `@caps/cli`) and an action-version
inconsistency, then wired Changesets + a real initial CHANGELOG.md into
every repo that lacked one. **7 of 8 repos are now published to npm** —
swarmdriver (`@caps/*`), monorepo-toolkit, babel-preset-forge, sauce-labs-cli,
`@surf/forgepack` (renamed after an npm name-similarity block), `@actionforge/*`
(4 libraries), and `@cogs/node-pkg` + `@cogs/browserslist-config`. The 8th,
`datadog-metrics-buffer`, is deliberately unpublished — it's a fork of an
existing OSS package, documented honestly as such, publish decision still
open.

## Resume prompt (paste into a new session)

```
Resume the OSS-extraction work. Read
/Volumes/dev-ssd/repos/personal/swarmdriver/.sessions/2026-08-10-oss-extraction/README.md
and FOLLOWUPS.md.
State: 8 repos built, verified, and pushed. 7/8 published to npm.
datadog-metrics-buffer deliberately unpublished (fork-of-OSS question, see
FOLLOWUPS.md). Next action: set up OIDC trusted publishing on npmjs.com for
each repo's release.yml, so future releases don't need a manual npm publish.
```

## Repo state

| Repo | Branch | Last commit | Pushed? | Published to npm? | Notes |
|------|--------|-------------|---------|--------------------|-------|
| [swarmdriver](https://github.com/catesandrew/swarmdriver) | main | `167a869` docs: add initial CHANGELOG.md | pushed, in sync | ✅ `@caps/core`/`providers`/`reporters`/`cli` | Docs site live at catesandrew.github.io/swarmdriver. `@caps/providers` no longer depends on `@caps/cli` (fixed, `7acd998`). |
| [monorepo-toolkit](https://github.com/catesandrew/monorepo-toolkit) | main | `d2214cc` chore: add Changesets | pushed, in sync | ✅ | |
| [datadog-metrics-buffer](https://github.com/catesandrew/datadog-metrics-buffer) | main | `e1133ea` docs: expand fork section | pushed, in sync | ⏸ deliberately unpublished | Fork of `node-datadog-metrics`, documented explicitly with a differences table. |
| [babel-preset-forge](https://github.com/catesandrew/babel-preset-forge) | main | `a0e2c79` chore: set up changesets | pushed, in sync | ✅ | |
| [forgepack](https://github.com/catesandrew/forgepack) | main | `3900305` fix: publish as @surf/forgepack | pushed, in sync | ✅ `@surf/forgepack` | npm blocked the unscoped `forgepack` name (too similar to an unrelated `forge-pack` Solidity tool) — rescoped, see LESSONS. |
| [sauce-labs-cli](https://github.com/catesandrew/sauce-labs-cli) | main | `41f1b13` chore: set up Changesets | pushed, in sync | ✅ | |
| [cogs](https://github.com/catesandrew/cogs) | main | `39c5c1f` docs(changelog) | pushed, in sync | ✅ `@cogs/node-pkg`, `@cogs/browserslist-config` | Pre-existing monorepo; this session's 2 additions only. |
| [actionforge](https://github.com/catesandrew/actionforge) | main | `88fa5ac` fix(ci): bump action versions | pushed, in sync | ✅ `@actionforge/*` (4 libraries) | User grabbed the `actionforge` npm org scope during publish (didn't already own it). The 6 GitHub Actions are not npm-published (by design — versioned via git tags). |

## Read first (rebuilds context fastest)

1. `SUMMARY.md` — what changed, per repo, with commit SHAs
2. `FOLLOWUPS.md` — what's left, especially the "blocked on user" section (OIDC setup, datadog-metrics-buffer)
3. `LESSONS.md` — recurring bug patterns, plus the npm name-similarity gotcha
4. `adr/0001-provider-registration-pattern.md` — the trickiest architecture decision (now fully resolved, including the `@caps/cli` dependency inversion)

## First action

Set up OIDC trusted publishing on npmjs.com for each published repo's
`release.yml` (swarmdriver's is already wired for it — `id-token: write`, no
`NPM_TOKEN` — the other repos' `release.yml`s need the same treatment), so
future version bumps publish automatically instead of requiring a manual
`npm publish` per repo.

## Dossier contents

- `SUMMARY.md` — what was done, per repo
- `LESSONS.md` — recurring bug patterns and process lessons
- `adr/` — the 3 substantial architecture decisions made this session
- `FOLLOWUPS.md` — open items
- `BLOG.md` — public write-up (⚠ review before publishing — check sanitization)
