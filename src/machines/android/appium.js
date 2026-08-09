import {
  existy,
} from '../../utils'

// ## UiAutomator2 driver Requirements
//
// - [Android SDK Platform
//   tools](https://developer.android.com/studio/releases/platform-tools) must
//   be installed. [Android Studio IDE](https://developer.android.com/studio)
//   also provides a convenient UI to install and manage the tools.
// - ANDROID_HOME or ANDROID_SDK_ROOT [environment
//   variable](https://developer.android.com/studio/command-line/variables) must
//   be set
// - Java JDK must be installed and
//   [JAVA_HOME](https://www.baeldung.com/java-home-on-windows-7-8-10-mac-os-x-linux)
//   environment variable must be set. Android SDK below API 30 requires Java 8.
//   Android SDK 30 and above requires Java 9 or newer.
// - [Emulator](https://developer.android.com/studio/run/managing-avds) platform
//   image must be installed if you plan to run your tests on it. [Android
//   Studio IDE](https://developer.android.com/studio) also provides a
//   convenient UI to install and manage emulators.
// - Real Android devices must have [USB debugging
//   enabled](https://developer.android.com/studio/debug/dev-options) and should
//   be visible as `online` in `adb devices -l`output.
// - The minimum version of Android API must be 5.0 (API level 21) (6.0 is
//   recommended as version 5 has some known compatibility issues).

// ## Parallel Tests
//
// - It is possible to execute tests in parallel using UiAutomator2 driver.
//   Appium allows to do this on per-process (multiple server processes running
//   on different ports managing single session) or per-request basis (single
//   server process managing multiple sessions, more preferable, uses less
//   resources and ensures better control over running sessions).
//
// - Note: If you are not going to run your tests in parallel then consider
//   enabling the `--session-override` Appium server argument. It forces the
//   server to close all pending sessions before a new one could be opened,
//   which allows you to avoid possible issues with such sessions silently
//   running/expiring in the background.

// ### Important Real Device Capabilities
//
// - `udid`: The unique device id.
// - `systemPort`: Set a unique system port number for each parallel session.
//   Otherwise you might get a port conflict such as in [this
//   issue](https://github.com/appium/appium/issues/7745).
// - `chromedriverPort`: The unique chromedriver port if testing web views or
//   Chrome.
// - `mjpegServerPort`: Set a unique MJPEG server port for each parallel session
//   if you are going to record a video.
//
// ### Important Emulator Capabilities
//
// - `avd`: The unique emulator name.
// - `systemPort`: Set a unique system port number for each parallel session.
// - `chromedriverPort`: The unique chromedriver port (if testing web views or
//   Chrome).
// - `mjpegServerPort`: Set a unique MJPEG server port for each parallel session
//   if you are going to record a video.

export const buildActivitiesStartup = ({
  ...opts
} = {}) => {
  return {
    // https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/android/activity-startup.md

    // Appium needs to know package and activity names in order to properly
    //   initialize the application under test. This information is expected to
    //   be provided in driver capabilities and consists of the following keys:

    // `adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp'`

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

    // - The name of the application activity to wait for/which starts the first
    // - Identifier of the first activity that the application invokes. If not
    //   provided then equals to `appium:appActivity`. Read How To Troubleshoot
    //   Activities Startup for more details
    ...(existy(opts.appWaitActivity) && {
      'appium:appWaitActivity': opts.appWaitActivity,
    }),

    // - The id of the application package to wait for/which starts the first
    // - Identifier of the first package that is invoked first. If not provided
    //   then equals to `appium:appPackage`. Read How To Troubleshoot Activities
    //   Startup for more details
    ...(existy(opts.appWaitPackage) && {
      'appium:appWaitPackage': opts.appWaitPackage,
    }),

    // - Maximum amount of milliseconds to wait until the application under test
    //   is started (e. g. an activity returns the control to the caller). 20000
    //   ms by default. Read How To Troubleshoot Activities Startup for more
    //   details
    // - The maximum duration to wait until the `appWaitActivity` is focused in
    //   milliseconds (20000 by default)
    ...(existy(opts.appWaitDuration) && {
      'appium:appWaitDuration': opts.appWaitDuration,
    }),

    // - Whether to wait until Activity Manager returns the control to the
    //   calling process. By default the driver always waits until
    //   `appWaitDuration` is expired. Setting this capability to `false`
    //   effectively cancels this wait and unblocks the server loop as soon as
    //   `am` successfully triggers the command to start the activity.
    // - Whether to block until the app under test returns the control to the
    //   caller after its activity has been started by Activity Manager (true,
    //   the default value) or to continue the test without waiting for that
    //   (false).
    ...(existy(opts.appWaitForLaunch) && {
      'appium:appWaitForLaunch': opts.appWaitForLaunch,
    }),
  }
}

