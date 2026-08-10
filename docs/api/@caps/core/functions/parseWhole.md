# Function: parseWhole()

```ts
function parseWhole(
   envs, 
   key, 
   def?): number;
```

Defined in: packages/core/src/utils.ts:230

Read an integer environment variable. See [parseBool](parseBool.md) for the shared
"equals the default means `undefined`" contract.

## Parameters

### envs

[`Envs`](../type-aliases/Envs.md)

### key

`string`

### def?

`number`

## Returns

`number`
