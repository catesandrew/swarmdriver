# Interface: EnumEntry

Defined in: packages/core/src/enums/types.ts:13

One member of an enum table, as returned by every `parse*()` helper.

## Properties

### code

```ts
code: string;
```

Defined in: packages/core/src/enums/types.ts:17

the constant's name, e.g. `'CHROME'`

***

### desc?

```ts
optional desc?: string;
```

Defined in: packages/core/src/enums/types.ts:21

short label; only `AppiumAppState` carries one

***

### description?

```ts
optional description?: string;
```

Defined in: packages/core/src/enums/types.ts:19

long-form explanation; only some tables carry one

***

### value

```ts
value: number;
```

Defined in: packages/core/src/enums/types.ts:15

the integer the constant maps to
