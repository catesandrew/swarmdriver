import {
  AppiumLogLevel,
  parseAppiumLogLevel,
} from '../enums'

import {
  existy,
  parseBool,
  parseWhole,
} from '../utils'

import {
  buildDate,
  buildGitRef,
} from './utils'

import type { Envs, WdioConfig } from '../types'

export const buildAppiumGitRef = (buildPrefix = '') => {
  const ref = buildGitRef()
  return `${ buildPrefix }-${ ref }`
}

export const buildAppiumBuildId = (buildSuffix = '') => {
  return `${ buildDate() }-${ buildSuffix }`
}

export const parseAppiumServiceSettings = (envs: Envs) => {
  return {
    ...(existy(envs.APPIUM_LOG_LEVEL) ?
      {
        logLevel: parseAppiumLogLevel(envs.APPIUM_LOG_LEVEL, AppiumLogLevel.ERROR).code,
      } :
      {
        logLevel: AppiumLogLevel.props[AppiumLogLevel.ERROR].code,
      }),
    ...(envs.APPIUM_ADDRESS ?
      {
        address: envs.APPIUM_ADDRESS,
      } :
      {
        address: '127.0.0.1',
      }),
    ...(envs.APPIUM_COMMAND && {
      command: envs.APPIUM_COMMAND,
    }),
    ...(envs.APPIUM_LOG_PATH && {
      logPath: envs.APPIUM_LOG_PATH,
    }),
    ...(envs.APPIUM_ALLOW_INSECURE && {
      allowInsecure: envs.APPIUM_ALLOW_INSECURE,
    }),
    ...(parseWhole(envs, 'APPIUM_PORT', 4723) &&
      {
        port: parseWhole(envs, 'APPIUM_PORT', 4723),
      }),
    ...(existy(parseBool(envs, 'APPIUM_RELAXED_SECURITY', false)) && {
      relaxedSecurity: parseBool(envs, 'APPIUM_RELAXED_SECURITY', false)
    }),
    ...(existy(parseBool(envs, 'APPIUM_ALLOW_CORS', false)) && {
      allowCors: parseBool(envs, 'APPIUM_ALLOW_CORS', false)
    }),
    ...(existy(parseBool(envs, 'APPIUM_LOG_NO_COLORS', false)) && {
      logNoColors: parseBool(envs, 'APPIUM_LOG_NO_COLORS', false)
    }),
    ...(existy(parseBool(envs, 'APPIUM_LONG_STACKTRACE', false)) && {
      longStacktrace: parseBool(envs, 'APPIUM_LONG_STACKTRACE', false)
    }),
    ...(existy(parseBool(envs, 'APPIUM_DEBUG_LOG_SPACING', false)) && {
      debugLogSpacing: parseBool(envs, 'APPIUM_DEBUG_LOG_SPACING', false)
    }),
  }
}

/** Everything `parseAppiumServiceSettings()` can read out of the environment. */
export type AppiumServiceSettings = ReturnType<typeof parseAppiumServiceSettings>

export const buildAppiumSettings = ({
  ...opts
}: Partial<AppiumServiceSettings> = {}): WdioConfig => {
  return {
    // port to listen on
    ...(existy(opts.port) && {
      port: opts.port,
    }),
    // When running locally with appium, we do not need retries
    connectionRetryCount: 0,
    specFileRetries: 0,
    services: [
      // In order to use the service you need to add `appium` to list of services
      ['appium', {
        // To use your own installation of Appium, e.g. globally installed,
        // specify the command which should be started.
        ...(opts.command && {
          command: opts.command,
        }),
        // Path where all logs from the Appium server should be stored.
        ...(opts.logPath && {
          logPath: opts.logPath,
        }),
        // Map of arguments for the Appium server, passed directly to appium.
        // http://appium.io/docs/en/writing-running-appium/server-args/index.html
        args: {
          // Disable additional security checks, so it is possible to use some
          // advanced features, provided by drivers supporting this option.
          // Only enable it if all the clients are in the trusted network and
          // it is not the case if a client could potentially break out of the
          // session sandbox.
          //
          // Might be needed to tell Appium that we can execute local ADB
          // commands and to automatically download the latest version of
          // ChromeDriver.
          ...(existy(opts.relaxedSecurity) && {
            relaxedSecurity: opts.relaxedSecurity,
          }),
          // Whether the Appium server should allow web browser connections from any host
          ...(existy(opts.allowCors) && {
            allowCors: opts.allowCors,
          }),
          // Do not use colors in console output
          ...(existy(opts.logNoColors) && {
            logNoColors: opts.logNoColors,
          }),
          // Add exaggerated spacing in logs to help with visual inspection
          ...(existy(opts.debugLogSpacing) && {
            debugLogSpacing: opts.debugLogSpacing,
          }),
          // Add long stack traces to log entries. Recommended for debugging only.
          ...(existy(opts.longStacktrace) && {
            longStacktrace: opts.longStacktrace,
          }),
          // Set the server log level for console and logfile (specified
          // as `console-level:logfile-level`, with both being the same if
          // only one value is supplied). Possible values
          // are `debug`, `info`, `warn`, `error`, which are progressively
          // less verbose.
          ...(opts.logLevel && {
            logLevel: opts.logLevel,
          }),
          // IP Address to listen on 0.0.0.0
          ...(opts.address && {
            address: opts.address,
          }),
          ...(existy(opts.allowInsecure) && {
            allowInsecure: opts.allowInsecure,
          }),
        }
      }]
    ],
  }
}

