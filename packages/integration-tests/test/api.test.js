import { describe, it, expect, vi, beforeEach } from 'vitest'

import { buildWdioConfig } from '@caps/core'
import { registerProvider, getProvider, unregisterProvider } from '@caps/core/providers'
import * as services from '@caps/core/services'

// This suite lives in `@caps/integration-tests` rather than in `@caps/core`
// precisely because it spans both packages: `buildWdioConfig()` ships in core,
// but the `saucelabs` branch is only reachable once `@caps/providers` has
// registered itself. Putting it in core would have meant core dev-depending on
// providers, which is a workspace dependency cycle.
//
// `buildWdioConfig()` is a thin branching layer over the setup*() builders, so
// the builders are stubbed and this suite verifies ONLY the branching logic,
// the envs default-injection, and the provider-registry wiring.
vi.mock('@caps/core/services', () => ({
  setupLocalDesktopBrowsers: vi.fn((args) => ({ id: 'setupLocalDesktopBrowsers', args })),
  setupLocalDeviceBrowsers: vi.fn((args) => ({ id: 'setupLocalDeviceBrowsers', args })),
  setupLocalNativeApp: vi.fn((args) => ({ id: 'setupLocalNativeApp', args })),
}))

/**
 * Importing `@caps/providers` registers the real Sauce provider. We keep its
 * real `applyEnvDefaults` (that behaviour is under test) but swap the three
 * heavy config reducers for stubs.
 */
const installStubSauceProvider = async () => {
  const { saucelabsProvider } = await import('@caps/providers')

  return registerProvider('saucelabs', {
    ...saucelabsProvider,
    setupDesktopBrowsers: vi.fn((args) => ({ id: 'setupSauceDesktopBrowsers', args })),
    setupDeviceBrowsers: vi.fn((args) => ({ id: 'setupSauceDeviceBrowsers', args })),
    setupNativeApp: vi.fn((args) => ({ id: 'setupSauceNativeApp', args })),
  })
}

beforeEach(async () => {
  vi.clearAllMocks()
  await installStubSauceProvider()
})

describe('buildWdioConfig: remote=local, scope=browser', () => {
  it('metal=desktop calls setupLocalDesktopBrowsers and defaults WDIO_REPORTERS/WDIO_BROWSERS', () => {
    const envs = {}
    const result = buildWdioConfig({ envs, remote: 'local', scope: 'browser', metal: 'desktop' })

    expect(result.id).toBe('setupLocalDesktopBrowsers')
    expect(envs.WDIO_REPORTERS).toBe('spec')
    expect(envs.WDIO_BROWSERS).toBe('chrome:safari')
    expect(envs).not.toHaveProperty('WDIO_DEVICES')
    expect(envs).not.toHaveProperty('WDIO_METAL')
  })

  it('metal=device calls setupLocalDeviceBrowsers and defaults WDIO_REPORTERS/WDIO_DEVICES', () => {
    const envs = {}
    const result = buildWdioConfig({ envs, remote: 'local', scope: 'browser', metal: 'device' })

    expect(result.id).toBe('setupLocalDeviceBrowsers')
    expect(envs.WDIO_REPORTERS).toBe('spec')
    expect(envs.WDIO_DEVICES).toBe('android:ios')
    expect(envs).not.toHaveProperty('WDIO_BROWSERS')
  })

  it('does not overwrite an already-set WDIO_REPORTERS/WDIO_BROWSERS', () => {
    const envs = { WDIO_REPORTERS: 'custom', WDIO_BROWSERS: 'firefox' }
    buildWdioConfig({ envs, remote: 'local', scope: 'browser', metal: 'desktop' })

    expect(envs.WDIO_REPORTERS).toBe('custom')
    expect(envs.WDIO_BROWSERS).toBe('firefox')
  })

  it('forwards framework and envs to the setup function, and does not forward pkgName-derived options for local', () => {
    const envs = {}
    buildWdioConfig({ envs, remote: 'local', scope: 'browser', metal: 'desktop', framework: 'mocha', pkgName: '@scope/pkg' })

    const [[callArgs]] = services.setupLocalDesktopBrowsers.mock.calls
    expect(callArgs.framework).toBe('mocha')
    expect(callArgs.envs).toBe(envs)
    expect(callArgs).not.toHaveProperty('tunnelPrefix')
    expect(callArgs).not.toHaveProperty('buildSuffix')
  })
})

describe('buildWdioConfig: remote=local, scope=app (forces metal=device)', () => {
  it('calls setupLocalNativeApp and defaults WDIO_REPORTERS/WDIO_DEVICES/WDIO_METAL regardless of the metal param', () => {
    const envs = {}
    const result = buildWdioConfig({ envs, remote: 'local', scope: 'app', metal: 'desktop' })

    expect(result.id).toBe('setupLocalNativeApp')
    expect(envs.WDIO_REPORTERS).toBe('spec')
    expect(envs.WDIO_DEVICES).toBe('android:ios')
    expect(envs.WDIO_METAL).toBe('device')
  })

  it('does not overwrite an already-set WDIO_METAL', () => {
    const envs = { WDIO_METAL: 'desktop' }
    buildWdioConfig({ envs, remote: 'local', scope: 'app' })

    expect(envs.WDIO_METAL).toBe('desktop')
  })
})

