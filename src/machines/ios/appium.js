import {
  existy,
  // parseBool,
  // parseWhole,
} from '../../utils'

// `react-native run-ios --configuration Release --no-packager`

// ## XCUITest driver Requirements
//
// - Only macOS is supported as the host platform
// - Xcode and developer tools must be installed. Note, that usually some time
//   is needed for the Appium team to pick up with the support of the most
//   recent Xcode versions, especially beta ones.
// - Connected real devices must be trusted, added to your developer profile and
//   configured properly along with WebDriverAgent signing. Read [Real
//   devices](https://github.com/appium/appium-xcuitest-driver#real-devices)
//   section _carefully_ to set them up properly before running your tests.
// - The minimum supported Xcode SDK version for the current driver snapshot is
//   _10.2 (iOS 12.2)_. Consider using earlier releases of the driver (see
//   [Xcode version
//   support](https://github.com/appium/appium-xcuitest-driver#xcode-version-support)
//   section below) if it is necessary to test older iOS versions on real
//   devices. Also, it is highly recommended to always use the same major
//   version of Xcode SDK, which was used to build the particular iOS/tvOS
//   version on your real device under test (for example Xcode 11 for iOS 13,
//   Xcode 12 for iOS 14, etc).
// - Web views must be debuggable in order to test them. If it is not possible
//   to connect to your web view(s) using [Safari remote
//   debugger](https://appletoolbox.com/use-web-inspector-debug-mobile-safari/)
//   then XCUITest won't be able to connect to them as well.
// - Since version 3.33.0 (included into Appium 1.20.0+) of XCUITest driver the
//   [Carthage](https://github.com/Carthage/Carthage) dependency _is not needed
//   anymore_. Prior to that version it was required and could be installed
//   using [brew](https://brew.sh/): `brew install carthage`.
//
// ## Optional dependencies
//
// - [xcpretty](https://github.com/supermarin/xcpretty) tool could be used to
//   make Xcode output easier to read. It could be installed using `gem install
//   xcpretty` command.
// - For test video recording we use [ffmpeg](https://ffmpeg.org/). It could be
//   installed using [brew](https://brew.sh/): `brew install ffmpeg`
// - Facebook's [IDB](https://github.com/facebook/idb) tool could be used to
//   improve some real device/Simulator interactions
// - [WIX AppleSimulatorUtils](https://github.com/wix/AppleSimulatorUtils) could
//   be used to improve some Simulator interactions

// ## Parallel iOS Tests
//
// Since Xcode9, Appium supports parallel RealDevice and Simulator testing.
// Start your Appium Server on any available port. The important capabilities:
//
// ### RealDevice
//
// - `udid` must be a unique device UDID for each parallel session
// - `wdaLocalPort` must be a unique port number for each parallel session. The
//   default value is 8100
// - `derivedDataPath` set the unique derived data path root for each driver
//   instance. This will help to avoid possible conflicts and to speed up the
//   parallel execution.
//
// ### Simulator
//
// - Either `udid`, which is the unique simulator UDID for each parallel
//   session(this can be retrieved from xcrun simctl list) or a unique
//   combination of `deviceName` and `platformVersion` to identify the
//   appropriate simulator with the given name and version number for each
//   parallel session
// - `wdaLocalPort` must be a unique port number for each parallel session. The
//   default value is 8100
// - `derivedDataPath` set the unique derived data path root for each driver
//   instance. This will help to avoid possible conflicts and to speed up the
//   parallel execution.

// ## Tools
//
// - `authorize-ios` is a little utility that pre-authorizes Instruments to run
//   UIAutomation scripts against iOS devices. You need this utility to run
//   tests on real devices
//   `npm install -g authorize-ios`
// - `ios-deploy` is a small utility to install and debug iPhone apps from the
//   command line, without using Xcode.
//  `brew install ios-deploy`
// - `ideviceinstaller` is a tool to interact with the installation_proxy of an
//   iOS device allowing to install, upgrade, uninstall, archive, restore and
//   enumerate installed or archived apps. You also need this utility to run
//   tests on real devices.
//   `brew install ideviceinstaller`
// - Appium uses this tool to access web views on real iOS devices. In terminal,
//   run the following command
//   brew install ios-webkit-debug-proxy`;

// ## Real devices
//
// ### Configuration
//
// See [real device configuration documentation](https://github.com/appium/appium-xcuitest-driver/blob/master/docs/real-device-config.md).
//
// ### Known problems
//
// After many failures on real devices it could transition to a state where
// connections are no longer being accepted. To possibly remedy this issue
// reboot the device. Read
// <https://github.com/facebook/WebDriverAgent/issues/507> for more details.
//
// #### Weird state
//
// **Note:** Running `WebDriverAgent` tests on a real device is particularly
// **flakey. If things stop responding, the only recourse is, most often, to
// **restart the device. Logs in the form of the following _may_ start to occur:
//
// ```
// info JSONWP Proxy Proxying [POST /session] to [POST http://10.35.4.122:8100/session] with body: {"desiredCapabilities":{"ap..."
// dbug WebDriverAgent Device: Jul 26 13:20:42 iamPhone XCTRunner[240] <Warning>: Listening on USB
// dbug WebDriverAgent Device: Jul 26 13:21:42 iamPhone XCTRunner[240] <Warning>: Enqueue Failure: UI Testing Failure - Unable to update application state promptly. <unknown> 0 1
// dbug WebDriverAgent Device: Jul 26 13:21:57 iamPhone XCTRunner[240] <Warning>: Enqueue Failure: UI Testing Failure - Failed to get screenshot within 15s <unknown> 0 1
// dbug WebDriverAgent Device: Jul 26 13:22:57 iamPhone XCTRunner[240] <Warning>: Enqueue Failure: UI Testing Failure - App state of (null) is still unknown <unknown> 0 1
// ```
//
// ### Real device security settings
//
// On some systems, especially CI ones, where tests are executed by a command
// line agents, macOS Accessibility restrictions make the `WebDriverAgent`
// system unable to retrieve the development keys from the system keychain. This
// is usually manifest by `xcodebuild` returning an error code `65`. A
// workaround for this is to use a private key that is not stored on the system
// keychain. See [this issue](https://github.com/appium/appium/issues/6955) and
// [this Stack Exchange
// post](http://stackoverflow.com/questions/16550594/jenkins-xcode-build-works-codesign-fails).
//
// To export the key, use
//
// - `security create-keychain -p [keychain_password] MyKeychain.keychain`
// - `security import MyPrivateKey.p12 -t agg -k MyKeychain.keychain -P [p12_Password] -A`
//
// where `MyPrivateKey.p12` is the private development key exported from the
// system keychain.
//
// The full path to the keychain can then be sent to the Appium system using the
// `keychainPath` desired capability, and the password sent through the
// `keychainPassword` capability.

