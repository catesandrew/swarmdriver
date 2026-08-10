# Function: buildMobileAppAppiumCapabilitiesSauceSpecificOptional()

```ts
function buildMobileAppAppiumCapabilitiesSauceSpecificOptional(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:1203

Optional, Sauce-specific capabilities that you can use in your Appium tests.
They can be added to the `sauce:options` block of your session creation code.

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into `sauce:options`

### allowTouchIdEnroll

```ts
allowTouchIdEnroll: boolean = opts.allowTouchIdEnroll;
```

### appiumVersion

```ts
appiumVersion: string = opts.appiumVersion;
```

### audioCapture

```ts
audioCapture: boolean = opts.audioCapture;
```

### cacheId

```ts
cacheId: string = opts.cacheId;
```

### carrierConnectivityOnly

```ts
carrierConnectivityOnly: boolean = opts.carrierConnectivityOnly;
```

### customLogFiles

```ts
customLogFiles: string[] = opts.customLogFiles;
```

### deviceOrientation

```ts
deviceOrientation: string = opts.deviceOrientation;
```

### deviceType

```ts
deviceType: string = opts.deviceType;
```

### enableAnimations

```ts
enableAnimations: boolean = opts.enableAnimations;
```

### groupFolderRedirectEnabled

```ts
groupFolderRedirectEnabled: boolean = opts.groupFolderRedirectEnabled;
```

### networkCapture

```ts
networkCapture: boolean = opts.networkCapture;
```

### otherApps

```ts
otherApps: string = opts.otherApps;
```

### phoneOnly

```ts
phoneOnly: boolean = opts.phoneOnly;
```

### privateDevicesOnly

```ts
privateDevicesOnly: boolean = opts.privateDevicesOnly;
```

### publicDevicesOnly

```ts
publicDevicesOnly: boolean = opts.publicDevicesOnly;
```

### resigningEnabled

```ts
resigningEnabled: boolean = opts.resigningEnabled;
```

### sauceLabsBypassScreenshotRestriction

```ts
sauceLabsBypassScreenshotRestriction: boolean = opts.sauceLabsBypassScreenshotRestriction;
```

### sauceLabsImageInjectionEnabled

```ts
sauceLabsImageInjectionEnabled: boolean = opts.sauceLabsImageInjectionEnabled;
```

### setupDeviceLock

```ts
setupDeviceLock: boolean = opts.setupDeviceLock;
```

### systemAlertsDelayEnabled

```ts
systemAlertsDelayEnabled: boolean = opts.systemAlertsDelayEnabled;
```

### tabletOnly

```ts
tabletOnly: boolean = opts.tabletOnly;
```
