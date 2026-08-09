# Function: swipeOnDirection()

```ts
function swipeOnDirection(param?): Promise<any>;
```

Defined in: src/helpers/native/gestures.js:615

Swipe up/right/down/left based on a percentage.

## Parameters

### param?

an optional params object

#### direction?

`number` = `ScrollDirection.UNKNOWN`

The ScrollDirection enum

#### distance?

`number` = `SCROLL_RATIO`

percentage from 0 - 1. the default
distance is 0.8, to make sure we don't accidentally scroll even a pixel past
content we might care about

#### duration?

`number` = `SCROLL_DUR`

ms on duration of swipe, default 1 sec.

#### size?

`any`

value of device window size

## Returns

`Promise`\<`any`\>

Returns a Promise