// See https://github.com/appium/appium-xcuitest-driver
export const buildGeneral = ({
  platformName,
  automationName,
  deviceName,
  platformVersion,
  ...opts
} = {}) => {
  return {
    // - Could be set to ios. Appium itself is not strict about this capability
    //   value if automationName is provided, so feel free to assign it to any
    //   supported platform name if this is needed, for example, to make
    //   Selenium Grid working.
    // - NOTE: `browserName` and `platformName` are frequently used in Appium
    //   tests, but are W3C capabilities so they are not prepended with `appium`.
    platformName,

    // - Must always be set to xcuitest. Values of automationName are compared
    //   case-insensitively.
    'appium:automationName': automationName,

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
    'appium:deviceName': deviceName,

    // - The platform version of an emulator or a real device. This capability
    //   is used for device autodetection if `udid` is not provided
    'appium:platformVersion': platformVersion,

    // - Enforces the server to dump the actual XML page source into the log if
    //   any error happens. false by default.
    ...(existy(opts.printPageSourceOnFindFailure) && {
      'appium:printPageSourceOnFindFailure': opts.printPageSourceOnFindFailure,
    }),

    // - The name of the browser to run the test on. If this capability is
    //   provided then the driver will try to start the test in Web context mode
    //   (Native mode is applied by default). Read Automating hybrid apps for
    //   more details. Usually equals to `safari`.
    ...(existy(opts.browserName) && {
      browserName: opts.browserName,
    }),

    // - Whether to include screen information as the result of Get Session
    //   Capabilities. It includes pixelRatio, statBarHeight and viewportRect,
    //   but it causes an extra API call to WDA which may increase the response
    //   time like this issue. Defaults to true.
    ...(existy(opts.includeDeviceCapsToSessionInfo) && {
      'appium:includeDeviceCapsToSessionInfo': opts.includeDeviceCapsToSessionInfo,
    }),

    // - UDID of the device to be tested. Could ve retrieved from
    //   Xcode->Window->Devices and Simulators window. Always set this
    //   capability if you run parallel tests or use a real device to run your
    //   tests.
    // - We need to make sure we specify a particular device id to ensure we
    //   don't try to run a session on the same device. For simulators, udids
    //   can be found by running `xcrun simctl list devices`. Actually, if
    //   you're doing simulator testing, I should have said that either the `udid`
    //   capability is required, or a distinct combination of the `deviceName`
    //   and `platformVersion` capabilities is required.
    ...(existy(opts.udid) && {
      'appium:udid': opts.udid,
    }),
  }
}

export const buildResetStrategy = ({
  ...opts
} = {}) => {
  // iOS Reset Strategies
  // https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/other/reset-strategies.md

  // Default: Shut down sim after test. Do not destroy sim. If it is a simulator and
  //   `app` capability is provided, uninstalls the app-under-test* but does not
  //   destroy simulator. If it is a real device or a simulator with only
  //   `bundleId` capability, does not uninstall app-under-test.

  return {
    // - `fullReset`: Uninstall app before and after real device test, destroy
    //   Simulator before and after sim test. They happen only _before_ if
    //   `resetOnSessionStartOnly: true` is provided. Defaults to `false`
    // - Set `fullReset: true` if you would like to test against the app using
    //   different languages' resources.
    // - Being set to true always enforces the application under test to be
    //   fully uninstalled before starting a new session. `false` by default
    ...(existy(opts.fullReset) && {
      'appium:fullReset': opts.fullReset,
    }),

    // - Do not destroy or shut down sim after test. Start tests running on
    //   whichever sim is running, or device is plugged in. Deaults to `false`.
    // - Read the reset strategies very well, they differ per platform, see
    //   http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
    // - Prevents the device to be reset before the session startup if set to
    //   true. This means that the application under test is not going to be
    //   terminated neither its data cleaned. `false` by default
    ...(existy(opts.noReset) && {
      'appium:noReset': opts.noReset,
    }),

    // - Specify if the app should be terminated on session end. This capability
    //   only has an effect if an application identifier has been passed to the
    //   test session (either explicitly, by setting `bundleId`, or implicitly, by
    //   providing `app`). Default is `true` unless `noReset` capability is set to
    //   `true`.
    ...(existy(opts.shouldTerminateApp) && {
      'appium:shouldTerminateApp': opts.shouldTerminateApp,
    }),

    // - Specify if the app should be forcefully restarted if it is already
    //   running on session startup. This capability only has an effect if an
    //   application identifier has been passed to the test session (either
    //   explicitly, by setting `bundleId`, or implicitly, by providing `app`).
    //   Default is `true` unless `noReset` capability is set to `true`.
    ...(existy(opts.forceAppLaunch) && {
      'appium:forceAppLaunch': opts.forceAppLaunch,
    }),
  }
}

export const buildApp = ({
  ...opts
} = {}) => {
  return {
    // - Bundle identifier of the app under test, for example
    //   `com.mycompany.myapp`. The capability value is calculated automatically
    //   if `app` is provided. If neither `app` or `bundleId` capability is provided
    //   then XCUITest driver starts from the Home screen.
    ...(existy(opts.bundleId) && {
      'appium:bundleId': opts.bundleId,
    }),

    // - Full path to the application to be tested (the app must be located on
    //   the same machine where the server is running). .ipa and .app
    //   application extensions are supported. Zipped .app bundles are supported
    //   as well. Could also be an URL to a remote location. If neither of the
    //   `app` or `bundleId` capabilities are provided then the driver starts from
    //   the Home screen and expects the test to know what to do next. Do not
    //   provide both `app` and `browserName` capabilities at once.
    // - Path to the .ipa, .zip, or bundle id for an already running application.
    ...(existy(opts.app) && {
      'appium:app': opts.app,
    }),

    // - Where to look for localizable strings in the application bundle.
    //   Defaults to en.lproj
    ...(existy(opts.localizableStringsDir) && {
      'appium:localizableStringsDir': opts.localizableStringsDir,
    }),

    // - App or list of apps (as a JSON array) to install prior to running
    //   tests. Note that it will not work with iOS real devices. Fore example:
    //   ["http://appium.github.io/appium/assets/TestApp9.4.app.zip",
    //   "/path/to/app-b.app"]
    // 'appium:otherApps': [],

    // - Language to set for iOS, for example fr. Please read Language IDs to
    //   get more details abuot available values for this capability.
    ...(existy(opts.language) && {
      'appium:language': opts.language,
    }),

    // - Locale to set for iOS, for example fr_CA. Please read Locale IDs to get
    //   more details abuot available values for this capability.
    ...(existy(opts.locale) && {
      'appium:locale': opts.locale,
    }),

    // - The timeout for application upload in milliseconds. Works for real
    //   devices only. The default value is 30000ms
    ...(existy(opts.appPushTimeout) && {
      'appium:appPushTimeout': opts.appPushTimeout,
    }),
  }
}

