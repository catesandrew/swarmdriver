import { defineConfig } from 'vitest/config'

import { workspaceAliases } from '../../vitest.shared.js'

export default defineConfig({
  resolve: {
    alias: workspaceAliases,
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.ts', 'test/**/*.{test,spec}.ts'],
    setupFiles: ['../../vitest.setup.js'],
    passWithNoTests: true,
  },
})
