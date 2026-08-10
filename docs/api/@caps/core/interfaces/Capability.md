# Interface: Capability

Defined in: packages/core/src/types.ts:31

A single W3C capability object.

Left open-ended on purpose: vendor prefixes (`appium:`, `goog:chromeOptions`,
`sauce:options`, `moz:*`) are dynamic keys that no closed type can enumerate,
and this package's job is to *assemble* them rather than validate them.

## Indexable

```ts
[key: string]: any
```

## Properties

### browserName?

```ts
optional browserName?: string;
```

Defined in: packages/core/src/types.ts:32

***

### browserVersion?

```ts
optional browserVersion?: string;
```

Defined in: packages/core/src/types.ts:33

***

### platformName?

```ts
optional platformName?: string;
```

Defined in: packages/core/src/types.ts:34
