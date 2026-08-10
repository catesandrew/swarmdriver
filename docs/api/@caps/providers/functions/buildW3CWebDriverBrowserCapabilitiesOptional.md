# Function: buildW3CWebDriverBrowserCapabilitiesOptional()

```ts
function buildW3CWebDriverBrowserCapabilitiesOptional(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:850

Optional, Sauce-compatible W3C WebDriver specification capabilities you can
add to your tests.

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into a `capabilities` entry

### acceptInsecureCerts

```ts
acceptInsecureCerts: boolean = opts.acceptInsecureCerts;
```

### pageLoadStrategy

```ts
pageLoadStrategy: string = opts.pageLoadStrategy;
```

### proxy

```ts
proxy: Record<string, unknown> = opts.proxy;
```

### strictFileInteractability

```ts
strictFileInteractability: boolean = opts.strictFileInteractability;
```

### timeouts

```ts
timeouts: object = opts.timeouts;
```

#### timeouts.implicit?

```ts
optional implicit?: number;
```

#### timeouts.pageLoad?

```ts
optional pageLoad?: number;
```

#### timeouts.script?

```ts
optional script?: number;
```

### unhandledPromptBehavior

```ts
unhandledPromptBehavior: string = opts.unhandledPromptBehavior;
```
