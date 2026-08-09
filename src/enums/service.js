import lodash from 'lodash'

const {
  isString,
  isNumber,
  parseInt,
} = lodash

function isNum(val) {
  return /^[-+]?\d+$/.test(val)
}

export const Service = {
  UNKNOWN: 0,
  INTERCEPT: 1,
  SHARED_STORE: 2,
  AXE_CORE: 3,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'INTERCEPT',
    },
    2: {
      value: 2,
      code: 'SHARED_STORE',
    },
    3: {
      value: 3,
      code: 'AXE_CORE',
    },
  }
}

const parseServiceHelper = (val, def) => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return Service.props[parseInt(val, 10)]
      }

      return Service.props[Service[val.toUpperCase()]]
    }

    if (isNumber(val)) {
      return Service.props[val]
    }
  } catch (err) {
    return Service.props[def]
  }
}

export const parseService = (val, def = Service.UNKNOWN) => {
  const retval = parseServiceHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return Service.props[def]
}
