# Function: swipe()

```ts
function swipe(from?): Promise<any>;
```

Defined in: packages/core/src/helpers/native/gestures.ts:226

Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
This is the newer version of swipe that uses the actions API.

## Parameters

### from?

[`SwipeOptions`](../interfaces/SwipeOptions.md) = `{}`

`&#123;x: 50, y: 50}`

## Returns

`Promise`\<`any`\>

## Example

``` js
// This is a swipe to the left
const from = { x: 50, y:50 }
const to = { x: 25, y:50 }
```
