import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import {
  MATRIX,
  runCombination,
  findNonW3CKeys,
} from '../scripts/lib/wdio-config-smoke.js'

/**
 * Phase 3 go/no-go gate, kept as a permanent regression test.
 *
 * Requires `npm run build` first: the generated `wdio.conf.js` is loaded by
 * WDIO's own ConfigParser through a raw `import()`, so it must resolve the
 * package the same way a consumer would — via the built ESM entry.
 */
const DIST_ENTRY = path.join(import.meta.dirname, '../dist/index.js')
const built = fs.existsSync(DIST_ENTRY)

describe.skipIf(!built)('buildWdioConfig() against WDIO v9 config validation', () => {
  let tmpDir

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'swarmdriver-smoke-'))
  })

  afterAll(() => {
    if (tmpDir) {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  it.each(MATRIX)(
    'loads and validates $remote x $scope x $metal',
    async (combo) => {
      const result = await runCombination(combo, { tmpDir })

      if (!result.ok) {
        throw new Error(`[${ result.stage }] ${ result.error.message }`)
      }

      expect(result.capabilityCount).toBeGreaterThan(0)

      for (const capability of result.capabilities) {
        const target = capability.alwaysMatch ? capability.alwaysMatch : capability
        expect(findNonW3CKeys(target)).toEqual([])
        // A capability with no browser/platform hint is not usable.
        expect(
          Boolean(target.browserName || target.platformName),
        ).toBe(true)
      }
    },
    60_000,
  )
})

describe('findNonW3CKeys', () => {
  it('accepts standard and vendor-prefixed keys', () => {
    expect(findNonW3CKeys({
      browserName: 'chrome',
      platformName: 'macOS 13',
      'appium:deviceName': 'iPhone 15',
      'sauce:options': {},
      'wdio:maxInstances': 1,
      'goog:chromeOptions': {},
    })).toEqual([])
  })

  it('rejects bare non-standard keys', () => {
    expect(findNonW3CKeys({
      browserName: 'chrome',
      hostname: '127.0.0.1',
      maxInstances: 1,
    })).toEqual(['hostname', 'maxInstances'])
  })
})
