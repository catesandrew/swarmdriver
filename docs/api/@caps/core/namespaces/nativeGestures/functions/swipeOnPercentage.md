# Function: swipeOnPercentage()

```ts
function swipeOnPercentage(from?): Promise<any>;
```

Defined in: packages/core/src/helpers/native/gestures.ts:322

Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
percentages of the screen.

## Parameters

### from?

[`SwipeOnPercentageOptions`](../interfaces/SwipeOnPercentageOptions.md) = `{}`

`&#123; x: 50, y: 50 }`

## Returns

`Promise`\<`any`\>

## Example

``` js
// This is a swipe to the left
const from = { x: 50, y:50 }
const to = { x: 25, y:50 }
```
