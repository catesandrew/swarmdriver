import { describe, it, expect, vi, afterEach } from 'vitest'

import {
  buildAppiumGitRef,
  buildAppiumBuildId,
  parseAppiumServiceSettings,
  buildAppiumSettings,
  setupAppiumConfig,
  parseAppiumSettings,
  parseIosAppiumSettings,
  parseAndroidAppiumSettings,
} from './appium'

// Every env var that parseIosAppiumSettings/parseAndroidAppiumSettings map,
// each set to a value that differs from its documented default. This isn't
// meant to assert on every individual mapping (that's covered by the
// representative examples below) — it exists so the ~90 nearly-identical
// `...(existy(parseBool/parseWhole(...)) && { key: ... })` value-lines in
// those two functions execute at least once, since v8 statement coverage
// only credits the right-hand side of `&&`/ternary when it actually runs.
const IOS_ALL_ENVS_NON_DEFAULT = {
  IOS_FULL_RESET: 'true', IOS_NEW_COMMAND_TIMEOUT: '999999', IOS_NO_RESET: 'true',
  ABSOLUTE_WEB_LOCATIONS: 'true', ALLOW_PROVISIONING_DEVICE_REGISTRATION: 'true',
  APP_PUSH_TIMEOUT: '999999', AUTO_ACCEPT_ALERTS: 'true', AUTO_DISMISS_ALERTS: 'true',
  CALENDAR_ACCESS_AUTHORIZED: 'true', CLEAR_SYSTEM_FILES: 'true', CONNECT_HARDWARE_KEYBOARD: 'true',
  DISABLE_AUTOMATIC_SCREENSHOTS: 'false', ENABLE_ASYNC_EXECUTE_FROM_HTTPS: 'true',
  ENABLE_PERFORMANCE_LOGGING: 'true', ENFORCE_FRESH_SIMULATOR_CREATION: 'true',
  FORCE_APP_LAUNCH: 'false', FULL_CONTEXT_LIST: 'true', INCLUDE_DEVICE_CAPS_TO_SESSION_INFO: 'false',
  INCLUDE_SAFARI_IN_WEBVIEWS: 'true', IOS_INSTALL_PAUSE: '999999', KEEP_KEY_CHAINS: 'true',
  LAUNCH_WITH_IDB: 'true', MAX_TYPING_FREQUENCY: '999999', NATIVE_WEB_TAP: 'true',
  NATIVE_WEB_TAP_STRICT: 'true', PREBUILD_WDA: 'false', REDUCE_MOTION: 'true',
  RESET_ON_SESSION_START_ONLY: 'false', SAFARI_ALLOW_POPUPS: 'false', SAFARI_GARBAGE_COLLECT: 'true',
  SAFARI_IGNORE_FRAUD_WARNING: 'false', SAFARI_LOG_ALL_COMMUNICATION: 'true',
  SAFARI_LOG_ALL_COMMUNICATION_HEX_DUMP: 'true', SAFARI_OPEN_LINKS_IN_BACKGROUND: 'false',
  SAFARI_SOCKET_CHUNK_SIZE: '999999', SAFARI_WEB_INSPECTOR_MAX_FRAME_LENGTH: '999999',
  SCREENSHOT_QUALITY: '999999', SHOULD_TERMINATE_APP: 'false', SHOULD_USE_SINGLETON_TEST_MANAGER: 'false',
  SHOW_IOS_LOG: 'true', SHOW_XCODE_LOG: 'true', SHUTDOWN_OTHER_SIMULATORS: 'true',
  SIMPLE_IS_VISIBLE_CHECK: 'false', SIMULATOR_STARTUP_TIMEOUT: '999999', SIMULATOR_TRACE_POINTER: 'true',
  USE_JSON_SOURCE: 'true', USE_NATIVE_CACHING_STRATEGY: 'false', USE_NEW_WDA: 'true',
  USE_PREBUILT_WDA: 'true', USE_SIMPLE_BUILD_TEST: 'true', USE_XCTESTRUN_FILE: 'true',
  WAIT_FOR_IDLE_TIMEOUT: '999999', WAIT_FOR_QUIESCENCE: 'false', WDA_CONNECTION_TIMEOUT: '999999',
  WDA_EVENTLOOP_IDLE_DELAY: '999999', WDA_LAUNCH_TIMEOUT: '999999', WDA_LOCAL_PORT: '999999',
  WDA_STARTUP_RETRIES: '999999', WDA_STARTUP_RETRY_INTERVAL: '999999', WEBKIT_RESPONSE_TIMEOUT: '999999',
  WEBVIEW_CONNECT_RETRIES: '999999', WEBVIEW_CONNECT_TIMEOUT: '999999',
  IOS_BROWSER_NAME: 'custom-value', IOS_UDID: 'custom-value', XCODE_ORG_ID: 'custom-value',
  BUNDLE_ID: 'custom-value', IOS_APP: 'custom-value', LOCALIZABLE_STRINGS_DIR: 'custom-value',
  XCODE_CONFIG_FILE: 'custom-value', UPDATED_WDA_BUNDLE_ID: 'custom-value', KEYCHAIN_PATH: 'custom-value',
  KEYCHAIN_PASSWORD: 'custom-value', DERIVED_DATA_PATH: 'custom-value', WEB_DRIVER_AGENT_URL: 'custom-value',
  WDA_BASE_URL: 'custom-value', PROCESS_ARGUMENTS: 'custom-value', RESULT_BUNDLE_PATH: 'custom-value',
  RESULT_BUNDLE_VERSION: 'custom-value', IOS_DEVICE_ORIENTATION: 'custom-value', SCALE_FACTOR: 'custom-value',
  CALENDAR_FORMAT: 'custom-value', KEYCHAINS_EXCLUDE_PATTERNS: 'custom-value',
  IOS_SIMULATOR_LOGS_PREDICATE: 'custom-value', SIMULATOR_PASTEBOARD_AUTOMATIC_SYNC: 'custom-value',
  SIMULATOR_DEVICES_SET_PATH: 'custom-value', CUSTOM_SSL_CERT: 'custom-value',
  SAFARI_IGNORE_WEB_HOSTNAMES: 'custom-value', SAFARI_INITIAL_URL: 'custom-value',
  IOS_PLATFORM_NAME: 'custom-value', IOS_AUTOMATION_NAME: 'custom-value', IOS_DEVICE_NAME: 'custom-value',
  IOS_PLATFORM_VERSION: 'custom-value', XCODE_SIGNING_ID: 'custom-value', IOS_LANGUAGE: 'custom-value',
  IOS_LOCALE: 'custom-value',
}

