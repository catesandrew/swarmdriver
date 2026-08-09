import {
  androidSetupLocalNativeApp,
  androidSetupSauceNativeApp,
  androidSetupLocalBrowser,
  androidSetupSauceBrowser,
} from './android'

import {
  iosSetupLocalNativeApp,
  iosSetupSauceNativeApp,
  iosSetupLocalBrowser,
  iosSetupSauceBrowser,
} from './ios'

import {
  desktopSetupLocalChrome,
  desktopSetupLocalSafari,
  desktopSetupLocalFirefox,
  desktopSetupSauceChrome,
  desktopSetupSauceSafari,
  desktopSetupSauceFirefox,
} from './desktop'

export {
  // android
  androidSetupLocalNativeApp,
  androidSetupSauceNativeApp,
  androidSetupLocalBrowser,
  androidSetupSauceBrowser,
  // ios
  iosSetupLocalNativeApp,
  iosSetupSauceNativeApp,
  iosSetupLocalBrowser,
  iosSetupSauceBrowser,
  // desktop
  desktopSetupLocalChrome,
  desktopSetupLocalSafari,
  desktopSetupLocalFirefox,
  desktopSetupSauceChrome,
  desktopSetupSauceSafari,
  desktopSetupSauceFirefox,
}
