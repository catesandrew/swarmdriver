# Class: BrowserPage

Defined in: src/helpers/browser/page.js:12

main page object containing all methods, selectors and functionality
that is shared across all page objects

## Param

**selector**

selector, js function, or matcher object to fetch a certain element

## Param

**urlPath**

refers to the exact location of the page, post, file, or other asset

## Constructors

### Constructor

```ts
new BrowserPage(__namedParameters?): Page;
```

Defined in: src/helpers/browser/page.js:13

#### Parameters

##### \_\_namedParameters?

#### Returns

`Page`

## Properties

### selector

```ts
selector: any;
```

Defined in: src/helpers/browser/page.js:17

***

### urlPart

```ts
urlPart: any;
```

Defined in: src/helpers/browser/page.js:18

## Methods

### isShown()

```ts
isShown(element): boolean;
```

Defined in: src/helpers/browser/page.js:74

Give back if the element is displayed

#### Parameters

##### element

`Element`

#### Returns

`boolean`

***

### waitForIsNotShown()

```ts
waitForIsNotShown(element?): boolean;
```

Defined in: src/helpers/browser/page.js:51

Wait for the element NOT to be displayed

#### Parameters

##### element?

`Element` = `{}`

#### Returns

`boolean`

***

### waitForIsShown()

```ts
waitForIsShown(element?): boolean;
```

Defined in: src/helpers/browser/page.js:28

Wait for the element to be shown

#### Parameters

##### element?

`Element` = `{}`

#### Returns

`boolean`
