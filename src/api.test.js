import { describe, it, expect, vi, beforeEach } from 'vitest'

import { buildWdioConfig } from './api'
import * as services from './services'

// buildWdioConfig() is a thin branching layer over the six setup*() service
// builders. We mock those builders so this suite verifies ONLY the branching
// logic and the envs default-injection in src/api.js — not the downstream
// capability-building logic, which is covered by services/*.test.js.
vi.mock('./services', () => ({
  setupLocalDesktopBrowsers: vi.fn((args) => ({ id: 'setupLocalDesktopBrowsers', args })),
  setupLocalDeviceBrowsers: vi.fn((args) => ({ id: 'setupLocalDeviceBrowsers', args })),
  setupLocalNativeApp: vi.fn((args) => ({ id: 'setupLocalNativeApp', args })),
  setupSauceDesktopBrowsers: vi.fn((args) => ({ id: 'setupSauceDesktopBrowsers', args })),
  setupSauceDeviceBrowsers: vi.fn((args) => ({ id: 'setupSauceDeviceBrowsers', args })),
  setupSauceNativeApp: vi.fn((args) => ({ id: 'setupSauceNativeApp', args })),
}))

beforeEach(() => {
  vi.clearAllMocks()
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
