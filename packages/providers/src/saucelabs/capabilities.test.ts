import { describe, it, expect, vi, afterEach } from 'vitest'

import {
  buildSauceVars,
  parseSauceServiceSettings,
  buildSauceSettings,
  setupSauceConfig,
  parseSauceCapabilities,
  parseSauceAndroidCapabilities,
  buildSauceAndroidCapabilities,
  parseSauceAndroidRealDeviceCapabilities,
  buildSauceAndroidRealDeviceCapabilities,
  parseSauceIosCapabilities,
  buildSauceIosCapabilities,
  parseSauceIosRealDeviceCapabilities,
  buildSauceIosRealDeviceCapabilities,
  parseSauceSafariCapabilities,
  buildSauceSafariCapabilities,
  parseSauceChromeCapabilities,
  buildSauceChromeCapabilities,
  parseSauceFirefoxCapabilities,
  buildSauceFirefoxCapabilities,
  buildW3CWebDriverCapabilitiesRequired,
  buildW3CWebDriverBrowserCapabilitiesOptional,
  buildDesktopBrowserCapabilitiesSauceSpecificOptional,
  buildMobileAppiumCapabilities,
  buildMobileAppiumTimeoutCapabilities,
  buildMobileAppiumIosWebDriverAgentTimeoutCapabilities,
  buildMobileAppAppiumCapabilitiesSauceSpecificOptional,
  buildDesktopMobileCapabilitiesSauceSpecificOptional,
  buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional,
} from './capabilities'

describe('buildSauceVars', () => {
  // buildSauceTunnelName()/buildSauceBuildId() shell out to git/date when no
  // explicit ids are supplied, so keep that noise-free and just assert shape.
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses explicit SAUCE_TUNNEL_ID/SAUCE_BUILD_ID/SAUCE_TUNNEL_OWNER when provided', () => {
    const result = buildSauceVars({
      envs: {
        SAUCE_TUNNEL_ID: 'my-tunnel',
        SAUCE_BUILD_ID: 'my-build',
        SAUCE_TUNNEL_OWNER: 'me',
      },
      tunnelPrefix: 'tunnel',
      buildSuffix: 'power',
    })

    expect(result).toEqual({
      tunnelId: 'my-tunnel',
      buildId: 'my-build',
      tunnelOwner: 'me',
    })
  })

  it('falls back to a generated tunnel id/build id when not explicitly provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = buildSauceVars({ envs: {}, tunnelPrefix: 'tunnel', buildSuffix: 'power' })

    expect(result.tunnelId.startsWith('tunnel-')).toBe(true)
    expect(result.buildId.endsWith('-power')).toBe(true)
    expect(result.tunnelOwner).toBeUndefined()
  })
})

describe('parseSauceServiceSettings', () => {
  it('always forwards user/key regardless of other settings', () => {
    const result = parseSauceServiceSettings({ SAUCE_USERNAME: 'bob', SAUCE_ACCESS_KEY: 'secret' })
    expect(result.user).toBe('bob')
    expect(result.key).toBe('secret')
  })

  it('omits region when unset (parseString collapses the "us" default to undefined, which is falsy)', () => {
    const result = parseSauceServiceSettings({})
    expect(result).not.toHaveProperty('region')
  })

  it('includes region as a string when explicitly set to a non-default value', () => {
    const result = parseSauceServiceSettings({ SAUCE_REGION: 'eu' })
    expect(result.region).toBe('eu')
  })

  it('parses SAUCE_CONNECT/SAUCE_UPLOAD_LOGS booleans when non-default', () => {
    const result = parseSauceServiceSettings({ SAUCE_CONNECT: 'true', SAUCE_UPLOAD_LOGS: 'false' })
    expect(result.sauceConnect).toBe(true)
    expect(result.uploadLogs).toBe(false)
  })

  it('parses SAUCE_MAX_ERROR_STACK_LENGTH as a whole number when non-default', () => {
    const result = parseSauceServiceSettings({ SAUCE_MAX_ERROR_STACK_LENGTH: '10' })
    expect(result.maxErrorStackLength).toBe(10)
  })

  it('defaults envs to an empty object when called with no argument', () => {
    expect(() => parseSauceServiceSettings()).not.toThrow()
  })
})

