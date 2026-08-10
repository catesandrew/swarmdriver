# Interface: WdioConfig

Defined in: packages/core/src/types.ts:46

A WebdriverIO testrunner config object (or a fragment of one).

Kept structural and open: `buildWdioConfig()` composes fragments from several
reducers, and WebdriverIO itself accepts a superset that varies by installed
service. The keys named here are the ones this package reads back after
composing, so they are worth pinning.

## Extended by

- [`WdioConfig`](../../providers/interfaces/WdioConfig.md)

## Indexable

```ts
[key: string]: any
```

## Properties

### capabilities?

```ts
optional capabilities?: Capability[];
```

Defined in: packages/core/src/types.ts:47

***

### framework?

```ts
optional framework?: string;
```

Defined in: packages/core/src/types.ts:50

***

### hostname?

```ts
optional hostname?: string;
```

Defined in: packages/core/src/types.ts:51

***

### path?

```ts
optional path?: string;
```

Defined in: packages/core/src/types.ts:53

***

### port?

```ts
optional port?: number;
```

Defined in: packages/core/src/types.ts:52

***

### protocol?

```ts
optional protocol?: string;
```

Defined in: packages/core/src/types.ts:54

***

### reporters?

```ts
optional reporters?: any[];
```

Defined in: packages/core/src/types.ts:49

***

### services?

```ts
optional services?: any[];
```

Defined in: packages/core/src/types.ts:48
