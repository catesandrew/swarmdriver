import SauceCommand from './sauce-command'
import {
  upload,
  info,
  makeStorageFilesCommand,
  makeStorageGroupsCommand,
  download,
} from './storage'

export interface SauceStorageAppOptions {
  version?: string
  name?: string
  [key: string]: unknown
}

export const sauceStorageApp = ({
  version = '1.0.0',
  ..._params
}: SauceStorageAppOptions = {}): void => {
  const program = makeStorageCommand('sauce-storage')
  program.version(version)

  program.parse(process.argv)
  if (!process.argv.slice(2).length) {
    program.help()
  }
}

// Add nested commands using `.addCommand().
// The command could be created separately in another module.
export function makeStorageCommand(name = 'storage'): SauceCommand {
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
