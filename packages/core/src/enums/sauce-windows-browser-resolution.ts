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

export const SauceWindowsBrowserResolution = {
  UNKNOWN: 0,
  R800x600: 1,
  R1024x768: 2,
  R1152x864: 3,
  R1280x768: 4,
  R1280x800: 5,
  R1280x960: 6,
  R1280x1024: 7,
  R1400x1050: 8,
  R1440x900: 9,
  R1600x1200: 10,
  R1680x1050: 11,
  R1920x1080: 12,
  R1920x1200: 13,
  R2560x1600: 14,
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

const parseSauceWindowsBrowserResolutionHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return SauceWindowsBrowserResolution.props[parseInt(val, 10)]
      }

      return SauceWindowsBrowserResolution.props[SauceWindowsBrowserResolution[(val as string).toUpperCase()]]
    }

    if (isNumber(val)) {
      return SauceWindowsBrowserResolution.props[val]
    }
  } catch (err) {
    return SauceWindowsBrowserResolution.props[def]
  }
}

export const parseSauceWindowsBrowserResolution = (val: EnumInput, def: number = SauceWindowsBrowserResolution.UNKNOWN): EnumEntry => {
  const retval = parseSauceWindowsBrowserResolutionHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return SauceWindowsBrowserResolution.props[def]
}
