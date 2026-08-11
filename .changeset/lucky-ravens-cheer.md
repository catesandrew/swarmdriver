---
"@caps/core": patch
---

Convert `packages/core/src/helpers/native/*.ts` (alert, base, carousel, find-strategy, gestures, picker, utils, web-view) to true TypeScript. These files had a `.ts` extension but were untyped JS ports with implicit-`any` parameters throughout. They are now typed under a scoped `noImplicitAny` ratchet, with full vitest coverage added where none existed.

No intended behavior change, with one narrow exception: `findEle`/`findEleAndSel`/`findEles` now honestly type their failure return as `| false`, and the two call sites that previously dereferenced an unguarded `false` (throwing an incidental `TypeError` one property access later) now throw an explicit, named error via a new `assertEle()` helper instead.
