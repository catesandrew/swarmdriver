# Class: NativeCarousel

Defined in: packages/core/src/helpers/native/carousel.ts:14

## Constructors

### Constructor

```ts
new NativeCarousel(opts): Carousel;
```

Defined in: packages/core/src/helpers/native/carousel.ts:22

#### Parameters

##### opts

`CarouselOptions`

#### Returns

`Carousel`

## Properties

### cardSelector

```ts
cardSelector: Selector;
```

Defined in: packages/core/src/helpers/native/carousel.ts:17

***

### carouselRectangles?

```ts
optional carouselRectangles?: ScreenRect;
```

Defined in: packages/core/src/helpers/native/carousel.ts:20

memoised result of [Carousel.getCarouselRectangles](#getcarouselrectangles)

***

### carouselSelector

```ts
carouselSelector: Selector;
```

Defined in: packages/core/src/helpers/native/carousel.ts:15

## Methods

### getCardText()

```ts
getCardText(nthCard): Promise<string>;
```

Defined in: packages/core/src/helpers/native/carousel.ts:57

Return de carousel text
Carousel only has a max of 3 elements when 3 or more cards are provided
When the first or last card is active then 2 elements are present

if first card is active
   the first of 2 elements is the active card
else if last card is active
   the last of 2 elements is the active card
else
   there are 3 elements and the active card is the middle one

#### Parameters

##### nthCard

`string`

Use 'first' to indicate the first card,
                else use a different word to indicate the other card
                like for example 'active'

#### Returns

`Promise`\<`string`\>

Returns the text

***

### getCarouselRectangles()

```ts
getCarouselRectangles(): Promise<ScreenRect>;
```

Defined in: packages/core/src/helpers/native/carousel.ts:146

Get the carousel position and size

#### Returns

`Promise`\<[`ScreenRect`](../interfaces/ScreenRect.md)\>

***

### swipeLeft()

```ts
swipeLeft(): Promise<void>;
```

Defined in: packages/core/src/helpers/native/carousel.ts:99

Swipe the carousel to the LEFT (from right to left)

#### Returns

`Promise`\<`void`\>

***

### swipeRight()

```ts
swipeRight(): Promise<void>;
```

Defined in: packages/core/src/helpers/native/carousel.ts:123

Swipe the carousel to the RIGHT (from left to right)

#### Returns

`Promise`\<`void`\>

***

### waitForIsDisplayed()

```ts
waitForIsDisplayed(reverse?): Promise<void>;
```

Defined in: packages/core/src/helpers/native/carousel.ts:33

Wait for the carousel to be (un)visible

#### Parameters

##### reverse?

`boolean` = `false`

if true it instead waits for the selector
to not match any elements.

#### Returns

`Promise`\<`void`\>