describe('buildSauceSettings', () => {
  it('always includes user/key at the top level', () => {
    const settings = buildSauceSettings({ user: 'bob', key: 'secret' })
    expect(settings.user).toBe('bob')
    expect(settings.key).toBe('secret')
  })

  it('nests maxErrorStackLength/uploadLogs/sauceConnect under the sauce service entry', () => {
    const settings = buildSauceSettings({
      user: 'bob',
      key: 'secret',
      maxErrorStackLength: 10,
      uploadLogs: true,
      sauceConnect: true,
      tunnelName: 'my-tunnel',
      tunnelOwner: 'me',
    })

    expect(settings.services).toHaveLength(1)
    const [name, serviceOpts] = settings.services[0]
    expect(name).toBe('sauce')
    expect(serviceOpts.maxErrorStackLength).toBe(10)
    expect(serviceOpts.uploadLogs).toBe(true)
    expect(serviceOpts.sauceConnect).toBe(true)
    expect(serviceOpts.sauceConnectOpts).toEqual({
      noAutodetect: true,
      tunnelName: 'my-tunnel',
      tunnelOwner: 'me',
    })
  })

  it('omits sauceConnectOpts entirely when sauceConnect is falsy', () => {
    const settings = buildSauceSettings({ user: 'bob', key: 'secret' })
    const [, serviceOpts] = settings.services[0]
    expect(serviceOpts).not.toHaveProperty('sauceConnectOpts')
  })
})

describe('setupSauceConfig', () => {
  it('composes parseSauceServiceSettings and buildSauceSettings from envs, letting opts override', () => {
    const config = setupSauceConfig({
      envs: { SAUCE_USERNAME: 'bob', SAUCE_ACCESS_KEY: 'secret' },
      tunnelName: 'my-tunnel',
    })

    expect(config.user).toBe('bob')
    expect(config.key).toBe('secret')
    const [, serviceOpts] = config.services[0]
    expect(serviceOpts).not.toHaveProperty('sauceConnectOpts')
  })
})

describe('parseSauceCapabilities', () => {
  it('omits optional keys entirely when envs is empty', () => {
    const result = parseSauceCapabilities({})
    expect(result).not.toHaveProperty('deviceOrientation')
    expect(result).not.toHaveProperty('name')
  })

  it('passes through direct string capabilities with no default', () => {
    const result = parseSauceCapabilities({ SAUCE_NAME: 'my test', SAUCE_BUILD: 'build-1' })
    expect(result.name).toBe('my test')
    expect(result.build).toBe('build-1')
  })

  it('parses boolean capabilities against their documented defaults', () => {
    expect(parseSauceCapabilities({ SAUCE_TABLET_ONLY: 'true' })).toMatchObject({ tabletOnly: true })
    expect(parseSauceCapabilities({ SAUCE_RESIGNING_ENABLED: 'false' })).toMatchObject({ resigningEnabled: false })
    // equals its true default -> collapses to omitted
    expect(parseSauceCapabilities({ SAUCE_RESIGNING_ENABLED: 'true' })).not.toHaveProperty('resigningEnabled')
  })

  it('parses SAUCE_NETWORK_CAPTURE/SAUCE_SETUP_DEVICE_LOCK via the existy-on-raw-value pattern (no default arg)', () => {
    // These call parseBool(envs, key) with no default, gated by existy(envs[key])
    // on the *raw* env value rather than the parsed one.
    expect(parseSauceCapabilities({ SAUCE_NETWORK_CAPTURE: 'false' })).toMatchObject({ networkCapture: false })
    expect(parseSauceCapabilities({})).not.toHaveProperty('networkCapture')
  })

  it('splits SAUCE_CUSTOM_LOG_FILES on ":" via parseList', () => {
    const result = parseSauceCapabilities({ SAUCE_CUSTOM_LOG_FILES: 'a.log:b.log' })
    expect(result.customLogFiles).toEqual(['a.log', 'b.log'])
  })

  it('caps commandTimeout at 600 seconds even when the env var requests more', () => {
    const result = parseSauceCapabilities({ SAUCE_COMMAND_TIMEOUT: '900' })
    expect(result.commandTimeout).toBe(600)
  })

  it('caps idleTimeout at 1000 seconds even when the env var requests more', () => {
    const result = parseSauceCapabilities({ SAUCE_IDLE_TIMEOUT: '5000' })
    expect(result.idleTimeout).toBe(1000)
  })

  it('does not cap commandTimeout/idleTimeout when under the ceiling', () => {
    const result = parseSauceCapabilities({ SAUCE_COMMAND_TIMEOUT: '400', SAUCE_IDLE_TIMEOUT: '200' })
    expect(result.commandTimeout).toBe(400)
    expect(result.idleTimeout).toBe(200)
  })
})

