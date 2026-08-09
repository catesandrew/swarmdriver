import lodash from 'lodash'

const {
  isString,
  isNumber,
  parseInt,
} = lodash

function isNum(val) {
  return /^[-+]?\d+$/.test(val)
}

// 'Android'
// 'iOS'
// 'Windows 11'
// 'Windows 10'
// 'Windows 8.1'
// 'Windows 8'
// 'Windows 7'
// 'macOS 12'
// 'macOS 11.00'
// 'macOS 10.15'
// 'macOS 10.14'
// 'macOS 10.13'
// 'macOS 10.12'
// 'macOS 10.11'
// 'macOS 10.10'

export const SaucePlatform = {
  UNKNOWN: 0,
  ANDROID: 1,
  IOS: 2,
  WINDOWS_11: 3,
  WINDOWS_10: 4,
  WINDOWS_8_1: 5,
  WINDOWS_8: 6,
  WINDOWS_7: 7,
  MAC_OS_12: 8,
  MAC_OS_11_00: 9,
  MAC_OS_10_15: 10,
  MAC_OS_10_14: 11,
  MAC_OS_10_13: 12,
  MAC_OS_10_12: 13,
  MAC_OS_10_11: 14,
  MAC_OS_10_10: 15,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'SPEC',
    },
    2: {
      value: 2,
      code: 'JUNIT',
    },
  }
}

const parseSaucePlatformHelper = (val, def) => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return SaucePlatform.props[parseInt(val, 10)]
      }

      return SaucePlatform.props[SaucePlatform[val.toUpperCase()]]
    }

    if (isNumber(val)) {
      return SaucePlatform.props[val]
    }
  } catch (err) {
    return SaucePlatform.props[def]
  }
}

export const parseSaucePlatform = (val, def = SaucePlatform.UNKNOWN) => {
  const retval = parseSaucePlatformHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return SaucePlatform.props[def]
}
