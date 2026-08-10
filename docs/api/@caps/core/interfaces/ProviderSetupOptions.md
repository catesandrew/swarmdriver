# Interface: ProviderSetupOptions

Defined in: packages/core/src/providers/provider.ts:26

Everything a provider needs to turn an environment into a WebdriverIO config.

The four named keys are what `buildWdioConfig()` guarantees to pass. The
index signature is what makes the contract *implementable*: a provider's
`setup*` function is a reducer that forwards its unrecognised keys down to
its own capability builders, so it declares a parameter type wider than this
one. Without an index signature here, that wider parameter type is not
assignable in either direction and no real provider can satisfy `Provider` —
which is exactly how `@caps/providers` failed to compile against the first
cut of this interface.

## Indexable

```ts
[key: string]: any
```

## Properties

### buildSuffix?

```ts
optional buildSuffix?: string;
```

Defined in: packages/core/src/providers/provider.ts:34

seed for a provider build identifier

***

### envs

```ts
envs: Envs;
```

Defined in: packages/core/src/providers/provider.ts:28

the environment to read settings from

***

### framework

```ts
framework: string;
```

Defined in: packages/core/src/providers/provider.ts:30

`jasmine`, `mocha`, ...

***

### tunnelPrefix?

```ts
optional tunnelPrefix?: string;
```

Defined in: packages/core/src/providers/provider.ts:32

seed for a provider tunnel identifier
