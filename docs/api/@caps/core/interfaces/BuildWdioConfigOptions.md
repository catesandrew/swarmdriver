# Interface: BuildWdioConfigOptions

Defined in: packages/core/src/api.ts:16

Inputs to [buildWdioConfig](../functions/buildWdioConfig.md) — one cell of the config matrix.

## Indexable

```ts
[key: string]: any
```

## Properties

### envs?

```ts
optional envs?: Envs;
```

Defined in: packages/core/src/api.ts:18

the environment bag to read settings from; mutated with defaults

***

### framework?

```ts
optional framework?: string;
```

Defined in: packages/core/src/api.ts:26

`jasmine`, `mocha`, ...

***

### metal?

```ts
optional metal?: Metal;
```

Defined in: packages/core/src/api.ts:24

`desktop` or `device`

***

### pkgName?

```ts
optional pkgName?: string;
```

Defined in: packages/core/src/api.ts:28

consuming package name; seeds provider tunnel and build identifiers

***

### remote?

```ts
optional remote?: string;
```

Defined in: packages/core/src/api.ts:20

`local`, or a provider name registered in the provider registry

***

### scope?

```ts
optional scope?: Scope;
```

Defined in: packages/core/src/api.ts:22

`browser` (web app) or `app` (native app)
