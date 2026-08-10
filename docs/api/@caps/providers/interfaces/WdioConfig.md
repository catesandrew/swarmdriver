# Interface: WdioConfig

Defined in: providers/src/types.ts:189

A WebdriverIO config, or the partial slice of one that a reducer contributes.

Open for the same reason as [SauceCapability](SauceCapability.md): `setup*` builds a config
up by spreading provider defaults, reporter config and service config
together, and the reporter packages own keys we do not.

It *extends* `@caps/core`'s definition rather than restating it. That is not
tidiness: `Provider.setup*` in `@caps/core/providers` is declared to return
core's `WdioConfig`, so an independent declaration here — however similar —
makes `saucelabsProvider` unassignable to `Provider` the moment the two drift
(an `unknown`-valued index signature, for instance, is not assignable to
core's `path?: string`). Narrowing `capabilities` to [SauceCapability](SauceCapability.md)
keeps the extra precision this package wants.

## Extends

- [`WdioConfig`](../../core/interfaces/WdioConfig.md)

## Indexable

```ts
[key: string]: any
```

## Properties

### capabilities?

```ts
optional capabilities?: SauceCapability[];
```

Defined in: providers/src/types.ts:190

#### Overrides

[`WdioConfig`](../../core/interfaces/WdioConfig.md).[`capabilities`](../../core/interfaces/WdioConfig.md#capabilities)

***

### framework?

```ts
optional framework?: string;
```

Defined in: core/dist/types/types.d.ts:47

#### Inherited from

[`WdioConfig`](../../core/interfaces/WdioConfig.md).[`framework`](../../core/interfaces/WdioConfig.md#framework)

***

### hostname?

```ts
optional hostname?: string;
```

Defined in: core/dist/types/types.d.ts:48

#### Inherited from

[`WdioConfig`](../../core/interfaces/WdioConfig.md).[`hostname`](../../core/interfaces/WdioConfig.md#hostname)

***

### path?

```ts
optional path?: string;
```

Defined in: core/dist/types/types.d.ts:50

#### Inherited from

[`WdioConfig`](../../core/interfaces/WdioConfig.md).[`path`](../../core/interfaces/WdioConfig.md#path)

***

### port?

```ts
optional port?: number;
```

Defined in: core/dist/types/types.d.ts:49

#### Inherited from

[`WdioConfig`](../../core/interfaces/WdioConfig.md).[`port`](../../core/interfaces/WdioConfig.md#port)

***

### protocol?

```ts
optional protocol?: string;
```

Defined in: core/dist/types/types.d.ts:51

#### Inherited from

[`WdioConfig`](../../core/interfaces/WdioConfig.md).[`protocol`](../../core/interfaces/WdioConfig.md#protocol)

***

### reporters?

```ts
optional reporters?: any[];
```

Defined in: core/dist/types/types.d.ts:46

#### Inherited from

[`WdioConfig`](../../core/interfaces/WdioConfig.md).[`reporters`](../../core/interfaces/WdioConfig.md#reporters)

***

### services?

```ts
optional services?: any[];
```

Defined in: core/dist/types/types.d.ts:45

#### Inherited from

[`WdioConfig`](../../core/interfaces/WdioConfig.md).[`services`](../../core/interfaces/WdioConfig.md#services)
