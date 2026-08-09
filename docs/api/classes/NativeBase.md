# Class: NativeBase

Defined in: src/helpers/native/base.js:16

## Constructors

### Constructor

```ts
new NativeBase(selector): Base;
```

Defined in: src/helpers/native/base.js:17

#### Parameters

##### selector

`any`

#### Returns

`Base`

## Properties

### selector

```ts
selector: any;
```

Defined in: src/helpers/native/base.js:18

## Methods

### isShown()

```ts
isShown(element): boolean;
```

Defined in: src/helpers/native/base.js:68

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

Defined in: src/helpers/native/base.js:48

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

Defined in: src/helpers/native/base.js:28

Wait for the element to be shown

#### Parameters

##### element?

`Element` = `{}`

#### Returns

`boolean`