export const buildResetStrategy = ({
  ...opts
} = {}) => {
  // Android Reset Strategies
  // Default: Stop and clear app data after test.
  // https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/other/reset-strategies.md

  return {
    // - `fullReset`: Do not uninstall apk | Stop app, clear app data and
    //   uninstall apk before session starts and after test.
    // - Set `fullReset: true` if you would like to test against the app using
    //   different languages' resources.
    // - Being set to `true` always enforces the application under test to be
    //   fully uninstalled before starting a new session. `false` by default
    ...(existy(opts.fullReset) && {
      'appium:fullReset': opts.fullReset,
    }),

    // - `noReset`: Do not stop app, do not clear app data, and do not uninstall apk.
    // - Prevents the device to be reset before the session startup if set to
    //   `true`. This means that the application under test is not going to be
    //   terminated neither its data cleaned. `false` by default.
    ...(existy(opts.noReset) && {
      'appium:noReset': opts.noReset,
    }),
  }
}

export const buildGeneralStrategy = ({
  platformName,
  automationName,
  ...opts
} = {}) => {
  return {
    // Which automation engine to use
    'appium:automationName': automationName,
    // Which mobile OS platform to use
    platformName,

    // - Mobile OS version
    // - The platform version of an emulator or a real device. This capability
    //   is used for device autodetection if `udid` is not provided.
    ...(existy(opts.platformVersion) && {
      'appium:platformVersion': opts.platformVersion,
    }),

    // - `deviceName` - The kind of mobile device or emulator to use. On Android
    //   this capability is currently ignored, though it remains required.
    ...(existy(opts.deviceName) && {
      'appium:deviceName': opts.deviceName,
    }),

    // - `udid`: Unique device identifier of the connected physical device
    // - If you don't include this capability, the driver will attempt to use
    //   the first device in the list returned by ADB. This could result in multiple
    //   sessions targeting the same device, which is not a desirable situation.
    //   Thus it's essential to use the udid capability, even if you're using
    //   emulators for testing (in which case the emulator looks like
    //   emulator-55xx).
    // - UDID of the device to be tested. Could ve retrieved from `adb devices
    //   -l` output. If unset then the driver will try to use the first
    //   connected device. Always set this capability if you run parallel tests.
    ...(existy(opts.udid) && {
      'appium:udid': opts.udid,
    }),

    // - `orientation` - (Sim/Emu-only) start in a certain orientation. Choices
    //   are`LANDSCAPE` or `PORTRAIT`
    ...(existy(opts.deviceOrientation) && {
      'appium:orientation': opts.deviceOrientation,
    }),

    // - Enforces the server to dump the actual XML page source into the log if
    //   any error happens. `false` by default.
    ...(existy(opts.printPageSourceOnFindFailure) && {
      'appium:printPageSourceOnFindFailure': opts.printPageSourceOnFindFailure,
    }),
  }
}

export const buildDriverSettings = ({
  ...opts
} = {}) => {
  return {
    // - The number of the port the UiAutomator2 server is listening on. By
    //   default the first free port from 8200..8299 range is selected. It is
    //   recommended to set this value if you are running parallel tests on the
    //   same machine.
    // - To communicate to the UiAutomator2 process, Appium utilizes an HTTP
    //   connection which opens up a port on the host system as well as on the
    //   device. The port on the host system must be reserved for a single
    //   session, which means that if you're running multiple sessions on the
    //   same host, you'll need to specify different ports here (for example
    //   8200 for one test thread and 8201 for another).
    ...(existy(opts.systemPort) && {
      'appium:systemPort': opts.systemPort,
    }),

    // - Skip the UiAutomator2 Server component installation on the device under
    //   test and all the related checks if set to true. This could help to
    //   speed up the session startup if you know for sure the correct server
    //   version is installed on the device. In case the server is not installed
    //   or an incorrect version of it is installed then you may get an
    //   unexpected error later. false by default
    ...(existy(opts.skipServerInstallation) && {
      'appium:skipServerInstallation': opts.skipServerInstallation,
    }),

    // - The maximum number of milliseconds to wait util UiAutomator2Server is
    //   listening on the device. 30000 ms by default
    ...(existy(opts.uiautomator2ServerLaunchTimeout) && {
      'appium:uiautomator2ServerLaunchTimeout': opts.uiautomator2ServerLaunchTimeout,
    }),

    // - The maximum number of milliseconds to wait util UiAutomator2Server is
    //   installed on the device. 20000 ms by default
    ...(existy(opts.uiautomator2ServerInstallTimeout) && {
      'appium:uiautomator2ServerInstallTimeout': opts.uiautomator2ServerInstallTimeout,
    }),

    // - The maximum number of milliseconds to wait for a HTTP response from
    //   UiAutomator2Server. Only values greater than zero are accepted. If the
    //   given value is too low then expect driver commands to fail with timeout
    //   of Xms exceeded error. 240000 ms by default
    ...(existy(opts.uiautomator2ServerReadTimeout) && {
      'appium:uiautomator2ServerReadTimeout': opts.uiautomator2ServerReadTimeout,
    }),

    // - Whether to disable window animations when starting the instrumentation
    //   process. false by default
    ...(existy(opts.disableWindowAnimation) && {
      'appium:disableWindowAnimation': opts.disableWindowAnimation,
    }),

    // - If set to true then device startup checks (whether it is ready and
    //   whether Settings app is installed) will be canceled on session
    //   creation. Could speed up the session creation if you know what you are
    //   doing. false by default
    ...(existy(opts.skipDeviceInitialization) && {
      'appium:skipDeviceInitialization': opts.skipDeviceInitialization,
    }),
  }
}

