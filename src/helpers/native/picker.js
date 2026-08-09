import {
  findEle,
  // findEleAndSel,
} from './utils'

import {
  buildLogger,
} from '../../logger'

const log = buildLogger()

const SELECTORS = {
  ANDROID_LISTVIEW: '//android.widget.ListView',
  IOS_PICKERWHEEL: "-ios predicate string:type == 'XCUIElementTypePickerWheel'",
  DONE: '~header-Dropdown'
}

/**
 * Set the value for Android
 *
 * @param {string} value
 *
 * @private
 */
const setAndroidValue = async (value) => {
  log.info('set android picker value', {
    value,
  })

  const listViewEl = await findEle(`${ SELECTORS.ANDROID_LISTVIEW }/*[@text='${ value }']`)

  return listViewEl.click()
}

/**
 * Set the value for IOS
 *
 * @param {string} value
 *
 * @private
 */
const setIosValue = async (value) => {
  log.info('set ios picker value', {
    value,
  })

  const pickerWheelEl = await findEle(SELECTORS.IOS_PICKERWHEEL)
  const doneEl = await findEle(SELECTORS.DONE)
  await pickerWheelEl.addValue(value)

  return doneEl.click()
}

/**
 * Wait for the picker to be shown
 *
 * @param {boolean} isShown
 */
export const waitForPickerIsShown = async (isShown = true) => {
  const selector = driver.isIOS ?
    SELECTORS.IOS_PICKERWHEEL :
    SELECTORS.ANDROID_LISTVIEW

  log.info('wait for picker is shown', {
    isShown,
    selector,
  })

  const el = await findEle(selector)
  return el.waitForExist({
    timeout: 11000,
    reverse: !isShown,
  })
}

/**
 * Select a value from the picker
 *
 * @param {string} value The value that needs to be selected
 */
export const selectPickerValue = async (value) => {
  log.info('select picker value', {
    value,
  })

  await waitForPickerIsShown(true)

  if (driver.isIOS) {
    await setIosValue(value)
  } else {
    await setAndroidValue(value)
  }

  return waitForPickerIsShown(false)
}
