import WDIOReporter from '@wdio/reporter'
import prettyMs from 'pretty-ms'
import stripAnsi from 'strip-ansi'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

import {
  existy,
  parseBool,
  parseWhole,
  parseString,
} from '../utils'

/**
 * Generates an authentication token for Sauce Labs using HMAC with MD5 hashing.
 * This token is used for securely authenticating API requests to Sauce Labs,
 * especially for accessing assets (like logs and videos) tied to specific test session IDs.
 *
 * @param {string} user - The Sauce Labs username.
 * @param {string} key - The Sauce Labs access key.
 * @param {string} sessionId - The test session ID for which the token is being generated.
 * @returns {string} A query string with the generated authentication token.
 *
 * @example
 * // Assuming you have your Sauce Labs username, access key, and a session ID:
 * const user = 'your_sauce_username';
 * const key = 'your_sauce_access_key';
 * const sessionId = 'your_test_session_id';
 *
 * const authTokenQueryString = sauceAuthenticationToken(user, key, sessionId);
 * // Use `authTokenQueryString` to authenticate your request for session assets
 */
const sauceAuthenticationToken = (user, key, sessionId) => {
  const secret = `${ user }:${ key }`
  // Create the token
  const token = crypto
  // Calling createHmac method
  .createHmac('md5', secret)
  // Update data
  .update(sessionId)
  // Encoding to be used
  .digest('hex')
  return `?auth=${ token }`
}

// Which commands should result in a screenshot (without `/session/:sessionId/`)
// https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol
const jsonWireActions = [
  'url',
  'forward',
  'back',
  'refresh',
  'execute',
  'size',
  'position',
  'maximize',
  'click',
  'submit',
  'value',
  'keys',
  'clear',
  'selected',
  'enabled',
  'displayed',
  'orientation',
  'alert_text',
  'accept_alert',
  'dismiss_alert',
  'moveto',
  'buttondown',
  'buttonup',
  'doubleclick',
  'down',
  'up',
  'move',
  'scroll',
  'doubleclick',
  'longclick',
  'flick',
  'location',
]

const fixTitle = (title = '') => {
  return title.replace(/[^a-zA-Z0-9-_\\.]/ig, '-').replace(/-{2,}/g, '-').toLowerCase()
}

