import lodash from 'lodash'

import {
  existy,
  parseBool,
  parseWhole,
} from '../../utils'

const {
  omitBy,
  isNil,
} = lodash

// Configure Safari to Enable WebDriver Support

// Safari's WebDriver support for developers is turned off by default. How you
// enable it depends on your operating system.

// Sierra and later
//
// Run `safaridriver --enable` once. (If you're upgrading from a previous macOS
// release, you may need to use sudo.)

// Sierra and earlier
//
//  1. If you haven't already done so, make the Develop menu available. Choose
//  Safari > Preferences, and on the Advanced tab, select "Show Develop menu in
//  menu bar." For details, see [Safari
//  Help](https://support.apple.com/guide/safari/welcome).
//
//  2. Choose Develop > Allow Remote Automation.
//
//  3. Authorize `safaridriver` to launch the XPC service that hosts the local
//  web server. To permit this, manually run `/usr/bin/safaridriver` once and
//  follow the authentication prompt.

/**
 * Generate an x86 config used to test web applications in chrome
 * @param {object} baseConfig -
 * @param {*} params -
 * @returns {{}} Returns a config
 */
export const desktopSetupLocalSafari = ({
  envs,
  // WDIO v9: see `desktopSetupLocalChrome` — driver connection details moved
  // into the `wdio:safaridriverOptions` extension capability.
  safariDriverOptions = {},
  ...opts
} = {}) => {
  return {
    capabilities: [
      {
        browserName: 'safari',
        // safaridriver can only handle 1 instance unfortunately
        // https://developer.apple.com/documentation/webkit/about_webdriver_for_safari
        //
        // WDIO v8+ renamed the per-capability `maxInstances` key to
        // `wdio:maxInstances` so capabilities stay strict-W3C.
        'wdio:maxInstances': 1,
        ...safariDriverOptions,
      }
    ],
  }
}

// https://docs.saucelabs.com/dev/test-configuration-options
export const parseSafariSauceCapabilities = (envs) => {
  return {
    ...(existy(parseBool(envs, 'SAFARI_SAUCE_AVOID_PROXY', false)) && {
      avoidProxy: parseBool(envs, 'SAFARI_SAUCE_AVOID_PROXY', false)
    }),
    ...(existy(parseWhole(envs, 'SAFARI_SAUCE_COMMAND_TIMEOUT', 300)) && {
      commandTimeout: parseWhole(envs, 'SAFARI_SAUCE_COMMAND_TIMEOUT', 300)
    }),
  }
}

const buildSauceSafariCapabilities = ({
  ...opts
} = {}) => {
  return {
    // Allows the browser to communicate directly with servers without going
    // through a proxy. By default, Sauce routes traffic from Internet Explorer
    // and Safari through an HTTP proxy server so that HTTPS connections with
    // self-signed certificates will work. The proxy server can cause problems
    // for some users, and this setting allows you to avoid it.
    //
    // NOTE: Any test run with a Sauce Connect tunnel has to use the proxy and
    // this flag will be ignored.
    ...(existy(opts.avoidProxy) && {
      avoidProxy: opts.avoidProxy,
    }),
    // Sets command timeout in seconds. As a safety measure to prevent Selenium
    // crashes from making your tests run indefinitely, we limit how long
    // Selenium can take to run a command in our browsers. This is set to 300
    // seconds by default. The maximum command timeout value allowed is 600
    // seconds.
    ...(existy(opts.commandTimeout) && {
      commandTimeout: opts.commandTimeout > 600 ? 600 : opts.commandTimeout,
    }),
  }
}

export const desktopSetupSauceSafari = ({
  envs,
  sauceOptions,
  ...params
} = {}) => {
  const sauceSafariOptions = buildSauceSafariCapabilities(parseSafariSauceCapabilities(envs))

  return {
    capabilities: [
      omitBy({
        ...(params.browserName ?
          {
            browserName: params.browserName,
          } :
          {
            browserName: 'safari',
          }),
        ...(params.browserVersion ?
          {
            browserVersion: params.browserVersion,
          } :
          {
            browserVersion: '15',
          }),
        ...(params.platformName ?
          {
            platformName: params.platformName,
          } :
          {
            platformName: 'macOS 12',
          }),
        'sauce:options': {
          ...sauceOptions,
          ...sauceSafariOptions,
        }
      }, isNil),
    ],
  }
}
