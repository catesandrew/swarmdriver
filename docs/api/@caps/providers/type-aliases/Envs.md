# Type Alias: Envs

```ts
type Envs = Record<string, string | undefined>;
```

Defined in: providers/src/types.ts:20

A raw environment bag — `process.env`, or a fixture object in tests.

Everything arrives as a string (or is absent); the `parse*` helpers in
`@caps/core/utils` are what turn these into booleans/numbers/lists.
