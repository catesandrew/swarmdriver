// Level of logging verbosity: trace | debug | info | warn | error | silent
import lodash from 'lodash'

import type { EnumEntry, EnumInput } from './types'

const {
  isString,
  isNumber,
  parseInt,
} = lodash

function isNum(val: unknown): boolean {
  return /^[-+]?\d+$/.test(val as string)
}

// only one value is supplied). Possible values
// are `debug`, `info`, `warn`, `error`, which are progressively
export const AppiumLogLevel = {
  UNKNOWN: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'debug',
    },
    2: {
      value: 2,
      code: 'info',
    },
    3: {
      value: 3,
      code: 'warn',
    },
    4: {
      value: 4,
      code: 'error',
    },
  }
}

const logHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return AppiumLogLevel.props[parseInt(val, 10)]
      }

      return AppiumLogLevel.props[AppiumLogLevel[(val as string).toUpperCase()]]
    }

    if (isNumber(val)) {
      return AppiumLogLevel.props[val]
    }
  } catch (err) {
    return AppiumLogLevel.props[def]
  }
}

export const parseAppiumLogLevel = (val: EnumInput, def: number = AppiumLogLevel.UNKNOWN): EnumEntry => {
  const retval = logHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return AppiumLogLevel.props[def]
}

export default AppiumLogLevel
