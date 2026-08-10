import fetch from 'node-fetch'
import { promisify } from 'util'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import type { Command } from 'commander'
import {
  logVerboseColor,
  sauceAuthorization,
  sauceStorageAPI,
} from '../utils'
import type { StorageCredentialOptions, SauceStorageItemResponse } from './types'

interface UploadActionOptions extends StorageCredentialOptions {
  name?: string
  description?: string
}

export const upload = (program: Command): void => {
  const cmd = program.command('upload')
  cmd
  .argument('<route>', 'route to the file to be uploaded')
  .option('--description [description]', 'An optional custom file description')
  .option('--name [name]', 'The file name (if unset then will be retrieved from `content-disposition` header)')
  .description('Upload your mobile file to Sauce Storage')
  .action(async (route: string) => {
    const opts = cmd.opts() as UploadActionOptions
    // console.log('opts=', opts)
    // console.log('upload: %s, %o', route, opts)

    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, 'upload')
    const form = new FormData()
    const filename = route.startsWith('/') ?
      route :
      path.join(process.cwd(), route)

    const readStream = fs.createReadStream(filename)
    const stats = fs.statSync(filename)
    form.append('payload', readStream, {
      filename: path.basename(route),
      knownLength: stats.size,
    })

    if (opts.name) {
      form.append('name', opts.name)
    }

    if (opts.description) {
      form.append('description', opts.description)
    }

    const contentLength = await promisify(form.getLength.bind(form))()

    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${ authorization }`,
        'Content-length': String(contentLength),
        // Special case for https://github.com/form-data/form-data
        'Content-Type': `multipart/form-data; boundary=${ form.getBoundary() }`,
        Accept: 'application/json',
      },
      body: form,
    })
    .then((res) => {
      return res.json()
    })
    .then((json: SauceStorageItemResponse) => {
      delete json.item.metadata!.icon

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

  By default we output only the file_id which can be reused
  $ ${ program.name() } ${ cmd.name() } ./build/hmmaLocal.ipa

  Add --verbose to get a full output in json
  $ ${ program.name() } ${ cmd.name() } --verbose ./build/hmmaLocal.ipa

  Add --verbose and --color to get a full output in json with ANSI colors
  $ ${ program.name() } ${ cmd.name() } --verbose --color ./build/hmmaLocal.ipa

  Prefer YAML? Then add --output=yaml to get a full yaml output
  $ ${ program.name() } ${ cmd.name() } --verbose --output=yaml ./build/hmmaLocal.ipa`)
}

// NOTE: Each instance of an uploaded application generates a unique
// identification number. If you're not sure of the file_id number, you can use
// the files management endpoints to find the desired key.

// {
//   item: {
//     id: '42cf1809-0432-4418-800d-1cf6b26d4abd',
//     owner: {
//       id: '201f4efb35d54859b804549b1b7da59d',
//       org_id: '097f96c200264da0a7babd5d055533a8'
//     },
//     name: 'hmmaLocal.ipa',
//     upload_timestamp: 1628139224,
//     etag: '34a4257952d6e3c27fb4906dd6ab1740',
//     kind: 'ios',
//     group_id: 810592,
//     description: null,
//     metadata: {
//       identifier: 'com.example.mobileapp.local',
//       name: 'exampleAppLocal',
//       version: '2',
//       is_test_runner: false,
//       short_version: '1.0',
//       is_simulator: false,
//       min_os: '14.3',
//       target_os: '14.5',
//       test_runner_plugin_path: null
//     },
//     access: {
//       team_ids: [
//         '42c829f88fb6473780b27af195370d26',
//       ],
//       org_ids: [],
//     }
//   }
// }

export default upload
