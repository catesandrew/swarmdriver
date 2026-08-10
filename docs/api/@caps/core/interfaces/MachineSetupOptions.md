# Interface: MachineSetupOptions

Defined in: packages/core/src/types.ts:82

Options accepted by every `*Setup*` machine builder.

The index signature is load-bearing rather than lazy: each builder collects
its unrecognised keys into `...params` and merges them straight into the
generated capability object. That is the documented escape hatch for
per-capability overrides (`browserName`, `appium:udid`, a vendor key a driver
added last week), so the type has to stay open to keep it usable.

## Indexable

```ts
[key: string]: any
```

## Properties

### appiumConfig?

```ts
optional appiumConfig?: AppiumConnection;
```

Defined in: packages/core/src/types.ts:84

***

### browserName?

```ts
optional browserName?: string;
```

Defined in: packages/core/src/types.ts:87

***

### browserVersion?

```ts
optional browserVersion?: string;
```

Defined in: packages/core/src/types.ts:88

***

### envs?

```ts
optional envs?: Envs;
```

Defined in: packages/core/src/types.ts:83

***

### framework?

```ts
optional framework?: string;
```

Defined in: packages/core/src/types.ts:86

***

### platformName?

```ts
optional platformName?: string;
```

Defined in: packages/core/src/types.ts:89

***

### sauceOptions?

```ts
optional sauceOptions?: Record<string, any>;
```

Defined in: packages/core/src/types.ts:85
