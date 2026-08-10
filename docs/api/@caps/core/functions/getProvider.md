# Function: getProvider()

```ts
function getProvider(name?): Provider;
```

Defined in: packages/core/src/providers/registry.ts:115

Look up a provider by name.

Returns `undefined` when nothing is registered under that name — including
the case where the caller simply forgot to import the package that would
have registered it. `buildWdioConfig()` turns that into a no-op return
rather than throwing, preserving the v1 behaviour for unknown remotes.

## Parameters

### name?

`string` = `DEFAULT_PROVIDER_NAME`

provider key, defaults to [DEFAULT\_PROVIDER\_NAME](../variables/DEFAULT_PROVIDER_NAME.md)

## Returns

[`Provider`](../interfaces/Provider.md)

the provider, or `undefined`
