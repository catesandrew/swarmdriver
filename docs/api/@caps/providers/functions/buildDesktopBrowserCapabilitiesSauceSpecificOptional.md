# Function: buildDesktopBrowserCapabilitiesSauceSpecificOptional()

```ts
function buildDesktopBrowserCapabilitiesSauceSpecificOptional(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:897

Browser-specific optional capabilities you can add to the `sauce:options`
block of your test session creation code.

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into `sauce:options`

### avoidProxy

```ts
avoidProxy: boolean = opts.avoidProxy;
```

### capturePerformance

```ts
capturePerformance: boolean = opts.capturePerformance;
```

### chromedriverVersion

```ts
chromedriverVersion: string = opts.chromedriverVersion;
```

### commandTimeout

```ts
commandTimeout: number = opts.commandTimeout;
```

### extendedDebugging

```ts
extendedDebugging: boolean = opts.extendedDebugging;
```

### geckodriverVersion

```ts
geckodriverVersion: string = opts.geckodriverVersion;
```

### idleTimeout

```ts
idleTimeout: number = opts.idleTimeout;
```

### screenResolution

```ts
screenResolution: string = opts.screenResolution;
```
