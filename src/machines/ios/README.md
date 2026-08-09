# iOS

## Environment Variables

Here's a list of the supported environment variables when testing with appium

- ABSOLUTE_WEB_LOCATIONS
- ALLOW_PROVISIONING_DEVICE_REGISTRATION
- APP_PUSH_TIMEOUT
- AUTO_ACCEPT_ALERTS
- AUTO_DISMISS_ALERTS
- AUTO_LAUNCH
- AUTO_WEBVIEW
- BUNDLE_ID
- CALENDAR_ACCESS_AUTHORIZED
- CALENDAR_FORMAT
- CLEAR_SYSTEM_FILES
- CONNECT_HARDWARE_KEYBOARD
- CUSTOM_SSL_CERT
- DERIVED_DATA_PATH
- DISABLE_AUTOMATIC_SCREENSHOTS
- ENABLE_ASYNC_EXECUTE_FROM_HTTPS
- ENABLE_PERFORMANCE_LOGGING
- ENFORCE_FRESH_SIMULATOR_CREATION
- FORCE_APP_LAUNCH
- FULL_CONTEXT_LIST
- INCLUDE_DEVICE_CAPS_TO_SESSION_INFO
- INCLUDE_SAFARI_IN_WEBVIEWS
- IOS_APP
- IOS_AUTOMATION_NAME
- IOS_BROWSER_NAME
- IOS_DEVICE_NAME
- IOS_FULL_RESET
- IOS_INSTALL_PAUSE
- IOS_LOCALE
- IOS_NEW_COMMAND_TIMEOUT
- IOS_NO_RESET
- IOS_ORIENTATION
- IOS_PLATFORM_NAME
- IOS_PLATFORM_VERSION
- IOS_SIMULATOR_LOGS_PREDICATE
- IOS_UDID
- IS_HEADLESS
- KEEP_KEY_CHAINS
- KEYCHAINS_EXCLUDE_PATTERNS
- KEYCHAIN_PASSWORD_KEYCHAIN_PATH
- LAUNCH_WITH_IDB
- LOCALIZABLE_STRINGS_DIR
- MAX_TYPING_FREQUENCY
- MJPEG_SERVER_PORT
- NATIVE_WEB_TAP
- NATIVE_WEB_TAP_STRICT
- PREBUILD_WDA
- PRINT_PAGE_SOURCE_ON_FIND_FAILURE
- PROCESS_ARGUMENTS
- REDUCE_MOTION
- RESET_ON_SESSION_START_ONLY
- RESULT_BUNDLE_PATH
- RESULT_BUNDLE_VERSION
- SAFARI_ALLOW_POPUPS
- SAFARI_GARBAGE_COLLECT
- SAFARI_IGNORE_FRAUD_WARNING
- SAFARI_IGNORE_WEB_HOSTNAMES
- SAFARI_INITIAL_URL
- SAFARI_LOG_ALL_COMMUNICATION
- SAFARI_LOG_ALL_COMMUNICATION_HEX_DUMP
- SAFARI_OPEN_LINKS_IN_BACKGROUND
- SAFARI_SOCKET_CHUNK_SIZE
- SAFARI_WEB_INSPECTOR_MAX_FRAME_LENGTH
- SCALE_FACTOR
- SCREENSHOT_QUALITY
- SHOULD_TERMINATE_APP
- SHOULD_USE_SINGLETON_TEST_MANAGER
- SHOW_IOS_LOG
- SHOW_XCODE_LOG
- SHUTDOWN_OTHER_SIMULATORS
- SIMPLE_IS_VISIBLE_CHECK
- SIMULATOR_DEVICES_SET_PATH
- SIMULATOR_PASTEBOARD_AUTOMATIC_SYNC
- SIMULATOR_STARTUP_TIMEOUT
- SIMULATOR_TRACE_POINTER
- SKIP_LOG_CAPTURE
- UPDATED_WDA_BUNDLE_ID
- USE_JSON_SOURCE
- USE_NATIVE_CACHING_STRATEGY
- USE_NEW_WDA
- USE_PREBUILT_WDA
- USE_SIMPLE_BUILD_TEST
- USE_XCTESTRUN_FILE
- WAIT_FOR_IDLE_TIMEOUT
- WAIT_FOR_QUIESCENCE
- WDA_BASE_URL
- WDA_CONNECTION_TIMEOUT
- WDA_EVENTLOOP_IDLE_DELAY
- WDA_LAUNCH_TIMEOUT
- WDA_LAUNCH_TIMEOUT
- WDA_LOCAL_PORT
- WDA_STARTUP_RETRIES
- WDA_STARTUP_RETRY_INTERVAL
- WEBKIT_RESPONSE_TIMEOUT
- WEBVIEW_CONNECT_RETRIES
- WEBVIEW_CONNECT_TIMEOUT
- WEB_DRIVER_AGENT_URL
- XCODE_CONFIG_FILE
- XCODE_ORG_ID
- XCODE_ORG_ID_IOS_LANGUAGE
- XCODE_SIGNING_ID

