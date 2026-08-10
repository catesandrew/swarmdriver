import { defineConfig } from 'tsup'

/**
 * Emits ESM + CJS in one pass; CJS output is named `.cjs`, so no per-directory
 * `package.json` `type` patching is required.
 *
 * Every entry here is a public subpath in `package.json#exports`. They share a
 * single tsup build so esbuild's code splitting gives them ONE copy of shared
 * modules — which matters for `providers/registry.ts`, whose exported object is
 * mutable state. (`registry.ts` additionally anchors itself on a
 * `Symbol.for()` key so even the un-split CJS output stays a singleton.)
 *
 * Type declarations come from a dedicated `tsc --emitDeclarationOnly` pass
 * (`pnpm run build:types`) rather than tsup's `dts`, so the emitted `.d.ts`
 * comes from the same compiler that type-checks the sources.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    faker: 'src/exports/faker.ts',
    utils: 'src/utils.ts',
    enums: 'src/enums/index.ts',
    helpers: 'src/helpers/index.ts',
    machines: 'src/machines/index.ts',
    providers: 'src/providers/index.ts',
    sauce: 'src/sauce/index.ts',
    services: 'src/services/index.ts',
    'services/base': 'src/services/base.ts',
    'services/utils': 'src/services/utils.ts',
  },
  format: ['esm', 'cjs'],
  outDir: 'dist',
  target: 'node20',
  platform: 'node',
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: false,
  // `src/resolve.ts` relies on `import.meta.url`; shims let the same source
  // compile to a working CJS artifact.
  shims: true,
  dts: false,
})
