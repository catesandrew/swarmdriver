# @caps/reporters

## 0.1.0

Initial release.

`@caps/reporters` holds WebdriverIO reporters and the reporter-config builders that wire them up: spec, junit, ReportPortal, and Sauce Labs job comments. It is a leaf package in the swarmdriver dependency graph — it declares no dependency on any other `@caps/*` package.

### Highlights

- **Four reporters, one config surface:** `WDIO_REPORTERS` accepts a colon-separated list of `spec`, `junit`, `reportportal`, `saucecomment`, defaulting to `spec` locally and `spec:junit:saucecomment` on Sauce.
- **`saucecomment` writes results back onto the Sauce job itself**, which is why it is a Sauce-branch default rather than a global one — it only makes sense when the run is actually happening on Sauce Labs. Its behavior is tunable via `SAUCECOMMENT_REPORTER_OUTPUT_DIR` and `SAUCECOMMENT_REPORTER_SAVE_OUTPUT_TO_FILE`, both of which `@caps/core` injects with sensible defaults on the Sauce branch.
- **`@caps/core` already pulls this package in** as a dependency to wire reporters into `buildWdioConfig()`'s generated config; installing `@caps/reporters` directly is only necessary if you're assembling reporter config yourself outside of `buildWdioConfig()`.
- Built on top of the standard `@wdio/*` reporter packages (`@wdio/allure-reporter`, `@wdio/dot-reporter`, `@wdio/junit-reporter`, `@wdio/reporter`, `@wdio/spec-reporter`) plus `wdio-reportportal-reporter` / `wdio-reportportal-service` for ReportPortal integration.
