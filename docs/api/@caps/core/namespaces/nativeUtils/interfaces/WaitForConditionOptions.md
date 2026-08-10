# Interface: WaitForConditionOptions

Defined in: packages/core/src/helpers/native/utils.ts:75

How long to keep retrying, and how often.

## Extends

- [`WaitOptions`](WaitOptions.md)

## Properties

### condition?

```ts
optional condition?: () => any;
```

Defined in: packages/core/src/helpers/native/utils.ts:76

#### Returns

`any`

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

Defined in: packages/core/src/helpers/native/utils.ts:77
