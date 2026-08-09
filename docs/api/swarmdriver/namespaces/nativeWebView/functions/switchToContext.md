# Function: switchToContext()

```ts
function switchToContext(context): Promise<any>;
```

Defined in: src/helpers/native/web-view.js:49

Switch to native or webview context

## Parameters

### context

should be native of webview

#### NATIVE

`number` = `1`

#### props

\{
  `0`: \{
     `code`: `string`;
     `value`: `number`;
  \};
  `1`: \{
     `code`: `string`;
     `value`: `number`;
  \};
  `2`: \{
     `code`: `string`;
     `value`: `number`;
  \};
\} = `...`

#### props.0

\{
  `code`: `string`;
  `value`: `number`;
\} = `...`

#### props.0.code

`string` = `'UNKNOWN'`

#### props.0.value

`number` = `0`

#### props.1

\{
  `code`: `string`;
  `value`: `number`;
\} = `...`

#### props.1.code

`string` = `'native'`

#### props.1.value

`number` = `1`

#### props.2

\{
  `code`: `string`;
  `value`: `number`;
\} = `...`

#### props.2.code

`string` = `'webview'`

#### props.2.value

`number` = `2`

#### UNKNOWN

`number` = `0`

#### WEBVIEW

`number` = `2`

## Returns

`Promise`\<`any`\>