export const buildWebDriverAgent = ({
  ...opts
} = {}) => {
  return {
    // - Apple developer team identifier string. Must be used in conjunction
    //   with xcodeSigningId to take effect. | e.g., JWL241K123
    ...(existy(opts.xcodeOrgId) && {
      'appium:xcodeOrgId': opts.xcodeOrgId,
    }),

    // - String representing a signing certificate. Must be used in conjunction
    //   with xcodeOrgId. This is usually just iPhone Developer, so the default
    //   (if not included) is `iPhone Developer` | e.g., iPhone Developer
    ...(existy(opts.xcodeSigningId) && {
      'appium:xcodeSigningId': opts.xcodeSigningId,
    }),

    // - Full path to an optional Xcode configuration file that specifies the
    //   code signing identity and team for running the WebDriverAgent on the
    //   real device. | e.g., /path/to/myconfig.xcconfig
    ...(existy(opts.xcodeConfigFile) && {
      'appium:xcodeConfigFile': opts.xcodeConfigFile,
    }),

    // - Bundle id to update WDA to before building and launching on real
    //   devices. This bundle id must be associated with a valid provisioning
    //   profile. | e.g., io.appium.WebDriverAgentRunner
    ...(existy(opts.updatedWDABundleId) && {
      'appium:updatedWDABundleId': opts.updatedWDABundleId,
    }),

    // - Full path to the private development key exported from the system
    //   keychain. Used in conjunction with keychainPassword when testing on
    //   real devices. | e.g., /path/to/MyPrivateKey.p12
    ...(existy(opts.keychainPath) && {
      'appium:keychainPath': opts.keychainPath,
    }),

    // - Password for unlocking keychain specified in keychainPath. | e.g.,
    //   super awesome password
    ...(existy(opts.keychainPassword) && {
      'appium:keychainPassword': opts.keychainPassword,
    }),

    // - Use along with usePrebuiltWDA capability and choose where to search for
    //   the existing WDA app. If the capability is not set then Xcode will
    //   store the derived data in the default root taken from preferences.
    ...(existy(opts.derivedDataPath) && {
      'appium:derivedDataPath': opts.derivedDataPath,
    }),

    // - If provided, Appium will connect to an existing WebDriverAgent instance
    //   at this URL instead of starting a new one. | e.g., http://localhost:8100
    ...(existy(opts.webDriverAgentUrl) && {
      'appium:webDriverAgentUrl': opts.webDriverAgentUrl,
    }),

    // - If `true`, forces uninstall of any existing WebDriverAgent app on device.
    //   Set it to true if you want to apply different startup options for
    //   WebDriverAgent for each session. Although, it is only guaranteed to
    //   work stable on Simulator. Real devices require WebDriverAgent client to
    //   run for as long as possible without reinstall/restart to avoid issues
    //   like https://github.com/facebook/WebDriverAgent/issues/507.
    // - The `false` value (the default behaviour since driver version 2.35.0)
    //   will try to detect currently running WDA listener executed by previous
    //   testing session(s) and reuse it if possible, which is highly
    //   recommended for real device testing and to speed up suites of multiple
    //   tests in general. A new WDA session will be triggered at the default
    //   URL (http://localhost:8100) if WDA is not listening and
    //   webDriverAgentUrl capability is not set. The negative/unset value of
    //   useNewWDA capability has no effect prior to xcuitest driver version
    //   2.35.0. | e.g., true
    ...(existy(opts.useNewWDA) && {
      'appium:useNewWDA': opts.useNewWDA,
    }),

    // - Time, in ms, to wait for WebDriverAgent to be pingable. Defaults to
    //   60000ms. | e.g., 30000
    ...(existy(opts.wdaLaunchTimeout) && {
      'appium:wdaLaunchTimeout': opts.wdaLaunchTimeout,
    }),

    // - Timeout, in ms, for waiting for a response from WebDriverAgent.
    //   Defaults to 240000ms. | e.g., 1000
    ...(existy(opts.wdaConnectionTimeout) && {
      'appium:wdaConnectionTimeout': opts.wdaConnectionTimeout,
    }),

    // - Number of times to try to build and launch WebDriverAgent onto the
    //   device. Defaults to 2. | e.g., 4
    ...(existy(opts.wdaStartupRetries) && {
      'appium:wdaStartupRetries': opts.wdaStartupRetries,
    }),

    // - Time, in ms, to wait between tries to build and launch WebDriverAgent.
    //   Defaults to 10000ms. | e.g., 20000
    ...(existy(opts.wdaStartupRetryInterval) && {
      'appium:wdaStartupRetryInterval': opts.wdaStartupRetryInterval,
    }),

    // - This value if specified, will be used to forward traffic from Mac host
    //   to real ios devices over USB. Default value is same as port number used
    //   by WDA on device. | e.g., 8100
    // - The iOS XCUITest driver uses a specific port to communicate with
    //   WebDriverAgent running on the iOS device. It's good to make sure these
    //   are unique for each test thread.
    ...(existy(opts.wdaLocalPort) && {
      'appium:wdaLocalPort': opts.wdaLocalPort,
    }),

    // - This value if specified, will be used as a prefix to build a custom
    //   WebDriverAgent url. It is different from webDriverAgentUrl, because if
    //   the latter is set then it expects WebDriverAgent to be already
    //   listening and skips the building phase. Defaults to `http://localhost`
    //   e.g., http://192.168.1.100
    ...(existy(opts.wdaBaseUrl) && {
      'appium:wdaBaseUrl': opts.wdaBaseUrl,
    }),

    // - Whether to display the output of the Xcode command used to run the
    //   tests. If this is true, there will be lots of extra logging at startup.
    //   Defaults to `false` | e.g., true
    ...(existy(opts.showXcodeLog) && {
      'appium:showXcodeLog': opts.showXcodeLog,
    }),

    // - Time in milliseconds to pause between installing the application and
    //   starting WebDriverAgent on the device. Used particularly for larger
    //   applications. Defaults to `0` | e.g., 8000
    ...(existy(opts.iosInstallPause) && {
      'appium:iosInstallPause': opts.iosInstallPause,
    }),

    // - Skips the build phase of running the WDA app. Building is then the
    //   responsibility of the user. Only works for Xcode 8+. Defaults to `false`.
    ...(existy(opts.usePrebuiltWDA) && {
      'appium:usePrebuiltWDA': opts.usePrebuiltWDA,
    }),

    // - Use default proxy for test management within WebDriverAgent. Setting
    //   this to false sometimes helps with socket hangup problems. Defaults to `true`.
    ...(existy(opts.shouldUseSingletonTestManager) && {
      'appium:shouldUseSingletonTestManager': opts.shouldUseSingletonTestManager,
    }),

    // - The amount of time in float seconds to wait until the application under
    //   test is idling. XCTest requires the app's main thread to be idling in
    //   order to execute any action on it, so WDA might not even start/freeze
    //   if the app under test is constantly hogging the main thread. The
    //   default value is `10` (seconds). Setting it to zero disables idling
    //   checks completely (not recommended) and has the same effect as setting
    //   waitForQuiescence to false. Available since Appium 1.20.0.
    ...(existy(opts.waitForIdleTimeout) && {
      'appium:waitForIdleTimeout': opts.waitForIdleTimeout,
    }),

    // - Use Xctestrun file to launch WDA. It will search for such file in
    //   bootstrapPath. Expected name of file is
    //   WebDriverAgentRunner_iphoneos<sdkVersion>-arm64.xctestrun for real
    //   device and
    //   WebDriverAgentRunner_iphonesimulator<sdkVersion>-x86_64.xctestrun for
    //   simulator. One can do build-for-testing for WebDriverAgent project for
    //   simulator and real device and then you will see Product Folder like
    //   this and you need to copy content of this folder at bootstrapPath
    //   location. Since this capability expects that you have already built WDA
    //   project, it neither checks whether you have necessary dependencies to
    //   build WDA nor will it try to build project. Defaults to `false`. Tips:
    //   Xcodebuild builds for the target platform version. We'd recommend you
    //   to build with minimal OS version which you'd like to run as the
    //   original WDA module. e.g. If you build WDA for 12.2, the module cannot
    //   run on iOS 11.4 because of loading some module error on simulator. A
    //   module built with 11.4 can work on iOS 12.2. (This is xcodebuild's
    //   expected behaviour.) | e.g., true
    ...(existy(opts.useXctestrunFile) && {
      'appium:useXctestrunFile': opts.useXctestrunFile,
    }),

    // - Build with build and run test with test in xcodebuild for all Xcode
    //   version if this is true, or build with build-for-testing and run tests
    //   with test-without-building for over Xcode 8 if this is false. Defaults
    //   to `false`.
    ...(existy(opts.useSimpleBuildTest) && {
      'appium:useSimpleBuildTest': opts.useSimpleBuildTest,
    }),

    // - Delays the invocation of -[XCUIApplicationProcess
    //   setEventLoopHasIdled:] by the number of seconds specified with this
    //   capability. This can help quiescence apps that fail to do so for no
    //   obvious reason (and creating a session fails for that reason). This
    //   increases the time for session creation because
    //   -[XCUIApplicationProcess setEventLoopHasIdled:] is called multiple
    //   times. If you enable this capability start with at least 3 seconds and
    //   try increasing it, if creating the session still fails. Defaults to `0`.
    ...(existy(opts.wdaEventloopIdleDelay) && {
      'appium:wdaEventloopIdleDelay': opts.wdaEventloopIdleDelay,
    }),

    // - Process arguments and environment which will be sent to the
    //   WebDriverAgent server. | { args: ["a", "b", "c"] , env: { "a": "b",
    //   "c": "d" } } or '{"args": ["a", "b", "c"], "env": { "a": "b", "c": "d"
    //   }}'
    ...(existy(opts.processArguments) && {
      'appium:processArguments': opts.processArguments,
    }),

    // - When set to false, prevents the application under test from being
    //   launched automatically as a part of the new session startup process.
    //   The launch become the responsibility of the user. Defaults to `true`.
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

    // - Allow xcodebuild to register your destination device on the developer
    //   portal if necessary. Requires a developer account to have been added in
    //   Xcode's Accounts preference pane. Defaults to `false`. | true or false
    ...(existy(opts.allowProvisioningDeviceRegistration) && {
      'appium:allowProvisioningDeviceRegistration': opts.allowProvisioningDeviceRegistration,
    }),

    // - Specify the path to the result bundle path as xcodebuild argument for
    //   WebDriverAgent build under a security flag (Please check Opt-in
    //   Features section below). WebDriverAgent process must start/stop every
    //   time to pick up changed value of this property. Specifying `useNewWDA` to
    //   true may help there. Please read man xcodebuild for more details.
    //   e.g. /path/to/resultbundle
    ...(existy(opts.resultBundlePath) && {
      'appium:resultBundlePath': opts.resultBundlePath,
    }),

    // - Specify the version of result bundle as xcodebuild argument for
    //   WebDriverAgent build. The default value depends on your Xcode version.
    //   Please read man xcodebuild for more details. | e.g.
    //   /path/to/resultbundle
    ...(existy(opts.resultBundleVersion) && {
      'appium:resultBundleVersion': opts.resultBundleVersion,
    }),

    // - Maximum frequency of keystrokes for typing and clear. If your tests are
    //   failing because of typing errors, you may want to adjust this. Defaults
    //   to `60` keystrokes per minute. | e.g., 30
    ...(existy(opts.maxTypingFrequency) && {
      'appium:maxTypingFrequency': opts.maxTypingFrequency,
    }),

    // - Use native methods for determining visibility of elements. In some
    //   cases this takes a long time. Setting this capability to false will
    //   cause the system to use the position and size of elements to make sure
    //   they are visible on the screen. This can, however, lead to false
    //   results in some situations. Defaults to false, except iOS 9.3, where it
    //   defaults to `true`.
    ...(existy(opts.simpleIsVisibleCheck) && {
      'appium:simpleIsVisibleCheck': opts.simpleIsVisibleCheck,
    }),

    // - It allows to turn on/off waiting for application quiescence in
    //   WebDriverAgent, while performing queries. The default value is `true`.
    //   You can avoid this kind of issues if you turn it off. Consider using
    //   `waitForIdleTimeout` capability instead for this purpose since Appium
    //   1.20.0.
    ...(existy(opts.waitForQuiescence) && {
      'appium:waitForQuiescence': opts.waitForQuiescence,
    }),

    // - The port number on which WDA broadcasts screenshots stream encoded into
    //   MJPEG format from the device under test. It might be necessary to
    //   change this value if the default port is busy because of other tests
    //   running in parallel. Default value: `9100` | e.g. 12000
    ...(existy(opts.mjpegServerPort) && {
      'appium:mjpegServerPort': opts.mjpegServerPort,
    }),

    // - Changes the quality of phone display screenshots following
    //   xctest/xctimagequality Default value is `1`. 0 is the highest and 2 is
    //   the lowest quality. You can also change it via settings command. 0
    //   might cause OutOfMemory crash on high-resolution devices like iPad Pro.
    ...(existy(opts.screenshotQuality) && {
      'appium:screenshotQuality': opts.screenshotQuality,
    }),

    // - Accept all iOS alerts automatically if they pop up. This includes
    //   privacy access permission alerts (e.g., location, contacts, photos).
    //   Default is `false`.
    ...(existy(opts.autoAcceptAlerts) && {
      'appium:autoAcceptAlerts': opts.autoAcceptAlerts,
    }),

    // - Dismiss all iOS alerts automatically if they pop up. This includes
    //   privacy access permission alerts (e.g., location, contacts, photos).
    //   Default is `false`.
    ...(existy(opts.autoDismissAlerts) && {
      'appium:autoDismissAlerts': opts.autoDismissAlerts,
    }),

    // - Disable automatic screenshots taken by XCTest at every interaction.
    //   Default is up to WebDriverAgent's config to decide, which currently
    //   defaults to `true`.
    ...(existy(opts.disableAutomaticScreenshots) && {
      'appium:disableAutomaticScreenshots': opts.disableAutomaticScreenshots,
    }),

    // - Set this capability to false in order to use the custom elements
    //   caching strategy. This might help to avoid stale element exception on
    //   property change. By default the native XCTest cache resolution is used
    //   (true) for all native locators (e.g. all, but xpath). Check the
    //   corresponding WebDriverAgent pull request for more details.
    ...(existy(opts.useNativeCachingStrategy) && {
      'appium:useNativeCachingStrategy': opts.useNativeCachingStrategy,
    }),

    // NOTE: This might not be valid setting any longer:
    // - Build the WebdriverAgent project before launching it on the device. If you
    //   know it has been built before and not modified, this step could be skipped.
    //   Defaults to `true`.
    ...(existy(opts.prebuildWDA) && {
      'appium:prebuildWDA': opts.prebuildWDA,
    }),
  }
}