describe('buildWdioConfig: remote=saucelabs, scope=browser', () => {
  it('metal=desktop calls setupSauceDesktopBrowsers, defaults saucelabs reporters, and forwards pkgName as tunnelPrefix/buildSuffix', () => {
    const envs = {}
    const result = buildWdioConfig({ envs, remote: 'saucelabs', scope: 'browser', metal: 'desktop', pkgName: 'swarmdriver' })

    expect(result.id).toBe('setupSauceDesktopBrowsers')
    expect(envs.WDIO_REPORTERS).toBe('spec:junit:saucecomment')
    expect(envs.SAUCECOMMENT_REPORTER_OUTPUT_DIR).toBe('build')
    expect(envs.SAUCECOMMENT_REPORTER_SAVE_OUTPUT_TO_FILE).toBe('true')
    expect(envs.WDIO_BROWSERS).toBe('chrome:safari:firefox')
    expect(result.args.tunnelPrefix).toBe('swarmdriver')
    expect(result.args.buildSuffix).toBe('swarmdriver')
  })

  it('metal=device calls setupSauceDeviceBrowsers and defaults WDIO_DEVICES instead of WDIO_BROWSERS', () => {
    const envs = {}
    const result = buildWdioConfig({ envs, remote: 'saucelabs', scope: 'browser', metal: 'device', pkgName: 'swarmdriver' })

    expect(result.id).toBe('setupSauceDeviceBrowsers')
    expect(envs.WDIO_DEVICES).toBe('android:ios')
    expect(envs).not.toHaveProperty('WDIO_BROWSERS')
  })

  it('does not overwrite already-set saucelabs env defaults', () => {
    const envs = {
      WDIO_REPORTERS: 'custom',
      SAUCECOMMENT_REPORTER_OUTPUT_DIR: 'custom-dir',
      SAUCECOMMENT_REPORTER_SAVE_OUTPUT_TO_FILE: 'false',
      WDIO_BROWSERS: 'firefox',
    }
    buildWdioConfig({ envs, remote: 'saucelabs', scope: 'browser', metal: 'desktop' })

    expect(envs.WDIO_REPORTERS).toBe('custom')
    expect(envs.SAUCECOMMENT_REPORTER_OUTPUT_DIR).toBe('custom-dir')
    expect(envs.SAUCECOMMENT_REPORTER_SAVE_OUTPUT_TO_FILE).toBe('false')
    expect(envs.WDIO_BROWSERS).toBe('firefox')
  })
})

describe('buildWdioConfig: remote=saucelabs, scope=app (forces metal=device)', () => {
  it('calls setupSauceNativeApp, defaults WDIO_DEVICES/WDIO_METAL, and forwards pkgName', () => {
    const envs = {}
    const result = buildWdioConfig({ envs, remote: 'saucelabs', scope: 'app', pkgName: 'swarmdriver' })

    expect(result.id).toBe('setupSauceNativeApp')
    expect(envs.WDIO_DEVICES).toBe('android:ios')
    expect(envs.WDIO_METAL).toBe('device')
    expect(envs.WDIO_REPORTERS).toBe('spec:junit:saucecomment')
    expect(result.args.tunnelPrefix).toBe('swarmdriver')
    expect(result.args.buildSuffix).toBe('swarmdriver')
  })
})

describe('buildWdioConfig: defaults', () => {
  it('defaults to remote=local, scope=browser, metal=desktop, framework=jasmine when called with no args', () => {
    const result = buildWdioConfig()

    expect(result.id).toBe('setupLocalDesktopBrowsers')
    expect(result.args.framework).toBe('jasmine')
    expect(result.args.envs.WDIO_REPORTERS).toBe('spec')
    expect(result.args.envs.WDIO_BROWSERS).toBe('chrome:safari')
  })

  it('returns undefined for an unrecognized remote/scope combination', () => {
    const result = buildWdioConfig({ remote: 'bogus', scope: 'browser' })
    expect(result).toBeUndefined()
  })
})

describe('buildWdioConfig: provider registry wiring', () => {
  it('resolves saucelabs only while a provider is registered under that name', () => {
    expect(getProvider('saucelabs')).toBeDefined()

    // Simulates a consumer that never imported `@caps/providers`: nothing has
    // registered 'saucelabs', so the remote is as unknown as any other.
    expect(unregisterProvider('saucelabs')).toBe(true)

    expect(getProvider('saucelabs')).toBeUndefined()
    expect(buildWdioConfig({ envs: {}, remote: 'saucelabs', scope: 'browser', metal: 'desktop' }))
      .toBeUndefined()
  })

  it('lets WDIO_PROVIDER override the `remote` argument', () => {
    registerProvider('other-grid', {
      name: 'other-grid',
      applyEnvDefaults: () => {},
      setupDesktopBrowsers: (args) => ({ id: 'otherGridDesktop', args }),
      setupDeviceBrowsers: (args) => ({ id: 'otherGridDevice', args }),
      setupNativeApp: (args) => ({ id: 'otherGridNativeApp', args }),
    })

    const result = buildWdioConfig({
      envs: { WDIO_PROVIDER: 'other-grid' },
      remote: 'saucelabs',
      scope: 'browser',
      metal: 'desktop',
    })

    expect(result.id).toBe('otherGridDesktop')

    unregisterProvider('other-grid')
  })
})
