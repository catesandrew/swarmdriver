const SELECTORS = {
  ANDROID: {
    ALERT_TITLE: '*//android.widget.TextView[@resource-id="android:id/alertTitle"]',
    ALERT_MESSAGE: '*//android.widget.TextView[@resource-id="android:id/message"]',
    ALERT_BUTTON: '*//android.widget.Button[@text="{BUTTON_TEXT}"]'
  },
  IOS: {
    ALERT: "-ios predicate string:type == 'XCUIElementTypeAlert'"
  }
}

export const getNativeAlert = async () => {
  const selector = driver.isAndroid ?
    SELECTORS.ANDROID.ALERT_TITLE :
    SELECTORS.IOS.ALERT

  return $(selector)
}

/**
 * Wait for the alert to exist
 * @param {bool} [reverse=false] - if true it instead waits for the selector
 * to not match any elements.
 */
export const waitForNativeAlertIsShown = async (reverse = false) => {
  const alertEl = await getNativeAlert()
  return alertEl.waitForExist({
    timeout: 11000,
    reverse,
  })
}

/**
 * Press a button in a cross-platform way.
 *
 * IOS:
 *  iOS always has an accessibilityID so use the `~` in combination
 *  with the name of the button as shown on the screen
 * ANDROID:
 *  Use the text of the button, provide a string and it will automatically transform it to uppercase
 *  and click on the button
 */
export const pressNativeAlertButton = async (selector: string) => {
  const buttonSelector = driver.isAndroid ?
    SELECTORS.ANDROID.ALERT_BUTTON.replace(/{BUTTON_TEXT}/, selector.toUpperCase()) :
    `~${ selector }`

  const el = await $(buttonSelector)
  return el.click()
}

/**
 * Get the alert text
 *
 * @returns {string}
 */
export const getNativeAlertText = async () => {
  if (driver.isIOS) {
    return driver.getAlertText()
  }

  const elTitle = await $(SELECTORS.ANDROID.ALERT_TITLE)
  const elMessage = await $(SELECTORS.ANDROID.ALERT_MESSAGE)

  return `${ await elTitle.getText() }\n${ await elMessage.getText() }`
}