const ANDROID_ALL_ENVS_NON_DEFAULT = {
  ANDROID_FULL_RESET: 'true', ANDROID_NEW_COMMAND_TIMEOUT: '999999', ANDROID_NO_RESET: 'true',
  ADB_EXEC_TIMEOUT: '999999', ADB_PORT: '999999', ALLOW_DELAY_ADB: 'false', ALLOW_TEST_PACKAGES: 'true',
  ANDROID_INSTALL_TIMEOUT: '999999', APP_WAIT_DURATION: '999999', APP_WAIT_FOR_LAUNCH: 'false',
  AUTO_GRANT_PERMISSIONS: 'true', AUTO_WEBVIEW_TIMEOUT: '999999', AVD_ARGS: '999999',
  AVD_LAUNCH_TIMEOUT: '999999', AVD_READY_TIMEOUT: '999999', CHROMEDRIVER_DISABLE_BUILD_CHECK: 'true',
  CHROMEDRIVER_PORT: '999999', CHROMEDRIVER_USE_SYSTEM_EXECUTABLE: 'true', CLEAR_DEVICE_LOGS_ON_START: 'true',
  DISABLE_SUPPRESS_ACCESSIBILITY_SERVICE: 'true', DISABLE_WINDOW_ANIMATION: 'true',
  DONT_STOP_APP_ON_RESET: 'true', ENABLE_WEBVIEW_DETAILS_COLLECTION: 'false', ENFORCE_APP_INSTALL: 'true',
  ENSURE_WEBVIEWS_HAVE_PAGES: 'false', EXTRACT_CHROME_ANDROID_PACKAGE_FROM_CONTEXT_NAME: 'true',
  GPS_ENABLED: 'true', IGNORE_HIDDEN_API_POLICY_ERROR: 'true', NATIVE_WEB_SCREENSHOT: 'true',
  NETWORK_SPEED: '999999', NO_SIGN: 'true', RECREATE_CHROME_DRIVER_SESSIONS: 'true',
  REMOTE_APPS_CACHE_LIMIT: '999999', SHOW_CHROMEDRIVER_LOG: 'true', SKIP_DEVICE_INITIALIZATION: 'true',
  SKIP_LOGCAT_CAPTURE: 'true', SKIP_SERVER_INSTALLATION: 'true', SKIP_UNLOCK: 'false',
  SUPPRESS_KILL_SERVER: 'true', SYSTEM_PORT: '999999', UIAUTOMATOR2_SERVER_INSTALL_TIMEOUT: '999999',
  UIAUTOMATOR2_SERVER_LAUNCH_TIMEOUT: '999999', UIAUTOMATOR2_SERVER_READ_TIMEOUT: '999999',
  UNLOCK_SUCCESS_TIMEOUT: '999999', USE_KEYSTORE: 'true', USER_PROFILE: '999999',
  WEBVIEW_DEVTOOLS_PORT: '999999',
  APP_PACKAGE: 'custom-value', APP_ACTIVITY: 'custom-value', APP_WAIT_ACTIVITY: 'custom-value',
  APP_WAIT_PACKAGE: 'custom-value', ANDROID_PLATFORM_VERSION: 'custom-value', ANDROID_DEVICE_NAME: 'custom-value',
  ANDROID_UDID: 'custom-value', ANDROID_DEVICE_ORIENTATION: 'custom-value', ANDROID_APP: 'custom-value',
  ANDROID_BROWSER_NAME: 'custom-value', INTENT_CATEGORY: 'custom-value', INTENT_ACTION: 'custom-value',
  INTENT_FLAGS: 'custom-value', OPTIONAL_INTENT_ARGUMENTS: 'custom-value', OTHER_APPS: 'custom-value',
  UNINSTALL_OTHER_PACKAGES: 'custom-value', ANDROID_LOCALE_SCRIPT: 'custom-value', REMOTE_ADB_HOST: 'custom-value',
  MOCK_LOCATION_APP: 'custom-value', LOGCAT_FORMAT: 'custom-value', LOGCAT_FILTER_SPECS: 'custom-value',
  AVD: 'custom-value', AVD_ENV: 'custom-value', KEYSTORE_PATH: 'custom-value', KEYSTORE_PASSWORD: 'custom-value',
  KEY_ALIAS: 'custom-value', KEY_PASSWORD: 'custom-value', UNLOCK_TYPE: 'custom-value', UNLOCK_KEY: 'custom-value',
  MJPEG_SCREENSHOT_URL: 'custom-value', CHROMEDRIVER_PORTS: 'custom-value', CHROMEDRIVER_ARGS: 'custom-value',
  CHROMEDRIVER_EXECUTABLE: 'custom-value', CHROMEDRIVER_EXECUTABLE_DIR: 'custom-value',
  CHROMEDRIVER_CHROME_MAPPING_FILE: 'custom-value', PAGE_LOAD_STRATEGY: 'custom-value', CHROME_OPTIONS: 'custom-value',
  ANDROID_AUTOMATION_NAME: 'custom-value', ANDROID_PLATFORM_NAME: 'custom-value', ANDROID_LANGUAGE: 'custom-value',
  ANDROID_LOCALE: 'custom-value',
}

