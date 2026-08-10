/**
 * Root vitest workspace: lets `vitest run` at the repo root execute every
 * package's suite in one pass, while `pnpm -r test` still runs each package's
 * own `vitest.config.js` independently.
 */
export default [
  'packages/core',
  'packages/reporters',
  'packages/providers',
  'packages/cli',
  'packages/integration-tests',
]
