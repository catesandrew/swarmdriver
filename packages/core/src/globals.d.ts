/**
 * Ambient declarations for the WebdriverIO testrunner globals.
 *
 * `helpers/*` runs *inside* a wdio testrunner session, where `driver`,
 * `browser`, `$` and `$$` are injected into global scope by the runner rather
 * than imported. Nothing in this package creates them, so they have to be
 * declared.
 *
 * They are deliberately typed loosely rather than as `WebdriverIO.Browser`:
 * every helper in `helpers/native` and `helpers/browser` is *itself* registered
 * onto the session as a custom command (see `services/utils.ts#addCommands`),
 * so the real object at runtime is the base browser plus a set of commands that
 * only exist after this package has been loaded. Pinning the base type would
 * reject every one of those calls; a consumer that wants the precise surface
 * should augment the `WebdriverIO.Browser` interface in its own project.
 */

/** The Appium/WebDriver session, injected by the wdio testrunner. */
declare const driver: any

/** The browser session, injected by the wdio testrunner. */
declare const browser: any

/** Single-element query, injected by the wdio testrunner. */
declare function $(selector: any): any

/** Multi-element query, injected by the wdio testrunner. */
declare function $$(selector: any): any