## Real Devices

Here's a list of the real devices for use with testing on saucelabs

- iPhone 11
- iPhone 11 Pro
- iPhone 11 Pro IOS15 Beta 6
- iPhone 11 Pro Max
- iPhone 12
- iPhone 12 IOS15 Beta 5
- iPhone 12 Pro
- iPhone 12 Pro Max
- iPhone 12 mini
- iPhone 12 mini IOS15 Beta 5
- iPhone 5
- iPhone 5S
- iPhone 6
- iPhone 6 Plus
- iPhone 6S
- iPhone 6S Plus
- iPhone 7
- iPhone 7 Plus
- iPhone 8
- iPhone 8 Plus
- iPhone SE
- iPhone SE 2020
- iPhone X
- iPhone X IOS15 Beta 5
- iPhone XR
- iPhone XS
- iPhone XS Max
- iPod Touch 6
- iPod Touch 7

## How To Achieve The Best Lookup Performance

This article contains several practical suggestions about how to create effective element lookup queries using location strategies supported by WebDriverAgent. All examples are written using a pseudo-language.

### Select The Most Effective Lookup Strategy

```
By.xpath('//XCUIElementTypeTable') ->
By.className('XCUIElementTypeTable')

By.xpath('//XCUIElementTypeTable[@name="table"]') ->
By.accessibilityId('table')

By.xpath('//XCUIElementTypeTable[@name="table"]') ->
By.predicate('type == "XCUIElementTypeTable" AND name == "table"')

By.xpath('//XCUIElementTypeTable[@name="table" or @label="tableLabel"]') ->
By.predicate('type == "XCUIElementTypeTable" AND (name == "table" OR label == "tableLabel")')

By.xpath('//XCUIElementTypeTable[@name="table2" or @name="table1"]') ->
By.predicate('type == "XCUIElementTypeTable" AND name IN {"table2","table1"}')

By.xpath('//XCUIElementTypeTable[@name="table"]/XCUIElementTypeCell[@visible="true"]') ->
By.classChain('**/XCUIElementTypeTable[`name == "table"`]/XCUIElementTypeCell[`visible == 1`]')

By.xpath('//XCUIElementTypeTable[@name="table"]//XCUIElementTypeTextField[@name='input' and @visible="true"]') ->
By.classChain('**/XCUIElementTypeTable[`name == "table"`]/**/XCUIElementTypeTextField[`name == "input" AND visible == 1`]')

By.xpath('//XCUIElementTypeTable[@name="table"]/XCUIElementTypeCell[@visible="true" and .//XCUIElementTypeTextField[@name="input]]') ->
By.classChain('**/XCUIElementTypeTable[`name == "table"`]/**/XCUIElementTypeCell[`visible == 1`][$type == "XCUIElementTypeTextField" AND name == "input"$]')
```

This is the list of available location strategies sorted by their performance (the first one is the fastest one):

