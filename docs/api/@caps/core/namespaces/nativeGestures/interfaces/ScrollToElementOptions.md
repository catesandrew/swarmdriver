# Interface: ScrollToElementOptions

Defined in: packages/core/src/helpers/native/gestures.ts:82

Scroll until a single element comes into view.

`selector` is a `string` rather than the broader `Selector`, matching
`findEleAndSel()` in `./utils.ts` — see the note on `ElementOrSelector`
there for why the native path is string-only.

## Properties

### amount?

```ts
optional amount?: number;
```

Defined in: packages/core/src/helpers/native/gestures.ts:86

***

### distance?

```ts
optional distance?: number;
```

Defined in: packages/core/src/helpers/native/gestures.ts:88

***

### element?

```ts
optional element?: WdioElement;
```

Defined in: packages/core/src/helpers/native/gestures.ts:83

***

### maxScrolls?

```ts
optional maxScrolls?: number;
```

Defined in: packages/core/src/helpers/native/gestures.ts:85

***

### scrollDirection?

```ts
optional scrollDirection?: number;
```

Defined in: packages/core/src/helpers/native/gestures.ts:87

***

### selector?

```ts
optional selector?: string;
```

Defined in: packages/core/src/helpers/native/gestures.ts:84

***

### size?

```ts
optional size?: ScreenRect;
```

Defined in: packages/core/src/helpers/native/gestures.ts:89
