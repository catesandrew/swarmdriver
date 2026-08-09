import fetch from 'node-fetch'
import {
  outputColor,
  name,
  pageValidator,
  sauceAuthorization,
  sauceJobsAPI,
  sauceRealDevicesAPI,
} from '../utils'

export const list = async ({
  sauceUsername,
  sauceAccessKey,
  sauceRegion,
  isRealDevice = false,
  verbose = false,
  color = false,
  output = 'json',
  ...opts
} = {}) => {
  const authorization = sauceAuthorization(sauceUsername, sauceAccessKey)

  let url
  if (isRealDevice) {
    const apiUrl = sauceRealDevicesAPI(sauceRegion, 'jobs')
    url = new URL(apiUrl)

    const params = url.searchParams
    if (opts.limit) {
      params.append('limit', opts.limit)
    }

    if (opts.skip) {
      params.append('skip', opts.skip)
    }
  } else {
    const apiUrl = sauceJobsAPI(sauceRegion, sauceUsername, '')

    url = new URL(apiUrl)
    const params = url.searchParams
    if (opts.limit) {
      params.append('limit', opts.limit)
    }

    if (opts.skip) {
      params.append('skip', opts.skip)
    }

    if (opts.from) {
      params.append('from', opts.from)
    }

    if (opts.to) {
      params.append('to', opts.to)
    }

    params.append('format', 'json')
  }

  return fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Basic ${ authorization }`,
      Accept: 'application/json',
    },
  })
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    if (verbose) {
      if (isRealDevice) {
        return outputColor(json.entities, {
          color,
          output,
        })
      }

      return outputColor(json, {
        color,
        output,
      })
    }

    if (isRealDevice) {
      return json.entities.map((item) => {
        return item.id
      }).join('\n')
    }

    return json.map((item) => {
      return item.id
    }).join('\n')
  })
}

export const listCommand = (program) => {
  const cmd = program.command('list')
  cmd
  .alias('ls')
  .description('List of recent jobs run by the specified user.')
  .option('--real', 'Query jobs running on real devices.')
  .option('--limit <value>', 'The maximum number of jobs to return.', pageValidator)
  .option('--skip <value>', 'Returns only the jobs beginning after this index number.', pageValidator)
  .option('--from <value>', 'Return only jobs that ran on or after this Unix timestamp.', pageValidator)
  .option('--to <value>', 'Return only jobs that ran on or before this Unix timestamp.', pageValidator)
  .action(async () => {
    const opts = cmd.opts()

    return list({
      isRealDevice: opts.real,
      ...opts,
    })
    .then((result) => {
      if (opts.silent) {
        return
      }

      return console.log(result)
    })
  })
  .addHelpText('after', `
Examples:

  Get a list of job ids
  $ ${ name(cmd) }

  Get a list of real device job ids
  $ ${ name(cmd) } --real

  Get the list of jobs along with their metadata
  $ ${ name(cmd) } --verbose

  Get the list of real device jobs along with their metadata
  $ ${ name(cmd) } --real --verbose`)
}
