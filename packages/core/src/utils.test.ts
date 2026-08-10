import { describe, it, expect } from 'vitest'

import {
  existy,
  parseBool,
  parseWhole,
  parseString,
  parseList,
  isSauceJob,
  formatPkgName,
  calcHostname,
  calcBaseUrl,
  isElement,
  isChrome,
  isFirefox,
  isJasmine,
  isMocha,
  isMobile,
  isReportPortalReporter,
  isSauceCommentReporter,
  timeDifference,
} from './utils'

describe('existy', () => {
  it('returns false for undefined', () => {
    expect(existy(undefined)).toBe(false)
  })

  it('returns false for null', () => {
    expect(existy(null)).toBe(false)
  })

  it('returns true for falsy-but-defined values', () => {
    expect(existy(0)).toBe(true)
    expect(existy('')).toBe(true)
    expect(existy(false)).toBe(true)
  })
})

describe('parseBool', () => {
  it('returns undefined when the env var is missing entirely', () => {
    expect(parseBool({}, 'FLAG', false)).toBeUndefined()
    expect(parseBool({}, 'FLAG', true)).toBeUndefined()
  })

  it('returns undefined when the env var string equals the default (the collapse quirk)', () => {
    // env explicitly says 'false', default is also false -> collapses to undefined
    expect(parseBool({ FLAG: 'false' }, 'FLAG', false)).toBeUndefined()
    // env explicitly says 'true', default is also true -> collapses to undefined
    expect(parseBool({ FLAG: 'true' }, 'FLAG', true)).toBeUndefined()
  })

  it('returns undefined when a "0"/"1" env var parses to the same boolean as the default', () => {
    // yn('0') === false, which equals the false default -> collapses to undefined
    expect(parseBool({ FLAG: '0' }, 'FLAG', false)).toBeUndefined()
    // yn('1') === true, which equals the true default -> collapses to undefined
    expect(parseBool({ FLAG: '1' }, 'FLAG', true)).toBeUndefined()
  })

  it('returns the parsed boolean when it differs from the default', () => {
    expect(parseBool({ FLAG: 'true' }, 'FLAG', false)).toBe(true)
    expect(parseBool({ FLAG: '1' }, 'FLAG', false)).toBe(true)
    expect(parseBool({ FLAG: 'false' }, 'FLAG', true)).toBe(false)
    expect(parseBool({ FLAG: '0' }, 'FLAG', true)).toBe(false)
  })
})

describe('parseWhole', () => {
  it('returns undefined when the env var is missing entirely', () => {
    expect(parseWhole({}, 'PORT', 4000)).toBeUndefined()
  })

  it('returns undefined when the env var equals the default value', () => {
    expect(parseWhole({ PORT: '4000' }, 'PORT', 4000)).toBeUndefined()
  })

  it('returns undefined when the env var is "0" (falsy parse falls back to the default via ||)', () => {
    // parseInt('0', 10) is 0, which is falsy, so `0 || def` yields the default,
    // which then collapses to undefined because retval === def.
    expect(parseWhole({ PORT: '0' }, 'PORT', 4000)).toBeUndefined()
  })

  it('returns undefined when the env var is non-numeric (NaN falls back to the default)', () => {
    expect(parseWhole({ PORT: 'not-a-number' }, 'PORT', 4000)).toBeUndefined()
  })

  it('returns the parsed integer when it differs from the default', () => {
    expect(parseWhole({ PORT: '8080' }, 'PORT', 4000)).toBe(8080)
  })
})

describe('parseString', () => {
  it('returns undefined when the env var is missing entirely', () => {
    expect(parseString({}, 'NAME', 'default')).toBeUndefined()
  })

  it('returns undefined when the env var equals the default value', () => {
    expect(parseString({ NAME: 'default' }, 'NAME', 'default')).toBeUndefined()
  })

  it('returns the string when it differs from the default, including empty string', () => {
    expect(parseString({ NAME: 'custom' }, 'NAME', 'default')).toBe('custom')
    // Empty string is falsy but !== 'default', so it must be returned as-is.
    expect(parseString({ NAME: '' }, 'NAME', 'default')).toBe('')
  })
})

describe('parseList', () => {
  it('returns the default (empty array) when the env var is missing', () => {
    expect(parseList({}, 'DEVICES')).toEqual([])
  })

  it('returns a custom default when the env var is missing', () => {
    expect(parseList({}, 'DEVICES', ['fallback'])).toEqual(['fallback'])
  })

  it('splits a colon-delimited env var into a list', () => {
    expect(parseList({ DEVICES: 'android:ios' }, 'DEVICES')).toEqual(['android', 'ios'])
  })

  it('wraps a single value with no delimiter in a one-item list', () => {
    expect(parseList({ DEVICES: 'android' }, 'DEVICES')).toEqual(['android'])
  })
})

