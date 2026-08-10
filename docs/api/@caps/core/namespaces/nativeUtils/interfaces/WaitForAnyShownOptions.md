# Interface: WaitForAnyShownOptions

Defined in: packages/core/src/helpers/native/utils.ts:73

[ElementOrSelector](ElementOrSelector.md) in its plural form.

## Extends

- [`ElementsOrSelectors`](ElementsOrSelectors.md).[`WaitOptions`](WaitOptions.md)

## Properties

### elements?

```ts
optional elements?: WdioElement[];
```

Defined in: packages/core/src/helpers/native/utils.ts:48

#### Inherited from

[`ElementsOrSelectors`](ElementsOrSelectors.md).[`elements`](ElementsOrSelectors.md#elements)

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

### selectors?

```ts
optional selectors?: string[];
```

Defined in: packages/core/src/helpers/native/utils.ts:49

#### Inherited from

[`ElementsOrSelectors`](ElementsOrSelectors.md).[`selectors`](ElementsOrSelectors.md#selectors)

***

### timeout?

```ts
optional timeout?: number;
```

Defined in: packages/core/src/helpers/native/utils.ts:54

#### Inherited from

[`WaitOptions`](WaitOptions.md).[`timeout`](WaitOptions.md#timeout)
