# Function: restartApp()

```ts
function restartApp(bundleId): Promise<void>;
```

Defined in: packages/core/src/helpers/native/utils.ts:478

The app is opened by Appium by default, when we start a new test
the app needs to be reset

## Parameters

### bundleId

`any`

App ID (package ID for Android, bundle ID for iOS)

## Returns

`Promise`\<`void`\>
