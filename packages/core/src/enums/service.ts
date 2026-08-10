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

const parseServiceHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return Service.props[parseInt(val, 10)]
      }

      return Service.props[Service[(val as string).toUpperCase()]]
    }

    if (isNumber(val)) {
      return Service.props[val]
    }
  } catch (err) {
    return Service.props[def]
  }
}

export const parseService = (val: EnumInput, def: number = Service.UNKNOWN): EnumEntry => {
  const retval = parseServiceHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return Service.props[def]
}
