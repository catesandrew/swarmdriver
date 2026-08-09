# Function: setupJunitConfig()

```ts
function setupJunitConfig(__namedParameters?): object;
```

Defined in: src/reporters/junit-reporter.js:92

## Parameters

### \_\_namedParameters?

## Returns

`object`

### reporters

```ts
reporters: (
  | string
  | {
  addFileAttribute: any;
  errorOptions: {
     error: string;
     failure: string;
     stacktrace: string;
  };
  outputDir: any;
  outputFileFormat: (options) => string;
  packageName: any;
  suiteNameFormat: any;
})[][];
```
