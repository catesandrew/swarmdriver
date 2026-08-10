# Function: buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional()

```ts
function buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional(opts?): object;
```

Defined in: providers/src/saucelabs/capabilities.ts:1523

The following are Sauce Labs-specific options that apply only to virtual
devices (desktop sessions, emulators and simulators). These options can be
added to the `sauce:options` block of your session creation code.

## Parameters

### opts?

[`SauceCapabilityValues`](../interfaces/SauceCapabilityValues.md) = `{}`

parsed settings to build from

## Returns

`object`

a slice to spread into `sauce:options`

### maxDuration

```ts
maxDuration: number = opts.maxDuration;
```

### prerun

```ts
prerun: object;
```

#### prerun.args

```ts
args: string = opts.preArgs;
```

#### prerun.background

```ts
background: string = opts.preBackground;
```

#### prerun.executable

```ts
executable: string = opts.preExecutable;
```

#### prerun.timeout

```ts
timeout: string = opts.preTimeout;
```

### priority

```ts
priority: number = opts.priority;
```

### timeZone

```ts
timeZone: string = opts.timeZone;
```
