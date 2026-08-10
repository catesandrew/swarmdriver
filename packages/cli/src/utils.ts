// import {
//   inspect,
// } from 'util'
import yaml from 'js-yaml'
import { InvalidArgumentError, type Command } from 'commander'

export type OutputFormat = 'json' | 'yaml'

export interface OutputColorOptions {
  output?: OutputFormat
  // Callers (e.g. `logVerboseColor`'s forwarded `...args`) routinely pass
  // extra display-only flags like `color` through unchanged; `outputColor`
  // itself only reads `output`.
  [key: string]: unknown
}

export const outputColor = (json: unknown, {
  output = 'json',
}: OutputColorOptions = {}): string => {
  return output === 'yaml' ?
    yaml.dump(json, {
      skipInvalid: true,
      noCompatMode: true,
    }) :
    JSON.stringify(json, undefined, 2)
}

export interface LogVerboseColorOptions extends OutputColorOptions {
  verbose?: boolean
  silent?: boolean
  log?: (message: string) => void
  [key: string]: unknown
}

export const logVerboseColor = (json: unknown, {
  verbose,
  silent,
  log = () => {},
  ...args
}: LogVerboseColorOptions = {}): boolean | undefined => {
  if (silent) {
    return true
  }

  if (verbose) {
    log(outputColor(json, args))
    return true
  }
}

export const sauceAuthorization = (user: string, key: string): string => {
  return Buffer.from(`${ user }:${ key }`, 'binary').toString('base64')
}

const sauceAPI = (region = ''): string => {
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

export const sauceStorageAPI = (region = '', suffix = ''): string => {
  return `${ sauceAPI(region) }/v1/storage/${ suffix }`
}

export const sauceJobsAPI = (region = '', username = '', suffix = ''): string => {
  return suffix ?
    `${ sauceAPI(region) }/rest/v1/${ username }/jobs/${ suffix }` :
    `${ sauceAPI(region) }/rest/v1/${ username }/jobs`
}

export const sauceRealDevicesAPI = (region = '', suffix = ''): string => {
  return `${ sauceAPI(region) }/v1/rdc/${ suffix }`
}

export const collectValidator = (value: string, previous: string[]): string[] => {
  return previous.concat([value])
}

export const pageValidator = (value: string, _dummyPrevious?: unknown): number => {
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

export const perPageValidator = (value: string, _dummyPrevious?: unknown): number => {
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

/**
 * `_name` / `_aliases` are undocumented commander.js instance internals (not
 * part of its public `Command` typings) that this CLI has relied on since the
 * original JS implementation to render a command's full `parent child` path.
 * Narrowly typed here rather than reaching for `any`.
 */
interface CommandWithInternals extends Command {
  _name: string
  _aliases: string[]
  parent: CommandWithInternals | null
}

export const name = (cmd: Command): string => {
  const internalCmd = cmd as CommandWithInternals
  let cmdName = internalCmd._name
  if (internalCmd._aliases[0]) {
    cmdName = `${ cmdName }|${ internalCmd._aliases[0] }`
  }

  let parentCmdNames = ''
  for (let parentCmd = internalCmd.parent; parentCmd; parentCmd = parentCmd.parent) {
    parentCmdNames = `${ parentCmd.name() } ${ parentCmdNames }`
  }

  return parentCmdNames + cmdName
}

export const toHHMMSS = (msec: number): string => {
  const hours = Math.floor(msec / 3600)
  const rawMinutes = Math.floor((msec - (hours * 3600)) / 60)
  const rawSeconds = Math.floor(msec - (hours * 3600) - (rawMinutes * 60))

  const minutes = rawMinutes < 10 ? `0${ rawMinutes }` : `${ rawMinutes }`
  const seconds = rawSeconds < 10 ? `0${ rawSeconds }` : `${ rawSeconds }`

  if (hours === 0) {
    return `${ minutes }:${ seconds }`
  }

  const hoursStr = hours < 10 ? `0${ hours }` : `${ hours }`

  return `${ hoursStr }:${ minutes }:${ seconds }`
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
