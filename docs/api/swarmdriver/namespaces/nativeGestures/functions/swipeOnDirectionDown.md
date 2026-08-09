# Function: swipeOnDirectionDown()

```ts
function swipeOnDirectionDown(param?): Promise<any>;
```

Defined in: src/helpers/native/gestures.js:774

Swipe down based on a distance percentage.

## Parameters

### param?

an optional params object

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
