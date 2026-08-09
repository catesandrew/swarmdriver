# Function: buildReportPortalSettings()

```ts
function buildReportPortalSettings(opts?): object;
```

Defined in: src/reporters/report-portal-reporter.js:77

## Parameters

### opts?

## Returns

`object`

### reporters

```ts
reporters: (
  | typeof ReportPortalReporter
  | {
  autoAttachCucumberFeatureToScenario: any;
  autoAttachScreenshots: any;
  cucumberNestedSteps: any;
  parseTagsFromTestTitle: any;
  reportPortalClientConfig: {
     attributes: any;
     debug: any;
     description: any;
     endpoint: any;
     headers: any;
     launch: any;
     mode: any;
     project: any;
     token: any;
  };
  reportSeleniumCommands: any;
  sanitizeErrorMessages: any;
  sauceLabOptions: {
     enabled: boolean;
     sldc: string;
  };
  screenshotsLogLevel: any;
  seleniumCommandsLogLevel: any;
})[][];
```

### services

```ts
services: any[][];
```