describe('parseSauceAndroidCapabilities', () => {
  it('defaults platformName/deviceName/browserName via ternary when unset', () => {
    const result = parseSauceAndroidCapabilities({})
    expect(result.platformName).toBe('Android')
    expect(result.deviceName).toBe('Galaxy S([5-9]).*')
    expect(result.browserName).toBe('Android')
  })

  it('honors explicit overrides', () => {
    const result = parseSauceAndroidCapabilities({
      ANDROID_PLATFORM_NAME: 'Android',
      ANDROID_SAUCE_DEVICE_NAME: 'Pixel 6',
      ANDROID_PLATFORM_VERSION: '14',
      ANDROID_BROWSER_NAME: 'Chrome',
    })
    expect(result.deviceName).toBe('Pixel 6')
    expect(result.platformVersion).toBe('14')
    expect(result.browserName).toBe('Chrome')
  })
})

describe('buildSauceAndroidCapabilities', () => {
  it('maps platformVersion to the appium:platformVersion capability when provided', () => {
    const result = buildSauceAndroidCapabilities({ platformVersion: '14' })
    expect(result['appium:platformVersion']).toBe('14')
    expect(result.sauceOptions).toEqual({})
  })

  it('omits appium:platformVersion when not provided', () => {
    const result = buildSauceAndroidCapabilities({})
    expect(result).not.toHaveProperty('appium:platformVersion')
  })
})

describe('parseSauceAndroidRealDeviceCapabilities', () => {
  it('defaults platformName/deviceName/automationName via ternary when unset', () => {
    const result = parseSauceAndroidRealDeviceCapabilities({})
    expect(result.platformName).toBe('Android')
    expect(result.deviceName).toBe('Galaxy S([5-9]).*')
    expect(result.automationName).toBe('UiAutomator2')
  })

  it('passes through appPackage/appActivity/app when provided', () => {
    const result = parseSauceAndroidRealDeviceCapabilities({
      ANDROID_SAUCE_APP: 'storage:filename=app.apk',
      APP_PACKAGE: 'com.example.app',
      APP_ACTIVITY: '.MainActivity',
    })
    expect(result.app).toBe('storage:filename=app.apk')
    expect(result.appPackage).toBe('com.example.app')
    expect(result.appActivity).toBe('.MainActivity')
  })

  it('splits ANDROID_SAUCE_TAGS on "|"', () => {
    const result = parseSauceAndroidRealDeviceCapabilities({ ANDROID_SAUCE_TAGS: 'smoke|regression' })
    expect(result.tags).toEqual(['smoke', 'regression'])
  })

  it('parses ANDROID_NO_RESET boolean against its false default', () => {
    expect(parseSauceAndroidRealDeviceCapabilities({ ANDROID_NO_RESET: 'true' })).toMatchObject({ noReset: true })
    expect(parseSauceAndroidRealDeviceCapabilities({ ANDROID_NO_RESET: 'false' })).not.toHaveProperty('noReset')
  })

  it('parses ANDROID_SAUCE_MAX_DURATION/COMMAND_TIMEOUT/IDLE_TIMEOUT as whole numbers', () => {
    const result = parseSauceAndroidRealDeviceCapabilities({
      ANDROID_SAUCE_MAX_DURATION: '3600',
      ANDROID_SAUCE_COMMAND_TIMEOUT: '600',
      ANDROID_SAUCE_IDLE_TIMEOUT: '180',
    })
    expect(result.maxDuration).toBe(3600)
    expect(result.commandTimeout).toBe(600)
    expect(result.idleTimeout).toBe(180)
  })
})

