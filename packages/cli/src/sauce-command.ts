// import yn from 'yn'
import { Command, Option, type CommandOptions, type ExecutableCommandOptions } from 'commander'

const sauceUser = (cmd: Command): Command => {
  // Saucelabs user not set. Please set it via environmental variable SAUCE_USERNAME or pass it with the --sauce-username optional
  // .requiredOption(
  //   '-u, --sauce-username <username>',
  //   'sauce labs username, must be supplied or SAUCE_USERNAME defined',
  //   process.env.SAUCE_USERNAME)
  return cmd.addOption(
    new Option(
      '-u, --sauce-username <username>',
      'Your Sauce Labs username, must be supplied or SAUCE_USERNAME defined',
    ).default(
      process.env.SAUCE_USERNAME, 'SAUCE_USERNAME'
    ).makeOptionMandatory())
}

const sauceAccessKey = (cmd: Command): Command => {
  // Saucelabs access key. Please set it via environmental variable SAUCE_ACCESS_KEY or pass it with the --sauce-access-key option
  // .requiredOption(
  //   '-k, --sauce-access-key <key>',
  //   'must be supplied or SAUCE_ACCESS_KEY defined',
  //   process.env.AUCE_ACCESS_KEY)
  return cmd.addOption(
    new Option(
      '-k, --sauce-access-key <key>',
      'Your Sauce Labs access key, must be supplied or SAUCE_ACCESS_KEY defined',
    ).default(
      process.env.SAUCE_ACCESS_KEY, 'SAUCE_ACCESS_KEY'
    ).makeOptionMandatory())
}

const sauceRegion = (cmd: Command): Command => {
  return cmd.addOption(
    new Option(
      '--sauce-region <region>',
      'Your Sauce Labs datacenter region',
    )
    .choices([
      'us-west-1',
      'us-east-1',
      'eu-central-1',
    ])
    .default(
      'us-west-1'
    ).makeOptionMandatory())
}

export default class SauceCommand extends Command {
  // commander's own `Command#command()` overloads return a polymorphic
  // `ReturnType<this['createCommand']>` / `this`, which TS cannot verify a
  // concrete `Command`-returning override against (a known commander +
  // TS limitation, not a real type-safety gap here — `createCommand` is
  // never overridden, so the runtime return is always a `Command`).
  // @ts-expect-error TS2416 — see comment above.
  command(nameAndArgs: string, actionOptsOrExecDesc?: CommandOptions | string, execOpts?: ExecutableCommandOptions): Command {
    const cmd = super.command(nameAndArgs, actionOptsOrExecDesc as string, execOpts)

    cmd
    .option('--color', 'adds color', false)
    // .option('-m, --monitor', 'Monitor build process', !!yn(process.env.MONITOR))
    .option('--verbose', 'verbose output', false)
    .option('--silent', 'disable output', false)
    .addOption(
      new Option(
        '--output <value>',
        'choose an output format'
      ).choices([
        'json',
        'yaml',
      ])
      .default(
        'json',
      ))

    // .option('-T, --trace', 'display trace statements for commands')
    // .hook('preAction', (thisCommand, actionCommand) => {
    //   if (thisCommand.opts().trace) {
    //     console.log('>>>>')
    //     console.log(`About to call action handler for subcommand: ${ actionCommand.name() }`)
    //     console.log('arguments: %O', actionCommand.args)
    //     console.log('options: %o', actionCommand.opts())
    //     console.log('<<<<')
    //   }
    // })
    // .hook('postAction', (thisCommand, actionCommand) => {
    //   console.log('actionCommand=', actionCommand)
    // })

    // .addArgument(
    //   new Argument(
    //     '<drink-size>',
    //     'drink cup size'
    //   ).choices([
    //     'small',
    //     'medium',
    //     'large',
    //   ]))

    // .addArgument(
    //   new Argument(
    //     '[timeout]',
    //     'timeout in seconds'
    //   ).default(
    //     60,
    //     'one minute'
    //   ))

    // .addOption(
    //   new Option(
    //     '-s, --size <value>',
    //     'choose a size'
    //   ).choices([
    //     'big',
    //     'little',
    //   ]).makeOptionMandatory())

    // .showHelpAfterError('(add --help for additional information)')
    cmd.on('option:*', (operands: string[]) => {
      console.error(`error: unknown command '${ operands[0] }'`)
      // const availableCommands = program.commands.map(cmd => cmd.name())
      // mySuggestBestMatch(operands[0], availableCommands)
      // process.exitCode = 1
    })
    // cmd.on('option:verbose', () => {
    //   process.env.VERBOSE = this.opts().verbose
    // })

    sauceAccessKey(cmd)
    sauceUser(cmd)
    sauceRegion(cmd)
    return cmd
  }
}
