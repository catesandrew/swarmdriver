# Function: tapElement()

```ts
function tapElement(element?): Promise<any>;
```

Defined in: src/helpers/native/utils.js:1230

Sends tap action vs click. Default is to send tap to middle.

## Parameters

### element?

`WebElement` = `{}`

the WebElement from appium

## Returns

`Promise`\<`any`\>

## Example

``` js
// This is a tap 10% from right hand side
tapElement({element: el, x: 0.9, y: 0.5})
```