const generateFilename = (envCombo, fullName, maxTestNameCharacters = 250) => {
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

  const timestamp = `${ date.getFullYear() }-${ month }-${ day }-${ hour }-${ min }-${ sec }`

  let filename = encodeURIComponent(
    `${ timestamp }-${ envCombo.replace(/\s+/g, '-').toLowerCase() }-${ fixTitle(fullName) }`
  )
  .replace(/%../g, '')
  .replace(/\./g, '-')
  .replace(/[/\\?%*:'|"<>()]/g, '')

  if (filename.length > maxTestNameCharacters) {
    const truncLength = (maxTestNameCharacters - 2) / 2
    filename = `${ filename.slice(0, truncLength) }-${ filename.slice(-truncLength) }`
  }

  return filename
}

const getJobId = (caps = {}) => {
  if (!caps.testobject_test_report_url) {
    return
  }

  const url = new URL(caps.testobject_test_report_url)
  const splits = url.pathname.split('/')
  if (splits && splits.length > 2) {
    return splits[2]
  }
}

/**
 * Get a symbol based on state
 * @param  {String} state - state of a test
 * @returns {String} Returns symbol to display
 */
const getSymbol = (state) => {
  const symbols = {
    passed: '🟢',
    skipped: '🔵',
    pending: '⭕',
    failed: '🔴',
  }

  return (state && symbols[state]) || symbols.pending
}

export default class SauceCommentReporter extends WDIOReporter {
  constructor({
    debugMode = false,
    logLevel = 'info',
    mediaRenderTimeout = 5,
    outputDir = '_results_',
    // Should all tests be saved, or only from failed tests
    saveAllTests = false,
    // Video slowdown multiplier
    videoSlowdownMultiplier = 3,
    // Max chars for test names, adjust according to current system
    maxTestNameCharacters = 250,
    // If test speed is not an issue, this option can be enabled to do a screenshot on every json wire message
    recordAllActions = false,
    // Don't print non failed tests
    onlyFailures = false,
    sauceLabsSharableLinks = true,
    // Base URL that captured screenshots are published under, e.g.
    // `https://github.com/<owner>/<repo>/blob/main`. When unset, the report
    // links the on-disk path instead of embedding a remote image.
    screenshotBaseUrl,
    // Which commands should be excluded from screenshots
    addExcludedActions,
    // write output to comment.md file?
    saveOutputToFile,
    ...options
  } = {}) {
    if (logLevel === 'silent') {
      options.logFile = undefined
    }
    super(options)

    // spec reporter
    this._suiteUids = new Set()
    this._indents = 0
    this._suiteIndents = {}
    this._orderedSuites = []
    this._stateCounts = {
      passed: 0,
      failed: 0,
      skipped: 0
    }

    this._onlyFailures = onlyFailures
    this._sauceLabsSharableLinks = sauceLabsSharableLinks
    this._screenshotBaseUrl = screenshotBaseUrl

    // video-reporter
    this.isDone = false

    // User options
    if (outputDir !== '_results_') {
      this._outputDir = outputDir
    } else {
      // Wdio doesn't pass outputDir, but logFile which includes outputDir
      this._outputDir = options.logFile ?
        path.dirname(options.logFile) :
        outputDir
    }

    if (this._outputDir.length > 1) {
      this._outputDir = this._outputDir.replace(/[/|\\]$/, '')
    }

    this._saveAllTests = saveAllTests
    this._videoSlowdownMultiplier = videoSlowdownMultiplier
    this._mediaRenderTimeout = mediaRenderTimeout
    this._excludedActions = [
      ...(addExcludedActions || [])
    ]
    this._recordAllActions = recordAllActions
    this._maxTestNameCharacters = maxTestNameCharacters
    this._debugMode = debugMode
    this._logLevel = logLevel
    this._saveOutputToFile = saveOutputToFile

    // state
    this.screenshotPromises = []
    this.videoPromises = []
    this._testnameStructure = []
    this._frameNr = 0
  }

  // overwrite isSynchronised method
  get isSynchronised() {
    return this.isDone
  }

  // Save screenshot or add not available image movie stills
  onAfterCommand(jsonWireMsg) {
    // eslint-disable-next-line no-useless-escape
    const command = jsonWireMsg.endpoint && jsonWireMsg.endpoint.match(/[^\/]+$/)
    const commandName = command ? command[0] : 'undefined'

    // Filter out non-action commands and keep only last action command
    if (!this._recordAllActions) {
      if (!this._excludedActions.includes(commandName)) {
        return
      }

      if (!jsonWireActions.includes(commandName)) {
        return
      }
    }

    if (!this._recordingPath) {
      return
    }

    if (!this._saveOutputToFile) {
      return
    }

    const filename = this._frameNr.toString().padStart(4, '0')
    const promise = driver.takeScreenshot()
    .then((data) => {
      const ssRoute = path.resolve(this._recordingPath, `${ filename }.png`)
      return fs.writeFile(ssRoute, data.replace(/^data:image\/png;base64,/, ''), 'base64')
    })

    this.screenshotPromises.push(promise)
    this._frameNr++
  }

  onHookEnd(hook) {
    // console.log('onHookEnd=')

    if (hook.error) {
      this._stateCounts.failed++
    }
  }

  onSuiteStart(suite) {
    this._suiteUids.add(suite.uid)
    this._suiteIndents[suite.uid] = ++this._indents

    // Add suite name to naming structure
    this._testnameStructure.push(fixTitle(suite.title))
  }

  onSuiteEnd() {
    // console.log('onSuiteEnd')
    this._indents--

    // Clear suite name from naming structure
    this._testnameStructure.pop()
  }

  // Setup filename based on test name and prepare storage directory
  onTestStart(test) {
    // Setup filename based on test name and prepare storage directory
    this._testnameStructure.push(fixTitle(test.title))
    const fullName = this._testnameStructure.slice(1).reduce((cur, acc) => `${ cur }--${ acc }`, this._testnameStructure[0])
    const envCombo = this.getEnviromentCombo(driver.capabilities)
    test.testName = generateFilename(envCombo, fullName, this._maxTestNameCharacters)
    this._frameNr = 0
    this._recordingPath = path.resolve(this._outputDir) // path.resolve(this._outputDir, test.testName)
    // mkdirp.sync(this._recordingPath)
  }

  onTestPass(test) {
    this._stateCounts.passed++
  }

  onTestFail(test) {
    this._stateCounts.failed++
    if (!this._outputDir) {
      return
    }

    if (!this._saveOutputToFile) {
      return
    }

    // const filename = this._frameNr.toString().padStart(4, '0')
    const promise = Promise.allSettled([
      driver.takeScreenshot(),
      driver.getPageSource(),
    ])
    .then(([img, xml]) => {
      const ssRoute = path.resolve(this._outputDir, `${ test.testName }.png`)
      const psRoute = path.resolve(this._outputDir, `${ test.testName }.xml`)

      const promises = []
      if (img) {
        if (Object.prototype.toString.call(img) === '[object String]') {
          promises.push(
            fs.writeFile(ssRoute, img.replace(/^data:image\/png;base64,/, ''), 'base64')
            .then((result) => {
              test.ssRoute = ssRoute
              return result
            })
          )
        } else if (typeof img === 'object' && img.status === 'fulfilled') {
          promises.push(
            fs.writeFile(ssRoute, img.value.replace(/^data:image\/png;base64,/, ''), 'base64')
            .then((result) => {
              test.ssRoute = ssRoute
              return result
            })
          )
        } else {
          console.log('error img=', img)
        }
      }

      if (xml) {
        if (Object.prototype.toString.call(xml) === '[object String]') {
          promises.push(
            fs.writeFile(psRoute, xml, 'utf8')
            .then((result) => {
              test.psRoute = psRoute
              return result
            })
          )
        } else if (typeof xml === 'object' && xml.status === 'fulfilled') {
          promises.push(
            fs.writeFile(psRoute, xml.value, 'utf8')
            .then((result) => {
              test.psRoute = psRoute
              return result
            })
          )
        } else {
          console.log('error xml=', xml)
        }
      }

      return Promise.allSettled(promises)
    })
    .catch((err) => {
      console.log('err=', err)
    })

    this.screenshotPromises.push(promise)
  }

  onTestSkip(test) {
    this._stateCounts.skipped++

    // Remove empty directories
    // if (this._recordingPath !== undefined) {
    //   fs.remove this._recordingPath
    // }
  }

  onTestEnd(test) {
    // console.log('onTestEnd')

    this._testnameStructure.pop()

    if (!this._outputDir) {
      return
    }

    if (!this._saveOutputToFile) {
      return
    }

    if (test.state === 'passed' && this._saveAllTests) {
      // const filename = this._frameNr.toString().padStart(4, '0')
      const promise = driver.takeScreenshot()
      .then((img) => {
        const ssRoute = path.resolve(this._outputDir, `${ test.testName }.png`)

        const promises = []
        if (img) {
          if (Object.prototype.toString.call(img) === '[object String]') {
            promises.push(
              fs.writeFile(ssRoute, img.replace(/^data:image\/png;base64,/, ''), 'base64')
              .then((result) => {
                test.ssRoute = ssRoute
                return result
              })
            )
          } else if (typeof img === 'object' && img.status === 'fulfilled') {
            promises.push(
              fs.writeFile(ssRoute, img.value.replace(/^data:image\/png;base64,/, ''), 'base64')
              .then((result) => {
                test.ssRoute = ssRoute
                return result
              })
            )
          } else {
            console.log('error img=', img)
          }
        }

        return Promise.allSettled(promises)
      })
      .catch((err) => {
        console.log('err=', err)
      })

      this.screenshotPromises.push(promise)
    }
  }

  onRunnerStart(runner) {
    // console.log('onRunnerStart=', runner.capabilities)
  }

  // Wait for all media-processes to finish, output comment markdown
  onRunnerEnd(runner) {
    // console.log('onRunnerEnd=', runner)
    const promise = this.printReport(runner)
    .then((results) => {
      // Output the results
      return this._saveOutputToFile ?
        fs.appendFile(
          path.resolve(this._outputDir, 'comment.md'),
          `${ results.join('\n') }\n\n`,
          'utf8') :
        this.write(`${ results.join('\n') }\n`)
    }, (err) => {
      console.log(err)
    })

    let abortTimer = null
    let started = false
    const wrapItUp = () => {
      if (!started) {
        clearTimeout(abortTimer)
        started = true
        this.write('\n\nComment reporter done!\n')
        this.isDone = true
      }
    }

    Promise.allSettled([
      ...this.videoPromises,
      ...this.screenshotPromises,
      promise,
    ])
    .then(wrapItUp)
    .catch(wrapItUp)

    abortTimer = setTimeout(() => {
      this.write('commentRenderTimeout triggered before it had a chance to wrap up')
      wrapItUp()
    }, this._mediaRenderTimeout * 1000)
  }

  // Print the report to the screen
  async printReport(runner) {
    // Don't print non failed tests
    if (runner.failures === 0 && this._onlyFailures === true) {
      return
    }

    const duration = `${ prettyMs(runner._duration) }`
    const envCombo = this.getEnviromentCombo(runner.capabilities)
    // eslint-disable-next-line no-unused-vars
    const preface = `${ envCombo } #${ runner.cid }`
    // use jobId for real devices
    const jobId = getJobId(runner.capabilities)
    // Get the results
    const results = this.getResultDisplay()

    const testLinks = this.getTestLink({
      jobId,
      ...runner
    }, this._sauceLabsSharableLinks)

    // If there are no test results then return happy display
    if (results.length === 0) {
      return Promise.resolve([
        ...this.getHeaderDisplay(envCombo, runner.capabilities),
        '',
        ...this.getCountDisplay(duration),
        '',
        ...testLinks,
        '',
      ])
    }

    return this.getFailureDisplay()
    .then((failureDisplay) => {
      return [
        ...this.getHeaderDisplay(envCombo, runner.capabilities),
        '',
        ...this.getCountDisplay(duration),
        '',
        ...results,
        '',
        ...testLinks,
        '',
        ...failureDisplay,
        '',
      ]
    })
  }

  // get link to saucelabs job
  getTestLink({ jobId, sessionId, capabilities } = {}, useSauceLabsSharableLinks = false) {
    const config = this.runnerStat && this.runnerStat.instanceOptions[sessionId]
    const isSauceJob = (
      (config && config.hostname && config.hostname.includes('saucelabs')) ||
      // only show if multiremote is not used
      (capabilities && (
        // check w3c cap in jsonwp caps
        capabilities['sauce:options'] ||
        // check jsonwp caps
        capabilities.tunnelName ||
        // check w3c caps
        (capabilities.alwaysMatch &&
         capabilities.alwaysMatch['sauce:options']))))

    if (isSauceJob && config && config.user && config.key && (jobId || sessionId)) {
      if (jobId) {
        return [
          [
            `[Check out RDC job here](https://app.saucelabs.com/tests/${ jobId })`,
            `[video recording here](https://api.us-west-1.saucelabs.com/v1/rdc/jobs/${ jobId }/video.mp4).`,
          ].join(' or the ')
        ]
      }

      const sauceLabsSharableLinks = useSauceLabsSharableLinks ?
        sauceAuthenticationToken(config.user, config.key, sessionId) :
        ''

      return [
        [
          `[Check out job here](https://app.saucelabs.com/tests/${ sessionId }${ sauceLabsSharableLinks })`,
          `[video recording here](https://assets.saucelabs.com/jobs/${ sessionId }/video.mp4${ sauceLabsSharableLinks }).`,
        ].join(' or the ')
      ]
    }

    return []
  }

  /**
   * Get the header display for the report
   * @param {string} envCombo - runner environment combo
   * @param {object} caps - runner capabilities
   * @returns {Array} Returns header data
   */
  getHeaderDisplay(envCombo, caps = {}) {
    // Spec file name and enviroment information
    let failureLength = 0
    const output = []
    const suites = this.getOrderedSuites()
    for (const suite of suites) {
      // Don't do anything if a suite has no tests or sub suites
      if (suite.tests.length === 0 &&
          suite.suites.length === 0 &&
          suite.hooks.length === 0) {
        continue
      }

      // Display the title of the suite + test/hook
      const eventsToReport = this.getEventsToReport(suite)
      for (const test of eventsToReport) {
        if (test.state !== 'failed') {
          continue
        }

        // If we get here then there is a failed test
        failureLength++
      }
    }

    if (failureLength > 0) {
      output.push(`## 🔥 ${ envCombo }`)
    } else {
      output.push(`## 🚀 ${ envCombo }`)
    }

    // if (caps.sessionId) {
    //   output.push(`Session ID: ${ caps.sessionId }`)
    // }

    return output
  }

  /**
   * Returns everything worth reporting from a suite
   * @param  {Object} suite - test suite containing tests and hooks
   * @returns {Object[]} Returns list of Hook and Test events
   */
  getEventsToReport(suite) {
    // report all tests and only hooks that failed
    return [
      ...suite.hooksAndTests.filter((item) => {
        return item.type === 'test' || Boolean(item.error)
      })
    ]
  }

  /**
   * Get the results from the tests
   * @param  {Array} preface - Runner suites
   * @returns {Array} Returns display output list
   */
  getResultDisplay() {
    let failureLength = 0
    const output = []
    const suites = this.getOrderedSuites()

    const specFileReferences = []
    for (const suite of suites) {
      // Don't do anything if a suite has no tests or sub suites
      if (suite.tests.length === 0 &&
          suite.suites.length === 0 &&
          suite.hooks.length === 0) {
        continue
      }

      // we only want to display the list of specs that lead up to failure
      const eventsToReport = this.getEventsToReport(suite)
      for (const test of eventsToReport) {
        if (test.state !== 'failed') {
          continue
        }

        ++failureLength
      }

      // display the title of the suite + test/hook
      if (failureLength > 0) {
        // Display file path of spec
        if (!specFileReferences.includes(suite.file)) {
          output.push(`- ${ suite.file.replace(process.cwd(), '.') }:`)
          specFileReferences.push(suite.file)
        }

        for (const test of eventsToReport) {
          output.push(`    - ${ getSymbol(test.state) } ${ suite.title } ${ test.title }`)
        }
      }
    }

    return output
  }

  /**
   * Get the display for passing, failing and skipped
   * @param  {String} duration Duration string
   * @returns {Array} Count display
   */
  getCountDisplay(duration) {
    const output = []
    // Get the passes
    if (this._stateCounts.passed > 0) {
      output.push(`${ this._stateCounts.passed } passing ${ duration }`)
      duration = ''
    }

    // Get the failures
    if (this._stateCounts.failed > 0) {
      output.push(`${ this._stateCounts.failed } failing ${ duration }`.trim())
      duration = ''
    }

    // Get the skipped tests
    if (this._stateCounts.skipped > 0) {
      output.push(`${ this._stateCounts.skipped } skipped ${ duration }`.trim())
    }

    return output
  }

  /**
   * Get display for failed tests, e.g. stack trace
   * @returns {Array} Stack trace output
   */
  async getFailureDisplay() {
    let failureLength = 0
    const output = []
    let length = 0
    const suites = this.getOrderedSuites()
    for (const suite of suites) {
      const eventsToReport = this.getEventsToReport(suite)
      for (const test of eventsToReport) {
        if (test.state !== 'failed') {
          continue
        }

        // If we get here then there is a failed test
        output.push(`### (${ ++failureLength }) ${ suite.title } ${ test.title }`)
        output.push('')

        if (test.ssRoute) {
          output.push('📸 Screenshot')
          output.push('')
          output.push(this._screenshotBaseUrl ?
            `![](${ this._screenshotBaseUrl.replace(/\/$/, '') }/${ test.testName }.png?raw=true)` :
            `\`${ test.ssRoute }\``)
          output.push('')
        }

        // PR body/Issue comments are still stored in MySQL as a mediumblob with
        // a maximum value length of 262,144. This equals a limit of 65,536
        // 4-byte unicode characters

        if (test.psRoute) {
          // eslint-disable-next-line no-await-in-loop
          const pageSource = await fs.readFile(test.psRoute, 'utf8')
          if (pageSource) {
            if (length + pageSource.length < 60000) {
              output.push('🙈 Page Source')
              output.push('<details>')
              output.push('<summary>Click to expand</summary>')
              output.push('<p>')
              output.push('')
              output.push('```')
              output.push(...pageSource.split(/\n/g).map((value) => {
                return value
              }))
              output.push('```')
              output.push('')
              output.push('</p>')
              output.push('</details>')
              output.push('')

              length += pageSource.length
            }
          }
        }

        const errors = test.errors || (test.error ? [test.error] : [])
        for (const error of errors) {
          output.push(stripAnsi(error.message))
          if (error.stack) {
            output.push(...error.stack.split(/\n/g).map((value) => {
              return stripAnsi(value.replace(process.cwd(), '.'))
            }))
          }
        }
      }
    }

    return output
  }

  /**
   * Get suites in the order they were called
   * @returns {Array} Returns ordered suites
   */
  getOrderedSuites() {
    if (this._orderedSuites.length) {
      return this._orderedSuites
    }

    this._orderedSuites = []
    for (const uid of this._suiteUids) {
      for (const [suiteUid, suite] of Object.entries(this.suites)) {
        if (suiteUid !== uid) {
          continue
        }
        this._orderedSuites.push(suite)
      }
    }
    return this._orderedSuites
  }

  /**
   * Get information about the enviroment
   * @param  {Object} capability - enviroment details
   * @param  {Boolean} isMultiremote
   * @returns {String} Returns enviroment string
   */
  getEnviromentCombo(capability = {}) {
    const caps = (capability.alwaysMatch || capability)
    const device = caps.testobject_device_name || // 'iPhone 12'
      caps.deviceName // '00008101-001C75CE21A3003A'
    const browser = caps.browserName || caps.browser || ''

    /**
     * fallback to different capability types:
     * browserVersion: W3C format
     * version: JSONWP format
     * platformVersion: mobile format
     * browser_version: invalid BS capability
     */
    const version = caps.browserVersion ||
      caps.version ||
      caps.platformVersion || // 15.0
      caps.browser_version ||
      ''

    /**
     * fallback to different capability types:
     * platformName: W3C format
     * platform: JSONWP format
     * os, os_version: invalid BS capability
     */
    const platform = caps.platformName || // 'iOS', 'Android'
      caps.platform ||
      (caps.os ?
        `${ caps.os } ${ caps.os_version ? caps.os_version : '' }` :
        '(unknown)')

    // Mobile capabilities
    if (device) {
      return version ?
        `${ platform } ${ device } v${ version } ${ platform === 'Android' ? caps.deviceApiLevel : '' }`.trim() :
        `${ platform } ${ device }`
    }

    return version ?
      `${ platform } ${ browser } v${ version }` :
      `${ platform } ${ browser }`
  }
}

SauceCommentReporter.reporterName = 'saucecomment'

export const parseSauceCommentSettings = (envs) => {
  return {
    ...(parseString(envs, 'SAUCECOMMENT_REPORTER_OUTPUT_DIR', '_results_') && {
      outputDir: envs.SAUCECOMMENT_REPORTER_OUTPUT_DIR,
    }),
    ...(existy(parseBool(envs, 'SAUCECOMMENT_REPORTER_SAVE_OUTPUT_TO_FILE', false)) ?
      {
        saveOutputToFile: parseBool(envs, 'SAUCECOMMENT_REPORTER_SAVE_OUTPUT_TO_FILE', false)
      } :
      {
        saveOutputToFile: !!envs.CI,
      }),
    ...(existy(parseBool(envs, 'SAUCECOMMENT_REPORTER_SAUCE_LABS_SHARABLE_LINKS', true)) && {
      sauceLabsSharableLinks: parseBool(envs, 'SAUCECOMMENT_REPORTER_SAUCE_LABS_SHARABLE_LINKS', true),
    }),
    ...(envs.SAUCECOMMENT_REPORTER_SCREENSHOT_BASE_URL && {
      screenshotBaseUrl: envs.SAUCECOMMENT_REPORTER_SCREENSHOT_BASE_URL,
    }),
    ...(existy(parseBool(envs, 'SAUCECOMMENT_REPORTER_SAVE_ALL_TESTS', false)) && {
      saveAllTests: parseBool(envs, 'SAUCECOMMENT_REPORTER_SAVE_ALL_TESTS', false),
    }),
    ...(existy(parseBool(envs, 'SAUCECOMMENT_REPORTER_RECORD_ALL_ACTIONS', false)) && {
      recordAllActions: parseBool(envs, 'SAUCECOMMENT_REPORTER_RECORD_ALL_ACTIONS', false),
    }),
    ...(existy(parseBool(envs, 'SAUCECOMMENT_REPORTER_ONLY_FAILURES', false)) && {
      onlyFailures: parseBool(envs, 'SAUCECOMMENT_REPORTER_ONLY_FAILURES', false),
    }),
    ...(existy(parseWhole(envs, 'SAUCECOMMENT_REPORTER_MEDIA_RENDER_TIMEOUT', 5)) && {
      mediaRenderTimeout: parseBool(envs, 'SAUCECOMMENT_REPORTER_MEDIA_RENDER_TIMEOUT', 5),
    }),
    ...(existy(parseWhole(envs, 'SAUCECOMMENT_REPORTER_VIDEO_SLOWDOWN_MULTIPLIER', 3)) && {
      videoSlowdownMultiplier: parseBool(envs, 'SAUCECOMMENT_REPORTER_VIDEO_SLOWDOWN_MULTIPLIER', 3),
    }),
    ...(existy(parseWhole(envs, 'SAUCECOMMENT_REPORTER_MAX_TEST_NAME_CHARACTERS', 250)) && {
      maxTestNameCharacters: parseBool(envs, 'SAUCECOMMENT_REPORTER_MAX_TEST_NAME_CHARACTERS', 250),
    }),
  }
}

export const buildSauceCommentSettings = (opts = {}) => {
  return {
    reporters: [
      [SauceCommentReporter, {
        ...(opts.outputDir && {
          outputDir: opts.outputDir,
        }),
        ...(existy(opts.sauceLabsSharableLinks) && {
          sauceLabsSharableLinks: opts.sauceLabsSharableLinks,
        }),
        ...(existy(opts.screenshotBaseUrl) && {
          screenshotBaseUrl: opts.screenshotBaseUrl,
        }),
        ...(existy(opts.saveOutputToFile) && {
          saveOutputToFile: opts.saveOutputToFile,
        }),
        ...(existy(opts.saveAllTests) && {
          saveAllTests: opts.saveAllTests,
        }),
        ...(existy(opts.recordAllActions) && {
          recordAllActions: opts.recordAllActions,
        }),
        ...(existy(opts.onlyFailures) && {
          onlyFailures: opts.onlyFailures,
        }),
        ...(existy(opts.mediaRenderTimeout) && {
          mediaRenderTimeout: opts.mediaRenderTimeout,
        }),
        ...(existy(opts.videoSlowdownMultiplier) && {
          videoSlowdownMultiplier: opts.videoSlowdownMultiplier,
        }),
        ...(existy(opts.maxTestNameCharacters) && {
          maxTestNameCharacters: opts.maxTestNameCharacters,
        }),
      }]
    ],
  }
}

export const setupSauceCommentConfig = ({
  envs,
  ...opts
} = {}) => {
  const values = parseSauceCommentSettings(envs)
  return buildSauceCommentSettings({
    ...values,
    ...opts,
  })
}
