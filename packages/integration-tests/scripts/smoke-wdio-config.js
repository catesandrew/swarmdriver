#!/usr/bin/env node
/**
 * WDIO v9 config smoke-test (Phase 3 go/no-go gate).
 *
 * Builds every `remote` x `scope` x `metal` combination `buildWdioConfig()`
 * supports, runs each result through `@wdio/config`'s real `ConfigParser`
 * (the same code path `@wdio/cli` uses to load a `wdio.conf.js`), and asserts
 * that every produced capability is strict-W3C shaped.
 *
 * Exits non-zero on the first failure so CI can gate on it.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { runSmokeMatrix, formatResult } from '../src/wdio-config-smoke.js'

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'swarmdriver-smoke-'))

try {
  const results = await runSmokeMatrix({ tmpDir })

  let failed = 0
  for (const result of results) {
    console.log(formatResult(result))
    if (!result.ok) {
      failed += 1
    }
  }

  console.log('')
  console.log(`${ results.length - failed }/${ results.length } combinations passed`)

  if (failed > 0) {
    process.exitCode = 1
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true })
}
