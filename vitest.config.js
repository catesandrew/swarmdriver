import { defineConfig } from 'vitest/config'

/** Unit + config-smoke test runner configuration. */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.js', 'test/**/*.{test,spec}.js'],
    setupFiles: ['./vitest.setup.js'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.js'],
      exclude: [
        'src/**/*.{test,spec}.js',
        'src/helpers/**',
        'src/enums/**',
        'src/exports/**',
      ],
    },
  },
})
