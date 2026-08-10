import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    jobs: 'src/jobs/index.ts',
    storage: 'src/storage/index.ts',
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
