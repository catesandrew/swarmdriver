import {
  existy,
  parseWhole,
  parseBool,
  parseString,
  parseList,
} from '@caps/core/utils'

import {
  buildDate,
  buildGitRef,
} from '@caps/core/services/utils'

import type {
  Envs,
  SauceCapabilityValues,
  SauceServiceSettings,
  SauceVars,
  SauceVarsOptions,
} from '../types'

const buildSauceTunnelOwner = (envs: Envs): string | undefined => {
  if (envs.SAUCE_TUNNEL_OWNER) {
    return envs.SAUCE_TUNNEL_OWNER
  }
}

const buildSauceTunnelName = (envs: Envs, prefix = 'tunnel'): string => {
  if (envs.SAUCE_TUNNEL_ID) {
    return envs.SAUCE_TUNNEL_ID
  }

  const ref = buildGitRef()
  return `${ prefix }-${ ref }`
}

const buildSauceBuildId = (envs: Envs, suffix = 'power'): string => {
  if (envs.SAUCE_BUILD_ID) {
    return envs.SAUCE_BUILD_ID
  }

  const builtOn = buildDate()
  return `${ builtOn }-${ suffix }`
}

export const buildSauceVars = ({
  envs,
  tunnelPrefix,
  buildSuffix,
}: SauceVarsOptions = {}): SauceVars => {
  const tunnelId = buildSauceTunnelName(envs, tunnelPrefix)
  const buildId = buildSauceBuildId(envs, buildSuffix)
  const tunnelOwner = buildSauceTunnelOwner(envs)

  return {
    tunnelId,
    tunnelOwner,
    buildId,
  }
}

export const parseSauceServiceSettings = (envs: Envs = {}): SauceServiceSettings => {
  return {
    // Your cloud service username.
    user: envs.SAUCE_USERNAME,
    // Your cloud service access key or secret key.
    key: envs.SAUCE_ACCESS_KEY,
    // If you don't provide the region, it defaults to `us`.
    ...(parseString(envs, 'SAUCE_REGION', 'us') && {
      region: String(envs.SAUCE_REGION),
    }),
    ...(existy(parseBool(envs, 'SAUCE_CONNECT', false)) && {
      sauceConnect: parseBool(envs, 'SAUCE_CONNECT', false)
    }),
    ...(existy(parseBool(envs, 'SAUCE_UPLOAD_LOGS', true)) && {
      uploadLogs: parseBool(envs, 'SAUCE_UPLOAD_LOGS', true)
    }),
    ...(existy(parseWhole(envs, 'SAUCE_MAX_ERROR_STACK_LENGTH', 5)) && {
      maxErrorStackLength: parseWhole(envs, 'SAUCE_MAX_ERROR_STACK_LENGTH', 5),
    }),
  }
}

export const buildSauceSettings = (opts: SauceServiceSettings = {}) => {
  return {
    // Your cloud service username.
    user: opts.user,
    // Your cloud service access key or secret key.
    key: opts.key,

    ...(existy(opts.headless) && {
      headless: opts.headless,
    }),
    // If you don't provide the region, it defaults to `us`.
    ...(opts.region && {
      region: opts.region,
    }),
    // TODO: Increase for real device support
    // connectionRetryTimeout: 180000,
    services: [
      ['sauce', {
        // This service will automatically push the error stack to Sauce Labs
        // when a test fails. By default it will only push the first 5 lines,
        // but if needed this can be changed. Be aware that more lines will
        // result in more WebDriver calls which might slow down the execution.
        ...(existy(opts.maxErrorStackLength) && {
          maxErrorStackLength: opts.maxErrorStackLength,
        }),
        // If `true` this options uploads all WebdriverIO log files to the Sauce
        // Labs platform for further inspection. Make sure you have
        // [`outputDir`](https://webdriver.io/docs/options#outputdir) set in
        // your wdio config to write logs into files, otherwise data will be
        // streamed to stdout and can't get uploaded.
        ...(existy(opts.uploadLogs) && {
          uploadLogs: opts.uploadLogs,
        }),
        // If you want WebdriverIO to automatically spin up a
        // [Sauce Connect](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy)
        // tunnel, you just need to set `sauceConnect: true`
        ...(existy(opts.sauceConnect) && {
          sauceConnect: opts.sauceConnect,
        }),
        ...(opts.sauceConnect && {
          sauceConnectOpts: {
            noAutodetect: true,
            ...(opts.tunnelName && {
              tunnelName: opts.tunnelName,
            }),
            ...(opts.tunnelOwner && {
              tunnelOwner: opts.tunnelOwner,
            }),
          },
        }),
      }]
    ],
  }
}

export const setupSauceConfig = ({
  envs,
  ...opts
}: SauceServiceSettings & { envs?: Envs } = {}) => {
  const values = parseSauceServiceSettings(envs)
  const settings = buildSauceSettings({
    ...values,
    ...opts,
  })

  return {
    ...settings,
  }
}

/**
 * Parse Sauce Capabilities
 *
 * @param envs - environment
 * @returns the settings parsed out of that environment
 */
