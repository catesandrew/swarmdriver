# Session: OSS extraction marathon — 2026-08-10

> Resume pointer + index for this session's dossier. Read this first.
>
> **This session spans 8 separate git repos, not just this one.** swarmdriver
> hosts the dossier because it was the first and most-iterated-on deliverable,
> but `SUMMARY.md` covers all 8.

## State in one paragraph

Eight personal open-source repos were extracted/built this session from two
proprietary employer monorepos (a frontend-tooling monorepo and a
GitHub-Actions-tooling monorepo), using parallel AI agent teams per repo. All
8 repos are locally committed and fully verified (build/lint/test green,
zero references to the source company). 7 of 8 are pushed to GitHub
(confirmed via `git ls-remote` — pushed outside this conversation, by the
user, between status updates). The 8th (`sauce-labs-cli`) has an empty
GitHub repo created but nothing pushed yet. **No npm package has been
published anywhere** — every repo is GitHub-only so far.

## Resume prompt (paste into a new session)

```
Resume the OSS-extraction work. Read
/Volumes/dev-ssd/repos/personal/swarmdriver/.sessions/2026-08-10-oss-extraction/README.md
and FOLLOWUPS.md.
State: 8 repos built and verified, 7/8 pushed to GitHub, 0/8 published to npm.
Next action: push sauce-labs-cli (or confirm it should stay local), then decide
on the datadog-metrics-buffer fork-attribution question in FOLLOWUPS.md, then
run `pnpm release` in swarmdriver for its first public npm publish.
```

## Repo state

| Repo | Branch | Last commit | Committed? | Pushed? | Notes |
|------|--------|-------------|-----------|---------|-------|
| [swarmdriver](https://github.com/catesandrew/swarmdriver) | main | `aaaed39` Wire up Changesets for the first public npm release | yes | **pushed**, in sync | Docs site live at catesandrew.github.io/swarmdriver. `pnpm release` not yet run — no npm publish. |
| [monorepo-toolkit](https://github.com/catesandrew/monorepo-toolkit) | main | `1db5fd5` feat: initial release | yes | **pushed**, in sync | Not published to npm. |
| [datadog-metrics-buffer](https://github.com/catesandrew/datadog-metrics-buffer) | main | `fd1ccd2` feat: initial release | yes | **pushed**, in sync | ⚠ Turns out to be a fork of an existing MIT OSS package — see FOLLOWUPS. Not published to npm. |
| [babel-preset-forge](https://github.com/catesandrew/babel-preset-forge) | main | `4c65f3d` feat: initial release | yes | **pushed**, in sync | Not published to npm. |
| [forgepack](https://github.com/catesandrew/forgepack) | main | `cab4919` feat: initial extraction | yes | **pushed**, in sync | Not published to npm. |
| [sauce-labs-cli](https://github.com/catesandrew/sauce-labs-cli) | main | `7a47de0` feat: repair and modernize | yes | **NOT pushed** (empty GH repo exists, `size: 0`) | Extracted from a package literally named "jira" that contained zero Jira code — see LESSONS. |
| [cogs](https://github.com/catesandrew/cogs) | main | `abf70e7` feat(browserslist-config) | yes | **pushed**, in sync | Pre-existing monorepo; this session added `@cogs/node-pkg` + `@cogs/browserslist-config` on top of prior history. |
| [actionforge](https://github.com/catesandrew/actionforge) | main | `c3dbc75` feat(eslint,jest): resolve affected-packages | yes | **pushed**, in sync | New monorepo, 4 libraries + 6 GitHub Actions. Not published to npm. |

## Read first (rebuilds context fastest)

1. `SUMMARY.md` — what changed, per repo, with commit SHAs
2. `FOLLOWUPS.md` — what's left, especially the "blocked on user" section
3. `LESSONS.md` — the recurring bug patterns worth knowing before touching any of these repos again
4. `adr/0001-provider-registration-pattern.md` — the trickiest architecture decision (swarmdriver's core↔providers circular dependency)

## First action

Push `sauce-labs-cli` (or explicitly decide it should stay unpublished), then
resolve the `datadog-metrics-buffer` fork-attribution question in
`FOLLOWUPS.md` before anyone runs `npm publish`/`pnpm release` anywhere.

## Dossier contents

- `SUMMARY.md` — what was done, per repo
- `LESSONS.md` — recurring bug patterns and process lessons
- `adr/` — the 3 substantial architecture decisions made this session
- `FOLLOWUPS.md` — open items
- `BLOG.md` — public write-up (⚠ review before publishing — check sanitization)
