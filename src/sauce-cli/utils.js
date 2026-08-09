// import {
//   inspect,
// } from 'util'
import yaml from 'js-yaml'
import { InvalidArgumentError } from 'commander'

export const outputColor = (json, {
  output = 'json',
} = {}) => {
  return output === 'yaml' ?
    yaml.dump(json, {
      skipInvalid: true,
      noCompatMode: true,
    }) :
    JSON.stringify(json, undefined, 2)
}

export const logVerboseColor = (json, {
  verbose,
  silent,
  log = () => {},
  ...args
} = {}) => {
  if (silent) {
    return true
  }

  if (verbose) {
    log(outputColor(json, args))
    return true
  }
}

export const sauceAuthorization = (user, key) => {
  return Buffer.from(`${ user }:${ key }`, 'binary').toString('base64')
}

const sauceAPI = (region = '') => {
  const valid = [
    'us-west-1',
    'us-east-1',
    'eu-central-1',
  ]

  if (!valid.includes(region)) {
    throw new Error(`Region contains invalid value ("${ region }"), allowed are: ${ valid.join(', ') }`)
  }

  return `https://api.${ region }.saucelabs.com`
}

export const sauceStorageAPI = (region = '', suffix = '') => {
  return `${ sauceAPI(region) }/v1/storage/${ suffix }`
}

export const sauceJobsAPI = (region = '', username = '', suffix = '') => {
  return suffix ?
    `${ sauceAPI(region) }/rest/v1/${ username }/jobs/${ suffix }` :
    `${ sauceAPI(region) }/rest/v1/${ username }/jobs`
}

export const sauceRealDevicesAPI = (region = '', suffix = '') => {
  return `${ sauceAPI(region) }/v1/rdc/${ suffix }`
}

export const collectValidator = (value, previous) => {
  return previous.concat([value])
}

export const pageValidator = (value, dummyPrevious) => {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10)
  if (Number.isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.')
  }

  if (parsedValue < 1) {
    throw new InvalidArgumentError('Not greater than 0.')
  }

  return parsedValue
}

export const perPageValidator = (value, dummyPrevious) => {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10)
  if (Number.isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.')
  }

  if (parsedValue < 1) {
    throw new InvalidArgumentError('Less than 1.')
  }

  if (parsedValue > 100) {
    throw new InvalidArgumentError('Greater than 100.')
  }

  return parsedValue
}

export const name = (cmd) => {
  let cmdName = cmd._name
  if (cmd._aliases[0]) {
    cmdName = `${ cmdName }|${ cmd._aliases[0] }`
  }

  let parentCmdNames = ''
  for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
    parentCmdNames = `${ parentCmd.name() } ${ parentCmdNames }`
  }

  return parentCmdNames + cmdName
}

export const toHHMMSS = (msec) => {
  let hours = Math.floor(msec / 3600)
  let minutes = Math.floor((msec - (hours * 3600)) / 60)
  let seconds = Math.floor(msec - (hours * 3600) - (minutes * 60))

  if (minutes < 10) {
    minutes = `0${ minutes }`
  }

  if (seconds < 10) {
    seconds = `0${ seconds }`
  }

  if (hours === 0) {
    return `${ minutes }:${ seconds }`
  }

  if (hours < 10) {
    hours = `0${ hours }`
  }

  return `${ hours }:${ minutes }:${ seconds }`
}

export default {
  collectValidator,
  logVerboseColor,
  name,
  pageValidator,
  perPageValidator,
  sauceAuthorization,
  sauceStorageAPI,
  toHHMMSS,
}
