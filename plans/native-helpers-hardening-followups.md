# Native Helpers Hardening Follow-ups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use beads-superpowers:subagent-driven-development (recommended) or beads-superpowers:executing-plans to implement this plan task-by-task. Each Task becomes a bead (`bd create -t task --parent <epic-id>`). Steps within tasks use checkbox (`- [ ]`) syntax for human readability.

**Revision note:** this plan was rejected on first architect review (`.omc/plans/native-helpers-hardening-followups.architect-review.md`) and revised in place. Original Task 1 is split into 1a/1b; original Task 2 is replaced with a decision-record task; Task 3 is reframed; Task 4's guard is corrected. See the review file for the full compiler-verified proof of each defect.

**Goal:** Close out the follow-ups left open by the native helpers TypeScript conversion (`8eaceed`, see `.omc/plans/native-helpers-typescript-conversion.md` and `.sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md`), without reopening or weakening anything that pass already shipped, and without silently burying newly-discovered defects under a green gate.

**Architecture:** Five tasks against `packages/core` (Task 4 also touches nothing else; Task 2 touches no `packages/providers`/`packages/reporters` code, only a decision record). Task 1b depends on Task 1a (same file, sequential edits to the same gate script). Task 2 depends on Task 3 (Task 3's outcome changes Task 2's cost/benefit). Task 4 is independent of everything else.

**Tech Stack:** TypeScript 5.x (project references), vitest, pnpm workspaces.

## Global Constraints

