# Function: waitForCondition()

```ts
function waitForCondition(args?): boolean;
```

Defined in: src/helpers/native/utils.js:1156

This wait command is your universal weapon if you want to wait on something.
It expects a condition and waits until that condition is fulfilled with a truthy value.

## Parameters

### args?

Optional set of arguments.

#### condition

`Function`

The condition to wait on.

#### interval?

`string`

The interval between condition checks (default: half second)

#### timeout?

`number` = `20000`

The timeout in ms (default: 20 secs)

#### timeoutMsg?

`number`

The error message to throw when times out.

## Returns

`boolean`
