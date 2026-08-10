# Interface: ProviderEnvContext

Defined in: packages/core/src/providers/provider.ts:7

Extra context handed to [Provider.applyEnvDefaults](Provider.md#applyenvdefaults), so a provider can
pick different defaults per cell of the config matrix.

## Properties

### metal

```ts
metal: Metal;
```

Defined in: packages/core/src/providers/provider.ts:11

`desktop` or `device`

***

### scope

```ts
scope: Scope;
```

Defined in: packages/core/src/providers/provider.ts:9

`browser` or `app`
