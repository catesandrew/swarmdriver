import SauceCommand from './sauce-command'
import {
  upload,
  info,
  makeStorageFilesCommand,
  makeStorageGroupsCommand,
  download,
} from './storage'

export const sauceStorageApp = ({
  version = '1.0.0',
  ...params
} = {}) => {
  const program = makeStorageCommand('sauce-storage')
  program.version(version)

  program.parse(process.argv)
  if (!process.argv.slice(2).length) {
    program.help()
  }
}

// Add nested commands using `.addCommand().
// The command could be created separately in another module.
export function makeStorageCommand(name = 'storage') {
  const program = new SauceCommand(name).alias('s')

  program
  .description('When testing mobile apps, you have the optoin to upload your app to Sauce Labs Application Storage.')
  .addHelpText('after', `
Examples:

  $ ${ program.name() } --help`)

  upload(program)
  download(program)
  info(program)

  program.addCommand(makeStorageFilesCommand())
  program.addCommand(makeStorageGroupsCommand())

  return program
}

export default sauceStorageApp
