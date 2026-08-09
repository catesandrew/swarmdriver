# Function: browserIsOpened()

```ts
function browserIsOpened(): void;
```

Defined in: src/helpers/native/utils.js:644

Verify that the browser is opened.
- iOS:     For iOS it not possible to check if the browser is opened, only if the app is
           put on the background
- Android: For Android we can check the current activity. If it holds a browser reference we know
           for sure that the app is put on the background and that for example chrome is opened.

## Returns

`void`