export const buildAppSettings = ({
  ...opts
} = {}) => {
  return {
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
    ...(existy(opts.app) && {
      'appium:app': opts.app,
    }),

    // - The name of the browser to run the test on. If this capability is
    //   provided then the driver will try to start the test in Web context mode
    //   (Native mode is applied by default). Read Automating hybrid apps for
    //   more details. Usually equals to chrome.
    //   Name of mobile web browser to automate. Should be an empty string if
    //   automating an app instead.
    // - Choices are 'Chrome', 'Chromium', or 'Browser'.
    ...(existy(opts.browserName) && {
      browserName: opts.browserName,
    }),

    // - Maximum amount of milliseconds to wait until the application under test
    //   is installed. 90000 ms by default
    ...(existy(opts.androidInstallTimeout) && {
      'appium:androidInstallTimeout': opts.androidInstallTimeout,
    }),

    // - Set an optional intent category to be applied when starting the given
    //   appActivity by Activity Manager
    ...(existy(opts.intentCategory) && {
      'appium:intentCategory': opts.intentCategory,
    }),

    // - Set an optional intent action to be applied when starting the given
    //   appActivity by Activity Manager
    ...(existy(opts.intentAction) && {
      'appium:intentAction': opts.intentAction,
    }),

    // - Set an optional intent flags to be applied when starting the given
    //   appActivity by Activity Manager
    ...(existy(opts.intentFlags) && {
      'appium:intentFlags': opts.intentFlags,
    }),

    // - Set an optional intent arguments to be applied when starting the given
    //   appActivity by Activity Manager
    ...(existy(opts.optionalIntentArguments) && {
      'appium:optionalIntentArguments': opts.optionalIntentArguments,
    }),

    // - Set it to true if you don't want the application to be restarted if it
    //   was already running. `false` by default
    ...(existy(opts.dontStopAppOnReset) && {
      'appium:dontStopAppOnReset': opts.dontStopAppOnReset,
    }),

    // - Whether to launch the application under test automatically (true, the
    //   default value) after a test starts
    // - Setting autoLaunch to false tells the Appium server to start an
    //   automation session, but not to launch your app. This is because we want
    //   to launch the app in a controlled and time-able manner later on. It's
    //   also important to remember that because Appium won't be launching the
    //   app for us, we're responsible for ensuring all app permissions have
    //   been granted, the app is in the correct reset state (based on whether
    //   we are timing first launch or subsequent launch), etc...
    ...(existy(opts.autoLaunch) && {
      'appium:autoLaunch': opts.autoLaunch,
    }),

    // - Whether to grant all the requested application permissions
    //   automatically when a test starts(true). `false` by default
    ...(existy(opts.autoGrantPermissions) && {
      'appium:autoGrantPermissions': opts.autoGrantPermissions,
    }),

    // - Allows to set one or more comma-separated paths to Android packages
    //   that are going to be installed along with the main application under
    //   test. This might be useful if the tested app has dependencies
    ...(existy(opts.otherApps) && {
      'appium:otherApps': opts.otherApps,
    }),

    // - Allows to set one or more comma-separated package identifiers to be
    //   uninstalled from the device before a test starts
    ...(existy(opts.uninstallOtherPackages) && {
      'appium:uninstallOtherPackages': opts.uninstallOtherPackages,
    }),

    // - If set to true then it would be possible to use packages built with the
    //   test flag for the automated testing (literally adds -t flag to the adb
    //   install command). `false` by default
    ...(existy(opts.allowTestPackages) && {
      'appium:allowTestPackages': opts.allowTestPackages,
    }),

    // - Sets the maximum amount of application packages to be cached on the
    //   device under test. This is needed for devices that don't support
    //   streamed installs (Android 7 and below), because ADB must push app
    //   packages to the device first in order to install them, which takes some
    //   time. Setting this capability to zero disables apps caching. 10 by
    //   default.
    ...(existy(opts.remoteAppsCacheLimit) && {
      'appium:remoteAppsCacheLimit': opts.remoteAppsCacheLimit,
    }),

    // - If set to true then the application under test is always reinstalled
    //   even if a newer version of it already exists on the device under test.
    //   `false` by default
    ...(existy(opts.enforceAppInstall) && {
      'appium:enforceAppInstall': opts.enforceAppInstall,
    }),
  }
}

