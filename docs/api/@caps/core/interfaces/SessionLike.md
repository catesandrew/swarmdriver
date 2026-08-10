# Interface: SessionLike

Defined in: packages/core/src/utils.ts:14

A WebdriverIO session response, or anything close enough to one.

Exported because it appears in the signature of `isChrome`, `isFirefox` and
`isMobile` — an unexported type there would leave callers unable to name the
argument they are required to construct.

## Properties

### capabilities?

```ts
optional capabilities?: Capability[];
```

Defined in: packages/core/src/utils.ts:15
