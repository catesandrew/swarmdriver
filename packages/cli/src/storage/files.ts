import fetch from 'node-fetch'
import { Option, type Command } from 'commander'
import fs from 'fs'
import path from 'path'
import {
  collectValidator,
  logVerboseColor,
  name,
  pageValidator,
  perPageValidator,
  sauceAuthorization,
  sauceStorageAPI,
} from '../utils'

import SauceCommand from '../sauce-command'
import type { StorageCredentialOptions, SauceStorageItem, SauceStorageItemResponse, SauceStorageListResponse } from './types'

// import {
//   upload,
//   info,
// } from './files'

interface ListFilesActionOptions extends StorageCredentialOptions {
  id: string[]
  teamId: string[]
  orgId: string[]
  kind: string[]
  query?: string
  page?: number
  perPage?: number
}

interface EditFileActionOptions extends StorageCredentialOptions {
  description: string
}

const download = (program: Command): void => {
  const cmd = program.command('download')
  cmd
  .argument('<fileId>', 'ID of file that needs to be fetched')
  .description('Download the files previously uploaded to the Sauce Storage.')
  .action(async (fileId: string) => {
    const opts = cmd.opts() as StorageCredentialOptions
    // console.log('opts=', opts)
    // console.log('download: %s, %o', fileId, opts)

    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, `download/${ fileId }`)

    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${ authorization }`,
        Accept: 'application/octet-stream',
      },
    })
    .then((res) => {
      // RegExp to extract the filename from Content-Disposition
      const regexp = /filename="(.*)"/gi
      const filepath = regexp.exec(res.headers.get('content-disposition') as string)![1]

      if (!res.ok) {
        throw Error(`Unable to download, server returned ${ res.status } ${ res.statusText }`)
      }

      const body = res.body
      if (body == null) {
        throw Error('No response body')
      }

      const length = parseInt(
        res.headers.get('Content-Length') || '0',
        10)

      const targetFile = path.resolve(process.cwd(), filepath)

      if (!logVerboseColor({
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        contentType: res.headers.get('content-type'),
        filepaht: filepath,
        contentLength: length,
        rawHeaders: res.headers.raw(),
      }, {
        log: console.log,
        ...opts,
      })) {
        console.log(`${ res.ok } ${ targetFile }`)
      }

      const writer = fs.createWriteStream(targetFile)
      return new Promise<void>((resolve, reject) => {
        body.pipe(writer)
        body.on('error', reject)
        writer.on('finish', resolve)
      })
    })
  })
  .addHelpText('after', `
Examples:

  By default we output only the file_id which can be reused
  $ ${ name(cmd) } 88e3e7b1-690f-409f-ad5d-6519934c0d55

  Add --verbose to get a full output
  $ ${ name(cmd) } --verbose 88e3e7b1-690f-409f-ad5d-6519934c0d55`)
}

const list = (program: Command): void => {
  const cmd = program.command('list')
  cmd
  .alias('ls')
  .description('List files previously uploaded to the Sauce Storage.')
  .option('--id <value>', 'One or more file ids to be listed', collectValidator, [])
  .option('--teamId <value>', 'One or more team ids the listed file(s) should be shared with', collectValidator, [])
  .option('--orgId <value>', 'One or more org ids the listed file(s) should be shared with', collectValidator, [])
  .option('--query <value>', 'The search term. The lookup is done using version names, codes, app names, identifiers and file names')
  .addOption(
    new Option(
      '--kind <value>',
      'One or more platform types'
    )
    .choices([
      'android',
      'ios',
      'other',
    ])
    .argParser(collectValidator)
    .default([]))
  .option('--page <value>', 'The number of the current page to show', pageValidator, 1)
  .option('--per-page <value>', 'The number of items per page', perPageValidator, 25)
  .action(async () => {
    const opts = cmd.opts() as ListFilesActionOptions
    // console.log('opts=', opts)
    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, 'files')

    const url = new URL(apiUrl)
    const params = url.searchParams
    opts.id.forEach((id) => {
      params.append('file_id', id)
    })

    opts.teamId.forEach((id) => {
      params.append('team_id', id)
    })

    opts.orgId.forEach((id) => {
      params.append('org_id', id)
    })

    opts.kind.forEach((id) => {
      params.append('kind', id)
    })

    if (opts.query) {
      params.append('q', opts.query)
    }

    if (opts.page) {
      params.append('page', String(opts.page))
    }

    if (opts.perPage) {
      params.append('per_page', String(opts.perPage))
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
    .then((json: SauceStorageListResponse) => {
      json.items = json.items.map((item) => {
        delete item?.metadata?.icon
        return item
      })

      if (!logVerboseColor(json.items, {
        log: console.log,
        ...opts,
      })) {
        // default is to log the file_id
        json.items.forEach((item) => {
          console.log(item.id)
        })
      }
    })
  })
  .addHelpText('after', `
Examples:

  Get a list of file ids
  $ ${ name(cmd) }

  Get the list of files along with their metadata
  $ ${ name(cmd) } --verbose

  Get only the files with their given id's
  $ ${ name(cmd) } --id 88e3e7b1-690f-409f-ad5d-6519934c0d55 --id 8b52f786-f63b-4328-be34-90a0684bf5ca`)
}

const del = (program: Command): void => {
  const cmd = program.command('delete')
  cmd
  .alias('rm')
  .argument('<fileId>', 'ID of file that needs to be deleted')
  .description('Delete files that are accessible for the requester.')
  .action(async (fileId: string) => {
    const opts = cmd.opts() as StorageCredentialOptions
    // console.log('opts=', opts)
    // console.log('delete: %s, %o', fileId, opts)
    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)

    if (fileId === '*') {
      return fetch(sauceStorageAPI(opts.sauceRegion, 'files'), {
        method: 'GET',
        headers: {
          Authorization: `Basic ${ authorization }`,
          Accept: 'application/json',
        },
      })
      .then((res) => {
        return res.json()
      })
      .then((json: SauceStorageListResponse) => {
        json.items = json.items.map((item) => {
          delete item?.metadata?.icon
          return item
        })

        return json.items.reduce((promise: Promise<void>, item: SauceStorageItem) => {
          return promise.then(() => {
            return fetch(sauceStorageAPI(opts.sauceRegion, `files/${ item.id }`), {
              method: 'DELETE',
              headers: {
                Authorization: `Basic ${ authorization }`,
                Accept: 'application/json',
              },
            })
            .then((res) => {
              return res.json()
            })
            .then((json2: SauceStorageItemResponse) => {
              delete json2?.item?.metadata?.icon

              if (!logVerboseColor(json2, {
                log: console.log,
                ...opts,
              })) {
                // default is to log the file_id
                console.log(json2.item.id)
              }
            })
          })
        }, Promise.resolve())
      })
    }

    const apiUrl = sauceStorageAPI(opts.sauceRegion, `files/${ fileId }`)
    return fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${ authorization }`,
        Accept: 'application/json',
      },
    })
    .then((res) => {
      return res.json()
    })
    .then((json: SauceStorageItemResponse) => {
      delete json?.item?.metadata?.icon

      if (!logVerboseColor(json, {
        log: console.log,
        ...opts,
      })) {
        // default is to log the file_id
        console.log(json.item.id)
      }
    })
  })
  .addHelpText('after', `
Examples:

  To remove all files
  $ ${ name(cmd) } *

  To remove file with id
  $ ${ name(cmd) } 88e3e7b1-690f-409f-ad5d-6519934c0d55`)
}

