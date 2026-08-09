import yn from 'yn'
import { URL } from 'url'
import { networkInterfaces } from 'os'

export const isElement = (o) => {
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
 * @param {object} capabilities - caps of session response
 * @returns {boolean} Returns true if run by Chromedriver
 */
export const isChrome = ({ capabilities = [] } = {}) => {
  return capabilities.find((capability) => {
    return (
      capability.browserName === 'chrome' ||
        Boolean(capability.chrome || capability['goog:chromeOptions'])
    )
  })
}

/**
 * check if session is run by Chromedriver
 * @param  {object} capabilities - caps of session response
 * @returns {boolean} Returns true if run by Chromedriver
 */
export const isFirefox = ({ capabilities = [] } = {}) => {
  return capabilities.find((capability) => {
    return (
      capability.browserName === 'firefox' ||
        Boolean(Object.keys(capability).find((cap) => cap.startsWith('moz:')))
    )
  })
}

export const isJasmine = (config = {}) => {
  return (
    config.framework === 'jasmine' ||
      Boolean(Object.keys(config).find((cap) => cap.startsWith('jasmineOpts')))
  )
}

export const isMocha = (config = {}) => {
  return (
    config.framework === 'mocha' ||
      Boolean(Object.keys(config).find((cap) => cap.startsWith('mochaOpts')))
  )
}

export const isReportPortalReporter = ({ reporters = [] } = {}) => {
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

export const isSauceCommentReporter = ({ reporters = [] } = {}) => {
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
 * @param {object} capabilities - caps
 * @returns {boolean} Returns true if platform is mobile device
 */
export const isMobile = ({ capabilities = [] } = {}) => {
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
 * @param {number} start - the time in milliseconds
 * @param {number} end - the time in milliseconds
 * @returns {number} Returns the diff in seconds
 */
export const timeDifference = (start, end) => {
  return (end - start) / 1000
}

// export function delay(t, v) {
//   return new Promise((resolve) => {
//     setTimeout(resolve.bind(null, v), t)
//   })
// }

export const generateScreenshotName = () => {
  const date = new Date()

  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let min = date.getMinutes()
  let sec = date.getSeconds()

  month = (month < 10 ? '0' : '') + month
  day = (day < 10 ? '0' : '') + day
  hour = (hour < 10 ? '0' : '') + hour
  min = (min < 10 ? '0' : '') + min
  sec = (sec < 10 ? '0' : '') + sec

  return `${ date.getFullYear() }-${ month }-${ day }_${ hour }.${ min }.${ sec }`
}

export const existy = (x) => x != null

export const parseBool = (envs, key, def) => {
  const retval = existy(envs[key]) ?
    yn(envs[key]) :
    def

  return retval !== def ? retval : undefined
}

export const parseWhole = (envs, key, def) => {
  const retval = existy(envs[key]) ?
    parseInt(envs[key], 10) || def :
    def

  return retval !== def ? retval : undefined
}

export const parseString = (envs, key, def) => {
  const retval = existy(envs[key]) ?
    String(envs[key]) :
    def

  return retval !== def ? retval : undefined
}

export const parseList = (envs, key, def = []) => {
  return existy(envs[key]) ?
    String(envs[key]).split(':') :
    def
}

export const isSauceJob = (config, capabilities) => {
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

export const formatPkgName = (name = '') => {
  const matches = name.match(/^(@[a-z\d][\w-.]+)\/([a-z\d][\w-.]*)$/)
  if (matches && matches.length > 2) {
    return matches[2]
  }

  return name
}

export const calcHostname = ({
  envs = {},
  metal = 'desktop',
  ...params
} = {}) => {
  // Calculate HOST if not provided for from environment variables. The chrome
  // browser in Android devices prefers to use the IP address of the machine and
  // does not work with `localhost` like the iOS simulator does. Similarly the
  // browsers like to use `localhost`.
  if (metal === 'device') {
    return Object.values(networkInterfaces()).flat().find((i) => (i?.family === 'IPv4' || i?.family === 4) && !i?.internal)?.address
  }

  if (metal === 'desktop') {
    return 'localhost'
  }
}

export const calcBaseUrl = ({
  envs = {},
  publicUrlOrPath = '',
  defaultHost = '0.0.0.0',
  defaultPort = 4000,
  ...params
} = {}) => {
  const port = parseInt(process.env.PORT || envs.SWARMDRIVER_PORT, 10) || defaultPort
  const host = process.env.HOST || envs.SWARMDRIVER_HOST || defaultHost

  return new URL(publicUrlOrPath, `http://${ host }:${ port }`).href
}

export const before = function decorate(decoration, method) {
  return function decoratedWithBefore() {
    if (decoration) {
      decoration.apply(this, arguments)
    }
    return method.apply(this, arguments)
  }
}
