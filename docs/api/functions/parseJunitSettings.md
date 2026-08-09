# Function: parseJunitSettings()

```ts
function parseJunitSettings(envs): object;
```

Defined in: src/reporters/junit-reporter.js:6

## Parameters

### envs

`any`

## Returns

`object`

### addFileAttribute

```ts
addFileAttribute: any;
```

### outputDir

```ts
outputDir: any = envs.JUNIT_REPORTER_OUTPUT_DIR;
```

### packageName

```ts
packageName: any = envs.JUNIT_REPORTER_PACKAGE_NAME;
```

### suiteNameFormat

```ts
suiteNameFormat: RegExp;
```
