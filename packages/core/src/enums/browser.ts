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

const parseBrowserHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return Browser.props[parseInt(val, 10)]
      }

      return Browser.props[Browser[(val as string).toUpperCase()]]
    }

    if (isNumber(val)) {
      return Browser.props[val]
    }
  } catch (err) {
    return Browser.props[def]
  }
}

export const parseBrowser = (val: EnumInput, def: number = Browser.UNKNOWN): EnumEntry => {
  const retval = parseBrowserHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return Browser.props[def]
}
