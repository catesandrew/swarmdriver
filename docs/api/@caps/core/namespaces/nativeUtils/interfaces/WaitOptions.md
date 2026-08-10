# Interface: WaitOptions

Defined in: packages/core/src/helpers/native/utils.ts:53

How long to keep retrying, and how often.

## Extended by

- [`WaitForShownOptions`](WaitForShownOptions.md)
- [`WaitForAnyShownOptions`](WaitForAnyShownOptions.md)
- [`WaitForConditionOptions`](WaitForConditionOptions.md)
- [`TapAllAroundElementOptions`](TapAllAroundElementOptions.md)

## Properties

### interval?

```ts
optional interval?: number;
```

Defined in: packages/core/src/helpers/native/utils.ts:56

poll interval in ms; WebdriverIO defaults to 500 when omitted

***

### timeout?

```ts
optional timeout?: number;
```

Defined in: packages/core/src/helpers/native/utils.ts:54
