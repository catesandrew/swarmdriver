# Interface: SauceCapability

Defined in: providers/src/types.ts:162

A single entry of a WebdriverIO `capabilities` array.

The index signature is load-bearing rather than lazy: capability objects are
an open map by design (`appium:*`, `sauce:options`, `goog:chromeOptions`,
and our own `swarmdriver:testMode`), and the vendor-prefixed keys cannot be
enumerated ahead of time.

## Indexable

```ts
[capability: string]: unknown
```

## Properties

### browserName?

```ts
optional browserName?: string;
```

Defined in: providers/src/types.ts:163

***

### browserVersion?

```ts
optional browserVersion?: string;
```

Defined in: providers/src/types.ts:164

***

### platformName?

```ts
optional platformName?: string;
```

Defined in: providers/src/types.ts:165

***

### sauce:options?

```ts
optional sauce:options?: Record<string, unknown>;
```

Defined in: providers/src/types.ts:166

***

### sauceOptions?

```ts
optional sauceOptions?: Record<string, unknown>;
```

Defined in: providers/src/types.ts:168

Pre-`sauce:options` staging key; merged by the `machines/*` builders.

***

### swarmdriver:testMode?

```ts
optional swarmdriver:testMode?: number;
```

Defined in: providers/src/types.ts:170

A numeric member of `TestMode` from `@caps/core/enums`.