export const parseSauceCapabilities = (envs: Envs = {}): SauceCapabilityValues => {
  return {
    // Valid values are `PORTRAIT` and `LANDSCAPE`.
    ...(existy(envs.SAUCE_DEVICE_ORIENTATION) && {
      deviceOrientation: envs.SAUCE_DEVICE_ORIENTATION,
    }),
    ...(existy(envs.SAUCE_APPIUM_VERSION) && {
      appiumVersion: envs.SAUCE_APPIUM_VERSION,
    }),
    // Options are: `tablet` and `phone`.
    ...(existy(envs.SAUCE_DEVICE_TYPE) && {
      deviceType: envs.SAUCE_DEVICE_TYPE,
    }),
    ...(existy(envs.SAUCE_OTHER_APPS) && {
      otherApps: envs.SAUCE_OTHER_APPS,
    }),
    ...(existy(parseWhole(envs, 'SAUCE_MAX_DURATION', 1800)) && {
      maxDuration: parseWhole(envs, 'SAUCE_MAX_DURATION', 1800)
    }),
    ...(existy(parseBool(envs, 'SAUCE_TABLET_ONLY', false)) && {
      tabletOnly: parseBool(envs, 'SAUCE_TABLET_ONLY', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_PHONE_ONLY', false)) && {
      phoneOnly: parseBool(envs, 'SAUCE_PHONE_ONLY', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_PRIVATE_DEVICES_ONLY', false)) && {
      privateDevicesOnly: parseBool(envs, 'SAUCE_PRIVATE_DEVICES_ONLY', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_PUBLIC_DEVICES_ONLY', false)) && {
      publicDevicesOnly: parseBool(envs, 'SAUCE_PUBLIC_DEVICES_ONLY', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_CARRIER_CONNECTIVITY_ONLY', false)) && {
      carrierConnectivityOnly: parseBool(envs, 'SAUCE_CARRIER_CONNECTIVITY_ONLY', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_RESIGNING_ENABLED', true)) && {
      resigningEnabled: parseBool(envs, 'SAUCE_RESIGNING_ENABLED', true),
    }),
    ...(existy(parseBool(envs, 'SAUCE_IMAGE_INJECTION_ENABLED', false)) && {
      sauceLabsImageInjectionEnabled: parseBool(envs, 'SAUCE_IMAGE_INJECTION_ENABLED', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_BYPASS_SCREENSHOT_RESTRICTION', false)) && {
      sauceLabsBypassScreenshotRestriction: parseBool(envs, 'SAUCE_BYPASS_SCREENSHOT_RESTRICTION', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_ALLOW_TOUCH_ID_ENROLL', false)) && {
      allowTouchIdEnroll: parseBool(envs, 'SAUCE_ALLOW_TOUCH_ID_ENROLL', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_ENABLE_ANIMATIONS', false)) && {
      enableAnimations: parseBool(envs, 'SAUCE_ENABLE_ANIMATIONS', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_AUDIO_CAPTURE', false)) && {
      audioCapture: parseBool(envs, 'SAUCE_AUDIO_CAPTURE', false),
    }),
    ...(existy(parseBool(envs, 'SAUCE_GROUP_FOLDER_REDIRECT_ENABLED', false)) && {
      groupFolderRedirectEnabled: parseBool(envs, 'SAUCE_GROUP_FOLDER_REDIRECT_ENABLED', false),
    }),
    ...(existy(envs.SAUCE_NETWORK_CAPTURE) && {
      networkCapture: parseBool(envs, 'SAUCE_NETWORK_CAPTURE', undefined),
    }),
    ...(existy(envs.SAUCE_SETUP_DEVICE_LOCK) && {
      setupDeviceLock: parseBool(envs, 'SAUCE_SETUP_DEVICE_LOCK', undefined),
    }),
    ...(existy(envs.SAUCE_CUSTOM_LOG_FILES) && {
      customLogFiles: parseList(envs, 'SAUCE_CUSTOM_LOG_FILES') as string[],
    }),
    ...(existy(parseBool(envs, 'SAUCE_SYSTEM_ALERTS_DELAY_ENABLED', false)) && {
      systemAlertsDelayEnabled: parseBool(envs, 'SAUCE_SYSTEM_ALERTS_DELAY_ENABLED', false),
    }),
    ...(existy(envs.SAUCE_NAME) && {
      name: envs.SAUCE_NAME,
    }),
    ...(existy(envs.SAUCE_BUILD) && {
      build: envs.SAUCE_BUILD,
    }),
    // customData,
    ...(existy(envs.SAUCE_VISIBILITY) && {
      visibility: envs.SAUCE_VISIBILITY,
    }),
    ...(existy(parseBool(envs, 'SAUCE_RECORD_VIDEO', true)) && {
      recordVideo: parseBool(envs, 'SAUCE_RECORD_VIDEO', true),
    }),
    ...(existy(parseBool(envs, 'SAUCE_VIDEO_UPLOAD_ON_PASS', true)) && {
      videoUploadOnPass: parseBool(envs, 'SAUCE_VIDEO_UPLOAD_ON_PASS', true),
    }),
    ...(existy(parseBool(envs, 'SAUCE_RECORD_SCREENSHOTS', true)) && {
      recordScreenshots: parseBool(envs, 'SAUCE_RECORD_SCREENSHOTS', true),
    }),
    ...(existy(parseBool(envs, 'SAUCE_RECORD_LOGS', true)) && {
      recordLogs: parseBool(envs, 'SAUCE_RECORD_LOGS', true),
    }),
    ...(existy(parseWhole(envs, 'SAUCE_PRIORITY', 0)) && {
      priority: parseWhole(envs, 'SAUCE_PRIORITY', 0)
    }),
    ...(existy(envs.SAUCE_TIME_ZONE) && {
      timeZone: envs.SAUCE_TIME_ZONE,
    }),
    ...(existy(parseBool(envs, 'SAUCE_AUTO_LAUNCH', true)) && {
      autoLaunch: parseBool(envs, 'SAUCE_AUTO_LAUNCH', true)
    }),
    ...(existy(parseWhole(envs, 'SAUCE_NEW_COMMAND_TIMEOUT', 60)) && {
      newCommandTimeout: parseWhole(envs, 'SAUCE_NEW_COMMAND_TIMEOUT', 60)
    }),
    ...(existy(parseBool(envs, 'SAUCE_NO_RESET', false)) && {
      noReset: parseBool(envs, 'SAUCE_NO_RESET', false)
    }),

    ...(existy(envs.SAUCE_BROWSER_NAME) && {
      browserName: envs.SAUCE_BROWSER_NAME,
    }),
    ...(existy(envs.SAUCE_BROWSER_VERSION) && {
      browserVersion: envs.SAUCE_BROWSER_VERSION,
    }),
    ...(existy(envs.SAUCE_PLATFORM_NAME) && {
      platformName: envs.SAUCE_PLATFORM_NAME,
    }),

    ...(existy(envs.SAUCE_CHROMEDRIVER_VERSION) && {
      chromedriverVersion: envs.SAUCE_CHROMEDRIVER_VERSION,
    }),
    ...(existy(envs.SAUCE_GECKODRIVER_VERSION) && {
      geckodriverVersion: envs.SAUCE_GECKODRIVER_VERSION,
    }),
    ...(existy(parseBool(envs, 'SAUCE_AVOID_PROXY', false)) && {
      avoidProxy: parseBool(envs, 'SAUCE_AVOID_PROXY', false)
    }),
    ...(existy(parseBool(envs, 'SAUCE_EXTENDED_DEBUGGING', false)) && {
      extendedDebugging: parseBool(envs, 'SAUCE_EXTENDED_DEBUGGING', false)
    }),
    ...(existy(parseBool(envs, 'SAUCE_CAPTURE_PERFORMANCE', false)) && {
      capturePerformance: parseBool(envs, 'SAUCE_CAPTURE_PERFORMANCE', false)
    }),
    // screenResolution: '1600x1200',
    ...(existy(parseWhole(envs, 'SAUCE_COMMAND_TIMEOUT', 300)) && {
      commandTimeout: (() => {
        const commandTimeout = parseWhole(envs, 'SAUCE_COMMAND_TIMEOUT', 300)
        return commandTimeout > 600 ? 600 : commandTimeout
      })()
    }),
    ...(existy(parseWhole(envs, 'SAUCE_IDLE_TIMEOUT', 90)) && {
      idleTimeout: (() => {
        const idleTimeout = parseWhole(envs, 'SAUCE_IDLE_TIMEOUT', 90)
        return idleTimeout > 1000 ? 1000 : idleTimeout
      })()
    }),

    ...(existy(envs.SAUCE_DEVICE_NAME) && {
      deviceName: envs.SAUCE_DEVICE_NAME,
    }),
    ...(existy(envs.SAUCE_AUTOMATION_NAME) && {
      automationName: envs.SAUCE_AUTOMATION_NAME,
    }),

    ...(existy(envs.SAUCE_PRE_RUN_EXECUTABLE) && {
      preExecutable: envs.SAUCE_PRE_RUN_EXECUTABLE,
    }),
    ...(existy(envs.SAUCE_PRE_RUN_ARGS) && {
      preArgs: envs.SAUCE_PRE_RUN_ARGS,
    }),
    ...(existy(envs.SAUCE_PRE_RUN_BACKGROUND) && {
      preBackground: envs.SAUCE_PRE_RUN_BACKGROUND,
    }),
    ...(existy(envs.SAUCE_PRE_RUN_TIMEOUT) && {
      preTimeout: envs.SAUCE_PRE_RUN_TIMEOUT,
    }),
  }
}

/**
 * Parse Android Emulator Sauce Capabilities
 *
 * @param envs - environment
 * @returns the settings parsed out of that environment
 */
export const parseSauceAndroidCapabilities = (envs: Envs = {}): SauceCapabilityValues => {
  return {
    ...(existy(envs.ANDROID_PLATFORM_NAME) ?
      {
        platformName: envs.ANDROID_PLATFORM_NAME,
      } :
      {
        platformName: 'Android',
      }),
    ...(existy(envs.ANDROID_SAUCE_DEVICE_NAME) ?
      {
        deviceName: envs.ANDROID_SAUCE_DEVICE_NAME,
      } :
      {
        deviceName: 'Galaxy S([5-9]).*',
      }),
    ...(existy(envs.ANDROID_PLATFORM_VERSION) && {
      platformVersion: envs.ANDROID_PLATFORM_VERSION,
    }),
    ...(existy(envs.ANDROID_BROWSER_NAME) ?
      {
        browserName: envs.ANDROID_BROWSER_NAME,
      } :
      {
        browserName: 'Android',
      }),
  }
}

/**
 * Build Sauce Android Emulator Capabilities
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildSauceAndroidCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    // This is mandatory for Android Emulators and iOS Simulators.
    // You can find the available versions in saucelabs
    // [Platform Configurator](https://saucelabs.com/platform/platform-configurator).
    ...(existy(opts.platformVersion) && {
      'appium:platformVersion': opts.platformVersion,
    }),
    sauceOptions: {
    }
  }
}

/**
 * Parse iOS Sauce Capabilities for Real Devices
 *
 * @param envs - environment
 * @returns the settings parsed out of that environment
 */
export const parseSauceAndroidRealDeviceCapabilities = (envs: Envs = {}): SauceCapabilityValues => {
  return {
    ...(existy(envs.ANDROID_BROWSER_NAME) && {
      browserName: envs.ANDROID_BROWSER_NAME,
    }),
    ...(existy(envs.ANDROOID_BROWSER_VERSION) && {
      browserVersion: envs.ANDROID_BROWSER_VERSION,
    }),
    ...(existy(envs.ANDROID_PLATFORM_NAME) ?
      {
        platformName: envs.ANDROID_PLATFORM_NAME,
      } :
      {
        platformName: 'Android',
      }),
    ...(existy(envs.ANDROID_SAUCE_APP) && {
      app: envs.ANDROID_SAUCE_APP,
    }),
    ...(existy(envs.ANDROID_SAUCE_DEVICE_NAME) ?
      {
        deviceName: envs.ANDROID_SAUCE_DEVICE_NAME,
      } :
      {
        deviceName: 'Galaxy S([5-9]).*',
      }),
    ...(existy(envs.ANDROID_PLATFORM_VERSION) && {
      platformVersion: envs.ANDROID_PLATFORM_VERSION,
    }),
    ...(existy(envs.ANDROID_AUTOMATION_NAME) ?
      {
        automationName: envs.ANDROID_AUTOMATION_NAME,
      } :
      {
        automationName: 'UiAutomator2',
      }),
    ...(existy(envs.APP_PACKAGE) && {
      appPackage: envs.APP_PACKAGE,
    }),
    ...(existy(envs.APP_ACTIVITY) && {
      appActivity: envs.APP_ACTIVITY,
    }),
    ...(existy(envs.ANDROID_DEVICE_ORIENTATION) && {
      deviceOrientation: envs.ANDROID_DEVICE_ORIENTATION,
    }),
    ...(existy(parseBool(envs, 'ANDROID_NO_RESET', false)) && {
      noReset: parseBool(envs, 'ANDROID_NO_RESET', false)
    }),
    ...(existy(envs.ANDROID_SAUCE_TAGS) && {
      tags: envs.ANDROID_SAUCE_TAGS.split('|'),
    }),
    ...(existy(parseWhole(envs, 'ANDROID_SAUCE_MAX_DURATION', 1800)) && {
      maxDuration: parseWhole(envs, 'ANDROID_SAUCE_MAX_DURATION', 1800)
    }),
    ...(existy(parseWhole(envs, 'ANDROID_SAUCE_COMMAND_TIMEOUT', 300)) && {
      commandTimeout: parseWhole(envs, 'ANDROID_SAUCE_COMMAND_TIMEOUT', 300)
    }),
    ...(existy(parseWhole(envs, 'ANDROID_SAUCE_IDLE_TIMEOUT', 90)) && {
      idleTimeout: parseWhole(envs, 'ANDROID_SAUCE_IDLE_TIMEOUT', 90)
    }),
  }
}

/**
 * Build Sauce Android Capabilities for Real Devices
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildSauceAndroidRealDeviceCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    // - The name of the browser to run the test on. If this capability is
    //   provided then the driver will try to start the test in Web context mode
    //   (Native mode is applied by default). Read Automating hybrid apps for
    //   more details. Usually equals to chrome.
    //   Name of mobile web browser to automate. Should be an empty string if
    //   automating an app instead.
    // - Choices are 'Chrome', 'Chromium', or 'Browser'.
    // - When testing a native mobile app, the value for `browserName` is an
    //   empty string.
    // ...(existy(opts.browserName) && {
    //   browserName: opts.browserName,
    // }),

    // ...(existy(opts.browserVersion) && {
    //   browserVersion: opts.browserVersion,
    // }),

    // - Could be set to ios. Appium itself is not strict about this capability
    //   value if automationName is provided, so feel free to assign it to any
    //   supported platform name if this is needed, for example, to make
    //   Selenium Grid working.
    // - NOTE: `browserName` and `platformName` are frequently used in Appium
    //   tests, but are W3C capabilities so they are not prepended with `appium`.
    // platformName,

    // - Full path to the application to be tested (the app must be located on
    //   the same machine where the server is running). Both .apk and .apks
    //   application extensions are supported. Could also be an URL to a remote
    //   location. If neither of the app, `appPackage` or `browserName` capabilities
    //   are provided then the driver starts from the Dashboard and expects the
    //   test knows what to do next. Do not provide both app and `browserName`
    //   capabilities at once.
    // - The absolute local path _or_ remote http URL to a `.apk` file
    //   or `.apks` file (Android App Bundle), or a `.zip` file containing one
    //   of these. Appium will attempt to install this ap binary on the
    //   appropriate device first.
    // - Note that this capability is not required for Android if you specify
    //   `appPackage` and `appActivity` capabilities.
    // - `UiAutomator2` allow to start the session without `app` or
    //   `appPackage`.
    // - Incompatible with `browserName`.
    // ...(existy(opts.app) && {
    //   'appium:app': opts.app,
    // }),

    // -  The kind of mobile device or emulator to use. On Android
    //   this capability is currently ignored, though it remains required.
    // 'appium:deviceName': deviceName,

    // - The platform version of an emulator or a real device. This capability
    //   is used for device autodetection if `udid` is not provided

    // This is optional for Real Devices and you can use this for
    // [dynamic device allocation](https://docs.saucelabs.com/mobile-apps/supported-devices/#static-and-dynamic-device-allocation)
    // to specify incremental versions (e.g., `15.1`) or major versions (e.g.,
    // `15`). By setting a major version, you'd have access to all devices
    // running incremental versions (`15.1`, `15.2`, `15.2.1`,
    // `15.4.4`). This also extends to minor and point versions (e.g.,
    // specifying `15.4` will match `15.4.0`, `15.4.1`).
    ...(existy(opts.platformVersion) && {
      'appium:platformVersion': opts.platformVersion,
    }),

    // 'appium:automationName': automationName,

    // All these capabilities are optional. If they are not set explicitly
    //   then Appium tries to auto detect them by reading their values from the
    //   APK manifest. Although, if the application under test is supposed to be
    //   already installed on the device (`noReset=true`) then at least
    //   `appActivity` and `appPackage` options are required to be set, since no
    //   package manifest is available in such case. If you don't set
    //   `appWaitPackage` and `appWaitActivity` explicitly then these are
    //   getting assigned to `appPackage`/`appActivity` values automatically.
    //   For more details check on the implementation of
    //   `packageAndLaunchActivityFromManifest` method in the
    //   [appium-adb](https://github.com/appium/appium-adb/blob/master/lib/tools/android-manifest.js)
    //   package.

    // - The identifier of the application package
    // - Application package identifier to be started. If not provided then
    //   UiAutomator2 will try to detect it automatically from the package
    //   provided by the app capability. Read How To Troubleshoot Activities
    //   Startup for more details
    ...(existy(opts.appPackage) && {
      'appium:appPackage': opts.appPackage,
    }),

    // - The name of the main application activity
    // - Main application activity identifier. If not provided then UiAutomator2
    //   will try to detect it automatically from the package provided by the
    //   app capability. Read How To Troubleshoot Activities Startup for more
    //   details
    ...(existy(opts.appActivity) && {
      'appium:appActivity': opts.appActivity,
    }),
  }
}

/**
 * Parse iOS Simulator Sauce Capabilities
 *
 * @param envs - environment
 * @returns the settings parsed out of that environment
 */
export const parseSauceIosCapabilities = (envs: Envs = {}): SauceCapabilityValues => {
  return {
    ...(existy(envs.IOS_PLATFORM_NAME) ?
      {
        platformName: envs.IOS_PLATFORM_NAME,
      } :
      {
        platformName: 'iOS',
      }),
    ...(existy(envs.IOS_SAUCE_DEVICE_NAME) ?
      {
        deviceName: envs.IOS_SAUCE_DEVICE_NAME,
      } :
      {
        deviceName: 'iPhone 11 Simulator',
      }),
    ...(existy(envs.IOS_PLATFORM_VERSION) && {
      platformVersion: envs.IOS_PLATFORM_VERSION,
    }),
    ...(existy(envs.IOS_BROWSER_NAME) ?
      {
        browserName: envs.IOS_BROWSER_NAME,
      } :
      {
        browserName: 'Safari',
      }),
  }
}

/**
 * Build Sauce iOS Simulator Capabilities
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildSauceIosCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {

    // This is mandatory for Android Emulators and iOS Simulators.
    // You can find the available versions in saucelabs
    // [Platform Configurator](https://saucelabs.com/platform/platform-configurator).
    ...(existy(opts.platformVersion) && {
      'appium:platformVersion': opts.platformVersion,
    }),
    sauceOptions: {
    }
  }
}

/**
 * Parse iOS Sauce Capabilities for Real Devices
 *
 * @param envs - environment
 * @returns the settings parsed out of that environment
 */
export const parseSauceIosRealDeviceCapabilities = (envs: Envs = {}): SauceCapabilityValues => {
  return {
    ...(existy(envs.IOS_BROWSER_NAME) && {
      browserName: envs.IOS_BROWSER_NAME,
    }),
    ...(existy(envs.IOS_BROWSER_VERSION) && {
      browserVersion: envs.IOS_BROWSER_VERSION,
    }),
    ...(existy(envs.IOS_PLATFORM_NAME) ?
      {
        platformName: envs.IOS_PLATFORM_NAME,
      } :
      {
        platformName: 'iOS',
      }),
    ...(existy(envs.IOS_SAUCE_APP) && {
      app: envs.IOS_SAUCE_APP,
    }),
    ...(existy(envs.IOS_SAUCE_DEVICE_NAME) ?
      {
        deviceName: envs.IOS_SAUCE_DEVICE_NAME,
      } :
      {
        deviceName: 'iPhone ([12]|[7-8]|X.*).*',
      }),
    ...(existy(envs.IOS_PLATFORM_VERSION) && {
      platformVersion: envs.IOS_PLATFORM_VERSION,
    }),
    ...(existy(parseBool(envs, 'AUTO_ACCEPT_ALERTS', false)) && {
      autoAcceptAlerts: parseBool(envs, 'AUTO_ACCEPT_ALERTS', false)
    }),
    ...(existy(envs.IOS_DEVICE_ORIENTATION) && {
      deviceOrientation: envs.IOS_DEVICE_ORIENTATION,
    }),
    ...(existy(parseBool(envs, 'IOS_NO_RESET', false)) && {
      noReset: parseBool(envs, 'IOS_NO_RESET', false)
    }),
    ...(existy(envs.IOS_SAUCE_TAGS) && {
      tags: envs.IOS_SAUCE_TAGS.split('|'),
    }),
    ...(existy(parseWhole(envs, 'IOS_SAUCE_MAX_DURATION', 1800)) && {
      maxDuration: parseWhole(envs, 'IOS_SAUCE_MAX_DURATION', 1800)
    }),
    ...(existy(parseWhole(envs, 'IOS_SAUCE_COMMAND_TIMEOUT', 300)) && {
      commandTimeout: parseWhole(envs, 'IOS_SAUCE_COMMAND_TIMEOUT', 300)
    }),
    ...(existy(parseWhole(envs, 'IOS_SAUCE_IDLE_TIMEOUT', 90)) && {
      idleTimeout: parseWhole(envs, 'IOS_SAUCE_IDLE_TIMEOUT', 90)
    }),
  }
}

/**
 * Build Sauce iOS Capabilities for Real Devices
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildSauceIosRealDeviceCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    // - The name of the browser to run the test on. If this capability is
    //   provided then the driver will try to start the test in Web context mode
    //   (Native mode is applied by default). Read Automating hybrid apps for
    //   more details. Usually equals to `safari`.
    // ...(existy(opts.browserName) && {
    //   browserName: opts.browserName,
    // }),

    // ...(existy(opts.browserVersion) && {
    //   browserVersion: opts.browserVersion,
    // }),

    // - Could be set to ios. Appium itself is not strict about this capability
    //   value if automationName is provided, so feel free to assign it to any
    //   supported platform name if this is needed, for example, to make
    //   Selenium Grid working.
    // - NOTE: `browserName` and `platformName` are frequently used in Appium
    //   tests, but are W3C capabilities so they are not prepended with `appium`.
    // platformName,

    // - Full path to the application to be tested (the app must be located on
    //   the same machine where the server is running). .ipa and .app
    //   application extensions are supported. Zipped .app bundles are supported
    //   as well. Could also be an URL to a remote location. If neither of the
    //   `app` or `bundleId` capabilities are provided then the driver starts from
    //   the Home screen and expects the test to know what to do next. Do not
    //   provide both `app` and `browserName` capabilities at once.
    // - Path to the .ipa, .zip, or bundle id for an already running application.
    // ...(existy(opts.app) && {
    //   'appium:app': opts.app,
    // }),

    // - The name of the device under test. Consider setting `udid` for real
    //   devices and use this one for Simulator selection instead
    // - `iPhone Simulator`, `iPad Simulator`, `iPhone Retina 4-inch`, etc....
    //   On iOS, this should be one of the valid devices returned by instruments
    //   with `instruments -s devices` or xctrace with `xcrun xctrace list
    //   devices` (since Xcode 12).
    // - NOTE: `deviceName` and `platformVersion`: if you specify a unique
    //   combination of device name and platform version, Appium will be able to
    //   find a unique simulator that matches your requirement, and in this case
    //   you don't need to specify the `udid`.
    // 'appium:deviceName': deviceName,

    // - The platform version of an emulator or a real device. This capability
    //   is used for device autodetection if `udid` is not provided

    // This is optional for Real Devices and you can use this for
    // [dynamic device allocation](https://docs.saucelabs.com/mobile-apps/supported-devices/#static-and-dynamic-device-allocation)
    // to specify incremental versions (e.g., `15.1`) or major versions (e.g.,
    // `15`). By setting a major version, you'd have access to all devices
    // running incremental versions (`15.1`, `15.2`, `15.2.1`,
    // `15.4.4`). This also extends to minor and point versions (e.g.,
    // specifying `15.4` will match `15.4.0`, `15.4.1`).
    ...(existy(opts.platformVersion) && {
      'appium:platformVersion': opts.platformVersion,
    }),

    // - Accept all iOS alerts automatically if they pop up. This includes
    //   privacy access permission alerts (e.g., location, contacts, photos).
    //   Default is `false`.
    ...(existy(opts.autoAcceptAlerts) && {
      'appium:autoAcceptAlerts': opts.autoAcceptAlerts,
    }),
  }
}

/**
 * Parse Safari Sauce Capabilities
 *
 * @param envs - environment
 * @returns the settings parsed out of that environment
 */
export const parseSauceSafariCapabilities = (envs?: Envs): SauceCapabilityValues => {
  return {
  }
}

/**
 * Build Sauce Safari Capabilities
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildSauceSafariCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    sauceOptions: {
    }
  }
}

/**
 * Parse Chrome Sauce Capabilities
 *
 * @param envs - environment
 * @returns the settings parsed out of that environment
 */
export const parseSauceChromeCapabilities = (envs?: Envs): SauceCapabilityValues => {
  return {
  }
}

/**
 * Build Sauce Chrome Capabilities
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildSauceChromeCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    sauceOptions: {
    }
  }
}

/**
 * Parse Firefox Sauce Capabilities
 *
 * @param envs - environment
 * @returns the settings parsed out of that environment
 */
export const parseSauceFirefoxCapabilities = (envs?: Envs): SauceCapabilityValues => {
  return {
  }
}

/**
 * Build Sauce Chrome Capabilities
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildSauceFirefoxCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    sauceOptions: {
    }
  }
}

//  ___         _   _              ___
// |   \ ___ __| |_| |_ ___ _ __  | _ )_ _ _____ __ _____ ___ _ _
// | |) / -_|_-< / /  _/ _ \ '_ \ | _ \ '_/ _ \ V  V (_-</ -_) '_|
// |___/\___/__/_\_\\__\___/ .__/ |___/_| \___/\_/\_//__/\___|_|
//                         |_|
//
// Desktop Browser Capabilities

/**
 * The W3C WebDriver primary test configuration settings for Sauce Labs desktop
 * browser tests and mobile tests
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildW3CWebDriverCapabilitiesRequired = (opts: SauceCapabilityValues = {}) => {
  return {
    ...(existy(opts.browserName) && {
      browserName: opts.browserName,
    }),
    ...(existy(opts.browserVersion) && {
      browserVersion: opts.browserVersion,
    }),
    ...(existy(opts.platformName) && {
      platformName: opts.platformName,
    }),
  }
}

/**
 * Optional, Sauce-compatible W3C WebDriver specification capabilities you can
 * add to your tests.
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildW3CWebDriverBrowserCapabilitiesOptional = (opts: SauceCapabilityValues = {}) => {
  return {
    // Indicates whether untrusted and self-signed TLS certificates are
    // implicitly trusted on navigation for the duration of the session. The
    // default value is `false`.
    ...(existy(opts.acceptInsecureCerts) && {
      acceptInsecureCerts: opts.acceptInsecureCerts,
    }),
    // Defines the current session's page load strategy. none, eager, or normal
    ...(existy(opts.pageLoadStrategy) && {
      pageLoadStrategy: opts.pageLoadStrategy,
    }),
    // Defines the current session’s proxy configuration.
    ...(existy(opts.proxy) && {
      proxy: opts.proxy,
    }),
    // Describes the timeouts imposed on certain session operations.
    // Applicable timeouts can be found on the
    // [WebDriver W3C Specification Timeouts Table](https://w3c.github.io/webdriver/#timeouts).
    // See the [WebDriver W3C Specification](https://w3c.github.io/webdriver/#dfn-session-script-timeout)
    // for more information.
    ...(existy(opts.timeouts) && {
      timeouts: opts.timeouts,
    }),
    // Defines the current session's strict file interactability. This indicates
    // that interactabilty checks will be applied to File type input elements.
    // The default is `false`.
    ...(existy(opts.strictFileInteractability) && {
      strictFileInteractability: opts.strictFileInteractability,
    }),
    // Describes the current session's user prompt handler. The default value is
    // `dismiss and notify`. For a list of the allowed options:
    // - [WebDriver W3C Specification User Prompt Handler Table](https://w3c.github.io/webdriver/#dfn-user-prompt-handler).
    // - [WebDriver W3C Specification](https://w3c.github.io/webdriver/#dfn-unhandled-prompt-behavior)
    ...(existy(opts.unhandledPromptBehavior) && {
      unhandledPromptBehavior: opts.unhandledPromptBehavior,
    }),
  }
}

/**
 * Browser-specific optional capabilities you can add to the `sauce:options`
 * block of your test session creation code.
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into `sauce:options`
 */
export const buildDesktopBrowserCapabilitiesSauceSpecificOptional = (opts: SauceCapabilityValues = {}) => {
  return {
    // USE THIS FOR SPECIFYING A SPECIFIC POINT RELEASE
    //
    // If you find a bug that you determine is driver related, you can specify
    // the latest point release of the chrome driver that matches the browser
    // version.
    //
    // For example, Sauce Labs might default to `"88.0.4324.27"`, but there is a
    // bug fix in version `"88.0.4324.96"`, so you can specify that in your
    // test.
    ...(existy(opts.chromedriverVersion) && {
      chromedriverVersion: opts.chromedriverVersion,
    }),
    // Specifies the Firefox GeckoDriver version. The default geckodriver
    // version varies based on the version of Firefox specified. For a list of
    // geckodriver versions and the Firefox versions they support, see
    // [geckodriver Supported Platforms](https://firefox-source-docs.mozilla.org/testing/geckodriver/Support.html).
    ...(existy(opts.geckodriverVersion) && {
      geckodriverVersion: opts.geckodriverVersion,
    }),
    // Allows the browser to communicate directly with servers without going
    // through a proxy. By default, Sauce routes traffic from Internet Explorer
    // and Safari through an HTTP proxy server so that HTTPS connections with
    // self-signed certificates will work. The proxy server can cause problems
    // for some users, and this setting allows you to avoid it.
    //
    // NOTE: Any test run with a Sauce Connect tunnel has to use the proxy and
    // this flag will be ignored.
    //
    // NOTE: Safari and Internet Explorer
    ...(existy(opts.avoidProxy) && {
      avoidProxy: opts.avoidProxy,
    }),
    // Enables [Extended Debugging features](https://docs.saucelabs.com/insights/debug/).
    // This applies to Firefox and Chrome only. It records HAR files and console logs for both
    // of these browsers. In Chrome, it also enables network interception,
    // network and cpu throttling as well as access to network logs during the
    // session. It is required to be true for `capturePerformance`.
    //
    // NOTE: Firefox and Chrome Only
    ...(existy(opts.extendedDebugging) && {
      extendedDebugging: opts.extendedDebugging,
    }),
    // Enables Performance Capture feature. Sauce Performance Testing can be
    // enabled by setting both `extendedDebugging` and `capturePerformance` to
    // `true`.
    //
    // NOTE: Chrome Only
    ...(existy(opts.capturePerformance) && {
      capturePerformance: opts.capturePerformance,
    }),
    // Specifies the screen resolution to be used during your test session.
    // Default screen resolution for Sauce tests is `1024x768`.
    //
    // NOTE To specify the screen resolution on Windows, we recommend that you
    // set the `platformName` to Windows 8 or newer (e.g., Windows 10).
    ...(existy(opts.screenResolution) && {
      screenResolution: opts.screenResolution,
    }),
    // Sets command timeout in seconds. As a safety measure to prevent Selenium
    // crashes from making your tests run indefinitely, we limit how long
    // Selenium can take to run a command in our browsers. This is set to 300
    // seconds by default. The maximum command timeout value allowed is 600
    // seconds.
    ...(existy(opts.commandTimeout) && {
      commandTimeout: opts.commandTimeout,
    }),
    // Sets idle test timeout in seconds. As a safety measure to prevent tests
    // from running too long after something has gone wrong, we limit how long a
    // browser can wait for a test to send a new command. This is set to 90
    // seconds by default and limited to a maximum value of 1000 seconds.
    ...(existy(opts.idleTimeout) && {
      idleTimeout: opts.idleTimeout,
    }),
  }
}

//  __  __     _    _ _         _             _
// |  \/  |___| |__(_) |___    /_\  _ __ _ __(_)_  _ _ __
// | |\/| / _ \ '_ \ | / -_)  / _ \| '_ \ '_ \ | || | '  \
// |_|  |_\___/_.__/_|_\___| /_/ \_\ .__/ .__/_|\_,_|_|_|_|
//                                 |_|  |_|
// Mobile Appium Capabilities

/**
 * As the W3C WebDriver Protocol is supported in Appium v1.6.5 and higher, and
 * required for Appium v2.0 (currently in beta), we encourage and support using
 * it for your Appium mobile app tests.
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildMobileAppiumCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    // Identifies the name of the operating system the mobile device should be
    // running on. Values are not case-sensitive (i.e., `ios` is the same as
    // `iOS`). Valid values are `Android` and `iOS`.
    //
    // NOTE: Virtual and Real Devices
    ...(existy(opts.platformName) && {
      platformName: opts.platformName,
    }),
    // Allows you to set the name of the simulator, emulator, or real device you
    // want to use in the test.
    //
    // NOTE: MANDATORY for Virtual Devices
    // NOTE: OPTIONAL for Real Devices
    ...(existy(opts.deviceName) && {
      'appium:deviceName': opts.deviceName,
    }),
    // Allows you to set the automation engine that will be used.
    //
    // Emulators/Simulators:
    //
    // - **Android:** `UiAutomator2`, `Espresso`, `Flutter`
    // - **iOS:** `XCUITest`, `Flutter`
    //
    // Real Devices:
    //
    // - **Android:** `UiAutomator2`
    // - **iOS:** `XCUITest`
    ...(existy(opts.automationName) && {
      'appium:automationName': opts.automationName,
    }),
    // Identifies the browser to be used when automating with a mobile browser.
    //
    // - For Android the value needs to be `Chrome`.
    // - For iOS, the value needs to be `Safari`.
    //
    // NOTE: Virtual and Real Devices
    //
    // NOTE: If this capability is not provided for a virtual device, the
    // 'app' capability needs to be set. If none is set the test will throw an error.
    //
    // NOTE: This capability can be omitted for virtual devices if the
    // 'app' capability is set.
    //
    // NOTE: If this capability is not provided for a real device session and also the
    // 'app' capability is not provided then a real device session will automatically
    // default back to the default browser. This will be Chrome for Android and
    // Safari for iOS
    ...(existy(opts.browserName) && {
      browserName: opts.browserName,
    }),
    // Allows you to set a path to an `.ipa`, `.apk`, `.aab` or `.zip` file
    // containing the mobile app you want to test. This could be the location of
    // your app in App Storage. The remote location needs to be accessible from
    // the web, Sauce Connect can not access your internal file system where
    // apps are hosted.
    //
    // If this capability is not provided for a virtual device, the
    // 'browserName' capability needs to be set. If none is set the test will
    // throw an error.
    //
    // This capability can be omitted for virtual devices if the 'browserName'
    // capability is set.
    //
    // If this capability is not provided for a real device session and also the
    // 'browserName' capability is not provided then a real device session will
    // automatically default back to the default browser. This will be Chrome
    // for Android and Safari for iOS.
    //
    // NOTE: Virtual and Real Devices
    ...(existy(opts.app) && {
      'appium:app': opts.app,
    }),
    // Specifies the orientation of the screen during the test. Valid values are
    // `PORTRAIT` and `LANDSCAPE`.
    //
    // This capability is an Appium capability that needs to be pre-fixed with
    // `appium:` so it becomes `appium:orientation`. It can be used for virtual
    // device mobile tests and real device tests. The`appium:orientation`
    // capability will only flip the screen while the capability
    // `deviceOrientation` will flip the skin and the screen.
    //
    // NOTE: Virtual and Real Devices
    ...(existy(opts.deviceOrientation) && {
      'appium:orientation': opts.deviceOrientation,
    }),
    // For Virtual Devices: Set `noReset` to `true` when you execute multiple
    // tests on a single virtual device to keep the state it is in between
    // tests.
    //
    // For Real Devices: Set `noReset` to `true` to keep a device allocated to
    // you during the device cleaning process, as described under `cacheId`,
    // allowing you to continue testing on the same device. Default value is
    // `false`. To use `noReset`, you must pair it with `cacheId`.
    //
    // Android Virtual and Real Devices (`noReset` is set to `true`):
    //
    // - The app does not stop after a test/session.
    // - The app data will not be cleared between tests/sessions.
    // - Apk will not be uninstalled after a test/session.
    //
    // iOS Virtual (`noReset` set to `true`):
    //
    // - The app will not stop after a test/session.
    // - The app will not clear between tests/sessions.
    // - Apk will not be uninstalled after a test/session.
    //
    // iOS Real Devices: On iOS devices, the `noReset` value is permanently set
    // to `true` and cannot be overridden using `noReset:false`. If you check
    // your Appium logs, you'll see that the value is `true`, even though the
    // default setting technically is false. We've done this intentionally to
    // ensure that your post-test iOS device cleaning process is optimal and
    // secure
    //
    // NOTE: Virtual and Real Devices
    ...(existy(opts.noReset) && {
      'appium:noReset': opts.noReset,
    }),

    // TODO: Fill in docs and add env parsers
    // ...(existy(opts.autoWebview) && {
    //   'appium:autoWebview': opts.autoWebview,
    // }),
    // ...(existy(opts.includeSafariInWebviews) && {
    //   'appium:includeSafariInWebviews': opts.includeSafariInWebviews,
    // }),
    // ...(existy(opts.autoAcceptAlerts) && {
    //   'appium:autoAcceptAlerts': opts.autoAcceptAlerts,
    // }),
    // ...(existy(opts.autoDismissAlerts) && {
    //   'appium:autoDismissAlerts': opts.autoDismissAlerts,
    // }),
    // ...(existy(opts.autoGrantPermissions) && {
    //   'appium:autoGrantPermissions': opts.autoGrantPermissions,
    // }),
  }
}

/**
 * As the W3C WebDriver Protocol is supported in Appium v1.6.5 and higher, and
 * required for Appium v2.0 (currently in beta), we encourage and support using
 * it for your Appium mobile app tests.
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildMobileAppiumTimeoutCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    // Specifies the amount of time in seconds, in which the driver waits for a
    // new command from the client before assuming the client has stopped
    // sending requests. If there is no response during this time, the next
    // executed command on the Virtual/Real Device will time out. The default
    // value is 60 seconds while the maximum allowed value is not limited for
    // Virtual Devices and is limited to 90 seconds for Real Devices.

    //
    // NOTE: Virtual and Real Devices
    // NOTE: Android and iOS
    ...(existy(opts.newCommandTimeout) && {
      'appium:newCommandTimeout': opts.newCommandTimeout,
    }),

    // TODO: Fill in docs and add env parsers
    // ...(existy(opts.autoWebviewTimeout) && {
    //   'appium:autoWebviewTimeout': opts.autoWebviewTimeout,
    // }),
    // ...(existy(opts.webkitResponseTimeout) && {
    //   'appium:webkitResponseTimeout': opts.webkitResponseTimeout,
    // }),
    // ...(existy(opts.webviewConnectTimeout) && {
    //   'appium:webviewConnectTimeout': opts.webviewConnectTimeout,
    // }),
  }
}

/**
 * `WebDriverAgent` is a [WebDriver server](https://w3c.github.io/webdriver/)
 * implementation for iOS that is used to remote control iOS devices. It is
 * developed for end-to-end testing and is adopted via the [XCUITest
 * driver](https://github.com/appium/appium-xcuitest-driver). The
 * `WebDriverAgent` has it's own timeout capabilities that can be controlled by
 * the driver during the test session. The most important ones are explained
 * below.
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into a `capabilities` entry
 */
export const buildMobileAppiumIosWebDriverAgentTimeoutCapabilities = (opts: SauceCapabilityValues = {}) => {
  return {
    // TODO: Fill in docs and add env parsers
    // ...(existy(opts.wdaLaunchTimeout) && {
    //   'appium:wdaLaunchTimeout': opts.wdaLaunchTimeout,
    // }),
    // ...(existy(opts.wdaConnectionTimeout) && {
    //   'appium:wdaConnectionTimeout': opts.wdaConnectionTimeout,
    // }),
    // ...(existy(opts.waitForIdleTimeout) && {
    //   'appium:waitForIdleTimeout': opts.waitForIdleTimeout,
    // }),
    // ...(existy(opts.commandTimeouts) && {
    //   'appium:commandTimeouts': opts.commandTimeouts,
    // }),
  }
}

/**
 * Optional, Sauce-specific capabilities that you can use in your Appium tests.
 * They can be added to the `sauce:options` block of your session creation code.
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into `sauce:options`
 */
export const buildMobileAppAppiumCapabilitiesSauceSpecificOptional = (opts: SauceCapabilityValues = {}) => {
  return {
    // Specifies the orientation of the virtual skin and screen during the test.
    // Valid values are `PORTRAIT` and `LANDSCAPE`.
    //
    // NOTE: Virtual Devices Only
    ...(existy(opts.deviceOrientation) && {
      deviceOrientation: opts.deviceOrientation,
    }),
    // NOTE: Virtual Devices Only
    ...(existy(opts.customLogFiles) && {
      customLogFiles: opts.customLogFiles,
    }),
    // NOTE: Real Devices Only
    ...(existy(opts.setupDeviceLock) && {
      setupDeviceLock: opts.setupDeviceLock,
    }),
    // Specifies the Appium driver version you want to use. For most use cases,
    // setting the `appiumVersion` is unnecessary because Sauce Labs defaults to
    // the version that supports the broadest number of device combinations.
    // Sauce Labs advises against setting this property unless you need to test
    // a particular Appium feature or patch.
    //
    // NOTE: Virtual and Real Devices
    ...(existy(opts.appiumVersion) && {
      appiumVersion: opts.appiumVersion,
    }),
    // Specifies the type of device type to emulate. Options are: `tablet` and `phone`.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.deviceType) && {
      deviceType: opts.deviceType,
    }),
    // A dependent app that has already been uploaded to
    // [App Storage](https://docs.saucelabs.com/mobile-apps/app-storage/) will be
    // pre-installed on the device during the testing of the main app. You can
    // specify the app using its `storage:<fileId>` or
    // `storage:filename=<filename>` reference.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.otherApps) && {
      otherApps: opts.otherApps,
    }),
    // Use this capability to select only tablet devices for testing by setting
    // it to `true`.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.tabletOnly) && {
      tabletOnly: opts.tabletOnly,
    }),
    // Use this capability to select only phone devices by setting it to `true`.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.phoneOnly) && {
      phoneOnly: opts.phoneOnly,
    }),
    // If your pricing plan includes both private and public devices, use this
    // capability to request allocation of private devices only by setting it to
    // `true`.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.privateDevicesOnly) && {
      privateDevicesOnly: opts.privateDevicesOnly,
    }),
    // If your pricing plan includes both private and public devices, use this
    // capability to request allocation of public devices only by setting it to
    // `true`.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.publicDevicesOnly) && {
      publicDevicesOnly: opts.publicDevicesOnly,
    }),
    // Use this capability to allocate only devices connected to a carrier
    // network by setting it to `true`.
    //
    // NOTE: Real Devices Only
    // NOTE: Private Devices Only
    ...(existy(opts.carrierConnectivityOnly) && {
      carrierConnectivityOnly: opts.carrierConnectivityOnly,
    }),
    // Keeps the device allocated to you between test sessions and bypasses the
    // device cleaning process and session exit that occurs by default after
    // each test completes. Normally, you'd need to start over and reopen
    // another device. You'll need to launch your next test within 10 seconds of
    // your previous test ending to ensure that the same device will be
    // allocated for the test (not cleaned or reset).
    //
    // NOTE: For Android, if `noReset` is also set to `true`, the app under test
    // and its data will remain as-is on the device.
    //
    // NOTE: For iOS, changing `noReset` has no impact here. The app will not be
    // removed, will stay on the phone/tablet and will keep it's state. This is
    // caused by the re-signing process of the app.
    //
    // If you are running multiple test suites in parallel, the values for
    // `cacheId` should be unique for each suite (to avoid mixing up the
    // devices), and the value for `cacheId` must be the same for all test
    // methods that you want to run on the cached device. In addition, the app
    // and project ID used for the tests must remain the same, along with the
    // values for these capabilities:
    //
    // NOTE: Real Devices Only
    // NOTE: Does not come from envs
    ...(existy(opts.cacheId) && {
      cacheId: opts.cacheId,
    }),
    // Controls Sauce Labs default resigning (iOS) or instrumentation (Android)
    // of mobile apps installed on our devices. By default, this property is
    // always `true`, but it can be set to `false` for private devices to allow
    // testing of specific behaviors that are not permitted under the Sauce Labs
    // provisioning.
    //
    // NOTE: Real Devices Only
    // NOTE: Private Devices Only
    ...(existy(opts.resigningEnabled) && {
      resigningEnabled: opts.resigningEnabled,
    }),
    // Bypasses the restriction on taking screenshots for secure screens (i.e.,
    // secure text entry). `resigningEnabled` needs to be enabled if this is set
    // to `true`.
    //
    // NOTE: Real Devices Only
    // NOTE: Android Only
    ...(existy(opts.sauceLabsImageInjectionEnabled) && {
      sauceLabsImageInjectionEnabled: opts.sauceLabsImageInjectionEnabled,
    }),
    // Bypasses the restriction on taking screenshots for secure screens (i.e.,
    // secure text entry). `resigningEnabled` needs to be enabled if this is set
    // to `true`.
    //
    // NOTE: Real Devices Only
    // NOTE: Android Only
    ...(existy(opts.sauceLabsBypassScreenshotRestriction) && {
      sauceLabsBypassScreenshotRestriction: opts.sauceLabsBypassScreenshotRestriction,
    }),
    // Enables the interception of biometric input, allowing the test to
    // simulate Touch ID interactions (not a Sauce Labs-specific capability).
    // `resigningEnabled` needs to be enabled if this is set to `true`.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.allowTouchIdEnroll) && {
      allowTouchIdEnroll: opts.allowTouchIdEnroll,
    }),
    // Enables audio recording in your iOS and Android native mobile app tests.
    // The audio will be part of the **Test Results** page video file, which you
    // can play back and download in our built-in media player. The default
    // value is `false`.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.audioCapture) && {
      audioCapture: opts.audioCapture,
    }),
    // Enables mobile app instrumentation (Android or iOS) and recording of
    // HTTP/HTTPS network traffic for debugging purposes. API calls are
    // collected into a HAR file, which you can view and download from your
    // **Test Results** > **Network** tab console. The default value is `false`.
    //
    // NOTE: Real Devices Only
    ...(existy(opts.networkCapture) && {
      networkCapture: opts.networkCapture,
    }),
    // Enables the use of the app's private app container directory instead of
    // the shared app group container directory. For testing on the Real Device
    // Cloud, the app gets resigned, which is why the shared directory is not
    // accessible.
    //
    // NOTE: Real Devices Only
    // NOTE: iOS Only
    ...(existy(opts.groupFolderRedirectEnabled) && {
      groupFolderRedirectEnabled: opts.groupFolderRedirectEnabled,
    }),
    // Use this capability to enable animations for Android real devices by
    // setting it to `true`. By default, animations are disabled.
    //
    // NOTE: Real Devices Only
    // NOTE: Android Only
    ...(existy(opts.enableAnimations) && {
      enableAnimations: opts.enableAnimations,
    }),
    // Delays system alerts, such as alerts asking for permission to access the
    // camera, to prevent app crashes at startup. `resigningEnabled` needs to be
    // enabled if this is set to `true`.
    //
    // NOTE: Real Devices Only
    // NOTE: iOS Only
    ...(existy(opts.systemAlertsDelayEnabled) && {
      systemAlertsDelayEnabled: opts.systemAlertsDelayEnabled,
    }),
  }
}