export const buildUIAutomatorDriverSettings = ({
  ...opts
} = {}) => {
  // https://github.com/appium/appium-uiautomator2-driver#settings-api

  return {
    // - Maximum number of milliseconds to wait for an acknowledgment of generic
    //   uiautomator actions, such as clicks, text setting, and menu presses.
    //   The acknowledgment is anAccessibilityEvent corresponding to an action,
    //   that lets the framework determine if the action was successful.
    //   Generally, this timeout should not be modified. 3000 ms by default
    // 'appium:settings[actionAcknowledgmentTimeout]': 3000,

    // - Whether to include elements that are not visible to the user (e. g.
    //   whose displayed attribute is false) to the XML source tree. false by
    //   default
    // 'appium:settings[allowInvisibleElements]': false,

    // - Enables or disables layout hierarchy compression. If compression is
    //   enabled, the layout hierarchy derived from the Acessibility framework
    //   will only contain nodes that are important for uiautomator testing. Any
    //   unnecessary surrounding layout nodes that make viewing and searching
    //   the hierarchy inefficient are removed. true by default
    // 'appium:settings[ignoreUnimportantViews]': true,

    // - Comma-separated list of element attribute names to be included into
    //   findElement response. By default only element UUID is present there,
    //   but it is also possible to add the following items: `name`, `text`,
    //   `rect`, `enabled`, `displayed`, `selected`,
    //   `attribute/<element_attribute_name>`. It is required that
    //   `shouldUseCompactResponses` setting is set to `false` in order for this
    //   one to apply.
    // 'appium:settings[elementResponseAttributes]': '',

    // - Whether to include all windows that the user can interact with (for
    //   example an on-screen keyboard) while building the XML page source
    //   (true). By default it is false and only the single active application
    //   window is included to the page source.
    // 'appium:settings[enableMultiWindows]': false,

    // - Whether to enable (true) toast notifications listener to listen for new
    //   toast notifications. By default this listener is enabled and
    //   UiAutomator2 server includes the text of toast messages to the
    //   generated XML page source, but not for longer than 3500 ms after the
    //   corresponding notification expires.
    // 'appium:settings[enableNotificationListener]': true,

    // - Delay in milliseconds between key presses when injecting text input. 0
    //   ms by default
    // 'appium:settings[keyInjectionDelay]': 0,

    // - Timeout for waiting for an acknowledgement of an uiautomator scroll
    //   swipe action. The acknowledgment is an AccessibilityEvent,
    //   corresponding to the scroll action, that lets the framework determine
    //   if the scroll action was successful. Generally, this timeout should not
    //   be modified. 200 ms by default
    // 'appium:settings[scrollAcknowledgmentTimeout]': 200,

    // - Used in combination with elementResponseAttributes setting. If set to
    //   false then the findElement response is going to include the items
    //   enumerated in elementResponseAttributes setting. true by default
    // 'appium:settings[shouldUseCompactResponses]': true,

    // - Timeout used for waiting for the user interface to go into an idle
    //   state. By default, all core uiautomator objects except UiDevice will
    //   perform this wait before starting to search for the widget specified by
    //   the object's locator. Once the idle state is detected or the timeout
    //   elapses (whichever occurs first), the object will start to wait for the
    //   selector to find a match. Consider lowering the value of this setting
    //   if you experience long delays while interacting with accessibility
    //   elements in your test. 10000 ms by default.
    // 'appium:settings[waitForIdleTimeout]': 10000,

    // - Timeout for waiting for a widget to become visible in the user
    //   interface so that it can be matched by a selector. Because user
    //   interface content is dynamic, sometimes a widget may not be visible
    //   immediately and won't be detected by a selector. This timeout allows
    //   the uiautomator framework to wait for a match to be found, up until the
    //   timeout elapses. This timeout is only applied to android uiautomator
    //   location strategy. 10000 ms by default
    // 'appium:settings[waitForSelectorTimeout]': 10000,

    // - Being set to true applies unicode-to-ascii normalization of element
    //   class names used as tag names in the page source XML document. This is
    //   necessary if the application under test has some Unicode class names,
    //   which cannot be used as XML tag names by default due to known bugs in
    //   Android's XML DOM parser implementation. false by default
    // 'appium:settings[normalizeTagNames]': false,

    // - Whether to shutdown the server if the device under test is disconnected
    //   from a power source (e. g. stays on battery power). true by default.
    // 'appium:settings[shutdownOnPowerDisconnect]': true,

    // - Whether to calculate element bounds as absolute values (true) or check
    //   if the element is covered by other elements and thus partially hidden
    //   (false, the default behaviour). Setting this setting to true helps to
    //   improve the performance of XML page source generation, but decreases
    //   bounds preciseness. Use with care.
    // 'appium:settings[simpleBoundsCalculation]': false,

    // - Whether to apply scroll events tracking (true, the default value), so
    //   the server could calculate the value of contentSize attribute. Having
    //   this setting enabled may add delays to all scrolling actions.
    // 'appium:settings[trackScrollEvents]': true,

    // - The timeout in milliseconds of wake lock that UiAutomator2 server
    //   acquires by default to prevent the device under test going to sleep
    //   while an automated test is running. By default the server acquires the
    //   lock for 24 hours. Setting this value to zero forces the server to
    //   release the wake lock.
    // 'appium:settings[wakeLockTimeout]': 24,

    // - The port number to start UiAutomator2 server on. Do not mix this with
    //   the systemPort, because this port is being acquired on the remote
    //   device under test rather than on the host machine. Must be in range
    //   1024..65535. 6790 by default
    // 'appium:settings[serverPort]': 6790,

    // - The port number on the remote device to start MJPEG screenshots
    //   broadcaster on. Must be in range 1024..65535. 7810 by default
    // 'appium:settings[mjpegServerPort]': 7810,

    // - The maximum count of screenshots per second taken by the MJPEG
    //   screenshots broadcaster. Must be in range 1..60. 10 by default
    // 'appium:settings[mjpegServerFramerate]': 10,

    // - The percentage value used to apply downscaling on the screenshots
    //   generated by the MJPEG screenshots broadcaster. Must be in range
    //   1..100. 50 is by default, which means that screenshots are downscaled
    //   to the half of their original size keeping their original proportions.
    // 'appium:settings[mjpegScalingFactor]': 50,

    // - The percentage value used to apply lossy JPEG compression on the
    //   screenshots generated by the MJPEG screenshots broadcaster. Must be in
    //   range 1..100. 50 is by default, which means that screenshots are
    //   compressed to the half of their original quality.
    // 'appium:settings[mjpegServerScreenshotQuality]': 50,

    // - Controls whether (true) or not (false, the default value) to apply
    //   bilinear filtering to MJPEG screenshots broadcaster resize algorithm.
    //   Enabling this flag may improve the quality of the resulting scaled
    //   bitmap, but may introduce a small performance hit.
    // 'appium:settings[mjpegBilinearFiltering]': false,

    // - Defines the strategy used by UiAutomator2 server to detect the original
    //   device orientation. By default (false value) the server uses device
    //   rotation value for this purpose. Although, this approach may not work
    //   for some devices and a portrait orientation may erroneously be detected
    //   as the landscape one (and vice versa). In such case it makes sense to
    //   play with this setting.
    // 'appium:settings[useResourcesForOrientationDetection]': false,
  }
}

