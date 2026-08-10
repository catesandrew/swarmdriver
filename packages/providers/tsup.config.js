import { defineConfig } from 'tsup'

/**
 * `treeshake` stays off and `sideEffects` is `true` in `package.json`: this
 * package's entry point registers its providers into `@caps/core`'s registry
 * purely for the side effect, and a bundler that believes the import is inert
 * would drop it.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    saucelabs: 'src/saucelabs/index.ts',
  },
  format: ['esm', 'cjs'],
  outDir: 'dist',
  target: 'node20',
  platform: 'node',
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: false,
  shims: true,
  dts: false,
})
