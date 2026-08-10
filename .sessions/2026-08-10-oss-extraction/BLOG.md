<!--
PUBLIC blog post draft. ⚠ SANITIZE before publishing:
  - Remove client names, internal repo/package names, hostnames, ticket ids, secrets.
  - Generalize the setting ("a multi-tenant SaaS", "an internal infra monorepo").
  - When in doubt, leave it out. Ask the user before publishing anywhere.
Keep it a story about the PROBLEM and the TECHNIQUE, not the proprietary system.

SANITIZATION CHECK DONE: no employer name, no internal repo names, no
internal package names beyond what's now public (the new OSS project names
themselves are fine — they're the actual public deliverables). Ticket
IDs/hostnames: none referenced. Reviewed for anything else identifying: none
found, but double-check before publishing anyway per the skill's rule.
-->

# Eight open-source repos, one afternoon, and a package that lied about what it was

*What happens when you point a team of AI agents at years of internal
tooling and ask "which of this is actually worth open-sourcing?"*

## The problem

Every company accumulates internal tooling nobody outside ever sees: babel
presets, webpack config factories, GitHub Actions wrapping other GitHub
Actions, CLI tools glued together over years by whoever needed them that
week. Some of it is genuinely good — better than what's public, even. Most
of it is tangled: internal dependencies on other internal packages, config
values hardcoded to the company's own infrastructure, READMEs nobody's
touched since the tool actually worked.

The instinct is either "none of this is worth the cleanup effort" or "I'll
extract it someday." I wanted to actually test whether a team of AI agents
working in parallel could do that cleanup at a scale and speed that makes
"someday" into "this afternoon" — and, more importantly, whether they'd do
it *honestly*: finding and fixing real bugs instead of just moving files,
and refusing to ship something broken instead of quietly pretending it
worked.

## What I tried

The shape that worked: survey first, decide second, extract in parallel
third.

**Survey in parallel.** Before touching anything, fan out several read-only
agents across a big internal monorepo, each covering a slice of packages,
each producing the same simple table: purpose, size, internal-dependency
count, and a value judgment with a one-line reason. Synthesize the results
into one ranked list. This took minutes for what would've been hours of
manual archaeology, and it surfaced something a manual pass would likely
have missed too: several "substantial" packages were mostly re-exports of
well-known public tools, while a few tiny, unglamorous ones (a monorepo
workspace-resolution helper, a binary-path resolver) were the cleanest,
most genuinely reusable code in the whole repo.

**Extract in parallel, with one hard rule: no stubs.** Internal packages
reference *other* internal packages constantly. The obvious shortcut —
"just depend on the sibling package" — doesn't work when six extractions
are running at once and none of the destination packages exist on a public
registry yet. The rule I gave every extraction agent: if you need a small,
self-contained slice of a dependency that isn't available yet, vendor just
that slice with an attribution comment. If a dependency is too large or
core to vendor responsibly, *stop and report back* — don't ship something
broken and call it done.

```ts
// Illustrative, not the real code:
// PRE-EXISTING DEFECT, DISCOVERED DURING EXTRACTION.
// The original called swipeOnPercentage(a, b) with two positional
// points, but the function takes one { from, to } options object —
// so both fall back to their zero defaults and the "swipe" is a no-op.
// Fixed here; behavior-preservation was explicitly NOT the goal for
// bugs the compiler/tests could actually catch.
```

That rule produced a habit worth keeping regardless of how many agents are
involved: every extraction ended with an actual bug list, because porting
old code with modern type-checking and real test coverage turns out to be
an excellent bug-finding technique on its own. One package had a copy-paste
typo that meant an entire feature area silently did nothing. Another had a
config value hardcoded to a specific server region no matter what a user
configured. A CI helper swallowed every failure and returned an empty
result — which downstream code read as "nothing to do," turning a broken
build into a silent, false green checkmark. None of these were exotic bugs.
All of them had shipped, silently, for a long time.

## The package that lied about what it was

The best story from the whole run: one package was briefed as "an
unfinished internal CLI for a project-tracking tool — audit it, fix it,
finish it, ship it." The extraction agent read the actual source before
touching anything and found: zero code related to that tool. What it
*actually* contained was a completely different CLI — for a cloud device-testing
service — that had been copy-pasted into a wrongly-named directory at some
point, with one class renamed to match the new folder name and nothing
else updated. The README describing the supposedly-unfinished features was
itself boilerplate copied from an unrelated open-source project years
earlier and never touched again.

The agent didn't try to reconcile this. It didn't guess which parts of the
README to implement. It stopped, laid out the evidence — grep counts, the
exact line where a naming mismatch meant an entire command tree silently
registered nothing at runtime — and asked which of three honest paths to
take: ship what the code actually is (renamed truthfully), build what the
README claimed (a real, from-scratch project), or both, staged. We picked
"ship what it is, honestly renamed; the other thing becomes its own
project later." Twenty-some real bugs and two hundred tests later, that
package works and says what it does.

## What I learned

- **Bugs hide in the shell that tests mock away.** The most consistent
  category of surviving bug — across totally unrelated pieces of code —
  wasn't in the core logic. It was in the input-parsing and integration
  layer: a boolean-input parser that throws on an empty string instead of
  using its documented default, a bundler output that crashes on import
  because of an ESM/CJS mismatch several dependencies deep. Unit tests
  mocked exactly that layer away every time. The fix was boring and
  repeatable: actually execute the built artifact with realistic inputs,
  not just run the test suite against source.
- **"Fail soft, return empty" is a trap in anything gating other work.** A
  function that swallows an error and returns an empty list looks
  defensive. If something downstream reads "empty" as "nothing to do,"
  you've turned every failure mode into a silent skip. Fail loud, or make
  the empty case an explicit, opt-in fallback — not the accidental default.
- **A platform's own docs can be your last line of defense, and they're
  worth verifying, not assuming.** A caching platform's own composability
  primitives, a linter's machine-readable output format, a test runner's
  coverage report shape — several of these differed from what a
  plausible-sounding assumption would have produced, in ways that would
  have silently shipped wrong behavior. Checking the real, current tool
  before writing code against it caught every one.
- **When a task's premise turns out to be false, stop.** The instinct under
  pressure to "just get it done" is strong. The single best decision made
  across this whole run was an agent choosing not to guess its way through
  a wrong premise, and instead surfacing the mismatch with evidence and
  waiting for a real answer.

## Takeaways

- Survey before you extract — a cheap parallel read-only pass will change
  your priority order, often surprisingly.
- Give extraction work one non-negotiable rule ("no stubs, report back
  instead") and you get an honest bug list as a side effect, for free.
- Test the built artifact, not just the source — a whole class of real
  bugs only exists in the gap between the two.
- The instinct to plow through a shaky premise is the one worth resisting
  hardest, whether you're the one doing the work or reviewing it.

---

<!-- Suggested tags: open-source, ai-agents, developer-tools, refactoring, monorepo · Est. reading time: 6 min · Cross-post targets: dev.to, personal blog -->
