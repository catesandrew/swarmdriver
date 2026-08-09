# Function: waitForAnyShown()

```ts
function waitForAnyShown(params?): Promise<void>;
```

Defined in: src/helpers/native/utils.js:981

Waits until ANY of the specified elements or selectors are shown on the page, up to a specified timeout.
This function is useful for scenarios involving asynchronous UI elements that may not be immediately visible.

## Parameters

### params?

Parameters to define the wait conditions.

#### elements?

`WebElement`[] = `[]`

An array of WebElements to check for visibility.

#### interval?

`number`

The interval (in milliseconds) at which to poll for element visibility. If not specified, the driver's default polling interval is used.

#### selectors?

`string`[] = `[]`

An array of selector strings to check for visibility.

#### timeout?

`number` = `20000`

The maximum amount of time (in milliseconds) to wait for an element to be shown. Defaults to 20 seconds.

## Returns

`Promise`\<`void`\>

A promise that resolves when any of the specified elements or selectors are shown, or rejects if the timeout is reached without any becoming visible.

## Example

```ts
await waitForAnyShown({
  selectors: ['#loginButton', '#signupButton'],
  timeout: 10000,
  interval: 500,
});
```