const edit = (program: Command): void => {
  const cmd = program.command('edit')
  cmd
  .argument('<fileId>', 'ID of file that needs to be edited')
  .addOption(
    new Option(
      '--description <description>',
      'The file description',
    )
    .makeOptionMandatory())
  .description('Edit files that are accessible for the requester.')
  .action(async (fileId: string) => {
    const opts = cmd.opts() as EditFileActionOptions
    // console.log('opts=', opts)
    // console.log('delete: %s, %o', fileId, opts)

    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, `files/${ fileId }`)

    return fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${ authorization }`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        item: {
          description: opts.description,
        }
      })
    })
    .then((res) => {
      return res.json()
    })
    .then((json: SauceStorageItemResponse) => {
      delete json?.item?.metadata?.icon

      if (!logVerboseColor(json, {
        log: console.log,
        ...opts,
      })) {
        // default is to log the file_id
        console.log(json.item.id)
      }
    })
  })
  .addHelpText('after', `
Examples:

  $ ${ name(cmd) } 88e3e7b1-690f-409f-ad5d-6519934c0d55 --description 'this is my new description'`)
}

export const sauceStorageFilesApp = (): void => {
  const program = makeStorageFilesCommand('sauce-storage-files')

  program.parse(process.argv)
  if (!process.argv.slice(2).length) {
    program.help()
  }
}

// Add nested commands using `.addCommand().
// The command could be created separately in another module.
export function makeStorageFilesCommand(name = 'files'): SauceCommand {
  const program = new SauceCommand(name)

  program
  .description('When testing mobile apps, you have the optoin to upload your app to Sauce Labs Application Storage.')
  .addHelpText('after', `
Examples:

  $ ${ program.name() } --help`)

  download(program)
  list(program)
  del(program)
  edit(program)

  return program
}

export default sauceStorageFilesApp
