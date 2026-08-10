# Function: buildMobileAppiumIosWebDriverAgentTimeoutCapabilities()

```ts
function buildMobileAppiumIosWebDriverAgentTimeoutCapabilities(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:1178

`WebDriverAgent` is a [WebDriver server](https://w3c.github.io/webdriver/)
implementation for iOS that is used to remote control iOS devices. It is
developed for end-to-end testing and is adopted via the [XCUITest
driver](https://github.com/appium/appium-xcuitest-driver). The
`WebDriverAgent` has it's own timeout capabilities that can be controlled by
the driver during the test session. The most important ones are explained
below.

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into a `capabilities` entry