describe('buildSauceAndroidRealDeviceCapabilities', () => {
  it('maps platformVersion/appPackage/appActivity to their appium: prefixed capabilities', () => {
    const result = buildSauceAndroidRealDeviceCapabilities({
      platformVersion: '14',
      appPackage: 'com.example.app',
      appActivity: '.MainActivity',
    })

    expect(result).toEqual({
      'appium:platformVersion': '14',
      'appium:appPackage': 'com.example.app',
      'appium:appActivity': '.MainActivity',
    })
  })

  it('returns an object with none of those keys when opts is empty', () => {
    const result = buildSauceAndroidRealDeviceCapabilities({})
    expect(result).not.toHaveProperty('appium:platformVersion')
    expect(result).not.toHaveProperty('appium:appPackage')
    expect(result).not.toHaveProperty('appium:appActivity')
  })

  it('defaults opts to an empty object when called with no argument', () => {
    expect(() => buildSauceAndroidRealDeviceCapabilities()).not.toThrow()
  })
})

describe('parseSauceIosCapabilities', () => {
  it('defaults platformName/deviceName/browserName via ternary when unset', () => {
    const result = parseSauceIosCapabilities({})
    expect(result.platformName).toBe('iOS')
    expect(result.deviceName).toBe('iPhone 11 Simulator')
    expect(result.browserName).toBe('Safari')
  })

  it('honors explicit overrides', () => {
    const result = parseSauceIosCapabilities({
      IOS_SAUCE_DEVICE_NAME: 'iPhone 15',
      IOS_PLATFORM_VERSION: '17.0',
    })
    expect(result.deviceName).toBe('iPhone 15')
    expect(result.platformVersion).toBe('17.0')
  })
})

describe('buildSauceIosCapabilities', () => {
  it('maps platformVersion to appium:platformVersion when provided', () => {
    const result = buildSauceIosCapabilities({ platformVersion: '17.0' })
    expect(result['appium:platformVersion']).toBe('17.0')
    expect(result.sauceOptions).toEqual({})
  })
})

describe('parseSauceIosRealDeviceCapabilities', () => {
  it('defaults platformName/deviceName via ternary when unset', () => {
    const result = parseSauceIosRealDeviceCapabilities({})
    expect(result.platformName).toBe('iOS')
    expect(result.deviceName).toBe('iPhone ([12]|[7-8]|X.*).*')
  })

  it('parses AUTO_ACCEPT_ALERTS/IOS_NO_RESET booleans against their false defaults', () => {
    expect(parseSauceIosRealDeviceCapabilities({ AUTO_ACCEPT_ALERTS: 'true' })).toMatchObject({ autoAcceptAlerts: true })
    expect(parseSauceIosRealDeviceCapabilities({ IOS_NO_RESET: 'true' })).toMatchObject({ noReset: true })
  })

  it('splits IOS_SAUCE_TAGS on "|"', () => {
    const result = parseSauceIosRealDeviceCapabilities({ IOS_SAUCE_TAGS: 'smoke|regression' })
    expect(result.tags).toEqual(['smoke', 'regression'])
  })

  it('parses IOS_SAUCE_MAX_DURATION/COMMAND_TIMEOUT/IDLE_TIMEOUT as whole numbers', () => {
    const result = parseSauceIosRealDeviceCapabilities({
      IOS_SAUCE_MAX_DURATION: '3600',
      IOS_SAUCE_COMMAND_TIMEOUT: '600',
      IOS_SAUCE_IDLE_TIMEOUT: '180',
    })
    expect(result.maxDuration).toBe(3600)
    expect(result.commandTimeout).toBe(600)
    expect(result.idleTimeout).toBe(180)
  })
})

