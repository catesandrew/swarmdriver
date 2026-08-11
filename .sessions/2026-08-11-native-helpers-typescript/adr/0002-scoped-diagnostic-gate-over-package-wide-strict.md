# ADR 0002: Gate the typing pass on scoped diagnostics, not package-wide `noImplicitAny`

- **Status:** accepted
- **Date:** 2026-08-11
- **Deciders:** session consensus (Architect, round 3), implemented via Ralph, verified by codex Critic

## Context

`packages/core` has 78 implicit-`any` diagnostics inside `helpers/native/` (this conversion's scope) and 125 more elsewhere in the package (enum files, `helpers/browser/`, `services/*` — out of scope for this pass). `tsconfig.strict.json`'s `files` array only bounds the *root* files fed to the compiler — anything a root file imports is pulled into the checked program too. `utils.ts` imports from 14 enum files; this pass fixes the 2 (`context-ref.ts`, `document-ready-state.ts`) that `web-view.ts` itself needs, leaving 12 unfixed. The moment `utils.ts` enters the ratchet's `files`, those 12 files' `TS7053` diagnostics (~72 of them) enter the checked program too — through no fault of anything this pass actually touches.

This makes a plain `tsc -p tsconfig.strict.json` exit-0 gate unachievable without either (a) fixing all 14 enum files now (silently absorbing unrelated scope), or (b) accepting a non-zero exit code as the normal, passing state.

## Options considered

1. **Extend the enum fix to all 14 files so plain exit-0 is literally true.** Pros: the gate stays a simple, familiar "exit code" check. Cons: silently pulls unrelated `packages/core` cleanup into a PR scoped as "convert 8 native helper files" — the kind of scope creep a reviewer should catch, and did (this exact question was one of the plan's explicit Decision points).
2. **Gate on scoped diagnostics** — `tsc`'s raw output filtered to lines under `src/helpers/native/` or `src/globals.d.ts`; empty output = pass, regardless of the raw exit code. Pros: keeps the fix scoped to exactly the 8 files this pass converts; the out-of-scope count is visible (logged) rather than hidden. Cons: a `grep`-on-empty-output check can't distinguish "genuinely clean" from "didn't run at all" — a wrong config path or a file silently missing from `files` both produce empty filtered output and look identical to success.
3. **Abandon the ratchet, rely on manual review.** Already rejected in an earlier round — manual review demonstrably undercounted this exact file set's implicit-`any` surface by 2.6x.

## Decision

**Option 2, hardened.** The gate is "zero diagnostics scoped to `src/helpers/native/` or `src/globals.d.ts`," not raw exit code — implemented in `packages/core/scripts/check-strict-gate.mjs` (`pnpm run check:strict`). To close Option 2's stated con, the script also asserts (via `tsc --listFiles`) that every expected file is actually present in the checked program, and rejects any bare, file-less `error TS...` line (a config-level failure, which would otherwise also produce empty filtered output).

## Consequences

- **Positive:** the pass stays scoped to exactly what it claims to convert; the out-of-scope diagnostic count (72, logged by the script) is a visible, documented fact rather than noise absorbed into "just make CI green"; the gate is machine-verified rather than a person remembering to run the right `grep`.
- **Negative / cost:** `packages/core` as a whole still isn't `noImplicitAny`-clean — a future contributor running `tsc --noImplicitAny` package-wide will still see errors, and needs to know that's expected/tracked, not a regression they introduced.
- **Follow-on:** extending the ratchet to the other 12 enum files (mechanical — the same `props: Record<number, EnumEntry>` fix already applied twice) would let the gate revert to a plain exit-0 check. Tracked in `FOLLOWUPS.md`, not scheduled.

## Notes

- `packages/core/tsconfig.strict.json`, `packages/core/scripts/check-strict-gate.mjs`.
- The negative-path test (removing a file from `files`, confirming the script fails with the specific missing-file message) was run and verified during this session, not just asserted.
