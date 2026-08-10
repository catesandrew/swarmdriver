import fetch from 'node-fetch'
import type { Command } from 'commander'
import {
  outputColor,
  name,
  pageValidator,
  sauceAuthorization,
  sauceRealDevicesAPI,
  sauceJobsAPI,
  type OutputFormat,
} from '../utils'

export interface ListJobsOptions {
  sauceUsername: string
  sauceAccessKey: string
  sauceRegion: string
  isRealDevice?: boolean
  verbose?: boolean
  color?: boolean
  output?: OutputFormat
  limit?: number
  skip?: number
  from?: number
  to?: number
}

interface SauceJobSummary {
  id: string
}

interface SauceRealDeviceListResponse {
  entities: SauceJobSummary[]
}

export const list = async ({
  sauceUsername,
  sauceAccessKey,
  sauceRegion,
  isRealDevice = false,
  verbose = false,
  color = false,
  output = 'json',
  ...opts
}: ListJobsOptions): Promise<string> => {
  const authorization = sauceAuthorization(sauceUsername, sauceAccessKey)

  let url: URL
  if (isRealDevice) {
    const apiUrl = sauceRealDevicesAPI(sauceRegion, 'jobs')
    url = new URL(apiUrl)

    const params = url.searchParams
    if (opts.limit) {
      params.append('limit', String(opts.limit))
    }

    if (opts.skip) {
      params.append('skip', String(opts.skip))
    }
  } else {
    const apiUrl = sauceJobsAPI(sauceRegion, sauceUsername, '')

    url = new URL(apiUrl)
    const params = url.searchParams
    if (opts.limit) {
      params.append('limit', String(opts.limit))
    }

    if (opts.skip) {
      params.append('skip', String(opts.skip))
    }

    if (opts.from) {
      params.append('from', String(opts.from))
    }

    if (opts.to) {
      params.append('to', String(opts.to))
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
  .then((json: SauceRealDeviceListResponse | SauceJobSummary[]) => {
    if (verbose) {
      if (isRealDevice) {
        return outputColor((json as SauceRealDeviceListResponse).entities, {
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
      return (json as SauceRealDeviceListResponse).entities.map((item) => {
        return item.id
      }).join('\n')
    }

    return (json as SauceJobSummary[]).map((item) => {
      return item.id
    }).join('\n')
  })
}

export const listCommand = (program: Command): void => {
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
    } as ListJobsOptions)
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