export const buildLocalization = ({
  ...opts
} = {}) => {
  return {
    // - Canonical name of the locale to be set for the app under test, for
    //   example zh-Hans-CN. See
    //   https://developer.android.com/reference/java/util/Locale.html for more
    //   details.
    ...(existy(opts.localeScript) && {
      'appium:localeScript': opts.localeScript,
    }),

    // - Language to set for Android.
    // - Name of the language to extract application strings for. Strings are
    //   extracted for the current system language by default. Also sets the
    //   language for the app under test. See
    //   https://developer.android.com/reference/java/util/Locale.html for more
    //   details. Example: en, ja
    ...(existy(opts.language) && {
      'appium:language': opts.language,
    }),

    // - Locale to set Android. CA format (country name abbreviation) for
    //   Android.
    // - Sets the locale for the app under test. See
    //   https://developer.android.com/reference/java/util/Locale.html for more
    //   details. Example: EN, JA
    ...(existy(opts.locale) && {
      'appium:locale': opts.locale,
    }),
  }
}

export const buildAdb = ({
  ...opts
} = {}) => {
  return {
    // - Number of the port where ADB is running. 5037 by default
    // 'appium:adbPort': parseWhole(envs, 'ADB_PORT', 5037),
    ...(existy(opts.adbPort) && {
      'appium:adbPort': opts.adbPort,
    }),

    // - Address of the host where ADB is running (the value of -H ADB command
    //   line option). Unset by default
    ...(existy(opts.remoteAdbHost) && {
      'appium:remoteAdbHost': opts.remoteAdbHost,
    }),

    // - Maximum number of milliseconds to wait until single ADB command is
    //   executed. 20000 ms by default
    ...(existy(opts.adbExecTimeout) && {
      'appium:adbExecTimeout': opts.adbExecTimeout,
    }),

    // - If set to true then UiAutomator2 deletes all the existing logs in the
    //   device buffer before starting a new test
    ...(existy(opts.clearDeviceLogsOnStart) && {
      'appium:clearDeviceLogsOnStart': opts.clearDeviceLogsOnStart,
    }),

    // - The version of Android build tools to use. By default UiAutomator2
    //   driver uses the most recent version of build tools installed on the
    //   machine, but sometimes it might be necessary to give it a hint (let say
    //   if there is a known bug in the most recent tools version). Example:
    //   28.0.3
    ...(existy(opts.buildToolsVersion) && {
      'appium:buildToolsVersion': opts.buildToolsVersion,
    }),

    // - Being set to true disables automatic logcat output collection during
    //   the test run. false by default
    ...(existy(opts.skipLogcatCapture) && {
      'appium:skipLogcatCapture': opts.skipLogcatCapture,
    }),

    // - Being set to true prevents the driver from ever killing the ADB server
    //   explicitly. Could be useful if ADB is connected wirelessly. false by
    //   default
    ...(existy(opts.suppressKillServer) && {
      'appium:suppressKillServer': opts.suppressKillServer,
    }),

    // - Being set to true ignores a failure while changing hidden API access
    //   policies. Could be useful on some devices, where access to these
    //   policies has been locked by its vendor. false by default.
    ...(existy(opts.ignoreHiddenApiPolicyError) && {
      'appium:ignoreHiddenApiPolicyError': opts.ignoreHiddenApiPolicyError,
    }),

    // - Sets the package identifier of the app, which is used as a system mock
    //   location provider since Appium 1.18.0+. This capability has no effect
    //   on emulators. If the value is set to null or an empty string, then
    //   Appium will skip the mocked location provider setup procedure. Defaults
    //   to Appium Setting package identifier (io.appium.settings).
    ...(existy(opts.mockLocationApp) && {
      'appium:mockLocationApp': opts.mockLocationApp,
    }),

    // - The log print format, where format is one of: brief process tag thread
    //   raw time threadtime long. threadtime is the default value.
    ...(existy(opts.logcatFormat) && {
      'appium:logcatFormat': opts.logcatFormat,
    }),

    // - Series of tag[:priority] where tag is a log component tag (or * for
    //   all) and priority is: V Verbose, D Debug, I Info, W Warn, E Error, F
    //   Fatal, S Silent (supress all output). '' means ':d' and tag by itself
    //   means tag:v. If not specified on the commandline, filterspec is set
    //   from ANDROID_LOG_TAGS. If no filterspec is found, filter defaults to
    //   '*:I'.
    ...(existy(opts.logcatFilterSpecs) && {
      'appium:logcatFilterSpecs': opts.logcatFilterSpecs,
    }),

    // - Being set to false prevents emulator to use -delay-adb feature to
    //   detect its startup. See https://github.com/appium/appium/issues/14773
    //   for more details.
    ...(existy(opts.allowDelayAdb) && {
      'appium:allowDelayAdb': opts.allowDelayAdb,
    }),
  }
}

