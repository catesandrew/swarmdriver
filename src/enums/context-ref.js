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

const contextRefHelper = (val, def) => {
  try {
    return ContextRef.props[ContextRef[val.toUpperCase()]]
  } catch (err) {
    return ContextRef.props[def]
  }
}

export const parseContextRef = (val, def = ContextRef.UNKNOWN) => {
  const retval = contextRefHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return ContextRef.props[def]
}

export default ContextRef
