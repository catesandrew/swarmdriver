import yn from 'yn'
import { URL } from 'url'
import { networkInterfaces } from 'os'

import type { Capability, Envs, Metal, WdioConfig } from './types'

/**
 * A WebdriverIO session response, or anything close enough to one.
 *
 * Exported because it appears in the signature of `isChrome`, `isFirefox` and
 * `isMobile` — an unexported type there would leave callers unable to name the
 * argument they are required to construct.
 */
export interface SessionLike {
  capabilities?: Capability[]
}

/**
 * A reporter entry as WebdriverIO accepts it: name, tuple, or class.
 *
 * Exported for the same reason as {@link SessionLike}: it is part of the
 * public signature of `isReportPortalReporter` and `isSauceCommentReporter`.
 */
export type ReporterEntry =
  | string
  | [string, Record<string, any>?]
  | (((...args: any[]) => any) & { reporterName?: string })

export const isElement = (o: any): boolean => {
  return (
    o &&
      typeof o === 'object' &&
      o !== null &&
      o.isW3C &&
      (o.isAndroid || o.isFirefox || o.isChrome)
  )
}

/**
 * check if session is run by Chromedriver
 *
 * @param session - caps of session response
 * @returns the matching capability when run by Chromedriver
 */
export const isChrome = ({ capabilities = [] }: SessionLike = {}): Capability | undefined => {
  return capabilities.find((capability) => {
    return (
      capability.browserName === 'chrome' ||
        Boolean(capability.chrome || capability['goog:chromeOptions'])
    )
  })
}

/**
 * check if session is run by Geckodriver
 *
 * @param session - caps of session response
 * @returns the matching capability when run by Geckodriver
 */
export const isFirefox = ({ capabilities = [] }: SessionLike = {}): Capability | undefined => {
  return capabilities.find((capability) => {
    return (
      capability.browserName === 'firefox' ||
        Boolean(Object.keys(capability).find((cap) => cap.startsWith('moz:')))
    )
  })
}

export const isJasmine = (config: WdioConfig = {}): boolean => {
  return (
    config.framework === 'jasmine' ||
      Boolean(Object.keys(config).find((cap) => cap.startsWith('jasmineOpts')))
  )
}

export const isMocha = (config: WdioConfig = {}): boolean => {
  return (
    config.framework === 'mocha' ||
      Boolean(Object.keys(config).find((cap) => cap.startsWith('mochaOpts')))
  )
}

export const isReportPortalReporter = ({ reporters = [] }: { reporters?: ReporterEntry[] } = {}): ReporterEntry | undefined => {
  return reporters.find((reporter) => {
    // reporters: [['reporter', {}]]
    if (Array.isArray(reporter) && reporter.length > 0) {
      reporter = reporter[0]
    }

    // reporters: ['reporter']
    if (typeof reporter === 'string' || reporter instanceof String) {
      return reporter === 'reportportal'
    }

    // reporters: [Reporter]
    if (typeof reporter === 'function') {
      return reporter.reporterName === 'reportportal'
    }

    return false
  })
}

export const isSauceCommentReporter = ({ reporters = [] }: { reporters?: ReporterEntry[] } = {}): ReporterEntry | undefined => {
  return reporters.find((reporter) => {
    // reporters: [['reporter', {}]]
    if (Array.isArray(reporter) && reporter.length > 0) {
      reporter = reporter[0]
    }

    // reporters: ['reporter']
    if (typeof reporter === 'string' || reporter instanceof String) {
      return reporter === 'saucecomment'
    }

    // reporters: [Reporter]
    if (typeof reporter === 'function') {
      return reporter.reporterName === 'saucecomment'
    }

    return false
  })
}

/**
 * check if current platform is mobile device
 *
 * @param session - caps
 * @returns the matching capability when the platform is a mobile device
 */
export const isMobile = ({ capabilities = [] }: SessionLike = {}): Capability | undefined => {
  return capabilities.find((capability) => {
    const browserName = (capability.browserName || '').toLowerCase()

    // we have mobile capabilities if
    return Boolean(
      // there are any Appium vendor capabilties
      Object.keys(capability).find((cap) => cap.startsWith('appium:')) ||
      // capability contain mobile only specific capability
      Object.keys(capability).find((cap) => [
        'appium-version',
        'appiumVersion',
        'device-type',
        'deviceType',
        'device-orientation',
        'deviceOrientation',
        'deviceName',
        'automationName',
      ].includes(cap)) ||

      // browserName is empty (and eventually app is defined)
      capability.browserName === '' ||

      // browserName is a mobile browser
      [
        'ipad',
        'iphone',
        'android',
      ].includes(browserName)
    )
  })
}

/**
 * Get the time difference in seconds
 *
 * @param start - the time in milliseconds
 * @param end - the time in milliseconds
 * @returns the diff in seconds
 */
export const timeDifference = (start: number, end: number): number => {
  return (end - start) / 1000
}

// export function delay(t, v) {
//   return new Promise((resolve) => {
//     setTimeout(resolve.bind(null, v), t)
//   })
// }

