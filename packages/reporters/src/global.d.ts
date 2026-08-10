/**
 * Ambient declarations for things TypeScript can't resolve on its own.
 *
 * `@caps/reporters` is intentionally a dependency-free leaf of the workspace
 * (see `env.ts`), so it doesn't pull in `webdriverio`/`@wdio/globals` just to
 * type the `driver` global the WDIO test runner injects into the process at
 * runtime. Only the members `comment-reporter.ts` actually calls are typed
 * here; a real `WebdriverIO.Browser` is bound by the test runner.
 */
declare const driver: {
  takeScreenshot(): Promise<string>
  getPageSource(): Promise<string>
  capabilities: Record<string, unknown>
}

/**
 * `wdio-reportportal-reporter` and `wdio-reportportal-service` are
 * unmaintained-but-still-used third-party packages that ship no types. They
 * are only ever referenced by identity (passed straight into a WDIO
 * reporters/services config array), never called into directly from this
 * package, so an `unknown` shim is sufficient and avoids `any` leaking into
 * the exported config types.
 */
declare module 'wdio-reportportal-reporter' {
  const reportportal: unknown
  export default reportportal
}

declare module 'wdio-reportportal-service' {
  const RpService: unknown
  export default RpService
}
