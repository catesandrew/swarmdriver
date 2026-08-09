# Variable: saucelabsProvider

```ts
const saucelabsProvider: Provider;
```

Defined in: src/providers/saucelabs/index.js:19

Sauce Labs provider — the reference implementation of the [Provider](../interfaces/Provider.md)
contract.

The capability-building blocks it is composed from live next door in
`./capabilities`; the three `setup*` functions are the existing
`src/services/remote-*.js` reducers, which already return Sauce's connection
details (`hostname`, `port`) at the top level of the config, as WebdriverIO
v9 requires.
