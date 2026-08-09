export const argPairParser = (pairs) => {
  if (typeof pairs === 'string' || pairs instanceof String) {
    pairs = pairs.split(' ')
  }

  const attributes = []

  if (pairs.length % 2) {
    throw new Error('Invalid number of arguments')
  }

  for (let i = 0; i < pairs.length; i += 2) {
    let key = pairs[i]

    if (!/^--([a-zA-Z]+-)*[a-zA-Z0-9]+$/gi.test(key)) {
      throw new Error('Invalid argument name')
    }

    key = key
    .replace(/^--/, '')
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase())

    attributes.push({
      key,
      value: pairs[i + 1],
    })
  }

  return attributes
}
