import lodash from 'lodash'

const {
  isString,
  isNumber,
  parseInt,
} = lodash

function isNum(val) {
  return /^[-+]?\d+$/.test(val)
}

export const Browser = {
  UNKNOWN: 0,
  CHROME: 1,
  SAFARI: 2,
  FIREFOX: 3,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'CHROME',
    },
    2: {
      value: 2,
      code: 'SAFARI',
    },
    3: {
      value: 3,
      code: 'FIREFOX',
    },
  }
}

const parseBrowserHelper = (val, def) => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return Browser.props[parseInt(val, 10)]
      }

      return Browser.props[Browser[val.toUpperCase()]]
    }

    if (isNumber(val)) {
      return Browser.props[val]
    }
  } catch (err) {
    return Browser.props[def]
  }
}

export const parseBrowser = (val, def = Browser.UNKNOWN) => {
  const retval = parseBrowserHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return Browser.props[def]
}