export const setupAppiumConfig = ({
  envs,
  ...opts
}: Partial<AppiumServiceSettings> & { envs?: Envs } = {}): WdioConfig => {
  const values = parseAppiumServiceSettings(envs)
  const settings = buildAppiumSettings(values)

  return {
    ...settings,
  }
}

export const parseAppiumSettings = (envs: Envs) => {
  return {
    ...(existy(parseBool(envs, 'AUTO_LAUNCH', true)) && {
      autoLaunch: parseBool(envs, 'AUTO_LAUNCH', true)
    }),
    ...(existy(parseBool(envs, 'AUTO_WEBVIEW', false)) && {
      autoWebview: parseBool(envs, 'AUTO_WEBVIEW', false)
    }),
    ...(existy(parseBool(envs, 'IS_HEADLESS', false)) && {
      isHeadless: parseBool(envs, 'IS_HEADLESS', false)
    }),
    ...(existy(parseWhole(envs, 'MJPEG_SERVER_PORT', 9100)) && {
      mjpegServerPort: parseWhole(envs, 'MJPEG_SERVER_PORT', 9100)
    }),
    ...(existy(parseBool(envs, 'PRINT_PAGE_SOURCE_ON_FIND_FAILURE', false)) && {
      printPageSourceOnFindFailure: parseBool(envs, 'PRINT_PAGE_SOURCE_ON_FIND_FAILURE', false)
    }),
    ...(existy(parseBool(envs, 'SKIP_LOG_CAPTURE', false)) && {
      skipLogCapture: parseBool(envs, 'SKIP_LOG_CAPTURE', false)
    }),
  }
}

