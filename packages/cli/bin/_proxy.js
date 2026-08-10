import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const here = path.dirname(fileURLToPath(import.meta.url))

/**
 * Re-exposes a dependency's CLI under this package's own `bin` namespace, so
 * consumers get a pinned `wdio` / `appium` / `allure` without installing each
 * one separately.
 *
 * Resolves the requested package's bin entry from its own `package.json` and
 * re-executes it with node, forwarding argv, stdio and exit status.
 *
 * @param {string} pkgName - npm package to proxy into, e.g. `@wdio/cli`.
 * @param {string} binName - key in that package's `bin` map, e.g. `wdio`.
 * @returns {void}
 */
export default function binProxy(pkgName, binName) {
  const paths = [path.join(here, '..'), here, process.cwd()]

  let pkgJsonPath
  try {
    // Fast path: package explicitly exports its manifest.
    pkgJsonPath = require.resolve(`${ pkgName }/package.json`, { paths })
  } catch {
    // Fallback: resolve the entry point and walk up to the owning manifest.
    // Needed for packages whose `exports` map omits `./package.json`.
    let dir = path.dirname(require.resolve(pkgName, { paths }))
    while (!fs.existsSync(path.join(dir, 'package.json'))) {
      const parent = path.dirname(dir)
      if (parent === dir) {
        throw new Error(`Could not locate package.json for ${ pkgName }`)
      }
      dir = parent
    }
    pkgJsonPath = path.join(dir, 'package.json')
  }

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
  const bin = typeof pkg.bin === 'string' ? pkg.bin : (pkg.bin || {})[binName]

  if (!bin) {
    throw new Error(`Package ${ pkgName } has no bin entry named ${ binName }`)
  }

  const target = path.resolve(path.dirname(pkgJsonPath), bin)
  const child = spawn(process.execPath, [target, ...process.argv.slice(2)], {
    stdio: 'inherit',
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
      return
    }
    process.exit(code === null ? 1 : code)
  })
}
