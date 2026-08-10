# Variable: AppiumAppState

```ts
const AppiumAppState: object;
```

Defined in: packages/core/src/enums/appium-app-state.ts:16

## Type Declaration

### NOT\_INSTALLED

```ts
NOT_INSTALLED: number = 0;
```

### NOT\_RUNNING

```ts
NOT_RUNNING: number = 1;
```

### props

```ts
props: object;
```

#### props.0

```ts
0: object;
```

#### props.0.code

```ts
code: string = 'NOT_INSTALLED';
```

#### props.0.desc

```ts
desc: string = 'The current application state cannot be determined/is unknown';
```

#### props.0.value

```ts
value: number = 0;
```

#### props.1

```ts
1: object;
```

#### props.1.code

```ts
code: string = 'NOT_RUNNING';
```

#### props.1.desc

```ts
desc: string = 'The application is not running';
```

#### props.1.value

```ts
value: number = 1;
```

#### props.2

```ts
2: object;
```

#### props.2.code

```ts
code: string = 'SUSPENDED';
```

#### props.2.desc

```ts
desc: string = 'The application is running in the background and is suspended';
```

#### props.2.value

```ts
value: number = 2;
```

#### props.3

```ts
3: object;
```

#### props.3.code

```ts
code: string = 'RUNNING_IN_BACKGROUND';
```

#### props.3.desc

```ts
desc: string = 'The application is running in the background and is not suspended';
```

#### props.3.value

```ts
value: number = 3;
```

#### props.4

```ts
4: object;
```

#### props.4.code

```ts
code: string = 'RUNNING_IN_FOREGROUND';
```

#### props.4.desc

```ts
desc: string = 'The application is running in the foreground';
```

#### props.4.value

```ts
value: number = 4;
```

### RUNNING\_IN\_BACKGROUND

```ts
RUNNING_IN_BACKGROUND: number = 3;
```

### RUNNING\_IN\_FOREGROUND

```ts
RUNNING_IN_FOREGROUND: number = 4;
```

### SUSPENDED

```ts
SUSPENDED: number = 2;
```
