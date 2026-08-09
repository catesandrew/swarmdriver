export const DocumentReadyState = {
  UNKNOWN: 0,
  COMPLETE: 1,
  INTERACTIVE: 2,
  LOADING: 3,
  props: {
    0: {
      value: 0,
      code: 'UNKNOWN',
    },
    1: {
      value: 1,
      code: 'complete',
    },
    2: {
      value: 2,
      code: 'interactive',
    },
    3: {
      value: 3,
      code: 'loading',
    },
  }
}

const docReadyStateHelper = (val, def) => {
  try {
    return DocumentReadyState.props[DocumentReadyState[val.toUpperCase()]]
  } catch (err) {
    return DocumentReadyState.props[def]
  }
}

export const parseDocReadyState = (val, def = DocumentReadyState.UNKNOWN) => {
  const retval = docReadyStateHelper(val, def)
  if (retval !== undefined) {
    return retval
  }

  return DocumentReadyState.props[def]
}

export default DocumentReadyState
