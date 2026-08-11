<!--
PUBLIC blog post draft. Repo is already public OSS (swarmdriver on npm as @caps/*),
so package/repo names are fine to keep. Reviewed for secrets/tokens/hostnames: none present.
-->

# The `.ts` extension lied to us — and the compiler is worse at finding out than you'd think

*Converting eight "already TypeScript" files to actually-typed TypeScript surfaced a 2.6x undercount, a real latent bug, and a CLI flag that silently checks nothing.*

## The problem

A batch of WebdriverIO/Appium helper files had been ported from JavaScript to TypeScript the easy way: rename `.js` to `.ts`, fix whatever the compiler complained about, ship it. The compiler didn't complain much, because the project's `tsconfig` had `strict: false` and no `noImplicitAny` — so every untyped parameter, every implicit-`any` return, every unchecked failure case sailed through silently. The files *looked* like TypeScript. They weren't, in any way that would catch a real bug.

Turning that into actually-typed code sounds like a mechanical chore: add parameter types, run `tsc`, fix what breaks. It wasn't. Three separate things went wrong before a line of code was even written, and a fourth showed up mid-implementation.

## What I tried

**First: don't trust a manual read of "how much untyped code is there."** A first-pass estimate, made by reading the files, put the untyped surface at about 30 sites. Running `tsc --noImplicitAny` against the real files found 78 — a 2.6x undercount, concentrated exactly in the files the manual read had called "small, low risk." The gap was categories a human reading source code doesn't intuitively flag as "untyped": indexing into an object by a variable key, a self-recursive function with no declared return type, importing a package that ships no type declarations. All of those compile fine under loose settings and look identical to properly-typed code until you flip the flag that checks.

**Second: honest failure types find real bugs, and that's the point, not a side effect.** One helper function returned `false` on a lookup failure instead of throwing. Under implicit-`any`, every caller could dereference that result freely — a lookup miss just crashed one property access later, with a generic `TypeError` that told you nothing about what was actually missing. Typing the return as `Element | false` instead of `any` immediately broke three other files' compilation, because they'd been dereferencing that value unguarded the whole time. That's not the type system being pedantic — it's the type system finding a bug that was always there, just invisible.

The tempting fix is to type the failure case away — cast it back to the success type, or type the parameter loosely enough that the compiler stops complaining. That's not fixing anything; it's teaching the type checker to agree with a lie the runtime doesn't honor. The better fix: keep the honest union type, and audit each call site individually. Most of them, it turns out, already handled the `false` case correctly with a plain `if (result) { ... }` — TypeScript narrows that automatically, so they needed zero changes once the type was honest. Only the genuinely-unguarded sites needed a real fix: a small helper that throws a specific, named error instead of letting an unrelated property access crash later.

```ts
// Before: the failure case is invisible to callers.
const findEle = async (selector: string) => {
  const el = await $(selector)
  if (!el) return false
  return el
}

// The honest type surfaces every unguarded caller at compile time.
const findEle = async (selector: string): Promise<Element | false> => { /* ... */ }

// A small helper turns "crash one property access later" into
// an explicit, named failure — only where the compiler actually flags it.
const assertEle = (el: Element | false, selector?: string): Element => {
  if (el === false) throw new Error(`Element not found: ${selector ?? 'unknown'}`)
  return el
}
```

**Third: a documented verification command can be silently wrong.** Part of the plan for gating this conversion was checking, at every step, that the compiler's file list actually included the file you thought you'd just added — otherwise a typo or a forgotten entry means a file is silently never checked, and every gate reports green. The documented way to check this was `tsc --showConfig | grep <filename>`. It returned nothing. Always. Turns out `--showConfig` on the installed TypeScript version echoes compiler options and excludes, but not the resolved file list — even though that list is set explicitly in the config. Three review passes proposed this exact command before anyone actually ran it against a real config. The fix was mechanical once found (`tsc --listFiles` instead), but it's a reminder that "the plan says to run this command" and "this command does what the plan assumes" are different claims, and only one of them is free to verify.

**Fourth: `pnpm install` can rewrite a lockfile far beyond what you asked it to.** Adding one devDependency — a single line in `package.json` — produced a lockfile diff touching completely unrelated packages elsewhere in the workspace. The instinct is to assume something's wrong with the new dependency. It wasn't: stashing the change and running `pnpm install --frozen-lockfile` against the *original* lockfile confirmed it was already in sync. The broad diff was the install tool recomputing peer-dependency resolution hashes for the whole workspace as a side effect of running at all — equally valid, just different formatting, for packages that had nothing to do with the change. The fix was to revert the auto-generated lockfile and hand-add only the few lines actually required.

## What I learned

- When a manual inventory and a compiler's own count disagree on "how much untyped code is there," the compiler is right. This isn't a close call — it was directionally wrong by 2.6x, in a way that would have under-scoped every downstream estimate.
- An honest type that starts failing compilation for existing callers is usually not the type system being difficult — it's exposing a bug that was always reachable, just silent. The response should be "audit each site, fix only the ones that need it," not "make the type loose enough that the error goes away."
- A verification command that "should" work is a claim, not a fact, until you've run it against the real thing. This is especially true for CLI flags whose exact output shape isn't part of any stability guarantee.
- A large, unexpected diff in a generated file (a lockfile, a build artifact, a snapshot) is worth root-causing before accepting it. "The tool did this automatically" is not the same as "this change is actually necessary."

## Takeaways

- Trust the compiler's count over a manual read when converting untyped-but-`.ts`-named code — the categories a human misses (enum indexing, self-recursive return types, untyped imports) are exactly the ones that matter.
- Treat a newly-honest failure type as a bug-finding tool, not an obstacle: audit every broken call site individually before deciding whether it needs a fix or was already safe.
- Verify any documented CLI-based check by actually running it, especially across tool versions — a check that silently passes when it shouldn't is worse than no check.
- If a generated file's diff is much bigger than the change that supposedly caused it, find out why before committing it.

---

<!-- Suggested tags: typescript, testing, appium, webdriverio, code-review · Est. reading time: 6 min -->
