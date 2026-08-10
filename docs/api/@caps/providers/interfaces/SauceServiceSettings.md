# Interface: SauceServiceSettings

Defined in: providers/src/types.ts:128

Settings for the `@wdio/sauce-service` block (not capabilities).

These configure the *client* — credentials, region, whether to spin up a
Sauce Connect tunnel — rather than the remote session.

## Extended by

- [`SauceSetupOptions`](SauceSetupOptions.md)

## Properties

### headless?

```ts
optional headless?: boolean;
```

Defined in: providers/src/types.ts:132

***

### key?

```ts
optional key?: string;
```

Defined in: providers/src/types.ts:130

***

### maxErrorStackLength?

```ts
optional maxErrorStackLength?: number;
```

Defined in: providers/src/types.ts:135

***

### region?

```ts
optional region?: string;
```

Defined in: providers/src/types.ts:131

***

### sauceConnect?

```ts
optional sauceConnect?: boolean;
```

Defined in: providers/src/types.ts:133

***

### tunnelName?

```ts
optional tunnelName?: string;
```

Defined in: providers/src/types.ts:136

***

### tunnelOwner?

```ts
optional tunnelOwner?: string;
```

Defined in: providers/src/types.ts:137

***

### uploadLogs?

```ts
optional uploadLogs?: boolean;
```

Defined in: providers/src/types.ts:134

***

### user?

```ts
optional user?: string;
```

Defined in: providers/src/types.ts:129