export const buildSimulator = ({
  ...opts
} = {}) => {
  return {
    // - Start a test in a certain orientation | LANDSCAPE or PORTRAIT
    ...(existy(opts.deviceOrientation) && {
      'appium:orientation': opts.deviceOrientation,
    }),

    // - Simulator scale factor. This is useful to have if the default
    //   resolution of simulated device is greater than the actual display
    //   resolution. So you can scale the simulator to see the whole device
    //   screen without scrolling. | Acceptable values for simulators running
    //   Xcode SDK 8 and older are: '1.0', '0.75', '0.5', '0.33' and '0.25',
    //   where '1.0' means 100% scale. For simulators running Xcode SDK 9 and
    //   above the value could be any valid positive float number. The
    //   capability must be of a string type.
    ...(existy(opts.scaleFactor) && {
      'appium:scaleFactor': opts.scaleFactor,
    }),

    // - Set this option to true in order to enable hardware keyboard in
    //   Simulator. It is set to false by default, because this helps to
    //   workaround some XCTest bugs. | true or false
    ...(existy(opts.connectHardwareKeyboard) && {
      'appium:connectHardwareKeyboard': opts.connectHardwareKeyboard,
    }),

    // - Set this to true if you want to enable calendar access on IOS Simulator
    //   with given bundleId. Set to false, if you want to disable calendar
    //   access on IOS Simulator with given bundleId. If not set, the calendar
    //   authorization status will not be set. | e.g., true
    ...(existy(opts.calendarAccessAuthorized) && {
      'appium:calendarAccessAuthorized': opts.calendarAccessAuthorized,
    }),

    // - Calendar format to set for the iOS Simulator | e.g. gregorian
    ...(existy(opts.calendarFormat) && {
      'appium:calendarFormat': opts.calendarFormat,
    }),

    // - Set this capability to true if automated tests are running on Simulator
    //   and the device display is not needed to be visible. This only has an
    //   effect since Xcode9 and only for simulators. All running instances of
    //   Simulator UI are going to be automatically terminated if headless test
    //   is started. false is the default value. | e.g., true
    ...(existy(opts.isHeadless) && {
      'appium:isHeadless': opts.isHeadless,
    }),

    // - Allows to explicitly set the coordinates of Simulator window center for
    //   Xcode9+ SDK. This capability only has an effect if Simulator window has
    //   not been opened yet for the current session before it started. | e.g.
    //   {-100.0,100.0} or {500,500}, spaces are not allowed
    // 'appium:simulatorWindowCenter': '',

    // - Allows to change the default timeout for Simulator startup. By default
    //   this value is set to 120000ms (2 minutes), although the startup could
    //   take longer on a weak hardware or if other concurrent processes use
    //   much system resources during the boot up procedure. | e.g. 300000
    ...(existy(opts.simulatorStartupTimeout) && {
      'appium:simulatorStartupTimeout': opts.simulatorStartupTimeout,
    }),

    // - Whether to highlight pointer moves in the Simulator window. The
    //   Simulator UI client must be shut down before the session startup in
    //   order for this capability to be applied properly. false by default.
    //   e.g. true
    ...(existy(opts.simulatorTracePointer) && {
      'appium:simulatorTracePointer': opts.simulatorTracePointer,
    }),

    // - If this capability set to true and the current device under test is an
    //   iOS Simulator then Appium will try to shutdown all the other running
    //   Simulators before to start a new session. This might be useful while
    //   executing webview tests on different devices, since only one device can
    //   be debugged remotely at once due to an Apple bug. The capability only
    //   has an effect if --relaxed-security command line argument is provided
    //   to the server. Defaults to `false`. | e.g. true
    ...(existy(opts.shutdownOtherSimulators) && {
      'appium:shutdownOtherSimulators': opts.shutdownOtherSimulators,
    }),

    // - Creates a new simulator in session creation and deletes it in session
    //   deletion. Defaults to false. | true or false
    ...(existy(opts.enforceFreshSimulatorCreation) && {
      'appium:enforceFreshSimulatorCreation': opts.enforceFreshSimulatorCreation,
    }),

    // - Set the capability to true in order to preserve Simulator keychains
    //   folder after full reset. This feature has no effect on real devices.
    //   Defaults to `false` | e.g. true
    ...(existy(opts.keepKeyChains) && {
      'appium:keepKeyChains': opts.keepKeyChains,
    }),

    // - This capability accepts comma-separated path patterns, which are going
    //   to be excluded from keychains restore while full reset is being
    //   performed on Simulator. It might be useful if you want to exclude only
    //   particular keychain types from being restored, like the applications
    //   keychain. This feature has no effect on real devices. | e.g.
    //   *keychain*.db* to exclude applications keychain from being restored
    ...(existy(opts.keychainsExcludePatterns) && {
      'appium:keychainsExcludePatterns': opts.keychainsExcludePatterns,
    }),

    // - It allows to turn on/off reduce motion accessibility preference.
    //   Setting reduceMotion on helps to reduce flakiness during tests. Only on
    //   simulators | e.g true
    ...(existy(opts.reduceMotion) && {
      'appium:reduceMotion': opts.reduceMotion,
    }),

    // - Allows to set permissions for the specified application bundle on
    //   Simulator only. The capability value is expected to be a valid JSON
    //   string with {"<bundleId1>": {"<serviceName1>": "<serviceStatus1>",
    //   ...}, ...} format. Since Xcode SDK 11.4 Apple provides native APIs to
    //   interact with application settings. Check the output of xcrun simctl
    //   privacy booted command to get the list of available permission names.
    //   Use yes, no and unset as values in order to grant, revoke or reset the
    //   corresponding permission. Below Xcode SDK 11.4 it is required that
    //   applesimutils package is installed and available in PATH. The list of
    //   available service names and statuses can be found at
    //   https://github.com/wix/AppleSimulatorUtils. | e. g.
    //   {"com.apple.mobilecal": {"calendar": "YES"}}
    // 'appium:permissions': '',

    // - Set the --predicate flag in the ios simulator logs | e.g.: 'process !=
    //   "locationd" AND process != "DTServiceHub"' AND process !=
    //   "mobileassetd"
    ...(existy(opts.iosSimulatorLogsPredicate) && {
      'appium:iosSimulatorLogsPredicate': opts.iosSimulatorLogsPredicate,
    }),

    // - Handle the -PasteboardAutomaticSync flag when simulator process
    //   launches. It could improve launching simulator performance not to sync
    //   pasteboard with the system when this value is off. on forces the flag
    //   enabled. system does not provide the flag to the launching command. on,
    //   off, or system is available. They are case insensitive. Defaults to off
    //   | e.g. system
    ...(existy(opts.simulatorPasteboardAutomaticSync) && {
      'appium:simulatorPasteboardAutomaticSync': opts.simulatorPasteboardAutomaticSync,
    }),

    // - This capability allows to set an alternative path to the simulator
    //   devices set in case you have multiple sets deployed on your local
    //   system. Such feature could be useful if you, for example, would like to
    //   save disk space on the main system volume. | e.g. /MyVolume/Devices
    ...(existy(opts.simulatorDevicesSetPath) && {
      'appium:simulatorDevicesSetPath': opts.simulatorDevicesSetPath,
    }),

    // - Adds a root SSL certificate to IOS Simulator. | e.g. -----BEGIN
    //   CERTIFICATE-----MIIFWjCCBEKg...-----END CERTIFICATE-----
    ...(existy(opts.customSSLCert) && {
      'appium:customSSLCert': opts.customSSLCert,
    }),

    // - (Real device only) Set the time, in ms, to wait for a response from
    //   WebKit in a Safari session. Defaults to 5000 | e.g., 10000
    ...(existy(opts.webkitResponseTimeout) && {
      'appium:webkitResponseTimeout': opts.webkitResponseTimeout,
    }),
  }
}