- Zero explicit `any` introduced (matches the conversion pass's own bar) — including test fixtures; no `as never` laundering (see `adr/0001-honest-false-union-over-any-laundering.md`).
- No runtime behavior change to `@caps/core`'s public API unless a task's Acceptance Criteria explicitly calls it out as an intentional, documented change.
- `pnpm -F @caps/core build`, `pnpm -F @caps/core test`, and `pnpm run check:strict` must stay green after every task.
- Follow existing repo conventions: `EnumEntry`/`EnumInput` typing pattern already established in `context-ref.ts` and `document-ready-state.ts`; the package's logging convention is `buildLogger()` (`packages/core/src/logger.ts`), not bare `console.*`.
- ADR path for this repo is `.sessions/<session>/adr/000N-kebab-title.md` — there is no `docs/decisions/` directory here (`docs/` is the Docusaurus site).

---

### Task 1a: Annotate `props` typing on the 12 enum files that actually have diagnostics

**Files:**
- Modify: `packages/core/src/enums/appium-app-state.ts`
- Modify: `packages/core/src/enums/appium-log-level.ts`
- Modify: `packages/core/src/enums/browser.ts`
- Modify: `packages/core/src/enums/device.ts`
- Modify: `packages/core/src/enums/log-level.ts`
- Modify: `packages/core/src/enums/reporter.ts`
- Modify: `packages/core/src/enums/sauce-browser.ts`
- Modify: `packages/core/src/enums/sauce-mac-browser-resolution.ts`
- Modify: `packages/core/src/enums/sauce-platform.ts`
- Modify: `packages/core/src/enums/sauce-windows-browser-resolution.ts`
- Modify: `packages/core/src/enums/service.ts`
- Modify: `packages/core/src/enums/test-mode.ts`
- Modify: `packages/core/src/services/base.ts:170` (same `TS7053` pattern, outside `src/enums/`)
- Modify: `packages/core/src/services/appium.ts:35` (same `TS7053` pattern, outside `src/enums/`)
- Modify: `packages/core/scripts/check-strict-gate.mjs` (`DOCUMENTED_OUT_OF_SCOPE_BASELINE` only — set from a measurement, not a guess)
- Do NOT modify: `packages/core/src/enums/scroll-direction.ts` — verified zero diagnostics, no `parse*`/index-access pattern present; touching it only adds an unused import.
- Reference (already-fixed precedent, do not modify): `packages/core/src/enums/context-ref.ts`, `packages/core/src/enums/document-ready-state.ts`
- Do NOT modify in this task: `packages/core/tsconfig.strict.json` — architect review proved this file's `files` array is a no-op for this work (all enum files are already transitively included via `helpers/native/utils.ts`); do not add enum files to it.

**Interfaces:**
- Consumes: `EnumEntry` type from `packages/core/src/enums/types.ts` (already exists, used by `context-ref.ts`).
- Produces: no new exports — same enum object shapes, `props` typed `Record<number, EnumEntry>` instead of implicitly-`any`.

**Acceptance Criteria:**
- Every file listed above has its `props` object annotated `as Record<number, EnumEntry>`, matching the pattern already committed in `context-ref.ts`.
- The residual 14 `TS7053` diagnostics documented in the architect review (§A) — one enum-object string-index site per file, present even in the already-annotated `context-ref.ts`/`document-ready-state.ts` — are **expected and accepted** for this task; do not attempt to eliminate them here (that is Task 1b).
- `pnpm run check:strict` logs an out-of-scope diagnostic count of exactly **14** after this task (down from the documented baseline of 72) — read the actual logged number, don't assume 14 without checking, since it must exactly match before you edit the constant.
- `DOCUMENTED_OUT_OF_SCOPE_BASELINE` in `check-strict-gate.mjs` is updated to match that measured number exactly.
- `pnpm exec tsc --noEmit --noImplicitAny -p packages/core/tsconfig.json` (package-wide) diagnostic count drops from 98 to 38 (98 − 58 fixed − 2 fixed in `services/`).
- Diff `packages/core/dist/types/services/base.d.ts` and `packages/core/dist/types/services/appium.d.ts` after `pnpm -F @caps/core build`: both `logLevel` fields widen from `any` to `string` — this is intentional and expected, not a regression to revert.
- `pnpm -F @caps/core build` and `pnpm -F @caps/core test` both exit 0 with no test-count regression (265+ tests still pass).
- File a separate bug for the four sauce-table `props`/member mismatches discovered during this work (see the standalone bug bead this plan files alongside Task 1a — do not fix it here, it changes runtime behavior).

- [ ] **Step 1: Establish the baseline**

Run: `pnpm run check:strict` from `packages/core/`
Expected: passes today (scoped check), logs `ℹ out-of-scope diagnostic count: 72 (documented baseline: 72)`.

- [ ] **Step 2: Fix one enum file as a template**

```typescript
// packages/core/src/enums/log-level.ts (illustrative — mirror context-ref.ts's shape)
import type { EnumEntry } from './types'

export const LogLevel = {
  // ...existing numeric members unchanged...
  props: {
    // ...existing entries unchanged...
  } as Record<number, EnumEntry>
}
```

Apply the same `as Record<number, EnumEntry>` annotation to each remaining file's `props` object, without changing any runtime value. Do this for the 12 enum files plus `services/base.ts:170` and `services/appium.ts:35`'s `props` access sites (same pattern, different location).

- [ ] **Step 3: Run the unscoped typecheck after each file**

Run: `pnpm exec tsc --noEmit --noImplicitAny -p packages/core/tsconfig.json 2>&1 | grep -E "<file-you-just-fixed>"`
Expected: the file's diagnostic count drops from 6 (or 4 for `test-mode.ts`) to 1 — the residual enum-object string-index site remains; that's correct, do not try to remove it here.

- [ ] **Step 4: Repeat Step 2–3 for all 12 enum files plus the 2 `services/` sites**

- [ ] **Step 5: Re-run the full gate and update the baseline constant**

Run: `pnpm run check:strict`
Read the new `ℹ out-of-scope diagnostic count:` value — expect **14**. Edit `DOCUMENTED_OUT_OF_SCOPE_BASELINE` in `packages/core/scripts/check-strict-gate.mjs` to match it exactly.

- [ ] **Step 6: Diff the published type declarations**

Run: `pnpm -F @caps/core build && git diff packages/core/dist/types/services/base.d.ts packages/core/dist/types/services/appium.d.ts`
Expected: `logLevel: any` → `logLevel: string` in both files. Confirm this is the only declaration change.

- [ ] **Step 7: Full verification gate**

Run: `pnpm -F @caps/core build && pnpm -F @caps/core test && pnpm run check:strict`
Expected: all exit 0.

- [ ] **Step 8: Commit**

```bash
git add packages/core/src/enums/ packages/core/src/services/base.ts packages/core/src/services/appium.ts packages/core/scripts/check-strict-gate.mjs
git commit -m "chore(core): annotate remaining enum props tables, lower out-of-scope baseline to 14"
```

---

### Task 1b: Extend the strict gate's zero-tolerance filter to `src/enums/` and close the residual 14

**Depends on:** Task 1a (must land first — same script, sequential edits).

**Files:**
- Modify: `packages/core/src/enums/types.ts` (add a documented `codeToValue()` helper)
- Modify: the same 12 enum files from Task 1a, plus `context-ref.ts` and `document-ready-state.ts` (14 total — apply the helper at the enum-object string-index site)
- Modify: `packages/core/scripts/check-strict-gate.mjs` (extend the zero-tolerance filter at line ~102 to include `src/enums/`; add a membership assertion mirroring the existing `EXPECTED_NATIVE_HELPER_FILES` check; set `DOCUMENTED_OUT_OF_SCOPE_BASELINE` to 0 once closed)
- Modify: `.sessions/2026-08-11-native-helpers-typescript/adr/0002-scoped-diagnostic-gate-over-package-wide-strict.md` (correct the follow-on paragraph — the `props` annotation alone was never sufficient; note what actually closed the gap)
- Modify: `.sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md` (mark this ratchet item resolved)

**Interfaces:**
- Produces: `export const codeToValue = (table: object, key: string): number => (table as Record<string, number>)[key]` in `enums/types.ts` — a new export on an already-public module (`enums/index.ts:4`), documented with a docblock stating the assertion is unsound for a table's own non-numeric keys (e.g. `'PROPS'`) but safe in context because the call site's `try`/`catch` and upstream validation never reach that key.
- Consumes: the 14 enum-object string-index call sites (`Enum[(val as string).toUpperCase()]`), each rewritten to `Enum.props[codeToValue(Enum, (val as string).toUpperCase())]`.

**Acceptance Criteria:**
- `codeToValue()` exists in `enums/types.ts` with a docblock explaining the unsound-but-safe-in-context assertion.
- All 14 sites (12 from Task 1a + `context-ref.ts` + `document-ready-state.ts`) use it in place of the raw enum-object index.
- `pnpm exec tsc --noEmit --noImplicitAny -p packages/core/tsconfig.json` reports **zero** `TS7053` diagnostics under `src/enums/`.
- `check-strict-gate.mjs`'s zero-tolerance filter (the `scopedDiagnostics` check) includes `src/enums/`, with a membership assertion analogous to `EXPECTED_NATIVE_HELPER_FILES` so a file silently missing from enforcement is caught, not silently passed.
- `DOCUMENTED_OUT_OF_SCOPE_BASELINE` is set to 0.
- `pnpm run check:strict` passes with zero out-of-scope diagnostics logged.
- `adr/0002`'s follow-on paragraph is corrected to state what actually closed the gap (the `codeToValue()` helper, not the `props` annotation alone).
- `pnpm -F @caps/core build` and `pnpm -F @caps/core test` exit 0, no test-count regression.

- [ ] **Step 1: Add the helper**

```typescript
// packages/core/src/enums/types.ts
/**
 * Look up a numeric enum value by its uppercased string code.
 *
 * The cast is unsound for a table's own non-value keys (e.g. `'PROPS'` would
 * type as `number` but isn't one) — safe here only because every call site
 * wraps this in a try/catch that treats a resulting `undefined` `props`
 * lookup as a miss, never as a valid `EnumEntry`.
 */
export const codeToValue = (table: object, key: string): number =>
  (table as Record<string, number>)[key]
```

- [ ] **Step 2: Apply it at one site as a template**

```typescript
// packages/core/src/enums/context-ref.ts
import { codeToValue } from './types'

const contextRefHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    return ContextRef.props[codeToValue(ContextRef, (val as string).toUpperCase())]
  } catch (err) {
    return ContextRef.props[def]
  }
}
```

- [ ] **Step 3: Run the unscoped typecheck after each file**

Run: `pnpm exec tsc --noEmit --noImplicitAny -p packages/core/tsconfig.json 2>&1 | grep -E "<file-you-just-fixed>"`
Expected: no output.

- [ ] **Step 4: Repeat Step 2–3 for the remaining 13 files**

- [ ] **Step 5: Extend the gate script**

```javascript
// packages/core/scripts/check-strict-gate.mjs — extend the existing scopedDiagnostics filter
const scopedDiagnostics = diagnosticLines.filter(
  (line) => line.includes('src/helpers/native/') || line.includes('src/globals.d.ts') || line.includes('src/enums/'),
)
```

Add a membership assertion for the 14 enum files mirroring the existing `EXPECTED_NATIVE_HELPER_FILES` check, and set `DOCUMENTED_OUT_OF_SCOPE_BASELINE = 0`.

- [ ] **Step 6: Correct the ADR**

Edit `.sessions/2026-08-11-native-helpers-typescript/adr/0002-scoped-diagnostic-gate-over-package-wide-strict.md`'s follow-on paragraph to state the `props` annotation alone left 14 diagnostics standing, and the `codeToValue()` helper is what actually closed the gap to a plain exit-0-equivalent gate.

- [ ] **Step 7: Full verification gate**

Run: `pnpm -F @caps/core build && pnpm -F @caps/core test && pnpm run check:strict`
Expected: all exit 0, zero out-of-scope diagnostics logged.

- [ ] **Step 8: Commit**

```bash
git add packages/core/src/enums/ packages/core/scripts/check-strict-gate.mjs .sessions/2026-08-11-native-helpers-typescript/adr/0002-scoped-diagnostic-gate-over-package-wide-strict.md .sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md
git commit -m "chore(core): close the noImplicitAny ratchet's enum residual, enforce via the strict gate"
```

---

### Task 2: Decision record — narrowing ambient `driver`/`$`/`$$` globals is not being done now

**Depends on:** Task 3 (its outcome changes this decision's cost/benefit — sequence after).

**Files:**
- Modify: `.sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md` (resolve this checklist item with the decision)
- No production code changes. Architect review (§D) proved the original code-change version of this task rests on a false premise: none of `packages/core/src/globals.d.ts`, `packages/providers/src/wdio-globals.d.ts`, or `packages/reporters/src/global.d.ts` actually declares custom commands (the thing a `Browser` augmentation would hold); `@caps/reporters` deliberately has no `webdriverio` dependency (`global.d.ts:3-4`); and narrowing reverses an affirmed prior decision (Decision B1 in the original conversion plan) with no ADR.

**Interfaces:**
- Produces: a written decision in `FOLLOWUPS.md`, not code.

**Acceptance Criteria:**
- `FOLLOWUPS.md`'s "narrow the ambient globals" item is resolved (checkbox flipped) with an explicit decision: **not narrowing now**.
- The decision record states the correct augmentation shape for if/when this is revisited (not the plan-breaking form from the original draft):
  ```typescript
  declare global {
    const driver: WebdriverIO.Browser
    const browser: WebdriverIO.Browser
    const $: WebdriverIO.Browser['$']
    const $$: WebdriverIO.Browser['$$']
    namespace WebdriverIO {
      interface Browser { /* custom commands, if any exist by then */ }
    }
  }
  export {}
  ```
- The record flags the cross-package declaration-merging hazard: three packages each augmenting `namespace WebdriverIO { interface Browser }` merge in any consumer installing more than one; divergent signatures surface as `TS2717`/`TS2320` in the *consumer's* build, not in this repo's CI.
- The record notes that revisiting this for real requires: adding a `webdriverio` dependency to `@caps/reporters` (reversing its documented dependency-free-leaf design) or `@caps/providers`, and an ADR reversing Decision B1 — scoped as its own plan, not folded into a hardening pass.

- [ ] **Step 1: Wait for Task 3's outcome**

Task 3's adopt/reject decision on `@wdio/webdriver-mock-service` changes what a real `WebdriverIO.Browser` type would need to satisfy in tests — read that decision first.

- [ ] **Step 2: Write the decision record**

Replace the open `- [ ]` item in `.sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md` with a `- [x]` entry stating "not narrowing now," the reason (no custom commands actually exist to type; two of three packages would need a new dependency; reverses an affirmed decision with no ADR), and the correct augmentation shape from the Acceptance Criteria above for future reference.

- [ ] **Step 3: Commit**

```bash
git add .sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md
git commit -m "docs: record decision not to narrow ambient WDIO globals at this time"
```

---

### Task 3: Evaluate `@wdio/webdriver-mock-service` adoption for native-helper test coverage

**Files:**
- Create: `packages/core/src/helpers/native/__test-helpers__/wdio-mocks.spike.test.ts` (throwaway spike, deleted or promoted at the end of the task)
- Modify: `.sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md` (decision record)

**Interfaces:**
- Consumes: `@wdio/webdriver-mock-service@9.30.1` (confirmed installed dependency of `@caps/core`), the existing shared mock helper at `packages/core/src/helpers/native/__test-helpers__/wdio-mocks.ts`.
- Produces: a written adopt/reject decision with rationale — no required production code change unless the decision is "adopt now."

**Acceptance Criteria:**
- **Timebox: half a day.** Running out the clock with no working spike is itself a valid, recordable "reject" reason — do not let setup cost alone force an "adopt."
- The spike demonstrates `@wdio/webdriver-mock-service`'s `WebDriverMock` (the general-purpose `nock`-backed protocol proxy — not the fixed scenario menu built for WebdriverIO's own suite) wired in via `vi.stubGlobal('driver', ...)` for at least one element-protocol call (`isDisplayed`, `click`, or equivalent) on one native helper (e.g. `base.ts`). This is **not** "instead of `vi.stubGlobal`" — the native helpers read the globals `driver`/`$`/`$$` directly, so the spike still needs `vi.stubGlobal` to wire in whatever object backs the session; the comparison is about *what backs that object* (protocol-level fidelity via `nock` vs. a hand-rolled `[key: string]: any` stub).
- The spike's protocol-level fidelity is compared explicitly against the current hand-rolled mock (`__test-helpers__/wdio-mocks.ts:26`, typed `[key: string]: any`) for the same call — record what the mock-service catches that the hand-rolled stub does not (or confirms it catches nothing extra for this call shape).
- A written decision in `.sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md` states: adopt now / adopt later / reject, with the concrete reason from the comparison (or the timebox) above.
- If "adopt now": the spike is promoted into the real test suite and the shared mock helper's usage is migrated for at least the file evaluated; `pnpm -F @caps/core test` still passes with the same or higher test count.
- If "adopt later" or "reject": the spike file is deleted before commit — no dead spike code ships.
- If a decision write-up is judged to meet the ADR bar (hard-to-reverse + non-obvious + real trade-off), it goes in `.sessions/2026-08-11-native-helpers-typescript/adr/000N-webdriver-mock-service-adoption.md` (this repo's ADR convention — not `docs/decisions/`, which doesn't exist here).

- [ ] **Step 1: Start the timebox, write the spike test**

```typescript
// packages/core/src/helpers/native/__test-helpers__/wdio-mocks.spike.test.ts
import { describe, it, expect, vi } from 'vitest'
// Wire @wdio/webdriver-mock-service's WebDriverMock against one exported function
// from base.ts, e.g. re-run an existing base.test.ts case through it instead of
// the hand-rolled vi.stubGlobal object — still via vi.stubGlobal('driver', ...),
// just backing `driver` with the mock service's session instead of a plain object.
```

- [ ] **Step 2: Run it and compare fidelity against the existing hand-rolled mock for the same scenario**

Run: `pnpm -F @caps/core test -- wdio-mocks.spike`
Expected: passes (or times out the box); note the fidelity difference for the evaluated call.

- [ ] **Step 3: Write the decision**

Append a dated entry to `.sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md`, replacing the open `- [ ]` for this item with `- [x]` and the decision + reason.

- [ ] **Step 4: Clean up per the decision**

Either promote the spike (drop `.spike` from the filename, migrate real test files) or delete it — never leave both an unresolved spike and an unresolved checkbox.

- [ ] **Step 5: Commit**

```bash
git add .sessions/2026-08-11-native-helpers-typescript/FOLLOWUPS.md packages/core/src/helpers/native/
git commit -m "docs(core): resolve webdriver-mock-service adoption evaluation"
```

---

### Task 4: Add a diagnostic warning for silent provider-resolution failure

**Files:**
- Modify: `packages/core/src/providers/registry.ts` (`getProvider`, lines 115-121) — diagnostics only, do not change the return contract
- Create: `packages/core/src/providers/registry.test.ts` (does not exist today)

**Interfaces:**
- Consumes: existing `getProvider(name: string = DEFAULT_PROVIDER_NAME): Provider | undefined` call sites — signature changes to `getProvider(name?: string): Provider | undefined`, which is **already** the signature published in `packages/core/dist/types/providers/registry.d.ts:55` (a default-valued parameter and an optional parameter emit an identical `.d.ts` declaration) — so this is not an observable API break.
- Produces: same return value on every existing call site; the only addition is a side-effect diagnostic emission on the miss path, gated so it fires on the actual target failure (an explicitly-requested name that isn't registered) rather than being silenced by it.

**Acceptance Criteria:**
- `getProvider()`'s return value is unchanged for every existing call site — deliberate, documented v1-compatibility behavior (docstring at `registry.ts:104-114`) — must **not** become a throw.
- The miss-diagnostic fires when `name` was explicitly passed and misses (this includes `getProvider('saucelabs')` with an empty registry — the flagship real-world case, since `'saucelabs'` is both `DEFAULT_PROVIDER_NAME` and the only name the workspace's shipped provider registers under) — verified with a dedicated test, since the original guard's `name !== DEFAULT_PROVIDER_NAME` check silently swallowed exactly this case.
- The miss-diagnostic does **not** fire on the no-argument default-path when the registry is empty (a consumer who never configured any remote provider shouldn't see noise).
- The diagnostic uses `buildLogger()` (`packages/core/src/logger.ts`), the package's established logging convention (already used in `helpers/native/base.ts`, `gestures.ts`, `utils.ts`, `picker.ts`), not a bare `console.warn` — tests spy on the logger, not `console`.
- Test file covers, at minimum: (1) hit path emits no warning, (2) explicit non-default miss emits exactly one warning naming the requested provider and `listProviders()`, (3) explicit-default (`'saucelabs'`) miss against an empty registry **does** warn (the case the original guard missed), (4) no-argument default-path miss against an empty registry does **not** warn.
- `pnpm -F @caps/core test`, `pnpm -F @caps/providers test`, and `pnpm -F @caps/integration-tests test` all exit 0 — the last one because `packages/integration-tests/test/api.test.js:181` calls `getProvider('saucelabs')` against an emptied registry and will now emit a warning; confirm that suite's own assertions still pass with the added log noise (silence it there explicitly if it's disruptive).
- No `as never` or other type-laundering in the new test file's fixtures — use an object that actually satisfies `Provider` (`packages/core/src/providers/provider.ts:52+`).

- [ ] **Step 1: Write the failing tests**

```typescript
// packages/core/src/providers/registry.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { getProvider, registerProvider, unregisterProvider } from './registry'
import { buildLogger } from '../logger'
import type { Provider } from './provider'

const testProvider: Provider = {
  name: 'example',
  // ...fill in every field Provider actually requires, no `as never`
}

describe('getProvider', () => {
  afterEach(() => {
    unregisterProvider('example')
  })

  it('does not warn on a registered provider', () => {
    const warnSpy = vi.spyOn(buildLogger(), 'warn')
    registerProvider('example', testProvider)
    getProvider('example')
    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('warns exactly once when an explicit non-default provider name misses', () => {
    const warnSpy = vi.spyOn(buildLogger(), 'warn')
    getProvider('nonexistent')
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain('nonexistent')
    warnSpy.mockRestore()
  })

  it('warns when the explicit default name misses against an empty registry', () => {
    const warnSpy = vi.spyOn(buildLogger(), 'warn')
    getProvider('saucelabs')
    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockRestore()
  })

  it('does not warn on the no-argument default path when the registry is empty', () => {
    const warnSpy = vi.spyOn(buildLogger(), 'warn')
    getProvider()
    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
```

(Adjust the logger-spy mechanics to however `buildLogger()` is actually instantiated — check whether it returns a shared singleton or a fresh instance per call before assuming `vi.spyOn(buildLogger(), 'warn')` targets the same instance the production code uses.)

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm -F @caps/core test -- registry.test`
Expected: FAIL on tests 2 and 3 (no warning emitted yet).

- [ ] **Step 3: Implement the diagnostic**

```typescript
// packages/core/src/providers/registry.ts
const log = buildLogger()

export const getProvider = (name?: string): Provider | undefined => {
  const requested = name ?? DEFAULT_PROVIDER_NAME

  if (!Object.hasOwn(providers, requested)) {
    if (name !== undefined || listProviders().length > 0) {
      log.warn(
        `getProvider('${ requested }'): no provider registered under this name. ` +
        `Registered providers: [${ listProviders().join(', ') }]. ` +
        'If you expected one, confirm the provider package (e.g. `@caps/providers`) is imported for its registration side effect.'
      )
    }
    return undefined
  }

  return providers[requested]
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm -F @caps/core test -- registry.test`
Expected: PASS, all 4 cases.

- [ ] **Step 5: Full verification, including the previously-unlisted consumer**

Run: `pnpm -F @caps/core test && pnpm -F @caps/providers test && pnpm -F @caps/integration-tests test`
Expected: exit 0. If `packages/integration-tests/test/api.test.js:181`'s assertion now logs a warning, confirm the assertion itself still passes; add a local `vi.spyOn`/silence there only if the added noise is disruptive to that suite's own output expectations.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/providers/registry.ts packages/core/src/providers/registry.test.ts
git commit -m "feat(core): warn on silent provider-resolution miss without changing return contract"
```
