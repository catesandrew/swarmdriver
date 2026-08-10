/**
 * WebdriverIO testrunner globals.
 *
 * The testrunner injects `browser`/`driver` into the global scope before hooks
 * run, so `src/services/remote.ts` legitimately references `driver` from
 * inside a `before` hook without importing it. The root `eslint.config.js`
 * already declares these same names as readonly globals; this is the TypeScript
 * half of that declaration.
 *
 * They are `any` on purpose: typing them properly means depending on
 * `@wdio/globals` types, and the hooks here only ever call `addCommand` and
 * `execute` on them.
 */
declare const driver: any
declare const browser: any
