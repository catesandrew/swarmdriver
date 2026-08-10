import {
  androidSetupLocalNativeApp,
  androidSetupLocalBrowser,
  androidSetupSauceBrowser,
} from './android'

import {
  iosSetupLocalNativeApp,
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

// `*SetupSauceNativeApp` is absent by design: those two builders reach into
// Sauce-specific capability builders, so they live in `@caps/providers`. The
// `*SetupSauce{Browser,Chrome,Safari,Firefox}` builders below are grid-agnostic
// shells that merely accept a `sauceOptions` bag, so they stay in core.
export {
  // android
  androidSetupLocalNativeApp,
  androidSetupLocalBrowser,
  androidSetupSauceBrowser,
  // ios
  iosSetupLocalNativeApp,
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
