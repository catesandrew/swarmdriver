# Follow-ups — Native helpers TypeScript conversion (2026-08-11)

Live list of what's left. Nothing here is blocking — the work shipped and published clean.

## Blocked on the user (decisions / approvals / access)

None.

## Blocked on work (do next)

None — this session closed with all acceptance criteria met and the release published.

## Nice-to-have / later

- [ ] Extend `packages/core/tsconfig.strict.json`'s ratchet to the other 12 enum files that share `context-ref.ts`/`document-ready-state.ts`'s `TS7053` pattern (`props: Record<number, EnumEntry>`, mechanical, no runtime change) — would let `check:strict`'s gate revert from "scoped diagnostics" to a plain `tsc` exit-0 check. See `adr/0002-scoped-diagnostic-gate-over-package-wide-strict.md`.
- [ ] If `@wdio/webdriver-mock-service` (already a dependency, evaluated this session and not adopted) is ever worth the setup cost, it would give higher-fidelity coverage of the element-protocol layer (`isDisplayed`, `click`, etc.) than the hand-rolled `vi.stubGlobal` mocks — independent of whoever wrote the type annotations having the same wrong mental model as whoever wrote the mock.
- [ ] If the ambient `driver`/`$`/`$$` globals (`packages/core/src/globals.d.ts`, currently deliberately `any`) are ever narrowed, the idiomatic path is `declare global { namespace WebdriverIO { interface Browser { ... } } }` module augmentation — not a hand-rolled parallel interface. Would need to span `globals.d.ts`, `packages/providers/src/wdio-globals.d.ts`, and `packages/reporters/src/global.d.ts` together, since all three share the same ambient-`any` convention for the same reason (custom commands registered onto the session at runtime).

## Known risks / watch-outs

- The scoped-diagnostic gate (`pnpm run check:strict`) is not a drop-in replacement for `tsc`'s own exit code — anyone extending `tsconfig.strict.json#files` by hand (bypassing the script) could silently miss a file. Always add new files to `EXPECTED_NATIVE_HELPER_FILES` in `packages/core/scripts/check-strict-gate.mjs` in the same change.
- `assertEle()`'s throw is the one intentional behavior change in this pass (see `adr/0001-...`). If a future refactor moves `findEle`/`findEleAndSel`/`findEles` call sites around, re-audit whether the site is truthy-guarded before assuming `assertEle()` is or isn't needed — don't copy the current list forward without re-checking against source.

## Done this session (for reference)

- [x] Converted all 8 `helpers/native/*.ts` files to true TypeScript, zero explicit `any` remaining (`8eaceed`)
- [x] Added `packages/core/tsconfig.strict.json` + `scripts/check-strict-gate.mjs` ratchet (`8eaceed`)
- [x] Added 8 new test files (265 tests total) + shared WDIO mock helper (`8eaceed`)
- [x] 2 codex reviewer rounds on the implementation — round 1 rejected with 4 findings, all fixed; round 2 approved with 2 non-blocking doc fixes, applied
- [x] `ai-slop-cleaner` pass — no changes needed
- [x] Committed, versioned via Changesets, and published: `@caps/core@0.1.1`, `@caps/cli@0.1.1`, `@caps/providers@0.1.1` (`459b49b`, `c9f924f`)
