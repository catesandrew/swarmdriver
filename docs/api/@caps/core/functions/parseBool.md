# Function: parseBool()

```ts
function parseBool(
   envs, 
   key, 
   def?): boolean;
```

Defined in: packages/core/src/utils.ts:218

Read a boolean environment variable.

The whole `parseX` family shares one contract, and it is deliberately not
"return the default when unset": it returns `undefined` whenever the
resolved value *equals* the default. Callers spread the result into a config
object behind `existy(...)`, so a key whose value matches the default is
omitted entirely rather than written out — which is what lets WebdriverIO's
own defaults win and keeps generated configs minimal.

## Parameters

### envs

[`Envs`](../type-aliases/Envs.md)

the environment bag to read from

### key

`string`

variable name

### def?

`boolean`

value to compare against; also the fallback when unset

## Returns

`boolean`

the parsed value, or `undefined` when it equals `def`
