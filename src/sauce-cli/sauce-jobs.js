import SauceCommand from './sauce-command'
import {
  listCommand,
  infoCommand,
  editCommand,
} from './jobs'

export const sauceJobsApp = ({
  version = '1.0.0',
  ...params
} = {}) => {
  const program = makeJobsCommand('sauce-jobs')

  program.version(version)
  program.parse(process.argv)
  if (!process.argv.slice(2).length) {
    program.help()
  }
}

// Add nested commands using `.addCommand().
// The command could be created separately in another module.
export function makeJobsCommand(name = 'jobs') {
  const program = new SauceCommand(name).alias('j')

  program
  .description('The Jobs commands allow you to review and edit the metadata associated with the tests you are running on Sauce Labs. You can also stop tests, delete jobs, and filter lists of jobs by a variety of attributes, such as owner, time period, build, or environment.')
  .addHelpText('after', `
Examples:

  $ ${ program.name() } --help`)

  listCommand(program)
  infoCommand(program)
  editCommand(program)

  return program
}

export default sauceJobsApp
