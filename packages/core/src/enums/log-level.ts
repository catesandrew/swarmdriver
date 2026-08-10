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

export const LogLevel = {
  UNKNOWN: 0,
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  SILENT: 6,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'trace',
    },
    2: {
      value: 2,
      code: 'debug',
    },
    3: {
      value: 3,
      code: 'info',
    },
    4: {
      value: 4,
      code: 'warn',
    },
    5: {
      value: 5,
      code: 'error',
    },
    6: {
      value: 6,
      code: 'silent',
    },
  }
}

const logHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return LogLevel.props[parseInt(val, 10)]
      }

      return LogLevel.props[LogLevel[(val as string).toUpperCase()]]
    }

    if (isNumber(val)) {
      return LogLevel.props[val]
    }
  } catch (err) {
    return LogLevel.props[def]
  }
}

export const parseLogLevel = (val: EnumInput, def: number = LogLevel.UNKNOWN): EnumEntry => {
  const retval = logHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return LogLevel.props[def]
}

export default LogLevel
