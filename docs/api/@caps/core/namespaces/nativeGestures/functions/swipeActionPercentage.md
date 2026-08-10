# Function: swipeActionPercentage()

```ts
function swipeActionPercentage(from?): Promise<void>;
```

Defined in: packages/core/src/helpers/native/gestures.ts:560

Specify our swipe in terms relative to the height and width of the screen.
Here we have defined a new version of swipe, that takes start and end
values in percentages, not absolute terms. To make this work, we need
another helper function which retrieves (and caches) the window size. Using
the window size (height and width), we are able to calculate absolute
coordinates for the swipe.

## Parameters

### from?

[`SwipePercentageOptions`](../interfaces/SwipePercentageOptions.md) = `{}`

`&#123; xPct: 0.5, yPct: 0.5 }`

## Returns

`Promise`\<`void`\>