export const buildWebSettings = ({
  ...opts
} = {}) => {
  return {
    // - This capability will direct the Get Element Location command, when used
    //   within webviews, to return coordinates which are relative to the origin
    //   of the page, rather than relative to the current scroll offset. This
    //   capability has no effect outside of webviews. Default false. | e.g.,
    //   true
    ...(existy(opts.absoluteWebLocations) && {
      'appium:absoluteWebLocations': opts.absoluteWebLocations,
    }),

    // - Turns on/off Web Inspector garbage collection when executing scripts on
    //   Safari. Turning on may improve performance. Defaults to false. | true
    //   or false
    ...(existy(opts.safariGarbageCollect) && {
      'appium:safariGarbageCollect': opts.safariGarbageCollect,
    }),

    // - Add Safari web contexts to the list of contexts available during a
    //   native/webview app test. This is useful if the test opens Safari and
    //   needs to be able to interact with it. Defaults to false. | true or
    //   false
    ...(existy(opts.includeSafariInWebviews) && {
      'appium:includeSafariInWebviews': opts.includeSafariInWebviews,
    }),

    // - Log all plists sent to and received from the Web Inspector, as plain
    //   text. For some operations this can be a lot of data, so it is
    //   recommended to be used only when necessary. Defaults to false. | true
    //   or false
    ...(existy(opts.safariLogAllCommunication) && {
      'appium:safariLogAllCommunication': opts.safariLogAllCommunication,
    }),

    // - Log all communication sent to and received from the Web Inspector, as
    //   raw hex dump and printable characters. This logging is done before any
    //   data manipulation, and so can elucidate some communication issues. Like
    //   appium:safariLogAllCommunication, this can produce a lot of data in
    //   some cases, so it is recommended to be used only when necessary.
    //   Defaults to false. | true or false
    ...(existy(opts.safariLogAllCommunicationHexDump) && {
      'appium:safariLogAllCommunicationHexDump': opts.safariLogAllCommunicationHexDump,
    }),

    // - The size, in bytes, of the data to be sent to the Web Inspector on iOS
    //   11+ real devices. Some devices hang when sending large amounts of data
    //   to the Web Inspector, and breaking them into smaller parts can be
    //   helpful in those cases. Defaults to 16384 (also the maximum possible)
    //   e.g., 1000
    ...(existy(opts.safariSocketChunkSize) && {
      'appium:safariSocketChunkSize': opts.safariSocketChunkSize,
    }),

    // - The maximum size in bytes of a single data frame for the Web Inspector.
    //   Too high values could introduce slowness and/or memory leaks. Too low
    //   values could introduce possible buffer overflow exceptions. Defaults to
    //   20MB (20*1024*1024) | e.g. 1024, 100*1024*1024
    ...(existy(opts.safariWebInspectorMaxFrameLength) && {
      'appium:safariWebInspectorMaxFrameLength': opts.safariWebInspectorMaxFrameLength,
    }),

    // - Array (or JSON array) of possible bundle identifiers for webviews. This
    //   is sometimes necessary if the Web Inspector is found to be returning a
    //   modified bundle identifier for the app. Defaults to [] | e.g.,
    //   ['io.appium.modifiedId', 'ABCDEF']
    // 'appium:additionalWebviewBundleIds': [],

    // - The time to wait, in ms, for the initial presence of webviews in
    //   MobileSafari or hybrid apps. Defaults to 0 | e.g., '5000'
    ...(existy(opts.webviewConnectTimeout) && {
      'appium:webviewConnectTimeout': opts.webviewConnectTimeout,
    }),

    // - Provide a list of hostnames (comma-separated) that the Safari
    //   automation tools should ignore. This is to provide a workaround to
    //   prevent a webkit bug where the web context is unintentionally changed
    //   to a 3rd party website and the test gets stuck. The common culprits are
    //   search engines (yahoo, bing, google) and about:blank | e.g.
    //   'www.yahoo.com, www.bing.com, www.google.com, about:blank'
    ...(existy(opts.safariIgnoreWebHostnames) && {
      'appium:safariIgnoreWebHostnames': opts.safariIgnoreWebHostnames,
    }),

    // - Enable native, non-javascript-based taps being in web context mode.
    //   Defaults to false. Warning: sometimes the preciseness of native taps
    //   could be broken, because there is no reliable way to map web element
    //   coordinates to native ones. | true
    ...(existy(opts.nativeWebTap) && {
      'appium:nativeWebTap': opts.nativeWebTap,
    }),

    // - Enforce native taps to be done by XCUITest driver rather than
    //   WebDriverAgent. Only applicable if nativeWebTap is enabled. false by
    //   default | false
    ...(existy(opts.nativeWebTapStrict) && {
      'appium:nativeWebTapStrict': opts.nativeWebTapStrict,
    }),

    // - Initial safari url, default is a local welcome page | e.g.
    //   https://www.github.com
    ...(existy(opts.safariInitialUrl) && {
      'appium:safariInitialUrl': opts.safariInitialUrl,
    }),

    // - Allow javascript to open new windows in Safari. Default keeps current
    //   sim setting | true or false
    ...(existy(opts.safariAllowPopups) && {
      'appium:safariAllowPopups': opts.safariAllowPopups,
    }),

    // - Prevent Safari from showing a fraudulent website warning. Default keeps
    //   current sim setting. | true or false
    ...(existy(opts.safariIgnoreFraudWarning) && {
      'appium:safariIgnoreFraudWarning': opts.safariIgnoreFraudWarning,
    }),

    // - Whether Safari should allow links to open in new windows. Default keeps
    //   current sim setting. | true or false
    ...(existy(opts.safariOpenLinksInBackground) && {
      'appium:safariOpenLinksInBackground': opts.safariOpenLinksInBackground,
    }),

    // - Number of times to send connection message to remote debugger, to get
    //   webview. Default: 8 | e.g., 12
    ...(existy(opts.webviewConnectRetries) && {
      'appium:webviewConnectRetries': opts.webviewConnectRetries,
    }),

    // - (Real device only) Set the time, in ms, to wait for a response from
    //   WebKit in a Safari session. Defaults to 5000 | e.g., 10000
    ...(existy(opts.webkitResponseTimeout) && {
      'appium:webkitResponseTimeout': opts.webkitResponseTimeout,
    }),

    // - Capability to allow simulators to execute asynchronous JavaScript on
    //   pages using HTTPS. Defaults to false | true or false
    ...(existy(opts.enableAsyncExecuteFromHttps) && {
      'appium:enableAsyncExecuteFromHttps': opts.enableAsyncExecuteFromHttps,
    }),

    // - Returns the detailed information on contexts for the get available
    //   context command. If this capability is enabled, then each item in the
    //   returned contexts list would additionally include WebView title, full
    //   URL and the bundle identifier. Defaults to false. | true or false
    ...(existy(opts.fullContextList) && {
      'appium:fullContextList': opts.fullContextList,
    }),

    // - Enable Safari's performance logging (default false) | true, false
    ...(existy(opts.enablePerformanceLogging) && {
      'appium:enablePerformanceLogging': opts.enablePerformanceLogging,
    }),

    // - Move directly into Webview context if available. Default false | true,
    //   false
    ...(existy(opts.autoWebview) && {
      'appium:autoWebview': opts.autoWebview,
    }),
  }
}

