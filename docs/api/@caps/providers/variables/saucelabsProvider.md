# Variable: saucelabsProvider

```ts
const saucelabsProvider: Provider;
```

Defined in: providers/src/saucelabs/index.ts:32

Sauce Labs provider — the reference implementation of the [Provider](../../core/interfaces/Provider.md)
contract.

The capability-building blocks it is composed from live next door in
`./capabilities`; the three `setup*` functions are the former
`src/services/remote-*.js` reducers (now `../services/`), which already
return Sauce's connection details (`hostname`, `port`) at the top level of
the config, as WebdriverIO v9 requires.