export const generateScreenshotName = (): string => {
  const date = new Date()

  // Widened to `string | number`: each binding starts life as the numeric
  // component and is then re-bound to its zero-padded string form below.
  let month: string | number = date.getMonth() + 1
  let day: string | number = date.getDate()
  let hour: string | number = date.getHours()
  let min: string | number = date.getMinutes()
  let sec: string | number = date.getSeconds()

  month = (month < 10 ? '0' : '') + month
  day = (day < 10 ? '0' : '') + day
  hour = (hour < 10 ? '0' : '') + hour
  min = (min < 10 ? '0' : '') + min
  sec = (sec < 10 ? '0' : '') + sec

  return `${ date.getFullYear() }-${ month }-${ day }_${ hour }.${ min }.${ sec }`
}

export const existy = (x: unknown): boolean => x != null

/**
 * Read a boolean environment variable.
 *
 * The whole `parseX` family shares one contract, and it is deliberately not
 * "return the default when unset": it returns `undefined` whenever the
 * resolved value *equals* the default. Callers spread the result into a config
 * object behind `existy(...)`, so a key whose value matches the default is
 * omitted entirely rather than written out — which is what lets WebdriverIO's
 * own defaults win and keeps generated configs minimal.
 *
 * @param envs - the environment bag to read from
 * @param key - variable name
 * @param def - value to compare against; also the fallback when unset
 * @returns the parsed value, or `undefined` when it equals `def`
 */
export const parseBool = (envs: Envs, key: string, def?: boolean): boolean | undefined => {
  const retval = existy(envs[key]) ?
    yn(envs[key]) :
    def

  return retval !== def ? retval : undefined
}

/**
 * Read an integer environment variable. See {@link parseBool} for the shared
 * "equals the default means `undefined`" contract.
 */
export const parseWhole = (envs: Envs, key: string, def?: number): number | undefined => {
  const retval = existy(envs[key]) ?
    parseInt(envs[key], 10) || def :
    def

  return retval !== def ? retval : undefined
}

/**
 * Read a string environment variable. See {@link parseBool} for the shared
 * "equals the default means `undefined`" contract.
 */
export const parseString = (envs: Envs, key: string, def?: string): string | undefined => {
  const retval = existy(envs[key]) ?
    String(envs[key]) :
    def

  return retval !== def ? retval : undefined
}

/**
 * Read a colon-separated list environment variable.
 *
 * Unlike the other three this always returns a list — `def` comes back as-is
 * when the variable is unset, never collapsed to `undefined`.
 */
export const parseList = (envs: Envs, key: string, def: string[] = []): string[] => {
  return existy(envs[key]) ?
    String(envs[key]).split(':') :
    def
}

export const isSauceJob = (config?: WdioConfig, capabilities?: Capability): unknown => {
  return ((config && config.hostname && config.hostname.includes('saucelabs')) ||
     // only show if multiremote is not used
     (capabilities && (
       // check w3c cap in jsonwp caps
       capabilities['sauce:options'] ||
       // check jsonwp caps
       capabilities.tunnelName ||
       // check w3c caps
       (capabilities.alwaysMatch &&
        capabilities.alwaysMatch['sauce:options']))))
}

export const formatPkgName = (name: string = ''): string => {
  const matches = name.match(/^(@[a-z\d][\w-.]+)\/([a-z\d][\w-.]*)$/)
  if (matches && matches.length > 2) {
    return matches[2]
  }

  return name
}

export interface CalcHostnameOptions {
  envs?: Envs
  metal?: Metal
  [key: string]: any
}

export const calcHostname = ({
  envs = {},
  metal = 'desktop',
  ...params
}: CalcHostnameOptions = {}): string | undefined => {
  // Calculate HOST if not provided for from environment variables. The chrome
  // browser in Android devices prefers to use the IP address of the machine and
  // does not work with `localhost` like the iOS simulator does. Similarly the
  // browsers like to use `localhost`.
  if (metal === 'device') {
    // `family` reads as `'IPv4'` on modern Node and as the number `4` on older
    // releases; both are still accepted, so the comparison is widened rather
    // than narrowed to whatever the current `@types/node` union says.
    return Object.values(networkInterfaces()).flat().find((i) => ((i?.family as string | number) === 'IPv4' || (i?.family as string | number) === 4) && !i?.internal)?.address
  }

  if (metal === 'desktop') {
    return 'localhost'
  }
}

export interface CalcBaseUrlOptions {
  envs?: Envs
  publicUrlOrPath?: string
  defaultHost?: string
  defaultPort?: number
  [key: string]: any
}

export const calcBaseUrl = ({
  envs = {},
  publicUrlOrPath = '',
  defaultHost = '0.0.0.0',
  defaultPort = 4000,
  ...params
}: CalcBaseUrlOptions = {}): string => {
  const port = parseInt(process.env.PORT || envs.SWARMDRIVER_PORT, 10) || defaultPort
  const host = process.env.HOST || envs.SWARMDRIVER_HOST || defaultHost

  return new URL(publicUrlOrPath, `http://${ host }:${ port }`).href
}

type AnyFn = (...args: any[]) => any

export const before = function decorate(decoration: AnyFn | undefined, method: AnyFn) {
  return function decoratedWithBefore(this: any, ...args: any[]) {
    if (decoration) {
      decoration.apply(this, args)
    }
    return method.apply(this, args)
  }
}
