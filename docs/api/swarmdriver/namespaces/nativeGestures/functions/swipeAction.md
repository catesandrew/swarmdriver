# Function: swipeAction()

```ts
function swipeAction(start?): Promise<void>;
```

Defined in: src/helpers/native/gestures.js:429

Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
This is the newer version of swipe that uses the actions API.

## Parameters

### start?

[`Coordinates`](../interfaces/Coordinates.md) = `{}`

`&#123; x: 50, y: 50 }`

## Returns

`Promise`\<`void`\>

## Example

``` js
// This is a swipe to the left
const from = { x: 50, y:50 }
const to = { x: 25, y:50 }
```
