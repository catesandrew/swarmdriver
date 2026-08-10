import type { EnumEntry, EnumInput } from './types'

export const ContextRef = {
  UNKNOWN: 0,
  NATIVE: 1,
  WEBVIEW: 2,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'native',
    },
    2: {
      value: 2,
      code: 'webview',
    },
  }
}

const contextRefHelper = (val: EnumInput, def: number): EnumEntry | undefined => {
  try {
    return ContextRef.props[ContextRef[(val as string).toUpperCase()]]
  } catch (err) {
    return ContextRef.props[def]
  }
}

export const parseContextRef = (val: EnumInput, def: number = ContextRef.UNKNOWN): EnumEntry => {
  const retval = contextRefHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return ContextRef.props[def]
}

export default ContextRef