1. Class Name
1. Accessibility Id
1. Link Text
1. [Predicate](https://github.com/facebook/WebDriverAgent/wiki/Predicate-Queries-Construction-Rules)
1. [Class Chain](https://github.com/facebook/WebDriverAgent/wiki/Class-Chain-Queries-Construction-Rules)
1. XPath

Always try to use the strategy, which is closer to the top of this list. XPath strategy can sometimes be very slow, because it is not natively supported by XCTest and WDA requires additional efforts to implement it, which seriously affects lookup time. Use XPath locators only if there is no other alternative, for example if some special functions or axes are used in the query.

### Limit The Search Scope

```
dstElement = driver.findElement(
  By.xpath('//XCUIElementTypeTable[@name="table"]//XCUIElementTypeTextField[@visible="true"]')) ->
tableEl = driver.findElement(By.accessibilityId('table'));
dstElement = tableEl.findElement(
  By.predicate('type == "XCUIElementTypeTextField" AND visible == 1'))
```

The more UI elements in the current search scope you have the longer lookup times you get. By default the search scope is the source of the whole page (expressions like `driver.findElement`). By limiting it to the source of the particular element (e. g. `tableEl.findElement`) one can decently optimize lookup performance especially if multiple lookups are going to be executed on the same root element.
This strategy can also help to avoid XPath locators or improve lookup times for them if it is executed in the limited scope.

### Do Not Search Multiple Elements If Only One Element Is Expected To Be Matched

```
dstElement = driver.findElements(By.xpath('//XCUIElementTypeTable'))[0] ->
dstElement = driver.findElement(By.className('XCUIElementTypeTable'))
```

Usually `findElements` takes more time to complete than `findElement`, because it is not necessary to scan through the whole source to find all matches, but rather return after the first one is detected.

### Avoid Generic Matchers

```
By.xpath('//*[@*="1"]/parent::*') ->
By.xpath('//XCUIElementTypeButton[@name="1"]/parent::XCUIElementTypeCell')
```

Generic matchers like asterisk `*` in combination with `findElements` call may require to scan all the attributes of each UI element, which is quite ineffective from performance perspective.

## Class Chain Queries Construction Rules

This query type is WebDriverAgent's layer over native XCTest lookup function calls defined in [XCUIElementQuery](https://developer.apple.com/documentation/xctest/xcuielementquery?language=objc) class with some additional features, like intermediate chain items indexing and tail-based indexing. Search by direct children and descendant elements is supported.

### Direct children search requests

* ```XCUIElementTypeWindow/XCUIElementTypeButton[3]``` - select the third child button of the first child window element
* ```XCUIElementTypeWindow``` - select all the children windows
* ```XCUIElementTypeWindow[2]``` - select the second child window in the hierarchy. Indexing starts at 1
* ```XCUIElementTypeWindow/XCUIElementTypeAny[3]``` - select the third child (of any type) of the first child window
* ```XCUIElementTypeWindow[2]/XCUIElementTypeAny``` - select all the children of the second child window
* ```XCUIElementTypeWindow[2]/XCUIElementTypeAny[-2]``` - select the second last child of the second child window
* One may use '*' (star) character to substitute the universal 'XCUIElementTypeAny' class name
* ```XCUIElementTypeWindow[`name CONTAINS[cd] "blabla"`]``` - select all windows, where name attribute starts with "blabla" or "BlAbla"
* ```XCUIElementTypeWindow[`label BEGINSWITH "blabla"`][-1]``` - select the last window, where label text begins with "blabla"
* ```XCUIElementTypeWindow/XCUIElementTypeAny[`value == "bla1" OR label == "bla2"`]``` - select all children of the first window, where value is "bla1" or label is "bla2"
* ```XCUIElementTypeWindow[`name == "you're the winner"`]/XCUIElementTypeAny[`visible == 1`]``` - select all visible children of the first window named "you're the winner"
* ```XCUIElementTypeWindow/XCUIElementTypeTable/XCUIElementTypeCell[`visible == 1`][$type == XCUIElementTypeImage AND name == 'bla'$]/XCUIElementTypeTextField``` - select a text field, which is a direct child of a visible table cell, which has at least one descendant image with identifier 'bla'

### Indirect descendant search requests

* ```**/XCUIElementTypeCell[`name BEGINSWITH "A"`][-1]/XCUIElementTypeButton[10]``` - select the 10-th child button of the very last cell in the tree, whose name starts with 'A'.
* ```**/XCUIElementTypeCell[`name BEGINSWITH "B"`]``` - select all cells in the tree, where name starts with 'B'
* ```**/XCUIElementTypeCell[`name BEGINSWITH "C"`]/XCUIElementTypeButton[10]``` - select the 10-th child button of the first cell in the tree, whose name starts with 'C' and which has at least ten direct children of type XCUIElementTypeButton.
* ```**/XCUIElementTypeCell[`name BEGINSWITH "D"`]/**/XCUIElementTypeButton``` - select the all descendant buttons of the first cell in the tree, whose name starts with 'D'

### General rules and recommendations

Predicate string should be always enclosed into \` or $ characters inside square brackets. Use \`\` or $$ to escape a single \` or $ character inside predicate expression.

Single backtick means the predicate expression is applied to the current children. It is the direct alternative of [matchingPredicate:](https://developer.apple.com/documentation/xctest/xcuielementquery/1500471-matchingpredicate?language=objc) query selector.

Single dollar sign means the predicate expression is applied to all the descendants of the current element(s). It is the direct alternative of [containingPredicate:](https://developer.apple.com/documentation/xctest/xcuielementquery/1500956-containingpredicate?language=objc) query selector.

Predicate expression should be always put before the index, but never after it. All predicate expressions are executed in the same exact order, which is set in the chain query.

It is not recommended to set explicit indexes for intermediate chain elements, because it slows down the lookup speed.

Double star and slash `**/` defines the next following item as the descendant of the previous chain item, rather than its child.

The query result is similar to what XCTest's _children..._ and _descendants..._ selector calls of XCUIElement class instances produce when combined into a chain.

## Predicate Queries Construction Rules

Predicate queries are natively supported by XCTest and enable quick location of elements based on their attribute values.

### Syntax

Follow the rules described in [Predicate Format String Syntax](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/Predicates/Articles/pSyntax.html) article.

### Available attributes

WebDriverAgent currently defines the following element attributes:

1. `name` - The actual value of element's accessibility identifier or element's label if the first one is not set
1. `value` - Element's value. It is always of type string (or `nil` if the value is not set) and contains the value of the corresponding element. Depending on the element's type this could be: a text or a placeholder text in the text field; a label of a text label; `'1'` or `'0'` if this is a checkbox or a switch
1. `label` - Element's label value or `nil` if it is not present
1. `rect` - Element's rectangle as a dictionary with the following keys: x, y, width, heigth
1. `type` - Type string. All the possible element types are enumerated on [this](https://developer.apple.com/documentation/xctest/xcuielementtype) XCTest tutorial page.
1. `enabled` - Whether the element is enabled or not (`1`/`0`)
1. `visible` - Whether the element is displayed or not (`1`/`0`)
1. `accessible` - Whether the element is accessible or not (`1`/`0`)
1. `accessibilityContainer` - Whether the element is an accessibility container or not (`1`/`0`)

All these attribute names can be used in predicate queries also with `wd` prefixes, for example `wdName`.

### Examples

`type == 'XCUIElementTypeButton' AND value BEGINSWITH[c] 'bla' AND visible == 1` - find elements of type XCUIElementTypeButton whose value starts with `Bla`/`bla`/`BLA` and which are visible
`type IN {'XCUIElementTypeIcon','XCUIElementTypeImage'} AND visible == 1` - find all visible icons and images
`type == 'XCUIElementTypeCell' AND rect.width > 100` - find all cells whose width is greater than 100
`type == 'XCUIElementTypeCheckBox' AND (visible == 1 OR enabled == 1)` - find all check boxes, which are visible or enabled

## Queries

This is list of most common endpoints with some query examples using `curl` with pre-set environment variables:
* `DEVICE_URL` set as device URL (eg. `http://localhost:8100`)
* `SESSION_ID` set as session id. Returned by start session command e.g. `D15E12F6-CA23-4CD4-89F9-E5C5EA6F4FAD`. If you want to use WebDriverAgent without launching an app you can use the default session ID reported by the `/status` endpoint.
* `JSON_HEADER='-H "Content-Type: application/json"'`

WebDriverAgent is intended to implement [WebDriver spec](https://w3c.github.io/webdriver/webdriver-spec.html) so we will not get much into details as you can simply read WebDriver spec.

### Checking service status
```
curl -X GET $JSON_HEADER $DEVICE_URL/status
```

### Session handling
#### Starting session and launching application
If application is already installed on device you can start it using `bundleId` parameter:
```
curl -X POST $JSON_HEADER \
-d "{\"desiredCapabilities\":{\"bundleId\":\"com.apple.mobilesafari\"}}" \
$DEVICE_URL/session
```
It is also possible to request to install application before launching it by adding `app` parameter:
```
curl -X POST $JSON_HEADER \
-d "{\"desiredCapabilities\":{\"bundleId\":\"com.apple.mobilesafari\", \"app\":\"[host_path]/magicapp.app\"}}" \
$DEVICE_URL/session
```

If you want to use WebDriverAgent without launching an app you can use the default session ID reported by the `/status` endpoint.

#### Querying current session
`curl -X GET $JSON_HEADER $DEVICE_URL/session/$SESSION_ID`
#### Removing session and killing application
`curl -X DELETE $JSON_HEADER $DEVICE_URL/session/$SESSION_ID`

### Application related queries
#### Inspector
Open web browser at inspector endpoint [/inspector](http://localhost:8100/inspector)
#### Go to home screen
`curl -X POST $JSON_HEADER -d "" $DEVICE_URL/wda/homescreen`
#### Get a screenshot
`curl -X GET $JSON_HEADER $DEVICE_URL/screenshot`
#### Deactivate application for given time
`curl -X POST $JSON_HEADER -d "{\"duration\":3}" $DEVICE_URL/session/$SESSION_ID/wda/deactivateApp`
#### Change device orientation
Supported orientations are:
- PORTRAIT
- LANDSCAPE
- UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT
- UIA_DEVICE_ORIENTATION_PORTRAIT_UPSIDEDOWN
```
curl -X POST $JSON_HEADER \
-d "{\"orientation\":\"LANDSCAPE\"}" \
$DEVICE_URL/session/$SESSION_ID/orientation`
```
#### Source aka tree
`curl -X GET $JSON_HEADER $DEVICE_URL/source`

### Searching for elements
Some of element search endpoints use property names listed [here](https://github.com/facebook/WebDriverAgent/wiki/Queries#querying-properties).

You can search for elements by:
* property with given value (`link text`)
```
curl -X POST $JSON_HEADER \
-d "{\"using\":\"link text\",\"value\":\"label=Apple\"}" \
$DEVICE_URL/session/$SESSION_ID/elements
```

* property with given partial value (`partial link text`)
```
curl -X POST $JSON_HEADER \
-d "{\"using\":\"partial link text\",\"value\":\"label=App\"}" \
$DEVICE_URL/session/$SESSION_ID/elements
```

* using `class name`
```
curl -X POST $JSON_HEADER \
-d "{\"using\":\"class name\",\"value\":\"XCUIElementTypeButton\"}" \
$DEVICE_URL/session/$SESSION_ID/elements
```

* using `xpath`
```
curl -X POST $JSON_HEADER \
-d "{\"using\":\"xpath\",\"value\":\"//XCUIElementTypeButton[@name='Share']\"}" \
$DEVICE_URL/session/$SESSION_ID/elements
```

It is not recommended to use xpath queries, since they are not supported by XCTest natively and therefore are slow. [Replace](https://github.com/facebook/WebDriverAgent/wiki/How-To-Achieve-The-Best-Lookup-Performance) them with faster query types if possible.

* using `predicate string`
```
curl -X POST $JSON_HEADER \
-d "{\"using\":\"predicate string\",\"value\":\"wdVisible==1\"}" \
$DEVICE_URL/session/$SESSION_ID/elements
```

Follow [Predicate Queries Construction Rules](https://github.com/facebook/WebDriverAgent/wiki/Predicate-Queries-Construction-Rules) to compile predicate queries properly and to avoid unexpected errors.

* using `class chain`
```
curl -X POST $JSON_HEADER \
-d "{\"using\":\"class chain\",\"value\":\"**/XCUIElementTypeOther[`value BEGINSWITH 'blabla'`]/**/XCUIElementTypeButton[`name BEGINSWITH 'cool'`][-1]\"}" \
$DEVICE_URL/session/$SESSION_ID/elements
```

Follow [Class Chain Queries Construction Rules](https://github.com/facebook/WebDriverAgent/wiki/Class-Chain-Queries-Construction-Rules) to compile class chain queries properly and to avoid unexpected errors.


In same manner you can query subelements of given element with id by using `/element/:id/elements` endpoint.


### Interacting with elements
#### Querying properties
All elements returned by search endpoints have assigned `element_id`. Given `element_id` you can query properties like `enabled`, `rect`, `size`, `location`, `text`, `displayed`, `accessible`, `name` e.g.:

`curl -X GET $JSON_HEADER $DEVICE_URL/session/$SESSION_ID/element/5/displayed`

or using by using `element/5/attribute/:name` endpoint e.g.:

`curl -X GET $JSON_HEADER $DEVICE_URL/session/$SESSION_ID/element/5/attribute/name`

#### Tapping element
```
curl -X POST $JSON_HEADER -d "" $DEVICE_URL/session/$SESSION_ID/element/5/click
```
#### Typing text
```
curl -X POST $JSON_HEADER \
-d "{\"value\":[\"h\",\"t\",\"t\",\"p\",\":\",\"/\",\"/\",\"g\",\"i\",\"t\",\"h\",\"u\",\"b\",\".\",\"c\",\"o\",\"m\",\"\\n\"]}" \
$DEVICE_URL/session/$SESSION_ID/element/5/value
```
#### Clearing text
```
curl -X POST $JSON_HEADER -d "" $DEVICE_URL/session/$SESSION_ID/element/5/clear
```

### Alerts
#### Get alert
`curl -X GET $JSON_HEADER $DEVICE_URL/session/$SESSION_ID/alert/text`
#### Accept alert
`curl -X POST $JSON_HEADER -d "" $DEVICE_URL/session/$SESSION_ID/alert/accept`
#### Dismiss alert
`curl -X POST $JSON_HEADER -d "" $DEVICE_URL/session/$SESSION_ID/alert/dismiss`

### Touch ID
#### Match TouchID
`curl -X POST $JSON_HEADER -d "{\"match\":1}" $DEVICE_URL/session/$SESSION_ID/wda/touch_id`
#### Do not match TouchID
`curl -X POST $JSON_HEADER -d "{\"match\":0}" $DEVICE_URL/session/$SESSION_ID/wda/touch_id`
