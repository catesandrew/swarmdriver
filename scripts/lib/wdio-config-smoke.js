/**
 * Shared implementation for the WDIO v9 config smoke-test.
 *
 * Used by both `scripts/smoke-wdio-config.js` (CLI gate) and
 * `test/wdio-config-smoke.test.js` (vitest).
 *
 * For each `remote` x `scope` x `metal` branch of `buildWdioConfig()` this
 * writes a real `wdio.conf.js`, loads it through WDIO v9's own `ConfigParser`
 * (the exact code path `@wdio/cli` uses), and then asserts the resulting
 * capabilities are strict-W3C shaped.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { ConfigParser } from '@wdio/config/node'

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(here, '../..')

/**
 * The generated `wdio.conf.js` is loaded by WDIO's own ConfigParser via a raw
 * `import()`, so it has to resolve the same way a consumer's would: through
 * the package's built ESM entry. (`src/` uses extensionless imports that plain
 * Node ESM cannot resolve — the bundler is what makes them work.)
 */
const DIST_ENTRY = path.join(ROOT, 'dist/index.js')

export function apiModuleUrl() {
  if (!fs.existsSync(DIST_ENTRY)) {
    throw new Error(
      `Missing ${ DIST_ENTRY }. Run \`npm run build\` before the config smoke-test.`,
    )
  }
  return pathToFileURL(DIST_ENTRY).href
}

/**
 * Every combination `buildWdioConfig()` branches on.
 * See `src/api.js` for the exact branch values.
 */
export const MATRIX = [
  { remote: 'local', scope: 'browser', metal: 'desktop' },
  { remote: 'local', scope: 'browser', metal: 'device' },
  { remote: 'local', scope: 'app', metal: 'device' },
  { remote: 'saucelabs', scope: 'browser', metal: 'desktop' },
  { remote: 'saucelabs', scope: 'browser', metal: 'device' },
  { remote: 'saucelabs', scope: 'app', metal: 'device' },
]

/**
 * Capability keys defined by the W3C WebDriver spec. Anything else must be a
 * vendor extension, i.e. contain exactly one `:` with a non-empty prefix.
 * https://w3c.github.io/webdriver/#capabilities
 */
const W3C_STANDARD_KEYS = new Set([
  'browserName',
  'browserVersion',
  'platformName',
  'acceptInsecureCerts',
  'pageLoadStrategy',
  'proxy',
  'setWindowRect',
  'timeouts',
  'strictFileInteractability',
  'unhandledPromptBehavior',
  'webSocketUrl',
])

const VENDOR_EXTENSION = /^[a-zA-Z][a-zA-Z0-9_]*:[a-zA-Z][a-zA-Z0-9_.-]*$/

/**
 * @param {object} capability - a single capability object.
 * @returns {string[]} list of offending keys (empty when strict-W3C valid).
 */
export function findNonW3CKeys(capability) {
  return Object.keys(capability).filter((key) => {
    if (W3C_STANDARD_KEYS.has(key)) {
      return false
    }
    return !VENDOR_EXTENSION.test(key)
  })
}

/**
 * Env-var fixture that exercises the sauce branches without needing real
 * credentials present in the developer's shell.
 *
 * @param {object} combo - one entry of `MATRIX`.
 * @returns {object} envs object handed to `buildWdioConfig`.
 */
export function envsFor(combo) {
  const base = {
    WDIO_LOG_LEVEL: 'silent',
    WDIO_MAX_INSTANCES: '1',
  }

  if (combo.remote !== 'saucelabs') {
    return base
  }

  return {
    ...base,
    SAUCE_USERNAME: 'smoke-user',
    SAUCE_ACCESS_KEY: 'smoke-key',
    SAUCE_REGION: 'us',
  }
}

/**
 * Run one combination through `buildWdioConfig()` + the real WDIO v9 config
 * parser.
 *
 * @param {object} combo - one entry of `MATRIX`.
 * @param {{ tmpDir: string }} opts - where to write the throwaway conf files.
 * @returns {Promise<object>} result record.
 */
export async function runCombination(combo, { tmpDir }) {
  const label = `${ combo.remote } x ${ combo.scope } x ${ combo.metal }`
  const slug = `${ combo.remote }-${ combo.scope }-${ combo.metal }`

  const specPath = path.join(tmpDir, 'noop.spec.js')
  if (!fs.existsSync(specPath)) {
    fs.writeFileSync(specPath, '// placeholder spec so ConfigParser can resolve specs\n')
  }

  // A real `wdio.conf.js`, exactly as a consumer would write one.
  const confPath = path.join(tmpDir, `wdio.${ slug }.conf.js`)
  fs.writeFileSync(confPath, [
    `import { buildWdioConfig } from ${ JSON.stringify(apiModuleUrl()) }`,
    '',
    'export const config = {',
    '  ...buildWdioConfig({',
    `    envs: ${ JSON.stringify(envsFor(combo)) },`,
    `    remote: ${ JSON.stringify(combo.remote) },`,
    `    scope: ${ JSON.stringify(combo.scope) },`,
    `    metal: ${ JSON.stringify(combo.metal) },`,
    '    pkgName: \'swarmdriver-smoke\',',
    '  }),',
    `  specs: [${ JSON.stringify(specPath) }],`,
    '}',
    '',
  ].join('\n'))

  let capabilities
  let parsedConfig
  try {
    const parser = new ConfigParser(confPath, {})
    // `initialize()` imports the conf file and runs WDIO v9's `validateConfig`
    // against it. This throws on an unusable config.
    await parser.initialize()

    parsedConfig = parser.getConfig()
    capabilities = parser.getCapabilities()
  } catch (error) {
    return { label, combo, ok: false, stage: 'validate', error }
  }

  const capsArray = Array.isArray(capabilities) ? capabilities : [capabilities]

  if (capsArray.length === 0) {
    return {
      label,
      combo,
      ok: false,
      stage: 'capabilities',
      error: new Error('config produced zero capabilities'),
    }
  }

  const offenders = new Set()
  for (const cap of capsArray) {
    const target = cap && cap.alwaysMatch ? cap.alwaysMatch : cap
    for (const key of findNonW3CKeys(target)) {
      offenders.add(key)
    }
  }

  if (offenders.size > 0) {
    return {
      label,
      combo,
      ok: false,
      stage: 'capabilities',
      capabilityCount: capsArray.length,
      capabilities: capsArray,
      error: new Error(`non-W3C capability keys: ${ [...offenders].join(', ') }`),
    }
  }

  return {
    label,
    combo,
    ok: true,
    stage: 'done',
    capabilityCount: capsArray.length,
    capabilities: capsArray,
    config: parsedConfig,
  }
}

/**
 * @param {{ tmpDir: string }} opts - where to write throwaway conf files.
 * @returns {Promise<object[]>} one result record per matrix entry.
 */
export async function runSmokeMatrix({ tmpDir }) {
  const results = []
  for (const combo of MATRIX) {
    // Sequential: `buildWdioConfig` mutates the `envs` object it is handed and
    // parallelism would only obscure which branch failed.
    results.push(await runCombination(combo, { tmpDir }))
  }
  return results
}

/**
 * @param {object} result - a record from `runCombination`.
 * @returns {string} one-line human readable summary.
 */
export function formatResult(result) {
  if (result.ok) {
    return `PASS  ${ result.label.padEnd(34) } ${ result.capabilityCount } capability(ies)`
  }
  return `FAIL  ${ result.label.padEnd(34) } [${ result.stage }] ${ result.error.message }`
}
