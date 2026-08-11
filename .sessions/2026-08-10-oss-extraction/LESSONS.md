# Lessons — OSS extraction marathon (2026-08-10)

Durable lessons only — things that change how the next extraction or the
next agent-team session gets approached.

## Executing a built bundle catches bugs unit tests structurally cannot

- **What happened:** Three separate actionforge workers (affected-detection,
  eslint-action, jest-action) each found real, previously-invisible bugs only
  by actually running their bundled `dist/index.js` with realistic
  `INPUT_*`/`GITHUB_*` env vars — not by adding more unit tests.
- **Why:** Unit tests mock the exact layer where these bugs lived: `@actions/core`'s
  `getBooleanInput` throwing on an empty string, an ESM bundle crashing on
  `Dynamic require of "x" is not supported` because a dependency shipped CJS,
  a step-summary write failure aborting the run before the real deliverable
  (the check-run annotations) got published. All three are "the shell that
  tests stub away."
- **How to apply:** For any GitHub Action (or anything else that ships a
  bundled entrypoint), the verification checklist must include *executing
  the built artifact* with representative inputs, not just `build && test`.
  Two workers independently hit the identical ESM/CJS crash and both fixed it
  with the same `createRequire` banner — worth making that banner a default
  part of the bundler config for this project, not a per-action patch.
- **Evidence:** actionforge commits `ec0ca54`, `a50d57f`, `02944bd`.

## A clean install/build can be the only thing that catches a real dependency gap

- **What happened:** swarmdriver's WDIO-9 upgrade reported all green — until
  a later `rm -rf node_modules && pnpm install` from scratch surfaced 16
  `error TS2307/TS2580` from a missing `@types/node` dependency that had
  only ever "worked" because a stale/dirty `node_modules` happened to make
  the types reachable.
- **Why:** Incremental `pnpm install` doesn't always re-validate that every
  package's own dependency list is actually sufficient; a monorepo's hoisted
  `node_modules` can paper over a missing direct dependency indefinitely.
- **How to apply:** Before calling any extraction "done," run the from-scratch
  sequence (`rm -rf node_modules [packages/*/node_modules] && pnpm install`)
  at least once, not just an incremental `pnpm install`.
- **Evidence:** swarmdriver monorepo-restructure Wave C report.

## GitHub Actions job-level `permissions:` REPLACES the workflow-level block, it does not merge

- **What happened:** swarmdriver's docs-deploy workflow had
  `permissions: contents: read` at the workflow level and
  `permissions: pages: write, id-token: write` only on the `deploy` job.
  The `build` job (which runs `actions/configure-pages`) silently only had
  `contents: read` and failed with "Resource not accessible by integration"
  even though GitHub Pages itself was correctly configured.
- **Why:** This is a real, non-obvious GitHub Actions semantic — most people
  assume permissions blocks compose/merge across the workflow and its jobs;
  they don't. A job-level block is a full replacement for that job only.
- **How to apply:** Any job that calls an API needing elevated permissions
  must declare its OWN complete permissions block (including `contents: read`
  if it also checks out code), even if a workflow-level block already lists
  broader permissions.
- **Evidence:** swarmdriver `.github/workflows/docs.yml`, fixed in `42a311f`.

## When a task brief's premise turns out to be wrong, stop and ask — don't guess your way through it

- **What happened:** A package named `jira`, briefed as "an unfinished Jira
  CLI, do a full audit + gap-fill," turned out on inspection to contain zero
  Jira code whatsoever — it was a Sauce Labs CLI copy-pasted into a
  misnamed directory (`SauceCommand` renamed to `JiraCommand`), with a
  README that was itself boilerplate copied from an unrelated third-party
  project.
- **Why:** The worker correctly refused to either (a) "finish" a Jira CLI
  that didn't exist, or (b) silently ship it under a dishonest name. It
  stopped, laid out the evidence, and presented three real options.
- **How to apply:** A worker (human or agent) hitting a load-bearing false
  premise should halt and surface it with evidence rather than rationalizing
  forward. The eventual resolution — "ship what it actually is, honestly
  renamed; defer the thing that was actually requested as its own project" —
  was only possible because it stopped instead of guessing.
