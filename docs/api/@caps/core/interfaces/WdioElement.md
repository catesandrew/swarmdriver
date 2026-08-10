# Interface: WdioElement

Defined in: packages/core/src/types.ts:117

A WebdriverIO element handle.

Open by design. Every helper in `helpers/*` is registered onto the session as
a *custom command* (`services/utils.ts#addCommands`), so the element objects
these functions receive carry both the stock WebdriverIO command surface and
whatever the consuming project has added. Only the two properties this
package reads directly are pinned.

## Indexable

```ts
[key: string]: any
```

## Properties

### elementId?

```ts
optional elementId?: string;
```

Defined in: packages/core/src/types.ts:118

***

### selector?

```ts
optional selector?: any;
```

Defined in: packages/core/src/types.ts:119
