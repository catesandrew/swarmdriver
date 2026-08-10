# ADR 0002: actionforge as one monorepo, not per-piece repos or folding into cogs

- **Status:** accepted
- **Date:** 2026-08-10
- **Deciders:** session user (explicit choice via AskUserQuestion), agent recommended

## Context

The GitHub-Actions-tooling extraction produced 10 pieces: 4 supporting
libraries (`action-file-utils`, `action-git`, `action-nx`, `graph-ns`) and 6
GitHub Actions (syncpack, yarn, a new pnpm action, eslint+biome, jest+vitest,
a new affected-detection action). Several of the actions genuinely need the
libraries at build/runtime (e.g. `eslint`/`jest` actions consume
`@actionforge/file-utils`). A repo-structure decision was needed before any
extraction work could start.

## Options considered

1. **One new actions-focused monorepo** — libraries + actions together,
   mirroring the source monorepo's own shape and the already-existing
   `cogs` monorepo's conventions (pnpm + turbo, TS, biome, vitest). Pros:
   actions consuming libraries is a simple `workspace:*` dependency, no
   cross-repo vendoring dance. Cons: yet another monorepo to maintain.
2. **Libraries into `cogs`, actions in a separate new repo** — matches how
   `node-pkg`/`browserslist-config` were folded into `cogs` earlier in the
   session. Pros: fewer repos overall, libraries benefit from cogs' existing
   infra (changesets, CI). Cons: actions would need real npm dependencies on
   published `@cogs/*` packages, reintroducing the "can't depend on an
   unpublished sibling package" vendoring problem that every other
   cross-repo extraction this session had to work around.
3. **Separate repo per piece** — swarmdriver-style, 7-8 standalone repos.
   Pros: maximum independence. Cons: most fragmented, most publish/version
   overhead for pieces that are inherently a matched set (an eslint action
   without its shared annotation-reporting library isn't useful alone).

## Decision

**One new monorepo, `actionforge`** (option 1). Rationale given by the user:
avoids the cross-repo dependency headaches every other extraction this
session had to solve with vendoring; matches how the *source* material was
already organized (a monorepo of actions + their shared libraries), so the
repo shape maps cleanly onto the domain.

## Consequences

- **Positive:** Wave 2 workers (the 6 actions) could take real `workspace:*`
  dependencies on Wave 1's libraries with zero vendoring — this is the one
  extraction this session where a consuming piece didn't need a cross-repo
  workaround.
- **Negative / cost:** `dist/` (compiled action bundles) has to be committed
  to git for the JS actions, unlike the npm-published libraries where `dist/`
  is gitignored — a real convention split within one repo (`packages/*` vs
  `actions/*`) that has to be documented clearly (it is, in
  `actions/README.md`) or a new contributor will get it wrong.
- **Follow-on:** the shared root `ci.yml` was written once early and still
  pins `@v4` for some third-party actions while later-added actions verified
  and used current majors (`@v6`/`@v7`) — a real inconsistency flagged
  during Wave 2 review, not yet fixed. See FOLLOWUPS.md.

## Notes

- Repo scaffolded in actionforge commit `4957341`.
- The `packages/*` (npm-published) vs `actions/*` (GH-Actions-consumed,
  `dist/` committed) split, and its `.gitignore` implication
  (`!actions/*/dist/`), is documented in `actions/README.md`.