export const parseIosAppiumSettings = (envs: Envs) => {
  return {
    ...(existy(parseBool(envs, 'IOS_FULL_RESET', false)) && {
      fullReset: parseBool(envs, 'IOS_FULL_RESET', false)
    }),
    ...(existy(parseWhole(envs, 'IOS_NEW_COMMAND_TIMEOUT', 60)) && {
      newCommandTimeout: parseWhole(envs, 'IOS_NEW_COMMAND_TIMEOUT', 60)
    }),
    ...(existy(parseBool(envs, 'IOS_NO_RESET', false)) && {
      noReset: parseBool(envs, 'IOS_NO_RESET', false)
    }),

    ...(existy(parseBool(envs, 'ABSOLUTE_WEB_LOCATIONS', false)) && {
      absoluteWebLocations: parseBool(envs, 'ABSOLUTE_WEB_LOCATIONS', false)
    }),
    ...(existy(parseBool(envs, 'ALLOW_PROVISIONING_DEVICE_REGISTRATION', false)) && {
      allowProvisioningDeviceRegistration: parseBool(envs, 'ALLOW_PROVISIONING_DEVICE_REGISTRATION', false)
    }),
    ...(existy(parseWhole(envs, 'APP_PUSH_TIMEOUT', 30000)) && {
      appPushTimeout: parseWhole(envs, 'APP_PUSH_TIMEOUT', 30000)
    }),
    ...(existy(parseBool(envs, 'AUTO_ACCEPT_ALERTS', false)) && {
      autoAcceptAlerts: parseBool(envs, 'AUTO_ACCEPT_ALERTS', false)
    }),
    ...(existy(parseBool(envs, 'AUTO_DISMISS_ALERTS', false)) && {
      autoDismissAlerts: parseBool(envs, 'AUTO_DISMISS_ALERTS', false)
    }),
    ...(existy(parseBool(envs, 'CALENDAR_ACCESS_AUTHORIZED', false)) && {
      calendarAccessAuthorized: parseBool(envs, 'CALENDAR_ACCESS_AUTHORIZED', false)
    }),
    ...(existy(parseBool(envs, 'CLEAR_SYSTEM_FILES', false)) && {
      clearSystemFiles: parseBool(envs, 'CLEAR_SYSTEM_FILES', false)
    }),
    ...(existy(parseBool(envs, 'CONNECT_HARDWARE_KEYBOARD', false)) && {
      connectHardwareKeyboard: parseBool(envs, 'CONNECT_HARDWARE_KEYBOARD', false)
    }),
    ...(existy(parseBool(envs, 'DISABLE_AUTOMATIC_SCREENSHOTS', true)) && {
      disableAutomaticScreenshots: parseBool(envs, 'DISABLE_AUTOMATIC_SCREENSHOTS', true)
    }),
    ...(existy(parseBool(envs, 'ENABLE_ASYNC_EXECUTE_FROM_HTTPS', false)) && {
      enableAsyncExecuteFromHttps: parseBool(envs, 'ENABLE_ASYNC_EXECUTE_FROM_HTTPS', false)
    }),
    ...(existy(parseBool(envs, 'ENABLE_PERFORMANCE_LOGGING', false)) && {
      enablePerformanceLogging: parseBool(envs, 'ENABLE_PERFORMANCE_LOGGING', false)
    }),
    ...(existy(parseBool(envs, 'ENFORCE_FRESH_SIMULATOR_CREATION', false)) && {
      enforceFreshSimulatorCreation: parseBool(envs, 'ENFORCE_FRESH_SIMULATOR_CREATION', false)
    }),
    ...(existy(parseBool(envs, 'FORCE_APP_LAUNCH', true)) && {
      forceAppLaunch: parseBool(envs, 'FORCE_APP_LAUNCH', true)
    }),
    ...(existy(parseBool(envs, 'FULL_CONTEXT_LIST', false)) && {
      fullContextList: parseBool(envs, 'FULL_CONTEXT_LIST', false)
    }),
    ...(existy(parseBool(envs, 'INCLUDE_DEVICE_CAPS_TO_SESSION_INFO', true)) && {
      includeDeviceCapsToSessionInfo: parseBool(envs, 'INCLUDE_DEVICE_CAPS_TO_SESSION_INFO', true)
    }),
    ...(existy(parseBool(envs, 'INCLUDE_SAFARI_IN_WEBVIEWS', false)) && {
      includeSafariInWebviews: parseBool(envs, 'INCLUDE_SAFARI_IN_WEBVIEWS', false)
    }),
    ...(existy(parseWhole(envs, 'IOS_INSTALL_PAUSE', 0)) && {
      iosInstallPause: parseWhole(envs, 'IOS_INSTALL_PAUSE', 0)
    }),
    ...(existy(parseBool(envs, 'KEEP_KEY_CHAINS', false)) && {
      keepKeyChains: parseBool(envs, 'KEEP_KEY_CHAINS', false)
    }),
    ...(existy(parseBool(envs, 'LAUNCH_WITH_IDB', false)) && {
      launchWithIDB: parseBool(envs, 'LAUNCH_WITH_IDB', false)
    }),
    ...(existy(parseWhole(envs, 'MAX_TYPING_FREQUENCY', 60)) && {
      maxTypingFrequency: parseWhole(envs, 'MAX_TYPING_FREQUENCY', 60)
    }),
    ...(existy(parseBool(envs, 'NATIVE_WEB_TAP', false)) && {
      nativeWebTap: parseBool(envs, 'NATIVE_WEB_TAP', false)
    }),
    ...(existy(parseBool(envs, 'NATIVE_WEB_TAP_STRICT', false)) && {
      nativeWebTapStrict: parseBool(envs, 'NATIVE_WEB_TAP_STRICT', false)
    }),
    ...(existy(parseBool(envs, 'PREBUILD_WDA', true)) && {
      prebuildWDA: parseBool(envs, 'PREBUILD_WDA', true)
    }),
    ...(existy(parseBool(envs, 'REDUCE_MOTION', false)) && {
      reduceMotion: parseBool(envs, 'REDUCE_MOTION', false)
    }),
    ...(existy(parseBool(envs, 'RESET_ON_SESSION_START_ONLY', true)) && {
      resetOnSessionStartOnly: parseBool(envs, 'RESET_ON_SESSION_START_ONLY', true)
    }),
    ...(existy(parseBool(envs, 'SAFARI_ALLOW_POPUPS', true)) && {
      safariAllowPopups: parseBool(envs, 'SAFARI_ALLOW_POPUPS', true)
    }),
    ...(existy(parseBool(envs, 'SAFARI_GARBAGE_COLLECT', false)) && {
      safariGarbageCollect: parseBool(envs, 'SAFARI_GARBAGE_COLLECT', false)
    }),
    ...(existy(parseBool(envs, 'SAFARI_IGNORE_FRAUD_WARNING', true)) && {
      safariIgnoreFraudWarning: parseBool(envs, 'SAFARI_IGNORE_FRAUD_WARNING', true)
    }),
    ...(existy(parseBool(envs, 'SAFARI_LOG_ALL_COMMUNICATION', false)) && {
      safariLogAllCommunication: parseBool(envs, 'SAFARI_LOG_ALL_COMMUNICATION', false)
    }),
    ...(existy(parseBool(envs, 'SAFARI_LOG_ALL_COMMUNICATION_HEX_DUMP', false)) && {
      safariLogAllCommunicationHexDump: parseBool(envs, 'SAFARI_LOG_ALL_COMMUNICATION_HEX_DUMP', false)
    }),
    ...(existy(parseBool(envs, 'SAFARI_OPEN_LINKS_IN_BACKGROUND', true)) && {
      safariOpenLinksInBackground: parseBool(envs, 'SAFARI_OPEN_LINKS_IN_BACKGROUND', true)
    }),
    ...(existy(parseWhole(envs, 'SAFARI_SOCKET_CHUNK_SIZE', 16384)) && {
      safariSocketChunkSize: parseWhole(envs, 'SAFARI_SOCKET_CHUNK_SIZE', 16384)
    }),
    ...(existy(parseWhole(envs, 'SAFARI_WEB_INSPECTOR_MAX_FRAME_LENGTH', 20971520)) && {
      safariWebInspectorMaxFrameLength: parseWhole(envs, 'SAFARI_WEB_INSPECTOR_MAX_FRAME_LENGTH', 20971520)
    }),
    ...(existy(parseWhole(envs, 'SCREENSHOT_QUALITY', 1)) && {
      screenshotQuality: parseWhole(envs, 'SCREENSHOT_QUALITY', 1)
    }),
    ...(existy(parseBool(envs, 'SHOULD_TERMINATE_APP', true)) && {
      shouldTerminateApp: parseBool(envs, 'SHOULD_TERMINATE_APP', true)
    }),
    ...(existy(parseBool(envs, 'SHOULD_USE_SINGLETON_TEST_MANAGER', true)) && {
      shouldUseSingletonTestManager: parseBool(envs, 'SHOULD_USE_SINGLETON_TEST_MANAGER', true)
    }),
    ...(existy(parseBool(envs, 'SHOW_IOS_LOG', false)) && {
      showIOSLog: parseBool(envs, 'SHOW_IOS_LOG', false)
    }),
    ...(existy(parseBool(envs, 'SHOW_XCODE_LOG', false)) && {
      showXcodeLog: parseBool(envs, 'SHOW_XCODE_LOG', false)
    }),
    ...(existy(parseBool(envs, 'SHUTDOWN_OTHER_SIMULATORS', false)) && {
      shutdownOtherSimulators: parseBool(envs, 'SHUTDOWN_OTHER_SIMULATORS', false)
    }),
    ...(existy(parseBool(envs, 'SIMPLE_IS_VISIBLE_CHECK', true)) && {
      simpleIsVisibleCheck: parseBool(envs, 'SIMPLE_IS_VISIBLE_CHECK', true)
    }),
    ...(existy(parseWhole(envs, 'SIMULATOR_STARTUP_TIMEOUT', 120000)) && {
      simulatorStartupTimeout: parseWhole(envs, 'SIMULATOR_STARTUP_TIMEOUT', 120000)
    }),
    ...(existy(parseBool(envs, 'SIMULATOR_TRACE_POINTER', false)) && {
      simulatorTracePointer: parseBool(envs, 'SIMULATOR_TRACE_POINTER', false)
    }),
    ...(existy(parseBool(envs, 'USE_JSON_SOURCE', false)) && {
      useJSONSource: parseBool(envs, 'USE_JSON_SOURCE', false)
    }),
    ...(existy(parseBool(envs, 'USE_NATIVE_CACHING_STRATEGY', true)) && {
      useNativeCachingStrategy: parseBool(envs, 'USE_NATIVE_CACHING_STRATEGY', true)
    }),
    ...(existy(parseBool(envs, 'USE_NEW_WDA', false)) && {
      useNewWDA: parseBool(envs, 'USE_NEW_WDA', false)
    }),
    ...(existy(parseBool(envs, 'USE_PREBUILT_WDA', false)) && {
      usePrebuiltWDA: parseBool(envs, 'USE_PREBUILT_WDA', false)
    }),
    ...(existy(parseBool(envs, 'USE_SIMPLE_BUILD_TEST', false)) && {
      useSimpleBuildTest: parseBool(envs, 'USE_SIMPLE_BUILD_TEST', false)
    }),
    ...(existy(parseBool(envs, 'USE_XCTESTRUN_FILE', false)) && {
      useXctestrunFile: parseBool(envs, 'USE_XCTESTRUN_FILE', false)
    }),
    ...(existy(parseWhole(envs, 'WAIT_FOR_IDLE_TIMEOUT', 10)) && {
      waitForIdleTimeout: parseWhole(envs, 'WAIT_FOR_IDLE_TIMEOUT', 10)
    }),
    ...(existy(parseBool(envs, 'WAIT_FOR_QUIESCENCE', true)) && {
      waitForQuiescence: parseBool(envs, 'WAIT_FOR_QUIESCENCE', true)
    }),
    ...(existy(parseWhole(envs, 'WDA_CONNECTION_TIMEOUT', 240000)) && {
      wdaConnectionTimeout: parseWhole(envs, 'WDA_CONNECTION_TIMEOUT', 240000)
    }),
    ...(existy(parseWhole(envs, 'WDA_EVENTLOOP_IDLE_DELAY', 0)) && {
      wdaEventloopIdleDelay: parseWhole(envs, 'WDA_EVENTLOOP_IDLE_DELAY', 0)
    }),
    ...(existy(parseWhole(envs, 'WDA_LAUNCH_TIMEOUT', 60000)) && {
      wdaLaunchTimeout: parseWhole(envs, 'WDA_LAUNCH_TIMEOUT', 60000)
    }),
    ...(existy(parseWhole(envs, 'WDA_LOCAL_PORT', 8100)) && {
      wdaLocalPort: parseWhole(envs, 'WDA_LOCAL_PORT', 8100)
    }),
    ...(existy(parseWhole(envs, 'WDA_STARTUP_RETRIES', 2)) && {
      wdaStartupRetries: parseWhole(envs, 'WDA_STARTUP_RETRIES', 2)
    }),
    ...(existy(parseWhole(envs, 'WDA_STARTUP_RETRY_INTERVAL', 10000)) && {
      wdaStartupRetryInterval: parseWhole(envs, 'WDA_STARTUP_RETRY_INTERVAL', 10000)
    }),
    ...(existy(parseWhole(envs, 'WEBKIT_RESPONSE_TIMEOUT', 5000)) && {
      webkitResponseTimeout: parseWhole(envs, 'WEBKIT_RESPONSE_TIMEOUT', 5000)
    }),
    ...(existy(parseWhole(envs, 'WEBVIEW_CONNECT_RETRIES', 8)) && {
      webviewConnectRetries: parseWhole(envs, 'WEBVIEW_CONNECT_RETRIES', 8)
    }),
    ...(existy(parseWhole(envs, 'WEBVIEW_CONNECT_TIMEOUT', 0)) && {
      webviewConnectTimeout: parseWhole(envs, 'WEBVIEW_CONNECT_TIMEOUT', 0)
    }),
    ...(existy(envs.IOS_PLATFORM_NAME) ?
      {
        platformName: envs.IOS_PLATFORM_NAME,
      } :
      {
        platformName: 'iOS',
      }),
    ...(existy(envs.IOS_AUTOMATION_NAME) ?
      {
        automationName: envs.IOS_AUTOMATION_NAME,
      } :
      {
        automationName: 'XCUITest',
      }),
    ...(existy(envs.IOS_DEVICE_NAME) ?
      {
        deviceName: envs.IOS_DEVICE_NAME,
      } :
      {
        deviceName: 'iPhone Simulator',
      }),
    ...(existy(envs.IOS_PLATFORM_VERSION) ?
      {
        platformVersion: envs.IOS_PLATFORM_VERSION,
      } :
      {
        platformVersion: '14.4',
      }),
    ...(existy(envs.IOS_BROWSER_NAME) && {
      browserName: envs.IOS_BROWSER_NAME,
    }),
    ...(existy(envs.IOS_UDID) && {
      udid: envs.IOS_UDID,
    }),
    ...(existy(envs.XCODE_SIGNING_ID) ?
      {
        xcodeSigningId: envs.XCODE_SIGNING_ID,
      } :
      {
        xcodeSigningId: 'iPhone Developer',
      }),
    ...(existy(envs.XCODE_ORG_ID) && {
      xcodeOrgId: envs.XCODE_ORG_ID,
    }),
    ...(existy(envs.BUNDLE_ID) && {
      bundleId: envs.BUNDLE_ID,
    }),
    ...(existy(envs.IOS_APP) && {
      app: envs.IOS_APP,
    }),
    ...(existy(envs.LOCALIZABLE_STRINGS_DIR) && {
      localizableStringsDir: envs.LOCALIZABLE_STRINGS_DIR,
    }),
    ...(existy(envs.IOS_LANGUAGE) ?
      {
        language: envs.IOS_LANGUAGE,
      } :
      {
        language: 'en',
      }),
    ...(existy(envs.IOS_LOCALE) ?
      {
        locale: envs.IOS_LOCALE,
      } :
      {
        locale: 'en_US',
      }),
    ...(existy(envs.XCODE_CONFIG_FILE) && {
      xcodeConfigFile: envs.XCODE_CONFIG_FILE,
    }),
    ...(existy(envs.UPDATED_WDA_BUNDLE_ID) && {
      updatedWDABundleId: envs.UPDATED_WDA_BUNDLE_ID,
    }),
    ...(existy(envs.KEYCHAIN_PATH) && {
      keychainPath: envs.KEYCHAIN_PATH,
    }),
    ...(existy(envs.KEYCHAIN_PASSWORD) && {
      keychainPassword: envs.KEYCHAIN_PASSWORD,
    }),
    ...(existy(envs.DERIVED_DATA_PATH) && {
      derivedDataPath: envs.DERIVED_DATA_PATH,
    }),
    ...(existy(envs.WEB_DRIVER_AGENT_URL) && {
      webDriverAgentUrl: envs.WEB_DRIVER_AGENT_URL,
    }),
    ...(existy(envs.WDA_BASE_URL) && {
      wdaBaseUrl: envs.WDA_BASE_URL,
    }),
    ...(existy(envs.PROCESS_ARGUMENTS) && {
      processArguments: envs.PROCESS_ARGUMENTS,
    }),
    ...(existy(envs.RESULT_BUNDLE_PATH) && {
      resultBundlePath: envs.RESULT_BUNDLE_PATH,
    }),
    ...(existy(envs.RESULT_BUNDLE_VERSION) && {
      resultBundleVersion: envs.RESULT_BUNDLE_VERSION,
    }),
    ...(existy(envs.IOS_DEVICE_ORIENTATION) && {
      deviceOrientation: envs.IOS_DEVICE_ORIENTATION,
    }),
    ...(existy(envs.SCALE_FACTOR) && {
      scaleFactor: envs.SCALE_FACTOR,
    }),
    ...(existy(envs.CALENDAR_FORMAT) && {
      calendarFormat: envs.CALENDAR_FORMAT,
    }),
    ...(existy(envs.KEYCHAINS_EXCLUDE_PATTERNS) && {
      keychainsExcludePatterns: envs.KEYCHAINS_EXCLUDE_PATTERNS,
    }),
    ...(existy(envs.IOS_SIMULATOR_LOGS_PREDICATE) && {
      iosSimulatorLogsPredicate: envs.IOS_SIMULATOR_LOGS_PREDICATE,
    }),
    ...(existy(envs.SIMULATOR_PASTEBOARD_AUTOMATIC_SYNC) && {
      simulatorPasteboardAutomaticSync: envs.SIMULATOR_PASTEBOARD_AUTOMATIC_SYNC,
    }),
    ...(existy(envs.SIMULATOR_DEVICES_SET_PATH) && {
      simulatorDevicesSetPath: envs.SIMULATOR_DEVICES_SET_PATH,
    }),
    ...(existy(envs.CUSTOM_SSL_CERT) && {
      customSSLCert: envs.CUSTOM_SSL_CERT,
    }),
    ...(existy(envs.SAFARI_IGNORE_WEB_HOSTNAMES) && {
      safariIgnoreWebHostnames: envs.SAFARI_IGNORE_WEB_HOSTNAMES,
    }),
    ...(existy(envs.SAFARI_INITIAL_URL) && {
      safariInitialUrl: envs.SAFARI_INITIAL_URL,
    }),
  }
}

