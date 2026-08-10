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

export const SauceMacBrowserResolution = {
  UNKNOWN: 0,
  R1024x768: 1,
  R1152x864: 2,
  R1280x960: 3,
  R1376x1032: 4,
  R1440x900: 5,
  R1600x1200: 6,
  R1920x1440: 7,
  R2048x1536: 8,
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

const parseSauceMacBrowserResolutionHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return SauceMacBrowserResolution.props[parseInt(val, 10)]
      }

      return SauceMacBrowserResolution.props[SauceMacBrowserResolution[(val as string).toUpperCase()]]
    }

    if (isNumber(val)) {
      return SauceMacBrowserResolution.props[val]
    }
  } catch (err) {
    return SauceMacBrowserResolution.props[def]
  }
}

export const parseSauceMacBrowserResolution = (val: EnumInput, def: number = SauceMacBrowserResolution.UNKNOWN): EnumEntry => {
  const retval = parseSauceMacBrowserResolutionHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return SauceMacBrowserResolution.props[def]
}