describe('buildSauceIosRealDeviceCapabilities', () => {
  it('maps platformVersion/autoAcceptAlerts to their appium: prefixed capabilities', () => {
    const result = buildSauceIosRealDeviceCapabilities({ platformVersion: '17.0', autoAcceptAlerts: true })
    expect(result).toEqual({
      'appium:platformVersion': '17.0',
      'appium:autoAcceptAlerts': true,
    })
  })

  it('returns an object with neither key when opts is empty', () => {
    const result = buildSauceIosRealDeviceCapabilities({})
    expect(result).not.toHaveProperty('appium:platformVersion')
    expect(result).not.toHaveProperty('appium:autoAcceptAlerts')
  })
})

describe('desktop browser capability stubs (safari/chrome/firefox)', () => {
  it('parseSauceSafariCapabilities always returns an empty object', () => {
    expect(parseSauceSafariCapabilities({})).toEqual({})
  })

  it('buildSauceSafariCapabilities always returns an empty sauceOptions wrapper', () => {
    expect(buildSauceSafariCapabilities({})).toEqual({ sauceOptions: {} })
  })

  it('parseSauceChromeCapabilities always returns an empty object', () => {
    expect(parseSauceChromeCapabilities({})).toEqual({})
  })

  it('buildSauceChromeCapabilities always returns an empty sauceOptions wrapper', () => {
    expect(buildSauceChromeCapabilities({})).toEqual({ sauceOptions: {} })
  })

  it('parseSauceFirefoxCapabilities always returns an empty object', () => {
    expect(parseSauceFirefoxCapabilities({})).toEqual({})
  })

  it('buildSauceFirefoxCapabilities always returns an empty sauceOptions wrapper', () => {
    expect(buildSauceFirefoxCapabilities({})).toEqual({ sauceOptions: {} })
  })
})

describe('buildW3CWebDriverCapabilitiesRequired', () => {
  it('passes through browserName/browserVersion/platformName when provided', () => {
    const result = buildW3CWebDriverCapabilitiesRequired({
      browserName: 'chrome',
      browserVersion: 'latest',
      platformName: 'macOS 13',
    })
    expect(result).toEqual({
      browserName: 'chrome',
      browserVersion: 'latest',
      platformName: 'macOS 13',
    })
  })

  it('omits keys entirely when opts is empty', () => {
    expect(buildW3CWebDriverCapabilitiesRequired({})).toEqual({})
  })
})

describe('buildW3CWebDriverBrowserCapabilitiesOptional', () => {
  it('passes through supplied optional W3C capabilities', () => {
    const result = buildW3CWebDriverBrowserCapabilitiesOptional({
      acceptInsecureCerts: true,
      pageLoadStrategy: 'eager',
      unhandledPromptBehavior: 'accept',
    })
    expect(result.acceptInsecureCerts).toBe(true)
    expect(result.pageLoadStrategy).toBe('eager')
    expect(result.unhandledPromptBehavior).toBe('accept')
  })

  it('omits keys entirely when opts is empty', () => {
    expect(buildW3CWebDriverBrowserCapabilitiesOptional({})).toEqual({})
  })
})