describe('isSauceJob', () => {
  it('returns a truthy value when config.hostname includes saucelabs', () => {
    expect(isSauceJob({ hostname: 'ondemand.saucelabs.com' }, {})).toBeTruthy()
  })

  it('returns falsy when hostname does not include saucelabs and no capabilities given', () => {
    expect(isSauceJob({ hostname: 'localhost' }, undefined)).toBeFalsy()
  })

  it('detects the w3c "sauce:options" capability', () => {
    expect(isSauceJob(undefined, { 'sauce:options': {} })).toBeTruthy()
  })

  it('detects the jsonwp tunnelName capability', () => {
    expect(isSauceJob(undefined, { tunnelName: 'my-tunnel' })).toBeTruthy()
  })

  it('detects "sauce:options" nested under alwaysMatch', () => {
    expect(isSauceJob(undefined, { alwaysMatch: { 'sauce:options': {} } })).toBeTruthy()
  })

  it('returns falsy for a plain local capability set', () => {
    expect(isSauceJob(undefined, { browserName: 'chrome' })).toBeFalsy()
  })
})

describe('formatPkgName', () => {
  it('strips the scope from a scoped package name', () => {
    expect(formatPkgName('@caps/core')).toBe('core')
  })

  it('returns unscoped names unchanged', () => {
    expect(formatPkgName('swarmdriver')).toBe('swarmdriver')
  })

  it('defaults to an empty string when called with no argument', () => {
    expect(formatPkgName()).toBe('')
  })
})

describe('calcHostname', () => {
  it('returns "localhost" for desktop metal', () => {
    expect(calcHostname({ metal: 'desktop' })).toBe('localhost')
  })

  it('returns "localhost" when metal is omitted (defaults to desktop)', () => {
    expect(calcHostname()).toBe('localhost')
  })

  it('returns undefined for an unrecognized metal value', () => {
    expect(calcHostname({ metal: 'quantum' })).toBeUndefined()
  })

  it('returns a string IP for device metal (resolved from real network interfaces)', () => {
    const result = calcHostname({ metal: 'device' })
    // We don't control the test host's network interfaces, so only assert the shape.
    expect(typeof result === 'string' || result === undefined).toBe(true)
  })
})

describe('calcBaseUrl', () => {
  it('builds a URL from provided envs host/port', () => {
    const url = calcBaseUrl({ envs: { SWARMDRIVER_HOST: '10.0.0.5', SWARMDRIVER_PORT: '5000' } })
    expect(url).toBe('http://10.0.0.5:5000/')
  })

  it('falls back to the default host and port when nothing is provided', () => {
    const url = calcBaseUrl({ envs: {} })
    expect(url).toBe('http://0.0.0.0:4000/')
  })

  it('appends the publicUrlOrPath to the computed origin', () => {
    const url = calcBaseUrl({ envs: {}, publicUrlOrPath: '/app' })
    expect(url).toBe('http://0.0.0.0:4000/app')
  })

  it('honors custom defaultHost/defaultPort overrides', () => {
    const url = calcBaseUrl({ envs: {}, defaultHost: '127.0.0.1', defaultPort: 9000 })
    expect(url).toBe('http://127.0.0.1:9000/')
  })
})

describe('isElement', () => {
  it('returns true for a W3C android element', () => {
    expect(isElement({ isW3C: true, isAndroid: true })).toBeTruthy()
  })

  it('returns falsy for a non-W3C object', () => {
    expect(isElement({ isW3C: false, isAndroid: true })).toBeFalsy()
  })

  it('returns falsy for null/undefined input', () => {
    expect(isElement(null)).toBeFalsy()
    expect(isElement(undefined)).toBeFalsy()
  })

  it('returns falsy for a non-object', () => {
    expect(isElement('not-an-object')).toBeFalsy()
  })
})

describe('isChrome', () => {
  it('detects browserName chrome', () => {
    expect(isChrome({ capabilities: [{ browserName: 'chrome' }] })).toBeTruthy()
  })

  it('detects the goog:chromeOptions vendor capability', () => {
    expect(isChrome({ capabilities: [{ 'goog:chromeOptions': {} }] })).toBeTruthy()
  })

  it('returns falsy when no capability matches', () => {
    expect(isChrome({ capabilities: [{ browserName: 'firefox' }] })).toBeFalsy()
  })

  it('defaults capabilities to an empty array', () => {
    expect(isChrome()).toBeFalsy()
  })
})