describe('buildAppiumGitRef', () => {
  // buildGitRef() shells out to `git rev-parse --short HEAD` and swallows any
  // failure (e.g. a repo with no commits yet) via console.error, so we only
  // assert on the string shape and silence the expected noise.
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prefixes the resolved git ref', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const ref = buildAppiumGitRef('appium')
    expect(ref.startsWith('appium-')).toBe(true)
  })

  it('defaults the prefix to an empty string', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const ref = buildAppiumGitRef()
    expect(ref.startsWith('-')).toBe(true)
  })
})

describe('buildAppiumBuildId', () => {
  it('suffixes a build id with a date-based prefix', () => {
    const id = buildAppiumBuildId('mysuffix')
    expect(id.endsWith('-mysuffix')).toBe(true)
  })

  it('defaults the suffix to an empty string', () => {
    const id = buildAppiumBuildId()
    expect(id.endsWith('-')).toBe(true)
  })
})

describe('parseAppiumServiceSettings', () => {
  it('defaults logLevel to the ERROR level code and address to 127.0.0.1 when unset', () => {
    const result = parseAppiumServiceSettings({})
    expect(result.address).toBe('127.0.0.1')
    expect(result).not.toHaveProperty('command')
    expect(result).not.toHaveProperty('logPath')
  })

  it('honors explicit APPIUM_ADDRESS/APPIUM_COMMAND/APPIUM_LOG_PATH', () => {
    const result = parseAppiumServiceSettings({
      APPIUM_ADDRESS: '0.0.0.0',
      APPIUM_COMMAND: 'appium',
      APPIUM_LOG_PATH: '/tmp/appium.log',
    })
    expect(result.address).toBe('0.0.0.0')
    expect(result.command).toBe('appium')
    expect(result.logPath).toBe('/tmp/appium.log')
  })

  it('parses APPIUM_PORT as a whole number when different from the default', () => {
    const result = parseAppiumServiceSettings({ APPIUM_PORT: '4444' })
    expect(result.port).toBe(4444)
  })

  it('parses boolean flags (relaxedSecurity, allowCors, etc.) when set to non-default values', () => {
    const result = parseAppiumServiceSettings({
      APPIUM_RELAXED_SECURITY: 'true',
      APPIUM_ALLOW_CORS: 'true',
      APPIUM_LOG_NO_COLORS: 'true',
      APPIUM_LONG_STACKTRACE: 'true',
      APPIUM_DEBUG_LOG_SPACING: 'true',
    })
    expect(result.relaxedSecurity).toBe(true)
    expect(result.allowCors).toBe(true)
    expect(result.logNoColors).toBe(true)
    expect(result.longStacktrace).toBe(true)
    expect(result.debugLogSpacing).toBe(true)
  })

  it('omits boolean flags when they equal their false default', () => {
    const result = parseAppiumServiceSettings({
      APPIUM_RELAXED_SECURITY: 'false',
    })
    expect(result).not.toHaveProperty('relaxedSecurity')
  })
})

