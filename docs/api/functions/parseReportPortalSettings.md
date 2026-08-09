# Function: parseReportPortalSettings()

```ts
function parseReportPortalSettings(envs): object;
```

Defined in: src/reporters/report-portal-reporter.js:14

## Parameters

### envs

`any`

## Returns

`object`

### attributes

```ts
attributes: object[];
```

### autoAttachCucumberFeatureToScenario

```ts
autoAttachCucumberFeatureToScenario: any;
```

### autoAttachScreenshots

```ts
autoAttachScreenshots: any;
```

### cucumberNestedSteps

```ts
cucumberNestedSteps: any;
```

### debug

```ts
debug: any;
```

### description

```ts
description: any = envs.REPORTPORTAL_DESCRIPTION;
```

### endpoint

```ts
endpoint: any = envs.REPORTPORTAL_ENDPOINT;
```

### launch

```ts
launch: any = envs.REPORTPORTAL_LAUNCH;
```

### mode

```ts
mode: any = envs.REPORTPORTAL_MODE;
```

### parseTagsFromTestTitle

```ts
parseTagsFromTestTitle: any;
```

### project

```ts
project: any = envs.REPORTPORTAL_PROJECT;
```

### reportSeleniumCommands

```ts
reportSeleniumCommands: any;
```

### sanitizeErrorMessages

```ts
sanitizeErrorMessages: any;
```

### screenshotsLogLevel

```ts
screenshotsLogLevel: any = envs.REPORTPORTAL_SCREENSHOTS_LOG_LEVEL;
```

### seleniumCommandsLogLevel

```ts
seleniumCommandsLogLevel: any = envs.REPORTPORTAL_SELENIUM_COMMANDS_LOG_LEVEL;
```

### token

```ts
token: any = envs.REPORTPORTAL_TOKEN;
```
