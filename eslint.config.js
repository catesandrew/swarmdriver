import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'
import tseslint from 'typescript-eslint'

/**
 * eslint:recommended + import + promise + typescript-eslint, in flat-config
 * form. Shared by every workspace package via a one-line re-export.
 */
export default [
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      'docs/api/**',
      '**/node_modules/**',
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

  // TypeScript. ESLint 9's flat config only picks up `.js`/`.cjs`/`.mjs` out
  // of the box, so without this block every package's `.ts` source is silently
  // skipped and `pnpm -r lint` reports a hollow zero. Scoped to `**/*.ts` via
  // `tseslint.config()` so the `.js` that remains (integration-tests, `bin/`
  // shims, tooling configs) keeps the plain-JS parser and rule set above.
  ...tseslint.config({
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended],
    rules: {
      // The base `no-unused-vars` above (warn, `^_` ignore pattern,
      // omit-via-destructuring friendly) does not govern the TS-aware rule,
      // which typescript-eslint's recommended config turns on at 'error' with
      // its own defaults -- mirror the base settings so `.ts` gets the same
      // leniency rather than a stricter accidental one.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        args: 'none',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
      }],
      // The source predates strict typing and leans on `any` in a handful of
      // spots (untyped third-party reporter deps, WDIO runtime shape casts) --
      // same pragmatism as `no-unused-vars` being a warning.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      // `applyEnvDefaults()` and the local `setup*` paths fill in defaults with
      // the operator-precedence-safe `envs.X || (envs.X = 'default')` idiom --
      // "only if unset", and deliberately `||` rather than `??` so an empty
      // string also falls through to the default. It is a documented
      // convention (see docs/providers.mdx), not an accident, so allow the
      // short-circuit form rather than rewriting ~8 call sites.
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
      }],
    },
  }),

  {
    files: ['**/src/**/*.{js,ts}'],
    rules: {
      'promise/catch-or-return': 0,
      'promise/always-return': 0,
    },
  },

  {
    files: ['src/helpers/browser/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    files: ['**/*.{spec,test}.{js,ts}', '**/__{mocks,tests}__/**/*.{js,ts}'],
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
