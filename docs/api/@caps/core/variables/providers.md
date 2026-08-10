# Variable: providers

```ts
const providers: ProviderRegistry;
```

Defined in: packages/core/src/providers/registry.ts:51

Registry of cloud providers, keyed by `WDIO_PROVIDER`.

`@caps/core` deliberately owns the *registry* but none of the
*implementations*. A provider package (e.g. `@caps/providers`) depends on
core one-way and calls [registerProvider](../functions/registerProvider.md) as an import side-effect, so
there is no circular dependency between the two packages.
