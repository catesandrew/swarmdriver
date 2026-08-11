import {
  assertEle,
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
 * @private
 */
const setAndroidValue = async (value: string) => {
  log.info('set android picker value', {
    value,
  })

  const selector = `${ SELECTORS.ANDROID_LISTVIEW }/*[@text='${ value }']`
  const listViewEl = await findEle(selector)

  return assertEle(listViewEl, selector).click()
}

/**
 * Set the value for IOS
 *
 * @private
 */
const setIosValue = async (value: string) => {
  log.info('set ios picker value', {
    value,
  })

  const pickerWheelEl = await findEle(SELECTORS.IOS_PICKERWHEEL)
  const doneEl = await findEle(SELECTORS.DONE)
  await assertEle(pickerWheelEl, SELECTORS.IOS_PICKERWHEEL).addValue(value)

  return assertEle(doneEl, SELECTORS.DONE).click()
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
  return assertEle(el, selector).waitForExist({
    timeout: 11000,
    reverse: !isShown,
  })
}

/**
 * Select a value from the picker
 */
export const selectPickerValue = async (value: string) => {
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
