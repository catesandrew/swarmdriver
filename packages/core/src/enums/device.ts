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

export const Device = {
  UNKNOWN: 0,
  IOS: 1,
  ANDROID: 2,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'IOS',
    },
    2: {
      value: 2,
      code: 'ANDROID',
    },
  }
}

const parseDeviceHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    if (isString(val)) {
      if (isNum(val)) {
        return Device.props[parseInt(val, 10)]
      }

      return Device.props[Device[(val as string).toUpperCase()]]
    }

    if (isNumber(val)) {
      return Device.props[val]
    }
  } catch (err) {
    return Device.props[def]
  }
}

export const parseDevice = (val: EnumInput, def: number = Device.UNKNOWN): EnumEntry => {
  const retval = parseDeviceHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return Device.props[def]
}
