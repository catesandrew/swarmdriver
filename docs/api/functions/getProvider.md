# Function: getProvider()

```ts
function getProvider(name?): Provider;
```

Defined in: src/providers/index.js:33

Look up a provider by name.

## Parameters

### name?

`string` = `DEFAULT_PROVIDER_NAME`

provider key, defaults to [DEFAULT\_PROVIDER\_NAME](../variables/DEFAULT_PROVIDER_NAME.md)

## Returns

[`Provider`](../interfaces/Provider.md)

Returns the provider, or
  `undefined` when nothing is registered under that name.
