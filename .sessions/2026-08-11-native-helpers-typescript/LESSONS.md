# Lessons — Native helpers TypeScript conversion (2026-08-11)

Durable lessons only — things that will change how the next session (or the next project) is approached. Skip anything the code or git history already records.

## Manual inventory of implicit-`any` sites is unreliable — trust the compiler

- **What happened:** The planning draft manually read all 8 files and counted ~30 implicit-`any` parameters. `tsc --noImplicitAny` found 78 — a 2.6x undercount, concentrated in exactly the files the manual read called "small/low-risk" (`web-view.ts` 2→6, `find-strategy.ts` 2→7, `gestures.ts` 7→14, `utils.ts` ~20→47).
- **Why:** Manual reading misses `TS7053` (enum index access), `TS7031` (destructured binding), `TS7023`/`TS7024` (self-recursive functions needing explicit return types), and `TS7016` (untyped npm modules) — categories that don't look like "an untyped parameter" when reading source, but are exactly as blocking under `noImplicitAny`.
- **How to apply:** For any "type this JS-ported file" task, run `tsc --noImplicitAny` (or the target strictness flag) against the real files *before* estimating scope or writing acceptance criteria. Treat the compiler's count as ground truth and the manual read as a first draft.
- **Evidence:** the plan's "Round-1 Review Outcome" section in the (gitignored, local-only) `.omc/plans/native-helpers-typescript-conversion.md`; `packages/core/src/helpers/native/web-view.ts`, `gestures.ts`, `utils.ts`.

## `tsc --showConfig` doesn't echo `files`/`include` on some TypeScript versions

- **What happened:** A planned membership-check command (`tsc --showConfig -p tsconfig.strict.json | grep -c 'helpers/native'`) always returned 0, even when files genuinely were in the config. This wasn't caught until implementation — three separate architect review rounds proposed it, and the actual `tsc` binary silently didn't support the assumption.
- **Why:** This installed TypeScript version's `--showConfig` output includes only `compilerOptions` and `exclude` — not the resolved `files`/`include` list, even though those keys are set explicitly in the config.
- **How to apply:** Use `tsc --listFiles -p <config>` to verify what's actually in a TypeScript program, not `--showConfig`. Verify any "check X via CLI flag" plan step by actually running the command against a real config before relying on it as a gate — a command that silently returns the wrong "success" value is worse than no check at all, because it looks green.
- **Evidence:** `packages/core/scripts/check-strict-gate.mjs` (uses `--listFiles`); the deleted-in-round-4 references to `--showConfig` in the plan.

## An honest union type turns "silent" into "compiler error," on purpose — and that's a design decision, not a bug to route around

- **What happened:** `findEle()` returning `WdioElement | false` (instead of implicitly `any`) immediately broke `tsc` for every file that dereferenced the result without a truthy guard — `picker.ts`, `base.ts`. This looked like the type change "broke" three files.
- **Why:** Those files were always unsafe — `el.click()` on a value that could be `false` was a latent `TypeError` waiting for the right (wrong) test run. The honest type just moved the failure from "someday, at runtime, in CI or on a device" to "now, at compile time, with a file and line number." TypeScript's control-flow narrowing means a plain `if (el) { ... }` needs zero code changes once the type is honest — only genuinely-missing guards need a real fix.
- **How to apply:** When a function starts telling the truth about a `| false`/`| null`/`| undefined` return, don't blanket-fix every downstream call site the same way. Audit each one: if it already narrows (a truthy check, an early return), it needs *nothing* — verify with the compiler, don't "fix" it anyway. Only the genuinely-unguarded sites need a real change.
- **Evidence:** `packages/core/src/helpers/native/utils.ts` (`assertEle`), `gestures.ts` (`checkIfDisplayedWithScrollDown`'s scroll-to-find retry loop — already safe, confirmed unchanged), `picker.ts`/`base.ts` (genuinely unguarded, fixed). See `adr/0001-honest-false-union-over-any-laundering.md`.

## `pnpm install` after adding one devDependency can rewrite unrelated lockfile entries — verify before trusting the diff

- **What happened:** Adding `@types/lodash` as a devDependency (one line in `package.json`) produced a 419-line `pnpm-lock.yaml` diff touching Docusaurus, esbuild, and WDIO peer-dependency resolution strings in completely unrelated workspace packages.
- **Why:** `pnpm install`, even filtered to one workspace package, recomputes peer-dependency resolution hashes for the *entire* lockfile as a side effect. Confirmed via `git stash` + `pnpm install --frozen-lockfile` that the original lockfile was already in sync before this change — the broad diff was purely `pnpm`'s resolution engine computing equally-valid but differently-formatted hashes, not anything meaningfully different being installed.
- **How to apply:** Before committing a lockfile diff that's much larger than the manifest change that supposedly caused it, check whether the *original* lockfile was already frozen-compliant (`pnpm install --frozen-lockfile` on a clean checkout). If it was, the broad diff is noise from the install tool, not a real requirement — revert and hand-add only the minimal entries (one importer devDependency line, one `packages:` resolution block, one `snapshots:` block) rather than accepting the full re-resolution.
- **Evidence:** `pnpm-lock.yaml`'s final diff is 8 lines (`git show 8eaceed -- pnpm-lock.yaml`).

## A scoped-diagnostic gate that passes on "empty output" can't tell "clean" from "not checked" — close that gap explicitly

- **What happened:** The typing ratchet's gate (`tsc | grep -E "helpers/native"` producing no output = pass) would also report a false pass if the config path was wrong, the config was malformed, or — most dangerously — a file was simply forgotten from the `files` allowlist (since `picker.ts`/`carousel.ts`/`alert.ts`/`web-view.ts` aren't transitively reachable from any other file in the ratchet, omitting one means it's silently never checked).
- **Why:** `grep` succeeding on empty output means "no matching line," which is true both when everything is clean and when nothing relevant ran at all.
- **How to apply:** Any grep-filtered "pass on empty output" gate needs a companion assertion that the thing being filtered was actually present in what ran — here, `tsc --listFiles` confirming program membership, plus a check for bare (file-less) `error TS...` lines that indicate a config-level failure rather than a clean per-file result.
- **Evidence:** `packages/core/scripts/check-strict-gate.mjs`; verified by deliberately removing `base.ts` from `tsconfig.strict.json#files`, confirming the script fails with the specific missing-file message, then restoring it.

---

Candidates to promote into long-term memory (if the project has a memory system):

- [ ] For this repo specifically: `tsc --showConfig` does not echo `files`/`include` — use `--listFiles` for any program-membership check.
- [ ] General: when a manual code-read inventory disagrees with a compiler's own count on the same question, trust the compiler — this has now been independently confirmed across 4 review rounds on one file set.
