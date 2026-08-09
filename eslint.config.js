import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'

/**
 * eslint:recommended + import + promise, in flat-config form.
 */
export default [
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'docs/api/**',
      'node_modules/**',
      '.changeset/**',
    ],
  },

  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  promisePlugin.configs['flat/recommended'],

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
        FormData: 'readonly',
        fetch: 'readonly',
        // wdio testrunner globals
        driver: 'readonly',
        browser: 'readonly',
        document: 'readonly',
        $: 'readonly',
        $$: 'readonly',
      },
    },
    rules: {
      'import/no-unresolved': 0,
      'import/prefer-default-export': 0,
      'import/no-named-as-default': 0,
      'no-console': 0,
      // The source predates this config and leans on unused destructuring for
      // "omit these keys" semantics; keep it a warning rather than an error.
      'no-unused-vars': ['warn', {
        args: 'none',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
      }],
    },
  },

  {
    files: ['src/**/*.js'],
    rules: {
      'promise/catch-or-return': 0,
      'promise/always-return': 0,
    },
  },

  {
    files: ['src/helpers/browser/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    files: ['**/*.{spec,test}.js', '**/__{mocks,tests}__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },

  {
    // `package.json` is `type: module`, so only explicit `.cjs` files are
    // CommonJS. The `bin/` shims are ESM like the rest of the package.
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
]
