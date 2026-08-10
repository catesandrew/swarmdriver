# Function: parseString()

```ts
function parseString(
   envs, 
   key, 
   def?): string;
```

Defined in: packages/core/src/utils.ts:242

Read a string environment variable. See [parseBool](parseBool.md) for the shared
"equals the default means `undefined`" contract.

## Parameters

### envs

[`Envs`](../type-aliases/Envs.md)

### key

`string`

### def?

`string`

## Returns

`string`
