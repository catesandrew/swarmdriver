# ADR 0003: vendor cross-repo dependencies rather than depend on unpublished sibling packages

- **Status:** accepted
- **Date:** 2026-08-10
- **Deciders:** agent (established as a rule for all parallel extraction workers this session, applied consistently across ~6 separate extractions)

## Context

Several source packages in the two proprietary monorepos depend on other
internal packages that were *also* being extracted in the same session, but
into different destination repos (e.g. `datadog` depended on `node-pkg`,
which went to `cogs`; `babel-preset-happy` depended on both
`browserslist-config` and `node-pkg`, also destined for `cogs`; `forgepack`
depended on 7 internal packages across multiple destinations). Since all
these extractions ran in parallel and none of the destination packages were
published to npm during the session, a real npm dependency on a sibling
extraction's package would not resolve — the build would break for anyone
(including CI) who didn't have that exact local checkout.

## Options considered

1. **Sequence all dependent extractions** — do `node-pkg` first, wait for it
   to publish, then do everything that depends on it. Pros: real, correct
   npm dependencies from day one. Cons: destroys the parallelism that made
   this session's scale possible; a single slow/blocked extraction would
   cascade-block many others.
2. **Vendor the specific slice of logic actually used, for cross-repo
   dependencies; take real `workspace:*` dependencies only within the same
   repo** — each worker investigates exactly which functions/symbols it
   needs from an unavailable sibling package, and inlines just that slice
   (with an attribution comment), rather than the whole package. Pros:
   preserves full parallelism, each repo builds standalone immediately.
   Cons: some short-term code duplication until/unless the sibling package
   is actually published and the vendor code is later swapped for a real
   dependency.
3. **Stub/mock the dependency** — ship a non-functional placeholder for
   anything not yet available. Pros: fastest. Cons: explicitly rejected —
   several worker briefs this session said "report back rather than ship
   something broken" specifically to prevent this outcome.

## Decision

**Vendor the specific slice used, for cross-repo cases; real `workspace:*`
dependency only within the same repo** (option 2). Concretely: `forgepack`
vendored ~90 LOC from `casting` (attributed as derived from the MIT
`react-dev-utils`) and ~180 LOC from `browserslist-config`, but took a real
npm dependency on `@cogs/config` once it was confirmed already published;
`datadog-metrics-buffer` reimplemented `node-pkg`'s bin-proxy pattern in
~190 dependency-free lines rather than vendoring its more complex original
implementation; `@cogs/browserslist-config` took a real `workspace:*`
dependency on `@cogs/node-pkg` since both landed in the same `cogs` repo.

## Consequences

- **Positive:** every extraction this session built and passed its full test
  suite standalone, immediately, with zero cross-repo blocking. Parallelism
  was preserved throughout (up to 6 concurrent extraction workers at once).
- **Negative / cost:** some genuine code duplication now exists across
  repos (e.g. `node-pkg`-derived logic exists in slightly different forms in
  `@cogs/node-pkg`, `datadog-metrics-buffer`, `babel-preset-forge`, and
  `forgepack`). None of this duplication is currently tracked for
  consolidation.
- **Follow-on:** once the `cogs`/`@caps`/`@actionforge` packages are actually
  published to npm, several of these vendored slices are candidates to
  become real dependencies instead — not done this session, not currently
  tracked as a follow-up task anywhere but here.

## Notes

- This rule was stated explicitly in nearly every extraction worker's brief
  this session (swarmdriver, datadog-metrics-buffer, babel-preset-forge,
  forgepack). Search those workers' final reports for "vendor" to find each
  specific instance and its attribution comment.
