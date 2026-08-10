import type { Command } from 'commander'

import { listSauceJobs } from '@caps/core/sauce'

import {
  outputColor,
  name,
  pageValidator,
} from '../utils'

import type {
  ListJobsOptions,
  SauceJobSummary,
  SauceRealDeviceListResponse,
} from './types'

export type { ListJobsOptions }

/**
 * `list` is the CLI's *presentation* of `@caps/core`'s `listSauceJobs`: fetch
 * the listing, then render either the ids alone or the full entries as
 * JSON/YAML.
 */
export const list = async ({
  sauceUsername,
  sauceAccessKey,
  sauceRegion,
  isRealDevice = false,
  verbose = false,
  color = false,
  output = 'json',
  limit,
  skip,
  from,
  to,
}: ListJobsOptions): Promise<string> => {
  return listSauceJobs({
    sauceUsername,
    sauceAccessKey,
    sauceRegion,
    isRealDevice,
    limit,
    skip,
    from,
    to,
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
