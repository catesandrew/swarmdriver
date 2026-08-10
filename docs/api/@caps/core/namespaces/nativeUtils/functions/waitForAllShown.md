# Function: waitForAllShown()

```ts
function waitForAllShown(params?): Promise<any>;
```

Defined in: packages/core/src/helpers/native/utils.ts:1105

Waits until all specified elements or selectors are visible on the page, up to a specified timeout. This function is
particularly useful in web automation tasks where multiple asynchronous UI elements must become visible before proceeding.

## Parameters

### params?

[`WaitForAnyShownOptions`](../interfaces/WaitForAnyShownOptions.md) = `{}`

The parameters defining the elements or selectors to wait for and the wait conditions.

## Returns

`Promise`\<`any`\>

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