export const buildOther = ({
  ...opts
} = {}) => {
  return {
    // - Whether to perform reset on test session finish (false) or not (true).
    //   Keeping this variable set to true and Simulator running (the default
    //   behaviour since version 1.6.4) may significantly shorten the duration
    //   of test session initialization. | Either true or false. Defaults to
    //   true
    ...(existy(opts.resetOnSessionStartOnly) && {
      'appium:resetOnSessionStartOnly': opts.resetOnSessionStartOnly,
    }),

    // - Custom timeout(s) in milliseconds for WDA backend commands execution.
    //   This might be useful if WDA backend freezes unexpectedly or requires
    //   too much time to fail and blocks automated test execution. The value is
    //   expected to be of type string and can either contain max milliseconds
    //   to wait for each WDA command to be executed before terminating the
    //   session forcefully or a valid JSON string, where keys are internal
    //   Appium command names (you can find these in logs, look for "Executing
    //   command 'command_name'" records) and values are timeouts in
    //   milliseconds. You can also set the 'default' key to assign the timeout
    //   for all other commands not explicitly enumerated as JSON keys.
    //   '120000', '{"findElement": 40000, "findElements": 40000, "setValue":
    //   20000, "default": 120000}'
    // 'appium:commandTimeouts': '',

    // - Get JSON source from WDA and transform it to XML on the Appium server
    //   side. Defaults to false. | e.g., true
    ...(existy(opts.useJSONSource) && {
      'appium:useJSONSource': opts.useJSONSource,
    }),

    // - Skips to start capturing logs such as crash, system, safari console and
    //   safari network. It might improve performance such as network. Log
    //   related commands will not work. Defaults to false. | true or false
    ...(existy(opts.skipLogCapture) && {
      'appium:skipLogCapture': opts.skipLogCapture,
    }),

    // - Launch WebDriverAgentRunner with idb instead of xcodebuild. This could
    //   save a significant amout of time by skiping the xcodebuild process,
    //   although the idb might not be very reliable, especially with fresh
    //   Xcode SDKs. Check the idb repository for more details on possible
    //   compatibility issues. Defaults to false | true or false
    ...(existy(opts.launchWithIDB) && {
      'appium:launchWithIDB': opts.launchWithIDB,
    }),

    // - Whether to show any logs captured from a device in the appium logs.
    //   Default false | true or false
    ...(existy(opts.showIOSLog) && {
      'appium:showIOSLog': opts.showIOSLog,
    }),

    // - Whether to clean temporary XCTest files (for example logs) when a
    //   testing session is closed. false by default | true or false
    ...(existy(opts.clearSystemFiles) && {
      'appium:clearSystemFiles': opts.clearSystemFiles,
    }),

    // - How long (in seconds) the driver should wait for a new command from the
    //   client before assuming the client has stopped sending requests. After
    //   the timeout the session is going to be deleted. 60 seconds by default.
    //   Setting it to zero disables the timer. | e.g. 100
    ...(existy(opts.newCommandTimeout) && {
      'appium:newCommandTimeout': opts.newCommandTimeout,
    }),
  }
}

