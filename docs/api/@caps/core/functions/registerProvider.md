# Function: registerProvider()

```ts
function registerProvider(name, provider): Provider;
```

Defined in: packages/core/src/providers/registry.ts:74

Register a provider implementation under `name`.

Called for its side effect by provider packages at import time:

```ts
import { registerProvider } from '@caps/core/providers'
registerProvider('saucelabs', saucelabsProvider)
```

Re-registering the same name replaces the previous implementation, which is
what makes a test double possible without reaching into module internals.

The runtime guards stay even though the signature is typed: plain-JavaScript
consumers and dynamically-assembled provider objects still reach this
function with the types unchecked.

## Parameters

### name

`string`

registry key, also the value users put in `WDIO_PROVIDER`

### provider

[`Provider`](../interfaces/Provider.md)

the implementation

## Returns

[`Provider`](../interfaces/Provider.md)

the provider that was registered
