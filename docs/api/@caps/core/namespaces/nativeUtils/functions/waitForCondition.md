# Function: waitForCondition()

```ts
function waitForCondition(args?): Promise<any>;
```

Defined in: packages/core/src/helpers/native/utils.ts:1229

This wait command is your universal weapon if you want to wait on something.
It expects a condition and waits until that condition is fulfilled with a truthy value.

## Parameters

### args?

[`WaitForConditionOptions`](../interfaces/WaitForConditionOptions.md) = `{}`

Optional set of arguments.

## Returns

`Promise`\<`any`\>