describe('isFirefox', () => {
  it('detects browserName firefox', () => {
    expect(isFirefox({ capabilities: [{ browserName: 'firefox' }] })).toBeTruthy()
  })

  it('detects a moz: vendor capability', () => {
    expect(isFirefox({ capabilities: [{ 'moz:firefoxOptions': {} }] })).toBeTruthy()
  })

  it('returns falsy when no capability matches', () => {
    expect(isFirefox({ capabilities: [{ browserName: 'chrome' }] })).toBeFalsy()
  })
})

describe('isJasmine', () => {
  it('detects framework: jasmine', () => {
    expect(isJasmine({ framework: 'jasmine' })).toBe(true)
  })

  it('detects a jasmineOpts-prefixed key', () => {
    expect(isJasmine({ jasmineOpts: {} })).toBeTruthy()
  })

  it('returns false for an unrelated config', () => {
    expect(isJasmine({ framework: 'mocha' })).toBe(false)
  })

  it('defaults config to an empty object', () => {
    expect(isJasmine()).toBe(false)
  })
})

describe('isMocha', () => {
  it('detects framework: mocha', () => {
    expect(isMocha({ framework: 'mocha' })).toBe(true)
  })

  it('detects a mochaOpts-prefixed key', () => {
    expect(isMocha({ mochaOpts: {} })).toBeTruthy()
  })

  it('returns false for an unrelated config', () => {
    expect(isMocha({ framework: 'jasmine' })).toBe(false)
  })
})

describe('isMobile', () => {
  it('detects any appium: vendor capability', () => {
    expect(isMobile({ capabilities: [{ 'appium:deviceName': 'iPhone 15' }] })).toBeTruthy()
  })

  it('detects legacy mobile-only capability keys', () => {
    expect(isMobile({ capabilities: [{ deviceName: 'Pixel 6' }] })).toBeTruthy()
  })

  it('detects an empty browserName as mobile (native app context)', () => {
    expect(isMobile({ capabilities: [{ browserName: '' }] })).toBeTruthy()
  })

  it('detects known mobile browser names', () => {
    expect(isMobile({ capabilities: [{ browserName: 'Android' }] })).toBeTruthy()
  })

  it('returns falsy for a plain desktop capability', () => {
    expect(isMobile({ capabilities: [{ browserName: 'chrome' }] })).toBeFalsy()
  })
})

describe('isReportPortalReporter', () => {
  it('detects a bare string reporter', () => {
    expect(isReportPortalReporter({ reporters: ['reportportal'] })).toBeTruthy()
  })

  it('detects a [name, options] tuple reporter', () => {
    expect(isReportPortalReporter({ reporters: [['reportportal', {}]] })).toBeTruthy()
  })

  it('detects a reporter class by its static reporterName', () => {
    function ReportPortalReporter() {}
    ReportPortalReporter.reporterName = 'reportportal'
    expect(isReportPortalReporter({ reporters: [ReportPortalReporter] })).toBeTruthy()
  })

  it('returns falsy when no reporter matches', () => {
    expect(isReportPortalReporter({ reporters: ['spec'] })).toBeFalsy()
  })

  it('defaults reporters to an empty array', () => {
    expect(isReportPortalReporter()).toBeFalsy()
  })
})

describe('isSauceCommentReporter', () => {
  it('detects a bare "saucecomment" string', () => {
    expect(isSauceCommentReporter({ reporters: ['saucecomment'] })).toBeTruthy()
  })

  it('detects a reporter class by its static reporterName of saucecomment', () => {
    function SauceCommentReporter() {}
    SauceCommentReporter.reporterName = 'saucecomment'
    expect(isSauceCommentReporter({ reporters: [SauceCommentReporter] })).toBeTruthy()
  })

  it('returns falsy when no reporter matches', () => {
    expect(isSauceCommentReporter({ reporters: ['spec'] })).toBeFalsy()
  })
})

describe('timeDifference', () => {
  it('returns the difference between two timestamps in seconds', () => {
    expect(timeDifference(0, 5000)).toBe(5)
  })

  it('returns a negative value when end precedes start', () => {
    expect(timeDifference(5000, 0)).toBe(-5)
  })

  it('returns 0 for identical timestamps', () => {
    expect(timeDifference(1000, 1000)).toBe(0)
  })
})
