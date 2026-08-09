# Function: click()

```ts
function click(origClickFunction, options?): Promise<void>;
```

Defined in: src/helpers/browser/overwrites.js:10

Attempts to click an element. If the element is not clickable, it can be scrolled into view before clicking.

## Parameters

### origClickFunction

`Function`

The original click function to execute.

### options?

Options for clicking.

#### force?

`boolean` = `false`

If `true`, clicks with JavaScript even if the element is not visible or clickable.

## Returns

`Promise`\<`void`\>

A Promise that resolves when the click operation is completed.

## Throws

If the element cannot be clicked for any reason.
