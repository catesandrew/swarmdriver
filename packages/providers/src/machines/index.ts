// Sauce-specific native-app capability builders. Their `*SetupLocal*`
// counterparts stay in `@caps/core/machines` — only the halves that reach into
// Sauce capability builders live here.
export * from './android/native-app'
export * from './ios/native-app'
