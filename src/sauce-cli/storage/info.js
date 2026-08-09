import fetch from 'node-fetch'

import {
  logVerboseColor,
  sauceAuthorization,
  sauceStorageAPI,
} from '../utils'

export const info = (program) => {
  const cmd = program.command('info')
  cmd
  .description('Retrieve the current service configuration. Returns amount of secs until the newly added file expires after being uploaded')
  .action(async () => {
    const opts = cmd.opts()
    // console.log('opts=', opts)
    // console.log('upload: %s, %o', route, opts)

    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, 'info')

    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${ authorization }`,
        Accept: 'application/json',
      }
    })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      if (!logVerboseColor(json, {
        log: console.log,
        ...opts,
      })) {
        // default is to log the expiration_timeout_sec
        console.log(json.expiration_timeout_sec)
      }

      return true
    })
  })
  .addHelpText('after', `
Examples:

  By default we output only the expiration_timeout_sec
  $ ${ program.name() } ${ cmd.name() }

  Add --verbose to get a full output in json
  $ ${ program.name() } ${ cmd.name() } --verbose

  Add --verbose and --color to get a full output in json with ANSI colors
  $ ${ program.name() } ${ cmd.name() } --verbose --color

  Prefer YAML? Then add --output=yaml to get a full yaml output
  $ ${ program.name() } ${ cmd.name() } --verbose --output=yaml`)
}

export default info
