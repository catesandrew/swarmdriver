# Function: buildDesktopMobileCapabilitiesSauceSpecificOptional()

```ts
function buildDesktopMobileCapabilitiesSauceSpecificOptional(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:1409

Optional Sauce Labs-specific capabilities that you can use for any Sauce Labs
test. They must be added to the `sauce:options` block of your session
creation code.

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into `sauce:options`

### accessKey

```ts
accessKey: string = opts.accessKey;
```

### build

```ts
build: string = opts.build;
```

### custom-data

```ts
custom-data: Record<string, unknown> = opts.customData;
```

### name

```ts
name: string = opts.name;
```

### public

```ts
public: string = opts.visibility;
```

### recordLogs

```ts
recordLogs: boolean = opts.recordLogs;
```

### recordScreenshots

```ts
recordScreenshots: boolean = opts.recordScreenshots;
```

### recordVideo

```ts
recordVideo: boolean = opts.recordVideo;
```

### tags

```ts
tags: string[] = opts.tags;
```

### tunnelName

```ts
tunnelName: string = opts.tunnelName;
```

### tunnelOwner

```ts
tunnelOwner: string = opts.tunnelOwner;
```

### username

```ts
username: string = opts.username;
```

### videoUploadOnPass

```ts
videoUploadOnPass: boolean = opts.videoUploadOnPass;
```
