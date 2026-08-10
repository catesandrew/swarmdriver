# Function: waitForAnyShown()

```ts
function waitForAnyShown(params?): Promise<any>;
```

Defined in: packages/core/src/helpers/native/utils.ts:1054

Waits until ANY of the specified elements or selectors are shown on the page, up to a specified timeout.
This function is useful for scenarios involving asynchronous UI elements that may not be immediately visible.

## Parameters

### params?

[`WaitForAnyShownOptions`](../interfaces/WaitForAnyShownOptions.md) = `{}`

Parameters to define the wait conditions.

## Returns

`Promise`\<`any`\>

A promise that resolves when any of the specified elements or selectors are shown, or rejects if the timeout is reached without any becoming visible.

## Example

```ts
await waitForAnyShown({
  selectors: ['#loginButton', '#signupButton'],
  timeout: 10000,
  interval: 500,
});
```
