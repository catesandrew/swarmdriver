# Function: waitForAllShown()

```ts
function waitForAllShown(params?): Promise<void>;
```

Defined in: src/helpers/native/utils.js:1032

Waits until all specified elements or selectors are visible on the page, up to a specified timeout. This function is
particularly useful in web automation tasks where multiple asynchronous UI elements must become visible before proceeding.

## Parameters

### params?

The parameters defining the elements or selectors to wait for and the wait conditions.

#### elements?

`WebElement`[] = `[]`

An array of WebElements to check for visibility.

#### interval?

`number`

The interval (in milliseconds) at which to poll for the visibility of elements. If not specified, the driver's default polling interval is used.

#### selectors?

`string`[] = `[]`

An array of CSS selector strings to check for the visibility of elements.

#### timeout?

`number` = `20000`

The maximum amount of time (in milliseconds) to wait for elements to be shown. Defaults to 20 seconds.

## Returns

`Promise`\<`void`\>

A promise that resolves when all of the specified elements or selectors are visible, or rejects if the timeout is reached without all becoming visible.

## Example

```ts
// Example usage:
await waitForAllShown({
  selectors: ['.data-loaded', '.animation-finished'],
  timeout: 15000,
  interval: 500,
});
```
