# Function: getCenterCoordsForElement()

```ts
function getCenterCoordsForElement(elementId): Promise<{
  x: number;
  y: number;
}>;
```

Defined in: packages/core/src/helpers/browser/utils.ts:90

Get center coordinates for element

## Parameters

### elementId

`any`

the id of an element returned in a previous call to Find Element(s)

## Returns

`Promise`\<\{
  `x`: `number`;
  `y`: `number`;
\}\>

Returns an object representing the position and bounding rect of the element.
