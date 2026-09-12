# Architect Review — native-helpers-hardening-followups.md

READ-ONLY review. Every claim below was verified against the compiler or the source, not
against the plan's prose. Instruments used: `pnpm exec tsc --noEmit --noImplicitAny -p
packages/core/tsconfig.json` (98 diagnostics), `pnpm run check:strict` (out-of-scope count
72), `pnpm -F @caps/core test` (265 passed / 10 files).

## Summary

The plan's four-task decomposition and its refusal to change `getProvider()`'s return
contract are both right. But three of four tasks rest on a premise the compiler disproves,
and two of those premises were inherited uncritically from `adr/0002` and `FOLLOWUPS.md`
rather than re-measured. Ground truth: **Task 1's prescribed template leaves 14 `TS7053`
diagnostics standing, not 0** — provable from the two files the plan cites as its own
precedent. **Task 2 targets three files that contain no custom-command declarations at
all**, and its snippet deletes the four global declarations 220 call sites depend on.
**Task 4's guard suppresses the warning for `'saucelabs'`, which is both
`DEFAULT_PROVIDER_NAME` and the only name anything in this workspace registers.**

| Task | Verdict |
|---|---|
| 1 — extend the `noImplicitAny` ratchet to 13 enum files | **REJECTED** (§A, §B, §C) |
| 2 — narrow ambient WDIO globals to module augmentation | **REJECTED** (§D) |
| 3 — evaluate `@wdio/webdriver-mock-service` | **APPROVED WITH FOLLOW-UPS** (§E) |
| 4 — diagnostic warning on silent provider miss | **REJECTED** (§F, §G) |

---

## A. Task 1: the one-line template provably cannot reach zero — proof is in the plan's own precedent files

Task 1's Acceptance Criterion #2 demands "zero `TS7053` diagnostics under `src/enums/`"
after annotating every `props` object `as Record<number, EnumEntry>`. That is unachievable,
and the counterexample is the file the plan names as the pattern to copy.

`packages/core/src/enums/context-ref.ts:20` **already carries** `as Record<number, EnumEntry>`.
It still emits a diagnostic today:

```
src/enums/context-ref.ts(25,29): error TS7053: Element implicitly has an 'any' type because
expression of type 'string' can't be used to index type '{ UNKNOWN: number; NATIVE: number;
WEBVIEW: number; props: Record<number, EnumEntry>; }'.
```

Note the type the compiler prints: `props` is *already* `Record<number, EnumEntry>`. The
error is not on `props`. It is at `context-ref.ts:25` on
`ContextRef[(val as string).toUpperCase()]` — indexing the **enum object itself** with a
`string`. `document-ready-state.ts:30` is identical (1 diagnostic, same shape, annotation
already applied since `8eaceed`).

Every enum file in the plan's list except `scroll-direction.ts` contains that same
enum-object string-index. Measured per-file breakdown of the 72 out-of-scope diagnostics:

| File | Diagnostics today | Fixed by `props` annotation | Residual after plan as written |
|---|---|---|---|
| `appium-app-state.ts` | 6 | 5 | 1 (`:58,35`) |
| `appium-log-level.ts` | 6 | 5 | 1 (`:55,35`) |
| `browser.ts` | 6 | 5 | 1 (`:47,28`) |
| `device.ts` | 6 | 5 | 1 (`:42,27`) |
| `log-level.ts` | 6 | 5 | 1 (`:63,29`) |
| `reporter.ts` | 6 | 5 | 1 (`:52,29`) |
| `sauce-browser.ts` | 6 | 5 | 1 (`:49,33`) |
| `sauce-mac-browser-resolution.ts` | 6 | 5 | 1 (`:48,46`) |
| `sauce-platform.ts` | 6 | 5 | 1 (`:71,34`) |
| `sauce-windows-browser-resolution.ts` | 6 | 5 | 1 (`:54,50`) |
| `service.ts` | 6 | 5 | 1 (`:47,28`) |
| `test-mode.ts` | 4 | 3 | 1 (`:87,27`) |
| `scroll-direction.ts` | **0** | — | 0 |
| `context-ref.ts` (already annotated) | 1 | 0 | 1 (`:25,29`) |
| `document-ready-state.ts` (already annotated) | 1 | 0 | 1 (`:30,37`) |
| **total** | **72** | **58** | **14** |

`72 = 66 + 4 + 1 + 1` reconciles exactly with the gate's logged `ℹ out-of-scope diagnostic
count: 72`, and `98 (package-wide) − 72 = 26` reconciles with the six files unreachable from
`tsconfig.strict.json`'s program. The arithmetic is closed; this is not an estimate.

**Consequence:** the plan ships, Step 5 sets `DOCUMENTED_OUT_OF_SCOPE_BASELINE = 14`,
AC #2 fails, AC #5's "if the out-of-scope count reaches 0" never triggers, and
`adr/0002`'s stated reversibility condition ("would let the gate revert to a plain exit-0
check") remains open. **`adr/0002`'s follow-on paragraph is itself factually wrong** — it
calls the remaining work "mechanical — the same `props: Record<number, EnumEntry>` fix
already applied twice," which is what the plan inherited. Both documents need correcting.

**Required amendment.** The residual site is `Enum[(val as string).toUpperCase()]` inside a
`try`/`catch`, feeding `props[...]`. Two viable fixes, both zero-runtime-change:

1. **Local cast at the index site** (12 files, mechanical, matches the `as string` precedent
   already documented at `enums/types.ts:33-36`):
   ```ts
   return Browser.props[(Browser as Record<string, number>)[(val as string).toUpperCase()]]
   ```
   Caveat the plan must state: `Browser` also has a `props` key, so the cast's value type is
   a lie for that one key (`'PROPS'` would yield the props object, not a number). Runtime is
   unchanged — that path already returns `undefined` and falls through the `try`/`catch` —
   but the assertion is not sound and should carry a one-line comment saying so.
2. **A shared helper in `enums/types.ts`** (preferred — one place to document the unsoundness):
   ```ts
   export const codeToValue = (table: object, key: string): number =>
     (table as Record<string, number>)[key]
   ```
   Then each file becomes `Enum.props[codeToValue(Enum, (val as string).toUpperCase())]`.
   This adds one export to a file already on the public surface (`enums/index.ts:4`), so it
   needs a docblock, but it collapses 12 near-identical casts into one reviewed decision.

Either way, **AC #2 must be restated as a measured target with the residual named**, not as
an aspiration the template cannot meet.

## B. Task 1: the `tsconfig.strict.json` edit is a no-op, and the gate never ratchets the enums

The plan lists `packages/core/tsconfig.strict.json` (`files` array) as a file to modify.
Adding enum files to `files` accomplishes **nothing**. All 14 enum files are already in the
checked program — pulled in transitively by `helpers/native/utils.ts`, which is exactly what
`adr/0002` documents and exactly why the count is 72 rather than 0.

Worse, adding them does not bring them under enforcement. The gate's zero-tolerance filter
is a path-substring match:

```js
// packages/core/scripts/check-strict-gate.mjs:101-103
const scopedDiagnostics = diagnosticLines.filter(
  (line) => line.includes('src/helpers/native/') || line.includes('src/globals.d.ts'),
)
```

`src/enums/*.ts` never matches either substring. So after Task 1, enum diagnostics remain in
the **warn-only** out-of-scope bucket (`check-strict-gate.mjs:110-115`, which only warns on
*growth*). A regression that reintroduces an implicit `any` in `enums/` would still pass the
gate silently — the precise failure the task claims to be closing.

To actually ratchet, Task 1 must extend the filter at `check-strict-gate.mjs:102` to include
`src/enums/`, and add a matching membership assertion. **None of this was in the original
plan.** As written, Task 1 edited the one file that does nothing and left untouched the one
file that would matter.

## C. Task 1: file list off by one, plus collateral effects the original ACs didn't cover

1. **`scroll-direction.ts` has zero diagnostics.** It has no `parse*` helper, no lodash
   import, and no index access anywhere. It produces no `TS7053`. Editing it is a pure
   no-op, and the original Step 2 template would introduce an **unused `EnumInput` import**.
   This is the source of the "13 files" (plan) vs. "12 files" (`FOLLOWUPS.md`; `adr/0002`;
   `check-strict-gate.mjs:38-39`) discrepancy — the plan's number was wrong. Drop it.

2. **Two files outside `src/enums/` are also fixed by the same pattern, uncounted by the
   original ACs.** `src/services/base.ts:170` and `src/services/appium.ts:35` each emit one
   `TS7053` today that the `props` annotation clears. Package-wide count goes 98 → 38 (not
   98 → 40 as a naive "enums only" count would predict).

3. **The published type surface changes.** Both sites feed the inferred return type of an
   exported function; today's emitted declarations say
   `packages/core/dist/types/services/base.d.ts:40: logLevel: any;` and
   `packages/core/dist/types/services/appium.d.ts:15: logLevel: any;`. After the fix they
   become `logLevel: string`. Almost certainly safe (the sibling branch at `base.ts:167`
   already produces `string`), but it *is* an observable public-type change in a published
   package — own it with an explicit AC, don't fold it silently under "no public-API change."

4. **Unflagged: the annotation masks four real data bugs.** `sauce-browser.ts:26-39`,
   `sauce-mac-browser-resolution.ts:25-38`, `sauce-platform.ts:48-61`, and
   `sauce-windows-browser-resolution.ts:31-44` each declare a full set of members (up to
   `SAFARI: 4`, `R2048x1536: 8`, `MAC_OS_10_10: 15`, `R2560x1600: 14`) but a `props` table
   containing only keys `0/1/2` with copy-pasted codes `'UNKNOWN'/'SPEC'/'JUNIT'` from
   `reporter.ts`. `parseSaucePlatform('ios')` returns `undefined` at runtime today. The
   `as Record<number, EnumEntry>` assertion is precisely what tells the compiler "any number
   is a valid key here," permanently removing the only signal that would ever surface this.
   Do not fix it as part of this hardening pass (out of scope, runtime-visible change) — but
   file it, otherwise this pass quietly buries four latent bugs under a green gate.

## D. Task 2 (original): premise false three ways, snippet breaks the build

Read all three target files in full. None of the original task's structural assumptions
survives.

**D1 — No custom-command declarations exist in any of the three files.** What they actually
contain: `packages/core/src/globals.d.ts:19,22,25,28` — four bare globals
(`driver`/`browser`/`$`/`$$`), all typed `any`, **zero methods**.
`packages/providers/src/wdio-globals.d.ts:14-15` — two bare globals, **zero methods**.
`packages/reporters/src/global.d.ts:10-14` — `driver` typed as a structural literal with
`takeScreenshot()`/`getPageSource()`/`capabilities` — standard `WebdriverIO.Browser`
members, not custom commands (the file's own comment says so). There is nothing to move
into a `Browser` augmentation.

**D2 — The overlap assumption is backwards.** Method-name overlap across the three files is
zero. Only `@caps/reporters` names any members at all. The real hazard is not "drift" — it
is **declaration merging**: three packages each declaring
`namespace WebdriverIO { interface Browser }` merge in any consumer that installs more than
one, and divergent signatures produce a hard `TS2717`/`TS2320` in the *consumer's* build. The
original plan proposed no gate for this.

**D3 — `webdriverio` is not a dependency of two of the three packages.** `packages/core`
has it; `packages/providers` and `packages/reporters` do not. For `@caps/reporters` this is
**deliberate and documented** at `global.d.ts:3-4`: "intentionally a dependency-free leaf of
the workspace … so it doesn't pull in `webdriverio`/`@wdio/globals` just to type the
`driver` global." Doing this task there reverses a documented design decision or fakes a
namespace — the exact "hand-rolled parallel interface" the follow-up rules out, merely
relocated.

**D4 — The original Step 2 snippet is a guaranteed build break.** `declare global { namespace
WebdriverIO { interface Browser {} } } ; export {}` augments `Browser` but declares no
`driver`/`browser`/`$`/`$$` global at all. Every one of the 220 `driver.` references becomes
`TS2304`, and `check:strict` fails hard since `globals.d.ts` is in its zero-tolerance filter.

**D5 — Reverses a decision this session deliberately made, with no ADR.** Typing `driver` as
`WebdriverIO.Browser` is Decision B2 from the original conversion plan; B1 (keep loose) was
chosen and affirmed with a verified mechanism (`services/utils.ts#addCommands` adds whole
namespaces at runtime; pinning the base type rejects those calls — documented in-file at
`globals.d.ts:9-15`). `FOLLOWUPS.md` frames the item conditionally ("**if** ever narrowed,
the idiomatic path is…") — a note on *how*, not a mandate to do it now.

## E. Task 3: right direction, wrong framing, unbounded

Verified: `@wdio/webdriver-mock-service@9.30.1` is installed and a real dependency of
`@caps/core`. The premise holds. Corrections:

1. "Run against the real service rather than `vi.stubGlobal`" is a false dichotomy. The
   native helpers read the **globals** `driver`/`$`/`$$`, never an imported browser — so the
   spike still needs `vi.stubGlobal` to wire the mocked session in. The mock service
   replaces *what you stub with* (protocol-level fidelity via a `nock`-backed proxy), not
   *that you stub*.
2. No timebox, no early exit. The setup cost (real session + nock + globals bridging) is the
   open question — a spike that drags past a timebox with no working result is itself a
   valid, recordable "reject."
3. Wrong ADR path for this repo — no `docs/decisions/` directory exists (`docs/` is a
   Docusaurus site). Established convention is
   `.sessions/<session>/adr/000N-kebab-title.md`.

## F. Task 4 (original): the guard silences the exact failure it exists to catch

`packages/core/src/providers/provider.ts:75`: `DEFAULT_PROVIDER_NAME = 'saucelabs'` — not a
sentinel, a real registerable name, and the only one the workspace's shipped provider
actually uses (`packages/providers/src/saucelabs/index.ts:73`).

The original guard `if (name !== DEFAULT_PROVIDER_NAME || listProviders().length > 0)`
fails on exactly the flagship case: `getProvider('saucelabs')` (or
`buildWdioConfig()` with `WDIO_REMOTE=saucelabs`) with an empty registry (provider package
never imported) does **not** warn — silence on the target failure. Root cause: a
default-valued parameter erases "caller passed no argument" vs. "caller passed the default
name," and the guard tries to recover that distinction from `name` alone, which is
impossible.

**Non-breaking fix** (verified against the already-published declaration, which already
reads `(name?: string) => Provider | undefined`):

```ts
export const getProvider = (name?: string): Provider | undefined => {
  const requested = name ?? DEFAULT_PROVIDER_NAME
  if (!Object.hasOwn(providers, requested)) {
    if (name !== undefined || listProviders().length > 0) {
      // warn, naming `requested` and listProviders()
    }
    return undefined
  }
  return providers[requested]
}
```

The diagnostic itself cannot alter the return value either way — confirmed, the `console.warn`
(or logger call) is a pure side effect preceding an unchanged `return undefined`.

## G. Task 4 (original): contradictions and a mis-cited consumer

1. AC said "use the existing logger" (`buildLogger`, actually at `packages/core/src/logger.ts:88`,
   not `utils.ts` as originally cited) while the supplied test snippets and implementation
   snippet all hardcoded `console.warn` — contradictory. `buildLogger()` is already the
   in-package convention (`helpers/native/base.ts:17`, `gestures.ts:17`, etc.) and is
   level-gated by `SWARMDRIVER_LOG_LEVEL` — pick it, and spy on `log.warn` in tests, not
   `console.warn`.
2. `packages/providers/src/services/remote.ts:18` is **not** a `getProvider` consumer — that
   line is the closing brace of a native-helpers import, mis-transplanted from a different
   context in the prior architect review. The actual consumers are `packages/core/src/api.ts:84`
   and `packages/integration-tests/test/api.test.js:175,181`.
3. `@caps/integration-tests` is a real, previously-unlisted consumer:
   `test/api.test.js:181` asserts `getProvider('saucelabs')` returns `undefined` right after
   an explicit unregister — under the fixed guard this becomes an explicit miss and will
   emit a warning into that suite's output. Add `pnpm -F @caps/integration-tests test` to
   verification.
4. The test fixture's `{ name: 'example' } as never` is the same any-laundering
   `adr/0001` argued against — use a minimal object that actually satisfies `Provider`.
5. `registry.test.ts` does not exist yet (create, not extend) — and the registry is
   process-wide global state keyed on `Symbol.for('@caps/core.providers.registry')`, so the
   "empty registry" precondition for one test case needs to be made explicit rather than
   assumed from vitest's file isolation.

## Ordering dependencies (original plan claimed all four independent)

- **Task 1 → Task 1b (hard, new).** The enum-filter/gate-baseline work must land after the
  mechanical `props` annotations, not interleaved with them.
- **Task 3 → Task 2 (soft).** If Task 3 concludes "adopt," that changes the cost/benefit of
  ever narrowing the globals — sequence Task 2's decision-record after Task 3 concludes.
- Task 4 is genuinely independent.

## Disposition — how this plan was revised

Per the recommendations above, the plan at `.omc/plans/native-helpers-hardening-followups.md`
was revised in place:

- **Task 1 split into 1a (mechanical `props` annotation, 12 files, baseline set to the
  measured 14, dist/types diff AC added, `scroll-direction.ts` dropped) and 1b (extend
  `check-strict-gate.mjs`'s zero-tolerance filter to `src/enums/` + add the `codeToValue()`
  helper to close the residual 14) — 1b depends on 1a.**
- **Task 2 replaced** with a decision-record-only task (no code): document why the globals
  are not being narrowed now, capture the correct augmentation shape for if/when they are,
  and flag the cross-package declaration-merging hazard — sequenced after Task 3.
- **Task 3 kept**, reframed per §E (protocol-level fidelity behind `vi.stubGlobal`, half-day
  timebox, ADR path corrected).
- **Task 4 kept**, guard fixed per §F, logger convention fixed per §G, citation corrected,
  `@caps/integration-tests` added to verification, `as never` replaced.
- **A separate bug** was filed for the four sauce-table `props` mismatches (§C4) — out of
  scope for this hardening pass, tracked independently so the annotation work in Task 1a
  doesn't silently bury it.
