import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const pkg = (name) => path.join(root, 'packages', name, 'src')

/**
 * Resolve `@caps/*` specifiers to package SOURCE during tests.
 *
 * Without these, vite would follow `package.json#exports` into `dist/`, which
 * would make every unit test depend on a prior `pnpm -r build` and would test
 * bundled output rather than the files under edit.
 *
 * Two properties matter and are easy to get wrong:
 *
 * 1. Order. Vite matches string aliases by prefix, so the bare-package regexes
 *    are anchored with `$` and listed before the subpath patterns; otherwise
 *    `@caps/core` would swallow `@caps/core/utils`.
 * 2. Identity. `@caps/core/services` must resolve to the exact same file id as
 *    the relative `./services` import inside `packages/core/src/api.ts`, or a
 *    `vi.mock('@caps/core/services')` in a test would mock a different module
 *    instance than the one `buildWdioConfig()` actually calls.
 * 3. Extension. The bare-package targets are written WITHOUT an extension so
 *    vite's resolver picks up `index.ts` or `index.js` — packages migrate to
 *    TypeScript independently and this file must not have to track that.
 */
export const workspaceAliases = [
  { find: /^@caps\/core$/, replacement: path.join(pkg('core'), 'index') },
  { find: /^@caps\/reporters$/, replacement: path.join(pkg('reporters'), 'index') },
  { find: /^@caps\/providers$/, replacement: path.join(pkg('providers'), 'index') },
  { find: /^@caps\/cli$/, replacement: path.join(pkg('cli'), 'index') },

  { find: /^@caps\/core\/(.*)$/, replacement: path.join(pkg('core'), '$1') },
  { find: /^@caps\/reporters\/(.*)$/, replacement: path.join(pkg('reporters'), '$1') },
  { find: /^@caps\/providers\/(.*)$/, replacement: path.join(pkg('providers'), '$1') },
  { find: /^@caps\/cli\/(.*)$/, replacement: path.join(pkg('cli'), '$1') },
]
