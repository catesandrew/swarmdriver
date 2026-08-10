# Type Alias: EnumInput

```ts
type EnumInput = string | number | null | undefined;
```

Defined in: packages/core/src/enums/types.ts:38

What a `parse*()` helper accepts.

Both spellings really do arrive: a human-readable name from an environment
variable (`'chrome'`), and the already-parsed integer when a caller feeds a
previous parse result back in. The numeric-string case (`'2'`) is handled
too — see the `isNum()` guard in each table.

Narrowing back down to `string` happens at *runtime* in each table, either
through lodash's `isString()` or through the enclosing `try`/`catch`. Because
lodash is consumed here without its type definitions, `isString()` is not a
TypeScript type guard, so those sites carry an explicit `as string` — the
check is real, it is just invisible to the compiler.
