module.exports = {
  "api": [
    {
      "type": "category",
      "label": "Classes",
      "items": [
        "api/classes/BrowserPage",
        "api/classes/NativeBase",
        "api/classes/NativeCarousel",
        "api/classes/SauceCommentReporter"
      ]
    },
    {
      "type": "category",
      "label": "Functions",
      "items": [
        "api/functions/before",
        "api/functions/buildJunitSettings",
        "api/functions/buildLogger",
        "api/functions/buildReportPortalSettings",
        "api/functions/buildSauceCommentSettings",
        "api/functions/buildSpecSettings",
        "api/functions/buildWdioConfig",
        "api/functions/calcBaseUrl",
        "api/functions/calcHostname",
        "api/functions/existy",
        "api/functions/formatPkgName",
        "api/functions/generateScreenshotName",
        "api/functions/isChrome",
        "api/functions/isElement",
        "api/functions/isFirefox",
        "api/functions/isJasmine",
        "api/functions/isMobile",
        "api/functions/isMocha",
        "api/functions/isReportPortalReporter",
        "api/functions/isSauceCommentReporter",
        "api/functions/isSauceJob",
        "api/functions/parseBool",
        "api/functions/parseJunitSettings",
        "api/functions/parseList",
        "api/functions/parseReportPortalSettings",
        "api/functions/parseSauceCommentSettings",
        "api/functions/parseSpecSettings",
        "api/functions/parseString",
        "api/functions/parseWhole",
        "api/functions/setupJunitConfig",
        "api/functions/setupLocalAndroidBrowser",
        "api/functions/setupLocalDesktopBrowsers",
        "api/functions/setupLocalDesktopChrome",
        "api/functions/setupLocalDesktopSafari",
        "api/functions/setupLocalDeviceBrowsers",
        "api/functions/setupLocaliOSBrowser",
        "api/functions/setupLocalNativeAndroid",
        "api/functions/setupLocalNativeApp",
        "api/functions/setupLocalNativeIos",
        "api/functions/setupReportPortalConfig",
        "api/functions/setupSauceAndroidBrowser",
        "api/functions/setupSauceCommentConfig",
        "api/functions/setupSauceDesktopBrowsers",
        "api/functions/setupSauceDesktopChrome",
        "api/functions/setupSauceDesktopSafari",
        "api/functions/setupSauceDeviceBrowsers",
        "api/functions/setupSauceiOSBrowser",
        "api/functions/setupSauceNativeAndroid",
        "api/functions/setupSauceNativeApp",
        "api/functions/setupSauceNativeIos",
        "api/functions/setupSpecConfig",
        "api/functions/timeDifference"
      ]
    },
    {
      "type": "category",
      "label": "Swarmdriver",
      "items": [
        {
          "type": "category",
          "label": "Namespaces",
          "items": [
            {
              "type": "category",
              "label": "BrowserOverwrites",
              "items": [
                {
                  "type": "category",
                  "label": "Functions",
                  "items": [
                    "api/swarmdriver/namespaces/browserOverwrites/functions/click"
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "BrowserUtils",
              "items": [
                {
                  "type": "category",
                  "label": "Functions",
                  "items": [
                    "api/swarmdriver/namespaces/browserUtils/functions/getCenterCoordsForElement",
                    "api/swarmdriver/namespaces/browserUtils/functions/isPartMatch",
                    "api/swarmdriver/namespaces/browserUtils/functions/open",
                    "api/swarmdriver/namespaces/browserUtils/functions/openAndWaitForUrl",
                    "api/swarmdriver/namespaces/browserUtils/functions/waitAnd",
                    "api/swarmdriver/namespaces/browserUtils/functions/waitAndClick",
                    "api/swarmdriver/namespaces/browserUtils/functions/waitAndSetValue",
                    "api/swarmdriver/namespaces/browserUtils/functions/waitForAnimation",
                    "api/swarmdriver/namespaces/browserUtils/functions/waitForPageFullyLoaded",
                    "api/swarmdriver/namespaces/browserUtils/functions/waitForUrl"
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "Enums",
              "items": [
                {
                  "type": "category",
                  "label": "Functions",
                  "items": [
                    "api/swarmdriver/namespaces/enums/functions/isLocalMode",
                    "api/swarmdriver/namespaces/enums/functions/isLocalNativeMode",
                    "api/swarmdriver/namespaces/enums/functions/isSauceMode",
                    "api/swarmdriver/namespaces/enums/functions/isSauceNativeMode",
                    "api/swarmdriver/namespaces/enums/functions/parseAppiumAppState",
                    "api/swarmdriver/namespaces/enums/functions/parseAppiumLogLevel",
                    "api/swarmdriver/namespaces/enums/functions/parseBrowser",
                    "api/swarmdriver/namespaces/enums/functions/parseContextRef",
                    "api/swarmdriver/namespaces/enums/functions/parseDevice",
                    "api/swarmdriver/namespaces/enums/functions/parseDocReadyState",
                    "api/swarmdriver/namespaces/enums/functions/parseLogLevel",
                    "api/swarmdriver/namespaces/enums/functions/parseReporter",
                    "api/swarmdriver/namespaces/enums/functions/parseSauceBrowser",
                    "api/swarmdriver/namespaces/enums/functions/parseSauceMacBrowserResolution",
                    "api/swarmdriver/namespaces/enums/functions/parseSaucePlatform",
                    "api/swarmdriver/namespaces/enums/functions/parseSauceWindowsBrowserResolution",
                    "api/swarmdriver/namespaces/enums/functions/parseService",
                    "api/swarmdriver/namespaces/enums/functions/parseTestMode"
                  ]
                },
                {
                  "type": "category",
                  "label": "Variables",
                  "items": [
                    "api/swarmdriver/namespaces/enums/variables/AppiumAppState",
                    "api/swarmdriver/namespaces/enums/variables/AppiumLogLevel",
                    "api/swarmdriver/namespaces/enums/variables/Browser",
                    "api/swarmdriver/namespaces/enums/variables/ContextRef",
                    "api/swarmdriver/namespaces/enums/variables/Device",
                    "api/swarmdriver/namespaces/enums/variables/DocumentReadyState",
                    "api/swarmdriver/namespaces/enums/variables/LogLevel",
                    "api/swarmdriver/namespaces/enums/variables/Reporter",
                    "api/swarmdriver/namespaces/enums/variables/SauceBrowser",
                    "api/swarmdriver/namespaces/enums/variables/SauceMacBrowserResolution",
                    "api/swarmdriver/namespaces/enums/variables/SaucePlatform",
                    "api/swarmdriver/namespaces/enums/variables/SauceWindowsBrowserResolution",
                    "api/swarmdriver/namespaces/enums/variables/ScrollDirection",
                    "api/swarmdriver/namespaces/enums/variables/Service",
                    "api/swarmdriver/namespaces/enums/variables/TestMode"
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "NativeAlert",
              "items": [
                {
                  "type": "category",
                  "label": "Functions",
                  "items": [
                    "api/swarmdriver/namespaces/nativeAlert/functions/getNativeAlert",
                    "api/swarmdriver/namespaces/nativeAlert/functions/getNativeAlertText",
                    "api/swarmdriver/namespaces/nativeAlert/functions/pressNativeAlertButton",
                    "api/swarmdriver/namespaces/nativeAlert/functions/waitForNativeAlertIsShown"
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "NativeGestures",
              "items": [
                {
                  "type": "category",
                  "label": "Functions",
                  "items": [
                    "api/swarmdriver/namespaces/nativeGestures/functions/checkIfDisplayedWithScrollDown",
                    "api/swarmdriver/namespaces/nativeGestures/functions/dragAndDrop",
                    "api/swarmdriver/namespaces/nativeGestures/functions/pinchAndZoom",
                    "api/swarmdriver/namespaces/nativeGestures/functions/scrollAction",
                    "api/swarmdriver/namespaces/nativeGestures/functions/scrollActionDown",
                    "api/swarmdriver/namespaces/nativeGestures/functions/scrollToElement",
                    "api/swarmdriver/namespaces/nativeGestures/functions/scrollToElements",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipe",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeAction",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeActionPercentage",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeDown",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeItemLeft",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeLeft",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeOnDirection",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeOnDirectionDown",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeOnPercentage",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipePercentage",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeRight",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeToNextScreen",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeToPrevScreen",
                    "api/swarmdriver/namespaces/nativeGestures/functions/swipeUp"
                  ]
                },
                {
                  "type": "category",
                  "label": "Interfaces",
                  "items": [
                    "api/swarmdriver/namespaces/nativeGestures/interfaces/Coordinates",
                    "api/swarmdriver/namespaces/nativeGestures/interfaces/ScreenSize"
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "NativePicker",
              "items": [
                {
                  "type": "category",
                  "label": "Functions",
                  "items": [
                    "api/swarmdriver/namespaces/nativePicker/functions/selectPickerValue",
                    "api/swarmdriver/namespaces/nativePicker/functions/waitForPickerIsShown"
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "NativeUtils",
              "items": [
                {
                  "type": "category",
                  "label": "Functions",
                  "items": [
                    "api/swarmdriver/namespaces/nativeUtils/functions/allowPermissions",
                    "api/swarmdriver/namespaces/nativeUtils/functions/androidExecAdbCommand",
                    "api/swarmdriver/namespaces/nativeUtils/functions/androidFindElementByText",
                    "api/swarmdriver/namespaces/nativeUtils/functions/androidOpenWebPageWithBrowserOnce",
                    "api/swarmdriver/namespaces/nativeUtils/functions/androidWaitAndClick",
                    "api/swarmdriver/namespaces/nativeUtils/functions/areAllShown",
                    "api/swarmdriver/namespaces/nativeUtils/functions/areAnyShown",
                    "api/swarmdriver/namespaces/nativeUtils/functions/browserIsOpened",
                    "api/swarmdriver/namespaces/nativeUtils/functions/buildSelector",
                    "api/swarmdriver/namespaces/nativeUtils/functions/captureDebug",
                    "api/swarmdriver/namespaces/nativeUtils/functions/enterCharOnKeyboard",
                    "api/swarmdriver/namespaces/nativeUtils/functions/enterStringOnKeyboard",
                    "api/swarmdriver/namespaces/nativeUtils/functions/findEle",
                    "api/swarmdriver/namespaces/nativeUtils/functions/findEleAndSel",
                    "api/swarmdriver/namespaces/nativeUtils/functions/findEles",
                    "api/swarmdriver/namespaces/nativeUtils/functions/getAppState",
                    "api/swarmdriver/namespaces/nativeUtils/functions/getTextOfElement",
                    "api/swarmdriver/namespaces/nativeUtils/functions/getTextOfElements",
                    "api/swarmdriver/namespaces/nativeUtils/functions/hideSoftKeyboard",
                    "api/swarmdriver/namespaces/nativeUtils/functions/isEnabled",
                    "api/swarmdriver/namespaces/nativeUtils/functions/isShown",
                    "api/swarmdriver/namespaces/nativeUtils/functions/openDeepLinkUrl",
                    "api/swarmdriver/namespaces/nativeUtils/functions/prettyPageSource",
                    "api/swarmdriver/namespaces/nativeUtils/functions/restartApp",
                    "api/swarmdriver/namespaces/nativeUtils/functions/returnOnKeyboard",
                    "api/swarmdriver/namespaces/nativeUtils/functions/saveScreenshotWithPath",
                    "api/swarmdriver/namespaces/nativeUtils/functions/startApp",
                    "api/swarmdriver/namespaces/nativeUtils/functions/switchToApp",
                    "api/swarmdriver/namespaces/nativeUtils/functions/tapAllAroundElement",
                    "api/swarmdriver/namespaces/nativeUtils/functions/tapAtPoint",
                    "api/swarmdriver/namespaces/nativeUtils/functions/tapElement",
                    "api/swarmdriver/namespaces/nativeUtils/functions/waitForAllShown",
                    "api/swarmdriver/namespaces/nativeUtils/functions/waitForAnyShown",
                    "api/swarmdriver/namespaces/nativeUtils/functions/waitForCondition",
                    "api/swarmdriver/namespaces/nativeUtils/functions/waitForIsNotShown",
                    "api/swarmdriver/namespaces/nativeUtils/functions/waitForIsShown"
                  ]
                },
                {
                  "type": "category",
                  "label": "Variables",
                  "items": [
                    "api/swarmdriver/namespaces/nativeUtils/variables/DEFAULT_LONG_PRESS_TIMEOUT",
                    "api/swarmdriver/namespaces/nativeUtils/variables/PRESSED_STATE_DURATION"
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "NativeWebView",
              "items": [
                {
                  "type": "category",
                  "label": "Functions",
                  "items": [
                    "api/swarmdriver/namespaces/nativeWebView/functions/findWebviewContext",
                    "api/swarmdriver/namespaces/nativeWebView/functions/getCurrentContexts",
                    "api/swarmdriver/namespaces/nativeWebView/functions/switchToContext",
                    "api/swarmdriver/namespaces/nativeWebView/functions/waitForDocumentFullyLoaded",
                    "api/swarmdriver/namespaces/nativeWebView/functions/waitForWebsiteLoaded",
                    "api/swarmdriver/namespaces/nativeWebView/functions/waitForWebViewContextLoaded"
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Variables",
      "items": [
        "api/variables/DEFAULT_PAGE_TIMEOUT",
        "api/variables/DEFAULT_SCREEN_TIMEOUT",
        "api/variables/FIFTEEN_SECONDS",
        "api/variables/FIVE_MINS",
        "api/variables/TWENTY_FOUR_HOURS"
      ]
    }
  ]
};
