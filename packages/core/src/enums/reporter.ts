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

export const Reporter = {
  UNKNOWN: 0,
  SPEC: 1,
  JUNIT: 2,
  REPORTPORTAL: 3,
  SAUCECOMMENT: 4,
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
    3: {
      value: 3,
      code: 'REPORTPORTAL',
    },
    4: {
      value: 4,
      code: 'SAUCECOMMENT',
    },
  }
}

const parseReporterHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return Reporter.props[parseInt(val, 10)]
      }

      return Reporter.props[Reporter[(val as string).toUpperCase()]]
    }

    if (isNumber(val)) {
      return Reporter.props[val]
    }
  } catch (err) {
    return Reporter.props[def]
  }
}

export const parseReporter = (val: EnumInput, def: number = Reporter.UNKNOWN): EnumEntry => {
  const retval = parseReporterHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return Reporter.props[def]
}
