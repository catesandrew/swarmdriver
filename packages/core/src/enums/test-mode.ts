import type { EnumEntry, EnumInput } from './types'

export const TestMode = {
  UNKNOWN: 0,
  SAUCE_NATIVE_APP_ANDROID: 1,
  SAUCE_NATIVE_APP_IOS: 2,
  SAUCE_BROWSER_ANDROID: 3,
  SAUCE_BROWSER_IOS: 4,
  SAUCE_BROWSER_X86: 5,
  LOCAL_NATIVE_APP_ANDROID: 6,
  LOCAL_NATIVE_APP_IOS: 7,
  LOCAL_BROWSER_ANDROID: 8,
  LOCAL_BROWSER_IOS: 9,
  LOCAL_BROWSER_X86: 10,
  LOCAL_NATIVE_APP_BOTH: 11,
  SAUCE_NATIVE_APP_BOTH: 12,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'SAUCE_NATIVE_APP_ANDROID',
      description: 'saucelabs native application on android device',
    },
    2: {
      value: 2,
      code: 'SAUCE_NATIVE_APP_IOS',
      description: 'saucelabs native application on ios device',
    },
    3: {
      value: 3,
      code: 'SAUCE_BROWSER_ANDROID',
      description: 'saucelabs browser based app on android device using chrome',
    },
    4: {
      value: 4,
      code: 'SAUCE_BROWSER_IOS',
      description: 'saucelabs browser based app on ios device using safari',
    },
    5: {
      value: 5,
      code: 'SAUCE_BROWSER_X86',
      description: 'saucelabs browser based app on x86 machine e.g., windows or osx, using chrome or potentially any desktop browser',
    },
    6: {
      value: 6,
      code: 'LOCAL_NATIVE_APP_ANDROID',
      description: 'local native application on android device (or simulator)',
    },
    7: {
      value: 7,
      code: 'LOCAL_NATIVE_APP_IOS',
      description: 'local native application on ios device (or simulator)',
    },
    8: {
      value: 8,
      code: 'LOCAL_BROWSER_ANDROID',
      description: 'local browser based app on android device (or simulator) using chrome',
    },
    9: {
      value: 9,
      code: 'LOCAL_BROWSER_IOS',
      description: 'local browser based app on ios device (or simulator) using safari',
    },
    10: {
      value: 10,
      code: 'LOCAL_BROWSER_X86',
      description: 'local browser based app on x86 machine e.g., windows or osx, using chrome or potentially any desktop browser',
    },
    11: {
      value: 11,
      code: 'LOCAL_NATIVE_APP_BOTH',
      description: 'local native application on both android and iOS device (or simulator)',
    },
    12: {
      value: 12,
      code: 'SAUCE_NATIVE_APP_BOTH',
      description: 'saucelabs native application on both android and iOS device',
    },
  }
}

const testModeHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    return TestMode.props[TestMode[(val as string).toUpperCase()]]
  } catch (err) {
    return TestMode.props[def]
  }
}

export const parseTestMode = (val: EnumInput, def: number = TestMode.UNKNOWN): EnumEntry => {
  const retval = testModeHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return TestMode.props[def]
}

export const isSauceMode = (val: number): boolean => {
  if (val === TestMode.SAUCE_NATIVE_APP_ANDROID ||
      val === TestMode.SAUCE_NATIVE_APP_IOS ||
      val === TestMode.SAUCE_NATIVE_APP_BOTH ||
      val === TestMode.SAUCE_BROWSER_ANDROID ||
      val === TestMode.SAUCE_BROWSER_IOS ||
      val === TestMode.SAUCE_BROWSER_X86) {
    return true
  }

  return false
}

export const isSauceNativeMode = (val: number): boolean => {
  if (val === TestMode.SAUCE_NATIVE_APP_ANDROID ||
      val === TestMode.SAUCE_NATIVE_APP_IOS ||
      val === TestMode.SAUCE_NATIVE_APP_BOTH) {
    return true
  }

  return false
}

export const isLocalMode = (val: number): boolean => {
  if (val === TestMode.LOCAL_NATIVE_APP_ANDROID ||
      val === TestMode.LOCAL_NATIVE_APP_IOS ||
      val === TestMode.LOCAL_NATIVE_APP_BOTH ||
      val === TestMode.LOCAL_BROWSER_ANDROID ||
      val === TestMode.LOCAL_BROWSER_IOS ||
      val === TestMode.LOCAL_BROWSER_X86) {
    return true
  }

  return false
}

export const isLocalNativeMode = (val: number): boolean => {
  if (val === TestMode.LOCAL_NATIVE_APP_ANDROID ||
      val === TestMode.LOCAL_NATIVE_APP_IOS ||
      val === TestMode.LOCAL_NATIVE_APP_BOTH) {
    return true
  }

  return false
}

export default TestMode