//  ___         _   _              __       __  __     _    _ _
// |   \ ___ __| |_| |_ ___ _ __  / _|___  |  \/  |___| |__(_) |___
// | |) / -_|_-< / /  _/ _ \ '_ \ > _|_ _| | |\/| / _ \ '_ \ | / -_)
// |___/\___/__/_\_\\__\___/ .__/ \_____|  |_|  |_\___/_.__/_|_\___|
//                         |_|
// Desktop and Mobile

/**
 * Optional Sauce Labs-specific capabilities that you can use for any Sauce Labs
 * test. They must be added to the `sauce:options` block of your session
 * creation code.
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into `sauce:options`
 */
export const buildDesktopMobileCapabilitiesSauceSpecificOptional = (opts: SauceCapabilityValues = {}) => {
  return {
    // Records test names for jobs and make it easier to find individual tests.
    ...(existy(opts.name) && {
      name: opts.name,
    }),
    // Associates multiple jobs with a build number or app version, which will
    // then be displayed on both the **Test Results** dashboard and **Archive**
    // view.
    //
    // NOTE: Grouping Environment Releases
    ...(existy(opts.build) && {
      build: opts.build,
    }),
    // User-defined tags for grouping and filtering jobs on the Test Results
    // dashboard and Archive view. Tags can facilitate team collaboration.
    //
    // NOTE: Virtual and Real Devices
    ...(existy(opts.tags) && {
      tags: opts.tags,
    }),
    // Sets your Sauce Labs username for a test.
    //
    // You can either set `username` in capabilities or specify it in the Sauce
    // URL as Basic Authentication. For
    // [Visual Tests](https://docs.saucelabs.com/dev/test-configuration-options/#visual-testing)),
    // this must be set in capabilities.
    ...(existy(opts.username) && {
      username: opts.username,
    }),
    // Sets your Sauce Labs access key for the test.
    //
    // You can either set `accessKey` in capabilities or specify it in the Sauce
    // URL as Basic Authentication. For
    // [Visual Tests](https://docs.saucelabs.com/dev/test-configuration-options/#visual-testing),
    // this must be set in capabilities.
    ...(existy(opts.accessKey) && {
      accessKey: opts.accessKey,
    }),
    // User-defined custom data that will accept any valid JSON object.
    // e.g., `{release: '1.0', commit: '0k392a9dkjr', 'env': 'stage'}`
    //
    // NOTE: Desktop and Virtual Devices Only
    ...(existy(opts.customData) && {
      'custom-data': opts.customData,
    }),
    // We support several test/job result visibility levels, which control who
    // can view the test details. The visibility level for a test can be set
    // manually from the test results page
    //
    // NOTE: Desktop and Virtual Devices Only
    ...(existy(opts.visibility) && {
      public: opts.visibility,
    }),
    // Specify a Sauce Connect tunnel to establish connectivity with Sauce Labs
    // for your test. Tunnels allow you to test an app that is behind a firewall
    // or on your local machine by providing a secure connection to the Sauce
    // Labs platform.
    //
    // NOTE: Appium tests for the RDC using the W3C protocol MUST use
    // `tunnelName` instead of `tunnelIdentifier`.
    ...(existy(opts.tunnelName) && {
      tunnelName: opts.tunnelName,
    }),
    // If the tunnelName you've specified to establish connectivity with a Sauce
    // Labs test platform is a shared tunnel, and you are _not_ the user who
    // created the tunnel, you must identify the Sauce Labs user who did create
    // the tunnel in order to use it for your test.
    //
    ...(existy(opts.tunnelOwner) && {
      tunnelOwner: opts.tunnelOwner,
    }),
    // Use this to disable video recording. By default, Sauce Labs records a
    // video of every test you run. Disabling video recording can be useful for
    // debugging failing tests as well as having a visual confirmation that a
    // certain feature works (or still works). However, there is an added wait
    // time for screen recording during a test run.
    ...(existy(opts.recordVideo) && {
      recordVideo: opts.recordVideo,
    }),
    // Disables video upload for passing tests. videoUploadOnPass is an
    // alternative to recordVideo; it lets you discard videos for tests you've
    // marked as passing. It disables video post-processing and uploading that
    // may otherwise consume some extra time after your test is complete.
    ...(existy(opts.videoUploadOnPass) && {
      videoUploadOnPass: opts.videoUploadOnPass,
    }),
    // Disables step-by-step screenshots. In addition to capturing video, Sauce
    // Labs captures step-by-step screenshots of every test you run. Most users
    // find it very useful to get a quick overview of what happened without
    // having to watch the complete video. However, this feature may add some
    // extra time to your tests.
    ...(existy(opts.recordScreenshots) && {
      recordScreenshots: opts.recordScreenshots,
    }),
    // Disables log recording. By default, Sauce creates a log of all the
    // actions that you execute to create a report for the test run that lets
    // you troubleshoot test failures more easily. This option disables only the
    // recording of the log.json file; the selenium-server.log will still be
    // recorded.
    ...(existy(opts.recordLogs) && {
      recordLogs: opts.recordLogs,
    }),
  }
}

