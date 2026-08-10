# Interface: SauceCapabilityValues

Defined in: providers/src/types.ts:33

The flat, un-prefixed settings bag that flows between the `parse*` and
`build*` capability functions.

This is the package's central type. A `parse*` function reads env vars and
emits a subset of it; a `build*` function consumes it and emits the
correspondingly-shaped slice of a real capability object (adding the
`appium:` prefix, or nesting under `sauce:options`, as required). Every field
is optional because every field is independently opt-in via its env var, and
the builders spread nothing at all when a value is absent.

## Extended by

- [`SauceSetupOptions`](SauceSetupOptions.md)

## Properties

### acceptInsecureCerts?

```ts
optional acceptInsecureCerts?: boolean;
```

Defined in: providers/src/types.ts:40

***

### accessKey?

```ts
optional accessKey?: string;
```

Defined in: providers/src/types.ts:99

***

### allowTouchIdEnroll?

```ts
optional allowTouchIdEnroll?: boolean;
```

Defined in: providers/src/types.ts:85

***

### app?

```ts
optional app?: string;
```

Defined in: providers/src/types.ts:52

***

### appActivity?

```ts
optional appActivity?: string;
```

Defined in: providers/src/types.ts:54

***

### appiumVersion?

```ts
optional appiumVersion?: string;
```

Defined in: providers/src/types.ts:72

***

### appPackage?

```ts
optional appPackage?: string;
```

Defined in: providers/src/types.ts:53

***

### audioCapture?

```ts
optional audioCapture?: boolean;
```

Defined in: providers/src/types.ts:86

***

### autoAcceptAlerts?

```ts
optional autoAcceptAlerts?: boolean;
```

Defined in: providers/src/types.ts:59

***

### automationName?

```ts
optional automationName?: string;
```

Defined in: providers/src/types.ts:51

***

### avoidProxy?

```ts
optional avoidProxy?: boolean;
```

Defined in: providers/src/types.ts:64

***

### browserName?

```ts
optional browserName?: string;
```

Defined in: providers/src/types.ts:35

***

### browserVersion?

```ts
optional browserVersion?: string;
```

Defined in: providers/src/types.ts:36

***

### build?

```ts
optional build?: string;
```

Defined in: providers/src/types.ts:96

***

### cacheId?

```ts
optional cacheId?: string;
```

Defined in: providers/src/types.ts:81

***

### capturePerformance?

```ts
optional capturePerformance?: boolean;
```

Defined in: providers/src/types.ts:66

***

### carrierConnectivityOnly?

```ts
optional carrierConnectivityOnly?: boolean;
```

Defined in: providers/src/types.ts:80

***

### chromedriverVersion?

```ts
optional chromedriverVersion?: string;
```

Defined in: providers/src/types.ts:62

***

### commandTimeout?

```ts
optional commandTimeout?: number;
```

Defined in: providers/src/types.ts:68

***

### customData?

```ts
optional customData?: Record<string, unknown>;
```

Defined in: providers/src/types.ts:101

Emitted as `custom-data`.

***

### customLogFiles?

```ts
optional customLogFiles?: string[];
```

Defined in: providers/src/types.ts:91

***

### deviceName?

```ts
optional deviceName?: string;
```

Defined in: providers/src/types.ts:49

***

### deviceOrientation?

```ts
optional deviceOrientation?: string;
```

Defined in: providers/src/types.ts:56

Emitted as `appium:orientation`; `PORTRAIT` or `LANDSCAPE`.

***

### deviceType?

```ts
optional deviceType?: string;
```

Defined in: providers/src/types.ts:74

`tablet` or `phone`. Not narrowed: it arrives verbatim from an env var.

***

### enableAnimations?

```ts
optional enableAnimations?: boolean;
```

Defined in: providers/src/types.ts:89

***

### extendedDebugging?

```ts
optional extendedDebugging?: boolean;
```

Defined in: providers/src/types.ts:65

***

### geckodriverVersion?

```ts
optional geckodriverVersion?: string;
```

Defined in: providers/src/types.ts:63

***

### groupFolderRedirectEnabled?

```ts
optional groupFolderRedirectEnabled?: boolean;
```

Defined in: providers/src/types.ts:88

***

### idleTimeout?

```ts
optional idleTimeout?: number;
```

Defined in: providers/src/types.ts:69

***

### maxDuration?

```ts
optional maxDuration?: number;
```

Defined in: providers/src/types.ts:112

***

### name?

```ts
optional name?: string;
```

Defined in: providers/src/types.ts:95

***

### networkCapture?

```ts
optional networkCapture?: boolean;
```

Defined in: providers/src/types.ts:87

