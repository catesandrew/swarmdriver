import { defineConfig } from 'tsup'

/**
 * Emits ESM + CJS in one pass. The CJS output is named `.cjs`, so no
 * per-directory `package.json` `type` patching is required.
 *
 * Type declarations are NOT generated here — `tsup`'s `dts` option is built for
 * TypeScript entry points and is unreliable against plain JS + JSDoc. They come
 * from a dedicated `tsc --emitDeclarationOnly` pass (`npm run build:types`).
 */
export default defineConfig({
  entry: {
    index: 'src/index.js',
    faker: 'src/exports/faker.js',
    'sauce-cli': 'src/sauce-cli/index.js',
  },
  format: ['esm', 'cjs'],
  outDir: 'dist',
  target: 'node20',
  platform: 'node',
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: false,
  // `src/resolve.js` relies on `import.meta.url`; shims let the same source
  // compile to a working CJS artifact.
  shims: true,
  dts: false,
})
