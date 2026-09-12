# Architect Review — native-helpers-typescript-conversion.md

READ-ONLY review. Every claim verified against the compiler or source (ran `tsc --noEmit --noImplicitAny -p packages/core/tsconfig.json`).

## Summary

Plan's process architecture (file-by-file, gated, shared mock convention) is sound, and Decisions B1/C1 are correct. But three load-bearing factual premises are wrong, and file ordering is topologically inverted vs. the module dependency graph. Ground truth: **78 implicit-any sites in `helpers/native`, not the ~30 the plan enumerates**, plus 125 more outside it (203 total, unflagged today only because `strict:false`).

## A. Untyped-surface inventory undercounts 2.6x

| File | Plan claims | Actual |
|---|---|---|
| alert.ts | 1 | 1 ✓ |
| picker.ts | 3 | 3 ✓ |
| web-view.ts | 2 | 6 |
| base.ts | 0 | 0 ✓ |
| carousel.ts | 0 | 0 ✓ |
| find-strategy.ts | 2 | 7 |
| gestures.ts | 5 fns + 2 explicit | 14 |
| utils.ts | ~20 | 47 |
| **total** | ~30 | **78** |

Misses are TS7053 (enum index access), TS7031 (destructured binding), TS7023/7024 (recursive fns no return annotation), TS7016 (untyped npm module — `aria-query` has no types/no @types package). Plan's Acceptance Criterion #1 accepts "manual signature audit" as verification — that method just undercounted by 48 sites on this very plan.

## B. ContextRef numeric-value assumption is wrong, twice

- `switchToContext` (web-view.ts:53) compares `=== ContextRef.NATIVE` — genuinely numeric.
- `findWebviewContext` (web-view.ts:63,68) compares `=== 'native'` and calls `.toLowerCase()` — takes the enum's **string `code`**, not the numeric value. **Different param types**, plan gives them the same one.
- `ContextRef` (enums/context-ref.ts:3-21) is a plain object literal, no `as const`; `ContextRef.WEBVIEW` widens to `number` while `props` has only literal keys → `TS7053` at web-view.ts:31,82 (also `enums/document-ready-state.ts`). Fixing requires editing enum files — outside declared 8-file scope, and same shape repeats across ~13 enum files (source of most of the 125 out-of-scope errors).

## C. findStrategy return type wrong; gestures anys mischaracterized

- `findStrategy` returns `{ using, value }` (find-strategy.ts:271-274), not `string` as the plan's step 6 states. Shipping `: string` breaks the call site at utils.ts:127. Correct: `{ using: string; value: string }` — `using` deliberately stays widened to `string` per existing 12-line comment at find-strategy.ts:24-35.
- `createRoleBaseXpathSelector` calls `aria-query`'s `roleElements.get()` — `aria-query` ships no types, no `@types` package installed → unfixable in-file (TS7016).
- gestures.ts:467-468 explicit `any`s are `reduce()` accumulator annotations, not element-array types as the plan's step 7/Criterion #2 describe. The comment at gestures.ts:461-466 claiming a missing `Promise.resolve(false)` seed is **stale/wrong** — the seed exists at line 490. Real fix: `selectors.reduce<Promise<string | false>>(...)`, zero runtime change — but the stale comment will mislead the implementer into filing a spurious follow-up instead of just fixing it.
- Unmentioned: gestures.ts:451,813 self-recursive `scrollToElements`/`scrollToElement` need explicit return annotations (TS7023/7024).

## D. The `| false` cascade — structural problem, not mentioned in the plan at all

`findEle`/`findEles` (utils.ts:239,247,262 / 299,307,320) return `false` on failure paths; `findEleAndSel` propagates it. Honest types: `Promise<WdioElement | false>`. **13 unguarded dereference sites**: picker.ts:30,47,48,69; base.ts:75; gestures.ts:411,473,823; utils.ts:899,949,1309 (+2 more in gestures scroll paths). `el.isDisplayed()` on `WdioElement | false` is `TS2339` even at `strict:false` (false is a literal type; no strictNullChecks needed).

Plan's step order types `utils.ts` (producer of `findEle` etc.) **last** (step 8), after picker.ts (step 2), base.ts (step 4), gestures.ts (step 7) are already typed/gated/committed. Honestly typing `findEle` at step 8 breaks all three already-committed files. None of the three escape routes (swallow-and-any-launder / add narrowing guards at 13 sites = behavior change / `as WdioElement` cast at 13 sites) is chosen in advance.