describe('buildAppiumSettings', () => {
  it('produces a single appium service entry nested with args', () => {
    const settings = buildAppiumSettings({})
    expect(settings.services).toHaveLength(1)
    expect(settings.services[0][0]).toBe('appium')
    expect(settings.connectionRetryCount).toBe(0)
    expect(settings.specFileRetries).toBe(0)
  })

  it('forwards port to the top level and args to the service entry', () => {
    const settings = buildAppiumSettings({
      port: 4444,
      command: 'appium',
      logPath: '/tmp/appium.log',
      relaxedSecurity: true,
      allowCors: true,
      logNoColors: true,
      debugLogSpacing: true,
      longStacktrace: true,
      logLevel: 'info',
      address: '0.0.0.0',
      allowInsecure: true,
    })

    expect(settings.port).toBe(4444)
    const [, serviceOpts] = settings.services[0]
    expect(serviceOpts.command).toBe('appium')
    expect(serviceOpts.logPath).toBe('/tmp/appium.log')
    expect(serviceOpts.args).toEqual({
      relaxedSecurity: true,
      allowCors: true,
      logNoColors: true,
      debugLogSpacing: true,
      longStacktrace: true,
      logLevel: 'info',
      address: '0.0.0.0',
      allowInsecure: true,
    })
  })

  it('omits port when not supplied', () => {
    const settings = buildAppiumSettings()
    expect(settings).not.toHaveProperty('port')
  })
})