export const buildEmulatorAndroidVirtualDevice = ({
  ...opts
} = {}) => {
  return {
    // - The name of Android emulator to run the test on. The names of currently
    //   installed emulators could be listed using `avdmanager list avd` command.
    //   If the emulator with the given name is not running then it is going to
    //   be started before a test
    ...(existy(opts.avd) && {
      'appium:avd': opts.avd,
    }),

    // - Maximum number of milliseconds to wait until Android Emulator is
    //   started. 60000 ms by default
    ...(existy(opts.avdLaunchTimeout) && {
      'appium:avdLaunchTimeout': opts.avdLaunchTimeout,
    }),

    // - Maximum number of milliseconds to wait until Android Emulator is fully
    //   booted and is ready for usage. 60000 ms by default
    ...(existy(opts.avdReadyTimeout) && {
      'appium:avdReadyTimeout': opts.avdReadyTimeout,
    }),

    // - Either a string or an array of emulator command line arguments.
    ...(existy(opts.avdArgs) && {
      'appium:avdArgs': opts.avdArgs,
    }),

    // - Mapping of emulator environment variables.
    ...(existy(opts.avdEnv) && {
      'appium:avdEnv': opts.avdEnv,
    }),

    // - Sets the desired network speed limit for the emulator. It is only
    //   applied if the emulator is not running before the test starts. See
    //   emulator command line arguments description for more details.
    ...(existy(opts.networkSpeed) && {
      'appium:networkSpeed': opts.networkSpeed,
    }),

    // - Sets whether to enable (true) or disable (false) GPS service in the
    //   Emulator. Unset by default, which means to not change the current value
    ...(existy(opts.gpsEnabled) && {
      'appium:gpsEnabled': opts.gpsEnabled,
    }),

    // - If set to true then emulator starts in headless mode (e.g. no UI is
    //   shown). It is only applied if the emulator is not running before the
    //   test starts. false by default.
    ...(existy(opts.isHeadless) && {
      'appium:isHeadless': opts.isHeadless,
    }),
  }
}

export const buildAppSigning = ({
  ...opts
} = {}) => {
  return {
    // - Whether to use a custom keystore to sign the app under test. false by
    //   default, which means apps are always signed with the default Appium
    //   debug certificate (unless canceled by noSign capability). This
    //   capability is used in combination with keystorePath, keystorePassword,
    //   keyAlias and keyPassword capabilities.
    ...(existy(opts.useKeystore) && {
      'appium:useKeystore': opts.useKeystore,
    }),

    // - The full path to the keystore file on the server filesystem. This
    //   capability is used in combination with useKeystore, keystorePath,
    //   keystorePassword, keyAlias and keyPassword capabilities. Unset by
    //   default
    ...(existy(opts.keystorePath) && {
      'appium:keystorePath': opts.keystorePath,
    }),

    // - The password to the keystore file provided in keystorePath capability.
    //   This capability is used in combination with useKeystore, keystorePath,
    //   keystorePassword, keyAlias and keyPassword capabilities. Unset by
    //   default
    ...(existy(opts.keystorePassword) && {
      'appium:keystorePassword': opts.keystorePassword,
    }),

    // - The alias of the key in the keystore file provided in keystorePath
    //   capability. This capability is used in combination with useKeystore,
    //   keystorePath, keystorePassword, keyAlias and keyPassword capabilities.
    //   Unset by default
    ...(existy(opts.keyAlias) && {
      'appium:keyAlias': opts.keyAlias,
    }),

    // - The password of the key in the keystore file provided in keystorePath
    //   capability. This capability is used in combination with useKeystore,
    //   keystorePath, keystorePassword, keyAlias and keyPassword capabilities.
    //   Unset by default
    ...(existy(opts.keyPassword) && {
      'appium:keyPassword': opts.keyPassword,
    }),

    // - Set it to true in order to skip application signing. By default all
    //   apps are always signed with the default Appium debug signature if they
    //   don't have any. This capability cancels all the signing checks and
    //   makes the driver to use the application package as is. This capability
    //   does not affect .apks packages as these are expected to be already
    //   signed.
    ...(existy(opts.noSign) && {
      'appium:noSign': opts.noSign,
    }),
  }
}

