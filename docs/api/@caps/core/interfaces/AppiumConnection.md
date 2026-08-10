# Interface: AppiumConnection

Defined in: packages/core/src/types.ts:65

Where an Appium server can be reached.

Assembled by `services/appium.ts` and threaded into the machine builders,
which lift these onto the *config* (not the capability) because WebdriverIO
v9 capabilities are strict W3C and silently drop connection keys.

## Indexable

```ts
[key: string]: any
```

## Properties

### address?

```ts
optional address?: string;
```

Defined in: packages/core/src/types.ts:66

***

### basePath?

```ts
optional basePath?: string;
```

Defined in: packages/core/src/types.ts:67

***

### port?

```ts
optional port?: number;
```

Defined in: packages/core/src/types.ts:69

***

### protocol?

```ts
optional protocol?: string;
```

Defined in: packages/core/src/types.ts:68
