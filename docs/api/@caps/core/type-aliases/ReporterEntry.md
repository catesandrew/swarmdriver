# Type Alias: ReporterEntry

```ts
type ReporterEntry = 
  | string
  | [string, Record<string, any>?]
  | (...args) => any & object;
```

Defined in: packages/core/src/utils.ts:24

A reporter entry as WebdriverIO accepts it: name, tuple, or class.

Exported for the same reason as [SessionLike](../interfaces/SessionLike.md): it is part of the
public signature of `isReportPortalReporter` and `isSauceCommentReporter`.
