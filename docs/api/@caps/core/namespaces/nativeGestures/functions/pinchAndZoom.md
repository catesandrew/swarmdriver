# Function: pinchAndZoom()

```ts
function pinchAndZoom(element, gesture?): Promise<any>;
```

Defined in: packages/core/src/helpers/native/gestures.ts:972

Pinch or zoom an element (pinch doesn't work on Android with this method yet)

## Parameters

### element

`any`

### gesture?

`string` = `'zoom'`

Possible values are 'zoom' or 'pinch'.

## Returns

`Promise`\<`any`\>