export const parseAndroidAppiumSettings = (envs: Envs) => {
  return {
    ...(existy(parseBool(envs, 'ANDROID_FULL_RESET', false)) && {
      fullReset: parseBool(envs, 'ANDROID_FULL_RESET', false)
    }),
    ...(existy(parseWhole(envs, 'ANDROID_NEW_COMMAND_TIMEOUT', 60)) && {
      newCommandTimeout: parseWhole(envs, 'ANDROID_NEW_COMMAND_TIMEOUT', 60)
    }),
    ...(existy(parseBool(envs, 'ANDROID_NO_RESET', false)) && {
      noReset: parseBool(envs, 'ANDROID_NO_RESET', false)
    }),

    ...(existy(parseWhole(envs, 'ADB_EXEC_TIMEOUT', 20000)) && {
      adbExecTimeout: parseWhole(envs, 'ADB_EXEC_TIMEOUT', 20000)
    }),
    ...(existy(parseWhole(envs, 'ADB_PORT', 5037)) && {
      adbPort: parseWhole(envs, 'ADB_PORT', 5037)
    }),
    ...(existy(parseBool(envs, 'ALLOW_DELAY_ADB', true)) && {
      allowDelayAdb: parseBool(envs, 'ALLOW_DELAY_ADB', true)
    }),
    ...(existy(parseBool(envs, 'ALLOW_TEST_PACKAGES', false)) && {
      allowTestPackages: parseBool(envs, 'ALLOW_TEST_PACKAGES', false)
    }),
    ...(existy(parseWhole(envs, 'ANDROID_INSTALL_TIMEOUT', 90000)) && {
      androidInstallTimeout: parseWhole(envs, 'ANDROID_INSTALL_TIMEOUT', 90000)
    }),
    ...(existy(parseWhole(envs, 'APP_WAIT_DURATION', 20000)) && {
      appWaitDuration: parseWhole(envs, 'APP_WAIT_DURATION', 20000)
    }),
    ...(existy(parseBool(envs, 'APP_WAIT_FOR_LAUNCH', true)) && {
      appWaitForLaunch: parseBool(envs, 'APP_WAIT_FOR_LAUNCH', true)
    }),
    ...(existy(parseBool(envs, 'AUTO_GRANT_PERMISSIONS', false)) && {
      autoGrantPermissions: parseBool(envs, 'AUTO_GRANT_PERMISSIONS', false)
    }),
    ...(existy(parseWhole(envs, 'AUTO_WEBVIEW_TIMEOUT', 2000)) && {
      autoWebviewTimeout: parseWhole(envs, 'AUTO_WEBVIEW_TIMEOUT', 2000)
    }),
    ...(existy(parseWhole(envs, 'AVD_ARGS', 0)) && {
      avdArgs: parseWhole(envs, 'AVD_ARGS', 0)
    }),
    ...(existy(parseWhole(envs, 'AVD_LAUNCH_TIMEOUT', 60000)) && {
      avdLaunchTimeout: parseWhole(envs, 'AVD_LAUNCH_TIMEOUT', 60000)
    }),
    ...(existy(parseWhole(envs, 'AVD_READY_TIMEOUT', 60000)) && {
      avdReadyTimeout: parseWhole(envs, 'AVD_READY_TIMEOUT', 60000)
    }),
    ...(existy(parseBool(envs, 'CHROMEDRIVER_DISABLE_BUILD_CHECK', false)) && {
      chromedriverDisableBuildCheck: parseBool(envs, 'CHROMEDRIVER_DISABLE_BUILD_CHECK', false)
    }),
    ...(existy(parseWhole(envs, 'CHROMEDRIVER_PORT', 0)) && {
      chromedriverPort: parseWhole(envs, 'CHROMEDRIVER_PORT', 0)
    }),
    ...(existy(parseBool(envs, 'CHROMEDRIVER_USE_SYSTEM_EXECUTABLE', false)) && {
      chromedriverUseSystemExecutable: parseBool(envs, 'CHROMEDRIVER_USE_SYSTEM_EXECUTABLE', false)
    }),
    ...(existy(parseBool(envs, 'CLEAR_DEVICE_LOGS_ON_START', false)) && {
      clearDeviceLogsOnStart: parseBool(envs, 'CLEAR_DEVICE_LOGS_ON_START', false)
    }),
    ...(existy(parseBool(envs, 'DISABLE_SUPPRESS_ACCESSIBILITY_SERVICE', false)) && {
      disableSuppressAccessibilityService: parseBool(envs, 'DISABLE_SUPPRESS_ACCESSIBILITY_SERVICE', false)
    }),
    ...(existy(parseBool(envs, 'DISABLE_WINDOW_ANIMATION', false)) && {
      disableWindowAnimation: parseBool(envs, 'DISABLE_WINDOW_ANIMATION', false)
    }),
    ...(existy(parseBool(envs, 'DONT_STOP_APP_ON_RESET', false)) && {
      dontStopAppOnReset: parseBool(envs, 'DONT_STOP_APP_ON_RESET', false)
    }),
    ...(existy(parseBool(envs, 'ENABLE_WEBVIEW_DETAILS_COLLECTION', true)) && {
      enableWebviewDetailsCollection: parseBool(envs, 'ENABLE_WEBVIEW_DETAILS_COLLECTION', true)
    }),
    ...(existy(parseBool(envs, 'ENFORCE_APP_INSTALL', false)) && {
      enforceAppInstall: parseBool(envs, 'ENFORCE_APP_INSTALL', false)
    }),
    ...(existy(parseBool(envs, 'ENSURE_WEBVIEWS_HAVE_PAGES', true)) && {
      ensureWebviewsHavePages: parseBool(envs, 'ENSURE_WEBVIEWS_HAVE_PAGES', true)
    }),
    ...(existy(parseBool(envs, 'EXTRACT_CHROME_ANDROID_PACKAGE_FROM_CONTEXT_NAME', false)) && {
      extractChromeAndroidPackageFromContextName: parseBool(envs, 'EXTRACT_CHROME_ANDROID_PACKAGE_FROM_CONTEXT_NAME', false)
    }),
    ...(existy(parseBool(envs, 'GPS_ENABLED', false)) && {
      gpsEnabled: parseBool(envs, 'GPS_ENABLED', false)
    }),
    ...(existy(parseBool(envs, 'IGNORE_HIDDEN_API_POLICY_ERROR', false)) && {
      ignoreHiddenApiPolicyError: parseBool(envs, 'IGNORE_HIDDEN_API_POLICY_ERROR', false)
    }),
    ...(existy(parseBool(envs, 'NATIVE_WEB_SCREENSHOT', false)) && {
      nativeWebScreenshot: parseBool(envs, 'NATIVE_WEB_SCREENSHOT', false)
    }),
    ...(existy(parseWhole(envs, 'NETWORK_SPEED', 0)) && {
      networkSpeed: parseWhole(envs, 'NETWORK_SPEED', 0)
    }),
    ...(existy(parseBool(envs, 'NO_SIGN', false)) && {
      noSign: parseBool(envs, 'NO_SIGN', false)
    }),
    ...(existy(parseBool(envs, 'RECREATE_CHROME_DRIVER_SESSIONS', false)) && {
      recreateChromeDriverSessions: parseBool(envs, 'RECREATE_CHROME_DRIVER_SESSIONS', false)
    }),
    ...(existy(parseWhole(envs, 'REMOTE_APPS_CACHE_LIMIT', 10)) && {
      remoteAppsCacheLimit: parseWhole(envs, 'REMOTE_APPS_CACHE_LIMIT', 10)
    }),
    ...(existy(parseBool(envs, 'SHOW_CHROMEDRIVER_LOG', false)) && {
      showChromedriverLog: parseBool(envs, 'SHOW_CHROMEDRIVER_LOG', false)
    }),
    ...(existy(parseBool(envs, 'SKIP_DEVICE_INITIALIZATION', false)) && {
      skipDeviceInitialization: parseBool(envs, 'SKIP_DEVICE_INITIALIZATION', false)
    }),
    ...(existy(parseBool(envs, 'SKIP_LOGCAT_CAPTURE', false)) && {
      skipLogcatCapture: parseBool(envs, 'SKIP_LOGCAT_CAPTURE', false)
    }),
    ...(existy(parseBool(envs, 'SKIP_SERVER_INSTALLATION', false)) && {
      skipServerInstallation: parseBool(envs, 'SKIP_SERVER_INSTALLATION', false)
    }),
    ...(existy(parseBool(envs, 'SKIP_UNLOCK', true)) && {
      skipUnlock: parseBool(envs, 'SKIP_UNLOCK', true)
    }),
    ...(existy(parseBool(envs, 'SUPPRESS_KILL_SERVER', false)) && {
      suppressKillServer: parseBool(envs, 'SUPPRESS_KILL_SERVER', false)
    }),
    ...(existy(parseWhole(envs, 'SYSTEM_PORT', 8200)) && {
      systemPort: parseWhole(envs, 'SYSTEM_PORT', 8200)
    }),
    ...(existy(parseWhole(envs, 'UIAUTOMATOR2_SERVER_INSTALL_TIMEOUT', 20000)) && {
      uiautomator2ServerInstallTimeout: parseWhole(envs, 'UIAUTOMATOR2_SERVER_INSTALL_TIMEOUT', 20000)
    }),
    ...(existy(parseWhole(envs, 'UIAUTOMATOR2_SERVER_LAUNCH_TIMEOUT', 30000)) && {
      uiautomator2ServerLaunchTimeout: parseWhole(envs, 'UIAUTOMATOR2_SERVER_LAUNCH_TIMEOUT', 30000)
    }),
    ...(existy(parseWhole(envs, 'UIAUTOMATOR2_SERVER_READ_TIMEOUT', 240000)) && {
      uiautomator2ServerReadTimeout: parseWhole(envs, 'UIAUTOMATOR2_SERVER_READ_TIMEOUT', 240000)
    }),
    ...(existy(parseWhole(envs, 'UNLOCK_SUCCESS_TIMEOUT', 2000)) && {
      unlockSuccessTimeout: parseWhole(envs, 'UNLOCK_SUCCESS_TIMEOUT', 2000)
    }),
    ...(existy(parseBool(envs, 'USE_KEYSTORE', false)) && {
      useKeystore: parseBool(envs, 'USE_KEYSTORE', false)
    }),
    ...(existy(parseWhole(envs, 'USER_PROFILE', 0)) && {
      userProfile: parseWhole(envs, 'USER_PROFILE', 0)
    }),
    ...(existy(parseWhole(envs, 'WEBVIEW_DEVTOOLS_PORT', 0)) && {
      webviewDevtoolsPort: parseWhole(envs, 'WEBVIEW_DEVTOOLS_PORT', 0)
    }),
    ...(existy(envs.APP_PACKAGE) && {
      appPackage: envs.APP_PACKAGE,
    }),
    ...(existy(envs.APP_ACTIVITY) && {
      appActivity: envs.APP_ACTIVITY,
    }),
    ...(existy(envs.APP_WAIT_ACTIVITY) && {
      appWaitActivity: envs.APP_WAIT_ACTIVITY,
    }),
    ...(existy(envs.APP_WAIT_PACKAGE) && {
      appWaitPackage: envs.APP_WAIT_PACKAGE,
    }),
    ...(existy(envs.ANDROID_AUTOMATION_NAME) ?
      {
        automationName: envs.ANDROID_AUTOMATION_NAME,
      } :
      {
        automationName: 'UiAutomator2',
      }),
    ...(existy(envs.ANDROID_PLATFORM_NAME) ?
      {
        platformName: envs.ANDROID_PLATFORM_NAME,
      } :
      {
        platformName: 'Android',
      }),
    ...(existy(envs.ANDROID_PLATFORM_VERSION) && {
      platformVersion: envs.ANDROID_PLATFORM_VERSION,
    }),
    ...(existy(envs.ANDROID_DEVICE_NAME) && {
      deviceName: envs.ANDROID_DEVICE_NAME,
    }),
    ...(existy(envs.ANDROID_UDID) && {
      udid: envs.ANDROID_UDID,
    }),
    ...(existy(envs.ANDROID_DEVICE_ORIENTATION) && {
      deviceOrientation: envs.ANDROID_DEVICE_ORIENTATION,
    }),
    ...(existy(envs.ANDROID_APP) && {
      app: envs.ANDROID_APP,
    }),
    ...(existy(envs.ANDROID_BROWSER_NAME) && {
      browserName: envs.ANDROID_BROWSER_NAME,
    }),
    ...(existy(envs.INTENT_CATEGORY) && {
      intentCategory: envs.INTENT_CATEGORY,
    }),
    ...(existy(envs.INTENT_ACTION) && {
      intentAction: envs.INTENT_ACTION,
    }),
    ...(existy(envs.INTENT_FLAGS) && {
      intentFlags: envs.INTENT_FLAGS,
    }),
    ...(existy(envs.OPTIONAL_INTENT_ARGUMENTS) && {
      optionalIntentArguments: envs.OPTIONAL_INTENT_ARGUMENTS,
    }),
    ...(existy(envs.OTHER_APPS) && {
      otherApps: envs.OTHER_APPS,
    }),
    ...(existy(envs.UNINSTALL_OTHER_PACKAGES) && {
      uninstallOtherPackages: envs.UNINSTALL_OTHER_PACKAGES,
    }),
    ...(existy(envs.ANDROID_LOCALE_SCRIPT) && {
      localeScript: envs.ANDROID_LOCALE_SCRIPT,
    }),
    ...(existy(envs.ANDROID_LANGUAGE) ?
      {
        language: envs.ANDROID_LANGUAGE,
      } :
      {
        language: 'en',
      }),
    ...(existy(envs.ANDROID_LOCALE) ?
      {
        locale: envs.ANDROID_LOCALE,
      } :
      {
        locale: 'US',
      }),
    ...(existy(envs.REMOTE_ADB_HOST) && {
      remoteAdbHost: envs.REMOTE_ADB_HOST,
    }),
    ...(existy(envs.MOCK_LOCATION_APP) && {
      mockLocationApp: envs.MOCK_LOCATION_APP,
    }),
    ...(existy(envs.LOGCAT_FORMAT) && {
      logcatFormat: envs.LOGCAT_FORMAT,
    }),
    ...(existy(envs.LOGCAT_FILTER_SPECS) && {
      logcatFilterSpecs: envs.LOGCAT_FILTER_SPECS,
    }),
    ...(existy(envs.AVD) && {
      avd: envs.AVD,
    }),
    ...(existy(envs.AVD_ENV) && {
      avdEnv: envs.AVD_ENV,
    }),
    ...(existy(envs.KEYSTORE_PATH) && {
      keystorePath: envs.KEYSTORE_PATH,
    }),
    ...(existy(envs.KEYSTORE_PASSWORD) && {
      keystorePassword: envs.KEYSTORE_PASSWORD,
    }),
    ...(existy(envs.KEY_ALIAS) && {
      keyAlias: envs.KEY_ALIAS,
    }),
    ...(existy(envs.KEY_PASSWORD) && {
      keyPassword: envs.KEY_PASSWORD,
    }),
    ...(existy(envs.UNLOCK_TYPE) && {
      unlockType: envs.UNLOCK_TYPE,
    }),
    ...(existy(envs.UNLOCK_KEY) && {
      unlockKey: envs.UNLOCK_KEY,
    }),
    ...(existy(envs.MJPEG_SCREENSHOT_URL) && {
      mjpegScreenshotUrl: envs.MJPEG_SCREENSHOT_URL,
    }),
    ...(existy(envs.CHROMEDRIVER_PORTS) && {
      chromedriverPorts: envs.CHROMEDRIVER_PORTS,
    }),
    ...(existy(envs.CHROMEDRIVER_ARGS) && {
      chromedriverArgs: envs.CHROMEDRIVER_ARGS,
    }),
    ...(existy(envs.CHROMEDRIVER_EXECUTABLE) && {
      chromedriverExecutable: envs.CHROMEDRIVER_EXECUTABLE,
    }),
    ...(existy(envs.CHROMEDRIVER_EXECUTABLE_DIR) && {
      chromedriverExecutableDir: envs.CHROMEDRIVER_EXECUTABLE_DIR,
    }),
    ...(existy(envs.CHROMEDRIVER_CHROME_MAPPING_FILE) && {
      chromedriverChromeMappingFile: envs.CHROMEDRIVER_CHROME_MAPPING_FILE,
    }),
    ...(existy(envs.PAGE_LOAD_STRATEGY) && {
      pageLoadStrategy: envs.PAGE_LOAD_STRATEGY,
    }),
    ...(existy(envs.CHROME_OPTIONS) && {
      chromeOptions: envs.CHROME_OPTIONS,
    }),
  }
}
