# Function: buildJunitSettings()

```ts
function buildJunitSettings(__namedParameters?): object;
```

Defined in: src/reporters/junit-reporter.js:31

## Parameters

### \_\_namedParameters?

#### outputFileFormat?

(`options`) => `string` = `...`

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
