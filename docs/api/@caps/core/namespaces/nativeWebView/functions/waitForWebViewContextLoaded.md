# Function: waitForWebViewContextLoaded()

```ts
function waitForWebViewContextLoaded(): Promise<void>;
```

Defined in: packages/core/src/helpers/native/web-view.ts:23

Wait for the webview context to be loaded

By default you have `NATIVE_APP` as the current context. If a webview is loaded it will be
added to the current contexts and will looks something like this
`["NATIVE_APP","WEBVIEW_28158.2"]`
The number behind `WEBVIEW` can be any string

## Returns

`Promise`\<`void`\>
