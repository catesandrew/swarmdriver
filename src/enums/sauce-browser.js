import lodash from 'lodash'

const {
  isString,
  isNumber,
  parseInt,
} = lodash

function isNum(val) {
  return /^[-+]?\d+$/.test(val)
}

// 'Chrome'
// 'Edge'
// 'Firefox'
// 'Safari'

export const SauceBrowser = {
  UNKNOWN: 0,
  CHROME: 1,
  EDGE: 2,
  FIREFOX: 3,
  SAFARI: 4,
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

const parseSauceBrowserHelper = (val, def) => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return SauceBrowser.props[parseInt(val, 10)]
      }

      return SauceBrowser.props[SauceBrowser[val.toUpperCase()]]
    }

    if (isNumber(val)) {
      return SauceBrowser.props[val]
    }
  } catch (err) {
    return SauceBrowser.props[def]
  }
}

export const parseSauceBrowser = (val, def = SauceBrowser.UNKNOWN) => {
  const retval = parseSauceBrowserHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return SauceBrowser.props[def]
}
