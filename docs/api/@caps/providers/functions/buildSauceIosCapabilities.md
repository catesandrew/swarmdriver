# Function: buildSauceIosCapabilities()

```ts
function buildSauceIosCapabilities(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:595

Build Sauce iOS Simulator Capabilities

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into a `capabilities` entry

### appium:platformVersion

```ts
appium:platformVersion: string = opts.platformVersion;
```

### sauceOptions

```ts
sauceOptions: object = {};
```
