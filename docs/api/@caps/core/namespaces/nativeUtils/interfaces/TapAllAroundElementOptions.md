# Interface: TapAllAroundElementOptions

Defined in: packages/core/src/helpers/native/utils.ts:95

Tap around an element until `check()` stops throwing.

## Extends

- [`ElementOrSelector`](ElementOrSelector.md).[`WaitOptions`](WaitOptions.md)

## Properties

### check?

```ts
optional check?: () => void;
```

Defined in: packages/core/src/helpers/native/utils.ts:97

#### Returns

`void`

***

### element?

```ts
optional element?: WdioElement;
```

Defined in: packages/core/src/helpers/native/utils.ts:42

#### Inherited from

[`ElementOrSelector`](ElementOrSelector.md).[`element`](ElementOrSelector.md#element)

***

### interval?

```ts
optional interval?: number;
```

Defined in: packages/core/src/helpers/native/utils.ts:56

poll interval in ms; WebdriverIO defaults to 500 when omitted

#### Inherited from

[`WaitOptions`](WaitOptions.md).[`interval`](WaitOptions.md#interval)

***

### selector?

```ts
optional selector?: string;
```

Defined in: packages/core/src/helpers/native/utils.ts:43

#### Inherited from

[`ElementOrSelector`](ElementOrSelector.md).[`selector`](ElementOrSelector.md#selector)

***

### timeout?

```ts
optional timeout?: number;
```

Defined in: packages/core/src/helpers/native/utils.ts:54

#### Inherited from

[`WaitOptions`](WaitOptions.md).[`timeout`](WaitOptions.md#timeout)

***

### timeoutMsg?

```ts
optional timeoutMsg?: string;
```

Defined in: packages/core/src/helpers/native/utils.ts:96
