# Type Alias: Envs

```ts
type Envs = Record<string, string | undefined>;
```

Defined in: packages/core/src/types.ts:22

An environment-variable bag.

Every `parseBool` / `parseWhole` / `parseString` / `parseList` call in this
package reads through this shape, and provider packages mutate it in
`applyEnvDefaults()`. It is deliberately *not* `NodeJS.ProcessEnv`: callers
routinely pass a synthesised object (tests, `buildWdioConfig({ envs })`)
rather than `process.env`, and the config matrix must stay testable without
touching real process state.

Values are `string | undefined` because that is what `process.env` actually
hands back — an unset variable reads as `undefined`, never `''`.
