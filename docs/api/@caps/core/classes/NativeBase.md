# Class: NativeBase

Defined in: packages/core/src/helpers/native/base.ts:24

## Constructors

### Constructor

```ts
new NativeBase(selector): Base;
```

Defined in: packages/core/src/helpers/native/base.ts:32

#### Parameters

##### selector

`string`

#### Returns

`Base`

## Properties

### selector

```ts
selector: string;
```

Defined in: packages/core/src/helpers/native/base.ts:30

A native locator string. Not the broader browser-side `Selector` — it is
handed to `findEleAndSel()`, which requires a string. See the note on
`ElementOrSelector` in `./utils.ts`.

## Methods

### isShown()

```ts
isShown(element?): Promise<boolean>;
```

Defined in: packages/core/src/helpers/native/base.ts:71

Give back if the element is displayed

#### Parameters

##### element?

[`WdioElement`](../interfaces/WdioElement.md)

#### Returns

`Promise`\<`boolean`\>

***

### waitForIsNotShown()

```ts
waitForIsNotShown(__namedParameters?): Promise<void>;
```

Defined in: packages/core/src/helpers/native/base.ts:55

Wait for the element NOT to be displayed

#### Parameters

##### \_\_namedParameters?

`BaseWaitOptions` = `{}`

#### Returns

`Promise`\<`void`\>

***

### waitForIsShown()

```ts
waitForIsShown(__namedParameters?): Promise<void>;
```

Defined in: packages/core/src/helpers/native/base.ts:39

Wait for the element to be shown

#### Parameters

##### \_\_namedParameters?

`BaseWaitOptions` = `{}`

#### Returns

`Promise`\<`void`\>
