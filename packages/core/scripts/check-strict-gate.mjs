#!/usr/bin/env node
/**
 * Executable form of the tsconfig.strict.json ratchet gate.
 *
 * `tsc --showConfig` does not echo the resolved `files`/`include` list on the
 * TypeScript version this package pins, so a manual `grep`-on-output check
 * (as the original conversion plan specified) silently checks nothing. This
 * script uses `tsc --listFiles` instead, which reflects the real resolved
 * program, and adds two checks a human running commands by hand would skip:
 * that the program actually contains every expected native helper file (a
 * file silently missing from `tsconfig.strict.json#files` would otherwise
 * report a false "clean" pass), and that `tsc`'s own output contains no
 * bare, file-less `error TS...` line (a config-level failure, which also
 * produces empty `grep -E "src/helpers/native/"` output and would otherwise
 * look identical to "clean").
 */

import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tsconfigStrict = path.join(packageRoot, 'tsconfig.strict.json')

// Every file this conversion pass has actually converted. Update this list
// (and tsconfig.strict.json#files) together when a new file is added.
const EXPECTED_NATIVE_HELPER_FILES = [
  'src/helpers/native/alert.ts',
  'src/helpers/native/base.ts',
  'src/helpers/native/carousel.ts',
  'src/helpers/native/find-strategy.ts',
  'src/helpers/native/gestures.ts',
  'src/helpers/native/picker.ts',
  'src/helpers/native/utils.ts',
  'src/helpers/native/web-view.ts',
]

// The out-of-scope baseline from the 12 enum files this pass didn't fix
// (see ADR Follow-up #1). Documented so growth is visible, not silent.
const DOCUMENTED_OUT_OF_SCOPE_BASELINE = 72

const run = (args) => {
  try {
    return {
      status: 0,
      stdout: execFileSync('pnpm', ['exec', 'tsc', ...args], {
        cwd: packageRoot,
        encoding: 'utf8',
      }),
    }
  } catch (err) {
    return {
      status: err.status ?? 1,
      stdout: `${ err.stdout || '' }${ err.stderr || '' }`,
    }
  }
}

const fail = (message) => {
  console.error(`✘ ${ message }`)
  process.exitCode = 1
}

// 1. Membership: every expected file must actually be in the checked program.
const { stdout: listedFiles } = run(['--listFiles', '-p', tsconfigStrict])
const listedNativeHelperFiles = listedFiles
.split('\n')
.filter((line) => line.includes('/helpers/native/'))
.map((line) => line.trim())

const missing = EXPECTED_NATIVE_HELPER_FILES.filter(
  (expected) => !listedNativeHelperFiles.some((listed) => listed.endsWith(expected)),
)

if (missing.length > 0) {
  fail(`tsconfig.strict.json#files is missing: ${ missing.join(', ') }`)
} else {
  console.log(`✓ all ${ EXPECTED_NATIVE_HELPER_FILES.length } native helper files are present in the checked program`)
}

const unexpected = listedNativeHelperFiles.filter(
  (listed) => !EXPECTED_NATIVE_HELPER_FILES.some((expected) => listed.endsWith(expected)),
)
if (unexpected.length > 0) {
  fail(`tsconfig.strict.json#files lists unexpected native helper file(s): ${ unexpected.join(', ') } — update EXPECTED_NATIVE_HELPER_FILES in this script`)
}

// 2. Diagnostics: run the actual check.
const { stdout: diagnosticsOutput } = run(['--noEmit', '-p', tsconfigStrict])
const diagnosticLines = diagnosticsOutput.split('\n').filter(Boolean)

// A config-level failure (bad path, malformed JSON, unsupported option) has
// no file:line prefix — it starts directly with "error TS".
const configErrors = diagnosticLines.filter((line) => /^error TS\d+:/.test(line.trim()))
if (configErrors.length > 0) {
  fail(`tsc reported config-level error(s), not per-file diagnostics — the scoped check below cannot be trusted until these are fixed:\n${ configErrors.join('\n') }`)
}

// 3. Scoped diagnostics: zero tolerance for anything under the files this
// plan actually converts.
const scopedDiagnostics = diagnosticLines.filter(
  (line) => line.includes('src/helpers/native/') || line.includes('src/globals.d.ts'),
)
if (scopedDiagnostics.length > 0) {
  fail(`${ scopedDiagnostics.length } diagnostic(s) found under src/helpers/native/ or src/globals.d.ts:\n${ scopedDiagnostics.join('\n') }`)
} else {
  console.log('✓ zero diagnostics scoped to src/helpers/native/ or src/globals.d.ts')
}

// 4. Out-of-scope baseline: log it, warn (don't fail) if it grows.
const outOfScopeCount = diagnosticLines.filter((line) => /error TS\d+:/.test(line)).length - scopedDiagnostics.length - configErrors.length
console.log(`ℹ out-of-scope diagnostic count: ${ outOfScopeCount } (documented baseline: ${ DOCUMENTED_OUT_OF_SCOPE_BASELINE })`)
if (outOfScopeCount > DOCUMENTED_OUT_OF_SCOPE_BASELINE) {
  console.warn(`⚠ out-of-scope diagnostic count grew from the documented baseline of ${ DOCUMENTED_OUT_OF_SCOPE_BASELINE } to ${ outOfScopeCount } — investigate before assuming this is still just the 12 unfixed enum files`)
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log('✓ strict ratchet gate passed')
