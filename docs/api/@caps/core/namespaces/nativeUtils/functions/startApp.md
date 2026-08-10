# Function: startApp()

```ts
function startApp(bundleId, appActivity): Promise<void>;
```

Defined in: packages/core/src/helpers/native/utils.ts:510

Start an app with the given bundle ID and app activity. Use this with the option `autoLaunch: false` to prevent the app from opening by default.

## Parameters

### bundleId

`any`

The app ID (package ID for Android, bundle ID for iOS).

### appActivity

`any`

The Android activity (optional, required for Android).

## Returns

`Promise`\<`void`\>

A Promise that resolves when the app is successfully started.