## E. File ordering is topologically inverted

Actual dependency DAG: `find-strategy.ts` ← `utils.ts` ← {`base.ts`, `picker.ts`, `gestures.ts`}. Plan orders every consumer before its producer (ascending line count). Five of eight files' annotations are downstream guesses until `utils.ts`/`find-strategy.ts`'s shared vocabulary (`findEle`, `findEles`, `findEleAndSel`, `buildSelector`, `findStrategy`) is fixed.

Also: base.ts/carousel.ts are confirmed zero-error — those steps are pure test-authoring, not type+test+gate steps. `base.ts` (exercises `driver.waitUntil` + `findEleAndSel` + element `isDisplayed`) is a better proving ground for the shared mock helper than `alert.ts` (only needs `$` + `driver.isAndroid/isIOS` — under-specifies what the other 7 files need). `web-view.ts` should move late, not to step 3 — it forces an out-of-scope enum change.

## F. Build/tooling defects

1. Shared mock helper at `src/helpers/native/__test-helpers__/wdio-mocks.ts` is NOT excluded by `tsconfig.build.json` (`exclude` only covers `src/**/*.test.ts`) → ships in `dist/types`, a declaration file referencing `vitest` (a devDependency), in a package that just started publishing (`package.json#files` includes `dist`).
2. `packages/core/tsconfig.json#include` is `src/**/*.ts` — test files ARE inside the tsc gate. No `vitest/globals` type reference anywhere in repo; existing precedent (`utils.test.ts:1`) uses explicit `import { describe, it, expect } from 'vitest'`. Plan's Decision C1 cites `globals: true` as a Pro — misleading; must mandate explicit imports.
3. Verification step 4's hedge ("if one exists") resolves definitively: `packages/providers/src/services/remote.ts:18` imports `nativeUtils, nativeGestures, nativeAlert, nativePicker, nativeWebView` from `@caps/core/helpers`. Add `pnpm -F @caps/providers build` to final gate. `services/utils.ts#addCommands` iterates namespaces generically, so narrowed signatures are safe there.

## Consensus Addendum

### Antithesis on Decision A (steelman for flipping to A1 now, scoped)

