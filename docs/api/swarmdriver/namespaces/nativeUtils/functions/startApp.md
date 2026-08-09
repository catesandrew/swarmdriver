# Function: startApp()

```ts
function startApp(bundleId, appActivity): Promise<void>;
```

Defined in: src/helpers/native/utils.js:437

Start an app with the given bundle ID and app activity. Use this with the option `autoLaunch: false` to prevent the app from opening by default.

## Parameters

### bundleId

`string`

The app ID (package ID for Android, bundle ID for iOS).

### appActivity

`string`

The Android activity (optional, required for Android).

## Returns

`Promise`\<`void`\>

A Promise that resolves when the app is successfully started.
