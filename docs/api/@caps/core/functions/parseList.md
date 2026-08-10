# Function: parseList()

```ts
function parseList(
   envs, 
   key, 
   def?): string[];
```

Defined in: packages/core/src/utils.ts:256

Read a colon-separated list environment variable.

Unlike the other three this always returns a list — `def` comes back as-is
when the variable is unset, never collapsed to `undefined`.

## Parameters

### envs

[`Envs`](../type-aliases/Envs.md)

### key

`string`

### def?

`string`[] = `[]`

## Returns

`string`[]
