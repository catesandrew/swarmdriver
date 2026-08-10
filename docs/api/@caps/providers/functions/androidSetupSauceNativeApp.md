# Function: androidSetupSauceNativeApp()

```ts
function androidSetupSauceNativeApp(params?): WdioConfig;
```

Defined in: providers/src/machines/android/native-app.ts:32

Generate an android config used to test native apps on saucelabs.

## Parameters

### params?

[`SauceSetupOptions`](../interfaces/SauceSetupOptions.md) = `{}`

overrides layered on top of the env-derived capabilities;
  `params.envs` is the environment to parse Sauce and Android real-device
  capabilities out of.

## Returns

[`WdioConfig`](../interfaces/WdioConfig.md)

a config carrying the configured `capabilities` for the session.
