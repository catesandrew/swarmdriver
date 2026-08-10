# Interface: AnyCapabilities

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:11

Loosely-typed capabilities bag. WDIO capabilities are a union of W3C,
JSONWP and various cloud-vendor (Sauce Labs, mobile) shapes; this package
only ever reads a handful of optional, vendor-specific fields off of it
defensively, so a permissive local shape (rather than importing
`webdriverio`'s full `Capabilities` types, which this leaf package doesn't
depend on) is the accurate match for what the code actually does.

## Properties

### alwaysMatch?

```ts
optional alwaysMatch?: AnyCapabilities;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:26

***

### browser?

```ts
optional browser?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:16

***

### browser\_version?

```ts
optional browser_version?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:20

***

### browserName?

```ts
optional browserName?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:15

***

### browserVersion?

```ts
optional browserVersion?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:17

***

### deviceApiLevel?

```ts
optional deviceApiLevel?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:25

***

### deviceName?

```ts
optional deviceName?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:14

***

### os?

```ts
optional os?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:23

***

### os\_version?

```ts
optional os_version?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:24

***

### platform?

```ts
optional platform?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:22

***

### platformName?

```ts
optional platformName?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:21

***

### platformVersion?

```ts
optional platformVersion?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:19

***

### sauce:options?

```ts
optional sauce:options?: unknown;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:27

***

### testobject\_device\_name?

```ts
optional testobject_device_name?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:13

***

### testobject\_test\_report\_url?

```ts
optional testobject_test_report_url?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:12

***

### tunnelName?

```ts
optional tunnelName?: unknown;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:28

***

### version?

```ts
optional version?: string;
```

Defined in: packages/reporters/dist/types/comment-reporter.d.ts:18
