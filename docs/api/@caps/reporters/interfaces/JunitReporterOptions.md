# Interface: JunitReporterOptions

Defined in: packages/reporters/src/junit-reporter.ts:14

## Extends

- `Partial`\<[`JunitSettings`](JunitSettings.md)\>

## Properties

### addFileAttribute?

```ts
optional addFileAttribute?: boolean;
```

Defined in: packages/reporters/src/junit-reporter.ts:10

#### Inherited from

[`JunitSettings`](JunitSettings.md).[`addFileAttribute`](JunitSettings.md#addfileattribute)

***

### outputDir?

```ts
optional outputDir?: string;
```

Defined in: packages/reporters/src/junit-reporter.ts:8

#### Inherited from

[`JunitSettings`](JunitSettings.md).[`outputDir`](JunitSettings.md#outputdir)

***

### outputFileFormat?

```ts
optional outputFileFormat?: (options) => string;
```

Defined in: packages/reporters/src/junit-reporter.ts:15

#### Parameters

##### options

###### cid

`string`

#### Returns

`string`

***

### packageName?

```ts
optional packageName?: string;
```

Defined in: packages/reporters/src/junit-reporter.ts:11

#### Inherited from

[`JunitSettings`](JunitSettings.md).[`packageName`](JunitSettings.md#packagename)

***

### suiteNameFormat?

```ts
optional suiteNameFormat?: RegExp;
```

Defined in: packages/reporters/src/junit-reporter.ts:9

#### Inherited from

[`JunitSettings`](JunitSettings.md).[`suiteNameFormat`](JunitSettings.md#suitenameformat)