- **Evidence:** sauce-labs-cli extraction, worker-jira's first report this
  session.

## "Return empty / swallow the error" is a common, dangerous default in CI-adjacent code

- **What happened:** Independently, in two different codebases this session:
  `buildNxAffectedProjects` swallowed every failure and returned `[]`
  (interpreted downstream as "nothing changed, skip everything" — a CI
  failure silently becomes a false-green skip-all), and
  `isSauceCommentReporter`'s string-match branch compared against the wrong
  literal, silently always returning false.
- **Why:** "Fail soft, return an empty/falsy default" feels safe in the
  moment but is actively dangerous specifically in code that gates whether
  other things run at all.
- **How to apply:** For any function whose result controls whether
  downstream checks run (affected-package lists, feature detection, CI
  gates), prefer throwing/failing loud over returning an empty default. The
  actionforge affected-detection action's `fallback: all|error|none` design
  (default `all`, not silently `none`) is the pattern to reuse.
- **Evidence:** monorepo-toolkit bug #1 (Wave 1 report), swarmdriver's
  `isSauceCommentReporter` fix.

## Verify third-party CLI/API output shapes empirically, not from training-data memory

- **What happened:** Multiple workers explicitly ran the real CLI (Biome
  2.5.7, Vitest 3.2.7, `actions/checkout`/`pnpm/action-setup` current
  majors) before writing a parser or pinning a version, and each time found
  the real behavior differed from a plausible-sounding assumption — Biome's
  `--max-diagnostics` silently truncates at 20 by default; Vitest's coverage
  report is Istanbul-remapped, not a separate v8 format; third-party action
  majors had moved past what would've been assumed from training data.
- **Why:** Session date matters — tools this actively maintained move fast
  enough that "what I remember" is a bad default for anything version- or
  output-shape-sensitive.
- **How to apply:** Before parsing any external tool's output or pinning any
  external action version, run/check it for real in this session rather
  than assuming.
- **Evidence:** actionforge eslint-action and jest-action reports; syncpack
  and yarn/pnpm action version checks via `gh release list`.

## npm blocks unscoped package names for being too *similar* to an existing name, not just exact collisions — and it can't be checked in advance

- **What happened:** `forgepack`'s npm name had been checked via `npm view
  forgepack` (returned 404, i.e. "available") before extraction even
  started. At actual `npm publish` time it failed with a 403: "Package name
  too similar to existing package forge-pack" — an unrelated Solidity/
  blockchain deployer tool that happens to be spelled with a hyphen where
  `forgepack` has none.
- **Why:** npm's anti-squatting heuristic checks *similarity* (edit
  distance / normalized-form collision), not just exact-name availability.
  `npm view <name>` and other pre-publish availability checks only catch
  exact matches; the similarity check only runs server-side at actual
  publish time, so there is no way to verify a candidate name is safe until
  someone actually tries to publish it.
- **How to apply:** Treat a pre-publish `npm view` "available" result as
  necessary but not sufficient for an unscoped package name. Scoped names
  (`@you/thing`) sidestep this entirely — npm's similarity check is a
  top-level-unscoped-namespace concern, so scoping a name is both the
  fastest fix when this happens *and* a reasonable default to prefer
  up front for any name with common-word components (compound words like
  "forgepack" are exactly the shape that collides).
- **Evidence:** forgepack commit `3900305` (rescoped to `@surf/forgepack`
  after the 403).

---

Candidates to promote into long-term memory (if the project has a memory system):

- [ ] Before calling a GitHub Action "done," execute its built `dist/index.js`
      with realistic env vars — unit tests alone miss the Actions-runtime
      integration layer (bad input parsing, ESM/CJS bundling crashes).
- [ ] GitHub Actions job-level `permissions:` replaces the workflow-level
      block for that job; it does not merge with it.
- [ ] When extracting/repairing legacy code and the brief's premise doesn't
      match what's actually in the source, stop and report the mismatch
      with evidence instead of guessing forward.
