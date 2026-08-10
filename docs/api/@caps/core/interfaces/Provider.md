# Interface: Provider

Defined in: packages/core/src/providers/provider.ts:52

The cloud-provider contract.

A provider owns everything that is specific to one remote grid vendor: the
environment-variable defaults it wants applied, and the three entry points
that turn an environment into a WebdriverIO config.

Everything a provider returns is a complete WebdriverIO config object. In
particular, connection details (`hostname`, `port`, `path`, `protocol`) MUST
be returned at the **top level** of that object, never inside `capabilities`.
WebdriverIO v9 treats capabilities as strict W3C, so a per-capability
`hostname` is silently dropped and the session quietly falls back to
`127.0.0.1:4444`.

## Properties

### name

```ts
name: string;
```

Defined in: packages/core/src/providers/provider.ts:54

Registry key. Also the value users put in `WDIO_PROVIDER`.

## Methods

### applyEnvDefaults()

```ts
applyEnvDefaults(envs, context): void;
```

Defined in: packages/core/src/providers/provider.ts:60

Mutates `envs` in place, filling in the provider's defaults for any
variable the caller left unset. Must never overwrite an existing value.

#### Parameters

##### envs

[`Envs`](../type-aliases/Envs.md)

##### context

[`ProviderEnvContext`](ProviderEnvContext.md)

#### Returns

`void`

***

### setupDesktopBrowsers()

```ts
setupDesktopBrowsers(options): WdioConfig;
```

Defined in: packages/core/src/providers/provider.ts:63

Web application, desktop browsers (`scope=browser`, `metal=desktop`).

#### Parameters

##### options

[`ProviderSetupOptions`](ProviderSetupOptions.md)

#### Returns

[`WdioConfig`](WdioConfig.md)

***

### setupDeviceBrowsers()

```ts
setupDeviceBrowsers(options): WdioConfig;
```

Defined in: packages/core/src/providers/provider.ts:66

Web application, mobile browsers (`scope=browser`, `metal=device`).

#### Parameters

##### options

[`ProviderSetupOptions`](ProviderSetupOptions.md)

#### Returns

[`WdioConfig`](WdioConfig.md)

***

### setupNativeApp()

```ts
setupNativeApp(options): WdioConfig;
```

Defined in: packages/core/src/providers/provider.ts:69

Native application on a device (`scope=app`).

#### Parameters

##### options

[`ProviderSetupOptions`](ProviderSetupOptions.md)

#### Returns

[`WdioConfig`](WdioConfig.md)