***

### newCommandTimeout?

```ts
optional newCommandTimeout?: number;
```

Defined in: providers/src/types.ts:58

***

### noReset?

```ts
optional noReset?: boolean;
```

Defined in: providers/src/types.ts:57

***

### otherApps?

```ts
optional otherApps?: string;
```

Defined in: providers/src/types.ts:75

***

### pageLoadStrategy?

```ts
optional pageLoadStrategy?: string;
```

Defined in: providers/src/types.ts:42

`none`, `eager` or `normal`.

***

### phoneOnly?

```ts
optional phoneOnly?: boolean;
```

Defined in: providers/src/types.ts:77

***

### platformName?

```ts
optional platformName?: string;
```

Defined in: providers/src/types.ts:37

***

### platformVersion?

```ts
optional platformVersion?: string;
```

Defined in: providers/src/types.ts:50

***

### preArgs?

```ts
optional preArgs?: string;
```

Defined in: providers/src/types.ts:117

***

### preBackground?

```ts
optional preBackground?: string;
```

Defined in: providers/src/types.ts:118

***

### preExecutable?

```ts
optional preExecutable?: string;
```

Defined in: providers/src/types.ts:116

The four `pre*` fields are collapsed into a single `prerun` object.

***

### preTimeout?

```ts
optional preTimeout?: string;
```

Defined in: providers/src/types.ts:119

***

### priority?

```ts
optional priority?: number;
```

Defined in: providers/src/types.ts:113

***

### privateDevicesOnly?

```ts
optional privateDevicesOnly?: boolean;
```

Defined in: providers/src/types.ts:78

***

### proxy?

```ts
optional proxy?: Record<string, unknown>;
```

Defined in: providers/src/types.ts:43

***

### publicDevicesOnly?

```ts
optional publicDevicesOnly?: boolean;
```

Defined in: providers/src/types.ts:79

***

### recordLogs?

```ts
optional recordLogs?: boolean;
```

Defined in: providers/src/types.ts:109

***

### recordScreenshots?

```ts
optional recordScreenshots?: boolean;
```

Defined in: providers/src/types.ts:108

***

### recordVideo?

```ts
optional recordVideo?: boolean;
```

Defined in: providers/src/types.ts:106

***

### resigningEnabled?

```ts
optional resigningEnabled?: boolean;
```

Defined in: providers/src/types.ts:82

***

### sauceLabsBypassScreenshotRestriction?

```ts
optional sauceLabsBypassScreenshotRestriction?: boolean;
```

Defined in: providers/src/types.ts:84

***

### sauceLabsImageInjectionEnabled?

```ts
optional sauceLabsImageInjectionEnabled?: boolean;
```

Defined in: providers/src/types.ts:83

***

### screenResolution?

```ts
optional screenResolution?: string;
```

Defined in: providers/src/types.ts:67

***

### setupDeviceLock?

```ts
optional setupDeviceLock?: boolean;
```

Defined in: providers/src/types.ts:92

***

### strictFileInteractability?

```ts
optional strictFileInteractability?: boolean;
```

Defined in: providers/src/types.ts:45

***

### systemAlertsDelayEnabled?

```ts
optional systemAlertsDelayEnabled?: boolean;
```

Defined in: providers/src/types.ts:90

***

### tabletOnly?

```ts
optional tabletOnly?: boolean;
```

Defined in: providers/src/types.ts:76

***

### tags?

```ts
optional tags?: string[];
```

Defined in: providers/src/types.ts:97

***

### timeouts?

```ts
optional timeouts?: object;
```

Defined in: providers/src/types.ts:44

#### implicit?

```ts
optional implicit?: number;
```

#### pageLoad?

```ts
optional pageLoad?: number;
```

#### script?

```ts
optional script?: number;
```

***

### timeZone?

```ts
optional timeZone?: string;
```

Defined in: providers/src/types.ts:114

***

### tunnelName?

```ts
optional tunnelName?: string;
```

Defined in: providers/src/types.ts:104

***

### tunnelOwner?

```ts
optional tunnelOwner?: string;
```

Defined in: providers/src/types.ts:105

***

### unhandledPromptBehavior?

```ts
optional unhandledPromptBehavior?: string;
```

Defined in: providers/src/types.ts:46

***

### username?

```ts
optional username?: string;
```

Defined in: providers/src/types.ts:98

***

### videoUploadOnPass?

```ts
optional videoUploadOnPass?: boolean;
```

Defined in: providers/src/types.ts:107

***

### visibility?

```ts
optional visibility?: string;
```

Defined in: providers/src/types.ts:103

Emitted as `public`.