/**
 * The following are Sauce Labs-specific options that apply only to virtual
 * devices (desktop sessions, emulators and simulators). These options can be
 * added to the `sauce:options` block of your session creation code.
 *
 * @param opts - parsed settings to build from
 * @returns a slice to spread into `sauce:options`
 */
export const buildDesktopVirtualDeviceCapabilitiesSauceSpecificOptional = (opts: SauceCapabilityValues = {}) => {
  return {
    // Sets maximum test duration in seconds. As a safety measure to prevent
    // tests from running indefinitely, the default is 1,800 seconds (30
    // minutes) and the maximum is 10,800 seconds (three hours).
    //
    // NOTE: Desktop and Virtual Devices Only
    ...(existy(opts.maxDuration) && {
      maxDuration: opts.maxDuration,
    }),
    // Setting to prioritize jobs. If you have multiple new jobs waiting to
    // start (i.e., across a collection of sub-accounts), jobs with a lower
    // priority number take precedence over jobs with a higher number.
    //
    // So, for example, if you have multiple jobs simultaneously waiting to
    // start, we'll first attempt to find resources to start all the jobs with
    // priority `0`, then all the jobs with priority `1`, etc.
    //
    // When we run out of available virtual machines, or when you hit your
    // concurrency limit, any jobs not yet started will wait. Within each
    // priority level, jobs that have been waiting the longest take precedence
    //
    // NOTE: Desktop and Virtual Devices Only
    ...(existy(opts.priority) && {
      priority: opts.priority,
    }),
    // Allows you to set a custom time zone for your test based on a city name.
    // Most major cities are supported.
    //
    // Desktop VMs: Can be configured with custom time zones. This feature
    // should work on all operating systems, however, time zones on Windows VMs
    // are approximate. The time zone defaults to UTC. Look for the "principal
    // cities" examples on this
    // [list of UTC time offsets](https://en.wikipedia.org/wiki/List_of_UTC_time_offsets).
    // e.g., New_York, Los_Angeles
    //
    // iOS Virtual Devices: Can use this capability to change the time on the
    // Mac OS X VM, which will be picked up by the iOS simulator.
    //
    // Android Virtual Devices: This capability is not supported for Android
    // devices, but for Android 7.2 or later, there is a workaround. Use the
    // following ADB command to grant Appium notification read permission in
    // order to use the time zone capability:
    // 'adb shell cmd notification allow_listener'
    // 'io.appium.settings/io.appium.settings.NLService'
    //
    // NOTE: Most web apps serve localization content based on the computer's IP
    // Address, not the time zone set in the operating system. If you need to
    // simulate the computer being in a different location, you may need to set
    // up a proxy.
    //
    // NOTE: Desktop and Virtual Devices Only
    ...(existy(opts.timeZone) && {
      timeZone: opts.timeZone,
    }),

    // This refers to the pre-run executable that will first
    // upload the file to the Sauce Labs VM
    // prerun: 'storage:filename=mac_download.sh',

    // This refers to the pre-run executable that will first
    // upload the file to the Sauce Labs VM
    // prerun: 'storage:filename=windows_download.bat',

    // Map<Prerun, Object> prerun = new HashMap<>();
    // prerun.put(Prerun.EXECUTABLE, "sauce-storage:login.zip");
    // prerun.put(Prerun.ARGS, "--silent");
    // prerun.put(Prerun.ARGS, "-a");
    // prerun.put(Prerun.ARGS, "-q");
    // prerun.put(Prerun.BACKGROUND, true);

    // desired_capabilities['prerun'] = {
    //   'executable':'storage:filename=disable_fraud.sh',
    //   'background': 'false'
    // }

    // silent mode
    // "prerun": {
    //   "executable": "http://url.to/your/executable.exe",
    //   "args": [ "--silent", "-a", "-q" ],
    //   "background": true,
    //   "timeout": 120
    // }

    // NOTE: If you want to download a file that is only accessible on your
    // network, this won't work even if you have Sauce Connect running. This is
    // because the connection from the VM to your network is limited only to the
    // browsers and doesn't work on all outbound connections
    //
    // As part of your test, navigate to a site that contains your file and
    // download it automatically to the Downloads fil
    //
    // Windows = C:\Users\Administrator\Downloads
    // Mac = /Users/chef/Downloads
    // Linux = /home/chef/Downloads

    ...((opts.preExecutable || opts.preArgs || opts.preBackground) && {
      prerun: {
        ...(existy(opts.preExecutable) && {
          executable: opts.preExecutable,
        }),
        ...(existy(opts.preArgs) && {
          args: opts.preArgs,
        }),
        ...(existy(opts.preBackground) && {
          background: opts.preBackground,
        }),
        ...(existy(opts.preTimeout) && {
          timeout: opts.preTimeout,
        }),
      },
    }),
  }
}
