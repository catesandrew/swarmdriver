# Interface: ElementOrSelector

Defined in: packages/core/src/helpers/native/utils.ts:41

"Either hand me the element, or hand me a selector and I will look it up."

This pair recurs across nearly every helper below, which is why it is one
named type rather than repeated inline: callers that already hold an element
skip the round trip, callers that do not pass a selector instead.

`selector` is `string`, not the broader `Selector` used by the browser
helpers: everything in this module funnels through `buildSelector()`, which
does string surgery (`.replace()`, `.slice()`) to translate a React Native
`testID` into an Appium locator. A matcher object or function would throw.

## Extended by

- [`WaitForShownOptions`](WaitForShownOptions.md)
- [`TapElementOptions`](TapElementOptions.md)
- [`TapAllAroundElementOptions`](TapAllAroundElementOptions.md)

## Properties

### element?

```ts
optional element?: WdioElement;
```

Defined in: packages/core/src/helpers/native/utils.ts:42

***

### selector?

```ts
optional selector?: string;
```

Defined in: packages/core/src/helpers/native/utils.ts:43
