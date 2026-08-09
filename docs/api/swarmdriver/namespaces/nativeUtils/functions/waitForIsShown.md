# Function: waitForIsShown()

```ts
function waitForIsShown(args?): boolean;
```

Defined in: src/helpers/native/utils.js:1075

Wait for the element to be shown. One of element or selector must be used.

## Parameters

### args?

Optional set of arguments.

#### element?

`Element` = `null`

The webdriver element.

#### interval?

`number`

The interval between condition checks (default: half second)

#### selector?

`string`

The selector used to find the element with.

#### timeout?

`number` = `20000`

The timeout in ms (default: 20 secs)

## Returns

`boolean`
