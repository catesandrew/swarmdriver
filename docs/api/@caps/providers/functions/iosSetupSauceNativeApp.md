# Function: iosSetupSauceNativeApp()

```ts
function iosSetupSauceNativeApp(params?): WdioConfig;
```

Defined in: providers/src/machines/ios/native-app.ts:47

Configures and returns capabilities for initializing an iOS mobile test session on Sauce Labs,
tailored for running native app tests on real devices or simulators. This function combines
capabilities from environment variables, specific iOS device settings, Appium timeout settings,
and Sauce Labs specific optional settings into a single capabilities object.

## Parameters

### params?

[`SauceSetupOptions`](../interfaces/SauceSetupOptions.md) = `{}`

overrides layered on top of the env-derived capabilities;
  `params.envs` is the environment to parse Sauce and iOS real-device
  capabilities out of.

## Returns

[`WdioConfig`](../interfaces/WdioConfig.md)

a config carrying the configured `capabilities` for the session.

## Example

```ts
const testCapabilities = iosSetupSauceNativeApp({
  envs: process.env,
  platformName: 'iOS',
  platformVersion: '14.0',
  deviceName: 'iPhone 11',
  app: 'sauce-storage:myapp.zip'
});

// Use `testCapabilities` with your Appium client to start a test session on Sauce Labs
```
