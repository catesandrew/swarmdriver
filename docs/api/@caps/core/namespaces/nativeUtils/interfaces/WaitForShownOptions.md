# Interface: WaitForShownOptions

Defined in: packages/core/src/helpers/native/utils.ts:71

"Either hand me the element, or hand me a selector and I will look it up."

This pair recurs across nearly every helper below, which is why it is one
named type rather than repeated inline: callers that already hold an element
skip the round trip, callers that do not pass a selector instead.

`selector` is `string`, not the broader `Selector` used by the browser
helpers: everything in this module funnels through `buildSelector()`, which
does string surgery (`.replace()`, `.slice()`) to translate a React Native
`testID` into an Appium locator. A matcher object or function would throw.

## Extends

- [`ElementOrSelector`](ElementOrSelector.md).[`WaitOptions`](WaitOptions.md)

## Properties

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
