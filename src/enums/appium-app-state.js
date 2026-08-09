// Level of logging verbosity: trace | debug | info | warn | error | silent
import lodash from 'lodash'

const {
  isString,
  isNumber,
  parseInt,
} = lodash

function isNum(val) {
  return /^[-+]?\d+$/.test(val)
}

export const AppiumAppState = {
  NOT_INSTALLED: 0,
  NOT_RUNNING: 1,
  SUSPENDED: 2,
  RUNNING_IN_BACKGROUND: 3,
  RUNNING_IN_FOREGROUND: 4,
  props: {
    0: {
      value: 0,
      code: 'NOT_INSTALLED',
      desc: 'The current application state cannot be determined/is unknown',
    },
    1: {
      value: 1,
      code: 'NOT_RUNNING',
      desc: 'The application is not running',
    },
    2: {
      value: 2,
      code: 'SUSPENDED',
      desc: 'The application is running in the background and is suspended',
    },
    3: {
      value: 3,
      code: 'RUNNING_IN_BACKGROUND',
      desc: 'The application is running in the background and is not suspended',
    },
    4: {
      value: 4,
      code: 'RUNNING_IN_FOREGROUND',
      desc: 'The application is running in the foreground',
    },
  }
}

const logHelper = (val, def) => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return AppiumAppState.props[parseInt(val, 10)]
      }

      return AppiumAppState.props[AppiumAppState[val.toUpperCase()]]
    }

    if (isNumber(val)) {
      return AppiumAppState.props[val]
    }
  } catch (err) {
    return AppiumAppState.props[def]
  }
}

export const parseAppiumAppState = (val, def = AppiumAppState.NOT_INSTALLED) => {
  const retval = logHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return AppiumAppState.props[def]
}

export default AppiumAppState
