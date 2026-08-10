import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import type { Command } from 'commander'
import {
  sauceAuthorization,
  sauceStorageAPI,
} from '../utils'
import type { StorageCredentialOptions } from './types'

export const download = (program: Command): void => {
  const cmd = program.command('download')
  cmd
  .argument('<route>', 'The file name to output to')
  .argument('<fileId>', 'The Sauce Labs identifier of the stored file')
  .description('Returns an application file from Sauce Storage as a payload object in the response.')
  .action(async (route: string, fileId: string) => {
    const opts = cmd.opts() as StorageCredentialOptions

    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, `download/${ fileId }`)

    const filename = route.startsWith('/') ?
      route :
      path.join(process.cwd(), route)

    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${ authorization }`,
        // 'Content-length': String(contentLength),
        // Special case for https://github.com/form-data/form-data
        // 'Content-Type': `multipart/form-data; boundary=${ form.getBoundary() }`,
        // Accept: 'application/json',
      },
    })
    .then((res) => {
      return new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(filename)
        res.body!.pipe(writeStream)
        res.body!.on('end', () => resolve())
        writeStream.on('error', reject)
      })
    })
  })
  .addHelpText('after', `
Examples:

  $ ${ program.name() } ${ cmd.name() } id`)
}

export default download
