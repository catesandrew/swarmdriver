import fetch from 'node-fetch'
import { Option } from 'commander'
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

const list = (program) => {
  const cmd = program.command('list')
  cmd
  .alias('ls')
  .description('List group listed on Sauce Storage.')
  .option('--id <value>', 'One or more group ids to be listed', collectValidator, [])
  .option('--query <value>', 'The search term. The lookup is done using version names, codes, app names, identifiers and group names')
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
    const opts = cmd.opts()
    // console.log('opts=', opts)
    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, 'groups')

    const url = new URL(apiUrl)
    const params = url.searchParams
    opts.id.forEach((id) => {
      params.append('group_id', id)
    })

    opts.kind.forEach((id) => {
      params.append('kind', id)
    })

    if (opts.query) {
      params.append('q', opts.query)
    }

    if (opts.page) {
      params.append('page', opts.page)
    }

    if (opts.perPage) {
      params.append('per_page', opts.perPage)
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
      json.items = json.items.map((item) => {
        delete item?.recent?.metadata?.icon
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

      return true
    })
  })
  .addHelpText('after', `
Examples:

  Get a list of group ids
  $ ${ name(cmd) }

  Get the list of groups along with their metadata
  $ ${ name(cmd) } --verbose

  Get only the files with their given id's
  $ ${ name(cmd) } --id 504739 --id 810592 --verbose`)
}

const del = (program) => {
  const cmd = program.command('delete')
  cmd
  .alias('rm')
  .argument('<groupId>', 'ID of group that needs to be deleted')
  .description('Delete groups that are accessible for the requester.')
  .action(async (groupId) => {
    const opts = cmd.opts()
    // console.log('opts=', opts)
    // console.log('delete: %s, %o', fileId, opts)

    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, `groups/${ groupId }`)

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
    .then((json) => {
      delete json?.item?.metadata?.icon

      if (!logVerboseColor(json, {
        log: console.log,
        ...opts,
      })) {
        // default is to log the file_id
        console.log(json.item.id)
      }

      return true
    })
  })
  .addHelpText('after', `
Examples:

  $ ${ name(cmd) } 88e3e7b1-690f-409f-ad5d-6519934c0d55`)
}

const settings = (program) => {
  const cmd = program.command('settings')
  cmd
  .description('Retrieve settings from an accessible and existing group')
  .argument('<groupId>', 'ID of group whose settings need to be fetched')
  .action(async (groupId) => {
    const opts = cmd.opts()
    // console.log('opts=', opts)
    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, `groups/${ groupId }/settings`)

    const url = new URL(apiUrl)

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
      if (!logVerboseColor(json, {
        log: console.log,
        ...opts,
      })) {
        console.log(json.identifier)
      }

      return true
    })
  })
  .addHelpText('after', `
Examples:

  Get a list of group ids
  $ ${ name(cmd) }

  Get the list of groups along with their metadata
  $ ${ name(cmd) } --verbose

  Get only the files with their given id's
  $ ${ name(cmd) } --id 504739 --id 810592 --verbose`)
}

const edit = (program) => {
  const cmd = program.command('edit')
  cmd
  .argument('<groupId>', 'ID of group whose settings need to be fetched')
  .description('Edit files that are accessible for the requester.')
  .action(async (groupId) => {
    const opts = cmd.opts()
    // console.log('opts=', opts)
    // console.log('delete: %s, %o', fileId, opts)

    const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
    const apiUrl = sauceStorageAPI(opts.sauceRegion, `groups/${ groupId }/settings`)

    // TODO needs to be implemented
    return fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${ authorization }`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
      })
    })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      delete json?.item?.metadata?.icon

      if (!logVerboseColor(json, {
        log: console.log,
        ...opts,
      })) {
        // default is to log the file_id
        console.log(json.item.id)
      }

      return true
    })
  })
  .addHelpText('after', `
Examples:

  $ ${ name(cmd) } 88e3e7b1-690f-409f-ad5d-6519934c0d55 --description 'this is my new description'`)
}

export const sauceStorageGroupsApp = () => {
  const program = makeStorageGroupsCommand('sauce-storage-groups')

  program.parse(process.argv)
  if (!process.argv.slice(2).length) {
    program.help()
  }
}

// Add nested commands using `.addCommand().
// The command could be created separately in another module.
export function makeStorageGroupsCommand(name = 'groups') {
  const program = new SauceCommand(name)

  program
  .description('When testing mobile apps, you have the optoin to upload your app to Sauce Labs Application Storage.')
  .addHelpText('after', `
Examples:

  $ ${ program.name() } --help`)

  list(program)
  del(program)
  settings(program)
  edit(program)

  return program
}

export default sauceStorageGroupsApp