describe('buildDesktopBrowserCapabilitiesSauceSpecificOptional', () => {
  it('passes through supplied Sauce-specific desktop capabilities', () => {
    const result = buildDesktopBrowserCapabilitiesSauceSpecificOptional({
      chromedriverVersion: '120.0',
      avoidProxy: true,
      commandTimeout: 300,
      idleTimeout: 90,
    })
    expect(result).toMatchObject({ commandTimeout: 300, idleTimeout: 90 })
  })

  it('omits keys entirely when opts is empty', () => {
    expect(buildDesktopBrowserCapabilitiesSauceSpecificOptional({})).toEqual({})
  })
})

describe('buildMobileAppiumCapabilities', () => {
  it('passes through core mobile capabilities when supplied', () => {
    const result = buildMobileAppiumCapabilities({
      platformName: 'Android',
      deviceName: 'Pixel 6',
      automationName: 'UiAutomator2',
      noReset: true,
    })
    expect(result.platformName).toBe('Android')
    expect(result['appium:deviceName']).toBe('Pixel 6')
    expect(result['appium:automationName']).toBe('UiAutomator2')
    expect(result['appium:noReset']).toBe(true)
  })

  it('omits keys entirely when opts is empty', () => {
    expect(buildMobileAppiumCapabilities({})).toEqual({})
  })
})

describe('buildMobileAppiumTimeoutCapabilities', () => {
  it('maps newCommandTimeout to appium:newCommandTimeout when provided', () => {
    expect(buildMobileAppiumTimeoutCapabilities({ newCommandTimeout: 60 })).toEqual({
      'appium:newCommandTimeout': 60,
    })
  })

  it('omits the key entirely when opts is empty', () => {
    expect(buildMobileAppiumTimeoutCapabilities({})).toEqual({})
  })
})

describe('buildMobileAppiumIosWebDriverAgentTimeoutCapabilities', () => {
  it('always returns an empty object regardless of input (all mappings are commented out pending env parsers)', () => {
    expect(buildMobileAppiumIosWebDriverAgentTimeoutCapabilities({
      wdaLaunchTimeout: 60000,
      wdaConnectionTimeout: 240000,
    })).toEqual({})
    expect(buildMobileAppiumIosWebDriverAgentTimeoutCapabilities()).toEqual({})
  })
})

describe('buildMobileAppAppiumCapabilitiesSauceSpecificOptional', () => {
  it('passes through supplied Sauce-specific mobile app capabilities', () => {
    const result = buildMobileAppAppiumCapabilitiesSauceSpecificOptional({
      deviceOrientation: 'PORTRAIT',
      appiumVersion: '2.0.0',
      resigningEnabled: true,
    })
    expect(result).toMatchObject({ appiumVersion: '2.0.0' })
  })

  it('omits keys entirely when opts is empty', () => {
    expect(buildMobileAppAppiumCapabilitiesSauceSpecificOptional({})).toEqual({})
  })
})

describe('buildDesktopMobileCapabilitiesSauceSpecificOptional', () => {
  it('passes through supplied name/build/tags/recordVideo capabilities', () => {
    const result = buildDesktopMobileCapabilitiesSauceSpecificOptional({
      name: 'my test',
      build: 'build-1',
      recordVideo: true,
    })
    expect(result).toMatchObject({ name: 'my test', build: 'build-1', recordVideo: true })
  })

  it('omits keys entirely when opts is empty', () => {
    expect(buildDesktopMobileCapabilitiesSauceSpecificOptional({})).toEqual({})
  })
})

describe('buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional', () => {
  it('passes through supplied maxDuration/priority/timeZone capabilities', () => {
    const result = buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional({
      maxDuration: 1800,
      priority: 0,
      timeZone: 'UTC',
    })
    expect(result).toMatchObject({ maxDuration: 1800, priority: 0, timeZone: 'UTC' })
  })

  it('omits keys entirely when opts is empty', () => {
    expect(buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional({})).toEqual({})
  })
})
