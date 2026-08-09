# Function: pinchAndZoom()

```ts
function pinchAndZoom(element, gesture?): Promise<any>;
```

Defined in: src/helpers/native/gestures.js:868

Pinch or zoom an element (pinch doesn't work on Android with this method yet)

## Parameters

### element

`Element`

### gesture?

`string` = `'zoom'`

Possible values are 'zoom' or 'pinch'.

## Returns

`Promise`\<`any`\>
