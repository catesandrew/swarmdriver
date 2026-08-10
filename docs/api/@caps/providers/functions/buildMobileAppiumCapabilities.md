# Function: buildMobileAppiumCapabilities()

```ts
function buildMobileAppiumCapabilities(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:990

As the W3C WebDriver Protocol is supported in Appium v1.6.5 and higher, and
required for Appium v2.0 (currently in beta), we encourage and support using
it for your Appium mobile app tests.

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into a `capabilities` entry

### appium:app

```ts
appium:app: string = opts.app;
```

### appium:automationName

```ts
appium:automationName: string = opts.automationName;
```

### appium:deviceName

```ts
appium:deviceName: string = opts.deviceName;
```

### appium:noReset

```ts
appium:noReset: boolean = opts.noReset;
```

### appium:orientation

```ts
appium:orientation: string = opts.deviceOrientation;
```

### browserName

```ts
browserName: string = opts.browserName;
```

### platformName

```ts
platformName: string = opts.platformName;
```
