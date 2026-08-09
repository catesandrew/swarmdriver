import SauceWithTunnelCommand from './sauce-with-tunnel-command'
import { makeStorageCommand } from './sauce-storage'
import { makeJobsCommand } from './sauce-jobs'
// import registerRejectionHandler from './rejection-handler' registerRejectionHandler()

export const sauceApp = ({
  version = '1.0.0',
  ...params
} = {}) => {
  const program = new SauceWithTunnelCommand('sauce')
  program
  .version(version)
  .enablePositionalOptions()
  .passThroughOptions()
  .description('CLI for Sauce Labs REST APIs')

  program.addHelpText('after', `
Examples:

  $ ${ program.name() } --help`)

  program.addCommand(makeStorageCommand())
  program.addCommand(makeJobsCommand())

  program.parse(process.argv)
  if (!process.argv.slice(2).length) {
    program.help()
  }
}

export default sauceApp