export const buildSettings = ({
  ...opts
} = {}) => {
  return {
    // - Comma-separated list of element attribute names to be included into
    //   findElement response. By default only element UUID is present there,
    //   but it is also possible to add the following items: `name`, `text`,
    //   `rect`, `enabled`, `displayed`, `selected`,
    //   `attribute/<element_attribute_name>`. It is required that
    //   `shouldUseCompactResponses` setting is set to `false` in order for this
    //   one to apply.
    // 'appium:settings[elementResponseAttributes]': '',

    // - Used in combination with elementResponseAttributes setting. If set to
    //   false then the findElement response is going to include the items
    //   enumerated in elementResponseAttributes setting. true by default
    // 'appium:settings[shouldUseCompactResponses]': true,

    // - See the description of the corresponding capability.
    // 'appium:settings[screenshotQuality]': 0,

    // - The maximum count of screenshots per second taken by the MJPEG
    //   screenshots broadcaster. Must be in range 1..60. 10 by default
    // 'appium:settings[mjpegServerFramerate]': 10,

    // - The percentage value used to apply downscaling on the screenshots
    //   generated by the MJPEG screenshots broadcaster. Must be in range
    //   1..100. 100 is by default, which means that screenshots are not
    //   downscaled.
    // 'appium:settings[mjpegScalingFactor]': 100,

    // - The percentage value used to apply lossy JPEG compression on the
    //   screenshots generated by the MJPEG screenshots broadcaster. Must be in
    //   range 1..100. 25 is by default, which means that screenshots are
    //   compressed to the quarter of their original quality.
    // 'appium:settings[mjpegServerScreenshotQuality]': 25,

    // - Set how much time in float seconds is allowed to resolve a single
    //   accessibility snapshot with custom attributes. Snapshots are mainly
    //   used for page source generation, XML lookup and custom attributes
    //   retrieval (these are visibility and accessibility ones). It might be
    //   necessary to increase this value if the actual page source is very
    //   large and contains hundreds of UI elements. Defaults to 15 seconds.
    //   Since Appium 1.19.1 if this timeout expires and no custom snapshot
    //   could be made then WDA tries to calculate the missing attributes using
    //   its own algorithms, so setting this value to zero might speed up, for
    //   example, page source retrieval, but for the cost of preciseness of some
    //   element attributes.
    // 'appium:settings[customSnapshotTimeout]': 15,

    // - Has the same meaning as corresponding capability (see above)
    // 'appium:settings[waitForIdleTimeout]': 15,

    // - The amount of time in float seconds to wait until the application under
    //   test does not have any active animations. This check is usually applied
    //   after each automation action that is supposed to change the state of
    //   the application under test, like click one, and blocks XCTest until the
    //   transition of the tested application to a new state completes or the
    //   cool off timeout occurs. The default value is 2 (seconds). Setting it
    //   to zero disables animation checks completely.
    // 'appium:settings[animationCoolOffTimeout]': 2,

    // - Changes the value of maximum depth for traversing elements source tree.
    //   It may help to prevent out of memory or timeout errors while getting
    //   the elements source tree, but it might restrict the depth of source
    //   tree. Please consider restricting this value if you observed an error
    //   like Timed out snapshotting com.apple.testmanagerd... message or Cannot
    //   get 'xml' source of the current application in your Appium log since
    //   they are possibly timeout related. A part of elements source tree might
    //   be lost if the value was too small. Defaults to 50
    // 'appium:settings[snapshotMaxDepth]': 50,

    // - Enabling this setting makes single element lookups faster, but there is
    //   the known problem related to nested elements lookup. Defaults to false.
    // 'appium:settings[useFirstMatch]': false,

    // - Changes the 'reduce motion' preference of accessibility feature.
    //   Defaults to false
    // 'appium:settings[reduceMotion]': false,

    // - Sets the hint for active application selection. This helps
    //   WebDriverAgent to select the current application if there are multiple
    //   items in the active applications list and the desired one is also one
    //   of them. The setting is particularly useful for split-screen apps
    //   automation. Defaults to auto, which makes WebDriverAgent to select the
    //   application whose element is located at screenPoint location or a
    //   single item from the active apps list if the length of this list is
    //   equal to one.
    // 'appium:settings[defaultActiveApplication]': 'auto',

    // - Defines the coordinates of the current screen point. WebDriverAgent
    //   uses this point to detect the active application if multiple
    //   application are active on the screen. The format of this value is x,y,
    //   where x and y are float or integer numbers representing valid screen
    //   coordinates. Setting this value to a point outside the actual screen
    //   coordinates might corrupt WebDriverAgent functionality. By default the
    //   screen point coordinates equal to 20% of the minimum screen dimension
    //   each, e.g. MIN(w, h) * 0.2, MIN(w, h) * 0.2
    // 'appium:settings[activeAppDetectionPoint]': 0,

    // - Whether returns all of elements including no modal dialogs on iOS 13+.
    //   It fixes cannot find elements on nested modal presentations, but it
    //   might make visibility attributes unreliable. You could also enable
    //   shouldUseTestManagerForVisibilityDetection setting (defaults to false)
    //   or simpleIsVisibleCheck capability to improve the visibility detection.
    //   This issue may happen between iOS 13.0 to 13.2 (Xcode 11.0 to 11.2).
    //   The query issued in includeNonModalElements returns nil with newer
    //   iOS/Xcode versions and Appium/WDA return proper elements three without
    //   this setting being used. Defaults to false.
    // 'appium:settings[includeNonModalElements]': false,

    // - Allows to customize accept alert button selector. It helps you to
    //   handle an arbitrary element as accept button in accept alert command.
    //   The selector should be a valid class chain expression, where the search
    //   root is the alert element itself. The default button location algorithm
    //   is used if the provided selector is wrong or does not match any
    //   element. Example: **/XCUIElementTypeButton[`label CONTAINS[c]
    //   'accept'`]
    // 'appium:settings[acceptAlertButtonSelector]': '',

    // - Allows to customize dismiss alert button selector. It helps you to
    //   handle an arbitrary element as dismiss button in dismiss alert command.
    //   The selector should be a valid class chain expression, where the search
    //   root is the alert element itself. The default button location algorithm
    //   is used if the provided selector is wrong or does not match any
    //   element. Example: **/XCUIElementTypeButton[`label CONTAINS[c]
    //   'dismiss'`]
    // 'appium:settings[dismissAlertButtonSelector]': '',

    // - Adjust screenshot orientation for iOS. Appium tries to return a
    //   screenshot and adjust its orientation properly using internal
    //   heuristics, but sometimes it does not work, especially in landscape
    //   mode. The actual screenshot orientation depends on various factors such
    //   as OS versions, model versions and whether this is a real or simulator
    //   device. This option allows you to enforce the given image orientation.
    //   Acceptable values: auto (default), portrait, portraitUpsideDown,
    //   landscapeRight, landscapeLeft.
    // 'appium:settings[screenshotOrientation]': 'auto',

    // - Whether to look up elements with allElementsBoundByAccessibilityElement
    //   (default) or allElementsBoundByIndex. This Stack Overflow topic
    //   explains the differences. Defaults to false.
    // 'appium:settings[boundElementsByIndex]': false,

    // - Changes the 'Auto-Correction' preference in Keyboards setting. Defaults
    //   to false.
    // 'appium:settings[keyboardAutocorrection]': false,

    // - Changes the 'Predictive' preference in Keyboards setting. Defaults to
    //   false.
    // 'appium:settings[keyboardPrediction]': false,

    // - See the description of the corresponding capability.
    // 'appium:settings[nativeWebTap]': '',

    // - See the description of the corresponding capability.
    // 'appium:settings[nativeWebTapStrict]': '',

    // - See the description of the corresponding capability.
    // 'appium:settings[useJSONSource]': '',
  }
}
