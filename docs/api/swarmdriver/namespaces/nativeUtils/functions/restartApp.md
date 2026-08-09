# Function: restartApp()

```ts
function restartApp(bundleId): Promise<void>;
```

Defined in: src/helpers/native/utils.js:405

The app is opened by Appium by default, when we start a new test
the app needs to be reset

## Parameters

### bundleId

`string`

App ID (package ID for Android, bundle ID for iOS)

## Returns

`Promise`\<`void`\>
