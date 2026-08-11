# Follow-ups — OSS extraction marathon (2026-08-10)

## Blocked on the user (decisions / approvals / access)

- [ ] **`datadog-metrics-buffer` fork-attribution question — resolved for now.**
      User decided: skip the publish decision for the time being, document
      explicitly as a fork of `node-datadog-metrics` with concrete differences
      called out (done, `e1133ea`). Revisit publish/don't-publish later.
- [ ] **`atlassian-jira-cli`** — a real Jira REST v3 CLI (issues, JQL,
      sprints, comments/assignment). Explicitly deferred as a separate
      future project when `jira` (the source package) turned out to contain
      zero Jira code. Not started. Would be genuinely new product work, not
      an extraction, and largely unverifiable without live Jira credentials.
- [ ] **OIDC trusted-publisher setup on npm's side.** First publish round for
      all 7 published repos was manual (`npm login` + `npm publish`/`pnpm
      publish`, done by the user). swarmdriver's `release.yml` is wired for
      OIDC (`id-token: write`, no `NPM_TOKEN`), but the npmjs.com Trusted
      Publisher configuration itself hasn't been confirmed done, and the
      other 6 published repos' `release.yml`s (monorepo-toolkit,
      babel-preset-forge, sauce-labs-cli, forgepack, cogs, actionforge) were
      never given the same OIDC treatment — they still assume manual publish
      only. Needs: (1) confirm/complete npm Trusted Publisher setup for
      swarmdriver, (2) wire OIDC into the other 6 repos' release workflows
      the same way.

## Blocked on work (do next, no user input needed)

- [ ] **actionforge's `jest` action bundle is 1.9MB unminified** (octokit
      dominates). Sibling `eslint` action uses the same unminified esbuild
      invocation for consistency. Worth a repo-wide decision on
      `--minify`, not made this session. — `actionforge/actions/*/`
- [ ] **Vendored-code consolidation** — several extractions vendored small
      slices of logic from packages that were *also* being extracted this
      session into `cogs`/other repos (see
      `adr/0003-cross-repo-dependency-vendoring-rule.md`). Now that
      `@cogs/node-pkg`, `@cogs/browserslist-config`, and `@actionforge/*` are
      actually published, the vendored copies in `datadog-metrics-buffer`,
      `babel-preset-forge`, and `forgepack` are candidates to become real
      npm dependencies instead of vendored slices. Not started.

## Nice-to-have / later

- [ ] `graph-ns` (→ `@actionforge/graph-ns`) generalization away from its
      original API-Elements/Refract-specific framing was done at the code
      level but could use a docs/example pass showing a non-Refract use
      case, to make the "genuinely generic" claim land for a new reader.
- [ ] None of the actionforge GitHub Actions have run inside a real GitHub
      Actions workflow yet — only local bundle-execution smoke tests
      against stubbed GitHub API responses. Worth a real dry-run workflow,
      now that everything is pushed and the libraries are published.

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
- Publishing an unscoped npm package name can fail on *similarity* to an
  unrelated existing package (npm's anti-squatting heuristic), not just
  exact-name collision — this can't be checked in advance via `npm view`,
  only discovered at actual publish time. See LESSONS.md.

## Done this session (for reference)

- [x] swarmdriver extracted, restructured to TS pnpm monorepo, docs site
      live, Changesets/OIDC release flow wired (`0210c46`…`aaaed39`)
- [x] monorepo-toolkit extracted, 13 bugs fixed (`1db5fd5`)
- [x] datadog-metrics-buffer extracted, fork attribution added and later
      expanded into a full differences table (`fd1ccd2`, `e1133ea`)
- [x] babel-preset-forge extracted, real tarball-install E2E verified (`4c65f3d`)
- [x] forgepack extracted, all 7 dependencies resolved with no stubs (`cab4919`)
- [x] sauce-labs-cli repaired from a misidentified `jira` package, 20+ bugs
      fixed, 206 tests from zero, pushed (`d21ded6`, `7a47de0`)
- [x] `@cogs/node-pkg` + `@cogs/browserslist-config` added to cogs (`62f169c`, `abf70e7`)
- [x] actionforge built from scratch: 4 libraries + 6 actions, 2 of which
      (pnpm caching, affected-detection) are genuinely new design, not
      extraction (`4957341`…`c3dbc75`)
- [x] `@caps/providers` → `@caps/cli` dependency inversion fixed — moved the
      Sauce Jobs REST client into `@caps/core`, kept the Commander
      registrars in `@caps/cli` (swarmdriver `7acd998`)
- [x] actionforge's `ci.yml` action-version inconsistency fixed —
      `checkout`/`setup-node`/`pnpm-action-setup` bumped to current majors
      (`88fa5ac`)
- [x] Changesets + a real initial CHANGELOG.md wired into every repo that
      lacked one: monorepo-toolkit (`d2214cc`), babel-preset-forge
      (`a0e2c79`), forgepack (`63d1830`), sauce-labs-cli (`41f1b13`), cogs's
      2 new packages (`39c5c1f`), actionforge's 4 libraries (`5105d31`),
      swarmdriver's 4 packages (`167a869`)
- [x] `sauce-labs-cli` pushed to GitHub (was previously local-only)
- [x] `forgepack` renamed to `@surf/forgepack` after an npm publish 403
      (name too similar to an unrelated package), pushed (`3900305`)
- [x] **First public npm publish round, done manually by the user**:
      swarmdriver (`@caps/core`/`providers`/`reporters`/`cli`),
      monorepo-toolkit, babel-preset-forge, sauce-labs-cli, `@surf/forgepack`,
      `@actionforge/*` (4 libraries, required grabbing the `actionforge` npm
      org scope), `@cogs/node-pkg`, `@cogs/browserslist-config`. 7 of 8
      repos now live on npm.
