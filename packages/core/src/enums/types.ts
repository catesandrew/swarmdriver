/**
 * Shared shape of the hand-rolled enum tables in this directory.
 *
 * Every table in `enums/*` follows the same layout — named constants mapped to
 * small integers, plus a `props` lookup keyed by that integer — so the `parse*`
 * helpers all share one signature. Declaring it once here is what lets a caller
 * write `parseReporter(name).value` and get a `number` rather than `any`.
 */

/**
 * One member of an enum table, as returned by every `parse*()` helper.
 */
export interface EnumEntry {
  /** the integer the constant maps to */
  value: number
  /** the constant's name, e.g. `'CHROME'` */
  code: string
  /** long-form explanation; only some tables carry one */
  description?: string
  /** short label; only `AppiumAppState` carries one */
  desc?: string
}

/**
 * What a `parse*()` helper accepts.
 *
 * Both spellings really do arrive: a human-readable name from an environment
 * variable (`'chrome'`), and the already-parsed integer when a caller feeds a
 * previous parse result back in. The numeric-string case (`'2'`) is handled
 * too — see the `isNum()` guard in each table.
 *
 * Narrowing back down to `string` happens at *runtime* in each table, either
 * through lodash's `isString()` or through the enclosing `try`/`catch`. Because
 * lodash is consumed here without its type definitions, `isString()` is not a
 * TypeScript type guard, so those sites carry an explicit `as string` — the
 * check is real, it is just invisible to the compiler.
 */
export type EnumInput = string | number | null | undefined
