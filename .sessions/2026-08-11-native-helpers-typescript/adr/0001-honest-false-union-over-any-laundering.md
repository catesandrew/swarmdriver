# ADR 0001: Type `findEle`/`findEles`/`findEleAndSel`'s failure case honestly, add `assertEle()`

- **Status:** accepted
- **Date:** 2026-08-11
- **Deciders:** session consensus (Architect + codex Critic, 4 rounds), implemented via Ralph

## Context

`findEle()`, `findEles()`, and `findEleAndSel()` in `packages/core/src/helpers/native/utils.ts` return `false` on a lookup failure rather than throwing. Under the old implicit-`any` typing, this was invisible — every caller could dereference the result freely, and a lookup miss simply crashed one property access later with an incidental `TypeError`. Converting these functions to real TypeScript forces a choice: what type does the failure case get, and what happens to the (at the time) 13 call sites across `picker.ts`, `base.ts`, and `gestures.ts` that consume the result?

The conversion's own guiding principle was "no behavior changes" — but the honest type and that principle are in direct tension at exactly the sites where a real, if minor, bug already existed.

## Options considered

1. **Type the return as the success type only (`WdioElement`), cast away the `false` case.** Pros: zero call-site changes, "no behavior change" trivially holds. Cons: this is any-laundering by another name — it doesn't make the code honest, it makes the type system agree to a lie the runtime doesn't honor. The one place types would have caught something real is exactly where this makes them silent again.
2. **Type it honestly (`WdioElement | false`), fix every call site the same way (add a guard or an assertion everywhere).** Pros: maximally safe-looking. Cons: several call sites (`gestures.ts`'s scroll-to-find retry loop) already narrow the type correctly via a plain truthy check — "fixing" them anyway is unnecessary churn and, if done carelessly, risks turning a normal "not found yet, keep scrolling" control-flow path into an unintended throw in a file with zero `try`/`catch` anywhere.
3. **Type it honestly, audit each call site individually, and add one small named helper (`assertEle()`) only for the genuinely-unguarded sites.** Pros: closes the real gap without touching what's already safe; the failure becomes a named, immediate error instead of an incidental one-property-access-later `TypeError` — a strict improvement, not a new failure mode. Cons: requires per-site judgment rather than a mechanical find-and-replace; the compiler becomes the audit tool (a site with no error after the honest type lands needs nothing; a site with a `TS2339` needs `assertEle()`), which means the fix must be sequenced *after* the honest type is in place, not decided in the abstract.

## Decision

**Option 3.** Add `assertEle(el: WdioElement | false, selector?: string): WdioElement` to `utils.ts`, exported, throwing `` `Element not found: ${selector ?? 'unknown selector'}` `` on `false`. Apply it only where the compiler, after the honest type lands, actually flags an error — 6 of the (re-verified) 11 real call sites. The other 5 (2 in `utils.ts` itself, 3 in `gestures.ts`'s retry paths) needed zero changes.

## Consequences

- **Positive:** the one place this pass could find and fix a real latent bug (`picker.ts`'s `selectPickerValue` throwing an opaque `TypeError` instead of a named "element not found" error whenever a picker row wasn't present), it did. `noImplicitAny` conversions elsewhere in this codebase now have a template for handling a discovered `| false`/`| null` cascade instead of reflexively any-ing it away.
- **Negative / cost:** this is, narrowly, a behavior change — Principle 1 ("no behavior changes") had to be amended mid-project to "no behavior change *on the success path*; the failure path may become an explicit, named error where an unguarded dereference already crashed one line later." That amendment needed to be made explicitly and called out in the PR, not discovered by a reviewer.
- **Follow-on:** none required. This is complete as shipped.

## Notes

- Confirmed by 3 rounds of Architect review that this is the only intentional runtime behavior change across the entire 8-file conversion.
- `packages/core/src/helpers/native/utils.ts` (`assertEle`, `findEle`, `findEleAndSel`, `findEles`); consumers at `picker.ts` (4 sites) and `utils.ts`'s own `tapElement` (1 site) — the 6 genuinely-unguarded sites; `base.ts` (1 site, `assertEle()`-wrapped but inert since it's inside an existing `try`/`catch`, so no observable behavior change there either).
