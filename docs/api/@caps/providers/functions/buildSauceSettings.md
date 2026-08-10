# Function: buildSauceSettings()

```ts
function buildSauceSettings(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:84

## Parameters

### opts?

[`SauceServiceSettings`](../interfaces/SauceServiceSettings.md) = `{}`

## Returns

`object`

### headless

```ts
headless: boolean = opts.headless;
```

### key

```ts
key: string = opts.key;
```

### region

```ts
region: string = opts.region;
```

### services

```ts
services: (
  | string
  | {
  maxErrorStackLength: number;
  sauceConnect: boolean;
  sauceConnectOpts: {
     noAutodetect: boolean;
     tunnelName: string;
     tunnelOwner: string;
  };
  uploadLogs: boolean;
})[][];
```

### user

```ts
user: string = opts.user;
```