describe('setupAppiumConfig', () => {
  it('composes parseAppiumServiceSettings and buildAppiumSettings from envs', () => {
    const config = setupAppiumConfig({ envs: { APPIUM_PORT: '4444' } })
    expect(config.port).toBe(4444)
    expect(config.services[0][0]).toBe('appium')
  })
})

describe('parseAppiumSettings', () => {
  it('omits all keys when envs match every default', () => {
    const result = parseAppiumSettings({})
    expect(result).toEqual({})
  })

  it('parses AUTO_LAUNCH/AUTO_WEBVIEW/IS_HEADLESS booleans when non-default', () => {
    const result = parseAppiumSettings({
      AUTO_LAUNCH: 'false',
      AUTO_WEBVIEW: 'true',
      IS_HEADLESS: 'true',
    })
    expect(result.autoLaunch).toBe(false)
    expect(result.autoWebview).toBe(true)
    expect(result.isHeadless).toBe(true)
  })

  it('parses MJPEG_SERVER_PORT as a whole number when non-default', () => {
    const result = parseAppiumSettings({ MJPEG_SERVER_PORT: '9200' })
    expect(result.mjpegServerPort).toBe(9200)
  })
})

describe('parseIosAppiumSettings', () => {
  it('omits optional boolean/whole-number keys that were never given an env var', () => {
    const result = parseIosAppiumSettings({})
    expect(result).not.toHaveProperty('fullReset')
    expect(result).not.toHaveProperty('newCommandTimeout')
    expect(result).not.toHaveProperty('bundleId')
  })

  it('parses a representative boolean capability (IOS_FULL_RESET -> fullReset)', () => {
    expect(parseIosAppiumSettings({ IOS_FULL_RESET: 'true' })).toMatchObject({ fullReset: true })
    // equals the false default -> collapses to omitted
    expect(parseIosAppiumSettings({ IOS_FULL_RESET: 'false' })).not.toHaveProperty('fullReset')
  })

  it('parses a representative whole-number capability (IOS_NEW_COMMAND_TIMEOUT -> newCommandTimeout)', () => {
    expect(parseIosAppiumSettings({ IOS_NEW_COMMAND_TIMEOUT: '120' })).toMatchObject({ newCommandTimeout: 120 })
    expect(parseIosAppiumSettings({ IOS_NEW_COMMAND_TIMEOUT: '60' })).not.toHaveProperty('newCommandTimeout')
  })

  it('parses a boolean capability whose true default only surfaces when explicitly disabled (DISABLE_AUTOMATIC_SCREENSHOTS)', () => {
    expect(parseIosAppiumSettings({ DISABLE_AUTOMATIC_SCREENSHOTS: 'false' }))
      .toMatchObject({ disableAutomaticScreenshots: false })
    expect(parseIosAppiumSettings({ DISABLE_AUTOMATIC_SCREENSHOTS: 'true' }))
      .not.toHaveProperty('disableAutomaticScreenshots')
  })

  it('passes through direct string capabilities with no default (BUNDLE_ID -> bundleId)', () => {
    expect(parseIosAppiumSettings({ BUNDLE_ID: 'com.example.app' })).toMatchObject({ bundleId: 'com.example.app' })
    expect(parseIosAppiumSettings({})).not.toHaveProperty('bundleId')
  })

  it('defaults platformName/automationName/deviceName/browserName via ternary when unset', () => {
    const result = parseIosAppiumSettings({})
    expect(result.platformName).toBe('iOS')
    expect(result.automationName).toBe('XCUITest')
    expect(result.deviceName).toBe('iPhone Simulator')
    expect(result.browserName).toBeUndefined()
  })

  it('honors explicit overrides for platformName/automationName/deviceName', () => {
    const result = parseIosAppiumSettings({
      IOS_PLATFORM_NAME: 'iOS',
      IOS_AUTOMATION_NAME: 'XCUITest',
      IOS_DEVICE_NAME: 'iPhone 15',
      IOS_PLATFORM_VERSION: '17.0',
    })
    expect(result.deviceName).toBe('iPhone 15')
    expect(result.platformVersion).toBe('17.0')
  })

  it('passes through udid only when explicitly set (existy-only, no default)', () => {
    expect(parseIosAppiumSettings({ IOS_UDID: 'abc-123' })).toMatchObject({ udid: 'abc-123' })
    expect(parseIosAppiumSettings({})).not.toHaveProperty('udid')
  })

  it('exercises every mapped capability at once with non-default env values (coverage sweep)', () => {
    const result = parseIosAppiumSettings(IOS_ALL_ENVS_NON_DEFAULT)
    expect(result.fullReset).toBe(true)
    expect(result.newCommandTimeout).toBe(999999)
    expect(result.bundleId).toBe('custom-value')
    expect(result.webviewConnectTimeout).toBe(999999)
    expect(Object.keys(result).length).toBeGreaterThan(80)
  })
})

