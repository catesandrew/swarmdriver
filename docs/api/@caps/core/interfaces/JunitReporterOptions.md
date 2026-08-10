# Interface: JunitReporterOptions

Defined in: packages/reporters/dist/types/junit-reporter.d.ts:8

## Extends

- `Partial`\<[`JunitSettings`](JunitSettings.md)\>

## Properties

### addFileAttribute?

```ts
optional addFileAttribute?: boolean;
```

Defined in: packages/reporters/dist/types/junit-reporter.d.ts:5

#### Inherited from

[`JunitSettings`](JunitSettings.md).[`addFileAttribute`](JunitSettings.md#addfileattribute)

***

### outputDir?

```ts
optional outputDir?: string;
```

Defined in: packages/reporters/dist/types/junit-reporter.d.ts:3

#### Inherited from

[`JunitSettings`](JunitSettings.md).[`outputDir`](JunitSettings.md#outputdir)

***

### outputFileFormat?

```ts
optional outputFileFormat?: (options) => string;
```

Defined in: packages/reporters/dist/types/junit-reporter.d.ts:9

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

Defined in: packages/reporters/dist/types/junit-reporter.d.ts:6

#### Inherited from

[`JunitSettings`](JunitSettings.md).[`packageName`](JunitSettings.md#packagename)

***

### suiteNameFormat?

```ts
optional suiteNameFormat?: RegExp;
```

Defined in: packages/reporters/dist/types/junit-reporter.d.ts:4

#### Inherited from

[`JunitSettings`](JunitSettings.md).[`suiteNameFormat`](JunitSettings.md#suitenameformat)