export const buildDeviceLocking = ({
  ...opts
} = {}) => {
  return {
    // - Whether to skip the check for lock screen presence (true). By default
    //   UiAutomator2 driver tries to detect if the device's screen is locked
    //   before starting the test and to unlock that (which sometimes might be
    //   unstable). Note, that this operation takes some time, so it is highly
    //   recommended to set this capability to true and disable screen locking
    //   on devices under test.
    ...(existy(opts.skipUnlock) && {
      'appium:skipUnlock': opts.skipUnlock,
    }),

    // - Set one of the possible types of Android lock screens to unlock. Read
    //   the Unlock tutorial for more details.
    ...(existy(opts.unlockType) && {
      'appium:unlockType': opts.unlockType,
    }),

    // - Allows to set an unlock key. Read the Unlock tutorial for more details.
    ...(existy(opts.unlockKey) && {
      'appium:unlockKey': opts.unlockKey,
    }),

    // - Maximum number of milliseconds to wait until the device is unlocked.
    //   2000 ms by default
    ...(existy(opts.unlockSuccessTimeout) && {
      'appium:unlockSuccessTimeout': opts.unlockSuccessTimeout,
    }),
  }
}

export const buildMJpeg = ({
  ...opts
} = {}) => {
  return {
    // - The number of the port UiAutomator2 server starts the MJPEG server on.
    //   If not provided then the screenshots broadcasting service on the remote
    //   device does not get exposed to a local port (e.g. no adb port
    //   forwarding is happening)
    ...(existy(opts.mjpegServerPort) && {
      'appium:mjpegServerPort': opts.mjpegServerPort,
    }),

    // - The URL of a service that provides realtime device screenshots in MJPEG
    //   format. If provided then the actual command to retrieve a screenshot
    //   will be requesting pictures from this service rather than directly from
    //   the server
    ...(existy(opts.mjpegScreenshotUrl) && {
      'appium:mjpegScreenshotUrl': opts.mjpegScreenshotUrl,
    }),
  }
}