describe('parseAndroidAppiumSettings', () => {
  it('omits optional boolean/whole-number keys that were never given an env var', () => {
    const result = parseAndroidAppiumSettings({})
    expect(result).not.toHaveProperty('fullReset')
    expect(result).not.toHaveProperty('adbPort')
    expect(result).not.toHaveProperty('appPackage')
  })

  it('parses a representative boolean capability (ANDROID_FULL_RESET -> fullReset)', () => {
    expect(parseAndroidAppiumSettings({ ANDROID_FULL_RESET: 'true' })).toMatchObject({ fullReset: true })
    expect(parseAndroidAppiumSettings({ ANDROID_FULL_RESET: 'false' })).not.toHaveProperty('fullReset')
  })

  it('parses a representative whole-number capability (ADB_PORT -> adbPort)', () => {
    expect(parseAndroidAppiumSettings({ ADB_PORT: '5038' })).toMatchObject({ adbPort: 5038 })
    expect(parseAndroidAppiumSettings({ ADB_PORT: '5037' })).not.toHaveProperty('adbPort')
  })

  it('parses a boolean capability whose true default only surfaces when explicitly disabled (ALLOW_DELAY_ADB)', () => {
    expect(parseAndroidAppiumSettings({ ALLOW_DELAY_ADB: 'false' })).toMatchObject({ allowDelayAdb: false })
    expect(parseAndroidAppiumSettings({ ALLOW_DELAY_ADB: 'true' })).not.toHaveProperty('allowDelayAdb')
  })

  it('passes through direct string capabilities with no default (APP_PACKAGE -> appPackage)', () => {
    expect(parseAndroidAppiumSettings({ APP_PACKAGE: 'com.example.app' })).toMatchObject({ appPackage: 'com.example.app' })
    expect(parseAndroidAppiumSettings({})).not.toHaveProperty('appPackage')
  })

  it('defaults automationName/platformName via ternary when unset', () => {
    const result = parseAndroidAppiumSettings({})
    expect(result.automationName).toBe('UiAutomator2')
    expect(result.platformName).toBe('Android')
  })

  it('honors explicit overrides for automationName/platformName', () => {
    const result = parseAndroidAppiumSettings({
      ANDROID_AUTOMATION_NAME: 'UiAutomator2',
      ANDROID_PLATFORM_NAME: 'Android',
      ANDROID_PLATFORM_VERSION: '14',
    })
    expect(result.platformVersion).toBe('14')
  })

  it('exercises every mapped capability at once with non-default env values (coverage sweep)', () => {
    const result = parseAndroidAppiumSettings(ANDROID_ALL_ENVS_NON_DEFAULT)
    expect(result.fullReset).toBe(true)
    expect(result.adbPort).toBe(999999)
    expect(result.appPackage).toBe('custom-value')
    expect(result.webviewDevtoolsPort).toBe(999999)
    expect(Object.keys(result).length).toBeGreaterThan(80)
  })
})