1. A2's verification method (manual audit) already failed 2.6x on this document — Criterion #1 ("zero implicit any") is unfalsifiable without a compiler-backed instrument.
2. A2's stated Pro ("scope stays exactly 8 files") is not actually true of A2 — scope is controlled by tsconfig `include`/`files`, not by leaving the flag off. A `files: [...]` allowlist has *smaller* blast radius than A2's aspiration-only containment.
3. A2's stated Con is fatal and underrated: it doesn't just fail to prevent *future* regression, it fails to detect *present* incompleteness (the 48 missed sites).
4. Measured cost of A1 is bounded, not open-ended: 23 of 125 out-of-scope errors are `TS7016` on 2 modules (`@types/lodash` + a 5-line `aria-query` shim — needed anyway since both are in-scope-adjacent), ~84 are one repeated `TS7053` enum pattern across ~13 files (mechanical `props: Record<number, EnumEntry>`), residual ~18 are genuine (mostly `helpers/browser/utils.ts` and `services/*`, out of this plan's file list).
5. Deferring costs more than doing now: the `| false` cascade (§D) gets discovered at step 8 under A2, after 3 dependent files are already committed. A ratchet surfaces it at step 0/1, once, deliberately.
6. Follow-ups filed against `strict:false` codebases rarely get done — no forcing function once this pass ships.

Steelman stops short of justifying full `strict:true` (pulls in strictNullChecks — floods with `null` sites and reopens `catch` `err.name` typing) or flipping the repo-wide `tsconfig.base.json`. Justifies only: `noImplicitAny` via a growing `files:[]` allowlist (`tsconfig.strict.json`), starting at step 0.

On B: **B1 correct**, verified mechanism (`services/utils.ts:3-24 addCommands` does `device.addCommand(key, libs[i][key])` over namespaces — pinning base type would reject those). But plan frames B2 as a strawman ("hand-rolled parallel interface"); the idiomatic WDIO answer is `declare global { namespace WebdriverIO { interface Browser {...} } }` module augmentation (which `globals.d.ts:15`'s own comment already recommends) — if B2 is ever revisited, the ADR follow-up should say that, not the strawman.

On C: **C1 correct**, but missed **Option C3**: `@wdio/webdriver-mock-service` is already a dependency of `@caps/core` — encodes WDIO's actual protocol surface rather than the team's belief about it. Worth a line in Viable Options, especially given Risk #2 is exactly "we get the mock wrong and it propagates to 8 files."

### Tradeoff tension underweighted

**The plan can satisfy every acceptance criterion while producing ~zero type safety gain, because `WdioElement`/`Selector` are index-signature `any`-equivalent one property access deep**, and the tests being written in the same pass use a hand-rolled mock of that same `any` surface (Decision C1) — so compiler and test suite share one point of failure (same author's mental model, same direction of error). The **one** place honest types would catch a real latent bug is §D (picker.ts:30-32 throws `TypeError: listViewEl.click is not a function` today whenever a picker row isn't found) — but Principle 1 ("no behavior changes") as currently written forbids acting on it. The plan never names this collision, so never decides what happens when Principle 1 and Criterion #1 collide — they collide at step 8.

### Synthesis (4 adjustments, preserves incremental/gated character)

**S1 — Add Step 0** (~0.5 day): `@types/lodash` + `aria-query` d.ts shim; `packages/core/tsconfig.strict.json` (`extends: tsconfig.json`, `noImplicitAny: true`, `files: []`) as a growing per-file allowlist — this becomes the per-file gate (machine-checked, replaces "manual signature audit"); fix `enums/context-ref.ts` + `enums/document-ready-state.ts` (`props: Record<number, EnumEntry>`, no runtime change); **decide the `| false` policy once, in writing** — recommended: type honestly as `Promise<WdioElement | false>` and add one exported `assertEle(el, selector): WdioElement` helper that throws on `false` at the 13 call sites (amend Principle 1 to allow explicit failure-path errors where the current code throws a `TypeError` one line later anyway); fallback if rejected: `as WdioElement` casts + a follow-up ticket, decided now not discovered at step 8.

**S2 — Reorder by DAG position**: find-strategy.ts → utils.ts → gestures.ts → base.ts → picker.ts → carousel.ts → web-view.ts → alert.ts. Front-loads shared vocabulary so no later step invalidates an earlier commit. Minimum-viable variant if full reorder is unacceptable: keep smallest-first for tests, but pull the ~5 cross-file signatures into Step 0 as a signatures-only change.

**S3 — Build the mock helper against `base.ts`, not `alert.ts`** (exercises `driver.waitUntil` + `findEleAndSel` + element `isDisplayed` — the actual shape the other 7 need). Add Option C3 (`@wdio/webdriver-mock-service`) alongside C1.

**S4 — Correct factual errors + close tooling gaps**: fix gestures.ts:461-466 stale comment; restate Criterion #2 as `reduce<Promise<string | false>>`; restate step 6 as `findStrategy(selector?: string): { using: string; value: string }`; split step 3 into `switchToContext(context: number)` / `findWebviewContext(context: string)`; add `tsconfig.build.json#exclude` for `__test-helpers__/**`; mandate explicit vitest imports (delete `globals: true` as a C1 Pro); add `pnpm -F @caps/providers build` to final gate, resolve the "if one exists" hedge.

### Principle violations flagged
- Principle 1 vs Criterion #1: **high** — unresolvable at the 13 `| false` sites without laundering or an amendment (S1).
- Principle 2 (reuse before invent): **medium** — `WdioElement`/`Selector` reuse is sound but partially means "reuse an escape hatch" (any-equivalent); `ContextRef` isn't reusable as-is (TS7053).
- Principle 4 (gated progression): **high** — violated in effect; steps 2/4/7 invalidated by step 8 under current ordering.
- Principle 5 (mock helper in smallest file): **low/medium** — "smallest" is the wrong selection axis; "most representative" (base.ts) is right.
- Criterion #1's "manual signature audit" fallback: **high** — empirically unreliable (48 missed sites); S1's ratchet replaces it.

## Recommendations (prioritized)
1. Add Step 0 (ratchet + shims + enum fix + written `| false` policy) — ~0.5 day, unblocks the two largest files, makes Criterion #1 falsifiable.
2. Flip Decision A to A1-scoped via the ratchet (included in Step 0) — measured cost 2 dependency edits + mechanical enum fixes, not 125 unbounded errors.
3. Reorder by DAG position (S2), or at minimum extract the 5 cross-file signatures into Step 0.
4. Correct the three factual errors (S4) — re-derive per-file effort from the 78-site measurement, not the ~30-site estimate.
5. Move mock-helper authoring to base.ts (S3), add C3 to options.
6. Close the two build gaps (S4) and extend final gate to `@caps/providers`.
