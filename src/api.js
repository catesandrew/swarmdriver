import {
  setupLocalDesktopBrowsers,
  setupLocalDeviceBrowsers,
  setupLocalNativeApp,
} from './services'

import {
  getProvider,
} from './providers'

export const buildWdioConfig = ({
  envs = {},
  remote = 'local', // local or a provider name, e.g. saucelabs
  scope = 'browser', // browser or app
  metal = 'desktop', // desktop or device
  framework = 'jasmine',
  pkgName,
  ...params
} = {}) => {
  // metal -> desktop, device
  // scope -> browser, app

  // Generate the webdriver config
  if (remote === 'local') {
    envs.WDIO_REPORTERS || (envs.WDIO_REPORTERS = 'spec')

    if (scope === 'browser') {
      if (metal === 'device') {
        envs.WDIO_DEVICES || (envs.WDIO_DEVICES = 'android:ios')
        // WDIO_REMOTE=local WDIO_SCOPE=browser WDIO_METAL=device wdio --suite home
        return setupLocalDeviceBrowsers({
          framework,
          envs,
        })
      }

      if (metal === 'desktop') {
        envs.WDIO_BROWSERS || (envs.WDIO_BROWSERS = 'chrome:safari')
        // WDIO_REMOTE=local WDIO_SCOPE=browser WDIO_METAL=desktop wdio --suite home
        return setupLocalDesktopBrowsers({
          framework,
          envs,
        })
      }
    }

    if (scope === 'app') {
      envs.WDIO_DEVICES || (envs.WDIO_DEVICES = 'android:ios')
      envs.WDIO_METAL || (envs.WDIO_METAL = 'device')
      // WDIO_REMOTE=local WDIO_SCOPE=app WDIO_METAL=device wdio --suite home
      return setupLocalNativeApp({
        framework,
        envs,
      })
    }

    return
  }

  // Everything that is not `local` is a cloud grid, resolved through the
  // provider registry. `WDIO_PROVIDER` wins so a run can be pointed at another
  // grid without touching the caller's `remote` value.
  const provider = getProvider(envs.WDIO_PROVIDER || remote)

  if (!provider) {
    return
  }

  provider.applyEnvDefaults(envs, { scope, metal })

  if (scope === 'browser') {
    if (metal === 'device') {
      // WDIO_REMOTE=saucelabs WDIO_SCOPE=browser WDIO_METAL=device wdio --suite home
      return provider.setupDeviceBrowsers({
        tunnelPrefix: pkgName,
        buildSuffix: pkgName,
        framework,
        envs,
      })
    }

    if (metal === 'desktop') {
      // WDIO_REMOTE=saucelabs WDIO_SCOPE=browser WDIO_METAL=desktop wdio --suite home
      return provider.setupDesktopBrowsers({
        tunnelPrefix: pkgName,
        buildSuffix: pkgName,
        framework,
        envs,
      })
    }
  }

  if (scope === 'app') {
    // WDIO_REMOTE=saucelabs WDIO_SCOPE=app WDIO_METAL=device wdio --suite home
    return provider.setupNativeApp({
      tunnelPrefix: pkgName,
      buildSuffix: pkgName,
      framework,
      envs,
    })
  }
}
