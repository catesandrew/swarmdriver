# Follow-ups — OSS extraction marathon (2026-08-10)

## Blocked on the user (decisions / approvals / access)

- [ ] **Push `sauce-labs-cli`.** GitHub repo exists (`catesandrew/sauce-labs-cli`,
      created, empty) but the 2 local commits (`d21ded6`, `7a47de0`) were
      never pushed. Either push it or explicitly decide it stays local.
- [ ] **`datadog-metrics-buffer` fork-attribution question.** The source
      turned out to be a fork of the existing MIT-licensed open-source
      `node-datadog-metrics` (Daniel Bader). Attribution is in place
      (LICENSE notice + README credits), making it *legitimate* to publish,
      but publishing a parallel fork of an actively-maintained project is a
      judgment call, not a technical one. Decide: publish anyway, or just
      recommend/depend-on the upstream package instead.
- [ ] **`atlassian-jira-cli`** — a real Jira REST v3 CLI (issues, JQL,
      sprints, comments/assignment). Explicitly deferred as a separate
      future project when `jira` (the source package) turned out to contain
      zero Jira code. Not started. Would be genuinely new product work, not
      an extraction, and largely unverifiable without live Jira credentials.
- [ ] **npm scope decision** was already made for swarmdriver (`@caps`) and
      cogs (`@cogs`) and actionforge (`@actionforge`) — but **no `npm
      publish`/`pnpm release` has been run anywhere yet.** Every repo is
      GitHub-only right now. Decide which to publish and when.
- [ ] **OIDC trusted-publisher setup on npm's side** for swarmdriver's
      release workflow (`release.yml`) — the workflow is wired for it
      (`id-token: write`, no `NPM_TOKEN`), but the user said they'd
      configure the actual npmjs.com Trusted Publisher settings themselves.
      Unclear if that's been done.
- [ ] **`@caps/providers` depends on `@caps/cli`** (swarmdriver) — a real,
      known architectural inversion (a provider package depending on the
      CLI package) flagged during the provider-abstraction refactor and
      never cleaned up. Worth a look before any real publish. See
      `adr/0001-provider-registration-pattern.md`.
- [ ] **`monorepo-toolkit`/`babel-preset-forge`/`forgepack`/`sauce-labs-cli`/
      `actionforge` unpublished npm packages** — same as above, all built
      and verified but never actually `npm publish`ed. No blocker, just
      needs a decision on timing/scope.

## Blocked on work (do next, no user input needed)

- [ ] **actionforge's root `ci.yml` still pins `@v4`** for some third-party
      actions while actions added later in the session verified and used
      current majors (`@v6`/`@v7`, checked via `gh release list`) —
      inconsistency flagged by a Wave 2 worker, not fixed. Bring `ci.yml`
      up to the same current-major standard. — `actionforge/.github/workflows/ci.yml`
- [ ] **actionforge's `jest` action bundle is 1.9MB unminified** (octokit
      dominates). Sibling `eslint` action uses the same unminified esbuild
      invocation for consistency. Worth a repo-wide decision on
      `--minify`, not made this session. — `actionforge/actions/*/`
- [ ] **Vendored-code consolidation** — several extractions vendored small
      slices of logic from packages that were *also* being extracted this
      session into `cogs`/other repos (see
      `adr/0003-cross-repo-dependency-vendoring-rule.md`). Once those
      sibling packages are actually published to npm, the vendored copies
      in `datadog-metrics-buffer`, `babel-preset-forge`, and `forgepack` are
      candidates to become real dependencies instead. Not tracked anywhere
      else but here.

## Nice-to-have / later

- [ ] `graph-ns`(→ `@actionforge/graph-ns`) generalization away from its
      original API-Elements/Refract-specific framing was done at the code
      level but could use a docs/example pass showing a non-Refract use
      case, to make the "genuinely generic" claim land for a new reader.
- [ ] None of the actionforge GitHub Actions have run inside a real GitHub
      Actions workflow yet — only local bundle-execution smoke tests
      against stubbed GitHub API responses. Worth a real dry-run workflow
      once pushed, before recommending them for real use.

## Known risks / watch-outs

- The provider-registration side-effect pattern in swarmdriver
  (`import '@caps/providers'` required before `remote: 'saucelabs'` works)
  fails *silently* — a missing import produces `undefined`, identical to an
  unrecognized `remote` value, not an error. Documented, but a real footgun
  for a first-time consumer skimming past the docs.
- Several repos' composite/JS GitHub Actions were only verified via local
  execution with stubbed GitHub API responses, not a real workflow run —
  real-world edge cases (rate limits, actual PR event payload shapes,
  permission quirks on forked-repo PRs) are unverified.
- `sauce-labs-cli`'s repaired timestamp-unit fix (RDC ms-vs-seconds) and a
  few response-shape assumptions were reasoned from API docs, not observed
  against a real authenticated session (only a 401 was verified live) —
  flag if anyone gets real Sauce Labs credentials to double check.

## Done this session (for reference)

- [x] swarmdriver extracted, restructured to TS pnpm monorepo, docs site
      live, Changesets/OIDC release flow wired (`0210c46`…`aaaed39`)
- [x] monorepo-toolkit extracted, 13 bugs fixed (`1db5fd5`)
- [x] datadog-metrics-buffer extracted, fork attribution added (`fd1ccd2`)
- [x] babel-preset-forge extracted, real tarball-install E2E verified (`4c65f3d`)
- [x] forgepack extracted, all 7 dependencies resolved with no stubs (`cab4919`)
- [x] sauce-labs-cli repaired from a misidentified `jira` package, 20+ bugs
      fixed, 206 tests from zero (`d21ded6`, `7a47de0`)
- [x] `@cogs/node-pkg` + `@cogs/browserslist-config` added to cogs (`62f169c`, `abf70e7`)
- [x] actionforge built from scratch: 4 libraries + 6 actions, 2 of which
      (pnpm caching, affected-detection) are genuinely new design, not
      extraction (`4957341`…`c3dbc75`)
