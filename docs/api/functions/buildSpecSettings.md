# Function: buildSpecSettings()

```ts
function buildSpecSettings(opts?): object;
```

Defined in: src/reporters/spec-reporter.js:26

## Parameters

### opts?

## Returns

`object`

### reporters

```ts
reporters: (
  | string
  | {
  addConsoleLogs: any;
  onlyFailures: any;
  realtimeReporting: any;
  sauceLabsSharableLinks: any;
  showPreface: any;
  symbols: {
     failed: string;
     passed: string;
     skipped: string;
  };
})[][];
```