export const buildWebContext = ({
  ...opts
} = {}) => {
  return {
    // - If set to true then UiAutomator2 driver will try to switch to the first
    //   available web view after the session is started. false by default.
    ...(existy(opts.autoWebview) && {
      'appium:autoWebview': opts.autoWebview,
    }),

    // - The local port number to use for devtools communication. By default the
    //   first free port from 10900..11000 range is selected. Consider setting
    //   the custom value if you are running parallel tests.
    ...(existy(opts.webviewDevtoolsPort) && {
      'appium:webviewDevtoolsPort': opts.webviewDevtoolsPort,
    }),

    // - Whether to skip web views that have no pages from being shown in
    //   getContexts output. The driver uses devtools connection to retrieve the
    //   information about existing pages. true by default since Appium 1.19.0,
    //   false if lower than 1.19.0.
    ...(existy(opts.ensureWebviewsHavePages) && {
      'appium:ensureWebviewsHavePages': opts.ensureWebviewsHavePages,
    }),

    // - Whether to retrieve extended web views information using devtools
    //   protocol. Enabling this capability helps to detect the necessary
    //   chromedriver version more precisely. true by default since Appium
    //   1.22.0, false if lower than 1.22.0.
    ...(existy(opts.enableWebviewDetailsCollection) && {
      'appium:enableWebviewDetailsCollection': opts.enableWebviewDetailsCollection,
    }),

    // - The port number to use for Chromedriver communication. Any free port
    //   number is selected by default if unset.
    ...(existy(opts.chromedriverPort) && {
      'appium:chromedriverPort': opts.chromedriverPort,
    }),

    // - Array of possible port numbers to assign for Chromedriver
    //   communication. If none of the port in this array is free then an error
    //   is thrown.
    ...(existy(opts.chromedriverPorts) && {
      'appium:chromedriverPorts': opts.chromedriverPorts,
    }),

    // - Array of chromedriver command line arguments. Note, that not all
    //   command line arguments that are available for the desktop browser are
    //   also available for the mobile one.
    ...(existy(opts.chromedriverArgs) && {
      'appium:chromedriverArgs': opts.chromedriverArgs,
    }),

    // - Full path to the chromedriver executable on the server file system.
    ...(existy(opts.chromedriverExecutable) && {
      'appium:chromedriverExecutable': opts.chromedriverExecutable,
    }),

    // - Full path to the folder where chromedriver executables are located.
    //   This folder is used then to store the downloaded chromedriver
    //   executables if automatic download is enabled. Read Automatic
    //   Chromedriver Discovery article for more details.
    ...(existy(opts.chromedriverExecutableDir) && {
      'appium:chromedriverExecutableDir': opts.chromedriverExecutableDir,
    }),

    // - Full path to the chromedrivers mapping file. This file is used to
    //   statically map webview/browser versions to the chromedriver versions
    //   that are capable of automating them. Read Automatic Chromedriver
    //   Discovery article for more details.
    ...(existy(opts.chromedriverChromeMappingFile) && {
      'appium:chromedriverChromeMappingFile': opts.chromedriverChromeMappingFile,
    }),

    // - Set it to true in order to enforce the usage of chromedriver, which
    //   gets downloaded by Appium automatically upon installation. This driver
    //   might not be compatible with the destination browser or a web view.
    //   false by default.
    ...(existy(opts.chromedriverUseSystemExecutable) && {
      'appium:chromedriverUseSystemExecutable': opts.chromedriverUseSystemExecutable,
    }),

    // - Being set to true disables the compatibility validation between the
    //   current chromedriver and the destination browser/web view. Use it with
    //   care.
    ...(existy(opts.chromedriverDisableBuildCheck) && {
      'appium:chromedriverDisableBuildCheck': opts.chromedriverDisableBuildCheck,
    }),

    // - Set the maximum number of milliseconds to wait until a web view is
    //   available if autoWebview capability is set to true. 2000 ms by default
    ...(existy(opts.autoWebviewTimeout) && {
      'appium:autoWebviewTimeout': opts.autoWebviewTimeout,
    }),

    // - If this capability is set to true then chromedriver session is always
    //   going to be killed and then recreated instead of just suspending it on
    //   context switching. false by default
    ...(existy(opts.recreateChromeDriverSessions) && {
      'appium:recreateChromeDriverSessions': opts.recreateChromeDriverSessions,
    }),

    // - Whether to use screenshoting endpoint provided by UiAutomator framework
    //   (true) rather than the one provided by chromedriver (false, the default
    //   value). Use it when you experience issues with the latter.
    ...(existy(opts.nativeWebScreenshot) && {
      'appium:nativeWebScreenshot': opts.nativeWebScreenshot,
    }),

    // - If set to true, tell chromedriver to attach to the android package we
    //   have associated with the context name, rather than the package of the
    //   application under test. false by default.
    ...(existy(opts.extractChromeAndroidPackageFromContextName) && {
      'appium:extractChromeAndroidPackageFromContextName': opts.extractChromeAndroidPackageFromContextName,
    }),

    // - If set to true then all the output from chromedriver binary will be
    //   forwarded to the Appium server log. false by default.
    ...(existy(opts.showChromedriverLog) && {
      'appium:showChromedriverLog': opts.showChromedriverLog,
    }),

    // - One of the available page load strategies. See
    //   https://www.w3.org/TR/webdriver/#capabilities
    ...(existy(opts.pageLoadStrategy) && {
      'appium:pageLoadStrategy': opts.pageLoadStrategy,
    }),

    // - A mapping, that allows to customize chromedriver options. See
    //   https://chromedriver.chromium.org/capabilities for the list of
    //   available entries.
    ...(existy(opts.chromeOptions) && {
      'appium:chromeOptions': opts.chromeOptions,
    }),
  }
}

export const buildOther = ({
  ...opts
} = {}) => {
  return {
    // - Being set to true tells the instrumentation process to not suppress
    //   accessibility services during the automated test. This might be useful
    //   if your automated test needs these services. false by default
    ...(existy(opts.disableSuppressAccessibilityService) && {
      'appium:disableSuppressAccessibilityService': opts.disableSuppressAccessibilityService,
    }),

    // - Integer identifier of a user profile. By default the app under test is
    //   installed for the currently active user, but in case it is necessary to
    //   test how the app performs while being installed for a user profile,
    //   which is different from the current one, then this capability might
    //   come in handy.
    ...(existy(opts.userProfile) && {
      'appium:userProfile': opts.userProfile,
    }),

    // - How long (in seconds) the driver should wait for a new command from the
    //   client before assuming the client has stopped sending requests. After
    //   the timeout the session is going to be deleted. 60 seconds by default.
    //   Setting it to zero disables the timer.
    // - How long (in seconds) Appium will wait for a new command from the
    //   client before assuming the client quit and ending the session.
    ...(existy(opts.newCommandTimeout) && {
      'appium:newCommandTimeout': opts.newCommandTimeout,
    }),

    // - Skips to start capturing logs such as logcat. It might improve network
    //   performance. Log-related commands won't work if the capability is
    //   enabled. Defaults to false.
    ...(existy(opts.skipLogCapture) && {
      'appium:skipLogCapture': opts.skipLogCapture,
    }),
  }
}
