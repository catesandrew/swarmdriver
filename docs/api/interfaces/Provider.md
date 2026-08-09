# Interface: Provider

Defined in: src/providers/provider.js:15

## Properties

### applyEnvDefaults

```ts
applyEnvDefaults: (envs, context) => void;
```

Defined in: src/providers/provider.js:18

Mutates `envs` in place, filling in the provider's defaults for any
  variable the caller left unset. Must never overwrite an existing value.

#### Parameters

##### envs

`any`

##### context

[`ProviderEnvContext`](ProviderEnvContext.md)

#### Returns

`void`

***

### name

```ts
name: string;
```

Defined in: src/providers/provider.js:16

Registry key. Also the value users put in `WDIO_PROVIDER`.

***

### setupDesktopBrowsers

```ts
setupDesktopBrowsers: (options) => any;
```

Defined in: src/providers/provider.js:21

Web application, desktop browsers (`scope=browser`, `metal=desktop`).

#### Parameters

##### options

[`ProviderSetupOptions`](ProviderSetupOptions.md)

#### Returns

`any`

***

### setupDeviceBrowsers

```ts
setupDeviceBrowsers: (options) => any;
```

Defined in: src/providers/provider.js:23

Web application, mobile browsers (`scope=browser`, `metal=device`).

#### Parameters

##### options

[`ProviderSetupOptions`](ProviderSetupOptions.md)

#### Returns

`any`

***

### setupNativeApp

```ts
setupNativeApp: (options) => any;
```

Defined in: src/providers/provider.js:25

Native application on a device (`scope=app`).

#### Parameters

##### options

[`ProviderSetupOptions`](ProviderSetupOptions.md)

#### Returns

`any`
