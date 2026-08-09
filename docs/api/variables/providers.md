# Variable: providers

```ts
const providers: object;
```

Defined in: src/providers/index.js:22

Registry of cloud providers, keyed by `WDIO_PROVIDER`.

Sauce Labs is the only implementation that ships with swarmdriver. Adding
another one means adding a module under `src/providers/` that satisfies the
[Provider](../interfaces/Provider.md) contract and registering it here — see `docs/providers.mdx`.
