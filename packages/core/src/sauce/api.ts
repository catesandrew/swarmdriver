/**
 * Sauce Labs REST endpoint + authorization builders.
 *
 * Pure string construction with no I/O, no terminal output and no CLI
 * dependency, which is why they live in `@caps/core` rather than alongside the
 * commander commands in `@caps/cli`: both the CLI *and* the in-session provider
 * hooks (`browser.updateJob()` / `browser.getJob()`) need them, and a provider
 * package must not have to depend on the CLI package to get them.
 */

const VALID_REGIONS = [
  'us-west-1',
  'us-east-1',
  'eu-central-1',
]

/**
 * Base URL of a Sauce Labs data center.
 *
 * @throws if `region` is not one of the three published data centers — a typo
 * here would otherwise be sent as a request to a non-existent host and surface
 * much later as an opaque DNS failure.
 */
export const sauceAPI = (region = ''): string => {
  if (!VALID_REGIONS.includes(region)) {
    throw new Error(`Region contains invalid value ("${ region }"), allowed are: ${ VALID_REGIONS.join(', ') }`)
  }

  return `https://api.${ region }.saucelabs.com`
}

/** `Basic` credentials for the Sauce REST APIs, base64 encoded. */
export const sauceAuthorization = (user: string, key: string): string => {
  return Buffer.from(`${ user }:${ key }`, 'binary').toString('base64')
}

/** Storage (app upload) API — `/v1/storage/{suffix}`. */
export const sauceStorageAPI = (region = '', suffix = ''): string => {
  return `${ sauceAPI(region) }/v1/storage/${ suffix }`
}

/** Virtual-machine jobs API — `/rest/v1/{username}/jobs[/{suffix}]`. */
export const sauceJobsAPI = (region = '', username = '', suffix = ''): string => {
  return suffix ?
    `${ sauceAPI(region) }/rest/v1/${ username }/jobs/${ suffix }` :
    `${ sauceAPI(region) }/rest/v1/${ username }/jobs`
}

/** Real device cloud API — `/v1/rdc/{suffix}`. */
export const sauceRealDevicesAPI = (region = '', suffix = ''): string => {
  return `${ sauceAPI(region) }/v1/rdc/${ suffix }`
}
