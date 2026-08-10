# Class: BrowserPage

Defined in: packages/core/src/helpers/browser/page.ts:24

main page object containing all methods, selectors and functionality
that is shared across all page objects

## Constructors

### Constructor

```ts
new BrowserPage(__namedParameters?): Page;
```

Defined in: packages/core/src/helpers/browser/page.ts:29

#### Parameters

##### \_\_namedParameters?

`PageOptions` = `{}`

#### Returns

`Page`

## Properties

### selector?

```ts
optional selector?: Selector;
```

Defined in: packages/core/src/helpers/browser/page.ts:25

***

### urlPart?

```ts
optional urlPart?: string;
```

Defined in: packages/core/src/helpers/browser/page.ts:27

## Methods

### isShown()

```ts
isShown(element?): Promise<boolean>;
```

Defined in: packages/core/src/helpers/browser/page.ts:78

Give back if the element is displayed

#### Parameters

##### element?

[`WdioElement`](../interfaces/WdioElement.md)

#### Returns

`Promise`\<`boolean`\>

***

### waitForIsNotShown()

```ts
waitForIsNotShown(__namedParameters?): Promise<any>;
```

Defined in: packages/core/src/helpers/browser/page.ts:59

Wait for the element NOT to be displayed

#### Parameters

##### \_\_namedParameters?

`PageWaitOptions` = `{}`

#### Returns

`Promise`\<`any`\>

***

### waitForIsShown()

```ts
waitForIsShown(__namedParameters?): Promise<any>;
```

Defined in: packages/core/src/helpers/browser/page.ts:40

Wait for the element to be shown

#### Parameters

##### \_\_namedParameters?

`PageWaitOptions` = `{}`

#### Returns

`Promise`\<`any`\>
