# Interface: SauceSetupOptions

Defined in: providers/src/types.ts:200

Options accepted by the three top-level `setupSauce*` reducers.

The index signature mirrors the runtime contract: every reducer forwards its
unrecognised `...params` down to the capability builders and to the reporter
setup functions, so callers legitimately pass keys this package never names.

## Extends

- [`SauceCapabilityValues`](SauceCapabilityValues.md).[`SauceServiceSettings`](SauceServiceSettings.md)

## Indexable

```ts
[option: string]: unknown
```

## Properties

### acceptInsecureCerts?

```ts
optional acceptInsecureCerts?: boolean;
```

Defined in: providers/src/types.ts:40

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`acceptInsecureCerts`](SauceCapabilityValues.md#acceptinsecurecerts)

***

### accessKey?

```ts
optional accessKey?: string;
```

Defined in: providers/src/types.ts:99

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`accessKey`](SauceCapabilityValues.md#accesskey)

***

### allowTouchIdEnroll?

```ts
optional allowTouchIdEnroll?: boolean;
```

Defined in: providers/src/types.ts:85

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`allowTouchIdEnroll`](SauceCapabilityValues.md#allowtouchidenroll)

***

### app?

```ts
optional app?: string;
```

Defined in: providers/src/types.ts:52

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`app`](SauceCapabilityValues.md#app)

***

### appActivity?

```ts
optional appActivity?: string;
```

Defined in: providers/src/types.ts:54

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`appActivity`](SauceCapabilityValues.md#appactivity)

***

### appiumVersion?

```ts
optional appiumVersion?: string;
```

Defined in: providers/src/types.ts:72

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`appiumVersion`](SauceCapabilityValues.md#appiumversion)

***

### appPackage?

```ts
optional appPackage?: string;
```

Defined in: providers/src/types.ts:53

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`appPackage`](SauceCapabilityValues.md#apppackage)

***

### audioCapture?

```ts
optional audioCapture?: boolean;
```

Defined in: providers/src/types.ts:86

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`audioCapture`](SauceCapabilityValues.md#audiocapture)

***

### autoAcceptAlerts?

```ts
optional autoAcceptAlerts?: boolean;
```

Defined in: providers/src/types.ts:59

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`autoAcceptAlerts`](SauceCapabilityValues.md#autoacceptalerts)

***

### automationName?

```ts
optional automationName?: string;
```

Defined in: providers/src/types.ts:51

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`automationName`](SauceCapabilityValues.md#automationname)

***

### avoidProxy?

```ts
optional avoidProxy?: boolean;
```

Defined in: providers/src/types.ts:64

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`avoidProxy`](SauceCapabilityValues.md#avoidproxy)

***

### browserName?

```ts
optional browserName?: string;
```

Defined in: providers/src/types.ts:35

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`browserName`](SauceCapabilityValues.md#browsername)

***

### browsers?

```ts
optional browsers?: number[];
```

Defined in: providers/src/types.ts:210

***

### browserVersion?

```ts
optional browserVersion?: string;
```

Defined in: providers/src/types.ts:36

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`browserVersion`](SauceCapabilityValues.md#browserversion)

***

### build?

```ts
optional build?: string;
```

Defined in: providers/src/types.ts:96

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`build`](SauceCapabilityValues.md#build)

***

### buildSuffix?

```ts
optional buildSuffix?: string;
```

Defined in: providers/src/types.ts:204

***

### cacheId?

```ts
optional cacheId?: string;
```

Defined in: providers/src/types.ts:81

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`cacheId`](SauceCapabilityValues.md#cacheid)

***

### capturePerformance?

```ts
optional capturePerformance?: boolean;
```

Defined in: providers/src/types.ts:66

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`capturePerformance`](SauceCapabilityValues.md#captureperformance)

***

### carrierConnectivityOnly?

```ts
optional carrierConnectivityOnly?: boolean;
```

Defined in: providers/src/types.ts:80

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`carrierConnectivityOnly`](SauceCapabilityValues.md#carrierconnectivityonly)

***

### chromedriverVersion?

```ts
optional chromedriverVersion?: string;
```

Defined in: providers/src/types.ts:62

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`chromedriverVersion`](SauceCapabilityValues.md#chromedriverversion)

***

### commandTimeout?

```ts
optional commandTimeout?: number;
```

Defined in: providers/src/types.ts:68

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`commandTimeout`](SauceCapabilityValues.md#commandtimeout)

***

### config?

```ts
optional config?: WdioConfig;
```

Defined in: providers/src/types.ts:212

***

### customData?

```ts
optional customData?: Record<string, unknown>;
```

Defined in: providers/src/types.ts:101

Emitted as `custom-data`.

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`customData`](SauceCapabilityValues.md#customdata)

***

### customLogFiles?

```ts
optional customLogFiles?: string[];
```

Defined in: providers/src/types.ts:91

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`customLogFiles`](SauceCapabilityValues.md#customlogfiles)

***

### deviceName?

```ts
optional deviceName?: string;
```

Defined in: providers/src/types.ts:49

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`deviceName`](SauceCapabilityValues.md#devicename)

***

### deviceOrientation?

```ts
optional deviceOrientation?: string;
```

Defined in: providers/src/types.ts:56

Emitted as `appium:orientation`; `PORTRAIT` or `LANDSCAPE`.

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`deviceOrientation`](SauceCapabilityValues.md#deviceorientation)

***

### devices?

```ts
optional devices?: number[];
```

Defined in: providers/src/types.ts:211

***

### deviceType?

```ts
optional deviceType?: string;
```

Defined in: providers/src/types.ts:74

`tablet` or `phone`. Not narrowed: it arrives verbatim from an env var.

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`deviceType`](SauceCapabilityValues.md#devicetype)

***

### enableAnimations?

```ts
optional enableAnimations?: boolean;
```

Defined in: providers/src/types.ts:89

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`enableAnimations`](SauceCapabilityValues.md#enableanimations)

***

### envs?

```ts
optional envs?: Envs;
```

Defined in: providers/src/types.ts:201

***

### extendedDebugging?

```ts
optional extendedDebugging?: boolean;
```

Defined in: providers/src/types.ts:65

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`extendedDebugging`](SauceCapabilityValues.md#extendeddebugging)

***

### framework?

```ts
optional framework?: string;
```

Defined in: providers/src/types.ts:202

***

### geckodriverVersion?

```ts
optional geckodriverVersion?: string;
```

Defined in: providers/src/types.ts:63

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`geckodriverVersion`](SauceCapabilityValues.md#geckodriverversion)

***

### groupFolderRedirectEnabled?

```ts
optional groupFolderRedirectEnabled?: boolean;
```

Defined in: providers/src/types.ts:88

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`groupFolderRedirectEnabled`](SauceCapabilityValues.md#groupfolderredirectenabled)

***

### headless?

```ts
optional headless?: boolean;
```

Defined in: providers/src/types.ts:132

#### Inherited from

[`SauceServiceSettings`](SauceServiceSettings.md).[`headless`](SauceServiceSettings.md#headless)

***

### idleTimeout?

```ts
optional idleTimeout?: number;
```

Defined in: providers/src/types.ts:69

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`idleTimeout`](SauceCapabilityValues.md#idletimeout)

***

### junitReporterOutputFileFormat?

```ts
optional junitReporterOutputFileFormat?: (options) => string;
```

Defined in: providers/src/types.ts:220

Forwarded verbatim to `@caps/reporters`' junit setup. Left as `any`
because the runner hands the callback its own options object (`cid`,
`capabilities`, ...) whose full shape is owned by `@wdio/junit-reporter`,
not by us.

#### Parameters

##### options

`any`

#### Returns

`string`

***

### key?

```ts
optional key?: string;
```

Defined in: providers/src/types.ts:130

#### Inherited from

[`SauceServiceSettings`](SauceServiceSettings.md).[`key`](SauceServiceSettings.md#key)

***

### maxDuration?

```ts
optional maxDuration?: number;
```

Defined in: providers/src/types.ts:112

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`maxDuration`](SauceCapabilityValues.md#maxduration)

***

### maxErrorStackLength?

```ts
optional maxErrorStackLength?: number;
```

Defined in: providers/src/types.ts:135

#### Inherited from

[`SauceServiceSettings`](SauceServiceSettings.md).[`maxErrorStackLength`](SauceServiceSettings.md#maxerrorstacklength)

***

### name?

```ts
optional name?: string;
```

Defined in: providers/src/types.ts:95

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`name`](SauceCapabilityValues.md#name)

***

### networkCapture?

```ts
optional networkCapture?: boolean;
```

Defined in: providers/src/types.ts:87

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`networkCapture`](SauceCapabilityValues.md#networkcapture)

***

### newCommandTimeout?

```ts
optional newCommandTimeout?: number;
```

Defined in: providers/src/types.ts:58

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`newCommandTimeout`](SauceCapabilityValues.md#newcommandtimeout)

***

### noReset?

```ts
optional noReset?: boolean;
```

Defined in: providers/src/types.ts:57

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`noReset`](SauceCapabilityValues.md#noreset)

***

### otherApps?

```ts
optional otherApps?: string;
```

Defined in: providers/src/types.ts:75

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`otherApps`](SauceCapabilityValues.md#otherapps)

***

### pageLoadStrategy?

```ts
optional pageLoadStrategy?: string;
```

Defined in: providers/src/types.ts:42

`none`, `eager` or `normal`.

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`pageLoadStrategy`](SauceCapabilityValues.md#pageloadstrategy)

***

### phoneOnly?

```ts
optional phoneOnly?: boolean;
```

Defined in: providers/src/types.ts:77

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`phoneOnly`](SauceCapabilityValues.md#phoneonly)

***

### platformName?

```ts
optional platformName?: string;
```

Defined in: providers/src/types.ts:37

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`platformName`](SauceCapabilityValues.md#platformname)

***

### platformVersion?

```ts
optional platformVersion?: string;
```

Defined in: providers/src/types.ts:50

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`platformVersion`](SauceCapabilityValues.md#platformversion)

***

### preArgs?

```ts
optional preArgs?: string;
```

Defined in: providers/src/types.ts:117

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`preArgs`](SauceCapabilityValues.md#preargs)

***

### preBackground?

```ts
optional preBackground?: string;
```

Defined in: providers/src/types.ts:118

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`preBackground`](SauceCapabilityValues.md#prebackground)

***

### preExecutable?

```ts
optional preExecutable?: string;
```

Defined in: providers/src/types.ts:116

The four `pre*` fields are collapsed into a single `prerun` object.

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`preExecutable`](SauceCapabilityValues.md#preexecutable)

***

### preTimeout?

```ts
optional preTimeout?: string;
```

Defined in: providers/src/types.ts:119

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`preTimeout`](SauceCapabilityValues.md#pretimeout)

***

### priority?

```ts
optional priority?: number;
```

Defined in: providers/src/types.ts:113

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`priority`](SauceCapabilityValues.md#priority)

***

### privateDevicesOnly?

```ts
optional privateDevicesOnly?: boolean;
```

Defined in: providers/src/types.ts:78

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`privateDevicesOnly`](SauceCapabilityValues.md#privatedevicesonly)

***

### proxy?

```ts
optional proxy?: Record<string, unknown>;
```

Defined in: providers/src/types.ts:43

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`proxy`](SauceCapabilityValues.md#proxy)

***

### publicDevicesOnly?

```ts
optional publicDevicesOnly?: boolean;
```

Defined in: providers/src/types.ts:79

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`publicDevicesOnly`](SauceCapabilityValues.md#publicdevicesonly)

***

### recordLogs?

```ts
optional recordLogs?: boolean;
```

Defined in: providers/src/types.ts:109

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`recordLogs`](SauceCapabilityValues.md#recordlogs)

***

### recordScreenshots?

```ts
optional recordScreenshots?: boolean;
```

Defined in: providers/src/types.ts:108

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`recordScreenshots`](SauceCapabilityValues.md#recordscreenshots)

***

### recordVideo?

```ts
optional recordVideo?: boolean;
```

Defined in: providers/src/types.ts:106

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`recordVideo`](SauceCapabilityValues.md#recordvideo)

***

### region?

```ts
optional region?: string;
```

Defined in: providers/src/types.ts:131

#### Inherited from

[`SauceServiceSettings`](SauceServiceSettings.md).[`region`](SauceServiceSettings.md#region)

***

### reporters?

```ts
optional reporters?: number[];
```

Defined in: providers/src/types.ts:209

`Reporter`/`Browser`/`Device` in `@caps/core/enums` are plain numeric
maps, not string unions — these arrays hold their numeric members.

***

### resigningEnabled?

```ts
optional resigningEnabled?: boolean;
```

Defined in: providers/src/types.ts:82

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`resigningEnabled`](SauceCapabilityValues.md#resigningenabled)

***

### sauceConnect?

```ts
optional sauceConnect?: boolean;
```

Defined in: providers/src/types.ts:133

#### Inherited from

[`SauceServiceSettings`](SauceServiceSettings.md).[`sauceConnect`](SauceServiceSettings.md#sauceconnect)

***

### sauceLabsBypassScreenshotRestriction?

```ts
optional sauceLabsBypassScreenshotRestriction?: boolean;
```

Defined in: providers/src/types.ts:84

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`sauceLabsBypassScreenshotRestriction`](SauceCapabilityValues.md#saucelabsbypassscreenshotrestriction)

***

### sauceLabsImageInjectionEnabled?

```ts
optional sauceLabsImageInjectionEnabled?: boolean;
```

Defined in: providers/src/types.ts:83

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`sauceLabsImageInjectionEnabled`](SauceCapabilityValues.md#saucelabsimageinjectionenabled)

***

### screenResolution?

```ts
optional screenResolution?: string;
```

Defined in: providers/src/types.ts:67

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`screenResolution`](SauceCapabilityValues.md#screenresolution)

***

### setupDeviceLock?

```ts
optional setupDeviceLock?: boolean;
```

Defined in: providers/src/types.ts:92

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`setupDeviceLock`](SauceCapabilityValues.md#setupdevicelock)

***

### specRepporterShowPreface?

```ts
optional specRepporterShowPreface?: boolean;
```

Defined in: providers/src/types.ts:213

***

### strictFileInteractability?

```ts
optional strictFileInteractability?: boolean;
```

Defined in: providers/src/types.ts:45

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`strictFileInteractability`](SauceCapabilityValues.md#strictfileinteractability)

***

### systemAlertsDelayEnabled?

```ts
optional systemAlertsDelayEnabled?: boolean;
```

Defined in: providers/src/types.ts:90

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`systemAlertsDelayEnabled`](SauceCapabilityValues.md#systemalertsdelayenabled)

***

### tabletOnly?

```ts
optional tabletOnly?: boolean;
```

Defined in: providers/src/types.ts:76

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`tabletOnly`](SauceCapabilityValues.md#tabletonly)

***

### tags?

```ts
optional tags?: string[];
```

Defined in: providers/src/types.ts:97

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`tags`](SauceCapabilityValues.md#tags)

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

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`timeouts`](SauceCapabilityValues.md#timeouts)

***

### timeZone?

```ts
optional timeZone?: string;
```

Defined in: providers/src/types.ts:114

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`timeZone`](SauceCapabilityValues.md#timezone)

***

### tunnelName?

```ts
optional tunnelName?: string;
```

Defined in: providers/src/types.ts:104

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`tunnelName`](SauceCapabilityValues.md#tunnelname)

***

### tunnelOwner?

```ts
optional tunnelOwner?: string;
```

Defined in: providers/src/types.ts:105

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`tunnelOwner`](SauceCapabilityValues.md#tunnelowner)

***

### tunnelPrefix?

```ts
optional tunnelPrefix?: string;
```

Defined in: providers/src/types.ts:203

***

### unhandledPromptBehavior?

```ts
optional unhandledPromptBehavior?: string;
```

Defined in: providers/src/types.ts:46

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`unhandledPromptBehavior`](SauceCapabilityValues.md#unhandledpromptbehavior)

***

### uploadLogs?

```ts
optional uploadLogs?: boolean;
```

Defined in: providers/src/types.ts:134

#### Inherited from

[`SauceServiceSettings`](SauceServiceSettings.md).[`uploadLogs`](SauceServiceSettings.md#uploadlogs)

***

### user?

```ts
optional user?: string;
```

Defined in: providers/src/types.ts:129

#### Inherited from

[`SauceServiceSettings`](SauceServiceSettings.md).[`user`](SauceServiceSettings.md#user)

***

### username?

```ts
optional username?: string;
```

Defined in: providers/src/types.ts:98

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`username`](SauceCapabilityValues.md#username)

***

### videoUploadOnPass?

```ts
optional videoUploadOnPass?: boolean;
```

Defined in: providers/src/types.ts:107

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`videoUploadOnPass`](SauceCapabilityValues.md#videouploadonpass)

***

### visibility?

```ts
optional visibility?: string;
```

Defined in: providers/src/types.ts:103

Emitted as `public`.

#### Inherited from

[`SauceCapabilityValues`](SauceCapabilityValues.md).[`visibility`](SauceCapabilityValues.md#visibility)
