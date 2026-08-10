# Function: buildSauceAndroidRealDeviceCapabilities()

```ts
function buildSauceAndroidRealDeviceCapabilities(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:454

Build Sauce Android Capabilities for Real Devices

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into a `capabilities` entry

### appium:appActivity

```ts
appium:appActivity: string = opts.appActivity;
```

### appium:appPackage

```ts
appium:appPackage: string = opts.appPackage;
```

### appium:platformVersion

```ts
appium:platformVersion: string = opts.platformVersion;
```
