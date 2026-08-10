# Interface: SwipePercentageOptions

Defined in: packages/core/src/helpers/native/gestures.ts:39

A gesture between two fractional points.

`size` is the cached result of `driver.getWindowRect()`. Passing it in lets a
caller doing many gestures in a row avoid a round trip to the device per
gesture; when omitted these helpers fetch it themselves.

## Properties

### duration?

```ts
optional duration?: number;
```

Defined in: packages/core/src/helpers/native/gestures.ts:42

***

### from?

```ts
optional from?: PercentPoint;
```

Defined in: packages/core/src/helpers/native/gestures.ts:40

***

### size?

```ts
optional size?: ScreenRect;
```

Defined in: packages/core/src/helpers/native/gestures.ts:43

***

### to?

```ts
optional to?: PercentPoint;
```

Defined in: packages/core/src/helpers/native/gestures.ts:41
