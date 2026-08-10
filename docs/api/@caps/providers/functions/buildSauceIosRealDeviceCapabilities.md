# Function: buildSauceIosRealDeviceCapabilities()

```ts
function buildSauceIosRealDeviceCapabilities(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:673

Build Sauce iOS Capabilities for Real Devices

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into a `capabilities` entry

### appium:autoAcceptAlerts

```ts
appium:autoAcceptAlerts: boolean = opts.autoAcceptAlerts;
```

### appium:platformVersion

```ts
appium:platformVersion: string = opts.platformVersion;
```
