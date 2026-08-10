# Function: pressNativeAlertButton()

```ts
function pressNativeAlertButton(selector): Promise<any>;
```

Defined in: packages/core/src/helpers/native/alert.ts:45

Press a button in a cross-platform way.

IOS:
 iOS always has an accessibilityID so use the `~` in combination
 with the name of the button as shown on the screen
ANDROID:
 Use the text of the button, provide a string and it will automatically transform it to uppercase
 and click on the button

## Parameters

### selector

`any`

## Returns

`Promise`\<`any`\>
