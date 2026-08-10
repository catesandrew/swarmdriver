# Function: buildW3CWebDriverCapabilitiesRequired()

```ts
function buildW3CWebDriverCapabilitiesRequired(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:829

The W3C WebDriver primary test configuration settings for Sauce Labs desktop
browser tests and mobile tests

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into a `capabilities` entry

### browserName

```ts
browserName: string = opts.browserName;
```

### browserVersion

```ts
browserVersion: string = opts.browserVersion;
```

### platformName

```ts
platformName: string = opts.platformName;
```
