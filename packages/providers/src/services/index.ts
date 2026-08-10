// The Sauce Labs config reducers. These were `src/services/remote*.js` in v1's
// single package; they are Sauce-specific (they compose Sauce capability
// builders), so they belong to the provider package rather than to core.
export * from './remote'
export * from './remote-desktop-browser'
export * from './remote-device-browser'
export * from './remote-native-app'
