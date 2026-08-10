# Function: buildMobileAppiumTimeoutCapabilities()

```ts
function buildMobileAppiumTimeoutCapabilities(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:1137

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

### appium:newCommandTimeout

```ts
appium:newCommandTimeout: number = opts.newCommandTimeout;
```
