# Class: NativeCarousel

Defined in: src/helpers/native/carousel.js:5

## Constructors

### Constructor

```ts
new NativeCarousel(opts): Carousel;
```

Defined in: src/helpers/native/carousel.js:6

#### Parameters

##### opts

`any`

#### Returns

`Carousel`

## Properties

### cardSelector

```ts
cardSelector: any;
```

Defined in: src/helpers/native/carousel.js:8

***

### carouselRectangles

```ts
carouselRectangles: any;
```

Defined in: src/helpers/native/carousel.js:147

***

### carouselSelector

```ts
carouselSelector: any;
```

Defined in: src/helpers/native/carousel.js:7

## Methods

### getCardText()

```ts
getCardText(nthCard): string;
```

Defined in: src/helpers/native/carousel.js:41

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

`string`

Returns the text

***

### getCarouselRectangles()

```ts
getCarouselRectangles(): Promise<any>;
```

Defined in: src/helpers/native/carousel.js:136

Get the carousel position and size

#### Returns

`Promise`\<`any`\>

x: number,
 y: number,
 width: number,
 height: number,

***

### swipeLeft()

```ts
swipeLeft(): Promise<void>;
```

Defined in: src/helpers/native/carousel.js:83

Swipe the carousel to the LEFT (from right to left)

#### Returns

`Promise`\<`void`\>

***

### swipeRight()

```ts
swipeRight(): Promise<void>;
```

Defined in: src/helpers/native/carousel.js:107

Swipe the carousel to the RIGHT (from left to right)

#### Returns

`Promise`\<`void`\>

***

### waitForIsDisplayed()

```ts
waitForIsDisplayed(reverse?): Promise<void>;
```

Defined in: src/helpers/native/carousel.js:17

Wait for the carousel to be (un)visible

#### Parameters

##### reverse?

`bool` = `false`

if true it instead waits for the selector
to not match any elements.

#### Returns

`Promise`\<`void`\>
