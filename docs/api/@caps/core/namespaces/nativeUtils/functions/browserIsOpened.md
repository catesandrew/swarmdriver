# Function: browserIsOpened()

```ts
function browserIsOpened(): Promise<any>;
```

Defined in: packages/core/src/helpers/native/utils.ts:717

Verify that the browser is opened.
- iOS:     For iOS it not possible to check if the browser is opened, only if the app is
           put on the background
- Android: For Android we can check the current activity. If it holds a browser reference we know
           for sure that the app is put on the background and that for example chrome is opened.

## Returns

`Promise`\<`any`\>
