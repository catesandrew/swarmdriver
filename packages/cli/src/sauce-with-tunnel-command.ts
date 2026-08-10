import { Command, Option, type CommandOptions, type ExecutableCommandOptions } from 'commander'
import SauceCommand from './sauce-command'

const sauceTunnelId = (cmd: Command): Command => {
  // Saucelabs tunnel id. Please set it via environmental variable SAUCE_TUNNEL_ID or pass it with the --sauce-tunnel-id option
  // .requiredOption(
  //   '-t, --sauce-tunnel-id [id]',
  //   'sauce labs tunnel id, must be supplied or SAUCE_TUNNEL_ID defined',
  //   process.env.SAUCE_TUNNEL_ID)
  return cmd.addOption(
    new Option(
      '-t, --sauce-tunnel-id <id>',
      'sauce labs tunnel id, must be supplied or SAUCE_TUNNEL_ID defined',
    ).default(
      process.env.SAUCE_TUNNEL_ID, 'SAUCE_TUNNEL_ID'
    ).makeOptionMandatory())
}

export default class SauceWithTunnelCommand extends SauceCommand {
  command(nameAndArgs: string, actionOptsOrExecDesc?: CommandOptions | string, execOpts?: ExecutableCommandOptions): Command {
    const cmd = super.command(nameAndArgs, actionOptsOrExecDesc as string, execOpts)

    sauceTunnelId(cmd)
    return cmd
  }
}
